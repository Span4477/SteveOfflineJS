import Phaser from 'phaser';
import Planet from './Planet';
import WarpGate from './WarpGate';
import Star from './Star';
import StarField from '../scenes/StarField';

export default class SolarSystem {
    constructor(scene, systemData) {
        this.scene = scene;
        this.systemData = systemData;
        this.name = systemData.name;

        this.starField = new StarField(scene, systemData.starFieldSeed);

        this.planets = [];
        this.warpGates = [];
        this.star = new Star(this.scene, this.systemData.star);
        
        this.createPlanets();
        this.createGates();
    }

    getAll() {
        return [this.star, ...this.planets, ...this.warpGates];
    }

    createPlanets() {
        this.systemData.planets.forEach((planetData) => {
            let planet = new Planet(this.scene, planetData);
            this.planets.push(planet);
        });
    }
    createGates() {
        this.systemData.warpGates.forEach((gateData) => {
            let warpGate = new WarpGate(this.scene, gateData, this.name);
            this.warpGates.push(warpGate);
        });
    }

    clear() {
        this.planets.forEach((planet) => {
            planet.destroy();
        });
        this.warpGates.forEach((gate) => {
            gate.destroy();
        });
        this.star.destroy();
        this.starField.clear();
        this.scene.overview.clear();
    }

}