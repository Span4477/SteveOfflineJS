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
        this.danger = this.getDangerText();

    }

    getTypeText() {
        if (this.gameObjectType === 'planet') {
            return 'Planet';
        } else if (this.gameObjectType === 'ship') {
            return 'Ship';
        }
    }
    getNameText() {
        if (this.gameObjectType === 'planet') {
            return this.gameObject.name;
        } else if (this.gameObjectType === 'ship') {
            return this.gameObject.name;
        }
    }
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    toMetricText(x) {
        let s = '';
        if (x < 1000) {
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
        }
    }
    getVelocityText() {
        
        return this.toMetricText(this.calcVelocity()) + 'm/s';
        
    }

    calculateAngularVelocity() {
        if (this.gameObjectType === 'planet') {
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

        let pToO = oPos.subtract(pPos);
        let pToOUnit = pToO.normalize();
        let pToOAngle = Phaser.Math.RadToDeg(Phaser.Math.Angle.BetweenPoints(pToOUnit, pVel));
        let oToP = pPos.subtract(oPos);
        let oToPUnit = oToP.normalize();
        let oToPAngle = Phaser.Math.RadToDeg(Phaser.Math.Angle.BetweenPoints(oToPUnit, oVel));

        let pToOAngleSign = Math.sign(pToOAngle);
        let oToPAngleSign = Math.sign(oToPAngle);

        let pToOAngleAbs = Math.abs(pToOAngle);
        let oToPAngleAbs = Math.abs(oToPAngle);

        let angularVelocity = 0;

        if (pToOAngleAbs > oToPAngleAbs) {
            angularVelocity = pToOAngleSign * (pToOAngleAbs - oToPAngleAbs);
        }
        else if (pToOAngleAbs < oToPAngleAbs) {
            angularVelocity = oToPAngleSign * (oToPAngleAbs - pToOAngleAbs);
        }

        return angularVelocity;
    }

    
    getAngularVelocityText() {
        if (this.gameObjectType === 'planet') {
            return '0 deg/s';
        } else if (this.gameObjectType === 'ship') {
            return this.toMetricText(this.calculateAngularVelocity()) + ' deg/s';
        }
    }

    getDangerText() {
        if (this.gameObjectType === 'planet') {
            return 'low';
        } else if (this.gameObjectType === 'ship') {
            return this.gameObjectType.dangerLevel;
        }
    }
    update() {
        this.type = this.getTypeText();
        this.name = this.getNameText();
        this.distance = this.getDistanceText();
        this.velocity = this.getVelocityText();
        this.angularVelocity = this.getAngularVelocityText();
        this.danger = this.getDangerText();
    }
}