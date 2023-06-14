const db = require("../database/Connection");
const TABLE_NAME = 'problem_difficulties'

class DifficultyRepository {
    async findByName(name) {
        const query = `SELECT * FROM ` + TABLE_NAME + ` WHERE NAME = :name`
        let bindParams = {
            name: name
        }
        const result = await db.executeQuery(query, bindParams)
        return result
    }
}

module.exports = DifficultyRepository;