console.log(localStorage.getItem('jwt'));
if (localStorage.getItem('jwt') === null) {
    window.open("login.html", "_self");
}