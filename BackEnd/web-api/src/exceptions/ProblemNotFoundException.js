const HttpException = require('./HttpException.js');

class ProblemNotFoundException extends HttpException {
    constructor(id) {
        super(`Problem with id ${id} not found`, "ProblemNotFoundException", 404);
    }
}

module.exports = ProblemNotFoundException;