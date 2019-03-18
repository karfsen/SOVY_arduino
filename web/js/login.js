function tryLogin() {
    console.log("check");
    let name = document.getElementById("name").value;
    let password = document.getElementById('password').value;
    let errorDiv = document.getElementById('error');
    errorDiv.innerHTML = " ";
    errorDiv.style.display = "none";

    if (password.length <= 0) {
        errorDiv.style.display = "block";
        errorDiv.innerHTML = "Enter your password!"
    } else {

        if (name.length <= 0) {
            errorDiv.style.display = "block";
            errorDiv.innerHTML = "Enter your name!"
        } else {


            let req = "http://itsovy.sk:1203/login"; // ked ano tak posle to na server a odpoved sa ulozi sa do local storage ako user  ; 1 na konci vymenime na 3 aby sa pripojit na Martina server
            var xhttp = new XMLHttpRequest(); // new HttpRequest instance
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let obj = JSON.parse(this.responseText);
                    console.log(obj);
                    errorDiv.innerHTML = " ";
                    errorDiv.style.display = "none";
                    //ked prisla odpoved z api tak ukladam do localstorage
                    localStorage.setItem('user', JSON.stringify(obj));
                    window.location.replace("index.html");
                } else {
                    errorDiv.style.display = "block";
                    errorDiv.innerHTML = "Name or password not correct!"
                }

            }
            xhttp.open("POST", encodeURI(req), "/json-handler");
            xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            //posielanie zadaneho mene a hesla na api
            xhttp.send(JSON.stringify({
                "username": name, // login => username
                "password": password
            }));
        }
    }
    // alert("asd");

    console.log(name, password);
}


function chceckIfLogged() {
    console.log("hghgh");
    if (localStorage.getItem('user')) {
        window.location.replace("index.html");
    }
}

function flip() {
    $("#fc").closest('.flip-container').toggleClass('hover');
    $("#fc").css('transform, rotateY(180deg)');
}

function register() {
    let name = document.getElementById("registerName").value;
    let password = document.getElementById('registerPassword').value;
    let password2 = document.getElementById('registerPassword2').value;
    let arduinoid = document.getElementById('arduinoid').value;
    let errorDiv = document.getElementById('registerError');
    errorDiv.innerHTML = " ";
    errorDiv.style.display = "none";
    if (password.length < 5 || password.length > 10) {
        errorDiv.style.display = "block";
        errorDiv.innerHTML = "Enter password! (5 - 10 characters long)"
    } else {

        if (name.length < 4 || name.length > 10) {
            errorDiv.style.display = "block";
            errorDiv.innerHTML = "Enter name! (4 - 10 characters long)"
        } else {
            if (password != password2) {
                errorDiv.style.display = "block";
                errorDiv.innerHTML = "Passwords didnt match!"
            } else {
                if (arduinoid.length < 1 || arduinoid.length > 20) {
                    errorDiv.style.display = "block";
                    errorDiv.innerHTML = "Enter arduino id! (1 - 20 characters long)"
                } else {
                    let req = "http://itsovy.sk:1203/register"; // poslle na Martina api meno heslo a arduino id
                    var xhttp = new XMLHttpRequest(); // new HttpRequest instance
                    xhttp.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            // let obj = JSON.parse(this.responseText);
                            console.log(this.responseText);
                            errorDiv.innerHTML = " ";
                            errorDiv.style.display = "none";
                            // localStorage.setItem('user', JSON.stringify(obj));
                            document.getElementById("name").value = name;
                            document.getElementById('password').value = password;
                            // window.location.replace("index.html");
                            tryLogin()
                        } else {
                            errorDiv.style.display = "block";
                            errorDiv.innerHTML = this.responseText;
                            if (this.status == 0) {
                                errorDiv.innerHTML = "Problem with Registration! Try again later.";
                            }
                        }

                    };

                    xhttp.open("POST", encodeURI(req), "/json-handler");
                    xhttp.setRequestHeader("Content-Type", "application/json");

                    //posielanie informacii z registracie na server
                    xhttp.send(JSON.stringify({
                        "username": name,
                        "password": password,
                        "arduinoid": arduinoid
                    }));
                }
            }
        }
    }
}