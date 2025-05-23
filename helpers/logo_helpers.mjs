let logo;
let logoText;
let savedPicture;

export function prepareText(c) {
  const localLogoText = new Image();
  localLogoText.src = './text_images/digital_services.svg';

  localLogoText.addEventListener('load', () => {
    logoText = localLogoText;
    const scale = 200 / logoText.width;
    logoText.scaledW = scale * logoText.width;
    logoText.scaledH = scale * logoText.height;
    c.drawImage(logoText, 500, 6, logoText.scaledW, logoText.scaledH);
  });
}

export function prepareLogo(c) {
  const localLogo = new Image();
  localLogo.src = './text_images/ons_logo_white.svg';

  localLogo.addEventListener('load', () => {
    logo = localLogo;
    const scale = 200 / logo.width;
    logo.scaledW = scale * logo.width;
    logo.scaledH = scale * logo.height;
    c.drawImage(logo, 30, 14, logo.scaledW, logo.scaledH);
  });
}
