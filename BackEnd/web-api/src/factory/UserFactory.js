const UserRepository = require('../repositories/UserRepository.js')
const UserService = require('../services/UserService.js')

function generateInstance() {
    let userRepository = new UserRepository()
    let userService = new UserService(userRepository)
    return userService
}

module.exports = {generateInstance}