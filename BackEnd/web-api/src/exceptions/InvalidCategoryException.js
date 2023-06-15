const HttpException = require('./HttpException.js');

class InvalidCategoryException extends HttpException {
    constructor(category) {
        super(`Category ${category} doesn't exist`, "InvalidCategoryException", 404);
    }
}

module.exports = InvalidCategoryException;