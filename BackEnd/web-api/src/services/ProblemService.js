const Problem = require("../entities/Problem.js");
const ProblemNotFoundException = require("../exceptions/ProblemNotFoundException.js");

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
        let problem = new Problem( { id: response.ID, requirement: response.REQUIREMENT, solution:response.SOLUTION, idCategory: response.ID_CATEGORY} );
        return problem;
    }

    async findNextProblem(studentId) {
        return await this.problemRepository.findNextProblem(studentId);
    }
}

module.exports = ProblemService;