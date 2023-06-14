import { DIFFICULTY_PROBLEM_ENDPOINT, NEXT_PROBLEM_ENDPOINT, SEND_SOLUTION_ENDPOINT, WRONG_PROBLEM_ENDPOINT, COMMENTS_PROBLEM_ENDPOINT,
    PUBLISH_COMMENT_PROBLEM_ENDPOINT } from "./endpoints.js"
import { sendJwtFetchRequest, sendJwtFetchRequestWithoutBody } from "./request/request_handler.js"

//to do acces pagina doar pt user logati + studenti
//function guard(){
// if (sessionStorage.getItem('jwt') === null || sessionStorage.getItem('role') !== 'STUDENT') {
//     window.open("login.html", "_self");
// }
//}

const problemRequirmentElement = document.getElementById('problem-requirement');
const problemCategoryElement = document.getElementById('problem-category');
const problemIdElement = document.getElementById('problem-id');

const problemForm = document.getElementById('problem-form');
problemForm.addEventListener('submit', onSendSolution);


function onSendSolution(e){
    e.preventDefault();
    const solution = document.getElementById('problem-solution');
    const solutionValue = solution.textContent;
    const problemId=problemIdElement.innerHTML;


    var payload = {
        solution: solutionValue,
        problemId: problemId,
    };
    
    const request = sendJwtFetchRequest(SEND_SOLUTION_ENDPOINT, 'POST', payload, localStorage.getItem('jwt'));
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

                manageDifficulty();                    
                
                //adaugare buton urmatoarea pb
                const problemForms = document.getElementById('problem-forms');
                const nextProblemForm = document.createElement('form');
                nextProblemForm.action = 'creare_problema.html';
                const nextProblemButton = document.createElement('button');
                nextProblemButton.className = 'next-problem';
                nextProblemButton.idName = 'next-problem-id'
                nextProblemButton.textContent = 'Problema urmatoare';
                nextProblemForm.appendChild(nextProblemButton);
                problemForms.appendChild(nextProblemForm);
                //adaugare event listener pt el
                nextProblemButton.addEventListener('click', onNextProblemButtonClick);
            }
        }
    }

}

async function getNextProblem(){

    const request = sendJwtFetchRequestWithoutBody(NEXT_PROBLEM_ENDPOINT,'GET', localStorage.getItem('jwt'));
    request.onreadystatechange = (e) => {
        if (request.readyState === XMLHttpRequest.DONE) {
            const status = request.status;
            const result = JSON.parse(request.response);
            if(status === 200){
                console.log(result);
                displayRequirement(data.results[0]);
            }
        }
    }

    //const result = await sendJwtFetchRequestWithoutBody(NEXT_PROBLEM_ENDPOINT,'GET', localStorage.getItem('jwt'));
    //const data = result.json(); //REZOLVA LA INTEGRARE
    // console.log(result);
    // displayRequirement(data.results[0]);
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
    const request = sendJwtFetchRequest(WRONG_PROBLEM_ENDPOINT, 'POST', payload, localStorage.getItem('jwt'));
    
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


//adaugare even listen eri pentru link-uri
function manageDifficulty(){
    const linkUsoaraElement = document.querySelector('.dropdown-content a:nth-child(1)');
    const linkMedieElement = document.querySelector('.dropdown-content a:nth-child(2)');
    const linkGreaElement = document.querySelector('.dropdown-content a:nth-child(3)');
    linkUsoaraElement.addEventListener('click', onDifficultySelected);
    linkMedieElement.addEventListener('click', onDifficultySelected);
    linkGreaElement.addEventListener('click', onDifficultySelected);

}


//gestionare selectare dificultate
function onDifficultySelected(e){
    
    e.preventDefault();
  
    const selectedDifficulty = e.target.textContent;
    const problemId = problemIdElement.innerHTML;
    //console.log(selectedDifficulty);
    var payload = {
        problemId: problemId,
        difficulty: selectedDifficulty
    }
   const request = sendJwtFetchRequest(DIFFICULTY_PROBLEM_ENDPOINT, 'POST', payload, localStorage.getItem('jwt'));
   request.onreadystatechange = (e) => {
        if (request.readyState === XMLHttpRequest.DONE) {
            const status = request.status;
            const response = JSON.parse(request.response);

            if (status === 200) {
                //cerere aprobata
                console.log('S-a marcat problema');
            }else{
                //cerere respinsa
                console.log('Nu s-a marcat problema');
            }
        }
    }    
}

//event listener pt Problema urmatoare
function onNextProblemButtonClick(e){
    e.preventDefault();
    //console.log('click pe Pb urmatoare')
    //TREBUIE VAZUT CAND AFISAM ADAUGA_PB
    getNextProblem();
}


//MANAGE COMENTARII
const commentsContainerElement = document.getElementById('problem-comments');
const publishCommForm = document.getElementById('publish-comm');
publishCommForm.addEventListener('submit', onPublishComm);




//AFISARE COMENTARII
async function getAllComments(){
    let comments = [];

    const problemId=problemIdElement.innerHTML;
    var payload = {
        problemId: problemId,
    };

    await sendJwtFetchRequest(COMMENTS_PROBLEM_ENDPOINT, 'GET', payload, localStorage.getItem('jwt'))
            .then(response => response.json())
            .then(data => {comments.push(...data)});
    return comments;

}

async function refreshComments(){

    const allComments = await getAllComments();
    
    for(let i=0; i<allComments.length; i++){
        
        const postComment = document.createElement('div');
        postComment.className = 'post-comment';
        const listComment = document.createElement('div');
        listComment.className = 'list';
        const userComment = document.createElement('div');
        userComment.className = 'user';
        const userMetaComment = document.createElement('div');
        userMetaComment.className = 'user-meta';
        const userName = document.createElement('div');
        userName.className = 'name';
        const commData = document.createElement('div');
        commData.className = 'date';
        const commentPost = document.createElement('div');
        commentPost.className = 'comment-post';
        
        //MODIFICARE LA INTEGRARE
        userName.innerHTML = allComments[i].userName;
        commData.innerHTML = allComments[i].commData;
        commentPost.innerHTML = allComments[i].commText;
        
        userMetaComment.appendChild(userName);
        userMetaComment.appendChild(commData);
        userComment.appendChild(userMetaComment);
        listComment.appendChild(userComment);
        listComment.appendChild(commentPost);
        postComment.appendChild(listComment);
        commentsContainerElement.appendChild(postComment);   
    }
}

//publica comm
function onPublishComm(e){    
    e.preventDefault();

    var commentText = document.getElementById("comment-text").value;
    const problemId = problemIdElement.innerHTML;
    //data
    var currentDate = new Date();
    var options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    var formattedDate = currentDate.toLocaleDateString('en-GB', options);
    var payload = {
        comment: commentText,
        data: formattedDate,
        idProblem: problemId
    }
    //data o luam de pe front sau back??

    const request = sendJwtFetchRequest(PUBLISH_COMMENT_PROBLEM_ENDPOINT, 'POST', payload, localStorage.getItem('jwt'));
    request.onreadystatechange = (e) => {
        if (request.readyState === XMLHttpRequest.DONE) {
            const status = request.status;
            //const response = JSON.parse(request.response);

            if (status === 200) {
                //comentariu adaugat
                console.log('S-a adaugat comm');
                //refresh lista comentarii
                refreshComments();
            }else{
                //comentariu NU s-a adaugat
                console.log('NU s-a adaugat comm');
            }
        }
    }    
    
}


//guard();s
getNextProblem();
refreshComments();
