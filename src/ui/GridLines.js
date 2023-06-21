
// Create a class GridLines.
// I would like to draw 5 white concentric circles on the screen. 
// The center of each circle should be the center of the screen. 
// To the right of each circle, I want to write the distance in kilometers from the center of the screen to the radius of the circle. 
// This will enable me to see how the game world coordinates change when I zoom in and out.

export default class GridLines {
    constructor(scene) {
        this.scene = scene;
        this.distances = [
            this.scene.game.config.width * 0.1,
            this.scene.game.config.width * 0.2,
            this.scene.game.config.width * 0.3,
            this.scene.game.config.width * 0.4
        ];

        this.graphics = this.scene.add.graphics({
            lineStyle: {
                color: 0xffffff
            }
        });
        this.graphics.setDepth(3);

        // Create text objects for the distances
        this.distanceTexts = this.distances.map((distance, i) => {
            let txt = this.scene.add.text(0, 0, distance, {color: '#ffffff', fontSize: '12px'});
            txt.setDepth(3);
            return txt;
        });
    }

    strokeDashedCircle(x, y, radius, dashSize, gapSize) {
        const circumference = 2 * Math.PI * radius;
        const dashCount = Math.round(circumference / (dashSize + gapSize));
        const dashAngle = (2 * Math.PI) / dashCount;

        for (let i = 0; i < dashCount; i++) {
            const angle = dashAngle * i;
            const startX = x + Math.cos(angle) * radius;
            const startY = y + Math.sin(angle) * radius;
            const endX = x + Math.cos(angle + dashAngle * dashSize / (dashSize + gapSize)) * radius;
            const endY = y + Math.sin(angle + dashAngle * dashSize / (dashSize + gapSize)) * radius;

            this.graphics.lineBetween(startX, startY, endX, endY);
        }
    }
    
    draw(screenToWorld) {
        // Clear the previous frame's graphics
        this.graphics.clear();

        // Draw circles and update distance texts
        this.distances.forEach((distance, i) => {
            // Convert the distance from world units to screen units
            let worldDistance = screenToWorld.toWorldDistance(distance);

            // Draw the dashed circle
            this.strokeDashedCircle(this.scene.game.config.width / 2, this.scene.game.config.height / 2, distance, 1, 5)

            // Update the position and text of the distance label
            //Format the label text to be in kilometers with 1 decimal place
            let label_text = (worldDistance / 1000).toFixed(1) + ' km';
            this.distanceTexts[i].setText(label_text);
            this.distanceTexts[i].setPosition(this.scene.game.config.width / 2 + distance + 10, this.scene.game.config.height / 2);
        });
    }
}