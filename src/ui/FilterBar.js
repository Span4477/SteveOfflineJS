import { colors } from '../utils/Colors.js';
import { fontLight, fontDark } from '../utils/Fonts.js';

export default class FilterBar {
    constructor(scene, x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.vertical = true;

        this.depth = 4;
        this.scene = scene;
        this.graphics = this.scene.add.graphics();
        this.graphics.setDepth(this.depth);

        this.labelTips = [];
        this.labels = [];
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

        this.childItems = [];

    }

    containsPoint(x, y) {
        // Check if the x and y coordinates are within the sidebar
        for (let i = 0; i < this.childItems.length; i++) {
            let obj = this.childItems[i]
            if (obj.containsPoint(x,y)) {
                return true;
            }
        }
        let overPanel = x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
        return overPanel;
    }

    createLabelBox(x,y,w,h,i) {
        let labelBox = this.scene.add.rectangle(x,y,w,h);
        labelBox.setOrigin(0, 0);
        labelBox.setDepth(this.depth);
        labelBox.setInteractive({ useHandCursor: true });
        labelBox.on('pointerover', () => {
            this.hoverIndex = i;
        });
        labelBox.on('pointerout', () => {
            this.hoverIndex = -1;
        });
        labelBox.on('pointerdown', () => {
            for (let j = 0; j < this.childItems.length; j++) {
                let obj = this.childItems[j]
                if (j == i) {
                    obj.toggle();
                } else {
                    obj.hide();
                }
            }
        });
        return labelBox;
    }

    getLabelBox(index) {
        // if the index is longer than the array, add a new label box

        if (index >= this.labelBoxes.length) {
            let x = this.x;
            let y = this.y + this.height * index / this.labels.length;
            let w = this.width;
            let h = this.height / this.labels.length;
            if (!this.vertical) {
                x = this.x + this.width * index / this.labels.length;
                y = this.y;
                w = this.width / this.labels.length;
                h = this.height;
            }
            let labelBox = this.createLabelBox(x,y,w,h,index);
            this.labelBoxes.push(labelBox);
            return labelBox;
        } else {
            return this.labelBoxes[index];
        }
    }

    getLabel(index) {
        // if the index is longer than the array, add a new label text
        if (index >= this.labelTexts.length) {
            let x = this.x + this.width / 2;
            let y = this.y + this.height * (index + 0.5) / this.labels.length;
            if (!this.vertical) {
                x = this.x + this.width * (index + 0.5) / this.labels.length;
                y = this.y + this.height / 2;
            }
            let labelText = this.scene.add.text(
                x, 
                y, 
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
        let x = labelBox.x + labelBox.width + 5;
        let y = labelBox.y + labelBox.height / 2;
        if (!this.vertical) {
            x = labelBox.x - labelBox.width;
            y = labelBox.y - labelBox.height + 5;
        }
        this.hoverText.setPosition(x, y);

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

        let visibleChildIndex = -1;
        for (let i = 0; i < this.childItems.length; i++) {
            let obj = this.childItems[i];
            if (obj.visible) {
                visibleChildIndex = i;
            }
        }

        // Draw a box for each label
        for (let i = 0; i < this.labels.length; i++) {
            let labelBox = this.getLabelBox(i);
            let labelText = this.getLabel(i);
            // Draw a box for the label
            if (i == this.hoverIndex && visibleChildIndex == -1) {
                this.drawInvertedLabel(labelBox, labelText);
                this.drawHoverLabel(labelBox, i);
            } else if (visibleChildIndex == i || i == this.hoverIndex) {
                this.drawInvertedLabel(labelBox, labelText);
            } else {
                this.drawNormalLabel(labelBox, labelText);
            }
            //Draw a white border around the label box
            this.graphics.lineStyle(1, colors.border, 1);
            this.graphics.strokeRect(labelBox.x, labelBox.y, labelBox.width, labelBox.height);

        }

        if (this.hoverIndex == -1) {
            this.hoverText.setText('');
        }
        // Don't show hover text if any child item is visible.
        for (let i = 0; i < this.childItems.length; i++) {
            let obj = this.childItems[i]
            if (obj.visible) {
                this.hoverText.setText('');
            }
        }

    }

    update() {
        this.draw();
        
        for (let i = 0; i < this.childItems.length; i++) {
            let obj = this.childItems[i]
            obj.update();
        }
    }

}