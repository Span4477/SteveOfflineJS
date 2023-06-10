// Player.js

import Ship from './Ship.js';

export default class Player extends Ship {
    constructor(scene, screenToWorld, x, y) {
        super(scene, x, y);
        this.scene = scene;
        this.screenToWorld = screenToWorld;
        // Create the graphics for the player ship
        this.graphics = this.scene.add.graphics({ lineStyle: { color: 0xffffff } });  // White color

        
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


    }
    // Update the position based on velocity
    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        this.position.x += this.velocity.x * delta / 1000;
        this.position.y += this.velocity.y * delta / 1000;
    }

    update() {
        // Update position and velocity based on your game's mechanics

        this.draw();
    }
}
