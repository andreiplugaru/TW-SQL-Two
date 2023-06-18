const {DEFAULT_HEADER} = require("../util/util");
const AuthenticationUtil = require("../util/AuthenticationUtil");
const url = require('url');
const StudentRegisterDto = require("../dtos/StudentRegisterDto");
const querystring = require("querystring");
const InvalidRequestBodyException = require("../exceptions/InvalidRequestBodyException");
const {errorHandler} = require("../util/util.js");
const ForbiddenException = require("../exceptions/ForbiddenException");
const routes = ({
                    userService,
                    problemService
                }) => ({
    '/api/v1/admin/users:get': async (request, response) => {
        try {
            let userId = await AuthenticationUtil.checkToken(userService, request)
            let role = await userService.getRole(userId)
            if (role !== 'ADMIN') throw new ForbiddenException()
            const users = await userService.findUsersInfo()
            response.writeHead(200, DEFAULT_HEADER)
            response.write(JSON.stringify(users))
        } catch (err) {
            errorHandler(err, response)
        }
        response.end()
    },
    '/api/v1/admin/problems:get': async (request, response) => {
        try {
            let userId = await AuthenticationUtil.checkToken(userService, request)
            let role = await userService.getRole(userId)
            if (role !== 'ADMIN') throw new ForbiddenException()
            const problems = await problemService.findAllInfo()
            response.writeHead(200, DEFAULT_HEADER)
            response.write(JSON.stringify(problems))
        } catch (err) {
            errorHandler(err, response)
        }
        response.end()
    }
})

module.exports = routes;