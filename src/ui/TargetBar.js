
import FilterBar from './FilterBar.js';

export default class TargetBar extends FilterBar {
    constructor(scene) {
        super(scene, scene.game.config.width - 125, 0, 125, 25);

        this.labelTips = [
            'Interact',
            'Approach', 
            'Orbit', 
            'Keep at Range',
            'Info'
        ];
        this.labels = [
            'I', 
            'A', 
            'O', 
            'K',
            '?'
        ];

    }

    getTarget() {
        let entities = this.scene.entityManager.entities;
        for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];
            if (entity.selected) {
                return entity;
            }
        }
    }

    update() {
        super.update();
        let target = this.getTarget();
        if (!target) {
            return;
        }
    }

}