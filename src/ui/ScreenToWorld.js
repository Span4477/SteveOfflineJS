
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
        this.scaleFactor = this.minWorldWidth / this.screenWidth;  // Initial scale (10 km to screen width)
        this.maxScale = this.maxWorldWidth / this.screenWidth;
        this.minScale = this.minWorldWidth / this.screenWidth;
        this.worldOffsetX = this.worldWidth / 2;
        this.worldOffsetY = this.worldHeight / 2;

        this.minWorldOffsetX = this.minWorldWidth / 2;
        this.minWorldOffsetY = this.minWorldHeight / 2;
        this.maxWorldOffsetX = this.maxWorldWidth / 2;
        this.maxWorldOffsetY = this.maxWorldHeight / 2;

        this.scaleFactorInput = this.scaleFactor;
        this.worldWidthInput = this.worldWidth;
        this.worldHeightInput = this.worldHeight;

    }

    zoomIn() {

        this.scaleFactorInput = Math.max(this.scaleFactorInput / 1.1, this.minScale);
        this.worldWidthInput = this.scaleFactorInput * this.screenWidth;
        this.worldHeightInput = this.scaleFactorInput * this.screenHeight;
        
    }

    zoomOut() {
        
        this.scaleFactorInput = Math.min(this.scaleFactorInput * 1.1, this.maxScale);
        this.worldWidthInput = this.scaleFactorInput * this.screenWidth;
        this.worldHeightInput = this.scaleFactorInput * this.screenHeight;
    }

    toScreenCoordinates(worldX, worldY) {
        let screenX = (worldX - this.worldOffsetX) / this.scaleFactor + this.screenWidth;
        let screenY = (worldY - this.worldOffsetY) / this.scaleFactor + this.screenHeight;
        
        return {x: screenX, y: screenY};
    }

    toWorldCoordinates(screenX, screenY) {
        let worldX = (screenX - this.screenWidth) * this.scaleFactor + this.worldOffsetX;
        let worldY = (screenY - this.screenHeight) * this.scaleFactor + this.worldOffsetY;
        
        return {x: worldX, y: worldY};
    }

    toWorldDistance(screenDistance) {
        return screenDistance * this.scaleFactor;
    }

    toScreenDistance(worldDistance) {
        return worldDistance / this.scaleFactor;
    }

    centerOnPlayer(playerX, playerY) {
        // Center the screen on the player

        // ensure the player coords are not null
        if (!playerX || !playerY) {
            return;
        }

        this.worldOffsetX = playerX + this.screenWidth * this.scaleFactor / 2;
        this.worldOffsetY = playerY + this.screenHeight * this.scaleFactor / 2;
        
    }
    update() {
        this.scaleFactor = this.scaleFactorInput;
        this.worldWidth = this.worldWidthInput;
        this.worldHeight = this.worldHeightInput;
    }
}
