(function ($) {
    "use strict";

//nakreslenie grafu pre splnenie goalu prejdenych krokov
    let req = "http://itsovy.sk:1203/getsteps";
    var xhttp4 = new XMLHttpRequest(); // new HttpRequest instance
    xhttp4.onreadystatechange = function () {
        let needed = 15000;
        let done = 0;
        let remaining = 0;
        if (this.readyState == 4 && this.status == 200) {
            let obj = JSON.parse(this.responseText);
            // console.log(obj);
            done = obj[0].todaysteps;

            remaining = needed - done;
            if (remaining < 0) {
                remaining = 0;
            }
        }
        var ctx = document.getElementById("doughutSteps");
        ctx.height = 200;
        var myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [done, remaining],
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
                responsive: true,
                maintainAspectRatio: true
            }
        });

    };
    xhttp4.open("POST", encodeURI(req), "/json-handler");
    xhttp4.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp4.send(localStorage.getItem('user'));

//Kreslenie goals completed. Ked pojde api nakopirujem tu ten isty graf z daily goals
//     var ctx = document.getElementById("doughutGoals");
//     ctx.height = 250;
//     var myChart = new Chart(ctx, {
//         type: 'doughnut',
//         data: {
//             datasets: [{
//                 data: [2, 4],
//                 backgroundColor: [
//                     "rgba(0, 194, 146,0.9)",
//                     "rgba(194, 0, 0,0.7)",
//                 ],
//                 hoverBackgroundColor: [
//                     "rgba(0, 194, 146,0.7)",
//                     "rgba(194, 0, 0,0.7)",
//                 ]
//
//             }],
//             labels: [
//                 "Completed goals",
//                 "Remaining goals"
//             ]
//         },
//         options: {
//             responsive: true
//         }
//     });


    //nakreslenie grafu pre splnenie goalu minut
    var xhttpMinutes = new XMLHttpRequest(); // new HttpRequest instance
    xhttpMinutes.onreadystatechange = function () {
        let needed = 300;
        let done = 0;
        let remaining = 0;
        if (this.readyState == 4 && this.status == 200) {
            let obj = JSON.parse(this.responseText);
            done = obj.minutes;
            remaining = needed - done;
            if (remaining < 0) {
                remaining = 0;
            }
        }
        var ctx = document.getElementById("doughutMinutes");
        ctx.height = 200;
        var myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [done, remaining],
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
                    "Completed minutes",
                    "Remaining minutes"
                ]
            },
            options: {
                responsive: true
            }
        });

    };
    xhttpMinutes.open("POST", encodeURI("http://itsovy.sk:1203/getusertodayminutes"), "/json-handler");
    xhttpMinutes.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttpMinutes.send(localStorage.getItem('user'));

    //nakreslenie grafu pre splnenie goalu minut
    var xhttpGoals = new XMLHttpRequest(); // new HttpRequest instance
    xhttpGoals.onreadystatechange = function () {
        let neededMinutes = 300;
        let doneMinutes = 0;
        let remainingMinutes = 0;
        let neededSteps = 15000;
        let doneSteps = 0;
        let remainingSteps = 0;
        if (this.readyState == 4 && this.status == 200) {
            let obj = JSON.parse(this.responseText);
            doneMinutes = obj.minutes;
            remainingMinutes = neededMinutes - doneMinutes;
            if (remainingMinutes < 0) {
                remainingMinutes = 0;
            }
            let req = "http://itsovy.sk:1203/getsteps";
            var xhttpSteps = new XMLHttpRequest(); // new HttpRequest instance
            xhttpSteps.onreadystatechange = function () {

                if (this.readyState == 4 && this.status == 200) {
                    let obj = JSON.parse(this.responseText);
                    doneSteps = obj[0].todaysteps;

                    remainingSteps = neededSteps - doneSteps;
                    if (remainingSteps < 0) {
                        remainingSteps = 0;
                    }
                }

                let goalsNeedToBeCompleted = 2;
                let goalsCompleted = 0;
                if (neededMinutes <= doneMinutes) {
                    goalsCompleted++;
                }
                if (neededSteps <= doneSteps) {
                    goalsCompleted++;
                }
                let remainingGoals = goalsNeedToBeCompleted - goalsCompleted;

                var ctx = document.getElementById("doughutGoals");
                ctx.height = 250;
                var myChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: [goalsCompleted, remainingGoals],
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


            };
            xhttpSteps.open("POST", encodeURI(req), "/json-handler");
            xhttpSteps.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhttpSteps.send(localStorage.getItem('user'));
        } else {
            var ctx = document.getElementById("doughutGoals");
            ctx.height = 250;
            var myChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [0, 2],
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

    xhttpGoals.open("POST", encodeURI("http://itsovy.sk:1203/getusertodayminutes"), "/json-handler");
    xhttpGoals.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttpGoals.send(localStorage.getItem('user'));
})(jQuery);
