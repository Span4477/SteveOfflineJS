import Phaser from 'phaser';
import OverviewItem from './OverviewItem';
import OverviewTable from './OverviewTable';
export default class Overview {
    constructor(scene) {
        this.scene = scene;
        this.overviewItems = [];
        
        this.table = new OverviewTable(scene, this.overviewItems);
    }

    addOverviewItem(gameObject, gameObjectType) {
        if (gameObjectType === 'player') {
            return;
        }
        let i = new OverviewItem(gameObject, gameObjectType, this.scene.player)
        
        this.overviewItems.push(i);
    }
    
    coordInOverview(x, y) {
        return this.table.coordInOverview(x, y);
    }

    update() {
        // Update the table
        this.table.update(this.overviewItems);

    }

}
