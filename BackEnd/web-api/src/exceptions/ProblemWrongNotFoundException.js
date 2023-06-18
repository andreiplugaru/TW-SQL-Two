const HttpException = require('./HttpException.js');

class ProblemWrongNotFoundException extends HttpException {
  constructor(problemId) {
    super(`Problem ${problemId} is not marked as wrong`, ProblemWrongNotFoundException, 404);
  }
}

module.exports = ProblemWrongNotFoundException;