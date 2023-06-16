import Phaser from 'phaser';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

export default class Overview {
    constructor(scene, overviewItems) {
        this.scene = scene;
        this.overviewItems = overviewItems;
        
        // Font attributes
        this.fontAttributes = {
            fontSize: '18px',
            fill: '#ffffff',
            wordWrap: { width: 160, useAdvancedWrap: true }
        };

        // Create table
        this.table = scene.rexUI.add.gridTable({
            x: scene.game.config.width - 100,  // Adjust these values to change the table position
            y: 50,
            width: 400,
            height: 300,

            scrollMode: 0,

            background: scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, 0x4e342e),

            table: {
                cellWidth: 80,
                cellHeight: 30,

                columns: [
                    {
                        name: 'type', 
                        text: 'Type', 
                        cellWidth: 60, 
                        align: 'left'
                    },
                    { name: 'name', text: 'Name', cellWidth: 160 },
                    { name: 'distance', text: 'Distance' },
                    { name: 'velocity', text: 'Velocity' },
                    { name: 'angularVelocity', text: 'Angular' }
                ],
                
                mask: {
                    padding: 2,
                },
                
                reuseCellContainer: true,
            },

            slider: {
                track: scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, 0x260e04),
                thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 13, 0x7b5e57),
            },

            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
                table: 20,
                header: 10,
                footer: 10
            },

            createCellContainerCallback: (cell, cellContainer) => {
                const item = cell.item;
                const scene = cell.scene;
                if (cellContainer === undefined) {
                    cellContainer = scene.rexUI.add.label({
                        width: cell.width,
                        height: cell.height,

                        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, 0x5e4429),
                        text: scene.add.text(0, 0, '', this.fontAttributes),
                        icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, 0x0e6645),

                        space: {
                            icon: 10,
                            left: 15
                        }
                    });
                }

                cellContainer.getElement('text').setText(item.text);
                cellContainer.getElement('background').setStrokeStyle(2, 0x260e04);
                cellContainer.getElement('icon').setVisible(item.icon);
                return cellContainer;
            },

            items: this.createItems()  // We'll define this below
        });

        this.table.layout();
    }

    createItems() {
        // Iterate over the overviewItems and create the item list
        let items = this.overviewItems.map(obj => {
            return {
                icon: false,
                text: `${obj.type} - ${obj.name} - ${obj.distance} - ${obj.velocity} - ${obj.angularVelocity}`
            };
        });

        // Sort items by distance
        items.sort((a, b) => {
            const aDistance = Number(a.text.split(' - ')[2]);
            const bDistance = Number(b.text.split(' - ')[2]);
            return aDistance - bDistance;
        });

        return items;
    }
}
