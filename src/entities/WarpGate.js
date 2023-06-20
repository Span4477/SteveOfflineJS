
import Celestial from './Celestial.js';

export default class WarpGate extends Celestial {
    constructor(scene, gateData, fromSystemName) {
        super(scene, gateData);
        this.fromSystemName = fromSystemName;
        this.toSystemName = gateData.name;
        this.activationRadius = 2500;

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

    }

    jump() {
        this.isHovering = false;
        this.scene.galaxy.jumpSystem(this.toSystemName);
    }

}