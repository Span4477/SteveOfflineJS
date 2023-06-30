import Phaser from 'phaser';
import OverviewItem from './OverviewItem';
import OverviewTable from './OverviewTable';
import FilterBar from './FilterBar';

export default class Overview extends FilterBar {
    constructor(scene) {
        super(scene, 0, 0, 100, 25);
        this.vertical = false;
        
        this.overviewItems = [];
        
        this.table = new OverviewTable(scene);
        this.x = this.table.x + this.table.width - this.width;
        this.y = this.table.y - this.height;

        this.shipTable = new OverviewTable(scene);
        this.travelTable = new OverviewTable(scene);
        this.miningTable = new OverviewTable(scene);
        
        this.labelTips = ['All', 'Ships', 'Travel', 'Mining'];
        this.labels = ['A', 'S', 'T', 'M'];
        this.childItems.push(this.table);
        this.childItems.push(this.shipTable);
        this.childItems.push(this.travelTable);
        this.childItems.push(this.miningTable);

        this.table.toggle();
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

    filterItems() {
        this.table.data = this.overviewItems;
        this.shipTable.data = [];
        this.travelTable.data = [];
        this.miningTable.data = [];
        for (let i = 0; i < this.overviewItems.length; i++) {
            let item = this.overviewItems[i];
            if (item.gameObjectType === 'ship') {
                this.shipTable.data.push(item);
            }
            if (item.gameObjectType === 'warp gate') {
                this.travelTable.data.push(item);
                this.miningTable.data.push(item);
            }
            if (item.gameObjectType === 'planet') {
                this.travelTable.data.push(item);
            }
            if (item.gameObjectType === 'asteroid') {
                this.miningTable.data.push(item);
            }
            if (item.gameObjectType === 'star') {
                this.travelTable.data.push(item);
            }
        }
    }

    getHoverItem() {
        //get the visible table
        for (let i = 0; i < this.childItems.length; i++) {
            let obj = this.childItems[i]
            if (obj.visible) {
                return obj.data[obj.rowHoverIndex];
            }
        }
    }

    update() {
        // Update the table
        this.overviewItems = [];
        this.addGalaxy();
        this.filterItems();

        super.update();
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
