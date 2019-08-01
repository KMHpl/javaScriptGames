function Game() {

    var camPos = 4;

    var pionki = [];
    var plantab = [];
    for (var i = 0; i < 8; i++) {
        plantab[i] = new Array(8);
        pionki[i] = new Array(8);
        for (var j = 0; j < 8; j++) {
            pionki[i][j] = 0;
            if (i % 2 == 0) {
                if (j % 2 == 0) {
                    plantab[i][j] = 1;
                } else {
                    plantab[i][j] = 0;
                }
            } else {
                if (j % 2 == 1) {
                    plantab[i][j] = 1;
                } else {
                    plantab[i][j] = 0;
                }
            }
            if (i <= 1 && plantab[i][j] == 1) {
                pionki[i][j] = 1;
            }
            if (i >= 6 && plantab[i][j] == 1) {
                pionki[i][j] = 2;
            }
        }
    }

    function init() {
        var scene = new THREE.Scene();


        var camera = new THREE.PerspectiveCamera(
            45,
            (window.innerWidth) / window.innerHeight,
            0.1,
            10000
            );

        var renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0x110000);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        

        var light = new THREE.SpotLight(0xffffff, 2, 4000);
        light.position.set(0, 3500, 0);
        light.lookAt(scene.position);
        light.castShadow = true;
        scene.add(light);
        var light2 = light.clone();
        light2.position.set(500, 300, 500);
        scene.add(light2)
        var light3 = light.clone();
        light3.position.set(-500, 300, -500);
        scene.add(light3)

        document.getElementById("main1").appendChild(renderer.domElement);
        document.addEventListener("mousedown", onMouseDown, false);
        var selected = 0;
        var raycaster = new THREE.Raycaster();
        var mouseVector = new THREE.Vector2();

        var dtab = document.getElementById("tab");
        for (var i = 0; i < 8; i++) {
            var dr = document.createElement("div");
            dtab.appendChild(dr)
            for (var j = 0; j < 8; j++) {
                var di = document.createElement("span");
                dr.appendChild(di)
                di.innerHTML = pionki[i][j] + " ";
            }
        }

        //meshe
        var tilewhite = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x111111,
            shininess: 1,
            side: THREE.DoubleSide,
            map: THREE.ImageUtils.loadTexture("mats/woodlight.png")
        });
        var tileblack = new THREE.MeshPhongMaterial({
            color: 0xaaaaaa,
            specular: 0x111111,
            shininess: 1,
            side: THREE.DoubleSide,
            map: THREE.ImageUtils.loadTexture("mats/wooddark.jpg")
        });
        var piecewhite = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x111111,
            shininess: 50,
            side: THREE.DoubleSide,
            map: THREE.ImageUtils.loadTexture("mats/woodlight.png")
        });
        var pieceblack = new THREE.MeshPhongMaterial({
            color: 0xaaaaaa,
            specular: 0x111111,
            shininess: 50,
            side: THREE.DoubleSide,
            map: THREE.ImageUtils.loadTexture("mats/wooddark.jpg")
        });
        var selectedwhite = new THREE.MeshPhongMaterial({
            color: 0xffaaaa,
            specular: 0x111111,
            shininess: 50,
            side: THREE.DoubleSide,
            map: THREE.ImageUtils.loadTexture("mats/woodlight.png")
        });
        var selectedblack = new THREE.MeshPhongMaterial({
            color: 0xff9999,
            specular: 0x111111,
            shininess: 50,
            side: THREE.DoubleSide,
            map: THREE.ImageUtils.loadTexture("mats/wooddark.jpg")
        });

        var geometryCylinder = new THREE.CylinderGeometry(50, 50, 20, 32);
        var cylinder = new THREE.Mesh(geometryCylinder, piecewhite);
        cylinder.castShadow = true;

        var geometryCube = new THREE.CubeGeometry(100, 20, 100);
        var cube = new THREE.Mesh(geometryCube, tilewhite);
        cube.receiveShadow = true;

        function addPiece(posZ, posX, black) {
            var piece = cylinder.clone()
            if (!black) {
                piece.material = piecewhite.clone();
                piece.name = "piece white"
                piece.userData = { color: "white", x: posX, y: posZ }
            } else {
                piece.material = pieceblack.clone();
                piece.name = "piece black"
                piece.userData = { color: "black", x: posX, y: posZ }
            }
            scene.add(piece);
            piece.position.x = posX * 100 - 350;
            piece.position.y = 20;
            piece.position.z = posZ * 100 - 350;
        }

        function addtile(posZ, posX, black) {
            var tile = cube.clone()
            if (!black) {
                tile.material = tilewhite.clone();
                tile.name = "tile white"
                tile.userData = { color: "white", x: posX, y: posZ }
            } else {
                tile.material = tileblack.clone();
                tile.name = "tile black"
                tile.rotation.x = Math.PI;
                tile.userData = { color: "black", x: posX, y: posZ }
            }
            scene.add(tile);
            tile.position.x = posX * 100 - 350;
            tile.position.y = -10;
            tile.position.z = posZ * 100 - 350;
        }


        this.addTiles = function() {
            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 8; j++) {
                    if (plantab[i][j] == 0) {
                        addtile(i, j, false)
                    } else {
                        addtile(i, j, true)
                    }
                }
            }
        }

        this.addPawns = function () {
            for (var i = 0; i < scene.children.length; i++) {
                var obj = scene.children[i];
                if (obj.name.split(" ")[0] == "piece") {
                    scene.remove(obj);
                    i--;
                }
            }
            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 8; j++) {
                    if (pionki[i][j] == 1) {
                        addPiece(i, j, false)
                    } else if (pionki[i][j] == 2) {
                        addPiece(i, j, true)
                    }
                }
            }
        }

        this.addTiles();
        this.addPawns();

        function onMouseDown(event) {
            mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouseVector, camera);
            var intersects = raycaster.intersectObjects(scene.children);
            //console.log(intersects.length)
            if (intersects.length > 0) {
                if (selected == 0) {
                    if (player == 1 && gamestatus == 1) {
                        if (intersects[0].object.name == "piece white") {
                            selected = intersects[0].object;
                            selected.material = selectedwhite.clone();
                        }
                    } else if (player == 2 && gamestatus == 2) {
                        if (intersects[0].object.name == "piece black") {
                            selected = intersects[0].object;
                            selected.material = selectedblack.clone();
                        }
                    }
                } else {
                    if (intersects[0].object.name == "tile black") {
                        selected.position.x = intersects[0].object.position.x
                        selected.position.z = intersects[0].object.position.z
                        var a = selected.userData;
                        var b = intersects[0].object.userData
                        pionki[a.y][a.x] = 0;
                        selected.userData.x = b.x;
                        selected.userData.y = b.y;
                        if (player == 1) {
                            selected.material = piecewhite.clone();
                            pionki[b.y][b.x] = 1;
                        } else if (player == 2) {
                            selected.material = pieceblack.clone();
                            pionki[b.y][b.x] = 2;
                        }
                        //funkcja
                        net.sendMove(JSON.stringify(pionki))
                        //
                        selected = 0;
                        var dtab = document.getElementById("tab");
                        dtab.innerHTML = "";
                        for (var i = 0; i < 8; i++) {
                            var dr = document.createElement("div");
                            dtab.appendChild(dr)
                            for (var j = 0; j < 8; j++) {
                                var di = document.createElement("span");
                                dr.appendChild(di)
                                di.innerHTML = pionki[i][j] + " ";
                            }
                        }
                    }
                }
                //console.log(intersects[0].object);          
            }
        }

        camera.position.y = 400;
        camera.position.z = -800;
        var colorsHEX = [0xff0000, 0xffff00, 0x00ff00, 0x00ffff, 0x0000ff, 0xff00ff];

        function animateScene() {
            switch (camPos) {
                case 1:
                    camera.position.y = 400;
                    camera.position.z = -800;
                    break;
                case 2:
                    camera.position.y = 400;
                    camera.position.z = 800;
                    break;
                case 3:
                    camera.position.y = 0;
                    camera.position.z = 800;
                    break;
                case 4:
                    camera.position.y = 1200;
                    camera.position.z = 0;
                    break;
            }
            var color = colorsHEX[Math.floor(Math.random() * 6)]
            //light.color.setHex(color)
            camera.lookAt(scene.position);
            requestAnimationFrame(animateScene);
            renderer.render(scene, camera);
            camera.updateProjectionMatrix();

        }
        animateScene();
    }

    
    var init = new init();

    /*
        funkcje publiczne możliwe do wywołania z innych funkcji (klas)
    */
    this.wait = function () {
        if (player == 2) {
            net.sendMove(JSON.stringify(pionki));
        }
    }
    this.setCam = function (val) {
        camPos = val;
    }

    this.getTest = function () {
        return test;
    }

    this.update = function (array) {
        var dtab = document.getElementById("tab");
        dtab.innerHTML = "";
        for (var i = 0; i < 8; i++) {
            var dr = document.createElement("div");
            dtab.appendChild(dr)
            for (var j = 0; j < 8; j++) {
                var di = document.createElement("span");
                dr.appendChild(di)
                pionki[i][j] = array[i][j];
                di.innerHTML = pionki[i][j] + " ";
            }
        }
        init.addPawns();
    }
}