const SolutionNotCorrectException = require('../exceptions/SolutionNotCorrectException.js')
const ForbiddenException = require('../exceptions/ForbiddenException.js')

class SolvedProblemService {
    constructor({
                    solvedProblemRepository,
                    studentService,
                    problemService
                }) {
        this.solvedProblemRepository = solvedProblemRepository
        this.studentService = studentService
        this.problemService = problemService
    }

    async findAll() {
        return await this.solvedProblemRepository.findAll()
    }

    async save(solvedProblem) {
        let problem = await this.problemService.findById(solvedProblem.idProblem)
        await this.studentService.findById(solvedProblem.idStudent)
        await this.problemService.saveToAttempts(solvedProblem.idProblem, solvedProblem.idStudent)
        let result = (await this.solvedProblemRepository.checkIfProblemIsCorrect(problem.solution, solvedProblem.solution))[0].RESULT
        if (result === 'false' || result === 'FALSE')
            throw new SolutionNotCorrectException()
        await this.solvedProblemRepository.save(solvedProblem)
    }

    async findSolvedProblemsByStudentId(id) {
        await this.studentService.findById(id)
        let problems = await this.solvedProblemRepository.findSolvedProblemsByStudentId(id)
        for (let problem of problems) {
            delete problem.SOLUTION
        }
        return problems
    }

    async checkIfProblemIsSolved(studentId, problemId) {
        await this.problemService.findById(problemId)
        return await this.solvedProblemRepository.checkIfProblemIsSolved(studentId, problemId)
    }

    async getInfoAboutProblem(studentId, problemId, isAdmin) {
        if (!isAdmin)
            if (await this.solvedProblemRepository.checkIfProblemIsSolved(studentId, problemId) !== true && await this.problemService.checkIfProblemIsProposed(problemId, studentId) !== true && await this.problemService.checkIfProblemIsMarked(problemId, studentId) !== true)
                throw new ForbiddenException()
        return await this.problemService.findById(problemId)
    }

    async checkIfSolutionIsCorrect(problemId, solution) {
        let problem = await this.problemService.findById(problemId)
        let correctSolution = problem.solution
        let result = (await this.solvedProblemRepository.checkIfProblemIsCorrect(correctSolution,solution))[0].RESULT
        if (result === 'false' || result === 'FALSE')
            throw new SolutionNotCorrectException()
    }
}

module.exports = SolvedProblemService