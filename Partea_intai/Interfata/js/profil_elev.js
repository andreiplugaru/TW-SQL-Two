import {
    STUDENT_RESOLVED_PROBLEMS_ENDPOINT, STUDENT_MARKED_PROBLEMS_ENDPOINT, STUDENT_SUGGESTED_PROBLEMS_ENDPOINT,
    STUDENT_PROFILE_INFO_ENDPOINT
} from "./endpoints.js"
import { sendJwtFetchRequestWithoutBody } from "./request/request_handler.js"

function guard() {
    if (localStorage.getItem('jwt') === null || localStorage.getItem('role') !== 'STUDENT') {
        window.open("login.html", "_self");
    }
}


//INFOS PROFIL
const nameElement = document.getElementById('name');
const usernameElement = document.getElementById('username');
const emailElement = document.getElementById('email');
const countResolvedPbElement = document.getElementById('count-resolved-pb');
const countMarkedPbElement = document.getElementById('count-marked-pb');
const countSuggestedPbElement = document.getElementById('count-suggested-pb');

async function getProfileInfo() {

    let info;
    await sendJwtFetchRequestWithoutBody(STUDENT_PROFILE_INFO_ENDPOINT, 'GET', localStorage.getItem('jwt'))
        .then(response => response.json())
        .then(data => { info = data });
    displayInfo(info);


}

function displayInfo(data) {

    let firstName = data.firstName;
    let lastName = data.lastName;
    let username = data.username;
    let email = data.email;
    let countResolvedPb = data.solvedProblems;
    let countMarkedPb = data.markedProblems;
    let countSuggestedPb = data.proposedProblems;

    nameElement.innerHTML = firstName + " " + lastName;
    usernameElement.innerHTML = "Utilizator: " + username;
    emailElement.innerHTML = "E-mail: " + email;
    countResolvedPbElement.innerHTML = "Probleme rezolvate: " + countResolvedPb;
    countMarkedPbElement.innerHTML = "Probleme marcate: " + countMarkedPb;
    countSuggestedPbElement.innerHTML = "Probleme propuse: " + countSuggestedPb;

}



//TABELE
//PB REZOLVATE
async function getResolvedProblems() {

    //primesc id_pb + enunt_pb
    let problems = [];
    await sendJwtFetchRequestWithoutBody(STUDENT_RESOLVED_PROBLEMS_ENDPOINT, 'GET', localStorage.getItem('jwt'))
        .then(response => response.json())
        .then(data => { problems.push(...data) });
    const tableBody = document.getElementById('resolved-problems-body');
    for (var i = 0; i < problems.length; i++) {

        const row = document.createElement('tr');
        const cell = document.createElement('td');
        //imi formez ancora
        const anchor = document.createElement('a');
        anchor.href = `problema_rezolvata.html?id=${problems[i].ID_PROBLEM}`; //IDKKK, MAYBE: problema_rezolvata.html/${problemsId[i]}
        let text = problems[i].REQUIREMENT.substr(0, 30);
        anchor.textContent = text;
        anchor.classList.add('pb');
        anchor.id = 'resolved_pb';

        //construire rand
        cell.dataset.label = 'Probleme rezolvate';
        cell.appendChild(anchor);
        row.appendChild(cell);
        tableBody.appendChild(row);

    }

    //event listener i pentru link-uri
    const links = document.querySelectorAll('#resolved_pb');
    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();

            const url = link.getAttribute('href');
            window.open(url);
        });
    });


}


//PB MARCATE
async function getMarkedProblems() {

    //primesc id_pb + enunt_pb
    let problems = [];
    await sendJwtFetchRequestWithoutBody(STUDENT_MARKED_PROBLEMS_ENDPOINT, 'GET', localStorage.getItem('jwt'))
        .then(response => response.json())
        .then(data => { problems.push(...data) });

    const tableBody = document.getElementById('marked-problems-body');
    for (var i = 0; i < problems.length; i++) {

        const row = document.createElement('tr');
        const cell = document.createElement('td');
        //imi formez ancora
        const anchor = document.createElement('a');
        anchor.href = `problema_rezolvata.html?id=${problems[i].ID_PROBLEM}`; //IDKKK, MAYBE: problema_rezolvata.html/${problemsId[i]}
        let text = problems[i].REQUIREMENT.substr(0, 30);
        anchor.textContent = text;
        anchor.classList.add('pb');
        anchor.id = 'marked_pb';

        //construire rand
        cell.dataset.label = 'Probleme marcate';
        cell.appendChild(anchor);
        row.appendChild(cell);
        tableBody.appendChild(row);

    }

    //event listener i pentru link-uri
    const links = document.querySelectorAll('#marked_pb');
    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();

            const url = link.getAttribute('href');
            window.open(url);
        });
    });


}

//PB PROPUSE
async function getSuggestedProblems() {

    //primesc id_pb + enunt_pb
    let problems = [];
    await sendJwtFetchRequestWithoutBody(STUDENT_SUGGESTED_PROBLEMS_ENDPOINT, 'GET', localStorage.getItem('jwt'))
        .then(response => response.json())
        .then(data => { problems.push(...data) });

    const tableBody = document.getElementById('suggested-problems-body');
    for (var i = 0; i < problems.length; i++) {

        const row = document.createElement('tr');
        const cell = document.createElement('td');
        //imi formez ancora
        const anchor = document.createElement('a');
        anchor.href = `problema_rezolvata.html?id=${problems[i].ID_PROBLEM}`; //IDKKK, MAYBE: problema_rezolvata.html/${problemsId[i]}
        let text = problems[i].REQUIREMENT.substr(0, 30);
        anchor.textContent = text;
        anchor.classList.add('pb');
        anchor.id = 'suggested_pb';

        //construire rand
        cell.dataset.label = 'Probleme propuse';
        cell.appendChild(anchor);
        row.appendChild(cell);
        tableBody.appendChild(row);

    }

    //event listener i pentru link-uri
    const links = document.querySelectorAll('#suggested_pb');
    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();

            const url = link.getAttribute('href');
            window.open(url);
        });
    });


}



guard();
await getProfileInfo();
await getResolvedProblems();
await getMarkedProblems();
await getSuggestedProblems();
