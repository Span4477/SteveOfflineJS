
import ShipModule from './ShipModule.js';

export default class ActivePropulsion extends ShipModule {
    constructor(scene, data) {
        super(scene, data);
        this.speed = data.speed;
        this.capacitorCost = data.capacitorCost;
        this.capacitorPenalty = data.capacitorPenalty;
        this.cycleTime = data.cycleTime;
        this.agilityPenalty = data.agilityPenalty;
    }
}