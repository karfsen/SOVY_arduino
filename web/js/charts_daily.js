(function ($) {
    "use strict";

    //nakreslenie grafu pre pocet splnenych cielov
    var xhttp = new XMLHttpRequest();
    let not_done = [];
    let done = [];
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var json_data = JSON.parse(xhttp.responseText);
            done = json_data["done"];
            not_done = json_data["not_done"];

            var result = [];


            var ctx = document.getElementById("doughutGoals");
            ctx.height = 250;
            var myChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [done, not_done],
                        backgroundColor: [
                            "rgba(0, 194, 146,0.9)",
                            "rgba(194, 0, 0,0.7)",
                        ],
                        hoverBackgroundColor: [
                            "rgba(0, 194, 146,0.7)",
                            "rgba(194, 0, 0,0.7)",
                        ]

                    }],
                    labels: [
                        "Completed goals",
                        "Remaining goals"
                    ]
                },
                options: {
                    responsive: true
                }
            });


        }
    };
    xhttp.open("GET", "https://my-json-server.typicode.com/oleksandra1musatkina/api/daily_goals", true);
    xhttp.send();

//nakreslenie grafu pre splnenie goalu prejdenych krokov
    let req = "http://itsovy.sk:1203/todaysteps";
    var xhttp4 = new XMLHttpRequest(); // new HttpRequest instance
    xhttp4.onreadystatechange = function () {
        console.log("in");
        console.log("status: " + this.status);
        let needed = 1000;
        let done = 0;
        if (this.readyState == 4 && this.status == 200) {
            let obj = JSON.parse(this.responseText);
            // console.log(obj);
            let jsonData = 0;
            for (var i = 0; i < obj.length; i++) {
                var obj2 = obj[i];
                jsonData += obj2.thisSessionSteps;
                // console.log(obj2.thisSessionSteps);
            }
            done = jsonData;

        }
        var ctx = document.getElementById("doughutSteps");
        ctx.height = 250;
        var myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [done, needed - done],
                    backgroundColor: [
                        "rgba(0, 194, 146,0.9)",
                        "rgba(194, 0, 0,0.7)",
                    ],
                    hoverBackgroundColor: [
                        "rgba(0, 194, 146,0.7)",
                        "rgba(194, 0, 0,0.7)",
                    ]

                }],
                labels: [
                    "Steps done",
                    "Steps remaining"
                ]
            },
            options: {
                responsive: true
            }
        });

    };
    xhttp4.open("POST", encodeURI(req), "/json-handler");
    xhttp4.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp4.send(localStorage.getItem('user'));


    //nakreslenie grafu pre splnenie goalu prejdenych minut
    let req2 = "http://itsovy.sk:1203/getusertodayminutes";
    var xhttp5 = new XMLHttpRequest(); // new HttpRequest instance
    xhttp5.onreadystatechange = function () {
        console.log("in");
        console.log("status: " + this.status);
        let needed = 1000;
        let done = 0;
        if (this.readyState == 4 && this.status == 200) {
            let obj = JSON.parse(this.responseText);
            // console.log(obj);
            let jsonData = 0;
            for (var i = 0; i < obj.length; i++) {
                var obj2 = obj[i];
                jsonData += obj2.thisSessionSteps;
                // console.log(obj2.thisSessionSteps);
            }
            done = jsonData;

        }
        var ctx = document.getElementById("doughutMinutes");
        ctx.height = 250;
        var myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [done, needed - done],
                    backgroundColor: [
                        "rgba(0, 194, 146,0.9)",
                        "rgba(194, 0, 0,0.7)",
                    ],
                    hoverBackgroundColor: [
                        "rgba(0, 194, 146,0.7)",
                        "rgba(194, 0, 0,0.7)",
                    ]

                }],
                labels: [
                    "Minutes done",
                    "Minutes remaining"
                ]
            },
            options: {
                responsive: true
            }
        });

    };
    xhttp5.open("POST", encodeURI(req2), "/json-handler");
    xhttp5.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp5.send(localStorage.getItem('user'));

})(jQuery);
