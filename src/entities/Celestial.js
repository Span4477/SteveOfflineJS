export default class Celestial extends Phaser.GameObjects.Sprite {
    constructor(scene, data) {
        super(scene, 0, 0, data.image);
        const AU = 149597870700; // 1 AU in meters

         
        this.screenRadius = this.texture.source[0].width / 2;
        
        this.position = new Phaser.Math.Vector2(data.position[0] * AU, data.position[1] * AU);
        this.name = data.name;
        this.danger = data.danger;

        this.addedToOverview = false;
        this.removeFromOverview = false;

        // Add this object to the scene
        scene.add.existing(this);

        this.setDepth(1);
    }

    update() {

        // Update the screen position
        let screenPosition = this.scene.screenToWorld.backgroundToScreen(this.position.x, this.position.y, this.radius, this.screenRadius);
        this.setPosition(screenPosition.x, screenPosition.y);

    }
}