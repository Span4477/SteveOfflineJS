import Phaser from 'phaser';
import SolarSystem from './SolarSystem';

export default class Galaxy {
    constructor(scene, galaxyData, currentSystemName) {
        this.scene = scene;
        this.galaxyData = galaxyData;
        
        this.currentSystem = null;
        this.changeSystem(currentSystemName);
        console.log(this.currentSystem.name);
    }
    changeSystem(systemName) {
        for (let i = 0; i < this.galaxyData.solarSystems.length; i++) {
            console.log(this.galaxyData.solarSystems[i].name);
            if (this.galaxyData.solarSystems[i].name == systemName) {
                this.currentSystem = new SolarSystem(this.scene, this.galaxyData.solarSystems[i]);
            }
        }
    }
    update() {
        this.currentSystem.update();
    }
}