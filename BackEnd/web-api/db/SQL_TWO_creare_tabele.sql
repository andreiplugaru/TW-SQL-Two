set serveroutput on;
/

CREATE TABLE users(
id NUMBER(38,0),
email VARCHAR2(30),
password VARCHAR2(255),
firstName VARCHAR2(30),
lastName VARCHAR2(30),
CONSTRAINT PK PRIMARY KEY(ID)
)
/
CREATE TABLE students(
id_user NUMBER(38,0),
no_problems_since_import NUMBER(5),
CONSTRAINT PK_1 PRIMARY KEY(id_user),
CONSTRAINT FK_1 FOREIGN KEY(id_user) REFERENCES users(id)
)
/
CREATE TABLE admins(
id_user NUMBER(38,0),
CONSTRAINT PK_2 PRIMARY KEY(id_user),
CONSTRAINT FK_2 FOREIGN KEY(id_user) REFERENCES users(id)
)
/
CREATE TABLE problem_categories(
id NUMBER(38,0),
name VARCHAR2(100),
CONSTRAINT PK_3 PRIMARY KEY(id)
)
/

CREATE TABLE problem_difficulties(
id NUMBER(38,0),
name VARCHAR2(100),
CONSTRAINT PK_4 PRIMARY KEY(id)
)
/


CREATE TABLE problems(
id NUMBER(38,0),
requirement VARCHAR2(1000),
solution VARCHAR2(500),
id_category NUMBER(38,0),
id_difficulty NUMBER(38,0),
CONSTRAINT PK_5 PRIMARY KEY(id),
CONSTRAINT FK_3 FOREIGN KEY(id_category) REFERENCES problem_categories(id),
CONSTRAINT FK_4 FOREIGN KEY(id_difficulty) REFERENCES problem_difficulties(id)
)
/

CREATE TABLE WRONG_PROBLEMS(
id_student NUMBER(38,0), 
id_problem NUMBER(38,0),
is_validated NUMBER(1,0),

CONSTRAINT PK_6 PRIMARY KEY(id_student,id_problem),
CONSTRAINT FK_5 FOREIGN KEY(id_student) REFERENCES STUDENTS(id_user),
CONSTRAINT FK_6 FOREIGN KEY(id_problem) REFERENCES PROBLEMS(id)
);
/


CREATE TABLE ADDED_PROBLEMS(
	id_user NUMBER(38,0), 
	id_problem NUMBER(38,0),
    at_time TIMESTAMP,
	CONSTRAINT PK_7 PRIMARY KEY(id_user,id_problem),
	CONSTRAINT FK_7 FOREIGN KEY(id_user) REFERENCES USERS(id),
	CONSTRAINT FK_8 FOREIGN KEY(id_problem) REFERENCES PROBLEMS(id)
);
/


CREATE TABLE SOLVED_PROBLEMS(
	id_student NUMBER(38,0), 
	id_problem NUMBER(38,0),
    at_time TIMESTAMP,
	CONSTRAINT PK_8 PRIMARY KEY(id_student,id_problem),
	CONSTRAINT FK_9 FOREIGN KEY(id_student) REFERENCES STUDENTS(id_user),
	CONSTRAINT FK_10 FOREIGN KEY(id_problem) REFERENCES PROBLEMS(id)
);
/


CREATE TABLE ATTEMPTS(
	id NUMBER(38,0),
	id_student NUMBER(38,0), 
	id_problem NUMBER(38,0),
	CONSTRAINT PK_9 PRIMARY KEY(id),
	CONSTRAINT FK_11 FOREIGN KEY(id_student) REFERENCES STUDENTS(id_user),
	CONSTRAINT FK_12 FOREIGN KEY(id_problem) REFERENCES PROBLEMS(id)
);
/

CREATE TABLE COMMENTS(
	id NUMBER(38,0),
	id_student NUMBER(38,0), 
	id_problem NUMBER(38,0),
	message VARCHAR2(2000) NOT NULL,
	added_date DATE NOT NULL,
	CONSTRAINT PK_10 PRIMARY KEY(id),
	CONSTRAINT FK_13 FOREIGN KEY(id_student) REFERENCES STUDENTS(id_user),
	CONSTRAINT FK_14 FOREIGN KEY(id_problem) REFERENCES PROBLEMS(id)
);
/

CREATE TABLE MARKED_PROBLEMS (
    id_student NUMBER(38,0), 
	id_problem NUMBER(38,0),
    id_difficulty NUMBER(38,0),
    CONSTRAINT FK_15 FOREIGN KEY(id_student) REFERENCES STUDENTS(id_user),
	CONSTRAINT FK_16 FOREIGN KEY(id_problem) REFERENCES PROBLEMS(id),
    CONSTRAINT FK_17 FOREIGN KEY(id_difficulty) REFERENCES PROBLEM_DIFFICULTIES(id)
);
/

drop table comments;
drop table wrong_problems;
drop table added_problems;
drop table solved_problems;
drop table attempts;
drop table students;
drop table admins;
drop table users;
drop table problems;
drop table problem_categories;
drop table problem_difficulty;



