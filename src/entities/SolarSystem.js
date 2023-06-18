import Phaser from 'phaser';

export default class SolarSystem {
    constructor(scene) {
        this.scene = scene;
        this.planets = [];
        this.enemies = [];
        this.player = null;
        
    }
}