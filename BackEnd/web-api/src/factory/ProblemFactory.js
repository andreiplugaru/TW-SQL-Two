const ProblemRepository = require('../repositories/ProblemRepository.js')
const ProblemService = require('../services/ProblemService.js')
const CategoryRepository = require('../repositories/CategoryRepository.js')
function generateInstance(difficultyService) {
    let problemRepository = new ProblemRepository();
    let categoryRepository = new CategoryRepository();
    let problemService = new ProblemService({problemRepository, categoryRepository,difficultyService});

    return problemService;
}

module.exports = {generateInstance};