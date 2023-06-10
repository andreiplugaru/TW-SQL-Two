set serveroutput on;


CREATE OR REPLACE PROCEDURE insereaza_pb_rezolvata (p_id_stud IN solved_problems.id_student%type, p_id_pb IN solved_problems.id_problem%type)
AS
    
    v_at_time TIMESTAMP;
    v_pb_deja_rezolvata INTEGER;
    e_pb_deja_rezolvata EXCEPTION;
    e_problema_gresita EXCEPTION;
    PRAGMA exception_init( e_pb_deja_rezolvata, -20002 );
    PRAGMA exception_init( e_problema_gresita, -20003 );
BEGIN
    if problema_urmatoare(p_id_stud) != p_id_pb then
        RAISE e_problema_gresita;
    end if;
    SELECT COUNT(*) INTO v_pb_deja_rezolvata FROM solved_problems
    WHERE id_student = p_id_stud AND id_problem = p_id_pb;
    
    if v_pb_deja_rezolvata = 0 then
        
        v_at_time := TO_TIMESTAMP(TO_CHAR(CURRENT_TIMESTAMP, 'DD/MM/YYYY HH24:MI'), 'DD/MM/YYYY HH24:MI');
       -- DBMS_OUTPUT.PUT_LINE('-------------------------------------------------------');
      --  DBMS_OUTPUT.PUT_LINE('Adaugam in solved_problems: ' || p_id_stud || ' ' || p_id_pb || ' ' || v_at_time);
      --  DBMS_OUTPUT.PUT_LINE('-------------------------------------------------------');
        INSERT INTO solved_problems VALUES (p_id_stud, p_id_pb, v_at_time);
        
    else
      --  DBMS_OUTPUT.PUT_LINE('-------------------------------------------------------');
      --  DBMS_OUTPUT.PUT_LINE('NU PUTEM adauga in solved_problems: ' || p_id_stud || ' ' || p_id_pb || ' ' || v_at_time || ' STUDENTUL DEJA A REZOLVAT PROBLEMA');
      --  DBMS_OUTPUT.PUT_LINE('-------------------------------------------------------');
        RAISE e_pb_deja_rezolvata;
    
    end if;

END;

BEGIN
     insereaza_pb_rezolvata(3,16);    --n-ar trebui sa arunce eroare si ar trebui sa insereze
END;

BEGIN
 insereaza_pb_rezolvata(4, 36);   --ar trebui sa arunce eroare si n-ar trebui sa insereze
END;

SELECT * FROM PROBLEMS;
SELECT * FROM SOLVED_PROBLEMS;

CALL insereaza_pb_rezolvata(3, 17);
SELECT insereaza_pb_rezolvata(3,16) FROM DUAL;













