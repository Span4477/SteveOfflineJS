// Player.js

import Ship from './Ship.js';

export default class Player extends Ship {
    constructor(scene, screenToWorld, x, y) {
        super(scene, x, y);
        this.scene = scene;
        this.screenToWorld = screenToWorld;
        // Create the graphics for the player ship
        this.graphics = this.scene.add.graphics({ lineStyle: { color: 0xffffff } });  // White color

        this.moveState = 'stop';
        this.triangleLength = 10;
        
        this.approachText = this.scene.add.text(0, 0, 'Approach', { color: '#ffffff', fontSize: '12px' }).setOrigin(0.5, 0.5);
        this.approachText.setVisible(false);
    }

    drawApproachLine(fromX, fromY, toX, toY) {
        let lineX = fromX + 2 * this.triangleLength * Math.cos(Math.atan2(toY - fromY, toX - fromX));
        let lineY = fromY + 2 * this.triangleLength * Math.sin(Math.atan2(toY - fromY, toX - fromX));

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
    drawShipTriangle(x, y) {
        // Draw the ship as a triangle at the ship's position
        this.graphics.beginPath();
        this.graphics.moveTo(x, y - this.triangleLength);
        this.graphics.lineTo(x + this.triangleLength, y + this.triangleLength);
        this.graphics.lineTo(x - this.triangleLength, y + this.triangleLength);
        this.graphics.lineTo(x, y - this.triangleLength);
        this.graphics.strokePath();
        this.graphics.closePath();
    }

    draw() {

        // Clear the previous frame's graphics
        this.graphics.clear();

        let screenCoordinates = this.screenToWorld.toScreenCoordinates(this.position.x, this.position.y);

        this.drawShipTriangle(screenCoordinates.x, screenCoordinates.y);

        // If the moveState is 'approach', draw a line from the ship to the approach point.
        // The start of the line should be offset from the ship
        if (this.moveState === 'approach') {
            let approachScreenCoords = this.screenToWorld.toScreenCoordinates(this.approach.x, this.approach.y);

            this.drawApproachLine(screenCoordinates.x, screenCoordinates.y, approachScreenCoords.x, approachScreenCoords.y);
            this.drawApproachText(screenCoordinates.x, screenCoordinates.y, approachScreenCoords.x, approachScreenCoords.y);

        }

    }

    setApproach(x, y) {
        this.moveState = 'approach';
        this.approach.x = x;
        this.approach.y = y;
    }

    setMoveState(state) {
        this.moveState = state;
    }

    updateMovementState() {

        if (this.moveState == 'approach') {
            let distance = Phaser.Math.Distance.Between(this.position.x, this.position.y, this.approach.x, this.approach.y);
            if (distance < 500) {
                this.moveState = 'stop';
                this.approachText.setVisible(false);
            }
        } else if (this.moveState == 'stop') {
            
            this.approachText.setVisible(false);
        }
    }


    update() {
        // Update position and velocity based on your game's mechanics
        this.updateCapacitor(this.scene.game.loop.delta);
        this.updateMovementState();
        this.draw();

    }
}
