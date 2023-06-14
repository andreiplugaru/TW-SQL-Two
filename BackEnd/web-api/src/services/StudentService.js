const StudentNotFoundException = require('../exceptions/StudentNotFoundException.js')
class StudentService {
    constructor({
        studentRepository, userService
    }) {
        this.studentRepository = studentRepository
        this.userService = userService
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

    async findByUsername(username) {
        const response = await this.userService.findByUsername(username)
        if (response === undefined || response.length === 0) {
            throw new StudentNotFoundException(username)
        }
        const student = await this.studentRepository.findById(response[0].ID)
        return student
    }
    async createStudent(user){
        let rowId = await this.userService.createUser(user)
        let createdUser = await this.userService.getByRowId(rowId)
        await this.studentRepository.createStudent(createdUser[0].ID)
    }
}

module.exports = StudentService