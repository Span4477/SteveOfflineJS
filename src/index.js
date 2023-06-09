import Phaser from 'phaser';

class GameScene extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        // Here you can preload assets, like images or audio files
        // this.load.image('logo', 'assets/logo.png');
    }

    create ()
    {
        // Add your game objects into the scene here
        // this.add.image(400, 300, 'logo');
    }

    update ()
    {
        // Here goes the game logic that needs to run every frame
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scene: GameScene,
    backgroundColor: '#000000'
};

const game = new Phaser.Game(config);
