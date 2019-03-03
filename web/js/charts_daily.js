(function ($) {
    "use strict";

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


    var xhttp2 = new XMLHttpRequest();


    let not_done2 = [];
    let done2 = [];
    xhttp2.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var json_data = JSON.parse(xhttp2.responseText);
            done2 = json_data["done"];
            not_done2 = json_data["not_done"];

            var ctx = document.getElementById("doughutSteps");
            ctx.height = 250;
            var myChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [done2, not_done2],
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


        }
    };
    xhttp2.open("GET", "https://my-json-server.typicode.com/oleksandra1musatkina/api/remaining_steps", true);
    xhttp2.send();


    var xhttp3 = new XMLHttpRequest();


    let not_done3 = [];
    let done3 = [];
    xhttp3.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var json_data = JSON.parse(xhttp3.responseText);
            done3 = json_data["done"];
            not_done3 = json_data["not_done"];

            var ctx = document.getElementById("doughutMinutes");
            ctx.height = 250;
            var myChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [done3, not_done3],
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


        }
    };
    xhttp3.open("GET", "https://my-json-server.typicode.com/oleksandra1musatkina/api/remaining_minutes", true);
    xhttp3.send();




})(jQuery);
