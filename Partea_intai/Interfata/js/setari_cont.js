import { USER_SETTINGS_ENDPOINT, USER_PROFILE_INFO_ENDPOINT } from "./endpoints.js"
import { sendJwtFetchRequest, sendJwtFetchRequestWithoutBody } from "./request/request_handler.js"


function guard(){
    if (localStorage.getItem('jwt') === null) {
        window.open("login.html", "_self");
    }
}

//TO DO: ADMIN NU ARE SETTINGS

var menuLinks = document.getElementById('nav-links');
menuLinks.innerHTML = ''; 
var logoLink = document.querySelector('.logo a');

function manageMenu(){

    var userRole = localStorage.getItem('role');

    if(userRole === 'STUDENT'){
        //link-uri pt student
        logoLink.href = 'elev_home.html';
        createLink('help.html', 'Help');
        createLink('profil_elev.html', 'Profil');
        createLink('elev_home.html', 'Acasa');
        createLink('login.html', 'Delogare');
    }else if(userRole === 'ADMIN'){
        logoLink.href = 'administare.html';
        //link-uri admin NU ESTE TESTAT
        createLink('help.html', 'Help');
        createLink('administrare.html', 'Pagina de administrare');
        createLink('login.html', 'Delogare');
    }
}

function createLink(href, text) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    li.appendChild(a);
    menuLinks.appendChild(li);
  }


const settingsForm = document.getElementById('settings-form');
settingsForm.addEventListener('submit', onUpdate);
const errorTextElement = document.getElementById('error-text');


const passwordInput = document.getElementById('password');
const passwordRepeatInput = document.getElementById('password_repeat');

async function onUpdate(e){
    e.preventDefault();

    const currentTarget = e.currentTarget;
    const payload = Object.fromEntries(new FormData(currentTarget));
    console.log(payload);
    //validari parole
    if (passwordInput.value !== passwordRepeatInput.value) {
        errorTextElement.innerHTML = 'Parolele nu coincid!';
        return;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    if(!passwordRegex.test(passwordInput.value)){
        errorTextElement.innerHTML = 'Parola trebuie sa contina cel putin 8 caractere, dintre care: 1 cifra, 1 litera mare, 1 caracter special!';
        return;
    }
     const request = await sendJwtFetchRequest(USER_SETTINGS_ENDPOINT, "PATCH", payload, localStorage.getItem('jwt'));
    let status = request.status;
    if (status === 204) {
        //gestiune redirectionare catre home in functie de rol
        if (localStorage.getItem('role') === 'STUDENT') {
            window.location.assign("./elev_home.html");
            //console.log('am reusit');
        } else {
            window.location.assign("./administrare.html");
        }
    } else {
        const response = await request.json();
        errorTextElement.innerHTML = response.message;
    }

}


async function getUsername(){
    
    errorTextElement.innerHTML = '';
    let info;
    await sendJwtFetchRequestWithoutBody(USER_PROFILE_INFO_ENDPOINT, 'GET', localStorage.getItem('jwt'))
        .then(response => response.json())
        .then(data => { info = data 
                        document.getElementById('username').value = info.username;
                        document.getElementById('first-name').value = info.firstName;
                        document.getElementById('last-name').value = info.lastName;    
                        document.getElementById('email').value = info.email;    

   
                    });
}




guard();
manageMenu();

await getUsername();
