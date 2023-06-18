const HttpException = require('./HttpException.js')

class InvalidUploadFileException extends HttpException {
    constructor() {
        super(`Fisierul nu contine cerinta, categoria sau solutia pentru toate problemele`, "InvalidUploadFileException", 400);
    }
}

module.exports = InvalidUploadFileException;