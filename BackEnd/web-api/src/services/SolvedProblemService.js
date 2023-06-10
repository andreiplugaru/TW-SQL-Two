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
        await this.studentService.findById(solvedProblem.idStudent)
        await this.problemService.findById(solvedProblem.idProblem)

        await this.solvedProblemRepository.save(solvedProblem)
    }

    async findSolvedProblemsByStudentId(id) {
        await this.studentService.findById(id)
        return await this.solvedProblemRepository.findSolvedProblemsByStudentId(id)

    }
}

module.exports = SolvedProblemService