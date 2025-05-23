import { prepareLogo, prepareText } from './helpers/logo_helpers.mjs';

let c;
let canvasH;
let scale;



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

//  drawLandscape();
//  saveCanvasPicture();

//  animate();
}


window.addEventListener('load', init);