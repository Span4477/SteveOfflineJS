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
        this.capacitor = 0;
        this.maxCapacitor = 100;
        this.capacitorRechargeTime = 1000 * 10;  // 1000 = 1 second
        this.speed = 0;
        this.maxSpeed = 100;
        this.approach = new Phaser.Math.Vector2(x, y);
        
    }

    updateCapacitor(delta) {
        // Update the capacitor
        if (this.capacitor > this.maxCapacitor * 0.999 ) {
            this.capacitor = this.maxCapacitor;
            return;
        }
        let a = Math.sqrt(this.capacitor / this.maxCapacitor) - 1.0;
        let b = Math.exp(-5 * delta / this.capacitorRechargeTime);
        let c = 1 + a * b;
        this.capacitor = this.maxCapacitor * c * c;
    }
    update() {
        // Implement ship-specific update logic here
    }

    // ... more methods and properties as needed
}
