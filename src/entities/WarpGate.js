
import Celestial from './Celestial.js';

export default class WarpGate extends Celestial {
    constructor(scene, gateData, fromSystemName) {
        super(scene, gateData);
        this.fromSystemName = fromSystemName;
        this.toSystemName = gateData.name;
        this.activationRadius = 2500;

        // Shrink the image
        this.setScale(0.2);
    }

}