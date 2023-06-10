class StudentNotFoundException extends Error {
    constructor(id) {
        super(`Student with id ${id} not found`);
        this.name = 'StudentNotFoundException';
    }
}

module.exports = StudentNotFoundException;