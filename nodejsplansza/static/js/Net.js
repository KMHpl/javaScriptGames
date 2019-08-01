
function Net() {
    /*
        funkcja publiczna możliwa do uruchomienia 
        z innych klas
    */
    var interval;
    var clock = 0;

    this.sendData = function (akcja, data) {

        $.ajax({
            type: "POST",
            url: "http://localhost:3000",
            data: {
                akcja: akcja,
                user: data,                
            },
            dataType: "text",
            success: function (response) {
                //console.log("komunikat z serwera:" + response)
                resp = JSON.parse(response);
                var status = document.getElementById("hh1");
                status.innerHTML = resp.txt
                if (resp.status == 3) {
                    if (resp.player == 1) {
                        status.innerHTML += ", grasz białymi.";
                        player = 1;
                    } else {
                        status.innerHTML += ", grasz czarnymi.";
                        player = 2;
                    }
                    game.setCam(resp.player)
                    var screen = document.getElementById("sc1");
                    screen.style.display = "none";
                    screen = document.getElementById("sc2");
                    screen.style.display = "block";

                    //sprawdzanie czy doszedl drugi
                    function ckeckUsers() {
                        $.ajax({
                            type: "POST",
                            url: "http://localhost:3000",
                            data: {
                                akcja: "CHECK_USERS",
                            },
                            dataType: "text",
                            success: function (response) {
                                resp = JSON.parse(response);
                                console.log(resp.txt)
                                if (resp.status == 2) {
                                    var screen = document.getElementById("loginsc");
                                    screen.style.display = "none";
                                    clearInterval(interval1);
                                    gamestatus = 1;
                                    if (player == 2) {
                                        game.wait();
                                    }
                                }
                            },
                            error: function (xhr) {
                                alert("błąd" + xhr.responseText)
                            }
                        })
                    } 
                    var interval1 = setInterval(function () { ckeckUsers() }, 1000)
                    
                   
                }
            },
            error: function (xhr) {
                alert("błąd" + xhr.responseText)
            }
        })

    }
    this.sendMove = function(data) {
        $.ajax({
            type: "POST",
            url: "http://localhost:3000",
            data: {
                akcja: "MOVE",
                array: data,
            },
            dataType: "text",
            success: function (response) {
                resp = JSON.parse(response);
                console.log(resp.txt)
                clock = 0;
                var screen = document.getElementById("loginsc");
                screen.style.display = "block";
                screen = document.getElementById("sc2");
                screen.style.display = "block";
                var sc2txt = document.getElementById("sc2txt");
                sc2txt.innerHTML = "Ruch ma przeciwnik...";
                var zegar = document.getElementById("clock");
                zegar.innerHTML = clock++;
                interval = setInterval(net.await, 1000);
                if (player == 1) {
                    gamestatus = 2;
                } else if (player == 2) {
                    gamestatus = 1;
                }
            },
            error: function (xhr) {
                alert("błąd" + xhr.responseText)
            }
        })
    }
    this.await = function () {
        var zegar = document.getElementById("clock");
        zegar.innerHTML = clock;
        clock++;
        $.ajax({
            type: "POST",
            url: "http://localhost:3000",
            data: {
                akcja: "AWAITING",
            },
            dataType: "text",
            success: function (response) {
                resp = JSON.parse(response);
                //console.log(resp.txt)
                
                //screen = document.getElementById("sc2");
                //screen.style.display = "block";
                //var sc2txt = document.getElementById("sc2txt");
                //sc2txt.innerHTML = "Ruch ma przeciwnik...";
                gamestatus = resp.status;
                if (gamestatus == player) {
                    var array = JSON.parse(resp.data);
                    game.update(array)
                    clearInterval(interval);
                    var screen = document.getElementById("loginsc");
                    screen.style.display = "none";
                }    
                //console.log(resp)
            },
            error: function (xhr) {
                alert("błąd" + xhr.responseText)
            }
        })
    }
}