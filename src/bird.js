import * as pixi from 'pixi.js';

export default class Bird {
  constructor({ x, y, radius, canvasHeight }) {
    const bird = new pixi.Graphics();
    bird.lineStyle(0);
    bird.beginFill(0xDE3249, 1);
    bird.drawCircle(x, y, radius);
    bird.endFill();

    this.bird = bird;
    this.radius = radius;
    this.height = canvasHeight;

    this.gravity = 0.6;
    this.lift = -1;
    this.velocity = 0;
  }

  up(volume) {
    console.log(volume / 100)
    this.velocity -= volume / 100;
  }

  update() {
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.bird.y += this.velocity;

    if (this.bird.y > this.height - this.radius * 2) {
      this.bird.y = this.height - this.radius * 2;
      this.velocity = 0;
    }

    if (this.bird.y < 0) {
      this.bird.y = 0;
      this.velocity = 0;
    }
  }
}
