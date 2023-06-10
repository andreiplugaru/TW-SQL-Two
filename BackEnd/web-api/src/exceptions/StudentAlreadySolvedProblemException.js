class StudentAlreadySolvedProblemException extends Error {
    constructor() {
        super("This student already solved this problem");
        this.name = "StudentAlreadySolvedProblemException";
    }
}
module.exports = StudentAlreadySolvedProblemException;