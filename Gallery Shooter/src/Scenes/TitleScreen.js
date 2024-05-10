class TitleScreen extends Phaser.Scene {
    constructor() {
        super("titleScreen");
        this.my = {sprite: {}};
        this.update = this.update.bind(this);
    }

    preload(){
        this.load.setPath("./assets/");
        this.load.image("tiny_town_tiles", "kenny-tiny-town-tilemap-packed.png");
        this.load.image("tiny_battle_tiles", "tilemap_packed.png");
        this.load.tilemapTiledJSON("map", "NewWorldMap.json"); // Load the tilemap JSON
    }
    

    create() {
        let my = this.my;
        this.nextScene = this.input.keyboard.addKey("SPACE");

        // Create the map here
        this.map = this.add.tilemap("map", 16, 16, 64, 50);
        this.tileset1 = this.map.addTilesetImage("tiny-town-packed", "tiny_town_tiles");
        this.tileset2 = this.map.addTilesetImage("tilemap_packed", "tiny_battle_tiles");
        this.grassLayer = this.map.createLayer("Grass-n-Houses", this.tileset1, 0, 0);
        this.treeLayer = this.map.createLayer("Trees-n-Fences", this.tileset1, 0, 0);
        this.waterLayer = this.map.createLayer("water", this.tileset2, 0, 0);


        this.add.text(200, 200, "Monkey vs Aliens", {
            fontFamily: '"Black Ops One", system-ui', // Note the placement of the quotes!
            fontSize: 70,
            color: '#FFFFFF', // This sets the color to white.
            wordWrap: {
                width: 1000
            }
        });

        this.add.text(350, 500, "Press SPACE to Play", {
            fontFamily: "'Black Ops One'",
            fontSize: 30,
            wordWrap: {
                width: 1000
            }
        });


    }

    update() {

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("levelOne");
        }

    }


 }


 