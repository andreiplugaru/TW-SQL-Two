const Url = require('url')
const {DEFAULT_HEADER} = require('./util/util.js')
const solvedProblemFactory = require('./factory/SolvedProblemFactory.js')
const problemFactory = require('./factory/ProblemFactory.js')
const authenticationFactory = require('./factory/AuthenticationFactory.js')
const userFactory = require('./factory/UserFactory.js')
const studentFactory = require('./factory/StudentFactory.js')
const commentFactory = require('./factory/CommentFactory.js')
const categoryFactory = require('./factory/CategoryFactory.js')
const difficultyFactory = require('./factory/DifficultyFactory.js')
const ProblemRoute = require('./routes/ProblemRoute.js')
const AuthenticationRoute = require('./routes/AuthenticationRoute.js')
const CommentRoute = require('./routes/CommentRoute.js')
const UserRoute = require('./routes/UserRoute.js')
const CategoryRoute = require('./routes/CategoryRoute.js')
fs = require('fs');
var path = require('path');
const solvedProblemService = solvedProblemFactory.generateInstance()
const difficultyService = difficultyFactory.generateInstance()

const problemService = problemFactory.generateInstance(difficultyService)
const commentService = commentFactory.generateInstance(problemService)
const userService = userFactory.generateInstance(problemService, solvedProblemService)
const studentService = studentFactory.generateInstance(userService)
const categoryService = categoryFactory.generateInstance()
const problemRoutes = ProblemRoute({
    userService,
    solvedProblemService,
    problemService
})
const commentRoutes = CommentRoute({userService, commentService})
const authenticationService = authenticationFactory.generateInstance(userService, studentService)
const authenticationRoutes = AuthenticationRoute({authenticationService})
const userRoutes = UserRoute({userService, studentService})
const categoryRoutes = CategoryRoute({categoryService})
const allRoutes = {
    '/dist:get': (request, response) => {
        var filePath = '.' + request.url;
        if (filePath == './api/v1/dist')
            filePath = './dist/index.html';

        var extName = path.extname(filePath);
        var contentType = 'text/html';
        switch (extName) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
        }

        filePath = filePath.substring(filePath.indexOf("/dist"))
        filePath = "." + filePath
        fs.readFile(filePath, function (error, content) {
            if (error) {
                response.writeHead(500, DEFAULT_HEADER)
                response.end();
            } else {
                response.writeHead(200, {'Content-Type': contentType});
                response.end(content, 'utf-8');
            }
        });
    },
    ...categoryRoutes,
    ...userRoutes,
    ...commentRoutes,
    ...problemRoutes,
    ...authenticationRoutes,
    //404 route
    default: (requst, response) => {
        response.writeHead(200, DEFAULT_HEADER)
        response.write('Not found')
        response.end()
    }
}

function handler(request, response) {
    const {
        url,
        method
    } = request
    response.setHeader("Access-Control-Allow-Origin", "*");//for CORS
    const {pathname, query} = Url.parse(url, true)
    if (pathname.startsWith('/api/v1/dist')) {
        return allRoutes['/dist:get'](request, response)
    }
    const key = `${pathname}:${method.toLowerCase()}`
    const chosen = allRoutes[key] || allRoutes.default
    return Promise.resolve(chosen(request, response))
        .catch(handlerError(response))
}

function handlerError(response) {
    return error => {
        console.log('Something bad has happened**', error.stack)
        response.writeHead(500, DEFAULT_HEADER)
        response.write(JSON.stringify({
            error: 'internal server error'
        }))
        return response.end()
    }
}

module.exports = {
    handler
}