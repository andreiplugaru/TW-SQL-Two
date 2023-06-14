class HttpException extends Error {
    constructor(message, name, errorCode) {
        super(message);
        this.errorCode = errorCode;
        this.name = name
    }
}

module.exports = HttpException;