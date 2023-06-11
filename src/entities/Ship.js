import Entity from './Entity.js';

export default class Ship extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'Ship');

        // Custom properties for ship
        // e.g., this.speed = 100;
        this.hull = 100;
        this.maxHull = 100;
        this.armor = 100;
        this.maxArmor = 100;
        this.shield = 100;
        this.maxShield = 100;
        this.capacitor = 0;
        this.maxCapacitor = 100;
        this.capacitorRechargeTime = 1000 * 10;  // 1000 = 1 second
        this.speed = this.getSpeed();
        this.maxSpeed = 500;
        this.approach = new Phaser.Math.Vector2(x, y);
        this.inertiaModifier = 5;

        
        this.thrustParticle = {
            speed: {min: 10, max: 20},
            lifespan: 5000,
            scale: {start: 1, end: 0},
            emitting: false
        }

        this.thrustEmitter = this.scene.add.particles(
            0,
            0,
            'thrust',
            this.thrustParticle
        );
        
    }

    

    emitThrust() {
        if (this.speed == 0) {
            return;
        }
        
        const angle = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI;
        const speed = this.velocity.length();
        let x = this.position.x + 100 * Math.cos(angle);
        let y = this.position.y + 100 * Math.sin(angle);
        let screenCoords = this.screenToWorld.toScreenCoordinates(x, y);
        x = screenCoords.x;
        y = screenCoords.y;

        // Get a random number
        let randomAngle = Math.random() * 20 - 10;
        let randomSpeed = Math.random() * 10 - 5;
        
        // set angle of the thrust emitter
        // this.thrustEmitter.setAngle(angle * 180 / Math.PI + randomAngle);
        

        this.thrustEmitter.setPosition(x, y);
        this.thrustEmitter.emitParticle(1);

        
        
    }

    updateCapacitor(delta) {
        // Update the capacitor
        if (this.capacitor > this.maxCapacitor * 0.999 ) {
            this.capacitor = this.maxCapacitor;
            return;
        }
        let a = Math.sqrt(this.capacitor / this.maxCapacitor) - 1.0;
        let b = Math.exp(-5 * delta / this.capacitorRechargeTime);
        let c = 1 + a * b;
        this.capacitor = this.maxCapacitor * c * c;
    }

    velocityFunc(t, vMax) {
        // Returns velocity
        return vMax * (1 - Math.exp(-t / this.inertiaModifier));
    }

    velocityFuncInverse(v, vMax) {
        // Returns time in seconds
        return - this.inertiaModifier * Math.log(1 - v / vMax);
    }

    getSpeed() {
        // Return the magnitude of the velocity vector
        return this.velocity.length();
    }

    setSpeed() {
        // Set the speed
        this.speed = this.velocity.length();
    }

    getMaxSpeed() {
        return this.maxSpeed;
    }

    setMaxSpeed() {
        return;
    }

    stop() {
        
        this.approach.x = this.position.x;
        this.approach.y = this.position.y;
    }

    accelerate(delta) {
        let t = delta / 1000;  // convert delta from milliseconds to seconds


        
        // turn the approach vector into a unit vector
        let approachVector = this.approach.clone();
        // point from ship to approach point
        approachVector.subtract(this.position);
        
        if (approachVector.x == 0 && approachVector.y == 0 && (this.velocity.x !=0 || this.velocity.y != 0)) {
            // Stopping.
            approachVector.x = -this.velocity.x;
            approachVector.y = -this.velocity.y;
            approachVector.normalize();

            if (this.velocity.x !=0) {
                let goalX = approachVector.x * this.getMaxSpeed();
                let timeX = this.velocityFuncInverse(-Math.abs(this.velocity.x), Math.abs(goalX));
                let newVelocityX = this.velocityFunc(timeX + t, Math.abs(goalX));
                let velocityDeltaX = -Math.abs(this.velocity.x) - newVelocityX;


                if (this.velocity.x > 0) {
                    this.velocity.x = Math.max(0, this.velocity.x + velocityDeltaX);
                } else if (this.velocity.x < 0) {
                    this.velocity.x = Math.min(0, this.velocity.x - velocityDeltaX);
                }
            }

            if (this.velocity.y !=0) {
                let goalY = approachVector.y * this.getMaxSpeed();
                let timeY = this.velocityFuncInverse(-Math.abs(this.velocity.y), Math.abs(goalY));
                let newVelocityY = this.velocityFunc(timeY + t, Math.abs(goalY));
                let velocityDeltaY = -Math.abs(this.velocity.y) - newVelocityY;

                if (this.velocity.y > 0) {
                    this.velocity.y = Math.max(0, this.velocity.y + velocityDeltaY);
                } else if (this.velocity.y < 0) {
                    this.velocity.y = Math.min(0, this.velocity.y - velocityDeltaY);
                }
            }
            
            
            return;
        } else if (approachVector.x == 0 && approachVector.y == 0) {
            // Not moving
            return;
        }

        // normalize
        approachVector.normalize();

        let goalX = approachVector.x * this.getMaxSpeed();
        let goalY = approachVector.y * this.getMaxSpeed();

        // Do x component of velocity
        if (this.velocity.x < goalX && goalX >= 0) {
            // Speeding up with positive velocity
            let timeX = this.velocityFuncInverse(this.velocity.x, goalX);
            let newVelocityX = this.velocityFunc(timeX + t, goalX);
            this.velocity.x = newVelocityX;
        } else if (this.velocity.x > goalX && goalX < 0) {
            // Speeding up with negative velocity
            let timeX = this.velocityFuncInverse(-this.velocity.x, -goalX);
            let newVelocityX = -this.velocityFunc(timeX + t, -goalX);
            this.velocity.x = newVelocityX;
        } else if (this.velocity.x > goalX && goalX >= 0) {
            // Slowing down with positive velocity
            let flipVelocityX = 2 * goalX - this.velocity.x;
            let timeX = this.velocityFuncInverse(flipVelocityX, goalX);
            let newVelocityX = this.velocityFunc(timeX + t, goalX);
            let velocityDeltaX = newVelocityX - flipVelocityX;
            this.velocity.x = this.velocity.x - velocityDeltaX;
        } else if (this.velocity.x < goalX && goalX < 0) {
            // Slowing down with negative velocity
            let flipVelocityX = 2 * goalX - this.velocity.x;
            let timeX = this.velocityFuncInverse(-flipVelocityX, -goalX);
            let newVelocityX = -this.velocityFunc(timeX + t, -goalX);
            let velocityDeltaX = newVelocityX - flipVelocityX;
            this.velocity.x = this.velocity.x - velocityDeltaX;
        }
            
        
        // Do y component of velocity
        if (this.velocity.y < goalY && goalY >= 0) {
            // Speeding up with positive velocity
            let timeY = this.velocityFuncInverse(this.velocity.y, goalY);
            let newVelocityY = this.velocityFunc(timeY + t, goalY);
            this.velocity.y = newVelocityY;
        } else if (this.velocity.y > goalY && goalY < 0) {
            // Speeding up with negative velocity
            let timeY = this.velocityFuncInverse(-this.velocity.y, -goalY);
            let newVelocityY = -this.velocityFunc(timeY + t, -goalY);
            this.velocity.y = newVelocityY;
        }
        else if (this.velocity.y > goalY && goalY >= 0) {
            // Slowing down with positive velocity
            let flipVelocityY = 2 * goalY - this.velocity.y;
            let timeY = this.velocityFuncInverse(flipVelocityY, goalY);
            let newVelocityY = this.velocityFunc(timeY + t, goalY);
            let velocityDeltaY = newVelocityY - flipVelocityY;
            this.velocity.y = this.velocity.y - velocityDeltaY;
        }
        else if (this.velocity.y < goalY && goalY < 0) {
            // Slowing down with negative velocity
            let flipVelocityY = 2 * goalY - this.velocity.y;
            let timeY = this.velocityFuncInverse(-flipVelocityY, -goalY);
            let newVelocityY = -this.velocityFunc(timeY + t, -goalY);
            let velocityDeltaY = newVelocityY - flipVelocityY;
            this.velocity.y = this.velocity.y - velocityDeltaY;
        }

    }
    update() {
        // Implement ship-specific update logic here
    }

    // ... more methods and properties as needed
}
