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

    async createStudent(user){
        let rowId = await this.userService.createUser(user)
        let createdUser = await this.userService.getByRowId(rowId)
        await this.studentRepository.createStudent(createdUser[0].ID)
    }
}

module.exports = StudentService