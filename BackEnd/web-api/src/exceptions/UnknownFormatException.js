const HttpException = require('./HttpException.js')

class UnknownFormatException extends HttpException {
    constructor() {
        super('This format is not supported', 'UnknownFormatException', 400)
    }
}

module.exports = UnknownFormatException