import { RESOLVED_PROBLEM_ENDPOINT } from "./endpoints.js"
import { sendJwtFetchRequestWithoutBody, sendJwtFetchRequest } from "./request/request_handler.js"

function guard(){
    if (localStorage.getItem('jwt') === null || localStorage.getItem('role') !== 'STUDENT') {
        window.open("login.html", "_self");
    }
}

//PROBLEM INFOS
const problemRequirmentElement = document.getElementById('problem-requirement');
const problemCategoryElement = document.getElementById('problem-category');
const problemSolutionElement = document.getElementById('problem-solution');

async function getProblemInfo() {

    var urlParams = new URLSearchParams(window.location.search);
    var idProblem = urlParams.get('id');

    let problem;
    await sendJwtFetchRequestWithoutBody(RESOLVED_PROBLEM_ENDPOINT +  "?problemId=" + idProblem, 'GET', localStorage.getItem('jwt'))
        .then(response => response.json())
        .then(data => { problem = data });

    
    displayInfo(problem);
}

function displayInfo(data) {
    //ATENTIE LA INTEGRARE
    let problemRequirment = data.requirement;
    let problemCategory = data.category;
    let problemSolution = data.problemSolution;

    problemRequirmentElement.innerHTML = problemRequirment;
    problemCategoryElement.innerText = '<img src="../icons/label.svg" alt="Categorie" width="20" height="20">' + problemCategory;
    problemSolutionElement.value = problemSolution;

}


//PROBLEM COMMENTS
const commentsContainerElement = document.getElementById('problem-comments');
const publishCommForm = document.getElementById('publish-comm');
publishCommForm.addEventListener('submit', onPublishComm);

async function getAllComments() {
    let comments = [];

    var urlParams = new URLSearchParams(window.location.search);
    var idProblem = urlParams.get('id');
    await sendJwtFetchRequestWithoutBody(COMMENTS_PROBLEM_ENDPOINT + "?problemId=" + idProblem, 'GET', localStorage.getItem('jwt'))
        .then(response => response.json())
        .then(data => { comments.push(...data) });
        
    return comments;
}

async function displayComments(){
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
    var urlParams = new URLSearchParams(window.location.search);
    var idProblem = urlParams.get('id');
    var payload = {
        message: commentText,
        problem_id: idProblem
    }

    const request = await sendJwtFetchRequest(PUBLISH_COMMENT_PROBLEM_ENDPOINT, 'POST', payload, localStorage.getItem('jwt'));
    let status = request.status;
    document.getElementById("comment-text").value = "";

    if (status === 201) {
        //comentariu adaugat
        console.log('S-a adaugat comm');
        //refresh lista comentarii
        displayComments();
    } else {
        //comentariu NU s-a adaugat
        console.log('NU s-a adaugat comm');
    }

}


//MANAGE MENU

var menuLinks = document.getElementById('nav-links');
menuLinks.innerHTML = ''; 
var logoLink = document.querySelector('.logo a');

function manageMenu(){

    console.log('im in manageMenu')
    var userRole = localStorage.getItem('role');

    if(userRole === 'STUDENT'){
        //link-uri pt student
        logoLink.href = 'elev_home.html';
        createLink('help.html', 'Help');
        createLink('profil_elev.html', 'Profil');
        createLink('elev_home.html', 'Acasa');
        createLink('login.html', 'Delogare');
    }else if(userRole === 'ADMIN'){
        logoLink.href = 'administare.html';
        //link-uri admin NU ESTE TESTAT
        createLink('help.html', 'Help');
        createLink('administrare.html', 'Pagina de administrare');
        createLink('login.html', 'Delogare');
    }
}

function createLink(href, text) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    li.appendChild(a);
    menuLinks.appendChild(li);
  }

guard();
manageMenu();


await getProblemInfo();
displayComments();



