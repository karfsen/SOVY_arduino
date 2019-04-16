//ziskanie dnesnych krokov usera
function getTodaySteps() {
    let data = document.getElementById("my_today_steps");


    let req = "http://itsovy.sk:1203/getsteps";
    var xhttp = new XMLHttpRequest(); // new HttpRequest instance
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let obj = JSON.parse(this.responseText);
                //zo stiahnuteho JSONu vyberam iba kroky a pocitam ich dokopy
                data.innerHTML = obj[0].todaysteps;

            } else {
                //nastavovanie spravy o chybe ked user nepresiel ziadne kroky. Treba dat prec vsetko za /
                data.innerHTML = this.responseText.split("/")[0];
                if (this.status == 0) {
                    data.innerHTML = "Error getting today steps!";
                }
            }
        }

    };
    xhttp.open("POST", encodeURI(req), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //posielanie informacii o userovi na server aby vedel pre ktoreho usera ma posat odpoved
    xhttp.send(localStorage.getItem('user'));
}

//ziskanie celkovych krokov usera
function getMyOverallSteps() {
    let data = document.getElementById("my_overall_steps");


    let req = "http://itsovy.sk:1203/alltimeuserssteps";
    var xhttp = new XMLHttpRequest(); // new HttpRequest instance
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let obj = JSON.parse(this.responseText);
                let jsonData = 0;
                //zo stiahnuteho JSONu vyberam iba kroky a pocitam ich dokopy
                let username = JSON.parse(localStorage.getItem('user')).username;
                for (var i = 0; i < obj.length; i++) {
                    var obj2 = obj[i];
                    if (obj2.username == username) {
                        jsonData = obj2.sum;
                    }
                }
                data.innerHTML = jsonData;

            } else {
                //nastavovanie spravy o chybe ked user nepresiel ziadne kroky. Treba dat prec vsetko za /
                data.innerHTML = this.responseText.split("/")[0];
                if (this.status == 0) {
                    data.innerHTML = "Error getting all my today steps!";
                }
            }
        }

    };
    xhttp.open("POST", encodeURI(req), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //posielanie informacii o userovi na server aby vedel pre ktoreho usera ma posat odpoved
    xhttp.send();
}

//ziskanie celkovych krokov za dnes
function getOverallTodaySteps() {
    let data = document.getElementById("all_today_steps");


    let req = "http://itsovy.sk:1203/gettodaysteps";
    var xhttp = new XMLHttpRequest(); // new HttpRequest instance
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let obj = JSON.parse(this.responseText);
                let jsonData = 0;
                for (var i = 0; i < obj.length; i++) {
                    var obj2 = obj[i];
                    if (obj2.sumary != null) {
                        jsonData = obj2.sumary;
                    }
                }
                data.innerHTML = jsonData;

            } else {
                //nastavovanie spravy o chybe ked user nepresiel ziadne kroky. Treba dat prec vsetko za /
                data.innerHTML = this.responseText.split("/")[0];
                if (this.status == 0) {
                    data.innerHTML = "Error getting overall today steps!";
                }
            }
        }

    };
    xhttp.open("POST", encodeURI(req), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //posielanie informacii o userovi na server aby vedel pre ktoreho usera ma posat odpoved
    xhttp.send();
}

//ziskanie celkovych krokov usera
function getOverallStepsForEveryUser() {
    let data = document.getElementById("overall_steps_everyone");


    let req = "http://itsovy.sk:1203/alltimeuserssteps";
    var xhttp = new XMLHttpRequest(); // new HttpRequest instance
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let obj = JSON.parse(this.responseText);
                let jsonData = 0;
                //zo stiahnuteho JSONu vyberam iba kroky a pocitam ich dokopy
                for (var i = 0; i < obj.length; i++) {
                    var obj2 = obj[i];
                    jsonData += obj2.sum;
                }
                data.innerHTML = jsonData;

            } else {
                //nastavovanie spravy o chybe ked user nepresiel ziadne kroky. Treba dat prec vsetko za /
                data.innerHTML = this.responseText.split("/")[0];
                if (this.status == 0) {
                    data.innerHTML = "Error getting overall steps for everyone!";
                }
            }
        }

    };
    xhttp.open("POST", encodeURI(req), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //posielanie informacii o userovi na server aby vedel pre ktoreho usera ma posat odpoved
    xhttp.send();
}

//ziskanie krokov pre vsetkych userov za cely cas
function getAllUsersOverallMoveMinutes() { // kontrola mena a hesla ich hodnota
    let data = document.getElementById("all_users_overall_move_minutes");


    let req = "http://itsovy.sk:1203/getalltimeminutes";
    var xhttp = new XMLHttpRequest(); // new HttpRequest instance
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let obj = JSON.parse(this.responseText);
                data.innerHTML = obj.minutes;

            } else {
                data.innerHTML = this.responseText;
                if (this.status == 0) {
                    data.innerHTML = "Error getting all users overall minutes!";
                }
            }
        }

    };
    xhttp.open("POST", encodeURI(req), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //posielanie informacii o userovi na server aby vedel pre ktoreho usera ma posat odpoved
    xhttp.send(localStorage.getItem('user'));
}


//ziskanie krokov pre usera za cely cas
function getUsersOverallMoveMinutes() { // kontrola mena a hesla ich hodnota
    let data = document.getElementById("user_overall_move_minutes");


    let req = "http://itsovy.sk:1203/getuseralltimeminutes";
    var xhttp = new XMLHttpRequest(); // new HttpRequest instance
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let obj = JSON.parse(this.responseText);
                data.innerHTML = obj.minutes;

            } else {
                let obj = null;
                if (this.responseText) {
                    obj = JSON.parse(this.responseText);
                }
                if (obj) {
                    data.innerHTML = obj.minutes;
                } else {
                    data.innerHTML = this.responseText;
                }
                if (this.status == 0) {
                    data.innerHTML = "Error getting all users overall minutes!";
                }
            }
        }

    };
    xhttp.open("POST", encodeURI(req), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //posielanie informacii o userovi na server aby vedel pre ktoreho usera ma posat odpoved
    xhttp.send(localStorage.getItem('user'));
}

//ziskanie krokov pre usera za dnes
function getUserTodayMinutes() { // kontrola mena a hesla ich hodnota
    let data = document.getElementById("my_today_minutes");


    let req = "http://itsovy.sk:1203/getusertodayminutes";
    var xhttp = new XMLHttpRequest(); // new HttpRequest instance
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let obj = JSON.parse(this.responseText);
                let jsonData = 0;
                jsonData = obj.minutes;
                data.innerHTML = jsonData;

            } else {
                data.innerHTML = this.responseText;
                if (this.status == 0) {
                    data.innerHTML = "Error getting today minutes!";
                }
            }
        }

    };
    xhttp.open("POST", encodeURI(req), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //posielanie informacii o userovi na server aby vedel pre ktoreho usera ma posat odpoved
    xhttp.send(localStorage.getItem('user'));
}

//ziskanie krokov pre vsetkych userov za cely cas
function getTodayMinutes() {
    let data = document.getElementById("overall_today_move_minutes");

    let req = "http://itsovy.sk:1203/gettodayminutes";
    var xhttp = new XMLHttpRequest(); // new HttpRequest instance
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let obj = JSON.parse(this.responseText);
                data.innerHTML = obj.minutes;

            } else {
                data.innerHTML = this.responseText;
                if (this.status == 0) {
                    data.innerHTML = "Error getting today overall move minutes";
                }
            }
        }

    };
    xhttp.open("POST", encodeURI(req), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //poslanie poziadavky na api
    xhttp.send();
}

let allTimeHighScore;

function getAllTimeHighScore() {
    var table = document.getElementById("allTimeStepsHighScoreTable");
    let req = "http://itsovy.sk:1203/alltimeuserssteps";
    var xhttp = new XMLHttpRequest(); // new HttpRequest instance
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let obj = JSON.parse(this.responseText);
                // console.log(obj);
                if (JSON.stringify(obj) != JSON.stringify(allTimeHighScore)) {
                    var new_tbody = document.createElement('tbody');
                    new_tbody.id = "allTimeStepsHighScoreTable";


                    allTimeHighScore = obj;
                    let rowIndex = 0;
                    for (var i = 0; i < obj.length; i++) {
                        if (i >= 5) {
                            break;
                        }
                        var obj2 = obj[i];
                        var row = new_tbody.insertRow(rowIndex);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        cell1.innerHTML = obj2.username;
                        cell2.innerHTML = obj2.sum;
                        rowIndex += 1;
                    }

                    table.parentNode.replaceChild(new_tbody, table)
                }

            } else {
                // nastavovanie spravy o chybe ked user nepresiel ziadne kroky. Treba dat prec vsetko za /
            }
        }

    };
    xhttp.open("POST", encodeURI(req), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //posielanie informacii o userovi na server aby vedel pre ktoreho usera ma posat odpoved
    xhttp.send();

}

let todayHighScore;


function getTodayHighScore() {
    var table = document.getElementById("todayStepsHighScoreTable");
    let req = "http://itsovy.sk:1203/alltodaysteps";
    var xhttp = new XMLHttpRequest(); // new HttpRequest instance
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let obj = JSON.parse(this.responseText);
                if (JSON.stringify(obj) != JSON.stringify(todayHighScore)) {
                    var new_tbody = document.createElement('tbody');
                    new_tbody.id = "todayStepsHighScoreTable";
                    todayHighScore = obj;
                    let rowIndex = 0;
                    for (var i = 0; i < obj.length; i++) {
                        if (i >= 5) {
                            break;
                        }
                        var obj2 = obj[i];
                        var row = new_tbody.insertRow(rowIndex);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        cell1.innerHTML = obj2.username;
                        cell2.innerHTML = obj2.todaysteps;
                        rowIndex += 1;
                    }
                    table.parentNode.replaceChild(new_tbody, table)

                }

            } else {
                // nastavovanie spravy o chybe ked user nepresiel ziadne kroky. Treba dat prec vsetko za /
            }
        }

    };
    xhttp.open("POST", encodeURI(req), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //posielanie informacii o userovi na server aby vedel pre ktoreho usera ma posat odpoved
    xhttp.send();

}
