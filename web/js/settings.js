function edit(type) {
    let icon = document.getElementById(type + "EditIcon");
    let text = document.getElementById(type);
    let input = document.getElementById(type + "Input");
    icon.classList.remove('fa-pen');
    icon.classList.add('fa-save');
    text.style.display = "none";
    input.style.display = "block";
    input.value = text.innerHTML;
    icon.setAttribute("onClick", "save(\'" + type + "\')");
    // icon.onclick = save(type);

}

function save(type, value) {
    let icon = document.getElementById(type + "EditIcon");
    let text = document.getElementById(type);
    let input = document.getElementById(type + "Input");
    saveInfo(type, input.value);
    icon.classList.remove('fa-save');
    icon.classList.add('fa-pen');
    text.innerHTML = input.value;
    input.style.display = "none";
    text.style.display = "block";
    icon.setAttribute("onClick", "edit(\'" + type + "\')");
}


function saveInfo(info, value) {
    let req = "http://itsovy.sk:1203/setuserinfo";
    var xhttp = new XMLHttpRequest(); // new HttpRequest instance
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            location.reload();
        } else {
            console.log("zle");
            console.log(this.status);
        }

    };
    xhttp.open("POST", encodeURI(req), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    let json = JSON.parse(localStorage.getItem('user'));
    json[info] = value;
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

function getLastValue(type) {
    let text = document.getElementById(type);
    let req = "http://itsovy.sk:1203/userinfo";
    var xhttp = new XMLHttpRequest(); // new HttpRequest instance
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let obj = JSON.parse(this.responseText);
            let jsonData = null;
            for (var i = obj.length - 1; i >= 0; i--) {
                var obj2 = obj[i];
                // console.log(obj2[type]);
                if (!(obj2[type] == null) && jsonData == null) {
                    jsonData = obj2[type];
                }

            }
            if (jsonData == null) {
                jsonData = 0;
            }
            // console.log("data:" + jsonData);
            text.innerHTML = jsonData;
            // console.log(this.status);
            // console.log(this.responseText);

        } else {
            text.innerHTML = 0;

            // console.log(this.status);
            // console.log(this.responseText);
        }

    };
    xhttp.open("POST", encodeURI(req), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(localStorage.getItem('user'));
}