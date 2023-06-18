const HttpException = require("./HttpException");

class SolutionNotCorrectException extends HttpException {
    constructor(id) {
        super(`Solutia nu este corecta`, "SolutionNotCorrectException", 400);
    }
}

module.exports = SolutionNotCorrectException;