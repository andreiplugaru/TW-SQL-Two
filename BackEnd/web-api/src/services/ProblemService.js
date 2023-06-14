const Problem = require("../entities/Problem.js");
const ProblemNotFoundException = require("../exceptions/ProblemNotFoundException.js");
const ProblemMarkedWrongException = require("../exceptions/ProblemMarkedWrongException.js");
class ProblemService {
    constructor({
                    problemRepository
                }) {
        this.problemRepository = problemRepository;
    }

    async findById(id) {
        let response = (await this.problemRepository.findById(id))[0];
        if (response === undefined || response.length === 0) {
            throw new ProblemNotFoundException(id)
        }
        let problem = new Problem({
            id: response.ID,
            requirement: response.REQUIREMENT,
            solution: response.SOLUTION,
            category: response.CATEGORY
        });
        return problem;
    }

    async findNextProblem(studentId) {
        return await this.problemRepository.findNextProblem(studentId);
    }

    async markProblemAsWrong(studentId, problemId) {
        await this.findById(problemId)
        if(await this.checkIfProblemIsMarkedAsWrong(studentId, problemId))
            throw new ProblemMarkedWrongException()
        await this.problemRepository.markProblemAsWrong(studentId, problemId);
    }

    async checkIfProblemIsMarkedAsWrong(studentId, problemId) {
        let response = await this.problemRepository.checkIfProblemIsMarkedAsWrong(studentId, problemId);
        return response.length > 0;
    }
}

module.exports = ProblemService;