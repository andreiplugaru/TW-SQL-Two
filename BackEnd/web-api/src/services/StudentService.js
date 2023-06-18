const StudentNotFoundException = require('../exceptions/StudentNotFoundException.js')
const UserResponseDto = require("../dtos/UserResponseDto");
class StudentService {
    constructor({
        studentRepository, userService
    }) {
        this.studentRepository = studentRepository
        this.userService = userService
    }
    async findAll() {
        return await this.studentRepository.findAll()
    }
    async findById(id) {
        const response = await this.studentRepository.findById(id)
        if (response === undefined || response.length === 0) {
            throw new StudentNotFoundException(id)
        }
        return response
    }

    async findByUsername(username) {
        const response = await this.userService.findByUsername(username)
        if (response === undefined || response.length === 0) {
            throw new StudentNotFoundException(username)
        }
        const student = await this.studentRepository.findById(response[0].ID)
        return student
    }
    async createStudent(user){
        let rowId = await this.userService.createUser(user)
        let createdUser = await this.userService.getByRowId(rowId)
        await this.studentRepository.createStudent(createdUser[0].ID)
    }

    async findStudentInfoById(id) {
        let user = await this.userService.findById(id)
        let userInfo = new UserResponseDto()
        userInfo.firstName = user[0].FIRSTNAME
        userInfo.lastName = user[0].LASTNAME
        userInfo.email = user[0].EMAIL
        userInfo.username = user[0].USERNAME

        let problems = await this.userService.solvedProblemService.findSolvedProblemsByStudentId(id)
        userInfo.solvedProblems = problems.length

        let markedProblems = await this.userService.problemService.findMarkedDifficultyProblemsByStudentId(id)
        userInfo.markedProblems = markedProblems.length

        let proposedProblems = await this.userService.problemService.findProposedProblemsByStudentId(id)
        userInfo.proposedProblems = proposedProblems.length
        return userInfo;
    }

}

module.exports = StudentService