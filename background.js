import { prepareLogo, prepareText } from './helpers/logo_helpers.mjs';
import { startingBalls } from './helpers/setup_helpers.mjs';
import { saveCanvasPicture, restoreCanvasPicture } from './helpers/canvas_helpers.mjs';

let c;
let canvasH;
let scale;
let savedPicture;
let balls = [];

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

function moveBalls() {
  return balls;
}

function animate() {
  restoreCanvasPicture(c);
  moveBalls();
  drawBalls(balls);
  saveCanvasPicture(c);
  drawBalls(balls);

  window.requestAnimationFrame(animate);
}

function init() {
  const canvas = document.querySelector('canvas');
  c = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  scale = window.innerWidth / 800;
  c.scale(scale, scale);

  canvasH = window.innerHeight / scale;

  // Load and then draw the logo 
  prepareText(c);
  prepareLogo(c);

  // Draw the starting balls
  balls = startingBalls
  drawBalls(balls);

  saveCanvasPicture(c);

  animate();
}


window.addEventListener('load', init);