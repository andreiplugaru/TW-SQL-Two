set serveroutput on;

DROP SEQUENCE users_seq;
/
--INSERARE USERS
CREATE SEQUENCE users_seq
    MINVALUE 1
    START WITH 1
    INCREMENT BY 1;

BEGIN
    INSERT INTO users VALUES (users_seq.NEXTVAL, 'admin1@email.com', 'parola1', 'user1', 'admin1');
    INSERT INTO users VALUES (users_seq.NEXTVAL, 'admin2@email.com', 'parola2', 'user2', 'admin2');
    INSERT INTO users VALUES (users_seq.NEXTVAL, 'student1@email.com', 'parola3', 'user3', 'student1');
    INSERT INTO users VALUES (users_seq.NEXTVAL, 'student2@email.com', 'parola4', 'user4', 'student2');
    INSERT INTO users VALUES (users_seq.NEXTVAL, 'student3@email.com', 'parola5', 'user5', 'student3');
    INSERT INTO users VALUES (users_seq.NEXTVAL, 'student4@email.com', 'parola6', 'user6', 'student4');
END;
/


--INSERARE STUDENTS:
BEGIN
    INSERT INTO students VALUES (3, 0);
    INSERT INTO students VALUES (4, 0);
    INSERT INTO students VALUES (5, 0);
    INSERT INTO students VALUES (6, 0);
END;

/
--INSERARE ADMINS
BEGIN
    INSERT INTO admins VALUES (1);
    INSERT INTO admins VALUES (2);
END;

/
--INSERARE PROBLEMS_DIFFICULTIES
BEGIN
    INSERT INTO problem_difficulties VALUES (1, 'USOARA');
    INSERT INTO problem_difficulties VALUES (2, 'MEDIE');
    INSERT INTO problem_difficulties VALUES (3, 'GREA');
END;
/

--INSERARE PROBLEM_CATEGORIES
BEGIN
    INSERT INTO problem_categories VALUES (1, 'JOIN');
    INSERT INTO problem_categories VALUES (2, 'GROUP BY');
    INSERT INTO problem_categories VALUES (3, 'ORDER BY');
END;
/

--INSERARE PROBLEMS
DECLARE 
    v_cerinta problems.requirement%type;
    v_solutie problems.solution%type;
    v_id_category problems.id_category%type;
    v_id_difficulty problems.id_difficulty%type;
    v_contor INTEGER  :=0;
BEGIN
    
    for v_contor in 1..90 loop
        v_cerinta := 'cerinta' || v_contor;
        v_solutie := 'solutie' || v_contor;
        
        --CATEGORIA CARE ESTE CEVA HARDCODAT DEOCAMDATA
        if v_contor MOD 3 = 0 then
            v_id_category := 1;
        elsif v_contor MOD 3 = 1 then
            v_id_category := 2;
        else  v_id_category := 3;
        end if;

        --BY DEFAULT O PROBLEMA ESTE CONSIDERATA USOARA, ULTERIOR I SE VA MODIFICA DIFICULTATEA LUAND IN CONSIDERARE MARKED_PROBLEMS
        v_id_difficulty := 1;
        
         --dbms_output.put_line(v_cerinta || ' ' || v_soluie);
        
        INSERT INTO problems VALUES (v_contor, v_cerinta, v_solutie,v_id_category, v_id_difficulty);
       
    end loop;

END;

/

--INSERT INTO WRONG_PROBLEMS
INSERT INTO wrong_problems VALUES (3, 11, 0);

/
--INSERT INTO ADDED_PROBLEMS
INSERT INTO added_problems VALUES (3, 1, TO_TIMESTAMP('05/02/2023 13:00', 'DD/MM/YYYY HH24:MI'));
INSERT INTO added_problems VALUES (4, 2, TO_TIMESTAMP('20/05/2023 10:30', 'DD/MM/YYYY HH24:MI'));

/

--INSERT INTO SOLVED_PROBLEMS
INSERT INTO solved_problems VALUES (3, 3, TO_TIMESTAMP('01/03/2023 12:00', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (3, 6, TO_TIMESTAMP('01/03/2023 12:01', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (3, 9, TO_TIMESTAMP('01/03/2023 12:02', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (3, 12, TO_TIMESTAMP('01/03/2023 12:03', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (3, 15, TO_TIMESTAMP('01/03/2023 12:04', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (3, 18, TO_TIMESTAMP('01/03/2023 12:05', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (3, 21, TO_TIMESTAMP('01/03/2023 12:06', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (3, 24, TO_TIMESTAMP('01/03/2023 12:07', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (3, 27, TO_TIMESTAMP('01/03/2023 12:08', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (3, 30, TO_TIMESTAMP('01/03/2023 12:09', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (3, 33, TO_TIMESTAMP('01/03/2023 12:10', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (3, 36, TO_TIMESTAMP('01/03/2023 12:11', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (3, 29, TO_TIMESTAMP('01/03/2023 12:12', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (3, 42, TO_TIMESTAMP('01/03/2023 12:13', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (3, 45, TO_TIMESTAMP('01/03/2023 12:14', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (3, 1, TO_TIMESTAMP('01/03/2023 12:15', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (3, 4, TO_TIMESTAMP('01/03/2023 12:16', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (3, 7, TO_TIMESTAMP('01/03/2023 12:17', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (3, 10, TO_TIMESTAMP('01/03/2023 12:18', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (3, 13, TO_TIMESTAMP('01/03/2023 12:19', 'DD/MM/YYYY HH24:MI'));


INSERT INTO solved_problems VALUES (4, 3, TO_TIMESTAMP('20/05/2023 12:00', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (4, 6, TO_TIMESTAMP('20/05/2023 12:01', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (4, 9, TO_TIMESTAMP('21/05/2023 12:02', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (4, 12, TO_TIMESTAMP('21/05/2023 12:03', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (4, 15, TO_TIMESTAMP('21/05/2023 12:04', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (4, 18, TO_TIMESTAMP('21/05/2023 12:05', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (4, 21, TO_TIMESTAMP('21/05/2023 12:06', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (4, 24, TO_TIMESTAMP('21/05/2023 12:07', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (4, 27, TO_TIMESTAMP('21/05/2023 12:08', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (4, 30, TO_TIMESTAMP('21/05/2023 12:09', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (4, 33, TO_TIMESTAMP('21/05/2023 12:10', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (4, 36, TO_TIMESTAMP('21/05/2023 12:11', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (4, 29, TO_TIMESTAMP('21/05/2023 12:12', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (4, 42, TO_TIMESTAMP('21/05/2023 12:13', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (4, 45, TO_TIMESTAMP('21/05/2023 12:14', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (4, 1, TO_TIMESTAMP('21/05/2023 12:15', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (4, 4, TO_TIMESTAMP('21/05/2023 12:16', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (4, 7, TO_TIMESTAMP('21/05/2023 12:17', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (4, 10, TO_TIMESTAMP('21/05/2023 12:18', 'DD/MM/YYYY HH24:MI'));


INSERT INTO solved_problems VALUES (5, 1, TO_TIMESTAMP('24/05/2023 12:18', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (5, 4, TO_TIMESTAMP('24/05/2023 12:19', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (5, 7, TO_TIMESTAMP('24/05/2023 12:20', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (5, 10, TO_TIMESTAMP('24/05/2023 12:21', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (5, 13, TO_TIMESTAMP('24/05/2023 12:22', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (5, 16, TO_TIMESTAMP('24/05/2023 12:23', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (5, 19, TO_TIMESTAMP('24/05/2023 12:24', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (5, 22, TO_TIMESTAMP('24/05/2023 12:25', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (5, 25, TO_TIMESTAMP('24/05/2023 12:26', 'DD/MM/YYYY HH24:MI'));
INSERT INTO solved_problems VALUES (5, 28, TO_TIMESTAMP('24/05/2023 12:27', 'DD/MM/YYYY HH24:MI'));

/

SELECT * FROM solved_problems;

--STUD1 (id=3)- n-ar trebui sa primeasca urm pb
--STUD2 (id=4)- ar trebui sa primeasca urm pb si sa fie: USOARA 
--STUD3 (id=5)- ar trebui sa primeasca urm pb si sa fie MEDIE 
    --(in data de 25 mai 2023--acum testez alg, stud cu id=5 are rezolvate in ultimele 3 zile 10 probleme, iar ultima pb rezolvata este din cat MEDIE, iar in total are rez 10 pb din cat MEDIE =>urm pb medie)

--INSERT INTO MARKED_PROBLEMS
INSERT INTO marked_problems VALUES (3,3, 2);
INSERT INTO marked_problems VALUES (3,6, 2);
INSERT INTO marked_problems VALUES (3,9, 2);
INSERT INTO marked_problems VALUES (3,12,2);
INSERT INTO marked_problems VALUES (3,15,2);
INSERT INTO marked_problems VALUES (3,18,2);
INSERT INTO marked_problems VALUES (3,21,2);
INSERT INTO marked_problems VALUES (3,24,3);
INSERT INTO marked_problems VALUES (3,27,3);
INSERT INTO marked_problems VALUES (3,30, 3);
INSERT INTO marked_problems VALUES (3,33, 3);
INSERT INTO marked_problems VALUES (3,36, 3);
INSERT INTO marked_problems VALUES (3,39, 3);
INSERT INTO marked_problems VALUES (3,42, 3);
INSERT INTO marked_problems VALUES (3,45, 3);
INSERT INTO marked_problems VALUES (3,1, 1);
INSERT INTO marked_problems VALUES (3,4, 1);
INSERT INTO marked_problems VALUES (3,7, 1);
INSERT INTO marked_problems VALUES (3,10, 1);
INSERT INTO marked_problems VALUES (3,13, 1);


INSERT INTO marked_problems VALUES (4,3, 3);
INSERT INTO marked_problems VALUES (4,6, 3);
INSERT INTO marked_problems VALUES (4,9, 3);
INSERT INTO marked_problems VALUES (4,12,3);
INSERT INTO marked_problems VALUES (4,15,3);
INSERT INTO marked_problems VALUES (4,18,3);
INSERT INTO marked_problems VALUES (4,21,3);
INSERT INTO marked_problems VALUES (4,24,1);
INSERT INTO marked_problems VALUES (4,27,1);
INSERT INTO marked_problems VALUES (4,30, 1);
INSERT INTO marked_problems VALUES (4,33, 1);
INSERT INTO marked_problems VALUES (4,36, 1);
INSERT INTO marked_problems VALUES (4,39, 1);
INSERT INTO marked_problems VALUES (4,42, 1);
INSERT INTO marked_problems VALUES (4,45, 1);
INSERT INTO marked_problems VALUES (4,1, 2);
INSERT INTO marked_problems VALUES (4,4, 2);
INSERT INTO marked_problems VALUES (4,7, 2);
INSERT INTO marked_problems VALUES (4,10, 2);

INSERT INTO marked_problems VALUES (5,1,1);
INSERT INTO marked_problems VALUES (5,4,1);
INSERT INTO marked_problems VALUES (5,7, 1);
INSERT INTO marked_problems VALUES (5,10, 1);
INSERT INTO marked_problems VALUES (5,13, 2);
INSERT INTO marked_problems VALUES (5,16, 2);
INSERT INTO marked_problems VALUES (5,19, 2);
INSERT INTO marked_problems VALUES (5,22, 3);
INSERT INTO marked_problems VALUES (5,25, 3);
INSERT INTO marked_problems VALUES (5,29, 3);


--INSERT INTO ATTEMPTS:
INSERT INTO attempts VALUES (1,3,4);
SELECT * FROM attempts;

--INSERT INTO COMMENTS:
INSERT INTO comments VALUES (1, 3, 4, 'mesaj1', TO_DATE('21/05/2023', 'DD/MM/YYYY'));

SELECT * FROM comments;






