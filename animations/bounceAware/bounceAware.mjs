import { checkCollitionWithWalls } from '../bouncing/collisionHelper.mjs';

const baseAnimationSpeed = 0.75;
const minSpeedFactor = 0.8;
const maxSpeedFactor = 1.25;

let nextBounceAwareBallId = 1;
let overlapSuppressionPairs = new Set();
let lastCallTimeMs = 0;
let lastBallCount = 0;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getSizeRange(balls) {
  let min = Infinity;
  let max = -Infinity;

  for (const ball of balls) {
    if (ball.size < min) min = ball.size;
    if (ball.size > max) max = ball.size;
  }

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { min: 1, max: 1 };
  }

  return { min, max };
}

function getSpeedFromSize(size, minSize, maxSize, animationSpeedMultiplier) {
  const sizeSpan = Math.max(1, maxSize - minSize);
  const sizeRatio = (size - minSize) / sizeSpan;
  const speedFactor = minSpeedFactor + (maxSpeedFactor - minSpeedFactor) * sizeRatio;
  return baseAnimationSpeed * animationSpeedMultiplier * speedFactor;
}

function ensureBounceState(ball, speed) {
  if (!ball.movementState.bouncing) {
    ball.movementState.bouncing = {
      angle: Math.random() * Math.PI * 2,
      speed,
    };
  }

  ball.movementState.bouncing.speed = speed;

  if (!ball.movementState.bounceAwareId) {
    ball.movementState.bounceAwareId = nextBounceAwareBallId;
    nextBounceAwareBallId += 1;
  }
}

function getVelocityFromState(ball) {
  const angle = ball.movementState.bouncing.angle;
  const speed = ball.movementState.bouncing.speed;
  return {
    vx: speed * Math.cos(angle),
    vy: speed * Math.sin(angle),
  };
}

function setStateFromVelocity(ball, vx, vy) {
  const speed = Math.max(0.01, Math.hypot(vx, vy));
  const angle = Math.atan2(vy, vx);
  ball.movementState.bouncing.speed = speed;
  ball.movementState.bouncing.angle = (angle + 2 * Math.PI) % (2 * Math.PI);
}

function getPixelIndex(x, y, width) {
  return (y * width + x) * 4;
}

function isLightForegroundPixel(data, width, height, x, y) {
  if (x < 0 || y < 0 || x >= width || y >= height) {
    return false;
  }

  const idx = getPixelIndex(x, y, width);
  const r = data[idx];
  const g = data[idx + 1];
  const b = data[idx + 2];
  const a = data[idx + 3];

  // Detect near-white antialiased logo/text pixels while ignoring dark background.
  const brightness = r + g + b;
  const maxChannel = Math.max(r, g, b);
  const minChannel = Math.min(r, g, b);
  const lowSaturation = (maxChannel - minChannel) < 55;

  return a > 0 && brightness > 500 && lowSaturation;
}

function bounceFromText(ball, imageData, pixelScale = 1) {
  if (!imageData) {
    return;
  }

  const { data, width, height } = imageData;
  const velocity = getVelocityFromState(ball);
  const speed = Math.hypot(velocity.vx, velocity.vy);

  if (speed <= 0.001) {
    return;
  }

  const nextX = ball.x + velocity.vx;
  const nextY = ball.y + velocity.vy;
  const radius = ball.size / 2;
  const travelAngle = Math.atan2(velocity.vy, velocity.vx);

  let hitNormalX = 0;
  let hitNormalY = 0;
  let collided = false;

  // Probe along the forward half of the ball edge for logo/text hit pixels.
  for (let i = -3; i <= 3; i += 1) {
    const probeAngle = travelAngle + i * (Math.PI / 6);
    const edgeX = nextX + Math.cos(probeAngle) * radius;
    const edgeY = nextY + Math.sin(probeAngle) * radius;
    const sampleX = Math.round(edgeX * pixelScale);
    const sampleY = Math.round(edgeY * pixelScale);

    if (isLightForegroundPixel(data, width, height, sampleX, sampleY)) {
      hitNormalX = Math.cos(probeAngle);
      hitNormalY = Math.sin(probeAngle);
      collided = true;
      break;
    }
  }

  if (!collided) {
    return;
  }

  const dot = velocity.vx * hitNormalX + velocity.vy * hitNormalY;
  if (dot > 0) {
    const restitution = 0.98;
    const reflectedX = (velocity.vx - 2 * dot * hitNormalX) * restitution;
    const reflectedY = (velocity.vy - 2 * dot * hitNormalY) * restitution;
    setStateFromVelocity(ball, reflectedX, reflectedY);

    // Nudge out a bit to reduce repeated collisions on antialiased edges.
    ball.x -= hitNormalX * 0.8;
    ball.y -= hitNormalY * 0.8;
  }
}

function getPairKey(a, b) {
  const idA = a.movementState.bounceAwareId;
  const idB = b.movementState.bounceAwareId;
  return idA < idB ? `${idA}:${idB}` : `${idB}:${idA}`;
}

function isOverlapping(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distance = Math.hypot(dx, dy);
  const minDistance = (a.size + b.size) / 2;
  return distance > 0 && distance < minDistance;
}

function shouldResetOverlapSuppression(ballCount) {
  const now = Date.now();
  const hasLongGap = now - lastCallTimeMs > 150;
  const countChanged = ballCount !== lastBallCount;
  const firstRun = lastCallTimeMs === 0;
  return firstRun || hasLongGap || countChanged;
}

function initializeOverlapSuppression(balls) {
  overlapSuppressionPairs = new Set();

  for (let i = 0; i < balls.length; i += 1) {
    for (let j = i + 1; j < balls.length; j += 1) {
      const a = balls[i];
      const b = balls[j];

      if (isOverlapping(a, b)) {
        overlapSuppressionPairs.add(getPairKey(a, b));
      }
    }
  }
}

function applyBallCollisions(balls) {
  for (let i = 0; i < balls.length; i += 1) {
    for (let j = i + 1; j < balls.length; j += 1) {
      const a = balls[i];
      const b = balls[j];
      const pairKey = getPairKey(a, b);

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distance = Math.hypot(dx, dy);
      const minDistance = (a.size + b.size) / 2;

      if (overlapSuppressionPairs.has(pairKey)) {
        if (distance >= minDistance) {
          overlapSuppressionPairs.delete(pairKey);
        }
        continue;
      }

      if (distance === 0 || distance >= minDistance) {
        continue;
      }

      const nx = dx / distance;
      const ny = dy / distance;
      const tx = -ny;
      const ty = nx;

      const va = getVelocityFromState(a);
      const vb = getVelocityFromState(b);

      const vaN = va.vx * nx + va.vy * ny;
      const vbN = vb.vx * nx + vb.vy * ny;
      const vaT = va.vx * tx + va.vy * ty;
      const vbT = vb.vx * tx + vb.vy * ty;

      const ma = Math.max(1, a.size);
      const mb = Math.max(1, b.size);

      const vaNAfter = (vaN * (ma - mb) + 2 * mb * vbN) / (ma + mb);
      const vbNAfter = (vbN * (mb - ma) + 2 * ma * vaN) / (ma + mb);

      const vaXAfter = vaT * tx + vaNAfter * nx;
      const vaYAfter = vaT * ty + vaNAfter * ny;
      const vbXAfter = vbT * tx + vbNAfter * nx;
      const vbYAfter = vbT * ty + vbNAfter * ny;

      const restitution = 0.98;
      setStateFromVelocity(a, vaXAfter * restitution, vaYAfter * restitution);
      setStateFromVelocity(b, vbXAfter * restitution, vbYAfter * restitution);

      const overlap = minDistance - distance;
      const correction = overlap / 2 + 0.01;
      a.x -= nx * correction;
      a.y -= ny * correction;
      b.x += nx * correction;
      b.y += ny * correction;
    }
  }
}

export function bounceAwareAnimation(currentBalls, animationSpeedMultiplier, canvasW, canvasH, renderContext, canvasScale = 1) {
  const { min: minSize, max: maxSize } = getSizeRange(currentBalls);
  const textImageData = renderContext
    ? renderContext.getImageData(0, 0, renderContext.canvas.width, renderContext.canvas.height)
    : null;

  const newBalls = currentBalls.map((ball) => {
    const newBall = {
      ...ball,
      movementState: {
        ...ball.movementState,
      },
    };

    const speed = getSpeedFromSize(newBall.size, minSize, maxSize, animationSpeedMultiplier);
    ensureBounceState(newBall, speed);

    return newBall;
  });

  if (shouldResetOverlapSuppression(newBalls.length)) {
    initializeOverlapSuppression(newBalls);
  }

  lastCallTimeMs = Date.now();
  lastBallCount = newBalls.length;

  const randomnessMaxJitter = 1;

  for (const ball of newBalls) {
    bounceFromText(ball, textImageData, canvasScale);

    const velocity = getVelocityFromState(ball);
    const newX = ball.x + velocity.vx;
    const newY = ball.y + velocity.vy;
    checkCollitionWithWalls(newX, newY, ball, canvasW, canvasH, randomnessMaxJitter);
  }

  applyBallCollisions(newBalls);

  for (const ball of newBalls) {
    const targetSpeed = getSpeedFromSize(ball.size, minSize, maxSize, animationSpeedMultiplier);
    const currentSpeed = ball.movementState.bouncing.speed;
    const adjustedSpeed = clamp(currentSpeed * 0.9 + targetSpeed * 0.1, targetSpeed * 0.75, targetSpeed * 1.5);
    ball.movementState.bouncing.speed = adjustedSpeed;
  }

  return newBalls;
}
