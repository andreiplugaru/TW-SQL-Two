class ProblemSolvedReceivedDto {
    constructor(id_student, id_problem, studentSolution ) {
        this.idProblem = id_problem
        this.idStudent = id_student
        this.solution = studentSolution
    }
}

module.exports = ProblemSolvedReceivedDto