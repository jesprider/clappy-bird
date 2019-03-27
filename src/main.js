import {
  Application, Container, Loader, Rectangle, Texture, TilingSprite,
} from 'pixi.js';

import getMedia from './mic';
import Bird from './bird';
import Pipe from './pipe';

import tilesetImagePath from './assets/tileset.png';
import groundImagePath from './assets/ground.png';
import backgroundImagePath from './assets/background.png';
import tilesetJson from './assets/tileset.json';

const STAGE_WIDTH = 1020;
const STAGE_HEIGHT = 624;

const initializeApp = () => {
  const app = new Application({ width: STAGE_WIDTH, height: STAGE_HEIGHT, backgroundColor: '0x00c3cc' });
  document.body.appendChild(app.view);

  return app;
};

const getBirdTextures = (tilesetBaseTexture, tilesetData) => {
  const birdTiles = [tilesetData[62], tilesetData[66], tilesetData[69], tilesetData[66]];
  const birdTextures = [];

  birdTiles.forEach((tile) => {
    const {
      x, y, width, height,
    } = tile;
    const texture = new Texture(tilesetBaseTexture);
    const rectangle = new Rectangle(x, y, width, height);
    texture.frame = rectangle;
    birdTextures.push(texture);
  });

  return birdTextures;
};

const getPipesTextures = (tilesetBaseTexture, tilesetData) => {
  const pipesTiles = [tilesetData[51], tilesetData[52]];
  const pipesTextures = [];

  pipesTiles.forEach((tile) => {
    const {
      x, y, width, height,
    } = tile;
    const texture = new Texture(tilesetBaseTexture);
    const rectangle = new Rectangle(x, y, width, height);
    texture.frame = rectangle;
    pipesTextures.push(texture);
  });

  return pipesTextures;
};

window.onload = () => {
  const setup = (loader, resources) => {
    const tilesetBaseTexture = resources.tileset.texture.baseTexture;

    //
    // App initialization
    const app = initializeApp();

    const groundContainer = new Container();
    const backgroundContainer = new Container();
    const birdContainer = new Container();
    const pipesContainer = new Container();
    app.stage.addChild(backgroundContainer);
    app.stage.addChild(pipesContainer);
    app.stage.addChild(groundContainer);
    app.stage.addChild(birdContainer);

    //
    // Bg creation
    const backgroundTexture = resources.background.texture;
    const background = new TilingSprite(backgroundTexture, STAGE_WIDTH, STAGE_HEIGHT);
    backgroundContainer.addChild(background);

    //
    // Ground creation
    const groundTexture = resources.ground.texture;
    const ground = new TilingSprite(groundTexture, STAGE_WIDTH, tilesetJson[2].height);
    ground.y = STAGE_HEIGHT - tilesetJson[2].height;
    groundContainer.addChild(ground);

    //
    // Bird creation
    const birdTextures = getBirdTextures(tilesetBaseTexture, tilesetJson);
    const bird = new Bird({
      x: 45, y: 25, textures: birdTextures, stageHeight: STAGE_HEIGHT,
    });
    birdContainer.addChild(bird.bird);

    //
    // Pipes
    const pipesTextures = getPipesTextures(tilesetBaseTexture, tilesetJson);
    const pipes = [];
    setInterval(() => {
      const pipe = new Pipe({ stageWidth: STAGE_WIDTH, stageHeight: STAGE_HEIGHT, textures: pipesTextures });
      pipes.push(pipe);
      pipesContainer.addChild(pipe.pipeTop);
      pipesContainer.addChild(pipe.pipeBottom);
    }, 2500);

    //
    // Sliders handling
    const thresholdTopSlider = document.getElementById('thresholdTop');
    let thresholdTop = thresholdTopSlider.valueAsNumber;

    thresholdTopSlider.addEventListener('input', (event) => {
      thresholdTop = event.target.valueAsNumber;
    });

    //
    // Volume handling
    let vol = 0;
    getMedia((data) => {
      vol = data;
    });

    window.addEventListener('keydown', (event) => {
      if (event.keyCode !== 32) return;
      bird.up(200);
    });

    //
    // App update callback
    app.ticker.add(() => {
      background.tilePosition.x -= 1;
      ground.tilePosition.x -= 2;

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
    .add('background', backgroundImagePath)
    .add('ground', groundImagePath)
    .load(setup);
};
