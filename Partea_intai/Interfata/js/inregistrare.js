import { REGISTER_ENDPOINT } from "./endpoints.js";
import { sendRequest } from "./request/request_handler.js"

const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', onRegister);

const errorTextElement = document.getElementById('error-text');
errorTextElement.innerText = '';

function onRegister(e) {

    e.preventDefault();

    const currentTarget = e.currentTarget;

    let payload = Object.fromEntries(new FormData(currentTarget));
    if (payload.password !== payload.repeatPassword) {
        errorTextElement.innerText = "Parolele nu coincid";
        return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    if(!passwordRegex.test(payload.password)){
        errorTextElement.innerText = 'Parola trebuie sa contina cel putin 8 caractere, dintre care: 1 cifra, 1 litera mare, 1 caracter special!';
        return;
    }
    

    const request = sendRequest(REGISTER_ENDPOINT, "POST", payload);

    request.onreadystatechange = (e) => {
        if (request.readyState === XMLHttpRequest.DONE) {
            const status = request.status;
            

            if (status === 201) {
                //user creat
                // localStorage.setItem('jwt', response.token);
                // localStorage.setItem('role', response.role);

                //gestiune redirectionare catre home in functie de rol
                window.location.assign("../index.html");
            } else {
                const response = JSON.parse(request.response); 
                errorTextElement.innerText = response.message;
            }
        }
    }


}