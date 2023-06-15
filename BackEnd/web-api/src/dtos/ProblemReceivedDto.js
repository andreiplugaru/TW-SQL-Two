class ProblemReceivedDto {
    constructor(requirement, solution, category, studentId ) {
        this.requirement = requirement
        this.solution = solution
        this.category = category
        this.studentId = studentId
    }
}

module.exports = ProblemReceivedDto