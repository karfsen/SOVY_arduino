//pri nacitani okna skontrolujeme ci je user prihlaseny
function checkIfLogged() {
    if (!localStorage.getItem('user')) {
        window.location.replace("login.html");
    } else {
        let user = JSON.parse(localStorage.getItem('user'));
        document.getElementById('logName').innerHTML = user.username;
        console.log(JSON.stringify(user));


    }
}

//odstranenie usera z localstore a prepnutie na stranku s loginom
function logout() {
    localStorage.removeItem('user');
    // let req = "http://itsovy.sk:1201/logout";
    // var xhttp = new XMLHttpRequest(); // new HttpRequest instance
    // xhttp.open("POST", encodeURI(req), "/json-handler");
    // // xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    // xhttp.send();
    window.location.replace("login.html");

}
