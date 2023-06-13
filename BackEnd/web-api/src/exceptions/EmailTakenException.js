class EmailTakenException extends Error {
    constructor(email) {
        super(`Email-ul ${email} este deja folosit`);
        this.name = "EmailTakenException";
    }
}

module.exports = EmailTakenException;