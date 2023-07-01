// Player.js

import Ship from './Ship.js';

export default class Player extends Ship {
    constructor(scene, screenToWorld, x, y, data) {
        super(scene, screenToWorld, x, y, data);

        // Create the graphics for the player ship
        
        this.approachText = this.scene.add.text(0, 0, 'Approach', { color: '#ffffff', fontSize: '12px' }).setOrigin(0.5, 0.5);
        this.approachText.setDepth(3);
        this.approachText.setVisible(false);

        this.lineBuffer = 10;

    }

    drawApproachLine(fromX, fromY, toX, toY) {
        let lineX = fromX + 2 * this.lineBuffer * Math.cos(Math.atan2(toY - fromY, toX - fromX));
        let lineY = fromY + 2 * this.lineBuffer * Math.sin(Math.atan2(toY - fromY, toX - fromX));

        // do not draw the line if the toX, toY is closer to the ship than the lineX, lineY
        if (Phaser.Math.Distance.Between(fromX, fromY, toX, toY) < Phaser.Math.Distance.Between(fromX, fromY, lineX, lineY)) {
            return;
        }

        this.graphics.beginPath();
        this.graphics.moveTo(lineX, lineY);
        this.graphics.lineTo(toX, toY);
        this.graphics.strokePath();
        this.graphics.closePath();

    }
    drawApproachText(fromX, fromY, toX, toY) {
        // Write the distance from the ship to the approach point at the end of the line
        let distance = Phaser.Math.Distance.Between(this.position.x, this.position.y, this.approach.x, this.approach.y);
        let distanceText = (distance / 1000).toFixed(1) + ' km';
        // Offset the text from the end of the line
        let textX = toX + 5 * distanceText.length * Math.cos(Math.atan2(toY - fromY, toX - fromX));
        let textY = toY + 10 * Math.sin(Math.atan2(toY - fromY, toX - fromX));
        this.approachText.setPosition(textX, textY);
        this.approachText.setText(distanceText);
        this.approachText.setVisible(true);
    }

    draw() {

        // Clear the previous frame's graphics
        this.graphics.clear();

        let screenCoordinates = this.screenToWorld.toScreenCoordinates(this.position.x, this.position.y);

        // If the moveState is 'approach', draw a line from the ship to the approach point.
        // The start of the line should be offset from the ship
        if (this.moveState === 'approach' || this.moveState === 'warping' || this.moveState === 'startWarp') {
            let approachScreenCoords = this.screenToWorld.toScreenCoordinates(this.approach.x, this.approach.y);

            this.drawApproachLine(screenCoordinates.x, screenCoordinates.y, approachScreenCoords.x, approachScreenCoords.y);
            this.drawApproachText(screenCoordinates.x, screenCoordinates.y, approachScreenCoords.x, approachScreenCoords.y);

        }

    }


    setApproach(x, y) {
        if (this.moveStateInput == 'warping') {
            return;
        }

        this.moveStateInput = 'approach';
        this.approachXInput = x;
        this.approachYInput = y;
    }

    setMoveState(state) {
        if (this.moveStateInput == 'warping') {
            console.log('Cannot set move state while warping')
            return;
        }
        this.moveStateInput = state;
    }
    
    stopCheck() {
        
        let distance = Phaser.Math.Distance.Between(this.position.x, this.position.y, this.approach.x, this.approach.y);
        if (distance < 500) {
            this.moveState = 'stop';
            this.moveStateInput = 'stop';
            this.stop();
            this.approachText.setVisible(false);
        }
    }

    updateMovementState(delta) {

        if (this.moveState == 'approach') {

            this.stopCheck();
            this.accelerate(delta);
            
        } else if (this.moveState == 'stop') {
            
            this.approachText.setVisible(false);
            this.stop();
            this.accelerate(delta);

        } else if (this.moveState == 'startWarp') {

            this.stopCheck();
            this.startWarp(delta);

        } else if (this.moveState == 'warping') {

            this.warp(delta);

        }
        
    }

    handleInput() {
        this.moveState = this.moveStateInput;
        this.approach.x = this.approachXInput;
        this.approach.y = this.approachYInput;
    }
    
    update() {
        this.handleInput();
        let delta = this.scene.game.loop.delta;
        // Update position and velocity based on your game's mechanics
        this.updateCapacitor(delta);
        this.updateShield(delta);

        this.setSpeed();
        this.updateMovementState(delta);
        this.rotateSprite();

        this.scene.screenToWorld.centerOnPlayer(this.position.x, this.position.y);

        this.draw();
        super.update();

    }
}
