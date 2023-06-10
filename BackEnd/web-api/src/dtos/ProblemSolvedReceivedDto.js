class ProblemSolvedReceivedDto {
    constructor({ id_student, id_problem }) {
        this.idProblem = id_problem
        this.idStudent = id_student
    }
}

module.exports = ProblemSolvedReceivedDto