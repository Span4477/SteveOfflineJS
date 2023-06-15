

export default class InputHandler {
    
    constructor(scene) {
        this.scene = scene;
    }

    handleKeydown(event) {
        
        console.log(`Key pressed: ${event.key}`);
        if (event.key === 's') {
            this.scene.player.setMoveState('stop');
        }
        if (event.key === 'w') {
            
            this.scene.player.setMoveState('startWarp');
        }
    }

    handlePointer(pointer) {
        
        const screenX = pointer.x;
        const screenY = pointer.y;
        
        const worldPoint = this.scene.screenToWorld.toWorldCoordinates(screenX, screenY);
        
        console.log(`Screen coordinates: (${screenX}, ${screenY})`);
        console.log(`Game coordinates: (${worldPoint.x}, ${worldPoint.y})`);

        this.scene.player.setApproach(worldPoint.x, worldPoint.y);
    }

    handleWheel(pointer, gameObjects, deltaX, deltaY, deltaZ) {
        
        if (deltaY > 0) {
            // Scroll wheel was moved down, zoom out
            this.scene.screenToWorld.zoomOut();
        } else {
            // Scroll wheel was moved up, zoom in
            this.scene.screenToWorld.zoomIn();
        }
    }
}