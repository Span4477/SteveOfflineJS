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
        this.warpAgility = 5
        this.warpSpeedAU = 1;
        this.capacitorToWarp = 25;
        this.moveState = 'stop';
        this.name = 'Shipy McShipface';
        this.danger = 'low';
        
        this.warpStartX = 0;
        this.warpStartY = 0;
        this.warpDuration = 0;

        
        this.moveStateInput = this.moveState;
        this.approachXInput = this.approach.x;
        this.approachYInput = this.approach.y;

    }

    jumpSystem(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.approach.x = x;
        this.approach.y = y;
        this.approachXInput = x;
        this.approachYInput = y;
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.moveState = 'stop';
        this.moveStateInput = 'stop';

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

    
    stop() {
        
        this.approach.x = this.position.x;
        this.approach.y = this.position.y;
    }

    startWarp(delta) {
        //Check if we are at least 75% of max speed
        if (this.speed < 0.75 * this.maxSpeed) {
            this.accelerate(delta);
            return;
        }

        // Check if we have enough capacitor
        if (this.capacitor < this.capacitorToWarp) {
            this.accelerate(delta);
            return;
        }

        // Ensure that the distance is at least 150km
        let distance = Phaser.Math.Distance.Between(this.position.x, this.position.y, this.approach.x, this.approach.y);
        if (distance < 150000) {
            this.accelerate(delta);
            return;
        }

        // Check if the direction of the velocity is within 20 degrees of the approach vector
        let approachVector = this.approach.clone();
        // point from ship to approach point
        approachVector.subtract(this.position);
        approachVector.normalize();
        let velVector = this.velocity.clone();
        velVector.normalize();
        // get the angle between the two vectors

        let angle = Math.acos(approachVector.x * velVector.x + approachVector.y * velVector.y );
        
        if (angle > Math.PI / 9) {
            this.accelerate(delta);
            return;
        }

        // Start warp
        this.moveState = 'warping';
        this.moveStateInput = 'warping';
        this.capacitor -= this.capacitorToWarp;
        this.warpStartX = this.position.x;
        this.warpStartY = this.position.y;
        this.warpNewtonResult = 0;


    }

    warpSpeedFunc(t) {
        // This is the velocity at time t
        return Math.exp(t * this.warpAgility) - 1 + this.maxSpeed;
    }

    warpSpeedFuncInverse(v) {
        // This is the time to reach velocity v
        return Math.log(v - this.maxSpeed + 1) / this.warpAgility;
    }

    warpSpeedFuncIntegrated(t) {
        // This is the distance at time t
        return (Math.exp(t * this.warpAgility) - 1) / this.warpAgility + this.maxSpeed * t;
        
    }

    warpSpeedFuncIntegratedInverse(d) {
        // This is the time to reach distance d
        // This is a numerical approximation using Newton's method
        const AU = 149597870.7 * 1000;  // Astronomical Unit in meters
        const warpSpeed = this.warpSpeedAU * AU
        let iterations = 100;
        let a = 0
        let b = this.warpSpeedFuncInverse(warpSpeed);
        let tol = 1e-3;
        let c = a;
        for (let i = 0; i < iterations; i++) {
            c = (a + b) / 2;
            let fc = this.warpSpeedFuncIntegrated(c);
            if (Math.abs(fc - d) < tol) {
                break;
            }
            if (fc > d) {
                b = c;
            }
            if (fc < d) {
                a = c;
            }
            console.log('Err: ' + Math.abs(fc - d));
        }
        
        return c;
        
    }

    warp(delta) {

        let t = delta / 1000;  // convert delta from milliseconds to seconds
        this.warpDuration += t;

        const AU = 149597870.7 * 1000;  // Astronomical Unit in meters
        const warpSpeed = this.warpSpeedAU * AU
        // Calculate the total distance from warp start to warp end
        let distance = Phaser.Math.Distance.Between(this.warpStartX, this.warpStartY, this.approach.x, this.approach.y);

        //Time needed to accelerate to warp speed
        let timeToMaxSpeed = this.warpSpeedFuncInverse(warpSpeed);
        //Distance needed to accelerate to maxSpeed
        let distanceToMaxSpeed = this.warpSpeedFuncIntegrated(timeToMaxSpeed);

        let theta = Math.atan2(this.approach.y - this.warpStartY, this.approach.x - this.warpStartX);
        let totalTime = 0;
        if (distanceToMaxSpeed < distance / 2) {
            // Accelerate to warp speed, then travel at warp speed until it is time to decelerate, then decelerate to approach point
            totalTime = 2 * timeToMaxSpeed + (distance - 2 * distanceToMaxSpeed) / warpSpeed;
            if (this.warpDuration < timeToMaxSpeed) {
                // Accelerate
                this.speed = this.warpSpeedFunc(this.warpDuration);
                let d = this.warpSpeedFuncIntegrated(this.warpDuration);
                let newX = this.warpStartX + d * Math.cos(theta);
                let newY = this.warpStartY + d * Math.sin(theta);
                this.position.x = newX;
                this.position.y = newY;
                this.velocity.x = this.speed * Math.cos(theta);
                this.velocity.y = this.speed * Math.sin(theta);
            } else if (this.warpDuration < totalTime - timeToMaxSpeed) {
                // Travel at warp speed
                this.speed = warpSpeed;
                let newX = this.warpStartX + distanceToMaxSpeed * Math.cos(theta) + (this.warpDuration - timeToMaxSpeed) * warpSpeed * Math.cos(theta);
                let newY = this.warpStartY + distanceToMaxSpeed * Math.sin(theta) + (this.warpDuration - timeToMaxSpeed) * warpSpeed * Math.sin(theta);
                this.position.x = newX
                this.position.y = newY;
                this.velocity.x = warpSpeed * Math.cos(theta);
                this.velocity.y = warpSpeed * Math.sin(theta);
            } else {
                // Decelerate
                this.speed = this.warpSpeedFunc(totalTime - this.warpDuration);
                let d = this.warpSpeedFuncIntegrated(totalTime - this.warpDuration);
                let newX = this.warpStartX + distance * Math.cos(theta) - d * Math.cos(theta);
                let newY = this.warpStartY + distance * Math.sin(theta) - d * Math.sin(theta);
                this.position.x = newX;
                this.position.y = newY;
                this.velocity.x = this.speed * Math.cos(theta);
                this.velocity.y = this.speed * Math.sin(theta);
                
            }
        } else {
            // Accelerate to the halfway point, then decelerate
            if (this.warpNewtonResult == 0) {
                this.warpNewtonResult = this.warpSpeedFuncIntegratedInverse(distance / 2);
            }
            totalTime = 2 * this.warpNewtonResult;
            if (this.warpDuration < this.warpNewtonResult) {
                this.speed = this.warpSpeedFunc(this.warpDuration);
                let d = this.warpSpeedFuncIntegrated(this.warpDuration);
                this.position.x = this.warpStartX + d * Math.cos(theta);
                this.position.y = this.warpStartY + d * Math.sin(theta);
                this.velocity.x = this.speed * Math.cos(theta);
                this.velocity.y = this.speed * Math.sin(theta);
            } else {
                this.speed = this.warpSpeedFunc(totalTime - this.warpDuration);
                let d = this.warpSpeedFuncIntegrated(totalTime - this.warpDuration);
                this.position.x = this.warpStartX + distance * Math.cos(theta) - d * Math.cos(theta);
                this.position.y = this.warpStartY + distance * Math.sin(theta) - d * Math.sin(theta);
                this.velocity.x = this.speed * Math.cos(theta);
                this.velocity.y = this.speed * Math.sin(theta);
            }

        }
        
        if (this.warpDuration >= totalTime) {
            this.moveState = 'stop';
            this.moveStateInput = 'stop';
            this.warpDuration = 0;
            this.warpNewtonResult = 0;
        }

        
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
                let goalX = approachVector.x * this.maxSpeed;
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
                let goalY = approachVector.y * this.maxSpeed;
                let timeY = this.velocityFuncInverse(-Math.abs(this.velocity.y), Math.abs(goalY));
                let newVelocityY = this.velocityFunc(timeY + t, Math.abs(goalY));
                let velocityDeltaY = -Math.abs(this.velocity.y) - newVelocityY;

                if (this.velocity.y > 0) {
                    this.velocity.y = Math.max(0, this.velocity.y + velocityDeltaY);
                } else if (this.velocity.y < 0) {
                    this.velocity.y = Math.min(0, this.velocity.y - velocityDeltaY);
                }
            }
            
            
            this.position.x += this.velocity.x * t;
            this.position.y += this.velocity.y * t;
            return;
        } else if (approachVector.x == 0 && approachVector.y == 0) {
            // Not moving
            return;
        }

        // normalize
        approachVector.normalize();

        let goalX = approachVector.x * this.maxSpeed;
        let goalY = approachVector.y * this.maxSpeed;

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

        
        this.position.x += this.velocity.x * t;
        this.position.y += this.velocity.y * t;

    }


    
}
