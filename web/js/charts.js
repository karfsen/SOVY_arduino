(function ($) {
    "use strict";


    //Nakreslenie grafu pre kroky usera; zatial napojene na fake api lebo api neide
    var xhttpSteps = new XMLHttpRequest();


    xhttpSteps.onreadystatechange = function () {
        let steps = [];
        let times = [];
        if (this.readyState == 4 && this.status == 200) {
            var json_data = JSON.parse(xhttpSteps.responseText);

            for (var i = 0; i < json_data.length; i++) {
                var obj2 = json_data[i];
                steps.push(obj2.steps);
                let whole = obj2.time.split(' ');
                let d = whole[0].split(".");
                let t = whole[1].split(":");
                let date = new Date(d[2], d[1], d[0], t[0], [1], 0, 0);
                times.push(date.toDateString() + " " + date.toLocaleTimeString());
            }


        }
        var ctx = document.getElementById("lineSteps");
        ctx.height = 150;

        var myChart = new Chart(ctx, {
            type: 'line',
            //data pre graf
            data: {
                labels: times,
                datasets: [
                    {
                        label: "Steps",
                        borderColor: "rgba(123,0,.09)",
                        borderWidth: "1",
                        backgroundColor: "rgba(193, 0, 0, 0.5)",
                        pointHighlightStroke: "rgba(26,179,148,1)",
                        data: steps,
                        lineTension: 0

                    }
                ]
            },
            options: {
                responsive: true,
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                }

            }
        });
    };
    console.log("test");

    xhttpSteps.open("POST", encodeURI("http://itsovy.sk:1203/todaysteps"), "/json-handler");
    xhttpSteps.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttpSteps.send(localStorage.getItem('user'));

    //Nakreslenie grafu pre water intake usera; zatial napojene na fake api lebo api neide
    var xhttpWather = new XMLHttpRequest();
    xhttpWather.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            //stiahne sa JSON z fake apy a vyberie sa z neho chodenie. to sa pouzilo na water inteke lebo este nie je api
            var json_data = JSON.parse(xhttpWather.responseText);
            let waterIntage = [];
            let times = [];
            for (var i = 0; i < json_data.length; i++) {
                var obj2 = json_data[i];

                // console.log(obj2);
                waterIntage.push(obj2.mlOfWater);
                let whole = obj2.time.split(' ');
                let d = whole[0].split(".");
                let t = whole[1].split(":");
                let date = new Date(d[2], d[1], d[0], t[0], [1], 0, 0);
                times.push(date.toDateString() + " " + date.toLocaleTimeString());
            }

            var ctx = document.getElementById("lineWater"); // vlozenie grafu do id lineDaily
            ctx.height = 250;

            var myChart = new Chart(ctx, {
                type: 'line',
                //data pre graf
                data: {
                    labels: times,
                    datasets: [
                        {
                            label: "Water intake in ml",
                            borderColor: "rgba(123,0,.09)",
                            borderWidth: "1",
                            backgroundColor: "rgba(0, 0, 193, 0.5)",
                            pointHighlightStroke: "rgba(26,179,148,1)",
                            data: waterIntage,
                            lineTension: 0

                        }
                    ]
                },
                options: {
                    // responsive: true,
                    // maintainAspectRatio: false,
                    tooltips: {
                        mode: 'index',
                        intersect: false
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    }

                }
            });


        }
    };

    xhttpWather.open("POST", encodeURI("http://itsovy.sk:1203/showdrink"), "/json-handler");
    xhttpWather.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttpWather.send(localStorage.getItem('user'));


    //nakreslenie grafu na prejdene kroky za rok; na pevno napisane cisla krokov lebo cakam na api
    //
    // let months = [];
    // let stepsPerMonth = [];
    // let xhttp2 = new XMLHttpRequest();
    //
    // xhttp2.onreadystatechange = function () {
    //     if (this.readyState == 4 && this.status == 200) {
    //         // Action to be performed when the document is read;
    //         // console.log(xhttp.responseText);
    //         var json_data = JSON.parse(xhttp2.responseText);
    //         Object.keys(json_data).forEach(function (key) {
    //             months.push(key.toString());
    //             stepsPerMonth.push(json_data[key]);
    //             // console.log('Key : ' + key + ', Value : ' + json_data[key])
    //         })
    //         var result = [];
    //         let arr = ["asd", "as"];
    //         arr.push("asd")
    //         // console.log(months);
    //         // console.log(stepsPerMonth);
    //         // console.log(arr);
    //         var ctx = document.getElementById("lineYear");
    //         ctx.height = 150;
    //         var myChart = new Chart(ctx, {
    //             type: 'line',
    //             data: {
    //                 // labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    //                 // labels: arr,
    //                 labels: months,
    //                 datasets: [
    //                     {
    //                         label: "speps per month",
    //                         borderColor: "rgba(0, 194, 146, 0.9)",
    //                         borderWidth: "1",
    //                         backgroundColor: "rgba(0, 194, 146,0.1)",
    //                         // data: [20, 25, 15, 35, 43, 65, 45, 35, 50]
    //                         data: stepsPerMonth
    //                     },
    //                 ]
    //             },
    //             options: {
    //                 responsive: true,
    //                 tooltips: {
    //                     mode: 'index',
    //                     intersect: false
    //                 },
    //                 hover: {
    //                     mode: 'nearest',
    //                     intersect: true
    //                 }
    //
    //             }
    //         });
    //
    //
    //     }
    // };
    // xhttp2.open("GET", "https://my-json-server.typicode.com/oleksandra1musatkina/api/graf", true);
    // xhttp2.send();


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
        ctx.height = 250;
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
                responsive: true
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
        ctx.height = 250;
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
            console.log(obj);
            doneMinutes = obj.minutes;
            console.log("doneMinutes: " + doneMinutes);
            remainingMinutes = neededMinutes - doneMinutes;
            if (remainingMinutes < 0) {
                remainingMinutes = 0;
            }
            let req = "http://itsovy.sk:1203/getsteps";
            var xhttpSteps = new XMLHttpRequest(); // new HttpRequest instance
            xhttpSteps.onreadystatechange = function () {

                if (this.readyState == 4 && this.status == 200) {
                    let obj = JSON.parse(this.responseText);
                    console.log(obj);
                    doneSteps = obj[0].todaysteps;

                    remainingSteps = neededSteps - doneSteps;
                    if (remainingSteps < 0) {
                        remainingSteps = 0;
                    }
                    console.log(doneSteps);
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