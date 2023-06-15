import { CREATE_PROBLEM_ENDPOINT } from "./endpoints.js";
import { sendJwtFetchRequest } from "./request/request_handler.js";

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
    console.log(status);


}