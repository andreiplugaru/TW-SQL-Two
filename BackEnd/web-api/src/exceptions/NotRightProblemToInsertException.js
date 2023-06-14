const HttpException = require('./HttpException.js');

class NotRightProblemToInsertException extends HttpException {
    constructor(problemId, studentId) {
        super(`Student ${studentId} should not solve problem ${problemId}`, "NotRightProblemToInsertException", 400);
    }
}

module.exports = NotRightProblemToInsertException;