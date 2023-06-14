const CommentService = require('../services/CommentService.js')
const CommentRepository = require('../repositories/CommentRepository.js')

function generateInstance(problemService) {
    let commentRepository = new CommentRepository()
    return new CommentService(commentRepository, problemService)
}

module.exports = {generateInstance}