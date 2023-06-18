const db = require('../database/Connection.js')
const StudentExceededLimitException = require("../exceptions/StudentExceededLimitException.js");
const StudentNotFoundException = require("../exceptions/StudentNotFoundException");
const oracledb = require('oracledb');

const TABLE_NAME = 'problems'

class ProblemRepository {
    async findById(id) {
        const query = `SELECT ` + TABLE_NAME + `.id as ID, REQUIREMENT, SOLUTION, problem_categories.NAME AS CATEGORY FROM ` + TABLE_NAME + ` JOIN problem_categories ON problem_categories.id = ` + TABLE_NAME + `.id_category WHERE ` + TABLE_NAME + `.id = :id`
        let bindParams = {
            id: id
        }
        const result = await db.executeQuery(query, bindParams)
        return result
    }

    async findNextProblem(studentId) {
        const query = `DECLARE problem_id number; BEGIN :problem_id := problema_urmatoare(${studentId});  END;`;
        const result = await db.executeQueryWithOutVar(query, {
            problem_id: {
                dir: oracledb.BIND_OUT,
                type: oracledb.STRING
            }
        })
        if (result === `-20001`) {
            throw new StudentExceededLimitException(studentId)
        } else if (result === `20004`) {
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

    async findMarkedDifficultyProblemsByStudentId(studentId) {
        const query = `SELECT * FROM marked_problems JOIN PROBLEMS ON PROBLEMS.ID = marked_problems.ID_PROBLEM WHERE id_student = :id_student`
        let bindParams = {
            id_student: studentId
        }
        const result = await db.executeQuery(query, bindParams)
        return result
    }

    async findProposedProblemsByStudentId(studentId) {
        const query = `SELECT * FROM added_problems JOIN PROBLEMS ON PROBLEMS.ID = added_problems.ID_PROBLEM WHERE id_user = :id_student`
        let bindParams = {
            id_student: studentId
        }
        const result = await db.executeQuery(query, bindParams)
        return result
    }

    async save(problem) {
        const query = `INSERT INTO ` + TABLE_NAME + ` (REQUIREMENT, SOLUTION, ID_CATEGORY) VALUES (:requirement, :solution, :id_category)`
        let bindParams = {
            requirement: problem.requirement,
            solution: problem.solution,
            id_category: problem.category
        }
        const rowId = await db.insertInTable(query, bindParams)
        return await this.findByRowId(rowId)
    }

    async findByRowId(rowId) {
        let query = `SELECT * FROM ` + TABLE_NAME + ` t WHERE t.rowid = :problemrowid`
        let bindParams = {
            problemrowid: rowId
        }
        const result = await db.executeQuery(query, bindParams)
        return result
    }

    async saveToAdded(problemId, studentId) {
        const query = `INSERT INTO ADDED_PROBLEMS (ID_USER, ID_PROBLEM, AT_TIME) VALUES (:id_user, :id_problem, CURRENT_DATE)`
        let bindParams = {
            id_user: studentId,
            id_problem: problemId
        }
        const result = await db.insertInTable(query, bindParams)
        return result
    }

    async saveToAttempts(problemId, studentId) {
        const query = `INSERT INTO ATTEMPTS (ID_STUDENT, ID_PROBLEM) VALUES (:id_student, :id_problem)`
        let bindParams = {
            id_student: studentId,
            id_problem: problemId
        }
        return await db.insertInTable(query, bindParams)
    }

    async checkIfProblemIsProposed(problemId, studentId) {
        const query = `SELECT * FROM added_problems WHERE id_user = :id_student AND id_problem = :id_problem`
        let bindParams = {
            id_student: studentId,
            id_problem: problemId
        }
        const result = await db.executeQuery(query, bindParams)
        return result.length > 0
    }

    async checkIfProblemIsMarked(problemId, studentId) {
        const query = `SELECT * FROM marked_problems WHERE id_student = :id_student AND id_problem = :id_problem`
        let bindParams = {
            id_student: studentId,
            id_problem: problemId
        }
        const result = await db.executeQuery(query, bindParams)
        return result.length > 0

    }

    async getStatisticsAboutProposedProblems(studentId) {
        const query = `SELECT  a_p.id_problem, p.REQUIREMENT AS REQUIREMENT, COUNT(a.id) AS ATTEMPTS, COUNT(s_p.at_time) AS SOLVED FROM added_problems a_p LEFT JOIN problems p ON p.id = a_p.id_problem 
LEFT JOIN solved_problems s_p ON s_p.id_problem = a_p.id_problem 
LEFT JOIN  attempts a ON a.id_problem = a_p.id_problem
WHERE a_p.id_user = :id_user group by a_p.id_problem, p.REQUIREMENT`
        let bindParams = {
            id_user: studentId
        }
        return await db.executeQuery(query, bindParams)
    }

    async getAllProblems() {
        const query = `SELECT p.ID as ID, REQUIREMENT, p_c.NAME as CATEGORY  FROM problems p JOIN problem_categories p_c ON p.id_category = p_c.id`
        return await db.executeQuery(query, {})
    }

    async getWrongProblems() {
        const query = `SELECT PROBLEMS.ID AS ID, PROBLEMS.REQUIREMENT AS REQUIREMENT FROM wrong_problems JOIN PROBLEMS ON PROBLEMS.ID = wrong_problems.ID_PROBLEM`
        return await db.executeQuery(query, {})
    }

    async deleteById(problemId) {
        const query = `DELETE FROM problems WHERE id = :id_problem`
        let bindParams = {
            id_problem: problemId
        }
        return await db.insertInTable(query, bindParams)
    }

    async rejectWrongProblem(problemId) {
        const query = `DELETE FROM wrong_problems WHERE id_problem = :id_problem`
        let bindParams = {
            id_problem: problemId
        }
        return await db.insertInTable(query, bindParams)
    }

    async getWrongProblemById(problemId) {
        const query = `SELECT * FROM wrong_problems WHERE id_problem = :id_problem`
        let bindParams = {
            id_problem: problemId
        }
        return await db.executeQuery(query, bindParams)
    }

    async saveProblems(problems) {
        const query = `INSERT INTO ` + TABLE_NAME + ` (REQUIREMENT, SOLUTION, ID_CATEGORY) VALUES (:requirement, :solution, :id_category)`
        let bindParams = []
        const binds = [
            {a: 1, b: "One"},
            {a: 2, b: "Two"},
            {a: 3, b: "Three"}
        ];
        for (let i = 0; i < problems.length; i++) {
            let param = {}
            param[`requirement`] = problems[i].requirement
            param[`solution`] = problems[i].solution
            param[`id_category`] = problems[i].category
            bindParams[i] = param
        }
        // query = query.substring(0, query.length - 1)
        return await db.insertManyInTable(query, bindParams)
    }

    async findAllInfo() {
        const query = `SELECT p.ID AS ID, p.REQUIREMENT AS REQUIREMENT, count(s_p.id_student) AS SOLVED, count(a.id) AS ATTEMPTS FROM problems p JOIN solved_problems s_p ON s_p.id_problem = p.id JOIN users ON users.id = s_p.id_student join attempts a on a.id_problem = p.id group by p.REQUIREMENT, p.ID `
        return await db.executeQuery(query, {})
    }

    async getNumberOfWrongProblemsMarkedByStudent(studentId) {
        const query = `SELECT COUNT(*) AS NUMBER_OF_WRONG_PROBLEMS FROM wrong_problems WHERE id_student = :id_student`
        let bindParams = {
            id_student: studentId
        }
        return await db.executeQuery(query, bindParams)
    }
    async getInterestingProblems(categoryId, count) {
        const query = `select * from( SELECT c.id_problem AS ID FROM comments c where c.id_problem in (select id from problems where id_category = :id_category) GROUP BY c.id_problem ORDER BY COUNT(c.id_student) DESC) where ROWNUM <= :count`
        let bindParams = {
            id_category: categoryId,
            count: count
        }
        return await db.executeQuery(query, bindParams)
    }
    async getInterestingProblemsInfo(problemIds) {
        let bindParams = {}
        let query = `SELECT p.id as ID, p.requirement AS REQUIREMENT, c.message AS MESSAGE, u.username AS USERNAME FROM problems p JOIN comments c ON c.id_problem = p.id JOIN users u ON u.id = c.id_student WHERE p.id IN (`
        for (let i = 0; i < problemIds.length; i++) {
            query += `:id_` + i + `,`
            bindParams[`id_` + i] = problemIds[i].ID
        }
        query = query.substring(0, query.length - 1)
        query += `)`
        return await db.executeQuery(query, bindParams)
    }
}

module.exports = ProblemRepository;