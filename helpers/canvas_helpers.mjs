let savedPicture;

export function saveCanvasPicture(c) {
  savedPicture = c.getImageData(0, 0, c.canvas.width, c.canvas.height);
}

export function restoreCanvasPicture(c) {
  c.clearRect(0, 0, c.canvas.width, c.canvas.height);
  c.putImageData(savedPicture, 0, 0);
}