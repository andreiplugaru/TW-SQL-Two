const UserResponseDto = require('../dtos/UserResponseDto.js');
const bcrypt = require("bcryptjs");
class UserService{
    constructor(userRepository, problemService, solvedProblemService) {
        this.userRepository = userRepository
        this.problemService = problemService
        this.solvedProblemService = solvedProblemService
    }
    async findByUsername(username) {
        return await this.userRepository.findByUsername(username)
    }

    async findById(username) {
        return await this.userRepository.findById(username)
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
        userInfo.firstName = user[0].FIRSTNAME
        userInfo.lastName = user[0].LASTNAME
        userInfo.email = user[0].EMAIL
        userInfo.username = user[0].USERNAME

        return userInfo;
    }
    async updateUser(userId, user) {
        user.password = await bcrypt.hash(user.password, 10);
        return await this.userRepository.updateUser(userId, user)
    }

    async getRole(userId) {
        return await this.userRepository.getRole(userId)
    }
}

module.exports = UserService;