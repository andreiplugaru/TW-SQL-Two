import { LOGIN_ENDPOINT } from "./endpoints.js";
import { sendRequest } from "./request/request_handler.js"


localStorage.removeItem('jwt');
localStorage.removeItem('role');

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', onLogin)

function onLogin(e) {
    e.preventDefault();

    const currentTarget = e.currentTarget;

    const payload = Object.fromEntries(new FormData(currentTarget));
    const errorTextElement = document.getElementById('error-text');
    errorTextElement.innerText = '';

    const request = sendRequest(LOGIN_ENDPOINT, "POST", payload);
    request.onreadystatechange = (e) => {
        if (request.readyState === XMLHttpRequest.DONE) {
            const status = request.status;
            const response = JSON.parse(request.response);

            //user logat
            if (status === 200) {
                console.log(response);
                localStorage.setItem('jwt', response.token);
                localStorage.setItem('role', response.role);

                //gestiune redirectionare catre home in functie de rol
                if (response.role === 'STUDENT') {
                    window.location.assign("./elev_home.html");
                } else {
                    window.location.assign("./administrare.html");
                }
            } else {
                errorTextElement.innerText = response.message;
            }
        }
    }
}