
import Celestial from './Celestial.js';

export default class Planet extends Celestial {
    constructor(scene, worldX, worldY, radius, texture) {
        super(scene, worldX, worldY, radius, texture);
        this.name = 'Pluto';
    }

    // Add any additional methods for planets here
}