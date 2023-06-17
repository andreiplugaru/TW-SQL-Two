const Problem = require("../entities/Problem.js");
const ProblemNotFoundException = require("../exceptions/ProblemNotFoundException.js");
const ProblemMarkedWrongException = require("../exceptions/ProblemMarkedWrongException.js");
const UnknownDifficultyException = require("../exceptions/UnknownDifficultyException.js");
const InvalidCategoryException = require("../exceptions/InvalidCategoryException.js");
const ProblemWrongNotFoundException = require("../exceptions/ProblemWrongNotFoundException.js");
const InvalidUploadFileException = require("../exceptions/InvalidUploadFileException.js");

class ProblemService {
    constructor({
                    problemRepository,
                    categoryRepository,
                    difficultyService
                }) {
        this.problemRepository = problemRepository;
        this.categoryRepository = categoryRepository;
        this.difficultyService = difficultyService;
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
        let category = await this.difficultyService.findByName(difficulty)
        if (category.length === 0)
            throw new UnknownDifficultyException(difficulty)
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
        if (category.length === 0)
            throw new InvalidCategoryException(problem.category)
        problem.category = category[0].ID;
        let problemId = (await this.problemRepository.save(problem))[0].ID

        await this.problemRepository.saveToAdded(problemId, problem.studentId)
    }

    async saveToAttempts(studentId, problemId) {
        await this.problemRepository.saveToAttempts(studentId, problemId)
    }

    async checkIfProblemIsProposed(studentId, problemId) {
        return await this.problemRepository.checkIfProblemIsProposed(studentId, problemId)
    }

    async checkIfProblemIsMarked(studentId, problemId) {
        return await this.problemRepository.checkIfProblemIsMarked(studentId, problemId)
    }

    async getStatisticsAboutProposedProblems(studentId) {
        return await this.problemRepository.getStatisticsAboutProposedProblems(studentId)
    }

    async getAllProblems() {
        return await this.problemRepository.getAllProblems()
    }

    async getWrongProblems() {
        return await this.problemRepository.getWrongProblems()
    }

    async deleteById(id) {
        await this.findById(id);
        await this.problemRepository.deleteById(id);
    }

    async rejectWrongProblem(problemId) {
        if ((await this.problemRepository.getWrongProblemById(problemId)).length === 0)
            throw new ProblemWrongNotFoundException(problemId)
        await this.problemRepository.rejectWrongProblem(problemId);
    }

    async saveProblems(problems) {
        problems = JSON.parse(problems)
        let categories = await this.categoryRepository.findAll()
        problems = problems.map(problem => {
            let category = categories.find(category => category.NAME === problem.category)
            if (category === undefined)
                throw new InvalidCategoryException(problem.category)
            problem.category = category.ID
            return problem
        })
        for (let problem of problems) {
            if (problem.requirement === undefined || problem.solution === undefined || problem.category === undefined)
                throw new InvalidUploadFileException()
        }
        await this.problemRepository.saveProblems(problems);
    }

}

module.exports = ProblemService;