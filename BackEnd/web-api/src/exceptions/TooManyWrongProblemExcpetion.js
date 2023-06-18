const HttpException = require('../exceptions/HttpException.js');

class TooManyWrongProblemException extends HttpException {
    constructor() {
        super(`You have already marked 5 problems as wrong. Wait until they are checked by admin`, TooManyWrongProblemException, 401);
    }
}

module.exports = TooManyWrongProblemException;