import Entity from './Entity.js';

export default class Ship extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key, 'Ship');

        // Custom properties for ship
        // e.g., this.speed = 100;
    }

    update() {
        // Implement ship-specific update logic here
    }

    // ... more methods and properties as needed
}
