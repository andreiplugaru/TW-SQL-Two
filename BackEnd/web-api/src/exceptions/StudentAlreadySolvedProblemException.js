const HttpException = require('./HttpException.js');
class StudentAlreadySolvedProblemException extends HttpException {
    constructor() {
        super(`This student already solved this problem`, "StudentAlreadySolvedProblemException", 400);
    }
}

module.exports = StudentAlreadySolvedProblemException;