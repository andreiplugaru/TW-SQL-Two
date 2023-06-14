const HttpException = require('./HttpException.js');

class StudentNotFoundException extends HttpException {
    constructor(id) {
        super(`Student with id ${id} not found`, "StudentNotFoundException", 404);
    }
}

module.exports = StudentNotFoundException;