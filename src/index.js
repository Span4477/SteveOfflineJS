import Phaser from 'phaser';

import Space from './scenes/Space';


const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    scene: Space,
    backgroundColor: '#000000'
};

const game = new Phaser.Game(config);
