
export default class ShipModule {
    constructor(scene, data) {
        this.scene = scene;
        this.slot = data.slot;
        this.name = data.name;
        this.volumn = data.volume;
        this.cpu = data.cpu;
        this.powerGrid = data.powerGrid;
    }
}