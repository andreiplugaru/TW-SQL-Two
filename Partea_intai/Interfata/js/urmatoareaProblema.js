import { NEXT_PROBLEM_ENDPOINT, SEND_SOLUTION_ENDPOINT, WRONG_PROBLEM_ENDPOINT } from "./endpoints.js"
import { sendJwtFetchRequest } from "./request/request_handler.js"


const problemRequirmentElement = document.getElementById('problem-requirement');
const problemCategoryElement = document.getElementById('problem-category');
const problemIdElement = document.getElementById('problem-id');

const problemForm = document.getElementById('problem-form');
problemForm.addEventListener('submit', onSendSolution);

//trimitere solutie DE TERMINAT
function onSendSolution(e){
    e.preventDefault();
    const solution = document.getElementById('problem-solution');
    const solutionValue = solution.textContent;
    const problemId=problemIdElement.innerHTML;


    var payload = {
        solution: solutionValue,
        problemId: problemId,
    };

    
    const request = sendJwtFetchRequest(SEND_SOLUTION_ENDPOINT, POST, payload, jwt);
    request.onreadystatechange = (e) => {
        if (request.readyState === XMLHttpRequest.DONE) {
            const status = request.status;
            const response = JSON.parse(request.response);

            //solutie corecta => afisez butonul de selectare dificultate + problema urmatoare
            if (status === 200) {
                
                //construire buton dificultate
                const problemMarkingElement = document.querySelector('.problem-marking');
                const dropdownElement = document.createElement('div');
                dropdownElement.className = 'dropdown';
                
                const buttonElement = document.createElement('button');
                buttonElement.className = 'dropbtn';
                buttonElement.textContent = 'Selectare dificultate';
                dropdownElement.appendChild(buttonElement);
                const dropdownContentElement = document.createElement('div');
                dropdownContentElement.className = 'dropdown-content';

                //adaugare link-uri
                const linkUsoaraElement = document.createElement('a');
                linkUsoaraElement.href = '#';
                linkUsoaraElement.textContent = 'Usoara';
                dropdownContentElement.appendChild(linkUsoaraElement);

                const linkMedieElement = document.createElement('a');
                linkMedieElement.href = '#';
                linkMedieElement.textContent = 'Medie';
                dropdownContentElement.appendChild(linkMedieElement);

                const linkGreaElement = document.createElement('a');
                linkGreaElement.href = '#';
                linkGreaElement.textContent = 'Grea';
                dropdownContentElement.appendChild(linkGreaElement);

                dropdownElement.appendChild(dropdownContentElement);
                problemMarkingElement.appendChild(dropdownElement);

                //construire buton urm_pb ????????????




            }
        }
    }

}

async function getNextProblem(){
    //server mock care functiona
    //const result = await fetch(`${NEXT_PROBLEM_ENDPOINT}`); 
    //const data = await result.json();
    
    
    const result = sendJwtFetchRequest(NEXT_PROBLEM_ENDPOINT,'GET',null,localStorage.getItem('jwt'));
    const data = result.json(); //REZOLVA LA INTEGRARE
    //console.log(data.results[0]);
    displayRequirement(data.results[0]);
}

function displayRequirement(data){
    let problemRequirment = data.question;
    let problemCategory = data.category;
    let problemId = data.difficulty; //SCHIMBA LA INTEGRARE

    problemRequirmentElement.innerHTML = problemRequirment;
    problemCategoryElement.innerHTML = problemCategory;
    problemIdElement.innerHTML = problemId;

}

//marcare problema gresita
document.getElementById('mark-wrong-link').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default behavior of the link
    
    const problemId=problemIdElement.innerHTML;
    var payload = {
        problemId: problemId,
    };
    console.log(payload);
    const request = sendJwtFetchRequest(WRONG_PROBLEM_ENDPOINT, POST, payload, jwt);
    
    //gestionez in fctie de raspuns
    request.onreadystatechange = (e) => {
        if (request.readyState === XMLHttpRequest.DONE) {
            const status = request.status;
            const response = JSON.parse(request.response);

            if (status === 200) {
                //mai pot marca atunci iau urm pb
                getNextProblem();
            }else{
                //afisez ca nu mai poate marca probleme drept gredite
                const errorTextElement = document.getElementById('error-text');
                errorTextElement.innerHTML = 'Nu mai poti marca probleme drept gresite, ai depasit limita. Vei putea marca, dupa ce primesti drepturi de la admin.';
            }
        }
    }    
});

getNextProblem();