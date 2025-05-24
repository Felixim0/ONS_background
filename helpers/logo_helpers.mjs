import { restoreCanvasPicture, saveCanvasPicture } from './canvas_helpers.mjs';
let logo;
let logoText;
let savedPicture;

export function prepareText(c) {
  const localLogoText = new Image();
  localLogoText.src = './text_images/digital_services.svg';

  localLogoText.addEventListener('load', () => {
    logoText = localLogoText;
    let scale = 200 / logoText.width;
    scale = scale * 1.6 //Adjust the image to fit expected
    logoText.scaledW = scale * logoText.width;
    logoText.scaledH = scale * logoText.height;
    restoreCanvasPicture(c);
    c.drawImage(logoText, 410, 0, logoText.scaledW, logoText.scaledH);
    saveCanvasPicture(c);
  });
}

export function prepareLogo(c) {
  const localLogo = new Image();
  localLogo.src = './text_images/ons_logo_white.svg';

  localLogo.addEventListener('load', () => {
    logo = localLogo;
    let scale = 200 / logo.width;
    scale = scale * 1.3 //Adjust the image to fit expected
    logo.scaledW = scale * logo.width;
    logo.scaledH = scale * logo.height;
    restoreCanvasPicture(c);
    c.drawImage(logo, 30, 20, logo.scaledW, logo.scaledH);
    saveCanvasPicture(c);
  });
}
