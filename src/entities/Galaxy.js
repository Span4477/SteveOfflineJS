import Phaser from 'phaser';
import SolarSystem from './SolarSystem';

export default class Galaxy {
    constructor(scene, galaxyData, currentSystemName) {
        this.scene = scene;
        this.galaxyData = galaxyData;
        
        this.currentSystem = null;
        this.changeSystem(currentSystemName);
        console.log(this.currentSystem.name);
    }
    changeSystem(systemName) {
        for (let i = 0; i < this.galaxyData.solarSystems.length; i++) {
            
            if (this.galaxyData.solarSystems[i].name == systemName) {
                console.log('Create system ' + systemName);
                this.currentSystem = new SolarSystem(this.scene, this.galaxyData.solarSystems[i]);
            }
        }
    }
    tryJumpSystem() {
        // check if player is hovering a gate
        let gates = this.currentSystem.warpGates;
        let player = this.scene.player;
        let playerX = player.position.x;
        let playerY = player.position.y;
        for (let i = 0; i < gates.length; i++) {
            let gate = gates[i];
            if (!gate.isHovering) {
                continue;
            }
            let gateX = gate.position.x;
            let gateY = gate.position.y;
            let distance = Phaser.Math.Distance.Between(playerX, playerY, gateX, gateY);
            if (distance <= gate.activationRadius) {
                this.jumpSystem(gate.toSystemName);
                return true;
            }
        }
        return false;
    }
    jumpLandingCoordinates(x, y) {
        // When the player jumps to a system, they should land 15km away from the gate, at a random direction.
        let angle = Math.random() * 2 * Math.PI;
        let distance = 15000;
        let landingX = x + distance * Math.cos(angle);
        let landingY = y + distance * Math.sin(angle);
        return { x: landingX, y: landingY };
    }
    jumpSystem(systemName) {
        let fromSystemName = this.currentSystem.name;
        this.currentSystem.clear();
        this.changeSystem(systemName);
        // move player to gate in new system
        for (let i = 0; i < this.currentSystem.warpGates.length; i++) {
            let gate = this.currentSystem.warpGates[i];
            console.log('Gate from ' + gate.fromSystemName + ' to ' + gate.toSystemName);
            if (gate.name === fromSystemName) {
                let landingCoordinates = this.jumpLandingCoordinates(gate.position.x, gate.position.y);
                this.scene.player.jumpSystem(landingCoordinates.x, landingCoordinates.y);
            }
        }
    }
    update() {
        this.currentSystem.update();
    }
}