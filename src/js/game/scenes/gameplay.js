class gameplay extends Phaser.Scene {
    constructor() {
        super("Gameplay");
    }

    preload() {

        scene = this;

        this.gameEngine = new AndiGameEngine(this); //call the custom plug-in based on phaser for fastest project builder
        let globalPosition = this.gameEngine.add.globalPosition();

        // init variable for center of the screen (x:0, y:0)
        screenX = globalPosition.x;
        screenY = globalPosition.y;

        this.flag = {
            onSpin: false,
            onClickTool: false
        }

        this.currentItems = null;
    }

    create() {
        this.resultKeys = [1, 1, 1];

        this.toolCheatActive = false;

        this.cheatKeys = [0, 0, 0];

        //Call Custom SLOT ENGINE
        //We can Set the Slot Rules inside of SLOT Engine, but for now this is standard version of SLOT
        this.SLOTEngine = new Slot(scene, {
            itemBank: ["Banana", "Blackberry", "Cherry"],
            maxItemReels: 6,
            math: Phaser.Math
        });

        //Initiate SLOT before Spinning the machine
        this.SLOTEngine.init((items) => {
            scene.spawnTools(items);
            scene.reel1 = this.add.image(screenX - 115, screenY, items[0]);
            scene.reel1.setScale(0.3);
            scene.reel2 = this.add.image(screenX, screenY, items[0]);
            scene.reel2.setScale(0.3);
            scene.reel3 = this.add.image(screenX + 118, screenY, items[0]);
            scene.reel3.setScale(0.3);

            scene.background = scene.add.image(screenX, screenY, "Background");
            scene.background.setScale(0.3);

            scene.bigWin = scene.add.image(screenX, screenY - 200, "Win");
            scene.bigWin.setScale(0.5);
            scene.bigWin.visible = false;

            scene.buttonSpin = scene.add.image(screenX, screenY + 120, "Spin");
            scene.buttonSpin.setScale(0.4);
            scene.buttonSpin.setInteractive();

            scene.buttonSpin.on("pointerdown", () => {
                if (scene.flag.onSpin) return;
                scene.buttonSpin.setScale(0.35);
            });

            //BUTTON CLICK WHEN CURSORE/POINTER UP
            scene.buttonSpin.on("pointerup", () => {
                if (scene.flag.onSpin) return;
                scene.buttonSpin.setScale(0.4);
                scene.buttonSpin.setTint(0x363636);
                scene.flag.onSpin = true;
                scene.bigWin.setVisible(false);

                //Check the tools open or not
                if (scene.toolCheatActive) {
                    scene.resultKeys[0] = scene.cheatKeys[0];
                    scene.resultKeys[1] = scene.cheatKeys[1];
                    scene.resultKeys[2] = scene.cheatKeys[2];
                } else {
                    scene.resultKeys[0] = Phaser.Math.Between(0, (items.length - 1));
                    scene.resultKeys[1] = Phaser.Math.Between(0, (items.length - 1));
                    scene.resultKeys[2] = Phaser.Math.Between(0, (items.length - 1));
                }

                console.log(scene.resultKeys);

                scene.spinSlot(scene.resultKeys[0], items, scene.reel1, 1);
                scene.spinSlot(scene.resultKeys[1], items, scene.reel2, 2);
                scene.spinSlot(scene.resultKeys[2], items, scene.reel3, 3, scene.onBigWin);
            });

            scene.gameEngine.add.animator().bloopLoop(scene.bigWin, { start: 0.4, end: 0.6 }, 500, "Power2", () => {

            });
        });
    }

    //Spint State Animations
    spinSlot(key, items = null, reel, timer = 1, callback = null) {
        this.reel_OldPositionY = reel.y;
        var index = 0;
        this.gameEngine.add.animator().moveObject(reel, { x: reel.x, y: this.reel_OldPositionY + 100 }, 250, "Power2", () => {
            reel.y = this.reel_OldPositionY - 100;
            this.gameEngine.add.animator().moveObjectLoopTime(reel, { x: reel.x, y: this.reel_OldPositionY + 100 }, 1000 / items.length, items.length * timer, "Linear",
                () => {
                    index++;
                    reel.setTexture(items[index - 1]);
                    if (index >= items.length) {
                        index = 0;
                    }
                }, () => {
                    reel.y = this.reel_OldPositionY - 100;
                    reel.setTexture(items[key]);
                    this.gameEngine.add.animator().moveObject(reel, { x: reel.x, y: this.reel_OldPositionY }, 500, "Power2", () => {
                        this.gameEngine.add.animator().bloop(reel, { start: 0.3, end: 0.4 }, 200, "Power2", () => {
                            if (callback == null) return;
                            callback(items);
                        });
                    });
                });
        });
    }

    //ON SPIN SUCCESS Check if GET JACKPOT
    onBigWin(items) {
        scene.flag.onSpin = false;
        scene.buttonSpin.setTint(0xffffff);
        console.log(items);
        var case1 = items[scene.resultKeys[0]] == items[scene.resultKeys[1]];
        var case2 = items[scene.resultKeys[0]] == items[scene.resultKeys[2]];
        var case3 = items[scene.resultKeys[1]] == items[scene.resultKeys[2]];
        if (case1 && case2 && case3) {
            scene.bigWin.setVisible(true);
        }
    }

    //Create UI Tool
    spawnTools(items) {

        scene.cheatTool = scene.add.image(screenX - 120, screenY - 527, "CheatToolBackground");
        scene.cheatTool.setScale(0.6);

        scene.cheatToolTitle = scene.gameEngine.add.gameObject().createText({
            x: screenX - 120,
            y: screenY - 650
        }, "SYMBOL POSITION IN THE REEL", {
            fontSize: 16,
            fontColor: "#fff",
            align: "center",
            followCamera: 0
        });

        scene.fieldCheat1 = scene.add.image(screenX - 210, screenY - 610, "CheatToolInput");
        scene.fieldCheat1.setScale(0.6);
        scene.fieldCheat1.setInteractive().on("pointerdown", () => {
            scene.cheatKeys[0] += 1;
            if (scene.cheatKeys[0] >= items.length) {
                scene.cheatKeys[0] = 0;
            }
            scene.cheat_reel_1.text = (scene.cheatKeys[0] + 1).toString();
        });

        scene.fieldCheat2 = scene.add.image(screenX - 120, screenY - 610, "CheatToolInput");
        scene.fieldCheat2.setScale(0.6);
        scene.fieldCheat2.setInteractive().on("pointerdown", () => {
            scene.cheatKeys[1] += 1;
            if (scene.cheatKeys[1] >= items.length) {
                scene.cheatKeys[1] = 0;
            }
            scene.cheat_reel_2.text = (scene.cheatKeys[1] + 1).toString();
        });

        scene.fieldCheat3 = scene.add.image(screenX - 30, screenY - 610, "CheatToolInput");
        scene.fieldCheat3.setScale(0.6);
        scene.fieldCheat3.setInteractive().on("pointerdown", () => {
            scene.cheatKeys[2] += 1;
            if (scene.cheatKeys[2] >= items.length) {
                scene.cheatKeys[2] = 0;
            }
            scene.cheat_reel_3.text = (scene.cheatKeys[2] + 1).toString();
        });

        scene.cheat_reel_1 = scene.gameEngine.add.gameObject().createText({
            x: screenX - 210,
            y: screenY - 610
        }, "1", {
            fontSize: 26,
            fontColor: "#fff",
            align: "center",
            followCamera: 0
        });

        scene.cheat_reel_2 = scene.gameEngine.add.gameObject().createText({
            x: screenX - 120,
            y: screenY - 610
        }, "1", {
            fontSize: 26,
            fontColor: "#fff",
            align: "center",
            followCamera: 0
        });

        scene.cheat_reel_3 = scene.gameEngine.add.gameObject().createText({
            x: screenX - 30,
            y: screenY - 610
        }, "1", {
            fontSize: 26,
            fontColor: "#fff",
            align: "center",
            followCamera: 0
        });

        scene.ToolCheatArrow = scene.gameEngine.add.gameObject().createText({
            x: screenX - 205,
            y: screenY - 467
        }, "Tools", {
            fontSize: 18,
            fontColor: "#fff",
            align: "center",
            followCamera: 0
        });

        scene.cheatToolArrow = scene.add.image(screenX - 155, screenY - 467, "Arrow");
        scene.cheatToolArrow.setScale(0.6);
        scene.cheatToolArrow.setInteractive().on("pointerdown", () => {
            if (scene.flag.onClickTool || scene.flag.onSpin) return;
            if (scene.toolCheatActive) {
                scene.toolCheatActive = false;
                scene.toolTopAnimation(0, 500);
                scene.cheatToolArrow.rotation = 0;
            } else {
                scene.toolCheatActive = true;
                scene.toolTopAnimation(1, 500);
                scene.cheatToolArrow.rotation = 3.15;
            }
            scene.flag.onClickTool = true;
        });
    }

    //Create UI Tool Animation
    toolTopAnimation(direction, speed) {
        if (direction == 0) {
            scene.gameEngine.add.animator().moveObject(scene.cheatTool, { x: screenX - 120, y: screenY - 527 }, speed, "Linear", () => {});
            scene.gameEngine.add.animator().moveObject(scene.cheatToolTitle, { x: screenX - 120, y: screenY - 650 }, speed, "Linear", () => {});
            scene.gameEngine.add.animator().moveObject(scene.fieldCheat1, { x: screenX - 210, y: screenY - 610 }, speed, "Linear", () => {});
            scene.gameEngine.add.animator().moveObject(scene.fieldCheat2, { x: screenX - 110, y: screenY - 610 }, speed, "Linear", () => {});
            scene.gameEngine.add.animator().moveObject(scene.fieldCheat3, { x: screenX - 30, y: screenY - 610 }, speed, "Linear", () => {});
            scene.gameEngine.add.animator().moveObject(scene.cheat_reel_1, { x: screenX - 210, y: screenY - 610 }, speed, "Linear", () => {});
            scene.gameEngine.add.animator().moveObject(scene.cheat_reel_2, { x: screenX - 120, y: screenY - 610 }, speed, "Linear", () => {});
            scene.gameEngine.add.animator().moveObject(scene.cheat_reel_3, { x: screenX - 30, y: screenY - 610 }, speed, "Linear", () => {});
            scene.gameEngine.add.animator().moveObject(scene.ToolCheatArrow, { x: screenX - 205, y: screenY - 467 }, speed, "Linear", () => {});
            scene.gameEngine.add.animator().moveObject(scene.cheatToolArrow, { x: screenX - 155, y: screenY - 467 }, speed, "Linear", () => {
                scene.flag.onClickTool = false;
            });
        } else {
            scene.gameEngine.add.animator().moveObject(scene.cheatTool, { x: screenX - 120, y: screenY - 400 }, speed, "Linear", () => {});
            scene.gameEngine.add.animator().moveObject(scene.cheatToolTitle, { x: screenX - 120, y: screenY - 450 }, speed, "Linear", () => {});
            scene.gameEngine.add.animator().moveObject(scene.fieldCheat1, { x: screenX - 210, y: screenY - 410 }, speed, "Linear", () => {});
            scene.gameEngine.add.animator().moveObject(scene.fieldCheat2, { x: screenX - 120, y: screenY - 410 }, speed, "Linear", () => {});
            scene.gameEngine.add.animator().moveObject(scene.fieldCheat3, { x: screenX - 30, y: screenY - 410 }, speed, "Linear", () => {});
            scene.gameEngine.add.animator().moveObject(scene.cheat_reel_1, { x: screenX - 210, y: screenY - 410 }, speed, "Linear", () => {});
            scene.gameEngine.add.animator().moveObject(scene.cheat_reel_2, { x: screenX - 120, y: screenY - 410 }, speed, "Linear", () => {});
            scene.gameEngine.add.animator().moveObject(scene.cheat_reel_3, { x: screenX - 30, y: screenY - 410 }, speed, "Linear", () => {});
            scene.gameEngine.add.animator().moveObject(scene.ToolCheatArrow, { x: screenX - 205, y: screenY - 345 }, speed, "Linear", () => {});
            scene.gameEngine.add.animator().moveObject(scene.cheatToolArrow, { x: screenX - 155, y: screenY - 345 }, speed, "Linear", () => {
                scene.flag.onClickTool = false;
            });
        }
    }
}