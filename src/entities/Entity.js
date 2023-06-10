import Phaser from 'phaser';

export default class Entity extends Phaser.GameObjects.GameObject {
    constructor(scene, x, y, type) {
        super(scene, "Entity");

        this.scene = scene;
        this.type = type;

        
        // Initialize position and velocity
        this.position = new Phaser.Math.Vector2(x, y);
        this.velocity = new Phaser.Math.Vector2(0, 0);
    }

    update() {
        // Can be overridden by subclasses
    }
    
    // Update the position based on velocity
    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        this.position.x += this.velocity.x * delta / 1000;
        this.position.y += this.velocity.y * delta / 1000;
    }

    // ... more methods and properties as needed
}
