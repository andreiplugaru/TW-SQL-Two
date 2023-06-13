class UserService{
    constructor(userRepository) {
        this.userRepository = userRepository
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
}

module.exports = UserService;