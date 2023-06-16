class DifficultyService {
    constructor(difficultyRepository) {
        this.difficultyRepository = difficultyRepository
    }

    async findByName(comment) {
        return await this.difficultyRepository.findByName(comment);
    }
}

module.exports = DifficultyService;