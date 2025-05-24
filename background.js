import { prepareLogo, prepareText } from './helpers/logo_helpers.mjs';
import { startingBalls } from './helpers/setup_helpers.mjs';
import { saveCanvasPicture, restoreCanvasPicture } from './helpers/canvas_helpers.mjs';
import { breathingAnimation } from './animations/breathing.mjs';

let c;
let canvasH;
let scale;
let savedPicture;
let balls = [];
let modes = ['breathing', 'lavalamp', 'bouncing'];
let currentMode = 0;

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

function animationLoop() {
  // Given the animation mode, animate balls accordingly
  const currentModeName = modes[currentMode];
  restoreCanvasPicture(c);
  if (currentModeName === 'breathing') {
    // Update balls locations for breathing animation
    balls = breathingAnimation(balls);
  }
  saveCanvasPicture(c);
  drawBalls(balls);

  window.requestAnimationFrame(animationLoop);
}

function setupListeners() {
  document.addEventListener('keydown', function(e) {
    // Modern browsers:
    if (e.key === 'ArrowRight') {
      console.log('Right arrow pressed!');
      currentMode = (currentMode + 1) % modes.length;
      console.log('Current mode:', modes[currentMode]);
    }
  });
}

function init() {
  const canvas = document.querySelector('canvas');
  c = canvas.getContext('2d', { willReadFrequently: true });

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  scale = window.innerWidth / 800;
  c.scale(scale, scale);

  canvasH = window.innerHeight / scale;

  // Load and then draw the logo 
  prepareText(c);
  prepareLogo(c);
  
  setupListeners();

  saveCanvasPicture(c);

  // Draw the starting balls
  balls = startingBalls
  drawBalls(balls);

  animationLoop();
}


window.addEventListener('load', init);