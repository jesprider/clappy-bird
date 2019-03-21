import { Sprite } from 'pixi.js';

export default class Bird {
  constructor({
    x, y, texture, stageHeight,
  }) {
    const bird = new Sprite(texture);
    bird.position.set(x, y);

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
