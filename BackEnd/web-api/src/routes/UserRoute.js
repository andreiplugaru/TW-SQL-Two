const DEFAULT_HEADER = require("../util/util");
const AuthenticationUtil = require("../util/AuthenticationUtil");
const url = require('url');
const StudentRegisterDto = require("../dtos/StudentRegisterDto");
const querystring = require("querystring");
const InvalidRequestBodyException = require("../exceptions/InvalidRequestBodyException");

const routes = ({
                    userService,
                }) => ({
    '/api/v1/users:get': async (request, response) => {
        try {
            let userId = await AuthenticationUtil.checkToken(userService, request)
            const user = await userService.findUserInfoById(userId)
            response.writeHead(200, DEFAULT_HEADER)
            response.write(JSON.stringify(user))
        } catch (err) {
            response.writeHead(err.errorCode, DEFAULT_HEADER)
            response.write(JSON.stringify({'message': err.message}))
        }
        response.end()
    },
    '/api/v1/users:patch': async (request, response) => {
        try {
            let body = [];
            let userId = await AuthenticationUtil.checkToken(userService, request)
            let user;
           await request.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', async () => {
                const requestBody = JSON.parse(body);

                if (!requestBody.password || !requestBody.email)
                    throw new InvalidRequestBodyException()
                user = new StudentRegisterDto('', requestBody.firstName, requestBody.lastName, requestBody.email, requestBody.password)

                await userService.updateUser(userId, user)
            })
            response.writeHead(204, DEFAULT_HEADER)

           // response.write(JSON.stringify(user))
        } catch (err) {
            response.writeHead(err.errorCode, DEFAULT_HEADER)
            response.write(JSON.stringify({'message': err.message}))
        }
        response.end()
    },
})

module.exports = routes