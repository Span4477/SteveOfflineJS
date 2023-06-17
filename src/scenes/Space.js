import Phaser from 'phaser';

import StarField from '../scenes/StarField';
import ScreenToWorld from '../ui/ScreenToWorld';
import GridLines from '../ui/GridLines';
import Player from '../entities/Player';
import StatusBars from '../ui/StatusBars';
import InputHandler from '../ui/InputHandler';
import Planet from '../entities/Planet';
import Enemy from '../entities/Enemy';
import Overview from '../ui/Overview';

export default class Space extends Phaser.Scene {
    constructor(scene) {
        
        super('Space');
    }

    preload ()
    {
        // Here you can preload assets, like images or audio files
        // this.load.image('logo', 'assets/logo.png');
        this.load.image('thrust', 'assets/thrust.png');
        this.load.image('planet1', 'assets/planet1.png');
        this.load.image('planet2', 'assets/planet2.png');

    }

    create() {
        
        const AU = 149597870700; // 1 AU in meters
        
        // Initialize ScreenToWorld
        this.screenToWorld = new ScreenToWorld(this.game.config.width, this.game.config.height, 10000);
        
        this.starField = new StarField(this, 1);
        this.gridLines = new GridLines(this);
        // Create the planets
        this.planet1 = new Planet(this, 0, 0, 2500000, 'planet1');
        this.planet2 = new Planet(this, AU, 0, 2500000, 'planet2');


        // Place the player at the center of the screen
        this.player = new Player(this, this.screenToWorld, 0, 0);

        // create enemy
        this.enemy = new Enemy(this, this.screenToWorld, 2000, -800);

        this.overview = new Overview(this, this.screenToWorld);
        
        this.overview.addOverviewItem(this.enemy, 'enemy');
        this.overview.addOverviewItem(this.planet1, 'planet');
        this.overview.addOverviewItem(this.planet2, 'planet');

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

        this.planet1.update();
        this.planet2.update();

        // Update the statusBars
        this.statusBars.update();
        this.overview.update();

    }

}