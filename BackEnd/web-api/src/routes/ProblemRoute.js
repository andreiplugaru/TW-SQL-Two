const {once} = require('events')
const ProblemSolvedReceivedDto = require('../dtos/ProblemSolvedReceivedDto.js');
const url = require('url');
const DEFAULT_HEADER = require('../util/util.js');
const ProblemResponseDto = require("../dtos/ProblemResponseDto.js");

const routes = ({
                    solvedProblemService,
                    problemService
                }) => ({
    '/api/v1/problems/solved:get': async (request, response) => {
        const parsedUrl = url.parse(request.url, true);
        const {pathname, query} = parsedUrl;
        response.writeHead(200, DEFAULT_HEADER)

        if ('studentId' in query) {
            try {
                const id = query.studentId
                const solvedProblems = await solvedProblemService.findSolvedProblemsByStudentId(id)
                response.write(JSON.stringify({problems: solvedProblems}))
            } catch (err) {
                response.writeHead(err.errorCode, DEFAULT_HEADER)
                response.write(JSON.stringify({'message': err.message}))
            }
        } else {
            const solvedProblems = await solvedProblemService.findAll()
            response.write(JSON.stringify({problems: solvedProblems}))
        }
        response.end()

    },
    '/api/v1/problems/solved:post': async (request, response) => {
        let body = [];
        request.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', async () => {
            const requestBody = JSON.parse(body); // Assuming the request body is in JSON format
            const solvedProblemDto = new ProblemSolvedReceivedDto(requestBody)
            try {
                await solvedProblemService.save(solvedProblemDto)
                response.writeHead(201, DEFAULT_HEADER)
            } catch (err) {
                response.writeHead(err.errorCode, DEFAULT_HEADER)
                response.write(JSON.stringify({'message': err.message}))
            }
            response.end()
        });
    },
    '/api/v1/problems:get': async (request, response) => {
        const parsedUrl = url.parse(request.url, true);
        const {pathname, query} = parsedUrl;
        if ('problemId' in query) {
            try {
                const id = query.problemId
                const problem = await problemService.findById(id)
                response.writeHead(200, DEFAULT_HEADER)
                response.write(JSON.stringify({problem: problem}))

            } catch (err) {
                response.writeHead(err.errorCode, DEFAULT_HEADER)
                response.write(JSON.stringify({'message': err.message}))
            }
        } else {
            response.writeHead(404, DEFAULT_HEADER)
        }
        response.end()
    },
    '/api/v1/problems/next:get': async (request, response) => {
        const parsedUrl = url.parse(request.url, true);
        const {pathname, query} = parsedUrl;
        if ('studentId' in query) {
            const id = query.studentId
            try {
                const problemId = Object.values((await problemService.findNextProblem(id))[0])[0]
                const problem = await problemService.findById(problemId)
                response.writeHead(200, DEFAULT_HEADER)
                response.write(JSON.stringify(new ProblemResponseDto({
                    id: problem.id,
                    requirement: problem.requirement,
                    idCategory: problem.idCategory
                })))
            } catch (err) {
                response.writeHead(err.errorCode, DEFAULT_HEADER)
                response.write(JSON.stringify({'message': err.message}))
                response.end()
            }
        } else {
            response.writeHead(404, DEFAULT_HEADER)
        }
        response.end()
    }
})


module.exports = routes