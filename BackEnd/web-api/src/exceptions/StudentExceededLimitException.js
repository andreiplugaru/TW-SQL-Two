const HttpException = require('./HttpException.js');

class StudentExceededLimitException extends HttpException {
    constructor(id) {
        super(`Student with id ${id} exceeded the limit of problems solved`, "StudentExceededLimitException", 400);
    }
}

module.exports = StudentExceededLimitException;