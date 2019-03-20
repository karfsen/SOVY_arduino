function edit(type) {
    let icon = document.getElementById("arduinoidEditIcon");
    let text = document.getElementById("arduinoid");
    let input = document.getElementById("arduinoidInput");
    icon.classList.remove('fa-pen');
    icon.classList.add('fa-save');
    text.style.display = "none";
    input.style.display = "block";
    input.value = text.innerHTML;
    icon.setAttribute("onClick", "save()");

}

function save() {
    let icon = document.getElementById("arduinoidEditIcon");
    let text = document.getElementById("arduinoid");
    let input = document.getElementById("arduinoidInput");
    saveInfo(input.value);
    icon.classList.remove('fa-save');
    icon.classList.add('fa-pen');
    text.innerHTML = input.value;
    input.style.display = "none";
    text.style.display = "block";
    icon.setAttribute("onClick", "edit()");
}


function saveInfo(value) {
    let req = "http://itsovy.sk:1203/changearduino";
    var xhttp = new XMLHttpRequest(); // new HttpRequest instance
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("arduinoid").innerHTML = value;

        } else {
            document.getElementById("arduinoid").innerHTML = this.responseText;

            if (this.status == 0) {
                document.getElementById("arduinoid").innerHTML = "Error saving value! Server problem.";

            }
        }

    };
    xhttp.open("POST", encodeURI(req), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    let json = JSON.parse(localStorage.getItem('user'));
    json["arduinoid"] = value;
    xhttp.send(JSON.stringify(json));
}


function changePassword() {
    let req = "http://itsovy.sk:1203/changePassword";
    var xhttp = new XMLHttpRequest(); // new HttpRequest instance
    let oldPassword = document.getElementById("oldPassword");
    let newPassword = document.getElementById("newPassword");
    let passwordText = document.getElementById("passwordText");
    if (newPassword.value < 5 || newPassword.value > 10) {
        passwordText.innerHTML = "Enter password! (5 - 10 characters long)";
        return;
    }
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            passwordText.innerHTML = "Password changed!";
        } else {
            passwordText.innerHTML = this.responseText;
            if (this.status == 0) {
                passwordText.innerHTML = "Error changing password try later!";
            }
        }

    };
    xhttp.open("POST", encodeURI(req), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    let json = JSON.parse(localStorage.getItem('user'));
    json["oldpassword"] = oldPassword.value;
    json["newpassword"] = newPassword.value;
    xhttp.send(JSON.stringify(json));
}

function getArduinoinfo() {
    let text = document.getElementById("arduinoid");
    let req = "http://itsovy.sk:1203/arduinoinfo";
    var xhttp = new XMLHttpRequest(); // new HttpRequest instance
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let obj = JSON.parse(this.responseText);
            let ai = null;
            ai = obj[0].arduinoid;

            if (ai == null) {
                ai = "not set";
            }
            text.innerHTML = ai;

        } else {
            text.innerHTML = "not set";

        }

    };
    xhttp.open("POST", encodeURI(req), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(localStorage.getItem('user'));
}