import Phaser from 'phaser';

export default class OverviewTable {
    constructor(scene, overviewItems) {
        this.scene = scene;
        this.overviewItems = overviewItems;
        
        this.columnLabels = ['Name', 'Type', 'Distance', 'Velocity', 'Angular', 'Danger'];
        this.sortIndex = 2;
        this.sortArrowSize = 5;
        this.ascending = true;
        this.cellWidth = 100;
        this.cellHeight = 20;
        // put the overview in the bottom right of the screen
        this.width = this.cellWidth * this.columnLabels.length;
        this.height = 200;
        this.x = this.scene.game.config.width - this.width - 5;
        this.y = this.scene.game.config.height - 5 - this.height;

        this.graphics = scene.add.graphics({ fillStyle: { color: 0xffffff } });  // White color
        
        this.headerTexts = [];
        this.headerFormat = { 
            color: '#000000', 
            fontSize: '16px', 
            align: 'left', 
            fontFamily: 'Courier', 
            fontStyle: 'normal', 
            stroke: '#000000', 
            strokeThickness: 1 
        
        };
        this.create();
    }
    coordInOverview(x, y) {
        return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
    }
    create() {

        // Create the column labels
        for (let i = 0; i < this.columnLabels.length; i++) {
            let label = this.columnLabels[i];
            let textX = this.x + i * this.cellWidth;
            let textY = this.y + 10;
            let text = this.scene.add.text(textX, textY, label, this.headerFormat);
            text.setOrigin(0, 0.5);
            this.headerTexts.push(text);

            // Create a rectangle at the location of the text.
            // The rectangle should have a click event.
            // The click event should flag the column to be sorted.

            let rect = this.scene.add.rectangle(textX, textY, this.cellWidth - 1, this.cellHeight);
            rect.setOrigin(0, 0.5);
            rect.setInteractive();
            rect.on('pointerdown', () => {
                this.sortColumn(i);
            });

        }

    }

    sortColumn(columnIndex) {
        // Sort the overview items by the column
        console.log('sortColumn', columnIndex)
        if (columnIndex === this.sortIndex) {
            // Same column, reverse the sort order
            this.ascending = !this.ascending;
        } else {
            // Different column, sort ascending
            this.ascending = true;
        }
        this.sortIndex = columnIndex;
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
        return 0;
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
        return 0;
    }

    sortByDistance(a, b) {
        // Sort by distance
        let distanceA = a.calcDistance();
        let distanceB = b.calcDistance();
        return distanceA - distanceB;
    }

    sortByVelocity(a, b) {
        // Sort by velocity
        let velocityA = a.calcVelocity();
        let velocityB = b.calcVelocity();
        return velocityA - velocityB;
    }

    sortByAngular(a, b) {
        // Sort by angular velocity
        let angularA = a.calculateAngularVelocity();
        let angularB = b.calculateAngularVelocity();
        return angularA - angularB;
    }

    sortByDanger(a, b) {
        // Sort by danger
        let dangerA = a.gameObject.danger.toUpperCase();
        let dangerB = b.gameObject.danger.toUpperCase();
        if (dangerA < dangerB) {
            return -1;
        }
        if (dangerA > dangerB) {
            return 1
        }
        return 0;
    }

    sortOverviewItems() {
        // Sort the overview items by the column
        let sortFunction;
        switch (this.sortIndex) {
            case 0:
                sortFunction = this.sortByName;
                break;
            case 1:
                sortFunction = this.sortByType;
                break;
            case 2:
                sortFunction = this.sortByDistance;
                break;
            case 3:
                sortFunction = this.sortByVelocity;
                break;
            case 4:
                sortFunction = this.sortByAngular;
                break;
            case 5:
                sortFunction = this.sortByDanger;
                break;
            default:
                sortFunction = this.sortByName;
        }
        if (this.ascending) {
            this.overviewItems.sort(sortFunction);
        } else {
            this.overviewItems.sort(sortFunction).reverse();
        }
    }

    update(overviewItems) {
        // Update the cell values
        this.overviewItems = overviewItems;
        if (this.overviewItems.length > 0) {
            this.sortOverviewItems();
        }
        
        this.draw();
    }

    

    draw() {
        // Draw the table
        this.graphics.clear();
        // black background
        this.graphics.fillStyle(0x000000);
        this.graphics.fillRect(this.x, this.y, this.width, this.height);
        // white border
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.strokeRect(this.x, this.y, this.width, this.height);

        
        //Draw white rectangles for the header cells
        for (let i = 0; i < this.columnLabels.length; i++) {
            let cellX = this.x + i * this.cellWidth;
            let cellY = this.y;
            this.graphics.fillStyle(0xffffff);
            this.graphics.fillRect(cellX, cellY, this.cellWidth - 1, this.cellHeight);

            this.graphics.fillStyle(0x000000);
            // If the column is sorted, draw an arrow
            if (i === this.sortIndex) {
                let arrowX = cellX + this.cellWidth - 10;
                let arrowY = cellY + this.cellHeight / 2;
                let arrowSize = 5;
                if (this.ascending) {
                    //arrow pointing up
                    this.graphics.fillTriangle(arrowX, arrowY - arrowSize, arrowX + arrowSize, arrowY + arrowSize, arrowX - arrowSize, arrowY + arrowSize);
                } else {
                    //arrow pointing down
                    this.graphics.fillTriangle(arrowX, arrowY + arrowSize, arrowX + arrowSize, arrowY - arrowSize, arrowX - arrowSize, arrowY - arrowSize);
                }
            }
        }

        
    }
}
