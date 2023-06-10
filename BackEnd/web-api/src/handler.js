const Url = require('url')
const DEFAULT_HEADER = require('./util/util.js')
const db = require('./database/Connection.js')
const solvedProblemFactory = require('./factory/SolvedProblemFactory.js')
const problemFactory = require('./factory/ProblemFactory.js')
const routes = require('./routes/ProblemRoute.js')
const swagger = require('./dist/swagger-initializer.js')
fs = require('fs');
var path = require('path');

//const swaggerDocument = require('../swagger')
const solvedProblemService = solvedProblemFactory.generateInstance()
const problemService = problemFactory.generateInstance()
const problemRoutes = routes({
    solvedProblemService,
    problemService
})
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
            }
            else {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            }
        });
    },


    ...problemRoutes,
    //404 route
    default: (requst, response) => {
        response.writeHead(404, DEFAULT_HEADER)
        response.write('Not fouand')
        //   db.dostuff()
        response.end()
    }
}
function handler(request, response) {
    const {
        url,
        method
    } = request

    const { pathname,query } = Url.parse(url, true)
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