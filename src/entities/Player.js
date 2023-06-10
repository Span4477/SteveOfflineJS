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

        
        this.approachText = this.scene.add.text(0, 0, 'Approach', { color: '#ffffff', fontSize: '12px' }).setOrigin(0.5, 0.5);
        this.approachText.setVisible(false);
    }

    draw() {
        const triangleLength = 10;

        // Clear the previous frame's graphics
        this.graphics.clear();

        let screenCoordinates = this.screenToWorld.toScreenCoordinates(this.position.x, this.position.y);

        // Write to console the player's position in screen coordinates
        // console.log(screenCoordinates);

        // Draw the ship as a triangle at the ship's position
        this.graphics.beginPath();
        this.graphics.moveTo(screenCoordinates.x, screenCoordinates.y - triangleLength);
        this.graphics.lineTo(screenCoordinates.x + triangleLength, screenCoordinates.y + triangleLength);
        this.graphics.lineTo(screenCoordinates.x - triangleLength, screenCoordinates.y + triangleLength);
        this.graphics.lineTo(screenCoordinates.x, screenCoordinates.y - triangleLength);
        this.graphics.strokePath();
        this.graphics.closePath();

        // If the moveState is 'approach', draw a line from the ship to the approach point.
        // The start of the line should be offset from the ship
        if (this.moveState === 'approach') {
            let approachScreenCoords = this.screenToWorld.toScreenCoordinates(this.approach.x, this.approach.y);
            this.graphics.beginPath();
            let lineX = screenCoordinates.x + 2 * triangleLength * Math.cos(Math.atan2(approachScreenCoords.y - screenCoordinates.y, approachScreenCoords.x - screenCoordinates.x));
            let lineY = screenCoordinates.y + 2 * triangleLength * Math.sin(Math.atan2(approachScreenCoords.y - screenCoordinates.y, approachScreenCoords.x - screenCoordinates.x));
            this.graphics.moveTo(lineX, lineY);
            this.graphics.lineTo(approachScreenCoords.x, approachScreenCoords.y);
            this.graphics.strokePath();
            this.graphics.closePath();


            // Write the distance from the ship to the approach point at the end of the line
            let distance = Phaser.Math.Distance.Between(this.position.x, this.position.y, this.approach.x, this.approach.y);
            let distanceText = (distance / 1000).toFixed(1) + ' km';
            // Offset the text from the end of the line
            let textX = approachScreenCoords.x + 5 * distanceText.length * Math.cos(Math.atan2(approachScreenCoords.y - screenCoordinates.y, approachScreenCoords.x - screenCoordinates.x));
            let textY = approachScreenCoords.y + 10 * Math.sin(Math.atan2(approachScreenCoords.y - screenCoordinates.y, approachScreenCoords.x - screenCoordinates.x));
            this.approachText.setPosition(textX, textY);
            this.approachText.setText(distanceText);
            this.approachText.setVisible(true);
        }

    }

    setApproach(x, y) {
        this.moveState = 'approach';
        this.approach.x = x;
        this.approach.y = y;
    }

    updateMovementState() {

        if (this.moveState = 'approach') {
            let distance = Phaser.Math.Distance.Between(this.position.x, this.position.y, this.approach.x, this.approach.y);
            if (distance < 500) {
                this.moveState = 'stop';
                this.approachText.setVisible(false);
            }
        }
    }


    update() {
        // Update position and velocity based on your game's mechanics
        this.updateCapacitor(this.scene.game.loop.delta);
        this.updateMovementState();
        this.draw();

    }
}
