var fs = require("fs");
var qs = require("querystring")
var http = require("http");
var server = http.createServer(function (request, response) {
    console.log("żądany przez przeglądarkę adres: " + request.url)
    if (request.method == "POST") {
        servResp(request, response)
    } else if (request.method == "GET") {
        if (request.url === "/libs/jquery-3.1.1.min.js") {
            fs.readFile("static/libs/jquery-3.1.1.min.js", function (error, data) {
                response.writeHead(200, { 'Content-Type': 'application/javascript' });
                console.log("libs.js");
                response.write(data);
                response.end();
            })
        }
        else if (request.url === "/libs/three.js") {
            fs.readFile("static/libs/three.js", function (error, data) {
                response.writeHead(200, { 'Content-Type': 'application/javascript' });
                console.log("libs.js");
                response.write(data);
                response.end();
            })
        }
        else if (request.url === "/js/Game.js") {
            fs.readFile("static/js/Game.js", function (error, data) {
                response.writeHead(200, { 'Content-Type': 'application/javascript' });
                console.log("game.js");
                response.write(data);
                response.end();
            })
        }
        else if (request.url === "/js/Net.js") {
            fs.readFile("static/js/Net.js", function (error, data) {
                response.writeHead(200, { 'Content-Type': 'application/javascript' });
                console.log("net.js");
                response.write(data);
                response.end();
            })
        }
        else if (request.url === "/js/Ui.js") {
            fs.readFile("static/js/Ui.js", function (error, data) {
                response.writeHead(200, { 'Content-Type': 'application/javascript' });
                console.log("ui.js");
                response.write(data);
                response.end();
            })
        }
        else if (request.url === "/style.css") {
            fs.readFile("static/style.css", function (error, data) {
                response.writeHead(200, { 'Content-Type': 'text/css' });
                response.write(data);
                response.end();
            })
        }
        else if (request.url === "/") {
            fs.readFile("static/index.html", function (error, data) {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.write(data);
                response.end();
            })
        }
        else if (request.url === "/mats/woodlight.png") {
            fs.readFile("static/mats/woodlight.png", function (error, data) {
                response.writeHead(200, { 'Content-Type': 'image/png' });
                response.write(data);
                response.end();
            })
        }
        else if (request.url === "/mats/wooddark.jpg") {
            fs.readFile("static/mats/wooddark.jpg", function (error, data) {
                response.writeHead(200, { 'Content-Type': 'image/jpg' });
                response.write(data);
                response.end();
            })
        }
    }

    
})

server.listen(3000);
console.log("serwer startuje na porcie 3000")

var usrtab = [];
var resp = {
    txt: 0,
    status: 0, // 0-pierwsza czesc logowania 1-jest dwoch graczy/ tura białych 2-tura czarnych 3-jeden gracz (oczekuje)
    player: 0,
    data: []
};

var newTab = [];
var oldTab = [];
for (var i = 0; i < 8; i++) {
    newTab[i] = new Array(8);
    oldTab[i] = new Array(8);
    for (var j = 0; j < 8; j++) {
        newTab[i][j] = 0;
        oldTab[i][j] = 0;
    }
}

function updateArray(array) {
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            newTab[i][j] = array[i][j];
        }
    }
    resp.txt = "Array updated";
    resp.data = "";
    if (resp.status == 1) {
        resp.status = 2;
    } else {
        resp.status = 1;
    }
}

function checkArray() {
    if (JSON.stringify(oldTab) === JSON.stringify(newTab)) {
        resp.data = JSON.stringify(oldTab);
        resp.txt = "Arrays confirmed";
    } else {
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                oldTab[i][j] = newTab[i][j];
            }
        }
        resp.data = JSON.stringify(oldTab);
        resp.txt = "Arrays updated"
    }
}

function addusr(user) {
    if (usrtab.length >= 2) {
        //jest juz dwoch
        console.log("jest juz dwoch userow")
        console.log(usrtab)
        resp.txt = ("jest juz dwoch userow")
        resp.status = 0;
    }
    else {
        if (user != usrtab[0]) {
            usrtab.push(user);
            console.log(usrtab)
            resp.player = usrtab.length;
            resp.txt = ("Witaj " + user)
            resp.status = 3;

        } else {
            console.log("jest juz taki user")
            resp.txt = ("jest juz taki user")
            resp.status = 0;

        }
    }
}

function usrReset() {
    usrtab = [];
    console.log("USER TABLE RESET")
}

function checkUsr() {
    if (usrtab.length == 2) {
        resp.txt = "Jest dwoch graczy";
        resp.status = 2;
    }
}

var servResp = function (request, response) {
    var allData = "";

    request.on("data", function (data) {
        //console.log("data: " + data)
        allData += data;
    })

    request.on("end", function (data) {
        var finishObj = qs.parse(allData)
        console.log(finishObj)
        switch (finishObj.akcja) {
            //dodanie nowego usera
            case "DODAJ_UZYTKOWNIKA":
                addusr(finishObj.user);
                console.log(JSON.stringify(resp))
                response.end(JSON.stringify(resp))
                break;
                //inna akcja
            case "RESET":
                usrReset();
                break;
            case "CHECK_USERS":
                checkUsr()
                console.log(JSON.stringify(resp))
                response.end(JSON.stringify(resp))
                break;
            case "MOVE":
                updateArray(JSON.parse(finishObj.array))
                response.end(JSON.stringify(resp))
                break;
            case "AWAITING":
                checkArray();
                response.end(JSON.stringify(resp));
                break;

        }
    })
}