set serveroutput on;

SELECT * FROM users;
SELECT * FROM students;
SELECT * FROM admins;
SELECT * FROM problems;
SELECT * FROM problem_categories;
SELECT * FROM problem_difficulties;
SELECT * FROM map_problem_difficulty;
SELECT * FROM solved_problems;
SELECT * FROM added_problems;
SELECT * FROM wrong_problems;
SELECT * FROM attempts;
SELECT * FROM comments;

SELECT COUNT(*) from problems where id_difficulty=1;
SELECT SYSDATE FROM DUAL;


CREATE OR REPLACE FUNCTION dificultate_disponibila(p_id_stud IN students.id_user%type, p_id_dif IN problem_difficulties.id%type)
RETURN problem_difficulties.id%type AS
    v_nr_optiuni_medie INTEGER;
    v_nr_optiuni_usoara INTEGER;
    v_nr_optiuni_grea INTEGER;
    
    v_return problem_difficulties.id%type;
    
         e_nu_mai_am_probleme EXCEPTION;
    PRAGMA exception_init(e_nu_mai_am_probleme, -20006 );

BEGIN
       SELECT COUNT(*) INTO v_nr_optiuni_usoara 
          FROM problems pb join map_problem_difficulty mpd on pb.id=mpd.id_problem 
          WHERE mpd.id_difficulty = 1 AND
              pb.id NOT IN ( SELECT id_problem FROM solved_problems
                            WHERE id_student=p_id_stud 
                        );          
    
        SELECT COUNT(*) INTO v_nr_optiuni_medie 
          FROM problems pb join map_problem_difficulty mpd on pb.id=mpd.id_problem 
          WHERE mpd.id_difficulty = 2 AND
              pb.id NOT IN ( SELECT id_problem FROM solved_problems
                            WHERE id_student=p_id_stud 
                        );
        
        SELECT COUNT(*) INTO v_nr_optiuni_grea
          FROM problems pb join map_problem_difficulty mpd on pb.id=mpd.id_problem 
          WHERE mpd.id_difficulty = 3 AND
              pb.id NOT IN ( SELECT id_problem FROM solved_problems
                            WHERE id_student=p_id_stud 
                        );          
    
        if p_id_dif = 1 then
            if v_nr_optiuni_medie > 0 then
                v_return := 2;
            elsif v_nr_optiuni_grea > 0 then
                v_return := 3;
            end if;
        elsif p_id_dif = 2 then
            if v_nr_optiuni_grea > 0 then
                v_return := 3;
            elsif v_nr_optiuni_usoara > 0 then
                    v_return := 1;
            end if;
        elsif p_id_dif = 3 then
            if v_nr_optiuni_medie > 0 then
                v_return := 2;
            elsif v_nr_optiuni_usoara > 0 then
                    v_return := 1;
            end if;
        else
            RAISE e_nu_mai_am_probleme;
        end if;

                
    return v_return;

END;



CREATE OR REPLACE FUNCTION problema_de_dificultate(p_id_stud IN students.id_user%type, p_nume_dif IN problem_difficulties.name%type, p_id_dif IN problem_difficulties.id%type )
RETURN problems.requirement%type AS
    v_nr_optiuni NUMBER;
    v_linie_random NUMBER;
    v_id_pb_urm problems.id%type;
    v_enunt_pb_urm problems.requirement%type;
    v_raspuns problems.requirement%type;
    
BEGIN

          SELECT COUNT(*) INTO v_nr_optiuni 
          FROM problems pb join map_problem_difficulty mpd on pb.id=mpd.id_problem 
          WHERE mpd.id_difficulty=p_id_dif AND
              pb.id NOT IN ( SELECT id_problem FROM solved_problems
                            WHERE id_student=p_id_stud 
                        );
                        
          --DACA, CUMVA, AJUNG SA NU AM PROBLEMA DISPONIBILA DIN CATEGORIA DATA, ALEG PRIMA CATEGORIE DISPONIBILA
          if v_nr_optiuni = 0 then
                p_id_dif := dificultate_disponibila(p_id_stud, p_id_dif);
          end if;
                        
         SELECT COUNT(*) INTO v_nr_optiuni 
          FROM problems pb join map_problem_difficulty mpd on pb.id=mpd.id_problem 
          WHERE mpd.id_difficulty=p_id_dif AND
              pb.id NOT IN ( SELECT id_problem FROM solved_problems
                            WHERE id_student=p_id_stud 
                        );
        
        
        --interogãrile ce vor fi propuse spre rezolvare vor fi mereu cele care au mai pu?ine încercãri``
        SELECT id INTO v_id_pb_urm FROM
            ( SELECT pb.id   
              FROM problems pb join map_problem_difficulty mpd on pb.id=mpd.id_problem
                WHERE mpd.id_difficulty = p_id_dif AND
                      pb.id NOT IN ( SELECT id_problem FROM solved_problems
                            WHERE id_student=p_id_stud 
                        )
              ORDER BY 
                ( SELECT SUM(NVL2(id_student,1,0))
                    FROM problems pb join map_problem_difficulty mpd on pb.id=mpd.id_problem
                        left outer join solved_problems sp on pb.id=sp.id_problem
                    GROUP BY pb.id
                    HAVING mpd.id_difficulty = p_id_dif AND
                      pb.id NOT IN ( SELECT id_problem FROM solved_problems
                                        WHERE id_student=p_id_stud 
                                    )
                ) ASC
            )
        WHERE ROWNUM = 1;
       
         
--        v_linie_random := FLOOR(DBMS_RANDOM.VALUE(1, v_nr_optiuni + 1));
--        SELECT id INTO v_id_pb_urm FROM
--            ( SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS nr_linie
--              FROM problems pb join map_problem_difficulty mpd on pb.id=mpd.id_problem 
--                WHERE mpd.id_difficulty = p_id_dif AND
--                      pb.id NOT IN ( SELECT id_problem FROM solved_problems
--                            WHERE id_student=p_id_stud 
--                        )
--            )
--        WHERE nr_linie =  v_linie_random;

        SELECT requirement INTO v_enunt_pb_urm FROM problems
        WHERE id=v_id_pb_urm;
        
        v_raspuns := to_char(v_id_pb_urm);
        
        return v_raspuns;
END;
/

CREATE OR REPLACE FUNCTION problema_urmatoare (p_id_stud IN students.id_user%type)
RETURN problems.requirement%type AS
    
    v_nr_pb_propuse INTEGER;
    
    v_data_ultima_propunere TIMESTAMP;
    v_nr_pb_rez_dupa_ultima_prop INTEGER;
    
    v_raspuns problems.requirement%type;
    v_continua INTEGER;
    
    v_continua_alt_crietriu INTEGER;
    v_nr_pb_ultimele_3_zile INTEGER;
    
    v_id_ultima_dif problem_difficulties.id%type;
    v_ultima_dif problem_difficulties.name%type;
    v_urm_dif problem_difficulties.name%type;
    v_id_urm_dif problem_difficulties.id%type;
    
    v_ultima_pb problems.id%type;
    v_nr_pb_din_ultima_dif NUMBER(4);
    
    v_nr_optiuni NUMBER;
    v_linie_random NUMBER;
    v_id_pb_urm problems.id%type;
    v_enunt_pb_urm problems.requirement%type;
    
       e_limita_rezolvate EXCEPTION;
    PRAGMA exception_init( e_limita_rezolvate, -20001 );
    e_student_inexistent EXCEPTION;
    PRAGMA exception_init(e_student_inexistent, -20004);
    v_exista_student INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_exista_student FROM students WHERE ID_USER = p_id_stud;
    IF v_exista_student = 0 then
        raise e_student_inexistent;
    END IF;
    --TRATARE CAZ: STUDENTUL NU A PROPUS VREO PROBLEME
    SELECT COUNT(*) INTO v_nr_pb_propuse FROM added_problems
    WHERE id_user=p_id_stud;
    
    --DACA NU A PROPUS->NUMAR CATE PB A REZOLVAT PANA IN PREZENT
    if v_nr_pb_propuse = 0 then 
        SELECT COUNT(*) INTO v_nr_pb_rez_dupa_ultima_prop FROM solved_problems
        WHERE id_student=p_id_stud;
    else
        --ALTFEL NUMAR CATE PROBLEME ARE DE LA ULTIMA PROPUNERE
        SELECT at_time INTO v_data_ultima_propunere FROM
        (SELECT at_time from added_problems 
         WHERE id_user = p_id_stud
         ORDER BY at_time DESC)
        WHERE ROWNUM = 1;
        
        SELECT COUNT(*) INTO v_nr_pb_rez_dupa_ultima_prop FROM solved_problems
        WHERE id_student=p_id_stud AND at_time >= v_data_ultima_propunere;
    end if;
    
    if  v_nr_pb_rez_dupa_ultima_prop < 20 then
        v_raspuns := 'lui stud cu id = ' || to_char(p_id_stud) || ' ii mai dam o alta problema';
        v_continua :=1;
    else
         RAISE e_limita_rezolvate;
        v_continua := 0;
    end if;
    
    if v_continua = 1 then
        
        --update dificultati
        gestionare_dinamica_dif();
    
        --gestionare urm pb in fctie de pb rezolvate in ultimele 3 zile
        --aflu cate pb a rezolvat in ultimele 3 zile
        SELECT COUNT(*) INTO v_nr_pb_ultimele_3_zile FROM solved_problems
        WHERE id_student = p_id_stud AND
              at_time <= SYSDATE AND at_time >= SYSDATE - 3;
            
        if v_nr_pb_ultimele_3_zile < 5  then
            v_raspuns := problema_de_dificultate(p_id_stud,'USOARA', 1);
        elsif v_nr_pb_ultimele_3_zile >= 5 AND v_nr_pb_ultimele_3_zile < 10 then
            v_raspuns := problema_de_dificultate(p_id_stud,'MEDIE', 2);
        else
        
            --gestionare pb in fctie de nr de pb rezolvate din fiecare dificultate
            --mai intai gasesc ultima problema rezolvata
            
            --DACA NU A PROPUS->CAUT ULTIMA PB REZOLVATA
            if v_nr_pb_propuse = 0 then
                SELECT id_problem INTO v_ultima_pb FROM 
                (SELECT * from solved_problems
                WHERE id_student = p_id_stud
                ORDER BY at_time DESC)
                WHERE ROWNUM=1;
           else  
           --DACA A PROPUS->CAUT ULTIMA PB REZOLVATA DE LA ULTIMA PROPUNERE
            SELECT id_problem INTO v_ultima_pb FROM 
            (SELECT * from solved_problems
             WHERE id_student = p_id_stud AND at_time > v_data_ultima_propunere
             ORDER BY at_time DESC)
             WHERE ROWNUM=1;
           end if;
             --acum ii aflu dificultatea
             SELECT mpd.id_difficulty INTO v_id_ultima_dif 
             FROM problems pb join map_problem_difficulty mpd on pb.id=mpd.id_problem
             WHERE pb.id=v_ultima_pb;
             
             
             SELECT name INTO v_ultima_dif FROM problem_difficulties
             WHERE id=v_id_ultima_dif;
             
             --acum aflu cate probleme a rezolvat din acea dificultate
             SELECT COUNT(*) INTO v_nr_pb_din_ultima_dif
             from solved_problems sp join problems pb on sp.id_problem=pb.id
                  join map_problem_difficulty mpd on pb.id=mpd.id_problem
                  join problem_difficulties pd on mpd.id_difficulty = pd.id
             WHERE sp.id_student=p_id_stud and pd.id=v_id_ultima_dif; 
            
            --gestionare urmatoarea dificultate in fctie de nr de pb rezolvate din fiecare dificultate
            if v_ultima_dif = 'USOARA' then
                if v_nr_pb_din_ultima_dif <= 15 then
                    v_urm_dif := 'USOARA';
                    v_id_urm_dif :=1;
                else  
                    v_urm_dif := 'MEDIE';
                    v_id_urm_dif :=2;    
                end if;
            elsif v_ultima_dif = 'MEDIE' then
                if v_nr_pb_din_ultima_dif <= 30 then
                    v_urm_dif := 'MEDIE';
                    v_id_urm_dif :=2;
                else  
                    v_urm_dif := 'GREA';
                    v_id_urm_dif :=3;
                end if;
            else 
                v_urm_dif := 'GREA';
                v_id_urm_dif :=3;
            end if;
            
            v_raspuns := problema_de_dificultate(p_id_stud, v_urm_dif, v_id_urm_dif);
        end if;
        
    end if; 
    return v_raspuns;
    
    
END;
/

BEGIN
    
    DBMS_OUTPUT.PUT_LINE('-------------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE(problema_urmatoare(3));
    DBMS_OUTPUT.PUT_LINE('-------------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE(problema_urmatoare(4));
    DBMS_OUTPUT.PUT_LINE('-------------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE(problema_urmatoare(5));

END;

 SELECT * FROM solved_problems WHERE ID_STUDENT = 4; 