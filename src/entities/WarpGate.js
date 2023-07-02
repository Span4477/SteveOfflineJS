
import Celestial from './Celestial.js';

export default class WarpGate extends Celestial {
    constructor(scene, gateData, fromSystemName) {
        super(scene, 'gate', gateData);
        this.fromSystemName = fromSystemName;
        this.toSystemName = gateData.name;
        this.activationRadius = 2500;

        this.scaleValue = 0.2;
        this.currentScale = this.scaleValue;

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