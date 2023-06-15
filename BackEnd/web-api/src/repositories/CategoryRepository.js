const db = require('../database/Connection.js')

class CategoryRepository {
    async findByName(name) {
        let query = `SELECT * FROM PROBLEM_CATEGORIES WHERE NAME = :name`
        let bindParams = {
            name: name
        }
        let result = await db.executeQuery(query, bindParams)
        return result
    }

    async findAll() {
        let query = `SELECT * FROM PROBLEM_CATEGORIES`
        let result = await db.executeQuery(query, {})
        return result
    }
}

module.exports = CategoryRepository;
