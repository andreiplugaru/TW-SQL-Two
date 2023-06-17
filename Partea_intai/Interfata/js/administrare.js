import { ADMIN_ACCOUNTS_ENDPOINT, ADMIN_REMOVE_ACCOUNTS_ENDPOINT } from "./endpoints.js";
import { sendJwtFetchRequest, sendJwtFetchRequestWithoutBody } from "./request/request_handler.js"



function guard(){
    if (localStorage.getItem('jwt') === null || localStorage.getItem('role') !== 'ADMIN') {
        window.open("login.html", "_self");
    }
}

const table = document.getElementById('accounts-table');
const tableBody = document.getElementById('accounts-body');
table.addEventListener('click', onDeleteRow);

async function getAccounts(){
    let info;
    await sendJwtFetchRequestWithoutBody(ADMIN_ACCOUNTS_ENDPOINT, 'GET', localStorage.getItem('jwt'))
        .then(response => response.json())
        .then(data => { info = data });
    displayAccounts(info);
}



function displayAccounts(data){
    //primesc {idStud, userNameStud, emailStud}
    //ATENTIE LA INTEGRARE
    for(var i = 0; i < data.length; i++){

        const row = document.createElement('tr');
        
        const userCell = document.createElement('td');
        userCell.innerText = data[i].username;
        userCell.dataset.label='Utilizator';

        const emailCell = document.createElement('td');
        emailCell.innerText = data[i].email;
        emailCell.dataset.label = 'E-mail';

        const buttonCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'STERGE';
        deleteButton.classList.add('btn');
        deleteButton.style.border = 'none';
        deleteButton.style.borderRadius = '8px';
        deleteButton.style.cursor = 'pointer';
        deleteButton.dataset.userId = data[i].id; //pt ca am asta aici
        buttonCell.appendChild(deleteButton);
        buttonCell.dataset.label = 'Actiune'

        row.appendChild(userCell);
        row.appendChild(emailCell);
        row.appendChild(buttonCell);
        tableBody.appendChild(row);

    }
}

async function onDeleteRow(e){

    e.preventDefault();
    if(!e.target.classList.contains('btn')){
        return;
    }

    const deleteBtn = e.target;
    const studentId = deleteBtn.dataset.userId;
    
    const request = await sendJwtFetchRequestWithoutBody(ADMIN_REMOVE_ACCOUNTS_ENDPOINT + "?userId=" + studentId, 'DELETE', localStorage.getItem('jwt'))
    const status = request.status;
    if(status === 204){
        resetTable();
        getAccounts();
    }else{
        console.log("cererea de stergere cont nu a functionat");
    }
    
}


function resetTable(){
    while(tableBody.firstChild){
        tableBody.removeChild(tableBody.firstChild);
    }
}



guard();
await getAccounts();