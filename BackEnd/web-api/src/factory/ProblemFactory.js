const ProblemRepository = require('../repositories/ProblemRepository.js')
const ProblemService = require('../services/ProblemService.js')

function generateInstance() {
    let problemRepository = new ProblemRepository();
    let problemService = new ProblemService({problemRepository});
    return problemService;
}

module.exports = {generateInstance};