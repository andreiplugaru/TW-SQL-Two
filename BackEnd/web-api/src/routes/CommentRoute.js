const DEFAULT_HEADER = require('../util/util.js');
const url = require("url");
const querystring = require("querystring");
const Comment = require("../entities/Comment.js");
const routes = ({
                    commentService
                }) => ({
    '/api/v1/comments:get': async (request, response) => {
        try {
            const parsed = url.parse(request.url);
            let problemId = querystring.parse(parsed.query).problemId
            const comments = await commentService.findAllByProblemId(problemId)
            response.writeHead(200, DEFAULT_HEADER)
            response.write(JSON.stringify(comments))
        } catch (err) {
            response.writeHead(err.errorCode, DEFAULT_HEADER)
            response.write(JSON.stringify({'message': err.message}))
        }
        response.end()
    },

    '/api/v1/comments:post': async (request, response) => {
        try {
            let body = [];
            request.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', async () => {
                const requestBody = JSON.parse(body);
                let comment = new Comment(null, requestBody.student_id, requestBody.message, new Date(), requestBody.problem_id)
                await commentService.create(comment)
            })
            response.writeHead(201, DEFAULT_HEADER)

        } catch (err) {
            //   response.writeHead(err.errorCode, DEFAULT_HEADER)
            response.write(JSON.stringify({'message': err.message}))
        }
        response.end()
    }
})

module.exports = routes