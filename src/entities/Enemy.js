import Phaser from 'phaser';

import Ship from './Ship.js';

export default class Enemy extends Ship {
    constructor(scene, screenToWorld, x, y) {
        super(scene, x, y);
        this.scene = scene;
        this.screenToWorld = screenToWorld;
        // Create the graphics for the player ship
        this.graphics = this.scene.add.graphics({ lineStyle: { color: 0xffffff } });  // White color
        this.graphics.setDepth(2);

        this.length = 10;
        
        this.shipAngle = - Math.PI / 2;

        this.name = 'Steve';
    }

    drawShip(x, y) {
        // Draw the ship as a square at the ship's position
        // Rotate the square to point in the direction of the velocity
        this.graphics.beginPath();
        if (this.speed != 0) {
            this.shipAngle = Math.atan2(this.velocity.y, this.velocity.x);
        }
        let x1 = x + this.length * Math.cos(this.shipAngle);
        let x2 = x + this.length * Math.cos(this.shipAngle + Math.PI / 2);
        let x3 = x + this.length * Math.cos(this.shipAngle + Math.PI);
        let x4 = x + this.length * Math.cos(this.shipAngle + 3 * Math.PI / 2);
        let y1 = y + this.length * Math.sin(this.shipAngle);
        let y2 = y + this.length * Math.sin(this.shipAngle + Math.PI / 2);
        let y3 = y + this.length * Math.sin(this.shipAngle + Math.PI);
        let y4 = y + this.length * Math.sin(this.shipAngle + 3 * Math.PI / 2);

        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        this.graphics.lineTo(x3, y3);
        this.graphics.lineTo(x4, y4);
        this.graphics.lineTo(x1, y1);

        this.graphics.strokePath();
        this.graphics.closePath();
    }

    draw() {

        // Clear the previous frame's graphics
        this.graphics.clear();

        let screenCoordinates = this.screenToWorld.toScreenCoordinates(this.position.x, this.position.y);

        this.drawShip(screenCoordinates.x, screenCoordinates.y);

        

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

        this.draw();

    }

}