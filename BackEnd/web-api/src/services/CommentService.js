class CommentService {
    constructor(commentRepository, problemService) {
        this.commentRepository = commentRepository
        this.problemService = problemService
    }

    async findAllByProblemId(problemId) {
        await this.problemService.findById(problemId)
        return await this.commentRepository.findAllByProblemId(problemId)
    }

    async create(comment) {
        await this.problemService.findById(comment.problemId)
        return await this.commentRepository.create(comment);
    }


}

module.exports = CommentService;