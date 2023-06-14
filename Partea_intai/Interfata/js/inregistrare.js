import { REGISTER_ENDPOINT } from "./endpoints.js";
import { sendRequest } from "./request/request_handler.js"

const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', onRegister);

function onRegister(e) {

    e.preventDefault();

    const currentTarget = e.currentTarget;

    let payload = Object.fromEntries(new FormData(currentTarget));
    if (payload.password !== payload.repeatPassword) {
        errorTextElement.innerHTML = "Parolele nu corespund";
        return;
    }
    let pairs = Object.entries(payload).filter(e => e[0] != 'repeatPassword')
    payload = Object.fromEntries(pairs)
    console.log(payload);
    const errorTextElement = document.getElementById('error-text');
    errorTextElement.innerHTML = '';

    const request = sendRequest(REGISTER_ENDPOINT, "POST", payload);

    request.onreadystatechange = (e) => {
        if (request.readyState === XMLHttpRequest.DONE) {
            const status = request.status;
            const response = JSON.parse(request.response);

            if (status === 201) {
                //user creat
                localStorage.setItem('jwt', response.token);
                localStorage.setItem('role', response.role);

                //gestiune redirectionare catre home in functie de rol
                console.log(response);
                if (response.role === 'student') {
                    window.location("/elev_home");
                } else {
                    window.location("/administrare");
                }

            } else {
                errorTextElement.innerHTML = response.message;
            }
        }
    }


}