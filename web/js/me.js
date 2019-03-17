//funkcia na vypocet BMI z vahy a vysky
function calculateBMI(height, weight) {
    let BMI = weight / ((height / 100) * (height / 100));
    // console.log("calculate");
    // console.log(height / 100);
    // console.log((height/100) * (height/100));
    return BMI;
}

//nastavenie BMI do stranky
function setBMI(height, weight) {
    let data = document.getElementById("bmi");
    // console.log("hh: " + height);
    let bmi = calculateBMI(height, weight);
    data.innerHTML = bmi.toFixed(2);
    //nastavenie farby cisla pre BMI podla hodnoty BMI
    if (bmi < 18.5) {
        data.classList.add('text-primary');
    }
    if (bmi >= 18.5 && bmi < 25) {
        data.classList.add('text-success');
    }
    if (bmi >= 25 && bmi < 30) {
        data.classList.add('text-secondary');
    }
    if (bmi >= 30 && bmi < 35) {
        data.classList.add('text-warning');
    }
    if (bmi >= 35 && bmi < 40) {
        data.classList.add('text-danger');
    }
    if (bmi >= 40) {
        data.classList.add('text-dark');
    }


}

//nastavenie water intake hodnot do stranky
function setWaterIntake(weight, alreadyDrinked) {
    let drinked = document.getElementById("drinked");
    let remain = document.getElementById("remainToDrink");
    let should = document.getElementById("shouldDrink");
    let progress = document.getElementById("waterProgress");
    //vypocitanie kolko treba vypit vody; na 10kg 300ml vody
    let n = weight / 10;
    n *= 300;

    //nastavenie kolko uz bolo vypite
    drinked.innerHTML = alreadyDrinked;
    //nastavenie kolko treba vypit
    should.innerHTML = n;
    //nastavenie kolko este treba vypit
    if (n - alreadyDrinked > 0) {
        remain.innerHTML = n - alreadyDrinked;
    } else {
        remain.innerHTML = 0;
    }
    let r = alreadyDrinked / (n / 100);
    progress.style.width = r.toFixed(2) + "%";
}

//nastavenie hmotnosti do stranky
function setWeight(weight) {
    let field = document.getElementById("weight");
    field.innerHTML = weight;
}

//nastavenie vysky do stranky
function setHeight(height) {
    let field = document.getElementById("height");
    field.innerHTML = height;
}

//nastavenie veku do stranky
function setAge(age) {
    let field = document.getElementById("age");
    field.innerHTML = age;
}


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

function getLastValueForBMI() {
    let req = "http://itsovy.sk:1203/userinfo";
    var xhttp = new XMLHttpRequest(); // new HttpRequest instance
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let obj = JSON.parse(this.responseText);
            let weight = null;
            let height = null;
            for (var i = obj.length - 1; i >= 0; i--) {
                var obj2 = obj[i];
                if (!(obj2.weight == null) && weight == null) {
                    weight = obj2.weight;
                }
                if (!(obj2.height == null) && height == null) {
                    height = obj2.height;
                }

            }
            if (weight == null) {
                weight = 0;
            }
            if (height == null) {
                height = 0;
            }
            // console.log("h: " + height);
            // console.log("w: " + weight);
            setBMI(height, weight);
        } else {
            setBMI(0, 0);

        }

    };
    xhttp.open("POST", encodeURI(req), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(localStorage.getItem('user'));
}

function getDrinked() {
    let req = "http://itsovy.sk:1203/showdrink";
    var xhttp = new XMLHttpRequest(); // new HttpRequest instance
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let obj = JSON.parse(this.responseText);
            let jsonData = 0;
            for (var i = 0; i < obj.length; i++) {
                var obj2 = obj[i];
                jsonData += obj2.mlOfWater;

            }
            let req2 = "http://itsovy.sk:1203/userinfo";

            var xhttp2 = new XMLHttpRequest(); // new HttpRequest instance
            xhttp2.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let obj = JSON.parse(this.responseText);
                    let weight = null;
                    for (var i = obj.length - 1; i >= 0; i--) {
                        var obj2 = obj[i];
                        if (!(obj2.weight == null) && weight == null) {
                            weight = obj2.weight;
                        }

                    }
                    if (weight == null) {
                        weight = 0;
                    }
                    setWaterIntake(weight, jsonData)


                } else {
                    setWaterIntake(0, 0);

                }
            };
            xhttp2.open("POST", encodeURI(req2), "/json-handler");
            xhttp2.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhttp2.send(localStorage.getItem('user'));


        } else {
            setWaterIntake(0, 0);

        }

    };
    xhttp.open("POST", encodeURI(req), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(localStorage.getItem('user'));
}

function saveDrink() {
    let req = "http://itsovy.sk:1203/drink";
    var xhttp = new XMLHttpRequest(); // new HttpRequest instance
    let drink = document.getElementById("drinkInput");
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            location.reload();
        }

    };
    xhttp.open("POST", encodeURI(req), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    let json = JSON.parse(localStorage.getItem('user'));
    json["water"] = drink.value;
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
