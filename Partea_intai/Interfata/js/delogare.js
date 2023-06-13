
document.addEventListener('DOMContentLoaded',function(){
    var logoutLink = document.getElementById('logout-link');

    if(logoutLink){
        logoutLink.addEventListener('click',function(e){
            e.preventDefault();

            localStorage.removeItem('jwt');
            localStorage.removeItem('role');
        })
    }
});