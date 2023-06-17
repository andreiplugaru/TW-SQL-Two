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
export const STUDENT_PROFILE_INFO_ENDPOINT = ENV + "/api/v1/students"; 
export const STUDENT_RESOLVED_PROBLEMS_ENDPOINT = ENV + "/api/v1/problems/solved";
export const STUDENT_MARKED_PROBLEMS_ENDPOINT = ENV + "/api/v1/problems/marked";
export const STUDENT_SUGGESTED_PROBLEMS_ENDPOINT = ENV + "/api/v1/problems/proposed";
export const RESOLVED_PROBLEM_ENDPOINT = ENV + "/api/v1/problems/student/solved/info";
export const CREATE_PROBLEM_ENDPOINT = ENV + "/api/v1/problems";
export const CATEGORIES_PROBLEM_ENDPOINT = ENV + "/api/v1/categories";
export const STUDENT_PROBLEMS_STATISTICS_ENDPOINT = ENV + "/api/v1/problems/statistics";
export const USER_SETTINGS_ENDPOINT = ENV + "/api/v1/users";
export const USER_PROFILE_INFO_ENDPOINT = ENV + "/api/v1/users";
export const ADMIN_ACCOUNTS_ENDPOINT = ENV + "/api/v1/users/all";
export const ADMIN_REMOVE_ACCOUNTS_ENDPOINT = ENV + "/api/v1/users";
export const ADMIN_PROBLEMS_ENDPOINT = ENV + "/api/v1/problems/all";
export const ADMIN_REMOVE_PROBLEMS_ENDPOINT = ENV + "/api/v1/problems";
export const ADMIN_WRONG_PROBLEMS_ENDPOINT = ENV + "/api/v1/problems/wrong";
export const ADMIN_ACCEPT_WRONG_PROBLEMS_ENDPOINT = ENV + "/api/v1/problems";
export const ADMIN_REJECT_WRONG_PROBLEMS_ENDPOINT = ENV + "/api/v1/problems/wrong";
export const ADMIN_STATISTICS_USERS_ENDPOINT = ENV + "/mock";
export const ADMIN_STATISTICS_PROBLEMS_ENDPOINT = ENV + "/mock";
export const ADMIN_IMPORT_PROBLEMS_ENDPOINT = ENV + "/api/v1/problems/import";
export const ADMIN_EXPORT_PROBLEMS_ENDPOINT = ENV + "/mock";







