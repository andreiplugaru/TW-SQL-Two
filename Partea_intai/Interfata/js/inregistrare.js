import { REGISTER_ENDPOINT } from "./endpoints.js";
import { sendRequest } from "./request/request_handler.js"

const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', onRegister);

const errorTextElement = document.getElementById('error-text');
errorTextElement.innerHTML = '';

function onRegister(e) {

    e.preventDefault();

    const currentTarget = e.currentTarget;

    let payload = Object.fromEntries(new FormData(currentTarget));
    if (payload.password !== payload.repeatPassword) {
        errorTextElement.innerHTML = "Parolele nu coincid";
        return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    if(!passwordRegex.test(payload.password)){
        errorTextElement.innerHTML = 'Parola trebuie sa contina cel putin 8 caractere, dintre care: 1 cifra, 1 litera mare, 1 caracter special!';
        return;
    }
    

    const request = sendRequest(REGISTER_ENDPOINT, "POST", payload);

    request.onreadystatechange = (e) => {
        if (request.readyState === XMLHttpRequest.DONE) {
            const status = request.status;
            const response = JSON.parse(request.response); //daca s-a creat user-ul, nu primesc raspuns??

            if (status === 201) {
                //user creat
                // localStorage.setItem('jwt', response.token);
                // localStorage.setItem('role', response.role);

                //gestiune redirectionare catre home in functie de rol
                window.location.assign("../index.html");
            } else {
                errorTextElement.innerHTML = response.message;
            }
        }
    }


}