var menuLinks = document.getElementById('nav-links');
menuLinks.innerHTML = ''; 
var logoLink = document.querySelector('.logo a');

function manageMenu(){

    console.log('im in manageMenu')
    var userRole = localStorage.getItem('role');


    if(userRole === 'STUDENT'){
        //link-uri pt student
        logoLink.href = 'elev_home.html';
        createLink('help.html', 'Help');
        createLink('profil_elev.html', 'Profil');
        createLink('elev_home.html', 'Acasa');
        createLink('login.html', 'Delogare');
    }else if(userRole === 'ADMIN'){
        //link-uri admin NU ESTE TESTAT
        logoLink.href = 'administrare.html';
        createLink('help.html', 'Help');
        createLink('administrare.html', 'Pagina de administrare');
        createLink('login.html', 'Delogare');
    }else{
        //link-uri help nelogat
        logoLink.href = '../index.html';
        createLink('help.html', 'Help');
        createLink('login.html', 'Logare');
        createLink('inregistrare.html', 'Inregistrare');
        //createLink('../index.html', 'Pagina principala');
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


manageMenu();