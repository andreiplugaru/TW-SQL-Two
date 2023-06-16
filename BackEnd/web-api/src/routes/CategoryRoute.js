const {DEFAULT_HEADER} = require('../util/util.js');

const routes = ({
                    categoryService
                }) => ({
    '/api/v1/categories:get': async (request, response) => {
        try {
            const categories = await categoryService.findAll()
            response.writeHead(200, DEFAULT_HEADER)
            response.write(JSON.stringify(categories))
        } catch (err) {
            response.writeHead(err.errorCode, DEFAULT_HEADER)
            response.write(JSON.stringify({'message': err.message}))
        }
        response.end()
    }
})
module.exports = routes