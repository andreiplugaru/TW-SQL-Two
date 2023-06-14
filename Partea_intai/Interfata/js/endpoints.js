const ENV = "http://localhost:3000";

export const REGISTER_ENDPOINT = ENV + "/api/v1/auth/register";
export const LOGIN_ENDPOINT = ENV + "/api/v1/auth/login";
export const RECOVERY_PASS_ENDPOINT = ENV + "/mock";
export const CHANGE_PASS_ENDPOINT = ENV + "/mock";
export const NEXT_PROBLEM_ENDPOINT = ENV + '/api/v1/problems/next'
export const SEND_SOLUTION_ENDPOINT = ENV + "/api/v1/problems/solved";
export const WRONG_PROBLEM_ENDPOINT = ENV + "/api/v1/problems/wrong";
export const DIFFICULTY_PROBLEM_ENDPOINT = ENV + "/api/v1/problems/difficulty/marker";
export const COMMENTS_PROBLEM_ENDPOINT = ENV + "/api/v1/comments";
export const PUBLISH_COMMENT_PROBLEM_ENDPOINT = ENV + "/api/v1/comments";