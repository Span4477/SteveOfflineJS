import Phaser from 'phaser';

// Load StarField.js
import StarField from './scenes/StarField';
import ScreenToWorld from './ui/ScreenToWorld';
import GridLines from './ui/GridLines';
import Player from './entities/Player';
import StatusBars from './ui/StatusBars';

class GameScene extends Phaser.Scene
{
    constructor ()
    {
        super('Game');
        
    }

    preload ()
    {
        // Here you can preload assets, like images or audio files
        // this.load.image('logo', 'assets/logo.png');
        this.load.image('thrust', 'assets/thrust.png');

    }

    create ()
    {
        // Add your game objects into the scene here
        // this.add.image(400, 300, 'logo');

        
        // Initialize ScreenToWorld
        this.screenToWorld = new ScreenToWorld(this.game.config.width, this.game.config.height, 10000);

        this.starField = new StarField(this, 1);

        this.gridLines = new GridLines(this);

        // Place the player at the center of the screen
        this.player = new Player(this, this.screenToWorld, 0, 0);

        // Create the status bars
        this.statusBars = new StatusBars(this, this.player);
        
        // Listen for wheel events
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            if (deltaY > 0) {
                // Scroll wheel was moved down, zoom out
                this.screenToWorld.zoomOut();
            } else {
                // Scroll wheel was moved up, zoom in
                this.screenToWorld.zoomIn();
            }
        });
        
        // Set an input event listener
        this.input.on('pointerdown', (pointer) => {
            const screenX = pointer.x;
            const screenY = pointer.y;
            
            const worldPoint = this.screenToWorld.toWorldCoordinates(screenX, screenY);
            
            console.log(`Screen coordinates: (${screenX}, ${screenY})`);
            console.log(`Game coordinates: (${worldPoint.x}, ${worldPoint.y})`);

            this.player.setApproach(worldPoint.x, worldPoint.y);
        });
        
        // Setup keyboard event listener
        this.input.keyboard.on('keydown', (event) => {
            console.log(`Key pressed: ${event.key}`);
            if (event.key === 's') {
                this.player.setMoveState('stop');
            }
        });

    }

    update ()
    {
        // Here goes the game logic that needs to run every frame

        this.gridLines.draw(this.screenToWorld);
        this.player.update();

        // Update the statusBars
        this.statusBars.update();
        
    }

    
    
}

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    scene: GameScene,
    backgroundColor: '#000000'
};

const game = new Phaser.Game(config);
