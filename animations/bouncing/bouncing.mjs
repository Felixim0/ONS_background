let baseAnimationSpeed = 1;

// Utility: inclusive random integer [min…max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomizeAngle(angleRad, maxJitterDeg) {
  // pick a random offset in [-maxJitterDeg…+maxJitterDeg]
  const offsetDeg = randInt(-maxJitterDeg, maxJitterDeg);
  // convert to radians & add it
  return angleRad + (offsetDeg * Math.PI / 180);
}

// Helpers for degree‐based checks (used by getValidAnglesForOutOfBoundsBall)
function radToDeg(angleRad) {
  return (angleRad * 180 / Math.PI + 360) % 360;
}
function isBetweenDeg(angle, [start, end]) {
  if (start <= end) {
    return angle >= start && angle <= end;
  } else {
    // wrap‐around case, e.g. [315, 45]
    return angle >= start || angle <= end;
  }
}

function newXY(x, y, speed, angle) {
  // Calculate new x and y based on speed and angle
  const newX = x + speed * Math.cos(angle);
  const newY = y + speed * Math.sin(angle);
  return { newX, newY };
}

function assignBallNewPosition(newBall) {
  // Move the ball from its current position by its movementState
  const { newX, newY } = newXY(
    newBall.x,
    newBall.y,
    newBall.movementState.bouncing.speed,
    newBall.movementState.bouncing.angle
  );
  newBall.x = newX;
  newBall.y = newY;
  return newBall;
}

function getValidAnglesForOutOfBoundsBall(newBall, canvasW, canvasH) {
  const validAnglesX = [];
  const validAnglesY = [];
  const currentAngleInDeg = radToDeg(newBall.movementState.bouncing.angle);

  if (newBall.x < 1)           validAnglesX.push([45,  135]);
  if (newBall.x > canvasW-1)   validAnglesX.push([225, 315]);
  if (newBall.y < 1)           validAnglesY.push([135, 225]);
  if (newBall.y > canvasH-1)   validAnglesY.push([315,  45]);

  return { validAnglesX, validAnglesY };
}

function checkCollitionWithWalls(newX, newY, newBall, canvasW, canvasH) {
  const WIDTH = canvasW;
  const HEIGHT = canvasH;
  let a = newBall.movementState.bouncing.angle;

  // LEFT wall
  if (newX < 0) {
    if (a > Math.PI/2 && a < Math.PI) {
      a = Math.abs((a - Math.PI/2 + Math.PI/2) - Math.PI);
    }
    else if (a > Math.PI && a < 3 * Math.PI/2) {
      const angleT = a - Math.PI;
      const trigCornerAngle = Math.PI/2 - angleT;
      const angleX = Math.abs((trigCornerAngle + Math.PI/2) - Math.PI);
      a = 3 * Math.PI/2 + (Math.PI/2 - angleX);
    }
    else {
      a = (Math.random() < 0.5
        ? randInt(290, 340)
        : randInt(10, 70)
      ) * Math.PI/180;
    }
  }
  // RIGHT wall
  else if (newX > WIDTH) {
    if (a > 3 * Math.PI/2 && a < 2 * Math.PI) {
      const angleT = a - 3 * Math.PI/2;
      const angleX = Math.abs(Math.PI - (angleT + Math.PI/2));
      a = angleX + Math.PI;
    }
    else if (a > 0 && a < Math.PI/2) {
      const angleX = Math.abs(Math.PI - (a + Math.PI/2));
      a = Math.PI - angleX;
    }
    else {
      a = randInt(100, 250) * Math.PI/180;
    }
  }
  // TOP wall
  else if (newY < 0) {
    if (a > Math.PI && a < 3 * Math.PI/2) {
      const angleT = a - Math.PI;
      const angleX = Math.abs(Math.PI - (angleT + Math.PI/2));
      a = angleX + Math.PI/2;
    }
    else if (a > 3 * Math.PI/2 && a < 2 * Math.PI) {
      const angleT = Math.abs(Math.PI/2 - (a - 3 * Math.PI/2));
      const angleX = Math.abs(Math.PI - (angleT + Math.PI/2));
      a = angleX;
    }
    else {
      a = randInt(10, 160) * Math.PI/180;
    }
  }
  // BOTTOM wall
  else if (newY > HEIGHT) {
    if (a > 0 && a < Math.PI/2) {
      a = 3 * Math.PI/2 + (Math.PI/2 - a);
    }
    else if (a > Math.PI/2 && a < Math.PI) {
      const angleT = a - Math.PI/2;
      const angleX = Math.abs(Math.PI - (angleT + Math.PI/2));
      a = Math.PI + angleX;
    }
    else {
      a = randInt(190, 340) * Math.PI/180;
    }
  }

  // apply a little ±5° randomness to the perfect reflection
  a = randomizeAngle(a, 5);

  // finally normalize and assign
  newBall.movementState.bouncing.angle = a % (2 * Math.PI);
  return assignBallNewPosition(newBall);
}

export function bouncingAnimation(
  currentBalls,
  animationSpeedMultiplier,
  canvasW,
  canvasH
) {
  const animationSpeed = baseAnimationSpeed * animationSpeedMultiplier;
  const newBalls = [];

  for (const ball of currentBalls) {
    const {
      x,
      y,
      size,
      colour,
      originalSize,
      originalX,
      originalY,
      movementState
    } = ball;
    const newBall = {
      x,
      y,
      size,
      colour,
      originalSize,
      originalX,
      originalY,
      movementState
    };

    if (!newBall.movementState.bouncing) {
      newBall.movementState.bouncing = { angle: 2, speed: animationSpeed };
    }

    const speed = newBall.movementState.bouncing.speed;
    const angle = newBall.movementState.bouncing.angle;
    const { newX, newY } = newXY(newBall.x, newBall.y, speed, angle);

    newBalls.push(
      checkCollitionWithWalls(newX, newY, newBall, canvasW, canvasH)
    );
  }

  return newBalls;
}