import { colors } from '../utils/Colors.js';
import { fontLight, fontDark } from '../utils/Fonts.js';

export default class Table {
    
    constructor(scene, x, y, width, height) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
        this.graphics = this.scene.add.graphics();
        this.graphics.setDepth(4);

        this.backgroundColor = colors.backgroundDark;
        this.borderColor = colors.border;

        this.visible = false;
        this.ascending = true;
        this.ascendingInput = true;

        this.columnLabels = [];
        this.columnWidths = [];
        this.columnSorters = [];
        this.columnFont = fontDark;
        this.cellHeight = 20;

        this.sortIndex = 0;
        this.sortIndexInput = 0;

        this.arrowColor = colors.textDark;

        this.headerTexts = [];
        this.headerRects = [];

        this.data = [];
        this.dataTexts = [];
        this.dataFormat = fontLight;
        this.rowRectangles = [];
        this.rowHoverIndex = -1;
    }

    addRecord(r) {
        this.data.push(r);
        this.sortData();
    }

    removeRecord(r) {
        let index = this.data.indexOf(r);
        if (index > -1) {
            this.data.splice(index, 1);
        }
    }

    sortData() {
        this.sortIndex = this.sortIndexInput;
        this.ascending = this.ascendingInput;
        // Sort the data by the column
        let sorter = this.columnSorters[this.sortIndex];
        this.data.sort(sorter);
        if (!this.ascending) {
            this.data.reverse();
        }
    }

    addColumn(label, width, sorter) {
        this.columnLabels.push(label);
        this.columnWidths.push(width);
        this.columnSorters.push(sorter);
    }

    containsPoint(x, y) {
        // Check if the x and y coordinates are within the table
        if (!this.visible) {
            return false;
        }
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
        
    }

    createHeaderTexts() {
        let cellX = this.x;
        for (let i = 0; i < this.columnLabels.length; i++) {
            let cellWidth = this.columnWidths[i];
            let text = this.scene.add.text(cellX + 5, this.y + 5, this.columnLabels[i], this.columnFont);
            text.setDepth(5);
            text.setOrigin(0, 0);
            this.headerTexts.push(text);

            let rect = this.scene.add.rectangle(cellX, this.y, cellWidth - 1, this.cellHeight);
            rect.setOrigin(0, 0);
            rect.setInteractive({ useHandCursor: true });
            rect.on('pointerdown', () => {
                this.sortColumn(i);
            });
            rect.setDepth(4);
            this.headerRects.push(rect)

            cellX += cellWidth;
        }
    }

    deleteHeaderTexts() {
        for (let i = 0; i < this.headerTexts.length; i++) {
            this.headerTexts[i].destroy();
            this.headerRects[i].destroy();
        }
        this.headerTexts = [];
        this.headerRects = [];
    }
    
    sortColumn(columnIndex) {
        // Input handler for sorting the columns
        // Sort the overview items by the column
        if (columnIndex === this.sortIndexInput) {
            // Same column, reverse the sort order
            this.ascendingInput = !this.ascendingInput;
        } else {
            // Different column, sort ascending
            this.ascendingInput = true;
        }
        this.sortIndexInput = columnIndex;
    }

    drawSortArrow(cellX, cellY, cellWidth) {
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

    onRowClick() {
        //placeholder
        console.log("Row clicked");
    }

    createSelectableRow(x, y, w, h, i) {
        let newRect = this.scene.add.rectangle(x, y, w, h);
        newRect.setOrigin(0, 0);
        newRect.setInteractive({ useHandCursor: true });
        newRect.on('pointerdown', this.onRowClick);
        newRect.on('pointerover', () => {
            this.rowHoverIndex = i;
        }); 
        newRect.on('pointerout', () => {
            this.rowHoverIndex = -1;
        });
        newRect.setDepth(5);
        this.rowRectangles.push(newRect);
    }

    drawData() {
        // console.log('x: ' + this.x + ' y: ' + this.y + ' w: ' + this.width + ' h: ' + this.height)
        let dataTextIndex = 0;
        // Draw the data cells
        for (let i = 0; i < this.data.length; i++) {
            let item = this.data[i];
            let cellX = this.x;
            let cellY = this.y + (i + 1) * this.cellHeight;
            let textX = cellX + this.columnWidths[i] - 10;
            let textY = cellY + this.cellHeight / 2;
            
            if (i >= this.rowRectangles.length) {
                this.createSelectableRow(cellX, cellY, this.columnWidths[i] * this.columnLabels.length, this.cellHeight, i);
            }

            // Draw the text for each column
            for (let j = 0; j < this.columnLabels.length; j++) {
                dataTextIndex = i * this.columnLabels.length + j;
                let label = this.columnLabels[j];
                let text = item.getValue(label);
                this.graphics.fillStyle(colors.backgroundDark);
                this.graphics.strokeRect(cellX, cellY, this.columnWidths[i] - 1, this.cellHeight);

                
                // Add a text item to the list if needed
                if (dataTextIndex >= this.dataTexts.length) {
                    let newText = this.scene.add.text(textX, textY, text, this.dataFormat);
                    newText.setOrigin(1, 0.5);
                    newText.setDepth(4);
                    this.dataTexts.push(newText);
                    
                } else {
                    // Update the text item
                    this.dataTexts[dataTextIndex].setText(text);
                }

                cellX += this.columnWidths[i];
                textX += this.columnWidths[i];
            }

        }
        // Remove any extra text items
        for (let i = dataTextIndex + 1; i < this.dataTexts.length; i++) {
            this.dataTexts[i].destroy();
            this.rowRectangles[i].destroy();
        }
    }
    
    drawHeader() {

        let cellX = this.x;
        //Draw white rectangles for the header cells
        for (let i = 0; i < this.columnLabels.length; i++) {
            let cellWidth = this.columnWidths[i];
            this.graphics.fillStyle(colors.backgroundLight);
            this.graphics.fillRect(cellX, this.y, cellWidth - 1, this.cellHeight);
            
            this.graphics.fillStyle(this.arrowColor);
            // If the column is sorted, draw an arrow
            if (i === this.sortIndex) {
                this.drawSortArrow(cellX, this.y, cellWidth);
            }
            cellX += cellWidth;
        }
    }


    draw() {
        this.graphics.clear();
        // draw black background for table
        this.graphics.fillStyle(this.backgroundColor, 0.9);
        this.graphics.fillRect(this.x, this.y, this.width, this.height);
        // draw white border around table
        this.graphics.lineStyle(1, this.borderColor, 1);
        this.graphics.strokeRect(this.x, this.y, this.width, this.height);
        // draw white line below header
        this.graphics.fillStyle(this.borderColor, 1);
        this.graphics.strokeRect(this.x, this.y + this.cellHeight, this.width, 1);
        
        this.drawHeader();
        this.drawData();

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
        this.createHeaderTexts();
    }

    hide() {
        this.visible = false;
        this.deleteHeaderTexts();
        this.graphics.clear();
    }

    update(data) {
        this.data = data;

        if (this.visible) {
            this.sortData();
            this.draw();
        }

    }

}