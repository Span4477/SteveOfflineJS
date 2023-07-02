
import Celestial from './Celestial.js';

export default class Planet extends Celestial {
    constructor(scene, planetData) {
        super(scene, 'planet', planetData);
        this.radius = planetData.radius;
    }

}