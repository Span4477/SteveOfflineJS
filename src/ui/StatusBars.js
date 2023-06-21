import Phaser from 'phaser';

export default class StatusBars {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.x = 20;
        this.y = scene.game.config.height - 10;
        this.width = 20;
        this.height = 80;
        this.barGap = 20;
        this.attributes = ['hull', 'armor', 'shield', 'capacitor', 'speed'];


        // Create the graphics object for the bars
        this.graphics = scene.add.graphics({ fillStyle: { color: 0xffffff } });  // White color
        this.graphics.setDepth(4);

        // Create the font attributes for the text
        // https://photonstorm.github.io/phaser3-docs/Phaser.Types.GameObjects.Text.html#.TextStyle
        // The fontFamily is characters of equal width, old school style
        // Use thin characters to make the text fit better in the bar
        this.fontAttributes = { 
            color: '#ffffff', 
            fontSize: '16px', 
            align: 'center',
            fontFamily: 'Courier',
            fontStyle: 'normal',
            stroke: '#000000',
            strokeThickness: 1

        }

        this.textX = this.x + (this.width + this.barGap) * (this.attributes.length - 0.5) / 2;
        this.textY = this.y - this.height - 15;
        this.hoverText = this.scene.add.text(this.textX, this.textY, '', this.fontAttributes);
        this.hoverText.setOrigin(0.5, 0.5);
        this.hoverText.setDepth(4);
        this.hoverIndex = -1;
        this.barBoxes = [];
        
        for (let i = 0; i < this.attributes.length; i++) {
            
            let attribute = this.attributes[i];
            let barWidth = this.width;
            let barX = this.x + (barWidth + this.barGap) * i;
            let barY = this.y;
            // Draw the text for the bar, rotated 90 degrees counter-clockwise
            // Capitolize the first letter of the attribute
            let label = attribute.charAt(0).toUpperCase() + attribute.slice(1);
            let labelText = this.scene.add.text(barX - barWidth / 2, barY - this.height / 2, label, this.fontAttributes).setOrigin(0.5, 0.5).setAngle(-90);
            labelText.setDepth(4);
            
            // Create an interactive rectangle at the position of the bar
            let barBox = this.scene.add.rectangle(barX, barY, barWidth, this.height);
            barBox.setDepth(4);
            barBox.setOrigin(0, 1);
            barBox.setInteractive({ useHandCursor: true });
            // Add a pointerover event listener to the barBox
            barBox.on('pointerover', () => {
                this.hoverIndex = i;
            });
            // Add a pointerout event listener to the barBox
            barBox.on('pointerout', () => {
                // Remove the text
                this.hoverText.setText('');
                this.hoverIndex = -1;
            });
        }

        
    }
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    toMetricText(x) {
        let s = '';
        if (x < 1000) {
            s = x.toFixed(0);
        } else if (x < 1000000) {
            s = (x / 1000).toFixed(0) + 'K';
        } else if (x < 1000000000) {
            s = (x / 1000000).toFixed(0) + 'M';
        } else {
            s = this.numberWithCommas((x / 1000000000).toFixed(0)) + 'B';
        }
        return s;

    }
    formatHoverTextNumbers(curVal, maxVal) {
        // use metric system magnitudes to make the numbers more readable
        // Also use commas to separate thousands
        
        return this.toMetricText(curVal) + ' / ' + this.toMetricText(maxVal);
        
    }

    update() {
        const AU = 149597870.7 * 1000;  // 1 AU in m
        // Clear the previous frame's graphics
        this.graphics.clear();
        for (let i = 0; i < this.attributes.length; i++) {
            let attribute = this.attributes[i];
            let barWidth = this.width;
            let curVal = this.player[attribute];
            let maxVal = this.player['max' + attribute.charAt(0).toUpperCase() + attribute.slice(1)];
            
            if (attribute == 'speed' && this.player.moveState == 'warping') {
                maxVal = this.player.warpSpeedAU * AU;
            }

            let barHeight = - this.height * curVal / maxVal;
            let barX = this.x + (barWidth + this.barGap) * i;
            let barY = this.y;

            // Draw the bar
            this.graphics.fillRect(barX, barY, barWidth, barHeight);
            // Draw a box outlining the bar 
            this.graphics.strokeRect(barX, barY, barWidth, -this.height);

            if (i == this.hoverIndex) {
                // Draw the text for the bar
                this.hoverText.setText(this.formatHoverTextNumbers(curVal, maxVal));
            }
            
        }
        
    }
}
