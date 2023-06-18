
import Celestial from './Celestial.js';

export default class WarpGate extends Celestial {
    constructor(scene, worldX, worldY, radius, texture, fromSystem, toSystem) {
        super(scene, worldX, worldY, radius, texture);
        this.name = 'Gate';
        this.fromSystem = fromSystem;
        this.toSystem = toSystem;
        this.activationRadius = 2500;
    }

}