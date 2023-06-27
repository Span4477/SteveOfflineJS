
import Table from './Table.js';

export default class OverviewTable extends Table{
    constructor(scene) {
        super(scene, 0, 0, 0, 0);
        
        this.columnLabels = ['Name', 'Type', 'Distance', 'Velocity', 'Angular', 'Security'];
        this.columnWidths = [100, 100, 100, 100, 100, 100];
        this.columnSorters = [
            this.sortByName,
            this.sortByType,
            this.sortByDistance,
            this.sortByVelocity,
            this.sortByAngular,
            this.sortBySecurity
        ];

        // put the overview in the bottom right of the screen
        this.width = 100 * this.columnLabels.length;
        this.height = 200;
        this.x = this.scene.game.config.width - this.width - 5;
        this.y = this.scene.game.config.height - 5 - this.height;
        
    }


    sortByDistance(a, b) {
        // Sort by distance
        let distanceA = a.calcDistance();
        let distanceB = b.calcDistance();
        return distanceA - distanceB;
    }

    sortByName(a, b) {
        // Sort by name
        let nameA = a.gameObject.name.toUpperCase();
        let nameB = b.gameObject.name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1
        }
        let distanceA = a.calcDistance();
        let distanceB = b.calcDistance();
        return distanceA - distanceB;
    }

    sortByType(a, b) {
        // Sort by type
        let typeA = a.gameObjectType.toUpperCase();
        let typeB = b.gameObjectType.toUpperCase();
        if (typeA < typeB) {
            return -1;
        }
        if (typeA > typeB) {
            return 1
        }
        let distanceA = a.calcDistance();
        let distanceB = b.calcDistance();
        return distanceA - distanceB;
    }


    sortByVelocity(a, b) {
        // Sort by velocity
        let velocityA = a.calcVelocity();
        let velocityB = b.calcVelocity();
        if (velocityA == velocityB) {
            let distanceA = a.calcDistance();
            let distanceB = b.calcDistance();
            return distanceA - distanceB;
        }
        return velocityA - velocityB;
    }

    sortByAngular(a, b) {
        // Sort by angular velocity
        let angularA = a.calculateAngularVelocity();
        let angularB = b.calculateAngularVelocity();
        if (angularA == angularB) {
            let distanceA = a.calcDistance();
            let distanceB = b.calcDistance();
            return distanceA - distanceB;
        }
        return angularA - angularB;
    }

    sortBySecurity(a, b) {
        // Sort by security
        let securityA = a.gameObject.security;
        let securityB = b.gameObject.security;
        if (securityA = securityB) {
            let distanceA = a.calcDistance();
            let distanceB = b.calcDistance();
            return distanceA - distanceB;
        }
        return securityA - securityB;
    }

    update(data) {
        super.update(data);
        this.checkGateHover();
    }

    checkGateHover() {
        if (this.rowHoverIndex == -1) {
            return;
        }
        if (this.data.length == 0) {
            return;
        }
        if (this.data[this.rowHoverIndex].type == 'Gate') {
            this.data[this.rowHoverIndex].gameObject.isHovering = true;
        }
    }

    onRowClick() {
        // Clicking on a row should set the approach point
        let item = this.scene.overview.overviewItems[this.scene.overview.table.rowHoverIndex];

        this.scene.player.setApproach(
            item.gameObject.position.x,
            item.gameObject.position.y
        );
    }
    
}
