import Phaser from 'phaser';
import { colors } from '../utils/Colors.js';
import { fontLight, fontDark } from '../utils/Fonts.js';
import Table from './Table.js';


export default class InventoryPanel extends Table{
    
    constructor(scene) {
        super(scene, 0, 0, 0, 0);
        this.player = scene.player;
        this.x = 25;
        this.y = 20;
        this.width = 600;
        this.height = 400;

        this.topBarHeight = 20;
        
        this.labelFont = fontLight;
        this.labelText = 'Inventory'
        this.label = this.scene.add.text(0, 0, '', this.labelFont);
        this.label.setDepth(4);
        this.label.setOrigin(0, 0.5);

        this.volumeText = this.scene.add.text(0, 0, '', this.labelFont);
        this.volumeText.setDepth(4);
        this.volumeText.setOrigin(1, 0.5);

        this.columnLabels = ['Name', 'Type', 'Quantity', 'Volume', 'Value'];
        this.columnWidths = [200, 100, 100, 100, 100];
        this.columnSorters = [
            this.sortByName,
            this.sortByType,
            this.sortByQuantity,
            this.sortByVolume,
            this.sortByValue
        ];
    }

    containsPoint(x, y) {
        // Check if the x and y coordinates are within the sidebar
        return x >= this.x && x <= this.x + this.width && y >= this.y - this.topBarHeight && y <= this.y - this.topBarHeight + this.height;
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
        let valueA = a.value;
        let valueB = b.value;
        return valueA - valueB;
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
        let valueA = a.value;
        let valueB = b.value;
        return valueA - valueB;
    }
    
    
    sortByQuantity(a, b) {
        // Sort by type
        let quantityA = a.quantity.toUpperCase();
        let quantityB = b.quantity.toUpperCase();
        if (quantityA < quantityB) {
            return -1;
        }
        if (quantityA > quantityB) {
            return 1
        }
        let valueA = a.value;
        let valueB = b.value;
        return valueA - valueB;
    }
    
    sortByVolume(a, b) {
        // Sort by type
        let volumeA = a.volume.toUpperCase();
        let volumeB = b.volume.toUpperCase();
        if (volumeA < volumeB) {
            return -1;
        }
        if (volumeA > volumeB) {
            return 1
        }
        let valueA = a.value;
        let valueB = b.value;
        return valueA - valueB;
    }
    
    sortByValue(a, b) {
        // Sort by type
        let valueA = a.value;
        let valueB = b.value;
        if (valueA < valueB) {
            return -1;
        }
        if (valueA > valueB) {
            return 1
        }
        let nameA = a.gameObject.name.toUpperCase();
        let nameB = b.gameObject.name.toUpperCase();
        return nameA < nameB ? -1 : 1;
    }


    draw() {
        super.draw();
        
        // draw black background for top bar
        this.graphics.fillStyle(this.backgroundColor, 0.9);
        this.graphics.fillRect(this.x, this.y - this.topBarHeight, this.width, this.topBarHeight);
        // draw white border around top bar
        this.graphics.lineStyle(1, this.borderColor, 1);
        this.graphics.strokeRect(this.x, this.y - this.topBarHeight, this.width, this.topBarHeight);
        // draw the label
        this.label.setText(this.labelText);
        this.label.setPosition(this.x + this.topBarHeight / 2, this.y - this.topBarHeight / 2);
        // draw volume text
        this.volumeText.setPosition(this.x + this.width - 5, this.y - this.topBarHeight / 2);
        this.volumeText.setText('Volume: ' + this.player.getCurrentCargoVolume().toFixed(1) + '/' + this.player.cargoCapacity.toFixed(1));
        
    }

    update() {
        super.update([]); // TODO get the player's inventory
        if (this.visible) {
            this.volumeText.setVisible(true);
            this.label.setVisible(true);
        } else {
            this.volumeText.setVisible(false);
            this.label.setVisible(false);
        }
    }
}