const DifficultyService = require('../services/DifficultyService.js')
const DifficultyRepository = require('../repositories/DifficultyRepository.js')

function generateInstance() {
    let difficultyRepository = new DifficultyRepository()
    return new DifficultyService(difficultyRepository)
}

module.exports = {generateInstance}