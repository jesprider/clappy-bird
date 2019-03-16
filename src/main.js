import * as pixi from 'pixi.js';
import getMedia from './mic';
import Bird from './bird';
import Pipe from './pipe';

window.onload = () => {
  //
  // App creation
  const app = new pixi.Application({ width: 1020, height: 600 });
  const birdLayer = new pixi.Container();
  const pipesLayer = new pixi.Container();
  app.stage.addChild(pipesLayer);
  app.stage.addChild(birdLayer);
  document.body.appendChild(app.view);

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
    x: 45, y: 25, radius: 25, canvasHeight: app.view.height,
  });
  birdLayer.addChild(bird.bird);

  //
  // Pipes
  const pipes = [];
  setInterval(() => {
    const pipe = new Pipe({ canvasWidth: app.view.width, canvasHeight: app.view.height });
    pipes.push(pipe);
    pipesLayer.addChild(pipe.pipe);
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
