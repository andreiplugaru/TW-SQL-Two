const {DEFAULT_HEADER, errorHandler} = require('../util/util.js');

const routes = ({
                    categoryService
                }) => ({
    '/api/v1/categories:get': async (request, response) => {
        try {
            const categories = await categoryService.findAll()
            response.writeHead(200, DEFAULT_HEADER)
            response.write(JSON.stringify(categories))
        } catch (err) {
          errorHandler(err, response)
        }
        response.end()
    }
})
module.exports = routes