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

        
        for (let i = 0; i < this.attributes.length; i++) {
            
            let attribute = this.attributes[i];
            let barWidth = this.width;
            let barX = this.x + (barWidth + this.barGap) * i;
            let barY = this.y;
            // Draw the text for the bar, rotated 90 degrees counter-clockwise
            // Capitolize the first letter of the attribute
            let label = attribute.charAt(0).toUpperCase() + attribute.slice(1);
            this.scene.add.text(barX - barWidth / 2, barY - this.height / 2, label, this.fontAttributes).setOrigin(0.5, 0.5).setAngle(-90);
        }

        
    }

    update() {
        // Clear the previous frame's graphics
        this.graphics.clear();
        for (let i = 0; i < this.attributes.length; i++) {
            let attribute = this.attributes[i];
            let barWidth = this.width;
            let barHeight = - this.height * this.player[attribute] / this.player['max' + attribute.charAt(0).toUpperCase() + attribute.slice(1)];;
            let barX = this.x + (barWidth + this.barGap) * i;
            let barY = this.y;

            // Draw the bar
            this.graphics.fillRect(barX, barY, barWidth, barHeight);
            // Draw a box outlining the bar
            this.graphics.strokeRect(barX, barY, barWidth, -this.height);
        }
        
    }
}
