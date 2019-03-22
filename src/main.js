import {
  Application, Container, Loader, Rectangle, Texture,
} from 'pixi.js';

import getMedia from './mic';
import Bird from './bird';
import Pipe from './pipe';

import tilesetImagePath from './assets/tileset.png';
import tilesetJson from './assets/tileset.json';

const STAGE_WIDTH = 1020;
const STAGE_HEIGHT = 600;

window.onload = () => {
  const setup = (loader, resources) => {
    //
    // App creation
    const app = new Application({ width: STAGE_WIDTH, height: STAGE_HEIGHT, backgroundColor: '0x00c3cc' });
    const birdContainer = new Container();
    const pipesContainer = new Container();
    app.stage.addChild(pipesContainer);
    app.stage.addChild(birdContainer);
    document.body.appendChild(app.view);

    // Tileset loading
    const birdTiles = [tilesetJson[62], tilesetJson[66], tilesetJson[69], tilesetJson[66]];
    const birdTextures = [];
    const baseTilesetTexture = resources.tileset.texture.baseTexture;

    birdTiles.forEach((tile) => {
      const {
        x, y, width, height,
      } = tile;
      const texture = new Texture(baseTilesetTexture);
      const rectangle = new Rectangle(x, y, width, height);
      texture.frame = rectangle;
      birdTextures.push(texture);
    });

    //
    // Bird creation
    const bird = new Bird({
      x: 45,
      y: 25,
      textures: birdTextures,
      stageHeight: STAGE_HEIGHT,
    });
    birdContainer.addChild(bird.bird);

    //
    // Sliders handling
    const thresholdTopSlider = document.getElementById('thresholdTop');
    let thresholdTop = thresholdTopSlider.valueAsNumber;

    thresholdTopSlider.addEventListener('input', (event) => {
      thresholdTop = event.target.valueAsNumber;
    });

    //
    // Pipes
    const pipes = [];
    setInterval(() => {
      const pipe = new Pipe({ canvasWidth: STAGE_WIDTH, canvasHeight: STAGE_HEIGHT });
      pipes.push(pipe);
      pipesContainer.addChild(pipe.pipe);
    }, 2500);

    //
    // Volume handling
    let vol = 0;
    getMedia((data) => {
      vol = data;
    });

    //
    // App update callback
    app.ticker.add(() => {
      if (vol > thresholdTop) {
        bird.up(vol);
      }

      bird.update();

      for (let i = pipes.length - 1; i >= 0; i -= 1) {
        pipes[i].update();

        if (pipes[i].isOffscreen) {
          app.stage.removeChild(pipes[i].pipe);
          pipes.splice(i, 1);
        }
      }
    });
  };

  Loader.shared
    .add('tileset', tilesetImagePath)
    .load(setup);
};
