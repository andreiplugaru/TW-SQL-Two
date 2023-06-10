const db = require('../database/Connection.js')
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
        let query = `SELECT * FROM ` + TABLE_NAME + ` WHERE ID_STUDENT = :id_student`
        let bindParams = {
            id_student: studentId
        }
        const result = await db.executeQuery(query, bindParams)
        return result
    }
}

module.exports = SolvedProblemRepository