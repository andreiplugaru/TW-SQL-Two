const {once} = require('events')
const ProblemSolvedReceivedDto = require('../dtos/ProblemSolvedReceivedDto.js');
const ProblemReceivedDto = require('../dtos/ProblemReceivedDto.js');
const url = require('url');
const DEFAULT_HEADER = require('../util/util.js');
const ProblemResponseDto = require("../dtos/ProblemResponseDto.js");
const AuthenticationUtil = require("../util/AuthenticationUtil.js");
const querystring = require('querystring');
const HttpException = require("../exceptions/HttpException");


const routes = ({
                    userService, solvedProblemService, problemService
                }) => ({
    '/api/v1/problems/solved:get': async (request, response) => {
        try {
            let studentId = await AuthenticationUtil.checkToken(userService, request)
            const solvedProblems = await solvedProblemService.findSolvedProblemsByStudentId(studentId)
            response.writeHead(200, DEFAULT_HEADER)
            response.write(JSON.stringify({problems: solvedProblems}))
        } catch (err) {
            response.writeHead(err.errorCode, DEFAULT_HEADER)
            response.write(JSON.stringify({'message': err.message}))
        }
        response.end()

    }, '/api/v1/problems/solved:post': async (request, response) => {
        let body = [];
        request.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', async () => {
            try {
                let studentId = await AuthenticationUtil.checkToken(userService, request)
                const requestBody = JSON.parse(body); // Assuming the request body is in JSON format
                const solvedProblemDto = new ProblemSolvedReceivedDto(studentId, requestBody.id_problem, requestBody.solution)
                await solvedProblemService.save(solvedProblemDto)
                response.writeHead(201, DEFAULT_HEADER)
            } catch (err) {
                response.writeHead(err.errorCode, DEFAULT_HEADER)
                response.write(JSON.stringify({'message': err.message}))
            }
            response.end()
        });
    }, '/api/v1/problems:get': async (request, response) => {
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
    }, '/api/v1/problems/next:get': async (request, response) => {
        const parsedUrl = url.parse(request.url, true);
        try {
            let studentId = await AuthenticationUtil.checkToken(userService, request)
            const problemId = await problemService.findNextProblem(studentId)
            const problem = await problemService.findById(problemId)
            response.writeHead(200, DEFAULT_HEADER)
            response.write(JSON.stringify(new ProblemResponseDto({
                id: problem.id, requirement: problem.requirement, category: problem.category,
            })))
        } catch (err) {
            response.writeHead(err.errorCode, DEFAULT_HEADER)
            response.write(JSON.stringify({'message': err.message}))
        }
        response.end()
    }, '/api/v1/problems/wrong:post': async (request, response) => {
        try {
            let studentId = await AuthenticationUtil.checkToken(userService, request)
            const parsed = url.parse(request.url);
            let problemId = querystring.parse(parsed.query).problemId
            await problemService.markProblemAsWrong(studentId, problemId)
            response.writeHead(201, DEFAULT_HEADER)
        } catch (err) {
            response.writeHead(err.errorCode, DEFAULT_HEADER)
            response.write(JSON.stringify({'message': err.message}))
        }
        response.end()
    },

    '/api/v1/problems/difficulty/marker:post': async (request, response) => {
        try {
            let studentId = await AuthenticationUtil.checkToken(userService, request)
            const parsed = url.parse(request.url)
            let problemId = querystring.parse(parsed.query).problemId
            let difficulty = querystring.parse(parsed.query).difficulty
            await problemService.markProblemDifficulty(studentId, problemId, difficulty)
        } catch (err) {
            response.writeHead(err.errorCode, DEFAULT_HEADER)
            response.write(JSON.stringify({'message': err.message}))
        }
        response.end()
    }, '/api/v1/problems/marked:get': async (request, response) => {
        try {
            let studentId = await AuthenticationUtil.checkToken(userService, request)
            const markedProblems = await problemService.findMarkedDifficultyProblemsByStudentId(studentId)
            response.writeHead(200, DEFAULT_HEADER)
            response.write(JSON.stringify({problems: markedProblems}))
        } catch (err) {
            response.writeHead(err.errorCode, DEFAULT_HEADER)
            response.write(JSON.stringify({'message': err.message}))
        }
        response.end()
    }, '/api/v1/problems/proposed:get': async (request, response) => {
        try {
            let studentId = await AuthenticationUtil.checkToken(userService, request)
            const proposedProblems = await problemService.findProposedProblemsByStudentId(studentId)
            response.writeHead(200, DEFAULT_HEADER)
            response.write(JSON.stringify({problems: proposedProblems}))
        } catch (err) {
            response.writeHead(err.errorCode, DEFAULT_HEADER)
            response.write(JSON.stringify({'message': err.message}))
        }
        response.end()
    }, '/api/v1/problems/student/solved:get': async (request, response) => {
        try {
            let studentId = await AuthenticationUtil.checkToken(userService, request)
            const parsed = url.parse(request.url);
            let problemId = querystring.parse(parsed.query).problemId
            const solvedProblems = await solvedProblemService.checkIfProblemIsSolved(studentId, problemId)
            response.writeHead(200, DEFAULT_HEADER)
            response.write(JSON.stringify({problems: solvedProblems}))
        } catch (err) {
            response.writeHead(err.errorCode, DEFAULT_HEADER)
            response.write(JSON.stringify({'message': err.message}))
        }
        response.end()
    }, '/api/v1/problems:post': async (request, response) => {
        let body = [];
        request.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', async () => {
            try {
                const requestBody = JSON.parse(body); // Assuming the request body is in JSON format

                if(!(requestBody.requirement || requestBody.solution || requestBody.category))
                    throw new HttpException('Invalid request body', 'InvalidRequestBody', 400)
                let studentId = await AuthenticationUtil.checkToken(userService, request)
                const problem = new ProblemReceivedDto(requestBody.requirement, requestBody.solution, requestBody.category, studentId)
                await problemService.save(problem)
                response.writeHead(201, DEFAULT_HEADER)
            } catch (err) {
                response.writeHead(err?.errorCode, DEFAULT_HEADER)
                response.write(JSON.stringify({'message': err.message}))
            }
            response.end()
        });
    }

})


module.exports = routes