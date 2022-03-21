let active_bgm = false;
let audio_config = {
    mute: false,
    volume: 0.2,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0
}

let sfx = {};

class mainmenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }

    preload() {
        this.gameEngine = new AntiGravityGameEngine(this);
        let globalPosition = this.gameEngine.add.globalPosition();

        this.gameEngine.add.screenResolution().apply(`mobile`);

        screenX = globalPosition.x;
        screenY = globalPosition.y;

        this.bussy = false;

        sfx = {
            close: this.sound.add("btn_close"),
            select: this.sound.add("btn_select"),
            select_transition: this.sound.add("btn_select_transition"),
            correct: this.sound.add("add_point"),
            obstacle: this.sound.add("obstacle"),
            extra_time: this.sound.add("extra_time"),
            game_over: this.sound.add("end_game"),
            game_over2: this.sound.add("end_game2"),
            click: this.sound.add("click"),
            move: this.sound.add("move")
        }

        //this.gameEngine.html.sceneTransition().fadeIn(() => {});
        this.tutorialIndex = 0;
        this.canClick = true;
    }

    create() {
        if (!active_bgm) {
            this.sound.add("bgm").play(audio_config);
            active_bgm = true;
        }

        var bg = this.add.image(screenX, screenY, "background");
        bg.setScale(1.6);

        var title_accent = this.add.image(screenX, screenY - 540, "title_accent");
        title_accent.setScale(1);

        var title = this.add.image(screenX, screenY - 350, "title");
        title.setScale(1.3);

        this.obstacle_info_1 = this.add.image(screenX + 100, screenY - 200, 'obstacle_right_4');
        this.obstacle_info_2 = this.add.image(screenX - 100, screenY, 'obstacle_left_1');
        this.obstacle_info_2 = this.add.image(screenX + 130, screenY, 'extra_time');
        this.obstacle_info_2 = this.add.sprite(screenX + 130, screenY + 250, 'character_animation', 5);

        //this.tutorialPopup();
        var button_start = this.add.image(screenX, screenY + 300, "button_start");
        button_start.setScale(1.3);
        button_start.setInteractive().on("pointerup", () => {
            if (this.canClick) {
                sfx.select.play({ volume: 0.3 });
                buttonMulai();
                this.tutorialPopup();
                //this.gameEngine.html.sceneManager().loadScene("Gameplay");
            }
        });
    }

    tutorialPopup() {
        this.canClick = false;
        let front_end = this.gameEngine.html.objectElement('front-end');
        front_end.show();
        front_end.elementDisplay("opening-tutorial", "none");
        front_end.elementDisplay("reward", "none");

        front_end.setOverlay();
        front_end.show();
        front_end.elementDisplay("opening-tutorial", "grid");

        setTimeout(() => {
            this.gameEngine.html.animator('opening-tutorial').flyIn(0);
            setTimeout(() => {
                this.gameEngine.html.objectButton("button_skip", () => {
                    sfx.select_transition.play({ volume: 0.3 });
                    front_end.close();
                    buttonMulaiHowToPlay();
                    this.gameEngine.html.sceneManager().loadScene("Gameplay");
                    this.gameEngine.html.animator('opening-tutorial').flyOut(-window.innerHeight);
                }).click();

                this.gameEngine.html.objectButton("button_next", () => {
                    sfx.select.play({ volume: 0.3 });
                    this.gameEngine.html.objectElement("tutorial_icon").setImg("assets/front_end/tutorial_icon2.png");
                    this.gameEngine.html.objectText("tutorial_header").setText("Your Point Position", 'italic');
                    this.gameEngine.html.objectText("tutorial_desc").setText("Tap layar lo untuk berpindah jalur ke kiri atau ke kanan.");
                    this.gameEngine.html.objectElement("tutorial_page").setImg("assets/front_end/tutorial_page2.png");
                    this.gameEngine.html.objectElement("button_next").setImg("assets/front_end/button_next.png");
                    this.gameEngine.html.objectButton("button_next", () => {
                        sfx.select.play({ volume: 0.3 });
                        front_end.elementDisplay("main-buttons", "none");
                        front_end.elementDisplay("extra-buttons", "flex");
                        this.gameEngine.html.objectElement("tutorial_icon").setImg("assets/front_end/tutorial_icon3.png");
                        this.gameEngine.html.objectText("tutorial_header").setText("Your Point Position", 'italic');
                        this.gameEngine.html.objectText("tutorial_desc").setText("Tambah waktumu dengan mengambil bonus item!");
                        this.gameEngine.html.objectElement("tutorial_page").setImg("assets/front_end/tutorial_page3.png");
                        //this.gameEngine.html.objectElement("button_next").setImg("assets/front_end/button_next.png");
                        this.gameEngine.html.objectButton("button_final_next", () => {
                            sfx.select_transition.play({ volume: 0.3 });
                            front_end.close();
                            buttonMulaiHowToPlay();
                            this.gameEngine.html.sceneManager().loadScene("Gameplay");
                            this.gameEngine.html.animator('opening-tutorial').flyOut(-window.innerHeight);
                        }).click();
                    }).click();
                }).click();
            }, 400);
        }, 100);
    }
}