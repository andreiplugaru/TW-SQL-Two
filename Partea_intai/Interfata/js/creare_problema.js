import { CREATE_PROBLEM_ENDPOINT, CATEGORIES_PROBLEM_ENDPOINT } from "./endpoints.js";
import { sendJwtFetchRequest, sendJwtFetchRequestWithoutBody } from "./request/request_handler.js";

const createPbForm = document.getElementById('create-pb-form');

createPbForm.addEventListener('submit', onSubmit)


async function onSubmit(e){

    e.preventDefault();

    const currentTarget = e.currentTarget;

    const payload = Object.fromEntries(new FormData(currentTarget));
    const spanField = document.getElementById('answer');
    var category = document.getElementById('category');
    var valueCat = category.value;
    payload.solution = spanField.textContent;
    payload.category = valueCat;
    
    const request = await sendJwtFetchRequest(CREATE_PROBLEM_ENDPOINT, 'POST', payload, localStorage.getItem('jwt'));
    let status = request.status;
    //console.log(status);
    if(status == 201){
        window.location.assign("./problema.html");
    }

}

const categoryDropdown = document.getElementById('category');

async function getCategories(){

    const request = await sendJwtFetchRequestWithoutBody(CATEGORIES_PROBLEM_ENDPOINT, 'GET', localStorage.getItem('jwt'));
    const response = await request.json();
    console.log(response);
    for(var i=0; i<response.length; i++){
        
        const optionElement = document.createElement('option');
        optionElement.innerHTML = response[i].NAME;

        categoryDropdown.appendChild(optionElement);
    }


}

await getCategories();