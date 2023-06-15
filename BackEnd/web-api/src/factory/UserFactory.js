const UserRepository = require('../repositories/UserRepository.js')
const UserService = require('../services/UserService.js')

function generateInstance(problemService, solvedProblemService) {
    let userRepository = new UserRepository()
    let userService = new UserService(userRepository, problemService, solvedProblemService)
    return userService
}

module.exports = {generateInstance}