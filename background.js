let c;
let canvasH;
let scale;
let logo;
let savedPicture;


function prepareLogoImage() {
  const localLogo = new Image();
  localLogo.src = './text_images/ons-logo.svg';

  localLogo.addEventListener('load', () => {
    logo = localLogo;
    const scale = 200 / logo.width;
    logo.scaledW = scale * logo.width;
    logo.scaledH = scale * logo.height;
    c.drawImage(logo, 50, 50, logo.scaledW, logo.scaledH);
  });
}

function init() {
  const canvas = document.querySelector('canvas');
  c = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  scale = window.innerWidth / 800;
  c.scale(scale, scale);

  canvasH = window.innerHeight / scale;

  prepareLogoImage();

//  drawLandscape();
//  saveCanvasPicture();

//  animate();
}


window.addEventListener('load', init);