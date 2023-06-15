const HttpException = require("./HttpException");

class SolutionNotCorrectException extends HttpException {
    constructor(id) {
        super(`Your solution is not correct`, "SolutionNotCorrectException", 400);
    }
}

module.exports = SolutionNotCorrectException;