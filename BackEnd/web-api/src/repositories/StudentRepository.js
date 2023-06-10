const db = require('../database/Connection.js')


const TABLE_NAME = 'students'

class StudentRepository {
    constructor() {
    }

    async findAll() {
        const result = await db.selectAllFromTable(TABLE_NAME)
        return result
    }

    async findById(id) {
        const query = `SELECT * FROM ` + TABLE_NAME + ` WHERE id_user = :id_user`
        let bindParams = {
            id_user: id
        }
        const result = await db.executeQuery(query, bindParams)
        return result
    }
}

module.exports = StudentRepository