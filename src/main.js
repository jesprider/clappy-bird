import {
  Application, Container, Sprite, Loader,
} from 'pixi.js';

import getMedia from './mic';
import Bird from './bird';
import Pipe from './pipe';

import catImagePath from './assets/cat.png';
import spriteImagePath from './assets/sprite.png';

const STAGE_WIDTH = 1020;
const STAGE_HEIGHT = 600;

window.onload = () => {
  //
  // App creation
  const app = new Application({ width: STAGE_WIDTH, height: STAGE_HEIGHT, backgroundColor: '0x00c3cc' });
  const birdContainer = new Container();
  const pipesContainer = new Container();
  app.stage.addChild(pipesContainer);
  app.stage.addChild(birdContainer);
  document.body.appendChild(app.view);

  //
  // Sprite initialization
  Loader.shared
    .add('cat', catImagePath)
    .load((loader, resources) => {
      const sprite = new Sprite(
        resources.cat.texture,
      );
      app.stage.addChild(sprite);
    });

  //
  // Sliders handling
  const thresholdTopSlider = document.getElementById('thresholdTop');
  // const thresholdBottomSlider = document.getElementById('thresholdBottom');

  let thresholdTop = thresholdTopSlider.valueAsNumber;
  // let thresholdBottom = thresholdBottomSlider.valueAsNumber;

  thresholdTopSlider.addEventListener('input', (event) => {
    thresholdTop = event.target.valueAsNumber;
  });

  // thresholdBottomSlider.addEventListener('input', (event) => {
  //   thresholdBottom = event.target.valueAsNumber;
  // });


  //
  // Bird creation
  const bird = new Bird({
    x: 45, y: 25, radius: 25, canvasHeight: STAGE_HEIGHT,
  });
  birdContainer.addChild(bird.bird);

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
