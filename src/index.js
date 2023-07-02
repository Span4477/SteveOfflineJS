import Phaser from 'phaser';

import Space from './scenes/Space';


const config = {
    type: Phaser.AUTO,
    width: window.innerWidth * 0.99,
    height: window.innerHeight * 0.98,
    parent: 'game-container',
    scene: Space,
    backgroundColor: '#000000'
};

const game = new Phaser.Game(config);
