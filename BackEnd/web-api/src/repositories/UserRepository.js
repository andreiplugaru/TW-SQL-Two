const db = require('../database/Connection.js')
const UsernameTakenException = require('../exceptions/UsernameTakenException.js')
const EmailTakenException = require('../exceptions/EmailTakenException.js')
TABLE_NAME = 'USERS'

class UserRepository {
    async findByUsername(username) {
        let query = `SELECT * FROM ` + TABLE_NAME + ` WHERE USERNAME = :username`
        let bindParams = {
            username: username
        }
        const result = await db.executeQuery(query, bindParams)
        result[0].ROLE = await this.getRole(result[0].ID)
        return result
    }

    async getRole(userId) {
        let query = `SELECT * FROM students WHERE ID_USER = :id_user`
        let bindParams = {
            id_user: userId
        }
        const result = await db.executeQuery(query, bindParams)
        if (result.length > 0) {
            return 'STUDENT'
        }
        return 'ADMIN'
    }

    async findById(id) {
        let query = `SELECT * FROM ` + TABLE_NAME + ` WHERE ID = :id`
        let bindParams = {
            id: id
        }
        const result = await db.executeQuery(query, bindParams)
        return result
    }

    async createUser(studentRegisterDto) {
        await this.checkIfUsernameExists(studentRegisterDto)
        await this.checkIfEmailExists(studentRegisterDto)
        let query = `INSERT INTO ` + TABLE_NAME + ` (email, password, firstname, lastname, username) VALUES(:email, :password, :firstname, :lastname, :username)`
        return await db.insertInTable(query, studentRegisterDto)
    }

    async checkIfUsernameExists(studentRegisterDto) {
        let query = `SELECT * FROM ` + TABLE_NAME + ` WHERE USERNAME = :username`
        let bindParams = {
            username: studentRegisterDto.username,
        }
        const result = await db.executeQuery(query, bindParams)
        if (result.length > 0) {
            throw new UsernameTakenException(studentRegisterDto.username)
        }
    }

    async checkIfEmailExists(studentRegisterDto) {
        let query = `SELECT * FROM ` + TABLE_NAME + ` WHERE EMAIL = :email`
        let bindParams = {
            email: studentRegisterDto.email,
        }
        const result = await db.executeQuery(query, bindParams)
        if (result.length > 0) {
            throw new EmailTakenException(studentRegisterDto.email);
        }
    }

    async getByRowId(rowId) {
        let query = `SELECT * FROM ` + TABLE_NAME + ` t WHERE t.rowid = :userrowid`
        let bindParams = {
            userrowid: rowId
        }
        const result = await db.executeQuery(query, bindParams)
        return result
    }

    async test() {
        return
    }
}

module.exports = UserRepository;