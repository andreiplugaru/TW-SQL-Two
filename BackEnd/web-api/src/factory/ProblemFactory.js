const ProblemRepository = require('../repositories/ProblemRepository.js')
const ProblemService = require('../services/ProblemService.js')
const CategoryRepository = require('../repositories/CategoryRepository.js')
function generateInstance() {
    let problemRepository = new ProblemRepository();
    let categoryRepository = new CategoryRepository();
    let problemService = new ProblemService({problemRepository, categoryRepository});

    return problemService;
}

module.exports = {generateInstance};