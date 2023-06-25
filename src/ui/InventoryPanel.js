import { colors } from '../utils/Colors.js';
import { fontLight, fontDark } from '../utils/Fonts.js';

export default class InventoryPanel {
    
    constructor(scene) {
        this.scene = scene;
        this.player = scene.player;
        this.x = 25;
        this.y = 0;
        this.width = 600;
        this.height = 400;
        

        this.graphics = this.scene.add.graphics();
        this.graphics.setDepth(4);

        this.backgroundColor = colors.backgroundDark;
        this.borderColor = colors.border;
        

        this.labelFont = fontLight;
        this.labelText = 'Inventory'
        this.label = this.scene.add.text(0, 0, '', this.labelFont);
        this.label.setDepth(4);
        this.label.setOrigin(0, 0.5);

        this.volumeText = this.scene.add.text(0, 0, '', this.labelFont);
        this.volumeText.setDepth(4);
        this.volumeText.setOrigin(1, 0.5);

        this.visible = false;
        this.ascending = true;

        this.columnLabels = ['Name', 'Type', 'Quantity', 'Volume', 'Value'];
        this.columnWidths = [200, 100, 100, 100, 100];
        this.columnFont = fontDark;
        this.cellHeight = 20;
        this.sortIndex = 0;

        this.arrowColor = colors.textDark;


        this.headerTexts = [];
        this.createHeaderTexts();
    }

    coordInInventoryPanel(x, y) {
        // Check if the x and y coordinates are within the sidebar
        if (!this.visible) {
            return false;
        }
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
        
    }

    createHeaderTexts() {
        let cellX = this.x;
        for (let i = 0; i < this.columnLabels.length; i++) {
            let cellWidth = this.columnWidths[i];
            let cellY = this.y + this.cellHeight * 3 / 2;
            let text = this.scene.add.text(cellX + 5, cellY, '', this.columnFont);
            text.setDepth(4);
            text.setOrigin(0, 0.5);
            this.headerTexts.push(text);
            cellX += cellWidth;
        }

    }
    
    drawHeader() {

        let cellX = this.x;
        //Draw white rectangles for the header cells
        for (let i = 0; i < this.columnLabels.length; i++) {
            let cellWidth = this.columnWidths[i];
            let cellY = this.y + this.cellHeight;
            this.graphics.fillStyle(colors.backgroundLight);
            this.graphics.fillRect(cellX, cellY, cellWidth - 1, this.cellHeight);
            this.headerTexts[i].setText(this.columnLabels[i]);
            this.graphics.fillStyle(this.arrowColor);
            // If the column is sorted, draw an arrow
            if (i === this.sortIndex) {
                let arrowX = cellX + cellWidth - 10;
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
            cellX += cellWidth;
        }
    }

    drawItems() {
        for (let i = 0; i < this.player.cargo.length; i++) {
            let item = this.player.inventory[i];
            let text = this.scene.add.text(this.x + 10, this.y + 30 + i * 20, item.name, this.labelFont);
            text.setDepth(4);
            text.setOrigin(0, 0.5);
            this.graphics.fillStyle(this.borderColor, 1);
            this.graphics.strokeRect(this.x + 10, this.y + 30 + i * 20, this.width - 20, 20);
        }
    }

    draw() {
        this.graphics.clear();
        // draw black background for inventory panel
        this.graphics.fillStyle(this.backgroundColor, 0.9);
        this.graphics.fillRect(this.x, this.y, this.width, this.height);
        // draw white border around inventory panel
        this.graphics.lineStyle(1, this.borderColor, 1);
        this.graphics.strokeRect(this.x, this.y, this.width, this.height);
        this.label.setPosition(this.x + 10, this.y + 10);
        // draw white line below header
        this.graphics.fillStyle(this.borderColor, 1);
        this.graphics.strokeRect(this.x, this.y + this.cellHeight, this.width, 1);
        // draw volume text
        this.volumeText.setPosition(this.x + this.width - 5, this.y + 10);
        this.volumeText.setText('Volume: ' + this.player.getCurrentCargoVolume().toFixed(1) + '/' + this.player.cargoCapacity.toFixed(1));
        
        this.drawHeader();

    }

    toggle() {
        if (this.visible) {
            this.hide();
        } else {
            this.show();
        }
    }

    show() {
        this.visible = true;
        this.label.setText(this.labelText);
    }

    hide() {
        this.visible = false;
        this.label.setText('');
        this.volumeText.setText('');
        this.graphics.clear();
        for (let i = 0; i < this.headerTexts.length; i++) {
            this.headerTexts[i].setText('');
        }
    }

    update() {

        if (this.visible) {
            this.draw();
        }

    }

}