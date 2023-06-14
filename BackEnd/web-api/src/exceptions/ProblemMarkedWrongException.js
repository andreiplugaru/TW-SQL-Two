const HttpException = require('./HttpException.js');
class ProblemMarkedWrongException extends HttpException {
    constructor() {
        super('Problem is already marked as wrong', 'ProblemMarkedWrongException', 400);
    }
}

module.exports = ProblemMarkedWrongException;