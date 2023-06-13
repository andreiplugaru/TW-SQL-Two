const DEFAULT_HEADER = require('../util/util.js');
const StudentRegisterDto = require("../dtos/StudentRegisterDto.js");

const routes = ({authenticationService}) => ({
        '/api/v1/auth/login:post': async (request, response) => {
            let body = [];
            request.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', async () => {
                const requestBody = JSON.parse(body);
                const {username, password} = requestBody;
                try {
                    const result = await authenticationService.login(username, password);
                    response.writeHead(200, DEFAULT_HEADER)
                    response.write(JSON.stringify(result));
                } catch (err) {
                    if (err.name === "UnauthorizedException") {
                        response.writeHead(401, DEFAULT_HEADER)
                        response.write(JSON.stringify(err.message))
                    }
                }
                response.end();
            });
        },
        '/api/v1/auth/register:post': async (request, response) => {
            let body = [];
            request.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', async () => {
                const requestBody = JSON.parse(body);
                try {
                    await authenticationService.register(requestBody);
                    response.writeHead(201, DEFAULT_HEADER)
                } catch (err) {
                    if (err.name === "UnauthorizedException") {
                        response.writeHead(403, DEFAULT_HEADER)
                        response.write(JSON.stringify(err.message))
                    } else if (err.name === "EmailTakenException" || err.name === "UsernameTakenException") {
                        response.writeHead(400, DEFAULT_HEADER)
                        response.write(JSON.stringify(err.message))
                    }
                }
                response.end();
            });
        }
    })
;

module.exports = routes;