const SolutionNotCorrectException = require('../exceptions/SolutionNotCorrectException.js')
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
        let result = (await this.solvedProblemRepository.checkIfProblemIsCorrect(solvedProblem.solution, problem.solution))[0].RESULT
        if(result === 'false')
            throw new SolutionNotCorrectException()
        await this.solvedProblemRepository.save(solvedProblem)
    }

    async findSolvedProblemsByStudentId(id) {
        await this.studentService.findById(id)
        return await this.solvedProblemRepository.findSolvedProblemsByStudentId(id)

    }
}

module.exports = SolvedProblemService