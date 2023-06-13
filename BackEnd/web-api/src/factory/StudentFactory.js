const StudentRepository = require('../repositories/StudentRepository.js')
const StudentService = require('../services/StudentService.js')

function generateInstance(userService) {
    studentRepository = new StudentRepository()
    studentService = new StudentService({studentRepository, userService})
    return studentService
}

module.exports = {
    generateInstance
}