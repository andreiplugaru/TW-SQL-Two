import { REGISTER_ENDPOINT } from "./endpoints";
import { sendRequest } from "./request/request_handler.js"
 
const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', onRegister)

function onRegister(e){

    e.preventDefault();

    const currentTarget = e.currentTarget;

    const payload = Object.fromEntries(new FormData(currentTarget));
    const errorTextElement = document.getElementById('error-text');
    errorTextElement.innerHTML = '';

    if (payload.password !== payload.repeatPassword){
        errorTextElement.innerHTML = "Parolele nu corespund";
        return;
    }

    const request = sendRequest(REGISTER_ENDPOINT, "POST", payload);

    request.onreadystatechange = (e) => {
        if(request.readyState === XMLHttpRequest.DONE){
            const status = request.status;
            const response = JSON.parse(request.response);

            if(status === 200){
                //user created
                localStorage.setItem('jwt',response.token);
                localStorage.setItem('role', response.role);

                //gestiune redirectionare catre home in functie de rol
                if(response.role == 'student'){
                    window.location("/elev_home");
                }else{
                    window.location("/administrare");
                }
            }else{
                errorTextElement.innerHTML = response.message;
            }
        }
    }


}