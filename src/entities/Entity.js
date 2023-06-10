import Phaser from 'phaser';

export default class Entity extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key, type) {
        super(scene, x, y, key);

        this.scene = scene;
        this.type = type;

        // Add this entity to the existing scene
        this.scene.add.existing(this);
        
        // Enable physics for movement
        this.scene.physics.world.enableBody(this, 0);
    }

    update() {
        // Can be overridden by subclasses
    }

    // ... more methods and properties as needed
}
