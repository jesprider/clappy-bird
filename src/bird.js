import { Sprite, AnimatedSprite } from 'pixi.js';

export default class Bird {
  constructor({
    x, y, textures, stageHeight,
  }) {
    let bird;
    if (textures.length > 1) {
      bird = new AnimatedSprite(textures);
      bird.animationSpeed = 0.2;
      bird.play();
    } else {
      bird = new Sprite(textures[0]);
    }
    bird.position.set(x, y);
    bird.anchor.set(0.5, 0.5);

    this.bird = bird;
    this.stageHeight = stageHeight;

    this.gravity = 0.6;
    this.lift = -1;
    this.velocity = 0;
  }

  up(volume) {
    console.log(volume / 100);
    this.velocity -= volume / 100;
  }

  update() {
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.bird.y += this.velocity;

    if (this.velocity < 0) {
      this.bird.rotation = -0.5;
    } else if (this.velocity < 5) {
      this.bird.rotation = 0;
    } else {
      this.bird.rotation = 0.5;
    }

    if (this.bird.y > this.stageHeight - this.bird.height) {
      this.bird.y = this.stageHeight - this.bird.height;
      this.velocity = 0;
    }

    if (this.bird.y < 0) {
      this.bird.y = 0;
      this.velocity = 0;
    }
  }
}
