const Problem = require("../entities/Problem.js");
const ProblemNotFoundException = require("../exceptions/ProblemNotFoundException.js");
const ProblemMarkedWrongException = require("../exceptions/ProblemMarkedWrongException.js");
const UnknownDifficultyException = require("../exceptions/UnknownDifficultyException.js");
const InvalidCategoryException = require("../exceptions/InvalidCategoryException.js");
class ProblemService {
    constructor({
                    problemRepository,
                    categoryRepository
                }) {
        this.problemRepository = problemRepository;
        this.categoryRepository = categoryRepository;
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
        if (await this.checkIfProblemIsMarkedAsWrong(studentId, problemId))
            throw new ProblemMarkedWrongException()
        await this.problemRepository.markProblemAsWrong(studentId, problemId);
    }

    async checkIfProblemIsMarkedAsWrong(studentId, problemId) {
        let response = await this.problemRepository.checkIfProblemIsMarkedAsWrong(studentId, problemId);
        return response.length > 0;
    }

    async markProblemDifficulty(studentId, problemId, difficulty) {
        let category = await this.categoryRepository.findByName(difficulty)
        if (category.length === 0)
            throw new InvalidCategoryException(difficulty)
        let difficultyId = category[0].ID;
        await this.problemRepository.markProblemDifficulty(studentId, problemId, difficultyId);
    }

    async findMarkedDifficultyProblemsByStudentId(id) {
        return await this.problemRepository.findMarkedDifficultyProblemsByStudentId(id)
    }

    async findProposedProblemsByStudentId(id) {
        return await this.problemRepository.findProposedProblemsByStudentId(id)
    }

    async save(problem) {
        let category = await this.categoryRepository.findByName(problem.category)
        if(category.length === 0)
            throw new UnknownDifficultyException(problem.category)
        problem.category = category[0].ID;
        let problemId = (await this.problemRepository.save(problem))[0].ID

        await this.problemRepository.saveToAdded(problemId, problem.studentId)
    }

    async getCategories() {
        return await this.categoryRepository(name)
    }

}

module.exports = ProblemService;