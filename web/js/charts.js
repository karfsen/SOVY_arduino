function dailyGoalsGraf() {
    //nakreslenie grafu pre splnenie goalu minut
    var xhttp = new XMLHttpRequest(); // new HttpRequest instance
    xhttp.onreadystatechange = function () {
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
            var xhttp2 = new XMLHttpRequest(); // new HttpRequest instance
            xhttp2.onreadystatechange = function () {

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
                var parent = ctx.parentElement;

                ctx.remove();
                var canv = document.createElement('canvas');
                canv.id = 'doughutGoals';
                parent.appendChild(canv);
                ctx = document.getElementById("doughutGoals");
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
                        responsive: true, responsiveAnimationDuration: 0, animation: {duration: 0}
                    }
                });


            };
            xhttp2.open("POST", encodeURI(req), "/json-handler");
            xhttp2.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhttp2.send(localStorage.getItem('user'));
        } else {
            var ctx = document.getElementById("doughutGoals");
            var parent = ctx.parentElement;

            ctx.remove();
            var canv = document.createElement('canvas');
            canv.id = 'doughutGoals';
            parent.appendChild(canv);
            ctx = document.getElementById("doughutGoals");
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
                    responsive: true, responsiveAnimationDuration: 0, animation: {duration: 0}
                }
            });
        }
    };

    xhttp.open("POST", encodeURI("http://itsovy.sk:1203/getusertodayminutes"), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(localStorage.getItem('user'));

}

function minutesGoalGraph() {
    //nakreslenie grafu pre splnenie goalu minut
    var xhttp = new XMLHttpRequest(); // new HttpRequest instance
    xhttp.onreadystatechange = function () {
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
        var parent = ctx.parentElement;

        ctx.remove();
        var canv = document.createElement('canvas');
        canv.id = 'doughutMinutes';
        parent.appendChild(canv);
        ctx = document.getElementById("doughutMinutes");
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
                responsive: true, responsiveAnimationDuration: 0, animation: {duration: 0}
            }
        });

    };
    xhttp.open("POST", encodeURI("http://itsovy.sk:1203/getusertodayminutes"), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(localStorage.getItem('user'));


}

function stepsGoalGraph() {

//nakreslenie grafu pre splnenie goalu prejdenych krokov
    let req = "http://itsovy.sk:1203/getsteps";
    var xhttp = new XMLHttpRequest(); // new HttpRequest instance
    xhttp.onreadystatechange = function () {
        let needed = 15000;
        let done = 0;
        let remaining = 0;
        if (this.readyState == 4 && this.status == 200) {
            let obj = JSON.parse(this.responseText);
            done = obj[0].todaysteps;

            remaining = needed - done;
            if (remaining < 0) {
                remaining = 0;
            }
        }
        var ctx = document.getElementById("doughutSteps");
        var parent = ctx.parentElement;

        ctx.remove();
        var canv = document.createElement('canvas');
        canv.id = 'doughutSteps';
        parent.appendChild(canv);
        ctx = document.getElementById("doughutSteps");
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
                    "Completed steps",
                    "Remaining steps"
                ]
            },
            options: {
                responsive: true, responsiveAnimationDuration: 0, animation: {duration: 0}
            }
        });

    };
    xhttp.open("POST", encodeURI(req), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(localStorage.getItem('user'));
}


function waterIntakeGraph() {
    //Nakreslenie grafu pre water intake usera; zatial napojene na fake api lebo api neide
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        let waterIntage = [];
        let times = [];
        for (let i = 0; i < 24; i += 1) {
            waterIntage[i] = 0;
            let s = new Date();
            let h = new Date(s.getFullYear(), s.getMonth(), s.getDay(), i);
            times[i] = h.toLocaleTimeString();
        }
        if (this.readyState == 4 && this.status == 200) {
            //stiahne sa JSON z fake apy a vyberie sa z neho chodenie. to sa pouzilo na water inteke lebo este nie je api
            var json_data = JSON.parse(xhttp.responseText);

            for (var i = 0; i < json_data.length; i++) {
                var obj2 = json_data[i];
                let whole = obj2.time.split(' ');
                let t = whole[1].split(":");

                waterIntage[parseInt(t[0])] += obj2.mlOfWater;
            }


        }
        var ctx = document.getElementById("lineWater"); // vlozenie grafu do id lineDaily
        var parent = ctx.parentElement;

        ctx.remove();
        var canv = document.createElement('canvas');
        canv.id = 'lineWater';
        parent.appendChild(canv);
        ctx = document.getElementById("lineWater");

        var myChart = new Chart(ctx, {
            type: 'bar',
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
                responsive: true,
                responsiveAnimationDuration: 0, animation: {duration: 0},
                animation: false,
                showTooltips: false,
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                legend: {
                    onClick: (e) => e.stopPropagation()
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }

            }
        });
    };

    xhttp.open("POST", encodeURI("http://itsovy.sk:1203/showdrink"), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(localStorage.getItem('user'));

}

function stepsGraph() {
    //Nakreslenie grafu pre kroky usera; zatial napojene na fake api lebo api neide
    var xhttp = new XMLHttpRequest();


    xhttp.onreadystatechange = function () {
        let steps = [];
        let times = [];
        for (let i = 0; i < 24; i += 1) {
            steps[i] = 0;
            let s = new Date();
            let h = new Date(s.getFullYear(), s.getMonth(), s.getDate(), i);
            times[i] = h.toLocaleTimeString();
        }
        if (this.readyState == 4 && this.status == 200) {
            var json_data = JSON.parse(xhttp.responseText);

            for (var i = 0; i < json_data.length; i++) {
                var obj2 = json_data[i];
                let whole = obj2.time.split(' ');
                let t = whole[1].split(":");
                steps[parseInt(t[0])] += obj2.steps;
            }


        }
        var ctx = document.getElementById("lineSteps");
        var parent = ctx.parentElement;

        ctx.remove();
        var canv = document.createElement('canvas');
        canv.id = 'lineSteps';
        parent.appendChild(canv);
        ctx = document.getElementById("lineSteps");
        var myChart = new Chart(ctx, {
            type: 'bar',
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
                responsiveAnimationDuration: 0, animation: {duration: 0},
                animation: false,
                showTooltips: false,
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                legend: {
                    onClick: (e) => e.stopPropagation()
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }

            }
        });

    };

    xhttp.open("POST", encodeURI("http://itsovy.sk:1203/todaysteps"), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(localStorage.getItem('user'));


}

function stepsWeekGraph() {
    //Nakreslenie grafu pre kroky usera; zatial napojene na fake api lebo api neide
    var xhttp = new XMLHttpRequest();


    xhttp.onreadystatechange = function () {
        let steps = [];
        let times = [];
        let today = new Date();
        for (let i = 0; i < 7; i += 1) {
            steps[i] = 0;


            let h = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (6 - i));
            times[i] = h.toDateString();
        }
        if (this.readyState == 4 && this.status == 200) {
            var json_data = JSON.parse(xhttp.responseText);

            for (var i = 0; i < json_data.length; i++) {
                var obj2 = json_data[i];
                let whole = obj2.time.split(' ');
                let d = whole[0].split(".");
                let t = whole[1].split(":");
                steps[6 - (today.getDate() - d[0])] += obj2.steps;
            }


        }
        var ctx = document.getElementById("lineWeekSteps");
        var parent = ctx.parentElement;

        ctx.remove();
        var canv = document.createElement('canvas');
        canv.id = 'lineWeekSteps';
        parent.appendChild(canv);
        ctx = document.getElementById("lineWeekSteps");

        var myChart = new Chart(ctx, {
            type: 'bar',
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
                responsiveAnimationDuration: 0, animation: {duration: 0},
                animation: false,
                showTooltips: false,
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                legend: {
                    onClick: (e) => e.stopPropagation()
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }

            }
        });
    };

    xhttp.open("POST", encodeURI("http://itsovy.sk:1203/weeksteps"), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(localStorage.getItem('user'));


}

function stepsMonthGraph() {
    //Nakreslenie grafu pre kroky usera; zatial napojene na fake api lebo api neide
    var xhttp = new XMLHttpRequest();


    xhttp.onreadystatechange = function () {
        let steps = [];
        let times = [];
        let today = new Date();
        let monthDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        for (let i = 0; i < monthDate.getDate(); i += 1) {
            steps[i] = 0;


            times[i] = i + 1;
        }
        if (this.readyState == 4 && this.status == 200) {
            var json_data = JSON.parse(xhttp.responseText);

            for (var i = 0; i < json_data.length; i++) {
                var obj2 = json_data[i];
                let whole = obj2.time.split(' ');
                let d = whole[0].split(".");
                let t = whole[1].split(":");
                steps[d[0]] += obj2.steps;
            }


        }
        var ctx = document.getElementById("lineMonthSteps");
        var parent = ctx.parentElement;

        ctx.remove();
        var canv = document.createElement('canvas');
        canv.id = 'lineMonthSteps';
        parent.appendChild(canv);
        ctx = document.getElementById("lineMonthSteps");
        var myChart = new Chart(ctx, {
            type: 'bar',
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
                responsiveAnimationDuration: 0, animation: {duration: 0},
                animation: false,
                showTooltips: false,
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                legend: {
                    onClick: (e) => e.stopPropagation()
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }

            }
        });
    };

    xhttp.open("POST", encodeURI("http://itsovy.sk:1203/monthsteps"), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(localStorage.getItem('user'));


}

function heightsGraph() {
    var xhttp = new XMLHttpRequest();


    xhttp.onreadystatechange = function () {
        let heights = [];
        let times = [];
        if (this.readyState == 4 && this.status == 200) {
            //stiahne sa JSON z fake apy a vyberie sa z neho chodenie. to sa pouzilo na water inteke lebo este nie je api
            var json_data = JSON.parse(xhttp.responseText);

            let z = 1;
            for (var i = 0; i < json_data.length; i++) {
                var obj2 = json_data[i];
                if (obj2.height) {
                    heights.push(obj2.height);
                    let whole = obj2.time.split(' ');
                    let d = whole[0].split(".");
                    let t = whole[1].split(":");
                    let date = new Date(d[2], d[1] - 1, d[0], t[0], t[1], 0, 0);
                    times.push(date.toDateString() + " " + date.toLocaleTimeString());
                }
            }


        } else {

            document.getElementById("lineHeight").innerHTML = "Error getting data!";
        }
        var ctx = document.getElementById("lineHeight"); // vlozenie grafu do id lineDaily
        var parent = ctx.parentElement;

        ctx.remove();
        var canv = document.createElement('canvas');
        canv.id = 'lineHeight';
        parent.appendChild(canv);
        ctx = document.getElementById("lineHeight");
        var myChart = new Chart(ctx, {
            type: 'bar',
            //data pre graf
            data: {
                labels: times,
                datasets: [
                    {
                        label: "Height",
                        borderColor: "rgba(0,123,0,.09)",
                        borderWidth: "1",
                        backgroundColor: "rgba(0,193, 0, 0.5)",
                        pointHighlightStroke: "rgba(26,179,148,1)",
                        data: heights,
                        lineTension: 0

                    }
                ]
            },
            options: {
                responsive: true,
                responsiveAnimationDuration: 0, animation: {duration: 0},
                animation: false,
                showTooltips: false,
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                legend: {
                    onClick: (e) => e.stopPropagation()
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }

            }
        });
    };

    xhttp.open("POST", encodeURI("http://itsovy.sk:1203/userinfo"), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(localStorage.getItem('user'));

}


function weightsGraph() {
    var xhttp = new XMLHttpRequest();


    xhttp.onreadystatechange = function () {
        let weights = [];
        let times = [];
        if (this.readyState == 4 && this.status == 200) {
            //stiahne sa JSON z fake apy a vyberie sa z neho chodenie. to sa pouzilo na water inteke lebo este nie je api
            var json_data = JSON.parse(xhttp.responseText);

            let z = 1;
            for (var i = 0; i < json_data.length; i++) {
                var obj2 = json_data[i];

                if (obj2.weight) {
                    weights.push(obj2.weight);
                    z++;
                    let whole = obj2.time.split(' ');
                    let d = whole[0].split(".");
                    let t = whole[1].split(":");
                    let date = new Date(d[2], d[1] - 1, d[0], t[0], t[1], 0, 0);
                    times.push(date.toDateString() + " " + date.toLocaleTimeString());
                }
            }


        } else {

            document.getElementById("lineWeight").innerHTML = "Error getting data!";
        }
        var ctx = document.getElementById("lineWeight"); // vlozenie grafu do id lineDaily
        var parent = ctx.parentElement;

        ctx.remove();
        var canv = document.createElement('canvas');
        canv.id = 'lineWeight';
        parent.appendChild(canv);
        ctx = document.getElementById("lineWeight");

        var myChart = new Chart(ctx, {
            type: 'bar',
            //data pre graf
            data: {
                labels: times,
                datasets: [
                    {
                        label: "Weight",
                        borderColor: "rgba(123,0,.09)",
                        borderWidth: "1",
                        backgroundColor: "rgba(193, 0, 0, 0.5)",
                        pointHighlightStroke: "rgba(26,179,148,1)",
                        data: weights,
                        lineTension: 0

                    }
                ]
            },
            options: {
                responsive: true,
                responsiveAnimationDuration: 0, animation: {duration: 0},
                animation: false,
                showTooltips: false,
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                legend: {
                    onClick: (e) => e.stopPropagation()
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }

            }
        });
    };

    xhttp.open("POST", encodeURI("http://itsovy.sk:1203/userinfo"), "/json-handler");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(localStorage.getItem('user'));


}
