import { Sprite } from 'pixi.js';

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
  constructor({ canvasHeight, canvasWidth, textures }) {
    const windowHeight = getRandomInt(MINIMUM_WINDOW_HEIGHT, canvasHeight / 2);
    const windowCenter = getRandomInt(windowHeight, canvasHeight - windowHeight);

    const pipeWidth = textures[0].width;
    const pipeHeight = textures[0].height;

    const ht = windowCenter - windowHeight / 2;
    const hb = canvasHeight - (windowCenter + windowHeight / 2);
    // const x = canvasWidth;
    // const yt = 0;
    // const yb = canvasHeight - hb;

    this.pipeTop = new Sprite(textures[0]);
    this.pipeBottom = new Sprite(textures[1]);

    this.pipeTop.x = canvasWidth;
    this.pipeBottom.x = canvasWidth;

    this.pipeTop.y = -(pipeHeight - ht);
    this.pipeBottom.y = canvasHeight - hb;

    this.canvasWidth = canvasWidth;
  }

  update() {
    this.pipeTop.x -= SPEED;
    this.pipeBottom.x -= SPEED;
  }

  get isOffscreen() {
    if (this.pipeTop.x < -(this.canvasWidth + PIPE_WIDTH)) {
      return true;
    }
    return false;
  }
}
