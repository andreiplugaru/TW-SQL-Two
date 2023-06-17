import { ADMIN_STATISTICS_PROBLEMS_ENDPOINT, ADMIN_STATISTICS_USERS_ENDPOINT } from "./endpoints.js";
import { sendJwtFetchRequest, sendJwtFetchRequestWithoutBody } from "./request/request_handler.js";


function guard() {
    if (localStorage.getItem('jwt') === null || localStorage.getItem('role') !== 'ADMIN') {
        window.open("login.html", "_self");
    }
}


//TABEL STATISTICI USERS
const usersTableBody = document.getElementById('statistics-users-body');

async function getUsersTableInfo(){

    let info;
    await sendJwtFetchRequestWithoutBody(ADMIN_STATISTICS_USERS_ENDPOINT, 'GET', localStorage.getItem('jwt'))
        .then(response => response.json())
        .then(data => { info = data });
    displayUsersTableInfo(info);

}

function displayUsersTableInfo(data){
    //primesc {username, pbRezolvate, nrMediuIncercari}
    for(var i = 0; i < data.length; i++){

        const row = document.createElement('tr');
       
        const userCell = document.createElement('td');
        userCell.innerText = data[i].USERNAME;
        userCell.dataset.label='Utilizator';
    
        const problemsCell = document.createElement('td');
        problemsCell.innerText = data[i].SOLVED;
        problemsCell.dataset.label = 'Probleme rezolvate';

        const attemptsCell = document.createElement('td');
        attemptsCell.innerText = data[i].ATTEMPTS;
        attemptsCell.dataset.label = 'Nr mediu de incercari';

        row.appendChild(userCell);
        row.appendChild(problemsCell);
        row.appendChild(attemptsCell);
        usersTableBody.appendChild(row);

    }
}




//TABEL STATISTICI PB
const pbTableBody = document.getElementById('statistics-problems-body');

async function getPbTableInfo(){

    let info;
    await sendJwtFetchRequestWithoutBody(ADMIN_STATISTICS_PROBLEMS_ENDPOINT, 'GET', localStorage.getItem('jwt'))
        .then(response => response.json())
        .then(data => { info = data });
    displayPbTableInfo(info);

}

function displayPbTableInfo(data){
    //primesc {idPb, cerinta, incercariReusite, nrMediuIncercari}
    //ATENTIE LA INTEGRARE LA INK-UL PROBLEMEI: eroare, spuneai ceva ca validezi pentru student
    for(var i = 0; i < data.length; i++){

        const row = document.createElement('tr');
       
        const linkCell = document.createElement('td');
        const anchor = document.createElement('a');
        anchor.href = `problema_rezolvata.html?id=${data[i].ID}`; 
        let text = data[i].REQUIREMENT.substr(0, 30);
        anchor.textContent = text;
        anchor.classList.add('pb');
        anchor.id = 'admin_pb';

        linkCell.appendChild(anchor);
        linkCell.dataset.label='Problema';
    
        const succededCell = document.createElement('td');
        succededCell.innerText = data[i].SOLVED;
        succededCell.dataset.label = 'Incercari reusite';

        const attemptsCell = document.createElement('td');
        attemptsCell.innerText = data[i].ATTEMPTS;
        attemptsCell.dataset.label = 'Nr mediu de incercari';

        row.appendChild(linkCell);
        row.appendChild(succededCell);
        row.appendChild(attemptsCell);
        pbTableBody.appendChild(row);

    }
    const links = document.querySelectorAll('#admin_pb');
    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();

            const url = link.getAttribute('href');
            window.open(url);
        });
    });


}



guard();
await getUsersTableInfo();
await getPbTableInfo();