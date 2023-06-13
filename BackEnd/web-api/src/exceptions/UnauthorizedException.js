const HttpException = require('./HttpException.js');

class UnauthorizedException extends HttpException {
    constructor() {
        super("Datele de autentificare sunt incorecte", "UnauthorizedException", 401);
    }
}

module.exports = UnauthorizedException;