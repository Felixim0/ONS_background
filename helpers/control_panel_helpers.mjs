
export function toggleControlPanelVisibility() {
  document.querySelector('.control-panel').classList.toggle('hidden');
}

export function getNewMode(direction, currentMode, modes) {
  let newMode = currentMode + direction;
  if (newMode > modes.length - 1) {
    newMode = 0; // Wrap around to the first mode
  } else if (newMode < 0) {
    newMode = modes.length - 1; // Wrap around to the last mode
  }
  return newMode;
}