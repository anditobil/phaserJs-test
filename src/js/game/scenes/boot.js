let val_progress = 0;


class boot extends Phaser.Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        scene = this;

        this.gameEngine = new AndiGameEngine(this);
        let globalPosition = this.gameEngine.add.globalPosition('mobile');

        screenX = globalPosition.x;
        screenY = globalPosition.y;

        let objectLoader = this.gameEngine.add.loadObject({
            audioPath: "assets/audios",
            imagePath: "assets/images",
            spritePath: "assets/sprites",
        });

        // LOAD STATIC BACKGROUND
        objectLoader.loadImage('Arrow.png');
        objectLoader.loadImage('Background.png');
        objectLoader.loadImage('Banana.png'); //item 1
        objectLoader.loadImage('Blackberry.png'); //item 2
        objectLoader.loadImage('Cherry.png'); //item 3
        objectLoader.loadImage('CheatToolBackground.png');
        objectLoader.loadImage('CheatToolInput.png');
        objectLoader.loadImage('Spin.png');
        objectLoader.loadImage('Win.png');

        var loadingConfig = {
            loadingLogo: "favicon",
            loadingInfo: true,
            loadingLogoScale: 0.5,
            loadingInfoText: {
                fontSize: 22,
                fontName: "avenir",
                fontColor: "#fff",
                itemVisible: true
            },
            nextSceneName: "Gameplay",
            loadingPosition: { x: screenX, y: screenY }
        }

        this.gameEngine.add.loadingScreen(loadingConfig, () => {

        });
    }
}