class UsernameTakenException extends Error {
    constructor(username) {
        super(`Numele de utilizator ${username} este deja folosit`);
        this.name = "UsernameTakenException";
    }
}

module.exports = UsernameTakenException;