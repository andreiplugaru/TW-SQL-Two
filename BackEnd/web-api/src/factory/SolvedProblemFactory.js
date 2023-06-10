const SolvedProblemRepository = require('../repositories/SolvedProblemRepository.js')
const StudentRepository = require('../repositories/StudentRepository.js')
const SolvedProblemService = require('../services/SolvedProblemService.js')
const StudentService = require('../services/StudentService.js')
const ProblemService = require('../services/ProblemService.js')
const ProblemRepository = require('../repositories/ProblemRepository.js')
function generateInstance() {
    solvedProblemRepository = new SolvedProblemRepository()
    studentRepository = new StudentRepository()
    studentService = new StudentService({ studentRepository })
    problemRepository = new ProblemRepository()
    problemService = new ProblemService({ problemRepository })
    solvedProblemService = new SolvedProblemService({ solvedProblemRepository, studentService, problemService })
    return solvedProblemService
}

module.exports = {
    generateInstance
}