function Ui() {

    var tog = 11
    document.getElementById("bt1")
                    .addEventListener("click", function () {
                        game.setCam(tog);
                        switch (tog) {
                            case 10: tog = 11;
                                break;
                            case 11: tog = 12;
                                break;
                            case 12: tog = 13;
                                break;
                            default: tog = 10;
                                break;
                        }
                        console.log(tog);
                    })

    document.getElementById("bt2")
                .addEventListener("click", function () {
                    var user = document.getElementById("txt1").value;
                    console.log(user)
                    net.sendData("DODAJ_UZYTKOWNIKA", user)
                    
                })

    document.getElementById("bt3")
                .addEventListener("click", function () {
                    net.sendData("RESET", "0");

                })
}

