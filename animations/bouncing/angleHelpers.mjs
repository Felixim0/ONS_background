
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomizeAngle(angleRad, maxJitterDeg) {
  // pick a random offset in [-maxJitterDeg…+maxJitterDeg]
  const offsetDeg = randInt(-maxJitterDeg, maxJitterDeg);
  // convert to radians & add it
  return angleRad + (offsetDeg * Math.PI / 180);
}

export function newXY(x, y, speed, angle) {
  // Calculate new x and y based on speed and angle
  const newX = x + speed * Math.cos(angle);
  const newY = y + speed * Math.sin(angle);
  return { newX, newY };
}