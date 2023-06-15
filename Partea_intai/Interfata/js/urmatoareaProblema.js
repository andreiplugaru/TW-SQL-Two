import {
    DIFFICULTY_PROBLEM_ENDPOINT, NEXT_PROBLEM_ENDPOINT, SEND_SOLUTION_ENDPOINT, WRONG_PROBLEM_ENDPOINT, COMMENTS_PROBLEM_ENDPOINT,
    PUBLISH_COMMENT_PROBLEM_ENDPOINT
} from "./endpoints.js"
import { sendJwtFetchRequest, sendJwtFetchRequestWithoutBody } from "./request/request_handler.js"


function guard() {
    if (localStorage.getItem('jwt') === null || localStorage.getItem('role') !== 'STUDENT') {
        window.open("login.html", "_self");
    }
}

const problemRequirmentElement = document.getElementById('problem-requirement');
const problemCategoryElement = document.getElementById('problem-category');
const problemIdElement = document.getElementById('problem-id');

const errorTextElementSolution = document.getElementById('error-text-solution');
const errorTextElement = document.getElementById('error-text');

const problemForm = document.getElementById('problem-form');
problemForm.addEventListener('submit', onSendSolution);


async function onSendSolution(e) {
    e.preventDefault();
    const solution = document.getElementById('problem-solution');
    const solutionValue = solution.textContent;
    const problemId = problemIdElement.innerHTML;


    var payload = {
        solution: solutionValue,
        id_problem: problemId,
    };
    const request = await sendJwtFetchRequest(SEND_SOLUTION_ENDPOINT, 'POST', payload, localStorage.getItem('jwt'));

    let status = request.status;
    if (status === 201) {

        errorTextElementSolution.innerHTML = '';
        //solutie corecta => afisez butonul de selectare dificultate + problema urmatoare
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
        nextProblemForm.id = 'next-problem-form';
        nextProblemForm.action = 'creare_problema.html';
        const nextProblemButton = document.createElement('button');
        nextProblemButton.className = 'next-problem';
        nextProblemButton.id = 'next-problem-id'
        nextProblemButton.textContent = 'Problema urmatoare';
        nextProblemForm.appendChild(nextProblemButton);
        problemForms.appendChild(nextProblemForm);
        //adaugare event listener pt el
        nextProblemButton.addEventListener('click', onNextProblemButtonClick);
    }
    else if (status === 400) {
        //verficare mesaj pentru a sti daca rezolvarea e corecta {"message":"rezolvarea nu e corecta"}
        const response = await request.json();
        errorTextElementSolution.innerHTML = response.message;
    }
}

async function getNextProblem() {

    errorTextElement.innerHTML = '';
    let problem;

    const request = await sendJwtFetchRequestWithoutBody(NEXT_PROBLEM_ENDPOINT, 'GET', localStorage.getItem('jwt'));
    const response = await request.json();

    let status = request.status;
    if( status === 200) {
        problem = response;
        displayRequirement(problem);
        let form = document.getElementById('next-problem-form')
        if (form !== null) {
            document.getElementById('next-problem-form').remove();
            document.getElementsByClassName('dropdown')[0].remove();
        }
    }else if( status === 400){
        const message = response.message;
        if( message === 'limit exceeded'){
            
            window.location.assign("./creare_problema.html");
        }
    }
}

function displayRequirement(data) {
    let problemRequirment = data.requirement;
    let problemCategory = data.category;
    let problemId = data.id;

    problemRequirmentElement.innerHTML = problemRequirment;
    problemCategoryElement.innerHTML = '<img src="../icons/label.svg" alt="Categorie" width="20" height="20">' + problemCategory;
    problemIdElement.innerHTML = problemId;

    refreshComments();

}

//marcare problema gresita
document.getElementById('mark-wrong-link').addEventListener('click', async function (event) {
    event.preventDefault(); // Prevent the default behavior of the link

    const problemId = problemIdElement.innerHTML;
    const request = await sendJwtFetchRequestWithoutBody(WRONG_PROBLEM_ENDPOINT + "?problemId=" + problemId, 'POST', localStorage.getItem('jwt'))
    let status = request.status;
    //gestionez in fctie de raspuns
    if (status === 201) {
        //mai pot marca atunci iau urm pb
        await getNextProblem();
    } else {
        //afisez ca nu mai poate marca probleme drept gredite
        const errorTextElement = document.getElementById('error-text');
        errorTextElement.innerHTML = 'Nu mai poti marca probleme drept gresite, ai depasit limita. Vei putea marca, dupa ce primesti drepturi de la admin.';
    }
});


//adaugare even listen eri pentru link-uri
function manageDifficulty() {
    const linkUsoaraElement = document.querySelector('.dropdown-content a:nth-child(1)');
    const linkMedieElement = document.querySelector('.dropdown-content a:nth-child(2)');
    const linkGreaElement = document.querySelector('.dropdown-content a:nth-child(3)');
    linkUsoaraElement.addEventListener('click', onDifficultySelected);
    linkMedieElement.addEventListener('click', onDifficultySelected);
    linkGreaElement.addEventListener('click', onDifficultySelected);

}


//gestionare selectare dificultate
async function onDifficultySelected(e) {

    e.preventDefault();

    const selectedDifficulty = e.target.textContent.toUpperCase();
    const problemId = problemIdElement.innerHTML;

    const request = await sendJwtFetchRequest(DIFFICULTY_PROBLEM_ENDPOINT + "?problemId=" + problemId + "&difficulty=" + selectedDifficulty, 'POST', null, localStorage.getItem('jwt'));
    let status = request.status;

    if (status === 200) {
        //cerere aprobata
        console.log('S-a marcat problema');
    } else {
        //cerere respinsa
        console.log('Nu s-a marcat problema');
    }
}

//event listener pt Problema urmatoare
function onNextProblemButtonClick(e) {
    e.preventDefault();
    //console.log('click pe Pb urmatoare')
    //TREBUIE VAZUT CAND AFISAM ADAUGA_PB
    document.getElementById("problem-solution").textContent = "";
    getNextProblem();
}


//MANAGE COMENTARII
const commentsContainerElement = document.getElementById('problem-comments');
const publishCommForm = document.getElementById('publish-comm');
publishCommForm.addEventListener('submit', onPublishComm);




//AFISARE COMENTARII
async function getAllComments() {
    let comments = [];

    const problemId = problemIdElement.innerHTML;
    await sendJwtFetchRequestWithoutBody(COMMENTS_PROBLEM_ENDPOINT + "?problemId=" + problemId, 'GET', localStorage.getItem('jwt'))
        .then(response => response.json())
        .then(data => { comments.push(...data) });

    return comments;
}

async function refreshComments() {

    const allComments = await getAllComments();
    const exceptElement = document.getElementsByClassName('comment-box')[0];
    console.log('exceptElement' + exceptElement);
    for (var i = commentsContainerElement.childNodes.length - 1; i >= 0; i--) {
        var child = commentsContainerElement.childNodes[i];
        console.log(child);
        if (child !== exceptElement) {
            commentsContainerElement.removeChild(child);
        }
    }
    for (let i = 0; i < allComments.length; i++) {

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
        userName.innerHTML = allComments[i].student;
        commData.innerHTML = allComments[i].date;
        commentPost.innerHTML = allComments[i].message;

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
async function onPublishComm(e) {
    e.preventDefault();

    var commentText = document.getElementById("comment-text").value;
    const problemId = problemIdElement.innerHTML;
    var payload = {
        message: commentText,
        problem_id: problemId
    }

    const request = await sendJwtFetchRequest(PUBLISH_COMMENT_PROBLEM_ENDPOINT, 'POST', payload, localStorage.getItem('jwt'));
    let status = request.status;
    document.getElementById("comment-text").value = "";

    if (status === 201) {
        //comentariu adaugat
        console.log('S-a adaugat comm');
        //refresh lista comentarii
        refreshComments();
    } else {
        //comentariu NU s-a adaugat
        console.log('NU s-a adaugat comm');
    }

}


guard();
await getNextProblem();
refreshComments();
