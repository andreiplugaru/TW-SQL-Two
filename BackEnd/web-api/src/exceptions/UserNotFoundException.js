const HttpException = require('./HttpException.js');

class UserNotFoundException extends HttpException {
    constructor(userId) {
        super(`User ${userId} not found`, "UserNotFoundException", 404);
    }
}

module.exports = UserNotFoundException;