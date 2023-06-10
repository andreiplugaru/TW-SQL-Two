const db = require('../database/Connection.js')
const {selectByIdFromTable} = require("../database/Connection");
const StudentExceededLimitException = require("../exceptions/StudentExceededLimitException.js");
const StudentNotFoundException = require("../exceptions/StudentNotFoundException");

class ProblemRepository{
    async findById(id){
        const result = await db.selectByIdFromTable('problems', id)
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