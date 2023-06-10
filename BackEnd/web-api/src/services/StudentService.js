const StudentNotFoundException = require('../exceptions/StudentNotFoundException.js')
class StudentService {
    constructor({
        studentRepository
    }) {
        this.studentRepository = studentRepository
    }
    async findAll() {
        return await this.studentRepository.findAll()
    }
    async findById(id) {
        const response = await this.studentRepository.findById(id)
        if (response === undefined || response.length === 0) {
            throw new StudentNotFoundException(id)
        }
        return response
    }
}

module.exports = StudentService