class levelOne extends Phaser.Scene {
    constructor() {
        super("levelOne");

        this.my = {sprite: {}, text: {}};

        // Create a property inside "sprite" named "bullet".
        // The bullet property has a value which is an array.
        // This array will hold bindings (pointers) to bullet sprites
        this.my.sprite.bullet = [];   
        this.maxBullets = 10;           // Don't create more than this many bullets

        this.my.sprite.enemyShips = [];

        this.my.sprite.enemyBullets = [];
        this.maxEnemyBullets = 10000;
        this.playerScore = 0;
        this.playerHealth = 3;
       
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("tiny_town_tiles", "kenny-tiny-town-tilemap-packed.png");    // tile sheet   
        this.load.image("tiny_battle_tiles", "tilemap_packed.png")
        this.load.tilemapTiledJSON("map", "NewWorldMap.json");                   // Load JSON of tilemap


        this.load.image("monkey", "monkey.png");
        this.load.image("arrow", "item_arrow.png");
        this.load.image("biegeAlien", "shipBeige_manned.png");
        this.load.image("blueAlien", "shipBlue_manned.png");
        this.load.image("greenAlien", "shipGreen_manned.png");
        this.load.image("pinkAlien", "shipPink_manned.png");
        this.load.image("yellowAlien", "shipYellow_manned.png");
        this.load.image("enemyBullet", "tile_0000.png");
        
        // For animation
        this.load.image("explosion00", "explosion00.png");
        this.load.image("explosion01", "explosion01.png");
        this.load.image("explosion02", "explosion02.png");
        this.load.image("explosion03", "explosion03.png");


        // Load the Kenny Rocket Square bitmap font
        // This was converted from TrueType format into Phaser bitmap
        // format using the BMFont tool.
        // BMFont: https://www.angelcode.com/products/bmfont/
        // Tutorial: https://dev.to/omar4ur/how-to-create-bitmap-fonts-for-phaser-js-with-bmfont-2ndc
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");


        this.load.audio("woodSound", "impactWood_medium_004.ogg");
        this.load.audio("playerSound", "impactPlate_light_002.ogg");
        this.load.audio("gameOverSound", "jingles_NES00.ogg");
        
    }

    create() {
       // document.getElementById('description').innerHTML = '<h2>Welcome to Tooka Town</h2>'
       let my = this.my;
       this.init_game();
        // Add a tile map
        // https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectFactory.html#tilemap__anchor
        // "map" refers to the key from load.tilemapTiledJSON
        // The map uses 16x16 pixel tiles, and is 10x10 tiles large
        this.map = this.add.tilemap("map", 16, 16, 64, 50);

        // Add a tileset to the map
        // First parameter: the name we gave to the tileset when it was added to Tiled
        // Second parameter: the key for the tilesheet (from this.load.image above)
        // https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.Tilemap.html#addTilesetImage__anchor
        this.tileset1 = this.map.addTilesetImage("tiny-town-packed", "tiny_town_tiles",);
        this.tileset2 = this.map.addTilesetImage("tilemap_packed", "tiny_battle_tiles");

        // Create a tile map layer
        // First parameter: name of the layer from Tiled
        // https://newdocs.phaser.io/docs/3.54.0/Phaser.Tilemaps.Tilemap#createLayer
        this.grassLayer = this.map.createLayer("Grass-n-Houses", this.tileset1, 0, 0);
      
        this.treeLayer = this.map.createLayer("Trees-n-Fences", this.tileset1, 0, 0);
        this.water = this.map.createLayer("water", this.tileset2, 0, 0);
        
       
        //this.grassLayer.setScale(2.0);
        //this.treeLayer.setScale(2.0);


        my.sprite.monkey = this.add.sprite(game.config.width/2, game.config.height - 40, "monkey");
        my.sprite.monkey.setScale(0.25);


        // Create white puff animation
        this.anims.create({
            key: "puff",
            frames: [
                { key: "explosion00" },
                { key: "explosion01" },
                { key: "explosion02" },
                { key: "explosion03" },
            ],
            framerate: 30,
            repeat: 5,
            hideOnComplete: true
        });

        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        
        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 5;
        this.bulletSpeed = 5;

        let path1 = [[420, -10], [414, 337], [15, 742], [-50, 742]];
        let path2 = [[533, -10],[578,407],[996,631],[1100, 631]]
        let path3 = [
            [11, 173], [45, 161], [60, 152], [97, 117], [106, 89], [112, 63], [92, 58], [76, 52], [33, 68],
            [23, 109], [32, 134], [96, 184], [142, 187], [205, 180], [253, 171], [292, 137], [302, 87], 
            [280, 44], [248, 34], [211, 44], [183, 79], [206, 155], [225, 196], [241, 205], [340, 204],
            [399, 184], [439, 172], [473, 129], [485, 95], [481, 57], [431, 36], [400, 58], [390, 138],
            [419, 184], [483, 191], [527, 189], [591, 180], [678, 162], [687, 87], [629, 57], [585, 60],
            [553, 112], [579, 171], [623, 208], [747, 193], [802, 166], [832, 127], [836, 90], [823, 64],
            [782, 58], [743, 82], [736, 136], [783, 188], [817, 191], [876, 193], [902, 182], [933, 171],
            [952, 163], [959, 117], [928, 77], [880, 77], [887, 133], [920, 157], [953, 179], [981, 203],
            [967, 239], [885, 270], [777, 270], [658, 262], [527, 255], [414, 250], [317, 257], [199, 257],
            [114, 253], [66, 250], [40, 253], [13, 281], [17, 326], [74, 364], [133, 380], [215, 361],
            [219, 292], [160, 279], [114, 333], [154, 401], [238, 432], [317, 407], [365, 359], [381, 308],
            [346, 284], [299, 308], [308, 382], [378, 409], [465, 419], [551, 404], [571, 331], [524, 279],
            [476, 293], [504, 385], [579, 422], [628, 430], [711, 402], [732, 347], [688, 294], [645, 345],
            [680, 423], [732, 448], [829, 428], [846, 383], [872, 327], [839, 311], [808, 354], [884, 417],
            [946, 412], [970, 405], [996, 413],[1100,631]
        ];

        
        this.time.addEvent({
            delay: 5000, // spawns an alien every 2000 milliseconds
            callback: () => this.spawnAlien(path1, 2000, 'greenAlien', 0.5, -1, false, true, -90,500,1,5),
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: 5000, // spawns an alien every 2000 milliseconds
            callback: () => this.spawnAlien(path2, 2000, 'greenAlien', 0.5, -1, false, true, -90,500,1,5),
            callbackScope: this,
            loop: true
        });



        this.time.addEvent({
            delay: 10000, // spawns an alien every 2000 milliseconds
            callback: () => this.spawnAlien(path3, 10000, 'blueAlien', 0.5, -1, false, true, -90, 1, 2, 25),
            callbackScope: this,
            loop: true
        });

        document.getElementById('description').innerHTML = '<h2>Controls.js</h2><br>A: left // D: right // Space: fire/emit'

        // Put score on screen
        my.text.score = this.add.bitmapText(700, 0, "rocketSquare", "Score " + this.playerScore);


        my.text.health = this.add.bitmapText(10, 0, "rocketSquare", "Health: " + this.playerHealth);



    }

    spawnAlien(pathPoints, duration, spriteKey, scale, repeat, yoyo, rotateToPath, rotationOffset, shootingInterval, enemyHealth, enemyPoints) {
        let my = this.my; // Ensure you have access to the `my` scope if it's defined elsewhere
       // let points = [[420, 3], [414, 337], [15, 742], [-50, 742]]; // Points for the spline
       
       let curve = new Phaser.Curves.Spline(pathPoints);
   
       let enemyShip = this.add.follower(curve, curve.points[0].x, curve.points[0].y, spriteKey);
       enemyShip.setScale(scale);
       enemyShip.scorePoints = enemyPoints;
       enemyShip.visible = true;
       enemyShip.health = enemyHealth; // Store health value in the ship

       enemyShip.lastShotTime = 0; // Initialize last shot time
       enemyShip.shootingInterval = shootingInterval; // Milliseconds between shots
   
       enemyShip.startFollow({
           duration: duration,
           ease: 'Sine.easeInOut',
           repeat: repeat,
           yoyo: yoyo,
           rotateToPath: rotateToPath,
           rotationOffset: rotationOffset,

           onStart: () => {
            this.shootBulletFromAlien(enemyShip); // Shoot immediately as it starts following the path
           },
           onComplete: () => {
               enemyShip.destroy();
           }
       });
   
       this.my.sprite.enemyShips.push(enemyShip);


       
    }

    scheduleShooting(alien) {
        this.time.addEvent({
            delay: alien.shootingInterval,
            callback: () => {
                if (alien.active) { // Check if the alien is still active
                    this.shootBulletFromAlien(alien);
                    this.scheduleShooting(alien); // Reschedule the next shot
                }
            },
            callbackScope: this
        });
    }

    shootBulletFromAlien(alien) {
    let currentTime = this.time.now; // Get current time
    if (this.my.sprite.enemyBullets.length < this.maxEnemyBullets && currentTime - alien.lastShotTime > alien.shootingInterval) {
        let bullet = this.add.sprite(alien.x, alien.y, "enemyBullet");
        bullet.isActive = true;
        this.my.sprite.enemyBullets.push(bullet);
        alien.lastShotTime = currentTime; // Update the last shot time
        console.log("Bullet shot from alien at", alien.x, alien.y);
    }
    }

    update() {
        let my = this.my;
        
        my.text.health.setText("Health: " + this.playerHealth);
        this.my.sprite.enemyBullets.forEach(bullet => {
            if (this.collides(bullet, this.my.sprite.monkey)) {
                this.playerHealth -= 1; // Damage the player
                bullet.isActive = false; // Mark bullet as not active for removal
                bullet.destroy();


                this.sound.play("playerSound", { volume: 1 });
        
                if (this.playerHealth <= 0) {
                    //console.log("Player defeated");
                    this.sound.play("gameOverSound", { volume: 1 });
                    this.scene.start("gameOver", { score: this.playerScore });
                    // Handle game over scenario
                }
            }
        });
        
        // After all collisions have been processed, filter out inactive bullets
        this.my.sprite.enemyBullets = this.my.sprite.enemyBullets.filter(bullet => bullet.isActive);

        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.monkey.x > (my.sprite.monkey.displayWidth/2)) {
                my.sprite.monkey.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.monkey.x < (game.config.width - (my.sprite.monkey.displayWidth/2))) {
                my.sprite.monkey.x += this.playerSpeed;
            }
        }


        
        // Check for bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            // Are we under our bullet quota?
            if (my.sprite.bullet.length < this.maxBullets) {
                let newBullet = this.add.sprite(
                    my.sprite.monkey.x, my.sprite.monkey.y - (my.sprite.monkey.displayHeight / 2), "arrow"
                );
                newBullet.angle = -90; // Rotate the bullet sprite
                my.sprite.bullet.push(newBullet);

                
            }
        }

        // Make all of the bullets move
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }


         // Remove all of the bullets which are offscreen
        // filter() goes through all of the elements of the array, and
        // only returns those which **pass** the provided test (conditional)
        // In this case, the condition is, is the y value of the bullet
        // greater than zero minus half the display height of the bullet? 
        // (i.e., is the bullet fully offscreen to the top?)
        // We store the array returned from filter() back into the bullet
        // array, overwriting it. 
        // This does have the impact of re-creating the bullet array on every 
        // update() call. 
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));


  

        for (let bullet of my.sprite.bullet) {
            for (let alien of my.sprite.enemyShips) {
                if (alien && bullet && this.collides(alien, bullet)) {
                    // Decrement health on hit
                    alien.health -= 1;
                    console.log(`Alien hit, health remaining: ${alien.health}`);
        
                    // Check if health has dropped to zero
                    if (alien.health <= 0) {
                        // Start explosion animation
                        this.puff = this.add.sprite(alien.x, alien.y, "explosion03").setScale(0.25).play("puff");
                        // Update score
                        this.playerScore += alien.scorePoints;
                        this.updateScore();
                        console.log("Alien Destroyed" + alien);
        
                        alien.destroy();
                        this.sound.play("woodSound", { volume: 1 });
                        this.my.sprite.enemyShips = this.my.sprite.enemyShips.filter(a => a !== alien);
                    }
                    
                    // Clear out bullet regardless of alien health
                    bullet.y = -100;
                }
            }
        }

        this.my.sprite.enemyShips = this.my.sprite.enemyShips.filter(alien => {
            if (alien.x <= -50 && alien.y === 742) {
                alien.destroy(); // Destroy the alien sprite
                return false; // Do not keep the alien in the array
            }

            if (alien.x <= 1100 && alien.y === 631) {
                alien.destroy(); // Destroy the alien sprite
                return false; // Do not keep the alien in the array
            }
            return true; // Keep the alien in the array if it's still active
        });


        this.my.sprite.enemyShips.forEach(alien => {
            if (Math.random() < 0.01) {  // Random chance to shoot
                this.shootBulletFromAlien(alien);

            }
        });


        // Move alien bullets
        this.my.sprite.enemyBullets.forEach(bullet => {
            bullet.y += 5;  // Adjust speed as necessary
        });

        // Check for collisions between alien bullets and player
        this.my.sprite.enemyBullets.forEach(bullet => {
            if (this.collides(bullet, this.my.sprite.monkey)) {
                // Handle collision, e.g., reduce player health, show explosion
                bullet.destroy();  // Remove the bullet
                // Additional effects (e.g., player damage or explosion)
            }
        });

        console.log(this.playerScore)


}



    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }


    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.playerScore);
    }

    init_game() {
        this.my.sprite.bullet = [];
        this.my.sprite.enemyBullets = [];
        this.my.sprite.enemyShips = [];
        this.playerScore = 0;
        this.playerHealth = 3;  // Reset player health to initial value
    }
}