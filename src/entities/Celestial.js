import Entity from './Entity.js';
import {AU} from '../utils/Constants.js';

export default class Celestial extends Entity {
    constructor(scene, type, data) {
        super(scene, scene.screenToWorld, 0, 0, type, data);
        
        this.position = new Phaser.Math.Vector2(data.position[0] * AU, data.position[1] * AU);
        this.name = data.name;
        this.security = data.security;

        this.setDepth(1);
        this.setScale(0.5);


    }


    update() {

        // Update the screen position
        let screenPosition = this.scene.screenToWorld.toScreenCoordinates(this.position.x, this.position.y);
        this.setPosition(screenPosition.x, screenPosition.y);

    }
}