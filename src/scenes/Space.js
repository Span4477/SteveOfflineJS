import Phaser from 'phaser';

import ScreenToWorld from '../ui/ScreenToWorld';
import GridLines from '../ui/GridLines';
import Player from '../entities/Player';
import StatusBars from '../ui/StatusBars';
import InputHandler from '../ui/InputHandler';
import Enemy from '../entities/Enemy';
import Overview from '../ui/Overview';
import Galaxy from '../entities/Galaxy';

export default class Space extends Phaser.Scene {
    constructor(scene) {
        
        super('Space');
    }

    preload ()
    {
        //images
        this.load.image('thrust', 'assets/thrust.png');
        this.load.image('gate1', 'assets/gate1.png');
        this.load.image('planet1', 'assets/planet1.png');
        this.load.image('planet2', 'assets/planet2.png');
        this.load.image('planet3', 'assets/planet3.png');
        this.load.image('planet4', 'assets/planet4.png');
        this.load.image('planet5', 'assets/planet5.png');
        this.load.image('star1', 'assets/star1.png');
        this.load.image('star2', 'assets/star2.png');

        //json
        this.load.json('galaxy', 'assets/galaxy.json');

    }

    create() {
        
        const AU = 149597870700; // 1 AU in meters
        
        // Initialize ScreenToWorld
        this.screenToWorld = new ScreenToWorld(this.game.config.width, this.game.config.height, 10000);

        let galaxyData = this.cache.json.get('galaxy');
        this.galaxy = new Galaxy(this, galaxyData, 'Eos');

        // Place the player at the center of the screen
        this.player = new Player(this, this.screenToWorld, -AU, 0);

        // create enemy
        this.enemy = new Enemy(this, this.screenToWorld, AU + 2000, AU - 800);

        this.gridLines = new GridLines(this);
        this.overview = new Overview(this, this.screenToWorld);

        // Create the status bars
        this.statusBars = new StatusBars(this, this.player);

        // Create the input handler
        this.inputHandler = new InputHandler(this);
        this.input.on('wheel', this.inputHandler.handleWheel);
        this.input.on('pointerdown', this.inputHandler.handlePointer);
        this.input.keyboard.on('keydown', this.inputHandler.handleKeydown);
    }

    update() {
        this.screenToWorld.update();
        
        // Here goes the game logic that needs to run every frame

        this.gridLines.draw(this.screenToWorld);
        this.player.update();
        this.enemy.update();

        this.galaxy.update();

        // Update the statusBars
        this.statusBars.update();
        this.overview.update();

    }

}