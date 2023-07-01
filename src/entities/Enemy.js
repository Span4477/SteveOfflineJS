import Phaser from 'phaser';

import Ship from './Ship.js';

export default class Enemy extends Ship {
    constructor(scene, screenToWorld, x, y, data) {
        super(scene, screenToWorld, x, y, data);
    }

    setApproach(x, y) {
        if (this.moveState == 'warping') {
            return;
        }

        this.moveState = 'approach';
        this.approach.x = x;
        this.approach.y = y;
    }

    setMoveState(state) {
        if (this.moveState == 'warping') {
            console.log('Cannot set move state while warping')
            return;
        }
        this.moveState = state;
    }
    
    stopCheck() {
        
        let distance = Phaser.Math.Distance.Between(this.position.x, this.position.y, this.approach.x, this.approach.y);
        if (distance < 500) {
            this.moveState = 'stop';
            this.stop();
        }
    }

    updateMovementState(delta) {

        if (this.moveState == 'approach') {
            this.stopCheck();
            this.accelerate(delta);
            
        } else if (this.moveState == 'stop') {
            
            this.stop();
            this.accelerate(delta);
        } else if (this.moveState == 'startWarp') {

            this.stopCheck();
            this.startWarp(delta);

        } else if (this.moveState == 'warping') {

            this.warp(delta);

        }
        
    }
    
    update() {
        let delta = this.scene.game.loop.delta;
        // Update position and velocity based on your game's mechanics
        this.updateCapacitor(delta);
        this.updateShield(delta);

        this.setSpeed();
        this.updateMovementState(delta);
        this.rotateSprite();
        super.update();

    }

}