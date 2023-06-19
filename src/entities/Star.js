
import Celestial from './Celestial.js';

export default class Star extends Celestial {
    constructor(scene, starData) {
        super(scene, starData);
        
        // Shrink the image
        this.setScale(0.2);
    }

}