const UserResponseDto = require('../dtos/UserResponseDto.js');
class UserService{
    constructor(userRepository, problemService, solvedProblemService) {
        this.userRepository = userRepository
        this.problemService = problemService
        this.solvedProblemService = solvedProblemService
    }
    async findByUsername(username) {
        return await this.userRepository.findByUsername(username)
    }

    async createUser(user) {
        return await this.userRepository.createUser(user)
    }

    async getByRowId(rowId) {
        return await this.userRepository.getByRowId(rowId)
    }

    async findUserInfoById(id) {
        let user = await this.userRepository.findById(id)
        let userInfo = new UserResponseDto()
        userInfo.firstname = user[0].FIRSTNAME
        userInfo.lastname = user[0].LASTNAME
        userInfo.email = user[0].EMAIL

        let problems = await this.solvedProblemService.findSolvedProblemsByStudentId(id)
        userInfo.solvedProblems = problems.length

        let markedProblems = await this.problemService.findMarkedDifficultyProblemsByStudentId(id)
        userInfo.problemMarked = markedProblems.length

        let proposedProblems = await this.problemService.findMarkedDifficultyProblemsByStudentId(id)
        userInfo.problemProposed = proposedProblems.length
        return userInfo;
    }
}

module.exports = UserService;