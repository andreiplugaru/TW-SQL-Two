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
                    studentService
                }) => ({
    '/api/v1/students:get': async (request, response) => {
        try {
            let userId = await AuthenticationUtil.checkToken(userService, request)
            const user = await studentService.findStudentInfoById(userId)
            response.writeHead(200, DEFAULT_HEADER)
            response.write(JSON.stringify(user))
        } catch (err) {
          errorHandler(err, response)
        }
        response.end()
    },
    '/api/v1/users:patch': async (request, response) => {

        let body = [];
        let user;
        await (request.on('data', async (chunk) => {
            body.push(chunk);
        }).on('end', async () => {
            try {
                let userId = await AuthenticationUtil.checkToken(userService, request)
                const requestBody = JSON.parse(body);
                if (!requestBody.password || !requestBody.email || !requestBody.firstName || !requestBody.lastName)
                    throw new InvalidRequestBodyException()
                user = new StudentRegisterDto('', requestBody.firstName, requestBody.lastName, requestBody.email, requestBody.password)
                await userService.updateUser(userId, user)
                response.writeHead(204, DEFAULT_HEADER)
            } catch (err) {
                errorHandler(err, response)
            } finally {
                response.end()
            }
        }))

    },
    '/api/v1/users:get': async (request, response) => {
        try {
            let userId = await AuthenticationUtil.checkToken(userService, request)
            const user = await userService.findUserInfoById(userId)
            response.writeHead(200, DEFAULT_HEADER)
            response.write(JSON.stringify(user))
        } catch (err) {
          errorHandler(err, response)
        }
        response.end()
    },
    '/api/v1/users/all:get': async (request, response) => {
        try {
            let userId = await AuthenticationUtil.checkToken(userService, request)
            let role = await userService.getRole(userId)
            if (role !== 'ADMIN') throw new ForbiddenException()
            const users = await userService.getAllUsers(userId)
            response.writeHead(200, DEFAULT_HEADER)
            response.write(JSON.stringify(users))
        } catch (err) {
          errorHandler(err, response)
        }
        response.end()
    },
    '/api/v1/users:delete': async (request, response) => {
        try {
            let currentUserId = await AuthenticationUtil.checkToken(userService, request)
            const parsed = url.parse(request.url)
            let userId = querystring.parse(parsed.query).userId
            let role = await userService.getRole(currentUserId)
            if (role !== 'ADMIN') throw new ForbiddenException()
            await userService.deleteUser(userId)
            response.writeHead(204, DEFAULT_HEADER)
        } catch (err) {
          errorHandler(err, response)
        }
        response.end()
    }
})

module.exports = routes