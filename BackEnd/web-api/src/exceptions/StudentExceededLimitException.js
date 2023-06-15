const HttpException = require('./HttpException.js');

class StudentExceededLimitException extends HttpException {
    constructor(id) {
        super(`limit exceeded`, "StudentExceededLimitException", 400);
    }
}

module.exports = StudentExceededLimitException;