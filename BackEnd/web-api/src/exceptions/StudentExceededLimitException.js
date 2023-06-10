class StudentExceededLimitException extends Error {
    constructor(id) {
        super(`Student with id ${id} exceeded the limit of problems solved`);
        this.name = "StudentExceededLimitException";
    }
}

module.exports = StudentExceededLimitException;