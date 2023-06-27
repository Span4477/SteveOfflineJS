import Phaser from 'phaser';

export default class OverviewItem {
    constructor(gameObject, gameObjectType, player) {

        this.gameObjectType = gameObjectType;
        this.gameObject = gameObject;
        this.player = player;

        // Metrics
        this.type = this.getTypeText();
        this.name = this.getNameText();
        this.distance = this.getDistanceText();
        this.velocity = this.getVelocityText();
        this.angularVelocity = this.getAngularVelocityText();
        this.security = this.getSecurityText();

    }

    getValue(label) {
        if (label === 'Type') {
            return this.type;
        } else if (label === 'Name') {
            return this.name;
        } else if (label === 'Distance') {
            return this.distance;
        } else if (label === 'Velocity') {
            return this.velocity;
        } else if (label === 'Angular') {
            return this.angularVelocity;
        } else if (label === 'Security') {
            return this.security;
        }
    }

    getTypeText() {
        if (this.gameObjectType === 'planet') {
            return 'Planet';
        } else if (this.gameObjectType === 'ship') {
            return 'Ship';
        } else if (this.gameObjectType === 'warp gate') {
            return 'Gate';
        } else if (this.gameObjectType === 'star') {
            return 'Star';
        }
    }
    getNameText() {
        if (this.gameObjectType === 'planet') {
            return this.gameObject.name;
        } else if (this.gameObjectType === 'ship') {
            return this.gameObject.name;
        } else if (this.gameObjectType === 'warp gate') {
            return this.gameObject.name;
        } else if (this.gameObjectType === 'star') {
            return this.gameObject.name;
        }
    }
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    toMetricText(x) {
        let s = '';
        if (x < 1) {
            s = (x * 1000).toFixed(0) + 'm';
        } else if (x < 1000) {
            s = x.toFixed(0);
        } else if (x < 1000000) {
            s = (x / 1000).toFixed(0) + 'K';
        } else if (x < 1000000000) {
            s = (x / 1000000).toFixed(0) + 'M';
        } else {
            s = this.numberWithCommas((x / 1000000000).toFixed(0)) + 'B';
        }
        return s;

    }
    calcDistance() {
        let distance = Phaser.Math.Distance.Between(
            this.gameObject.position.x, 
            this.gameObject.position.y, 
            this.player.position.x, 
            this.player.position.y);
        return distance;
    }
    getDistanceText() {

        let distance = this.calcDistance();
        
        return this.toMetricText(distance) + 'm';
        
    }
    calcVelocity() {

        if (this.gameObjectType === 'planet') {
            return 0;
        } else if (this.gameObjectType === 'ship') {
            return this.gameObject.velocity.length();
        } else if (this.gameObjectType === 'warp gate') {
            return 0;
        } else if (this.gameObjectType === 'star') {
            return 0;
        }

    }
    getVelocityText() {
        
        return this.toMetricText(this.calcVelocity()) + 'm/s';
        
    }

    calculateAngularVelocity() {
        if (this.gameObjectType === 'planet') {
            return 0;
        }
        if (this.gameObjectType === 'warp gate') {
            return 0;
        }
        if (this.gameObjectType === 'star') {
            return 0;
        }
        let pVelX = this.player.velocity.x;
        let pVelY = this.player.velocity.y;
        let oVelX = this.gameObject.velocity.x;
        let oVelY = this.gameObject.velocity.y;
        let pPosX = this.player.position.x;
        let pPosY = this.player.position.y;
        let oPosX = this.gameObject.position.x;
        let oPosY = this.gameObject.position.y;

        let pVel = new Phaser.Math.Vector2(pVelX, pVelY);
        let oVel = new Phaser.Math.Vector2(oVelX, oVelY);
        let pPos = new Phaser.Math.Vector2(pPosX, pPosY);
        let oPos = new Phaser.Math.Vector2(oPosX, oPosY);

        // Get the component of the ship's velocity that is perpendicular to the vector from the ship to the player
        let pVelPerp = pVel.clone().project(oPos.clone().subtract(pPos).normalizeRightHand());
        let oVelPerp = oVel.clone().project(pPos.clone().subtract(oPos).normalizeRightHand());

        let relativeVelocity = pVelPerp.subtract(oVelPerp);

        let distance = this.calcDistance();

        let angularVelocity = relativeVelocity.length() / distance;
        // convert to degrees
        angularVelocity = angularVelocity * 180 / Math.PI;

        return angularVelocity;
    }

    
    getAngularVelocityText() {
        return this.toMetricText(this.calculateAngularVelocity()) + 'd/s';
    }

    getSecurityText() {
        if (this.gameObjectType === 'planet') {
            return this.gameObject.security.toFixed(1);
        } else if (this.gameObjectType === 'ship') {
            return this.gameObject.security.toFixed(1);
        } else if (this.gameObjectType === 'warp gate') {
            return this.gameObject.security.toFixed(1);
        } else if (this.gameObjectType === 'star') {
            return this.gameObject.security.toFixed(1);
        }

    }
    update() {
        this.type = this.getTypeText();
        this.name = this.getNameText();
        this.distance = this.getDistanceText();
        this.velocity = this.getVelocityText();
        this.angularVelocity = this.getAngularVelocityText();
        this.security = this.getSecurityText();
    }
}