import { prepareLogo, prepareText } from './helpers/logo_helpers.mjs';

let c;
let canvasH;
let scale;

const BALL_COLOURS = ['#1D5C98', '#1D97CF', '#A8B336', '#0094A8', '#E2ECF0']
// Starting Locations of the balls
const startingBalls = [
    {x: 0, y: 90, size: 100, colour: BALL_COLOURS[0], }, // Top Left Ball
    {x: 50, y: 400, size: 450, colour: BALL_COLOURS[1], }, // Bottom Left Ball
    // Top Right Balls 
    // Top Right Balls End
    {x: 730, y: 420, size: 320, colour: BALL_COLOURS[3], }, // bottom right ball
    {x: 705, y: 255, size: 125, colour: BALL_COLOURS[2], }, // bottom right middle ball
    {x: 650, y: 205, size: 88, colour: BALL_COLOURS[0], }, // bottom right ball

  ]
 
function drawBall(ball) {
  const { x, y, size, colour } = ball;
  c.fillStyle = colour;
  c.beginPath();
  c.ellipse(x, y, size / 2, size / 2, 0, 0, 7);
  c.fill();
}

function drawBalls() {
 for (const ball of startingBalls) {
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

  drawBalls();

//  drawLandscape();
//  saveCanvasPicture();

//  animate();
}


window.addEventListener('load', init);