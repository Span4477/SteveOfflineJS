import seedrandom from 'seedrandom';

export default class StarField {
    constructor(scene, seed) {
        this.scene = scene;
        this.seed = seed;

        // Generate the star field based on the seed
        this.stars = this.generateStarField();
    }

    generateStarField() {
        // Use a seeded random number generator to get consistent results
        let rng = new seedrandom(this.seed);

        let stars = [];
        for (let i = 0; i < 100; i++) { // adjust number of stars as needed
            let x = rng() * this.scene.game.config.width;
            let y = rng() * this.scene.game.config.height;
            let star = this.scene.add.rectangle(x, y, 1, 1, 0xffffff);
            star.setDepth(0);
            stars.push(star);
        }

        return stars;
    }

    clear() {
        this.stars.forEach((star) => {
            star.destroy();
        });
    }
}
