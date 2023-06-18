const Problem = require("../entities/Problem.js");
const ProblemNotFoundException = require("../exceptions/ProblemNotFoundException.js");
const ProblemMarkedWrongException = require("../exceptions/ProblemMarkedWrongException.js");
const UnknownDifficultyException = require("../exceptions/UnknownDifficultyException.js");
const InvalidCategoryException = require("../exceptions/InvalidCategoryException.js");
const ProblemWrongNotFoundException = require("../exceptions/ProblemWrongNotFoundException.js");
const InvalidUploadFileException = require("../exceptions/InvalidUploadFileException.js");
const TooManyWrongProblemException = require("../exceptions/TooManyWrongProblemExcpetion.js");

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
        let wrongProblems = await this.getNumberOfWrongProblemsMarkedByStudent(studentId)
        if (wrongProblems[0]["NUMBER_OF_WRONG_PROBLEMS"] >= 5) {
            throw new TooManyWrongProblemException()
        }
        await this.problemRepository.markProblemAsWrong(studentId, problemId);
    }

    async checkIfProblemIsMarkedAsWrong(studentId, problemId) {
        let response = await this.problemRepository.checkIfProblemIsMarkedAsWrong(studentId, problemId);
        return response.length > 0;
    }

    async getNumberOfWrongProblemsMarkedByStudent(studentId) {
        return await this.problemRepository.getNumberOfWrongProblemsMarkedByStudent(studentId);
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

    async findAllInfo() {
        return await this.problemRepository.findAllInfo()
    }

    async getInterestingProblems(category, count) {
        let categoryFromDB = await this.categoryRepository.findByName(category)
        if (categoryFromDB.length === 0)
            throw new InvalidCategoryException(category)
        let problemIds = await this.problemRepository.getInterestingProblems(categoryFromDB[0].ID, count)
        let problems = await this.problemRepository.getInterestingProblemsInfo(problemIds)
        const groupById =  problems.reduce((group, problem) => {
            const ID = problem.ID;
            group[ID] = group[ID] ?? {};
            delete problem.ID
            let comment = {}
            comment.message = problem.MESSAGE
            comment.username = problem.USERNAME
            group[ID].comments = group[ID].comments ?? [];
            group[ID].comments.push(comment);
            group[ID].requirement = problem.REQUIREMENT
            return group;
        }, {});
        return Array.from(new Map(Object.entries(groupById)).values())
    }

}

module.exports = ProblemService;