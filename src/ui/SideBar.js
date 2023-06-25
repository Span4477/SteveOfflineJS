import InventoryPanel from "./InventoryPanel";
import { colors } from '../utils/Colors.js';
import { fontLight, fontDark } from '../utils/Fonts.js';

export default class SideBar {
    constructor(scene) {
        this.x = 0;
        this.y = 0;
        this.width = 25;
        this.height = 200;

        this.depth = 4;
        this.scene = scene;
        this.graphics = this.scene.add.graphics();
        this.graphics.setDepth(this.depth);

        this.labelTips = ['Inventory', 'Ship', 'Skills', 'Map', 'Journal', 'Settings'];
        this.labels = ['I', 'S', 'K', 'M', 'J', 'O'];
        this.labelFont = {
            fontFamily: fontLight.fontFamily,
            fontSize: fontLight.fontSize,
            color: colors.textLight2,
            align: 'center'
        };
        this.labelBoxes = [];
        this.labelTexts = [];
        this.labelIndex = -1;

        this.hoverFont = fontLight;
        this.hoverIndex = -1;
        this.hoverText = this.scene.add.text(0, 0, '', this.hoverFont);
        this.hoverText.setDepth(this.depth + 1);
        this.hoverText.setOrigin(0, 0.5);

        this.inventoryPanel = new InventoryPanel(this.scene);

    }

    coordInSideBar(x, y) {
        // Check if the x and y coordinates are within the sidebar
        let overPanel = x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
        let overInventory = this.inventoryPanel.coordInInventoryPanel(x, y);
        return overPanel || overInventory;

    }

    getLabelBox(index) {
        // if the index is longer than the array, add a new label box
        if (index >= this.labelBoxes.length) {
            let labelBox = this.scene.add.rectangle(
                this.x, 
                this.y + this.height * index / this.labels.length, 
                this.width, 
                this.height / this.labels.length
            );
            labelBox.setOrigin(0, 0);
            labelBox.setDepth(this.depth);
            labelBox.setInteractive({ useHandCursor: true });
            labelBox.on('pointerover', () => {
                this.hoverIndex = index;
            });
            labelBox.on('pointerout', () => {
                this.hoverIndex = -1;
            });
            labelBox.on('pointerdown', () => {
                if (index == 0) {
                    this.inventoryPanel.toggle();
                } else {
                    this.inventoryPanel.hide();
                }
            });
            this.labelBoxes.push(labelBox);
            return labelBox;
        } else {
            return this.labelBoxes[index];
        }
    }

    getLabel(index) {
        // if the index is longer than the array, add a new label text
        if (index >= this.labelTexts.length) {
            let labelText = this.scene.add.text(
                this.x + this.width / 2, 
                this.y + this.height * (index + 0.5) / this.labels.length, 
                this.labels[index], 
                this.labelFont
            );
            labelText.setOrigin(0.5, 0.5);
            labelText.setDepth(this.depth);
            this.labelTexts.push(labelText);
            return labelText;
        } else {
            return this.labelTexts[index];
        }
    }

    drawHoverLabel(labelBox, i) {

        this.hoverText.setText(this.labelTips[i]);
        this.hoverText.setPosition(labelBox.x + labelBox.width + 5, labelBox.y + labelBox.height / 2);

        // draw black rectangle behind the hover text
        let hoverTextWidth = this.hoverText.width;
        let hoverTextHeight = this.hoverText.height;
        this.graphics.fillStyle(colors.backgroundDark, 0.8);
        this.graphics.fillRect(
            this.hoverText.x - 5,
            this.hoverText.y - hoverTextHeight / 2 - 5,
            hoverTextWidth + 10,
            hoverTextHeight + 10
        );
    }

    drawInvertedLabel(labelBox, labelText) {

        this.graphics.fillStyle(colors.backgroundLight, 1);
        this.graphics.fillRect(labelBox.x, labelBox.y, labelBox.width, labelBox.height);
        labelText.setColor(colors.textDark2);
    }

    drawNormalLabel(labelBox, labelText) {
        this.graphics.fillStyle(colors.backgroundDark, 1);
        this.graphics.fillRect(labelBox.x, labelBox.y, labelBox.width, labelBox.height);
        labelText.setColor(colors.textLight2);
    }

    draw() {
        this.graphics.clear();

        // Draw a box for each label
        for (let i = 0; i < this.labels.length; i++) {
            let labelBox = this.getLabelBox(i);
            let labelText = this.getLabel(i);
            // Draw a box for the label
            if (i == this.hoverIndex && !this.inventoryPanel.visible) {
                this.drawInvertedLabel(labelBox, labelText);
                this.drawHoverLabel(labelBox, i);
            } else if (this.inventoryPanel.visible && i == 0) {
                this.drawInvertedLabel(labelBox, labelText);
            } else {
                this.drawNormalLabel(labelBox, labelText);
            }
            //Draw a white border around the label box
            this.graphics.lineStyle(1, colors.border, 1);
            this.graphics.strokeRect(labelBox.x, labelBox.y, labelBox.width, labelBox.height);

        }

        if (this.hoverIndex == -1 || this.inventoryPanel.visible) {
            this.hoverText.setText('');
        }

    }

    update() {
        this.draw();
        this.inventoryPanel.update();
    }

}