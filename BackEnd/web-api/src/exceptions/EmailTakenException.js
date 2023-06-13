const HttpException = require('./HttpException.js');

class EmailTakenException extends HttpException {
    constructor(email) {
        super(`Email-ul ${email} este deja folosit`, "EmailTakenException", 400);
    }
}

module.exports = EmailTakenException;