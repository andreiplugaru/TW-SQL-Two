set serveroutput on;

--->Cand sterg un user: sterg si din students + admins + added_problems
CREATE OR REPLACE TRIGGER delete_user
    BEFORE DELETE ON users
BEGIN
    dbms_output.put_line('Stergem pe userul cu id-ul: ' || :OLD.id_user);
    delete from students where id_user=:OLD.id_user;
    delete from admins where id_user=:OLD.id_user;
    delete from added_problems where id_user=:OLD.id_user;
    delete from users where id_user=:OLD.id_user;
END;


--->Cand sterg un student: sa sterg si din wrong_problems + solved_problems + attempts + comments
CREATE OR REPLACE TRIGGER delete_student
    BEFORE DELETE ON students
BEGIN
    dbms_output.put_line('Stergem pe studentul cu id: ' || :OLD.id_user);
    delete from wrong_problems where id_student = :OLD.id_user;
    delete from solved_problems where id_student = :OLD.id_user;
    delete from attempts where id_student = :OLD.id_user;
    delete from comments where id_student = :OLD.id_user;
    delete from students where id_user = :OLD.id_user;
END;

--->Cand sterg din problems_category: sa sterg si din problems
CREATE OR REPLACE TRIGGER delete_problem_category
    BEFORE DELETE ON problem_categories
BEGIN
    dbms_output.put_line('Stergem categoria cu id: ' || :OLD.id);
    delete from problems where id_category = :OLD.id;
    delete from problem_categories where id = :OLD.id;
END;


--->Cand sterg din problems: sa sterg si din wrong_problems + added_problems + solved_problems + comments + attempts
CREATE OR REPLACE TRIGGER delete_problems
    BEFORE DELETE ON problems
BEGIN
    dbms_output.put_line('Stergem problema cu id: ' || :OLD.id);
    delete from wrong_problems where id_problem = :OLD.id;
    delete from added_problems where id_problem = :OLD.id;
    delete from attempts where id_problem = :OLD.id;
    delete from comments where id_problem = :OLD.id;
    delete from problems where id=:OLD.id;
END;
