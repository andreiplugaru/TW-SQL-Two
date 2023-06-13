class UnauthorizedException extends Error {
    constructor() {
        super("Datele de autentificare sunt incorecte");
        this.name = 'UnauthorizedException';

    }
}

module.exports = UnauthorizedException;