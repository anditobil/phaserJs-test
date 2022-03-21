class AndiGameEngine {
    constructor(context) {

        this.add = {
            globalPosition: function(type) {
                if (type == 'mobile') {
                    return {
                        x: context.cameras.main.worldView.x + context.cameras.main.width / 2,
                        y: context.cameras.main.worldView.y + context.cameras.main.height / 2
                    }
                } else {
                    let width = context.cameras.main.width;
                    let height = context.cameras.main.height;

                    if (width > 580) {
                        width = 580;
                    }

                    if (height > 960) {
                        height = 960;
                    }

                    return {
                        x: context.cameras.main.worldView.x + width / 2,
                        y: context.cameras.main.worldView.y + height / 2
                    }
                }
            },

            loadObject: function(config) {
                let available_extention = [
                    "mp3",
                    "png",
                    "jpg",
                    "jpeg"
                ];
                return {
                    loadAudio: function(file_name) {
                        let file_names = file_name.split(".");
                        let is_exist = false;
                        available_extention.forEach(element => {
                            if (file_names[1] == element) {
                                is_exist = true;
                                return;
                            }
                        });

                        if (!is_exist) {
                            console.warn("Only mp3 format is allowed");
                            return;
                        }

                        context.load.audio(file_names[0], config.audioPath + "/" + file_name);
                    },

                    loadImage: function(file_name) {
                        let file_names = file_name.split(".");
                        let is_exist = false;
                        available_extention.forEach(element => {
                            if (file_names[1] == element) {
                                is_exist = true;
                                return;
                            }
                        });

                        if (!is_exist) {
                            console.warn("Only png/jpg formats are allowed");
                            return;
                        }

                        context.load.image(file_names[0], config.imagePath + "/" + file_name);
                    },

                    loadSprite: function(file_name, dimention) {
                        let file_names = file_name.split(".");

                        let is_exist = false;
                        available_extention.forEach(element => {
                            if (file_names[1] == element) {
                                is_exist = true;
                                return;
                            }
                        });

                        if (!is_exist) {
                            console.warn("Only png/jpg formats are allowed");
                            return;
                        }

                        context.load.spritesheet(file_names[0], config.spritePath + "/" + file_name, {
                            frameWidth: dimention.width,
                            frameHeight: dimention.height
                        });
                    }
                }
            },

            loadingScreen: function(config, callback) {
                let asset_info = null;
                if (config.loadingInfo == true) {
                    asset_info = context.add.text(config.loadingPosition.x, config.loadingPosition.y + 80, "Loading: asset name", {
                        font: config.loadingInfoText.fontSize + "px " + config.loadingInfoText.fontName,
                        fill: config.loadingInfoText.fontColor,
                        align: 'center',
                        wordWrap: { width: 350, useAdvancedWrap: true },
                        boundsAlignH: "center", // bounds center align horizontally
                        boundsAlignV: "middle" // bounds center align vertically
                    });

                    asset_info.depth = 25;
                    asset_info.setOrigin(0.5, 0.5);
                }

                var favicon = context.add.image(config.loadingPosition.x, config.loadingPosition.y - 20, config.loadingLogo);
                favicon.setScale(config.loadingLogoScale);

                context.tweens.add({
                    targets: favicon,
                    y: favicon.y - 20,
                    yoyo: true,
                    duration: 1000,
                    ease: "Linear",
                    repeat: -1
                })

                var progressBar = context.add.graphics();
                progressBar.depth = 2;
                var progressBox = context.add.graphics();
                progressBox.depth = 1;
                progressBox.fillStyle(0x222222, 0.2);
                progressBox.fillRoundedRect((290) - (290 / 2) - 15, config.loadingPosition.y + 40, 320, 17, 10);

                context.load.on('progress', function(value) {
                    progressBar.clear();
                    progressBar.fillStyle(0xffffff, 1);
                    progressBar.fillRoundedRect((290) - (290 / 2) - 10, 485.5 + 38, 310 * value, 10, 4);
                    val_progress = value;
                });

                if (config.loadingInfo == true) {
                    context.load.on('fileprogress', function(file) {
                        if (!config.loadingInfo) return;
                        let percent = Math.round((val_progress * 100));
                        if (config.loadingInfoText.itemVisible) {
                            asset_info.text = "Loading: " + file.key + " " + percent + "%";
                        } else {
                            asset_info.text = "Loading: " + percent + "%";
                        }
                    });
                }
                context.load.on('complete', function() {

                    callback(100);
                    if (config.loadingInfo == true) {
                        asset_info.text = "Loading: 100%";
                    }
                    setTimeout(() => {
                        context.scene.start(config.nextSceneName);
                    }, 500);
                });
            },

            sceneTransition: function() {
                return {
                    fadeIn: function(callback, duration) {
                        context.context.cameras.main.fadeIn(duration);
                        setTimeout(() => {
                            callback();
                        }, duration);
                    },

                    fadeOut: function(callback, duration) {
                        context.context.cameras.main.fadeOut(duration);
                        setTimeout(() => {
                            callback();
                        }, duration);
                    }
                }
            },

            screenResolution: function() {
                return {
                    apply: function(type) {
                        switch (type) {
                            case "mobile":
                                this.mobileVersion(414, 475, 1, 1);
                                window.onresize = () => {
                                    this.mobileVersion(414, 475, 1, 1);
                                }
                                break;
                        }
                    },

                    mobileVersion: function(min_width, max_width, min_zoom, max_zoom) {
                        var width = window.innerWidth;
                        var height = window.innerHeight;
                        if (width < 380 && height > 800) {
                            min_zoom = 0.8;
                        }
                        var range = (max_width - min_width);
                        var calculateWidth = (max_width - width);
                        var finalZoomScale = 1 - (calculateWidth / range) * 100 / 100;
                        var zoomClamp = Phaser.Math.Clamp(finalZoomScale, min_zoom, max_zoom);
                        context.cameras.main.zoom = zoomClamp;
                    }
                }
            },

            gameLoop: function() {
                return {
                    update: function(config) {
                        let object = setInterval(() => {
                            config.callback();
                        }, 1000 / config.fps);

                        return object;
                    },

                    remove: function(obj = null) {
                        if (obj == null) {
                            console.warn("Can't remove null object");
                            return;
                        }
                        clearInterval(obj);
                    }
                }
            },

            gameObject: function() {
                return {
                    createObject: function(context) {

                    },

                    createText: function(position, value, config) {
                        let text = context.add.text(position.x, position.y, value, {
                            font: config.fontSize + "px " + config.fontName,
                            fill: config.fontColor,
                            align: config.align,
                            wordWrap: { width: 350, useAdvancedWrap: true },
                            boundsAlignH: "center",
                            boundsAlignV: "middle"
                        }).setOrigin(0.5, 0.5).setScrollFactor(config.followCamera);

                        if (config.fontStyle != null) {
                            text.setFontStyle(config.fontStyle);
                        }

                        return text;
                    }
                }
            },

            animator: function() {
                let animator_states = {
                    ghost: null,
                }
                return {
                    moveObject: function(object, target, duration, ease, callback) {
                        var tween = context.tweens.add({
                            targets: object,
                            x: target.x,
                            y: target.y,
                            ease: ease,
                            duration: duration,
                            repeat: 0,
                            yoyo: false,
                            onComplete: () => {
                                callback(object);
                            }
                        });

                        return tween;
                    },

                    moveObjectLoop: function(object, target, duration, ease, callback) {
                        var tween = context.tweens.add({
                            targets: object,
                            x: target.x,
                            y: target.y,
                            ease: ease,
                            duration: duration,
                            repeat: -1,
                            yoyo: false,
                            onRepeat: () => {
                                callback(object);
                            }
                        });

                        return tween;
                    },

                    moveObjectLoopTime: function(object, target, duration, multipleTime, ease, callbackonRepeat, callback) {
                        var tween = context.tweens.add({
                            targets: object,
                            x: target.x,
                            y: target.y,
                            ease: ease,
                            duration: duration,
                            loop: multipleTime,
                            yoyo: false,
                            onLoop: callbackonRepeat,
                            onComplete: () => {
                                callback(object);
                            }
                        });

                        return tween;
                    },

                    moveObjectLoopYoyo: function(object, target, duration, ease, callback) {
                        context.tweens.add({
                            targets: object,
                            x: target.x,
                            y: target.y,
                            ease: ease,
                            duration: duration,
                            repeat: -1,
                            yoyo: true,
                            onComplete: () => {
                                callback();
                            }
                        });
                    },

                    popUp: function(object, scale, duration, ease, callback) {
                        object.setScale(scale.start);
                        context.tweens.add({
                            targets: object,
                            scale: scale.end,
                            ease: ease,
                            duration: duration,
                            onComplete: callback
                        });
                    },

                    bloop: function(object, scale, duration, ease, callback) {
                        object.setScale(scale.start);
                        context.tweens.add({
                            targets: object,
                            scale: scale.end,
                            ease: ease,
                            duration: duration,
                            yoyo: true,
                            onComplete: callback
                        });
                    },

                    bloopLoop: function(object, scale, duration, ease, callback) {
                        object.setScale(scale.start);
                        context.tweens.add({
                            targets: object,
                            scale: scale.end,
                            ease: ease,
                            duration: duration,
                            repeat: -1,
                            yoyo: true,
                            onComplete: callback
                        });
                    },

                    gosh: function(object, fly_range, duration, ease, callback) {
                        context.tweens.add({
                            targets: object,
                            x: object.x,
                            y: object.y - fly_range,
                            alpha: 0,
                            ease: ease,
                            duration: duration,
                            repeat: 0,
                            yoyo: false,
                            onComplete: () => {
                                object.destroy();
                                callback();
                            }
                        });
                    },
                }
            },

            sceneManager: function() {
                return {
                    loadScene: function(sceneName) {
                        context.cameras.main.fadeOut(500);
                        setTimeout(() => {
                            context.scene.start(sceneName);
                            delete this;
                        }, 500);
                    }
                }
            },

            objectList: function() {
                return {
                    shuffle: function(array) {
                        let currentIndex = array.length,
                            randomIndex;

                        // While there remain elements to shuffle...
                        while (currentIndex != 0) {

                            // Pick a remaining element...
                            randomIndex = Math.floor(Math.random() * currentIndex);
                            currentIndex--;

                            // And swap it with the current element.
                            [array[currentIndex], array[randomIndex]] = [
                                array[randomIndex], array[currentIndex]
                            ];
                        }

                        return array;
                    }
                }
            }
        }

        this.formating = {
            text: function() {
                return {
                    integerToTime: function(time) {
                        if (time < 10) {
                            return "00:0" + time;
                        } else {
                            if (time > 59) {
                                return "01:00";
                            } else {
                                return "00:" + time;
                            }
                        }
                    }
                }
            },

            object: function() {
                return {
                    normalizePosition: function(a, b) {
                        var midX = game.config.width / 2;
                        var midY = game.config.height / 2;

                        var finalX = 0;
                        var finalY = 0;

                        if (a > midX) {
                            finalX = a - midX;
                        } else if (a < midX) {
                            finalX = -(midX - a);
                        } else {
                            finalX = midX;
                        }

                        if (b > midY) {
                            finalY = -(b - midY);
                        } else if (b < midY) {
                            finalY = midY - b;
                        } else {
                            finalY = midY;
                        }

                        return { x: finalX, y: finalY }
                    },
                }
            }
        }

        this.html = {
            objectElement: function(classId) {
                var div = document.getElementById(classId);
                return {
                    show: function() {
                        div.style.visibility = 'visible';
                    },

                    close: function() {
                        div.style.visibility = 'hidden';
                    },

                    elementDisplay: function(elId, display) {
                        var div = document.getElementById(elId);
                        div.style.display = display;
                    },

                    setBG: function(imageURL) {
                        div.style.backgroundImage = "url('" + imageURL + "')";
                    },

                    setOverlay: function() {
                        div.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    },

                    setImg: function(url) {
                        div.src = url;
                    }
                }
            },

            objectButton: function(classId, callback) {
                var button = document.getElementById(classId);
                var clickHandler = function() {
                    callback();
                    button.removeEventListener("click", clickHandler);
                }
                return {
                    click: function(callback) {
                        button.addEventListener('click', clickHandler);
                    },
                }
            },

            objectText: function(classId) {
                var text = document.getElementById(classId);
                return {
                    setText: function(newText, italic = 'none') {
                        if (italic == 'none') {
                            text.innerHTML = newText;
                        } else {
                            text.innerHTML = newText.italics();
                        }
                    }
                }
            },

            sceneTransition: function() {
                var div = document.getElementById('fore-ground');
                return {
                    fadeIn: function(callback) {
                        div.style.backgroundColor = "rgba(0, 0, 0, 0)";
                        setTimeout(() => {
                            callback();
                        }, 500);
                    },

                    fadeOut: function(callback) {
                        div.style.backgroundColor = "rgba(0, 0, 0, 1)";
                        setTimeout(() => {
                            callback();
                        }, 500);
                    }
                }
            },

            animator: function(classId) {
                var div = document.getElementById(classId);
                return {
                    flyIn: function(yPos) {
                        div.style.visibility = "visible";
                        div.style.transform = "translateY(" + yPos + "px)";
                    },

                    flyOut: function(yPos) {
                        div.style.visibility = "visible";
                        div.style.transform = "translateY(" + yPos + "px)";
                    }
                }
            },

            sceneManager: function() {
                return {
                    loadScene: function(sceneName) {
                        var div = document.getElementById('fore-ground');
                        div.style.backgroundColor = "rgba(0, 0, 0, 1)";
                        setTimeout(() => {
                            context.scene.start(sceneName);
                            delete this;
                        }, 500);
                    }
                }
            },
        }
    }
}