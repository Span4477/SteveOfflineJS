
export default class ScreenToWorld {
    constructor(gameWidth, gameHeight, worldWidth) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.worldWidth = worldWidth;
        this.worldHeight = worldWidth * (gameHeight / gameWidth);
        this.scaleFactor = this.gameWidth / this.worldWidth;  // Initial scale (10 km to game width)
        this.minScale = this.gameWidth / 1000000;  // Min scale (500 km to game width)
        this.maxScale = this.gameWidth / 10000;  // Max scale (10 km to game width)
    }

    zoomIn() {
        this.scaleFactor *= 1.1;  // Increase scale by 10%
        this.scaleFactor = Math.min(this.scaleFactor, this.maxScale);
    }

    zoomOut() {
        this.scaleFactor /= 1.1;  // Decrease scale by 10%
        this.scaleFactor = Math.max(this.scaleFactor, this.minScale);
    }

    toScreenCoordinates(worldX, worldY) {
        return {x: worldX * this.scaleFactor, y: worldY * this.scaleFactor};
    }

    toWorldCoordinates(screenX, screenY) {
        return {x: screenX / this.scaleFactor, y: screenY / this.scaleFactor};
    }
}
