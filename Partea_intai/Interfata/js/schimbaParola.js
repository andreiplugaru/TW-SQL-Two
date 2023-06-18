import { RECOVERY_PASS_ENDPOINT } from "./endpoints";
import { CHANGE_PASS_ENDPOINT } from "./endpoints";


const recoveryPassForm = document.getElementById('recovery-pass');

recoveryPassForm.addEventListener('submit', onSendMail)

function onSendMail(e){
    e.preventDefault();

    const currentTarget = e.currentTarget;

    const payload = Object.fromEntries(new FormData(currentTarget));

    const request = sendRequest(RECOVERY_PASS_ENDPOINT,"POST", payload);

    request.onreadystatechange = (e) =>{
        if(request.readyState === XMLHttpRequest.DONE){
            const status = request.status;
            const response = JSON.parse(request.response);

           //user logat
            if(status === 200){
                window.location("/modificare_parola");
            }    
        }
    }
}


const changePassForm = document.getElementById('change-pass');
changePassForm.addEventListener('submit', onChangePass)

function onChangePass(e){
    e.preventDefault();

    const currentTarget = e.currentTarget;

    const payload = Object.fromEntries(new FormData(currentTarget));
    
    if (payload.password !== payload.repeatPassword){
        errorTextElement.innerHTML = "Parolele nu corespund";
        return;
    }

    const request = sendRequest(CHANGE_PASS_ENDPOINT, "POST", payload);

    request.onreadystatechange = (e) => {
        if(request.readyState === XMLHttpRequest.DONE){
            const status = request.status;
            const response = JSON.parse(request.response);

            if(status === 200){
                //parola schimbata
                window.location("/login");

            }else{
                //errorTextElement.innerHTML = response.message;
                //ce sa pun aici??
            }
        }
    }
}

