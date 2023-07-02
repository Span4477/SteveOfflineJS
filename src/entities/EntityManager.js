

import Galaxy from './Galaxy';
import Player from './Player';
import {AU} from '../utils/Constants.js';


export default class EntityManager {
    constructor(scene, galaxyData, shipData) {
        this.scene = scene;
        this.entities = [];
        this.spawners = [];
        this.galaxyData = galaxyData;
        this.shipData = shipData;
        

        // Place the player at the center of the screen
        this.player = new Player(this.scene, scene.screenToWorld, 4000-AU, 2000, shipData.playerShips.rebel1);
        this.galaxy = new Galaxy(this.scene, this.galaxyData, 'Eos');

    }

    getPlayer() {
        return this.player;
    }

    getGalaxy() {
        return this.galaxy;
    }

    unselectAll() {
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].selected = false;
        }
    }

    getNearestEntity(x, y) {
        let nearestEntity = null;
        let nearestDistance = null;
        for (let i = 0; i < this.entities.length; i++) {
            let entity = this.entities[i];
            let distance = Phaser.Math.Distance.Between(x, y, entity.position.x, entity.position.y);
            if (nearestEntity == null || distance < nearestDistance) {
                nearestEntity = entity;
                nearestDistance = distance;
            }
        }
        return nearestEntity;
    }

    pushSpawners() {
        for (let i = 0; i < this.spawners.length; i++) {
            let ships = this.spawners[i].ships;
            for (let j = 0; j < ships.length; j++) {
                this.entities.push(ships[j]);
            }
        }
    }

    pushCelestials() {

        // get all from galaxy and add to list of entities
        let celestials = this.galaxy.getAll();
        for (let i = 0; i < celestials.length; i++) {
            this.entities.push(celestials[i]);
        }
        
    }

    gatherEntities() {

        this.entities = [];
        this.entities.push(this.player);
        this.pushSpawners();
        this.pushCelestials();
    }

    updateEntities() {

        // Update all entities
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].update();
        }
    }


    update() {
        this.gatherEntities();
        this.updateEntities();
    }
}