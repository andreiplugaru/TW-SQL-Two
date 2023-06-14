class Comment{
    constructor(id, student, message, date, problemId){
        this.id = id;
        this.student = student;
        this.message = message;
        this.date = date;
        this.problemId = problemId;
    }
}

module.exports = Comment;