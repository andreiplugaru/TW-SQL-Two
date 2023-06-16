const db = require('../database/Connection.js')
const studentDb = require('../database/StudentConnection.js')
const StudentAlreadySolvedProblemException = require('../exceptions/StudentAlreadySolvedProblemException.js')
const NotRightProblemToInsertException = require('../exceptions/NotRightProblemToInsertException.js')
const StudentExceededLimitException = require("../exceptions/StudentExceededLimitException.js");
const StudentNotFoundException = require("../exceptions/StudentNotFoundException.js")
const TABLE_NAME = 'solved_problems'

class SolvedProblemRepository {
    constructor() {
    }

    async findAll() {
        const result = await db.selectAllFromTable(TABLE_NAME)
        return result
    }

    async save(solvedProblem) {
        let query = `BEGIN insereaza_pb_rezolvata( :id_student, :id_problem); END;`
        let bindParams = {
            id_student: solvedProblem.idStudent,
            id_problem: solvedProblem.idProblem
        }
        const result = await db.insertInTable(query, bindParams)
        if (result === `-20002`) {
            throw new StudentAlreadySolvedProblemException();
        }
        else if(result === `-20003`){
            throw new NotRightProblemToInsertException(solvedProblem.idProblem, solvedProblem.idStudent)
        }
       else if(result === `-20001`){
            throw new StudentExceededLimitException(solvedProblem.idStudent)
        }
        else if(result === `-20004`){
            throw new StudentNotFoundException(solvedProblem.idStudent)
        }
        return result
    }

    async findSolvedProblemsByStudentId(studentId) {
        //TODO: remove ununsed columns
        let query = `SELECT * FROM ` + TABLE_NAME + ` JOIN PROBLEMS ON PROBLEMS.ID = ` + TABLE_NAME + `.ID_PROBLEM WHERE ID_STUDENT = :id_student `
        let bindParams = {
            id_student: studentId
        }
        const result = await db.executeQuery(query, bindParams)
        return result
    }

    async checkIfProblemIsCorrect(correctSolution, studentSolution) {
        let query = `SELECT verificare_solutie(:correct_solution, :student_solution) AS RESULT FROM DUAL`
        let bindParams = {
            correct_solution: correctSolution,
            student_solution: studentSolution
        }
        const result = await studentDb.executeQuery(query, bindParams)
        return result
    }

    async checkIfProblemIsSolved(studentId,problemId) {
        let query = `SELECT * FROM ` + TABLE_NAME + ` WHERE ID_STUDENT = :id_student AND ID_PROBLEM = :id_problem`
        let bindParams = {
            id_student: studentId,
            id_problem: problemId
        }
        const result = await db.executeQuery(query, bindParams)
        return result.length > 0
    }

    async findProblemInfo(studentId) {
        let query = `SELECT * FROM ` + TABLE_NAME + ` JOIN PROBLEMS ON PROBLEMS.ID = ` + TABLE_NAME + `.ID_PROBLEM WHERE ID_STUDENT = :id_student `
        let bindParams = {
            id_student: studentId
        }
        const result = await db.executeQuery(query, bindParams)
        return result
    }
}

module.exports = SolvedProblemRepository