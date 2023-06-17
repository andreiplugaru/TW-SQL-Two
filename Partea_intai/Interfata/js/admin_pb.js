import { ADMIN_PROBLEMS_ENDPOINT, ADMIN_REMOVE_PROBLEMS_ENDPOINT, ADMIN_WRONG_PROBLEMS_ENDPOINT,
    ADMIN_ACCEPT_WRONG_PROBLEMS_ENDPOINT, ADMIN_REJECT_WRONG_PROBLEMS_ENDPOINT, 
    ADMIN_IMPORT_PROBLEMS_ENDPOINT, ADMIN_EXPORT_PROBLEMS_ENDPOINT } from "./endpoints.js";
import { sendJwtFetchRequest, sendJwtFetchRequestSendFile, sendJwtFetchRequestWithoutBody } from "./request/request_handler.js"


function guard() {
    if (localStorage.getItem('jwt') === null || localStorage.getItem('role') !== 'ADMIN') {
        window.open("login.html", "_self");
    }
}


//TABEL PROBLEME
const pbTable = document.getElementById('pb-table');
const pbTableBody = document.getElementById('pb-table-body');
pbTable.addEventListener('click', onDeleteRowPb);


async function getPbTableInfo(){

    let info;
    await sendJwtFetchRequestWithoutBody(ADMIN_PROBLEMS_ENDPOINT, 'GET', localStorage.getItem('jwt'))
        .then(response => response.json())
        .then(data => { info = data });
    displayPbTableInfo(info);

}

function displayPbTableInfo(data){

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
       
        const buttonCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'STERGE';
        deleteButton.classList.add('btn');
        deleteButton.style.border = 'none';
        deleteButton.style.borderRadius = '8px';
        deleteButton.style.cursor = 'pointer';
        deleteButton.dataset.pbId = data[i].ID; 
        buttonCell.appendChild(deleteButton);
        buttonCell.dataset.label = 'Actiune'

        row.appendChild(linkCell);
        row.appendChild(buttonCell);
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

async function onDeleteRowPb(e){

    e.preventDefault();
    if(!e.target.classList.contains('btn')){
        return;
    }

    const deleteBtn = e.target;
    const pbId = deleteBtn.dataset.pbId;
    
    const request = await sendJwtFetchRequestWithoutBody(ADMIN_REMOVE_PROBLEMS_ENDPOINT + "?problemId=" + pbId, 'DELETE', localStorage.getItem('jwt'))
    const status = request.status;
    if(status === 204){
        resetTablePb();
        getPbTableInfo();
    }else{
        console.log("cererea de stergere pb nu a functionat");
    }
    
}


function resetTablePb(){
    while(pbTableBody.firstChild){
        pbTableBody.removeChild(pbTableBody.firstChild);
    }
}


//TABEL PROBLEME GRESITE 
const wrongPbTable = document.getElementById('wrong-pb-table');
const wrongPbTableBody = document.getElementById('wrong-pb-table-body');
wrongPbTable.addEventListener('click', onAcceptWrongPb);
wrongPbTable.addEventListener('click', onRejectWrongPb);

async function getWrongPbTableInfo(){

    let info;
    await sendJwtFetchRequestWithoutBody(ADMIN_WRONG_PROBLEMS_ENDPOINT, 'GET', localStorage.getItem('jwt'))
        .then(response => response.json())
        .then(data => { info = data });
    displayWrongPbTableInfo(info);

}

function displayWrongPbTableInfo(data){
    //primesc {idPb, cerinta}
    for(var i = 0; i < data.length; i++){

        const row = document.createElement('tr');
       
        const linkCell = document.createElement('td');
        const anchor = document.createElement('a');
        anchor.href = `problema_rezolvata.html?id=${data[i].ID}`; 
        let text = data[i].REQUIREMENT.substr(0, 30);
        anchor.textContent = text;
        anchor.classList.add('pb');
        anchor.id = 'wrong_pb';
        linkCell.appendChild(anchor);
        linkCell.dataset.label='Problema';
       
        const acceptCell = document.createElement('td');
        const acceptButton = document.createElement('button');
        acceptButton.classList.add('btn1');
        acceptButton.dataset.pbId = data[i].ID; 
        acceptCell.appendChild(acceptButton);
        acceptCell.dataset.label = 'Accepta'

        const rejectCell = document.createElement('td');
        const rejectButton = document.createElement('button');
        rejectButton.classList.add('btn2');
        rejectButton.dataset.pbId = data[i].ID; 
        rejectCell.appendChild(rejectButton);
        rejectCell.dataset.label = 'Respinge'

        row.appendChild(linkCell);
        row.appendChild(acceptCell);
        row.appendChild(rejectCell);
        wrongPbTableBody.appendChild(row);

    }

    const links = document.querySelectorAll('#wrong_pb');
    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();

            const url = link.getAttribute('href');
            window.open(url);
        });
    });

}



async function onAcceptWrongPb(e){

    e.preventDefault();
    if(!e.target.classList.contains('btn1')){
        return;
    }

    const acceptBtn = e.target;
    const pbId = acceptBtn.dataset.pbId;

       console.log('am apasat pe accepta pb: ' + pbId);


    const request = await sendJwtFetchRequestWithoutBody(ADMIN_ACCEPT_WRONG_PROBLEMS_ENDPOINT + "?problemId=" + pbId, 'DELETE', localStorage.getItem('jwt'))
    const status = request.status;
    if(status === 204){
        resetWrongTablePb();
        getWrongPbTableInfo();
    }else{
        console.log("cererea de accepta pb gresita nu a functionat");
    }
    
}


async function onRejectWrongPb(e){

    e.preventDefault();
    if(!e.target.classList.contains('btn2')){
        return;
    }

    const rejectBtn = e.target;
    const pbId = rejectBtn.dataset.pbId;

       console.log('am apasat pe respinge pb: ' + pbId);


    const request = await sendJwtFetchRequestWithoutBody(ADMIN_REJECT_WRONG_PROBLEMS_ENDPOINT + "?problemId=" + pbId, 'DELETE', localStorage.getItem('jwt'))
    const status = request.status;
    if(status === 204){
        resetWrongTablePb();
        getWrongPbTableInfo();
    }else{
        console.log("cererea de respinge pb gresita nu a functionat");
    }
    
}


function resetWrongTablePb(){
    while(wrongPbTableBody.firstChild){
        wrongPbTableBody.removeChild(wrongPbTableBody.firstChild);
    }
}


//IMPORT
const importLink = document.getElementById('import_link');
importLink.addEventListener('click', async e => {
    e.preventDefault();
    
    const pickerOpts = {
        types: [
            {
                description: "Files",
                accept: {
                    "file/*": [".json"],
                },
            },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
    };

    let fileHandle;
    [fileHandle] = await window.showOpenFilePicker(pickerOpts);
    const file = await fileHandle.getFile();
    const content = await file.text();
    
    const request = await sendJwtFetchRequestSendFile(ADMIN_IMPORT_PROBLEMS_ENDPOINT, 'POST', content, localStorage.getItem('jwt'));
    const status = request.status;
    if( status == 201){
        console.log('am importat');
    }else{
        console.log('NU am importat');

    }
});

//EXPORT JSON
const exportLinkJSON = document.getElementById('export_link_json');
exportLinkJSON.addEventListener('click', async e => {
    e.preventDefault();
  
    var payload = { format: 'json' }

    await sendJwtFetchRequest(ADMIN_EXPORT_PROBLEMS_ENDPOINT, 'GET',payload, localStorage.getItem('jwt'))
        .then(response => response.blob())
        .then( data => {
            var a = document.createElement("a");
            a.href = window.URL.createObjectURL(data);
            a.download = "probleme.json";
            a.click();
        })

});

//EXPORT XML
const exportLinkXML = document.getElementById('export_link_xml');
exportLinkXML.addEventListener('click', async e => {
    e.preventDefault();
    
    var payload = { format: 'xml' }

    await sendJwtFetchRequest(ADMIN_EXPORT_PROBLEMS_ENDPOINT, 'GET',payload, localStorage.getItem('jwt'))
        .then(response => response.blob())
        .then( data => {
            var a = document.createElement("a");
            a.href = window.URL.createObjectURL(data);
            a.download = "probleme.xml";
            a.click();
        })

});


guard();
await getPbTableInfo();
await getWrongPbTableInfo();