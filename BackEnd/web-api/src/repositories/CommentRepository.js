const db = require('../database/Connection.js')
const Comment = require('../entities/Comment.js')

class CommentRepository {
    async findAllByProblemId(problemId) {
        let query = `SELECT * FROM COMMENTS JOIN USERS ON USERS.ID = COMMENTS.ID_STUDENT WHERE ID_PROBLEM = :problemId ORDER BY ADDED_DATE DESC`
        let bindParams = {
            problemId: problemId
        }
        let result = await db.executeQuery(query, bindParams)
        result = result.map(comment => new Comment(comment.ID, comment.USERNAME, comment.MESSAGE, comment.ADDED_DATE, comment.ID_PROBLEM))
        return result
    }

    async create(comment) {
        let query = `INSERT INTO COMMENTS (ID_STUDENT, MESSAGE, ID_PROBLEM, ADDED_DATE) VALUES (:id_student, :message, :id_problem, :added_date)`
        let bindParams = {
            id_student: comment.student,
            message: comment.message,
            id_problem: comment.problemId,
            added_date: comment.date
        }
        await db.insertInTable(query, bindParams)
    }
}

module.exports = CommentRepository;