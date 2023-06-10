const StudentRepository = require('../repositories/StudentRepository.js')
const StudentService = require('../services/StudentService.js')

function generateInstance() {
    studentRepository = new StudentRepository()
    studentService = new StudentService({ studentRepository })
    return studentService
}

module.exports = {
    generateInstance
}