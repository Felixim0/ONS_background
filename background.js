import { prepareLogo, prepareText } from './helpers/logo_helpers.mjs';
import { getStartingBalls } from './helpers/setup_helpers.mjs';
import { saveCanvasPicture, restoreCanvasPicture } from './helpers/canvas_helpers.mjs';
import { breathingAnimation } from './animations/breathing/breathing.mjs';
import { bouncingAnimation } from './animations/bouncing/bouncing.mjs';
import { consolidateBalls, returnBallsAnimation, checkBallsInOriginalPositionAndSize } from './animations/returnToOriginalPosition/returnAnimation.mjs';
import { getNewMode, toggleControlPanelVisibility } from './helpers/control_panel_helpers.mjs';
import { drawBalls, orderBallsBySize } from './helpers/ball_helpers.mjs';
import { breakBalls } from './animations/breakBalls/breakBalls.mjs';

let c;
let canvasH;
let canvasW;
let scale;
let savedPicture;
let balls = [];
let modes = ['breathing', 'lavalamp', 'bouncing'];
let currentMode = 1;
let animationSpeedMultiplier = 1;
let PAUSED = false;
let returnAnimation = false;
let BREAK_BALLS = false;

function animationLoop() {
  // Given the animation mode, animate balls accordingly
  const currentModeName = modes[currentMode];
  restoreCanvasPicture(c);

  // Check if the balls are breaking
  if (BREAK_BALLS) {
    balls = breakBalls(balls);
    BREAK_BALLS = false;
  }

  if (returnAnimation) {
    // Is the return ball animation finished? If so, reset returnAnimation status
    const ballsReturnedToOriginalPositions = checkBallsInOriginalPositionAndSize(balls)
    if (!ballsReturnedToOriginalPositions) {
      balls = returnBallsAnimation(balls, animationSpeedMultiplier);
    } else {
      returnAnimation = false;

      // If there are any extra balls, resolve these
      balls = consolidateBalls(balls);

      setPauseToTrue();
    }

  } else {
    if (currentModeName === 'breathing') {
      balls = breathingAnimation(balls, animationSpeedMultiplier);
    } else if (currentModeName === 'bouncing') {
      balls = bouncingAnimation(balls, animationSpeedMultiplier, canvasW, canvasH);
    } 
  }

  // Ensure smaller balls are drawn on top of larger ones
  balls = orderBallsBySize(balls);

  saveCanvasPicture(c);
  drawBalls(c, balls);

  if (!PAUSED) {
    window.requestAnimationFrame(animationLoop);
  }
}

function updateControlPanel() {
  document.querySelector('.mode-indicator').textContent = `${modes[currentMode]}`;
  document.querySelector('.speed-indicator').textContent = `${animationSpeedMultiplier}`;
  document.querySelector('.paused-indicator').textContent = `${PAUSED}`;
}

function toggleMode(direction) {
  currentMode = getNewMode(direction, currentMode, modes);
}

function setPauseToFalse() {
  PAUSED = false;
  animationLoop(); // Restart the animation loop
}

function setPauseToTrue() {
  PAUSED = true;
}

function togglePause() {
  if (PAUSED) {
    setPauseToFalse();
  } else {
    setPauseToTrue();
  }
}

function setupListeners() {
  document.addEventListener('keydown', function(e) {
    const key = e.key || e.code;

    if (key === 'ArrowRight') {
      // Toggle to right
      toggleMode(1);
    }

    if (key === 'ArrowLeft') {
      // Toggle to Left
      toggleMode(-1);
    }

    // Get the step change based on the shift key being held down or not (0.1 if not, 1 if it is)
    const step = e.shiftKey ? 1 : 0.1;

    // Arrow up and down to increase/decrease speed
    if (key === 'ArrowUp') {
      // Increase speed
      animationSpeedMultiplier += step;
      animationSpeedMultiplier = Math.round(animationSpeedMultiplier * 100) / 100;
      console.log('Increased speed:', animationSpeedMultiplier);
    }
    if (key === 'ArrowDown') {
      // Decrease speed
      animationSpeedMultiplier = Math.max(0.1, animationSpeedMultiplier - step); // Prevent negative speed
      animationSpeedMultiplier = Math.round(animationSpeedMultiplier * 100) / 100;
      console.log('Decreased speed:', animationSpeedMultiplier);
    }

    // If the key is the space bar, toggle pause
    if (key === ' ') {
      togglePause();
      console.log('Paused:', PAUSED);
    }

    if (key === 'v' || key === 'V') {
      // Toggle Visibility of Control Panel
      toggleControlPanelVisibility();
    }

    if (key === 'r' || key === 'R') {
      // Unpause the animation, set 'return animation' to true
      returnAnimation = true;
      setPauseToFalse();
    }

    if (key === 'b' || key === 'B') {
      // Break Balls
      BREAK_BALLS = true;
    }

    updateControlPanel();
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
  canvasW = window.innerWidth / scale;

  // Load and then draw the logo 
  prepareText(c);
  prepareLogo(c);
  
  setupListeners();

  saveCanvasPicture(c);

  // Draw the starting balls
  balls = getStartingBalls();
  console.log('Starting balls:', balls);
  drawBalls(c, balls);

  updateControlPanel();

  animationLoop();
}


window.addEventListener('load', init);