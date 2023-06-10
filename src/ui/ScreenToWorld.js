
export default class ScreenToWorld {
    constructor(screenWidth, screenHeight, worldWidth) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.worldWidth = worldWidth;
        this.worldHeight = worldWidth * (screenHeight / screenWidth);
        this.maxWorldWidth = 1000000;  // Min scale (1000 km to screen width)
        this.minWorldWidth = 10000;  // Max scale (10 km to screen width)
        this.maxWorldHeight = this.maxWorldWidth * (screenHeight / screenWidth);
        this.minWorldHeight = this.minWorldWidth * (screenHeight / screenWidth);
        this.scaleFactor = this.screenWidth / this.minWorldWidth;  // Initial scale (10 km to screen width)
        this.maxScale = this.screenWidth / this.minWorldWidth;
        this.minScale = this.screenWidth / this.maxWorldWidth;
        this.worldOffsetX = this.worldWidth / 2;
        this.worldOffsetY = this.worldHeight / 2;

        this.minWorldOffsetX = this.minWorldWidth / 2;
        this.minWorldOffsetY = this.minWorldHeight / 2;
        this.maxWorldOffsetX = this.maxWorldWidth / 2;
        this.maxWorldOffsetY = this.maxWorldHeight / 2;
    }

    zoomIn() {

        this.scaleFactor *= 1.1;  // Increase scale by 10%
        this.scaleFactor = Math.min(this.scaleFactor, this.maxScale);
        // update the worldOffsetX and worldOffsetY
        this.worldOffsetX /= 1.1;
        this.worldOffsetY /= 1.1;
        this.worldOffsetX = Math.max(this.worldOffsetX, this.minWorldOffsetX);
        this.worldOffsetY = Math.max(this.worldOffsetY, this.minWorldOffsetY);
        
    }

    zoomOut() {
        this.scaleFactor /= 1.1;  // Decrease scale by 10%
        this.scaleFactor = Math.max(this.scaleFactor, this.minScale);
        this.worldOffsetX *= 1.1;
        this.worldOffsetY *= 1.1;
        this.worldOffsetX = Math.min(this.worldOffsetX, this.maxWorldOffsetX);
        this.worldOffsetY = Math.min(this.worldOffsetY, this.maxWorldOffsetY);
    }

    toScreenCoordinates(worldX, worldY) {
        let screenX = (worldX - this.worldOffsetX) * this.scaleFactor + this.screenWidth;
        let screenY = (worldY - this.worldOffsetY) * this.scaleFactor + this.screenHeight;
        
        return {x: screenX, y: screenY};
    }

    toWorldCoordinates(screenX, screenY) {
        let worldX = (screenX - this.screenWidth) / this.scaleFactor + this.worldOffsetX;
        let worldY = (screenY - this.screenHeight) / this.scaleFactor + this.worldOffsetY;
        
        return {x: worldX, y: worldY};
    }

    toWorldDistance(screenDistance) {
        return screenDistance / this.scaleFactor;
    }

    toScreenDistance(worldDistance) {
        return worldDistance * this.scaleFactor;
    }
}
