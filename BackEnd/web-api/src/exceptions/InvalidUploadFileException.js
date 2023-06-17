const HttpException = require('./HttpException.js')

class InvalidUploadFileException extends HttpException {
    constructor() {
        super(`Uploaded file doesn't contain requirement, solution or category for all problems`, "InvalidUploadFileException", 400);
    }
}

module.exports = InvalidUploadFileException;