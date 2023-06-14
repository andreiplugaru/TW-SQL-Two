const db = require('../database/Connection.js')
const StudentExceededLimitException = require("../exceptions/StudentExceededLimitException.js");
const StudentNotFoundException = require("../exceptions/StudentNotFoundException");
const oracledb = require('oracledb');

const TABLE_NAME = 'problems'

class ProblemRepository {
    async findById(id) {
        const query = `SELECT ` + TABLE_NAME + `.id as ID, REQUIREMENT, problem_categories.NAME AS CATEGORY FROM ` + TABLE_NAME + ` JOIN problem_categories ON problem_categories.id = ` + TABLE_NAME + `.id_category WHERE ` + TABLE_NAME + `.id = :id`
        let bindParams = {
            id: id
        }
        const result = await db.executeQuery(query, bindParams)
        return result
    }

    async findNextProblem(studentId) {
        const query = `DECLARE problem_id number; BEGIN :problem_id := problema_urmatoare(${studentId});  END;`;
        const result = await db.executeQueryWithOutVar(query, { problem_id: {dir: oracledb.BIND_OUT,type: oracledb.STRING} })
        if (result === `-20001`) {
            throw new StudentExceededLimitException(studentId)
        } else if (result === `-20004`) {
            throw new StudentNotFoundException(studentId)
        }
        return result
    }

    async markProblemAsWrong(studentId, problemId) {
        const query = `INSERT INTO wrong_problems (ID_STUDENT, ID_PROBLEM) VALUES (:id_student, :id_problem)`
        let bindParams = {
            id_student: studentId,
            id_problem: problemId
        }
        const result = await db.insertInTable(query, bindParams)
    }

    async checkIfProblemIsMarkedAsWrong(studentId, problemId) {
        const query = `SELECT * FROM wrong_problems WHERE id_student = :id_student AND id_problem = :id_problem`
        let bindParams = {
            id_student: studentId,
            id_problem: problemId
        }
        const result = await db.executeQuery(query, bindParams)
        return result
    }

    async markProblemDifficulty(studentId, problemId, difficulty) {
        const query = `INSERT INTO marked_problems (ID_STUDENT, ID_PROBLEM, ID_DIFFICULTY) VALUES (:id_student, :id_problem, :difficulty)`
        let bindParams = {
            id_student: studentId,
            id_problem: problemId,
            difficulty: difficulty
        }
        const result = await db.insertInTable(query, bindParams)
    }
}

module.exports = ProblemRepository;