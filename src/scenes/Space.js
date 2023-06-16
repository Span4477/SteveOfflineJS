import Phaser from 'phaser';

import StarField from '../scenes/StarField';
import ScreenToWorld from '../ui/ScreenToWorld';
import GridLines from '../ui/GridLines';
import Player from '../entities/Player';
import StatusBars from '../ui/StatusBars';
import InputHandler from '../ui/InputHandler';
import Planet from '../entities/Planet';
import Enemy from '../entities/Enemy';

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

        // Add your game objects into the scene here


        const AU = 149597870700; // 1 AU in meters
        
        // Initialize ScreenToWorld
        this.screenToWorld = new ScreenToWorld(this.game.config.width, this.game.config.height, 10000);
        
        this.starField = new StarField(this, 1);
        
        // Create the planets
        this.planet1 = new Planet(this, 0, 0, 2500000, 'planet1');
        this.planet2 = new Planet(this, AU, 0, 2500000, 'planet2');

        this.gridLines = new GridLines(this);

        // Place the player at the center of the screen
        this.player = new Player(this, this.screenToWorld, 0, 0);

        // create enemy
        this.enemy = new Enemy(this, this.screenToWorld, 2000, 100);

        // Create the status bars
        this.statusBars = new StatusBars(this, this.player);

        this.inputHandler = new InputHandler(this);
        
        // Listen for wheel events
        this.input.on('wheel', this.inputHandler.handleWheel);
        
        // Set an input event listener
        this.input.on('pointerdown', this.inputHandler.handlePointer);
        
        // Setup keyboard event listener
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

    }

}