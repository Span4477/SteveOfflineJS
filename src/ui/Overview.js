import Phaser from 'phaser';
import OverviewItem from './OverviewItem';
import OverviewTable from './OverviewTable';

export default class Overview {
    constructor(scene) {
        this.scene = scene;
        this.overviewItems = [];
        
        this.table = new OverviewTable(scene);
        
    }

    clear() {
        this.overviewItems = [];
    }

    addOverviewItem(gameObject, gameObjectType) {
        if (gameObjectType === 'player') {
            return;
        }
        let i = new OverviewItem(gameObject, gameObjectType, this.scene.player)
        
        this.overviewItems.push(i);
    }
    
    coordInOverview(x, y) {
        return this.table.containsPoint(x, y);
    }

    update() {
        // Update the table
        this.overviewItems = [];
        
        this.addGalaxy();

        this.table.update(this.overviewItems);
        if (!this.table.visible) {
            this.table.show();
        }
    }

    addGalaxy() {
        let solarSystem = this.scene.galaxy.currentSystem;
        // add the solarSystem's planets
        for (let i = 0; i < solarSystem.planets.length; i++) {
            
            this.addOverviewItem(solarSystem.planets[i], 'planet');
        }
        // add the solarSystem's warpGates
        for (let i = 0; i < solarSystem.warpGates.length; i++) {
            this.addOverviewItem(solarSystem.warpGates[i], 'warp gate');
        }
        // add the solarSystem's star
        this.addOverviewItem(solarSystem.star, 'star');
    }

}
