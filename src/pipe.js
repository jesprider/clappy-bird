import * as pixi from 'pixi.js';

const SPEED = 2;
const PIPE_WIDTH = 75;
const MINIMUM_WINDOW_HEIGHT = 150;

// The maximum is exclusive and the minimum is inclusive
const getRandomInt = (min, max) => {
  const minInt = Math.ceil(min);
  const maxInt = Math.floor(max);
  return Math.floor(Math.random() * (maxInt - minInt)) + minInt;
};


export default class Pipe {
  constructor({ canvasHeight, canvasWidth }) {
    const windowHeight = getRandomInt(MINIMUM_WINDOW_HEIGHT, canvasHeight / 2);
    const windowCenter = getRandomInt(windowHeight, canvasHeight - windowHeight);

    const ht = windowCenter - windowHeight / 2;
    const hb = canvasHeight - (windowCenter + windowHeight / 2);
    const x = canvasWidth;
    const yt = 0;
    const yb = canvasHeight - hb;

    const pipe = new pixi.Graphics();
    pipe.lineStyle(0);
    pipe.beginFill(0xFFFFFF, 1);
    // -10/+10 for rounded borders compensation
    pipe.drawRoundedRect(x, yt - 10, PIPE_WIDTH, ht, 10);
    pipe.drawRoundedRect(x, yb + 10, PIPE_WIDTH, hb, 10);
    pipe.endFill();

    this.pipe = pipe;
    this.canvasWidth = canvasWidth;
  }

  update() {
    this.pipe.x -= SPEED;
  }

  get isOffscreen() {
    if (this.pipe.x < -(this.canvasWidth + PIPE_WIDTH)) {
      return true;
    }
    return false;
  }
}
