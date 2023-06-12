create or replace PROCEDURE gestionare_dinamica_dif AS

    CURSOR problema_dificultate IS 
        SELECT id_problem, FLOOR(AVG(id_difficulty))as dificultate FROM MARKED_PROBLEMS
        GROUP BY id_problem;

BEGIN

    for v_iterator in problema_dificultate loop

        UPDATE map_problem_difficulty SET id_difficulty = v_iterator.dificultate 
        WHERE id_problem=v_iterator.id_problem;

    end loop;


 DBMS_OUTPUT.PUT_LINE('!!!*****************************************************!!!');
 DBMS_OUTPUT.PUT_LINE('gestionare dificultati');
 DBMS_OUTPUT.PUT_LINE('!!!*****************************************************!!!');

END;