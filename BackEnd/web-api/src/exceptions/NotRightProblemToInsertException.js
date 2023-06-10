class NotRightProblemToInsertException extends Error {
  constructor(problemId, studentId) {
    super(`Student ${studentId} should not solve problem ${problemId}`);
    this.name = 'NotRightProblemToInsertException';
  }
}

module.exports = NotRightProblemToInsertException;