var game;
let scene = null;
let screenX = 0;
let screenY = 0;

window.onload = function() {
    let gameConfig = {
        parent: "canvas-parent",
        type: Phaser.WEBGL,
        width: 580, //580,
        height: 960,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0, x: 0 },
                debug: false,
            }
        },
        scene: [{
            preload
        }, boot, gameplay],
        transparent: false
    }
    game = new Phaser.Game(gameConfig);

    function preload() {
        //HACK TO PRELOAD CUSTOM FONTS
        this.add.text(0, 0, "Montserrat", { font: "0px Montserrat", fill: "#FFFFFF" });

        this.load.image('favicon', 'assets/favicon.png');
        this.load.on('complete', function() {
            game.scene.start("Boot");
        });
    }
}