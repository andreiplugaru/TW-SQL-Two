class ProblemNotFoundException extends Error {
    constructor(id) {
        super(`Problem with id ${id} not found`);
        this.name = 'ProblemNotFoundException';
    }
}

module.exports = ProblemNotFoundException;