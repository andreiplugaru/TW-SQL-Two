import { STUDENT_PROBLEMS_STATISTICS_ENDPOINT } from "./endpoints.js";
import { sendJwtFetchRequest, sendJwtFetchRequestWithoutBody } from "./request/request_handler.js"

function guard() {
    if (localStorage.getItem('jwt') === null || localStorage.getItem('role') !== 'STUDENT') {
        window.open("login.html", "_self");
    }
}

const tableBody = document.getElementById('statistics-body');

async function getTableInfo(){

    let info;
    await sendJwtFetchRequestWithoutBody(STUDENT_PROBLEMS_STATISTICS_ENDPOINT, 'GET', localStorage.getItem('jwt'))
        .then(response => response.json())
        .then(data => { info = data });
    displayTableInfo(info);

}

function displayTableInfo(data){
    //primesc {idPb, cerintaPb, nrIncercariReusite, nrMediuIncercari}
    //ATENTIE LA INTEGRARE
    for(var i = 0; i < data.length; i++){

        const row = document.createElement('tr');
        
        const linkCell = document.createElement('td');
        const anchor = document.createElement('a');
        anchor.href = `problema_rezolvata.html?id=${data[i].ID_PROBLEM}`; 
        let text = data[i].REQUIREMENT.substr(0, 30);
        anchor.textContent = text;
        anchor.classList.add('pb');
        anchor.id = 'statistics_pb';

        linkCell.appendChild(anchor);
        linkCell.dataset.label='Problema';

        const cellSucceded = document.createElement('td');
        cellSucceded.innerText = data[i].ATTEMPTS;
        cellSucceded.dataset.label = 'Incercari reusite';

        const cellMedium = document.createElement('td');
        cellMedium.innerText = data[i].SOLVED;
        cellMedium.dataset.label = 'Nr de incercari';

        row.appendChild(linkCell);
        row.appendChild(cellSucceded);
        row.appendChild(cellMedium);
        tableBody.appendChild(row);

    }

    const links = document.querySelectorAll('#statistics_pb');
    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();

            const url = link.getAttribute('href');
            window.open(url);
        });
    });

}

guard();
await getTableInfo();