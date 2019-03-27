import { Sprite } from 'pixi.js';

const SPEED = 3;
const PIPE_WIDTH = 75;
const MINIMUM_WINDOW_HEIGHT = 150;

// The maximum is exclusive and the minimum is inclusive
const getRandomInt = (min, max) => {
  const minInt = Math.ceil(min);
  const maxInt = Math.floor(max);
  return Math.floor(Math.random() * (maxInt - minInt)) + minInt;
};


export default class Pipe {
  constructor({ stageWidth, stageHeight, textures }) {
    const windowHeight = getRandomInt(MINIMUM_WINDOW_HEIGHT, stageHeight / 2);
    const windowCenter = getRandomInt(windowHeight, stageHeight - windowHeight);

    const pipeWidth = textures[0].width;
    const pipeHeight = textures[0].height;

    const ht = windowCenter - windowHeight / 2;
    const hb = stageHeight - (windowCenter + windowHeight / 2);
    // const x = canvasWidth;
    // const yt = 0;
    // const yb = canvasHeight - hb;

    this.pipeTop = new Sprite(textures[0]);
    this.pipeBottom = new Sprite(textures[1]);

    this.pipeTop.x = stageWidth;
    this.pipeBottom.x = stageWidth;

    this.pipeTop.y = -(pipeHeight - ht);
    this.pipeBottom.y = stageHeight - hb;

    this.stageWidth = stageWidth;
  }

  update() {
    this.pipeTop.x -= SPEED;
    this.pipeBottom.x -= SPEED;
  }

  get isOffscreen() {
    if (this.pipeTop.x < -(this.stageWidth + PIPE_WIDTH)) {
      return true;
    }
    return false;
  }
}
