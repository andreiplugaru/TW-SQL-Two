const HttpException  = require('./HttpException.js');
class ForbiddenException extends HttpException {
    constructor(message = 'This action is forbidden') {
        super(message,ForbiddenException, 403);
    }
}

module.exports = ForbiddenException;