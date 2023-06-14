const HttpException = require('./HttpException.js');

class UsernameTakenException extends HttpException {
    constructor(username) {
        super(`Username ${username} is already taken`, "UsernameTakenException", 400);
    }
}

module.exports = UsernameTakenException;