const DEFAULT_HEADER = require("../util/util");
const AuthenticationUtil = require("../util/AuthenticationUtil");
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
    }
})

module.exports = routes