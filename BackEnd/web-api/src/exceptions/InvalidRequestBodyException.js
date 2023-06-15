const HttpException  = require('./HttpException.js');
class InvalidRequestBodyException extends HttpException {
    constructor(message = 'Invalid request body') {
        super(message,InvalidRequestBodyException, 403);
    }
}

module.exports = InvalidRequestBodyException;