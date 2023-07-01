import Phaser from 'phaser';

export default class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, screenToWorld, x, y, type, data) {
        super(scene, 0, 0, data.image);
        console.log(data.image)
        this.scene = scene;
        this.type = type;
        this.security = 5;
        this.screenToWorld = screenToWorld;

        // Add this object to the scene
        scene.add.existing(this);

        this.graphics = this.scene.add.graphics({ lineStyle: { color: 0xffffff } });  // White color
        this.graphics.setDepth(2);

        // Initialize position and velocity
        this.position = new Phaser.Math.Vector2(x, y);
        this.velocity = new Phaser.Math.Vector2(0, 0);

        this.addedToOverview = false;
        this.removeFromOverview = false;
        this.setScale(0.25);
    }

    update() {
        let screenPosition = this.scene.screenToWorld.toScreenCoordinates(this.position.x, this.position.y);
        this.setPosition(screenPosition.x, screenPosition.y);
    }

}
