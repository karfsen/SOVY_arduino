(function ($) {
    "use strict";


    var xhttpSteps = new XMLHttpRequest();


    xhttpSteps.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //stiahne sa JSON z fake apy a vyberie sa z neho chodenie. to sa pouzilo na water inteke lebo este nie je api
            var json_data = JSON.parse(xhttpSteps.responseText);
            let weights = [];
            let times = [];
            let z = 1;
            for (var i = 0; i < json_data.length; i++) {
                var obj2 = json_data[i];

                if (obj2.weight) {
                    weights.push(obj2.weight);
                    z++;
                    let whole = obj2.time.split(' ');
                    let d = whole[0].split(".");
                    let t = whole[1].split(":");
                    let date = new Date(d[2], d[1], d[0], t[0], [1], 0, 0);
                    times.push(date.toDateString() + " " + date.toLocaleTimeString());
                }
            }
            var ctx = document.getElementById("lineWeight"); // vlozenie grafu do id lineDaily
            ctx.height = 550;
            // ctx.width = 1000;


            var myChart = new Chart(ctx, {
                type: 'line',
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
                    maintainAspectRatio: false,
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


        } else {

            document.getElementById("lineWeight").innerHTML = "Error getting data!";
        }
    };

    xhttpSteps.open("POST", encodeURI("http://itsovy.sk:1203/userinfo"), "/json-handler");
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

                waterIntage.push(obj2.mlOfWater);
                let whole = obj2.time.split(' ');
                let d = whole[0].split(".");
                let t = whole[1].split(":");
                let date = new Date(d[2], d[1], d[0], t[0], [1], 0, 0);
                times.push(date.toDateString() + " " + date.toLocaleTimeString());
            }

            var ctx = document.getElementById("lineWater"); // vlozenie grafu do id lineDaily
            ctx.height = 550;

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
                    responsive: true,
                    maintainAspectRatio: false,
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

    var xhttpHeight = new XMLHttpRequest();


    xhttpHeight.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //stiahne sa JSON z fake apy a vyberie sa z neho chodenie. to sa pouzilo na water inteke lebo este nie je api
            var json_data = JSON.parse(xhttpHeight.responseText);
            let heights = [];
            let times = [];
            let z = 1;
            for (var i = 0; i < json_data.length; i++) {
                var obj2 = json_data[i];
                if (obj2.height) {
                    heights.push(obj2.height);
                    let whole = obj2.time.split(' ');
                    let d = whole[0].split(".");
                    let t = whole[1].split(":");
                    let date = new Date(d[2], d[1], d[0], t[0], [1], 0, 0);
                    times.push(date.toDateString() + " " + date.toLocaleTimeString());
                }
            }
            var ctx = document.getElementById("lineHeight"); // vlozenie grafu do id lineDaily
            ctx.height = 550;

            var myChart = new Chart(ctx, {
                type: 'line',
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
                    maintainAspectRatio: false,
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


        } else {

            document.getElementById("lineHeight").innerHTML = "Error getting data!";
        }
    };

    xhttpHeight.open("POST", encodeURI("http://itsovy.sk:1203/userinfo"), "/json-handler");
    xhttpHeight.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttpHeight.send(localStorage.getItem('user'));


})(jQuery);