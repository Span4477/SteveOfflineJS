export default class Celestial extends Phaser.GameObjects.Sprite {
    constructor(scene, worldX, worldY, radius, texture) {
        super(scene, 0, 0, texture);

        this.radius = radius; 
        this.screenRadius = this.texture.source[0].width / 2;
        console.log('Screen radius: ' + this.screenRadius)
        console.log('Radius: ' + this.radius)
        
        this.position = new Phaser.Math.Vector2(worldX, worldY);

        // Add this object to the scene
        scene.add.existing(this);
    }

    update() {

        //TODO make the sprite smaller proportional to the world width
        

        // Update the screen position
        let screenPosition = this.scene.screenToWorld.backgroundToScreen(this.position.x, this.position.y, this.radius, this.screenRadius);
        // console.log(`Screen position: ${screenPosition.x}, ${screenPosition.y}`)
        this.setPosition(screenPosition.x, screenPosition.y);

    }
}