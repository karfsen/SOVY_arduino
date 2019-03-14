(function ($) {
    "use strict";


    var xhttpSteps = new XMLHttpRequest();


    xhttpSteps.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //stiahne sa JSON z fake apy a vyberie sa z neho chodenie. to sa pouzilo na water inteke lebo este nie je api
            var json_data = JSON.parse(xhttpSteps.responseText);
            let d = [];
            let times = [];
            let z = 1;
            for (var i = 0; i < json_data.length; i++) {
                var obj2 = json_data[i];
                if (obj2.weight) {
                    d.push(obj2.weight);
                    times.push(z);
                    z++;
                }
            }
            var ctx = document.getElementById("lineWeight"); // vlozenie grafu do id lineDaily
            ctx.height = 350;

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
                            data: d,
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
                times.push(i + 1);
            }

            var ctx = document.getElementById("lineWater"); // vlozenie grafu do id lineDaily
            ctx.height = 350;

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
            let d = [];
            let times = [];
            let z = 1;
            for (var i = 0; i < json_data.length; i++) {
                var obj2 = json_data[i];
                if (obj2.height) {
                    d.push(obj2.height);
                    times.push(z);
                    z++;
                }
            }
            var ctx = document.getElementById("lineHeight"); // vlozenie grafu do id lineDaily
            ctx.height = 350;

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
                            data: d,
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


        } else {

            document.getElementById("lineHeight").innerHTML = "Error getting data!";
        }
    };

    xhttpHeight.open("POST", encodeURI("http://itsovy.sk:1203/userinfo"), "/json-handler");
    xhttpHeight.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttpHeight.send(localStorage.getItem('user'));


})(jQuery);