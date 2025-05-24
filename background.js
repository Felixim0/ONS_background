import { prepareLogo, prepareText } from './helpers/logo_helpers.mjs';
import { startingBalls } from './helpers/setup_helpers.mjs';

let c;
let canvasH;
let scale;

function drawBall(ball) {
  const { x, y, size, colour } = ball;
  c.fillStyle = colour;
  c.beginPath();
  c.ellipse(x, y, size / 2, size / 2, 0, 0, 7);
  c.fill();
}

function drawBalls(ballsToDraw) {
 for (const ball of ballsToDraw) {
    drawBall(ball);
  }
}

function init() {
  const canvas = document.querySelector('canvas');
  c = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  scale = window.innerWidth / 800;
  c.scale(scale, scale);

  canvasH = window.innerHeight / scale;

  // Load and then draw the logo (white for each non-transparent pixel)
  prepareText(c);
  prepareLogo(c);

  drawBalls(startingBalls);

//  saveCanvasPicture();

//  animate();
}


window.addEventListener('load', init);