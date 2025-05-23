let c;
let canvasH;
let scale;
let logo;
let savedPicture;


function prepareLogoImage() {
  const localLogo = new Image();
  localLogo.src = './text_images/ons-logo-long.svg';

  localLogo.addEventListener('load', () => {
    // 1) compute your scaled size
    const scale   = 200 / localLogo.width;
    const w       = localLogo.width  * scale;
    const h       = localLogo.height * scale;
    const x       = 50, y = 50;

    // 2) draw the logo into the default "source-over" canvas
    c.drawImage(localLogo, x, y, w, h);

    // 3) switch to "source-in" so that only the pixels
    //    inside the existing drawing will be painted
    c.globalCompositeOperation = 'source-in';

    // 4) paint a white rectangle over that same area
    c.fillStyle = 'white';
    c.fillRect(x, y, w, h);

    // 5) go back to normal compositing
    c.globalCompositeOperation = 'source-over';
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