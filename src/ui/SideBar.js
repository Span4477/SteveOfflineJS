import InventoryPanel from "./InventoryPanel";
import FilterBar from './FilterBar.js';

export default class SideBar extends FilterBar {
    constructor(scene) {
        super(scene, 0, 0, 25, 200);

        this.labelTips = ['Inventory', 'Ship', 'Skills', 'Map', 'Journal', 'Settings'];
        this.labels = ['I', 'S', 'K', 'M', 'J', 'O'];

        this.inventoryPanel = new InventoryPanel(this.scene);

        this.childItems.push(this.inventoryPanel);

    }

}