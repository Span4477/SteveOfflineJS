
import Celestial from './Celestial.js';

export default class WarpGate extends Celestial {
    constructor(scene, gateData, fromSystemName) {
        super(scene, gateData);
        this.fromSystemName = fromSystemName;
        this.toSystemName = gateData.name;
        this.activationRadius = 2500;

        this.scaleValue = 0.2;
        this.currentScale = this.scaleValue;
        // Shrink the image
        this.setScale(0.2);

        this.isHovering = false;

        // add mouseover event
        this.setInteractive();
        this.on('pointerover', () => {
            this.isHovering = true;
        });
        this.on('pointerout', () => {
            this.isHovering = false;
        });
        this.defineScaleValue();
    }

    defineScaleValue() {
        // scale value should shrink the image so that the screen radius is 2500 meters

        // get the screen radius in pixels
        let screenRadius = this.texture.source[0].width / 2;

        // get the screen radius in meters
        let m = screenRadius * this.scene.screenToWorld.minWorldWidth / this.scene.screenToWorld.screenWidth;
        this.scaleValue = this.activationRadius / m;
    }

    jump() {
        this.isHovering = false;
        this.scene.galaxy.jumpSystem(this.toSystemName);
    }

    update() {
        if (this.currentScale != this.scaleValue * this.scene.screenToWorld.minWorldWidth / this.scene.screenToWorld.worldWidth) {
            this.currentScale = this.scaleValue * this.scene.screenToWorld.minWorldWidth / this.scene.screenToWorld.worldWidth;
            this.setScale(this.currentScale);
        }

        // Update the screen position
        let screenPosition = this.scene.screenToWorld.toScreenCoordinates(this.position.x, this.position.y);
        this.setPosition(screenPosition.x, screenPosition.y);

    }
}