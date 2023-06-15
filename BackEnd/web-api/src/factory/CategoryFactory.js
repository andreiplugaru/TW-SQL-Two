const CategoryService = require('../services/CategoryService.js')
const CategoryRepository = require('../repositories/CategoryRepository.js')

function generateInstance() {
    let categoryRepository = new CategoryRepository()
    return new CategoryService(categoryRepository)
}

module.exports = {generateInstance}