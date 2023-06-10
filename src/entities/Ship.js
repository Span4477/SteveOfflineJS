import Entity from './Entity.js';

export default class Ship extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'Ship');

        // Custom properties for ship
        // e.g., this.speed = 100;
        this.hull = 100;
        this.maxHull = 100;
        this.armor = 100;
        this.maxArmor = 100;
        this.shield = 100;
        this.maxShield = 100;
        this.capacitor = 25;
        this.maxCapacitor = 100;
        this.speed = 0;
        this.maxSpeed = 100;
        
    }

    update() {
        // Implement ship-specific update logic here
    }

    // ... more methods and properties as needed
}
