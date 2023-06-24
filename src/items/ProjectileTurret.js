
import ShipModule from './ShipModule.js';

export default class ProjectileTurret extends ShipModule {
    constructor(scene, data) {
        super(scene, data);
        this.damage = data.damage;
        this.optimalRange = data.optimalRange;
        this.rateOfFire = data.rateOfFire;
        this.trackingSpeed = data.trackingSpeed;
        this.accuracy = data.accuracy;
    }
}