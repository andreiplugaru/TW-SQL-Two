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

    async save(solvedProblem, correctSolution) {
        let problem = await this.problemService.findById(solvedProblem.idProblem)
        await this.solvedProblemRepository.checkIfProblemIsCorrect(correctSolution, problem.solution)
        //TODO: check if the solution is correct
        await this.studentService.findById(solvedProblem.idStudent)
        await this.solvedProblemRepository.save(solvedProblem)
    }

    async findSolvedProblemsByStudentId(id) {
        await this.studentService.findById(id)
        return await this.solvedProblemRepository.findSolvedProblemsByStudentId(id)

    }
}

module.exports = SolvedProblemService