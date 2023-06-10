import Phaser from 'phaser';

export default class StatusBars {
    constructor(scene, player, x, y, width, height) {
        this.scene = scene;
        this.player = player;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // Create the graphics object for the bars
        this.graphics = scene.add.graphics({ fillStyle: { color: 0xffffff } });  // White color

        // Create the text objects for the labels
        this.labels = [
            scene.add.text(0, 0, 'Hull', { rotation: -Math.PI / 2 }),
            scene.add.text(0, 0, 'Armor', { rotation: -Math.PI / 2 }),
            scene.add.text(0, 0, 'Shield', { rotation: -Math.PI / 2 }),
            scene.add.text(0, 0, 'Capacitor', { rotation: -Math.PI / 2 }),
            scene.add.text(0, 0, 'Speed', { rotation: -Math.PI / 2 })
        ];

        // Adjust the position of the labels
        for (let i = 0; i < this.labels.length; i++) {
            this.labels[i].x = this.x - this.labels[i].height - 10;
            this.labels[i].y = this.y + i * (this.height / this.labels.length) + this.height / this.labels.length / 2;
        }
    }

    update() {
        // Clear the previous frame's graphics
        this.graphics.clear();

        // Draw the new bars
        const attributes = ['hull', 'armor', 'shield', 'capacitor', 'speed'];
        for (let i = 0; i < attributes.length; i++) {
            const value = this.player[attributes[i]];
            const maxValue = this.player['max' + attributes[i].charAt(0).toUpperCase() + attributes[i].slice(1)];  // e.g. 'maxHull'
            const barHeight = value / maxValue * this.height / attributes.length;
            this.graphics.fillRect(this.x, this.y + i * (this.height / attributes.length) + this.height / attributes.length - barHeight, this.width, barHeight);
        }
    }
}
