const AuthenticationService = require('../services/AuthenticationService.js')

function generateInstance(userService, studentService) {
    authenticationService = new AuthenticationService(userService, studentService)
    return authenticationService
}

module.exports = {generateInstance}