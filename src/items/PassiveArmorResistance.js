
import ShipModule from './ShipModule.js';

export default class PassiveArmorResistance extends ShipModule {
    constructor(scene, data) {
        super(scene, data);
        this.emResistance = data.emResistance;
        this.thermalResistance = data.thermalResistance;
        this.kineticResistance = data.kineticResistance;
        this.explosiveResistance = data.explosiveResistance;
        
    }
}