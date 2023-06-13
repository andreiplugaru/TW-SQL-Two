const db = require('../database/Connection.js')
const {selectByIdFromTable} = require("../database/Connection");
const StudentExceededLimitException = require("../exceptions/StudentExceededLimitException.js");
const StudentNotFoundException = require("../exceptions/StudentNotFoundException");

const TABLE_NAME = 'problems'

class ProblemRepository{
    async findById(id){
        const query = `SELECT problems.id as ID, REQUIREMENT, problem_categories.NAME AS CATEGORY FROM problems JOIN problem_categories ON problem_categories.id = problems.id_category WHERE problems.id = :id`
        let bindParams = {
            id: id
        }
        const result = await db.executeQuery(query, bindParams)
        return result
    }

    async findNextProblem(studentId){
        const query = `SELECT problema_urmatoare(${studentId}) FROM DUAL`;
        const result = await db.executeQuery(query, { })
        if(result === `-20001`){
            throw new StudentExceededLimitException(studentId)
        }
        else if(result === `-20004`){
            throw new StudentNotFoundException(studentId)
        }
        return result
    }
}

module.exports = ProblemRepository;