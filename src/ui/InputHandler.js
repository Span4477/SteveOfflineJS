

export default class InputHandler {
    
    constructor(scene) {
        this.scene = scene;

        this.selectedObject = null;
    }

    handleKeydown(event) {
        
        console.log(`Key pressed: ${event.key}`);
        if (event.key === 's') {
            this.scene.player.setMoveState('stop');
        }
        if (event.key === 'w') {
            
            this.scene.player.setMoveState('startWarp');
        }
        if (event.key === 'j') {
            // if it is also hovering a gate, jump
            this.scene.galaxy.tryJumpSystem();
        }
    }

    handlePointer(pointer) {
        if (this.scene.overview.containsPoint(pointer.x, pointer.y)) {
            return;
        }
        if (this.scene.sideBar.containsPoint(pointer.x, pointer.y)) {
            return;
        }
        const screenX = pointer.x;
        const screenY = pointer.y;
        
        const worldPoint = this.scene.screenToWorld.toWorldCoordinates(screenX, screenY);

        let nearestEntity = this.scene.entityManager.getNearestEntity(worldPoint.x, worldPoint.y);
        if (nearestEntity) {
            let screenPoint = this.scene.screenToWorld.toScreenCoordinates(nearestEntity.position.x, nearestEntity.position.y);
            let distance = Phaser.Math.Distance.Between(pointer.x, pointer.y, screenPoint.x, screenPoint.y);
            if (distance <= nearestEntity.selectRadius) {
                nearestEntity.select();
                return;
            }
        }

        this.scene.entityManager.unselectAll();
        
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