const HttpException = require('./HttpException.js');

class UnknownDifficultyException extends HttpException {
    constructor(difficulty) {
        super(`Unknown difficulty: ${difficulty}`, 'UnknownDifficultyException', 400);
    }
}

module.exports = UnknownDifficultyException;