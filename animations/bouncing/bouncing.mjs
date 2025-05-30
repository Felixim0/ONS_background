let baseAnimationSpeed = 0.1;

function newXY(x, y, speed, angle) {
  // Calculate new x and y based on speed and angle
  const newX = x + speed * Math.sin(angle);
  const newY = y + speed * Math.cos(angle);
  return { newX, newY };
}

function assignBallNewPosition(newBall) {
  // Assign the new poisition to the ball (assume its checked for collisions already)
  const { newX, newY } = newXY(newBall.x, newBall.y, newBall.movementState.bouncing.speed, newBall.movementState.bouncing.angle);
  newBall.x = newX;
  newBall.y = newY;

  return newBall;
}

function getValidAnglesForOutOfBoundsBall(newBall, canvasW, canvasH) {
  const validAnglesX = [];
  const validAnglesY = [];

  const currentX = newBall.x;
  const currentY = newBall.y;

  const currentAngleInDeg = radToDeg(newBall.movementState.bouncing.angle);

  // If the ball is out of bounds then deffine acceptable angles
  if (newBall.x < 1)           validAnglesX.push([45,  135]);
  if (newBall.x > canvasW-1)   validAnglesX.push([225, 315]);
  if (newBall.y < 1)           validAnglesY.push([135, 225]);
  if (newBall.y > canvasH-1)   validAnglesY.push([315,  45]);

  return {validAnglesX, validAnglesY};
}

function checkCollitionWithWalls(newX, newY, newBall, canvasW, canvasH) {
  const r = newBall.size / 2; // Size is diameter

  const yPlusR = newY + r;
  const oldyPlusR = newBall.y + r;

  const angle = newBall.movementState.bouncing.angle;

  // If already outside the canvas, check that the angle will bring it back into main canvas
  if ( (oldyPlusR > canvasH) || (oldyPlusR < 0) ) {
    const validAngles = getValidAnglesForOutOfBoundsBall(newBall, canvasW, canvasH);
    console.log('Valid angles for out of bounds ball:', validAngles);
  }

  if ( yPlusR > canvasH) {
    newBall.movementState.bouncing.angle = (angle + Math.PI) % (2 * Math.PI);
  }
  
  return assignBallNewPosition(newBall);
}

export function bouncingAnimation(currentBalls, animationSpeedMultiplier, canvasW, canvasH)   {
  // Given pisition, size, colour, calcualte new position and return (drawing the balls is handled after)
  const animationSpeed = baseAnimationSpeed * animationSpeedMultiplier; 
  const newBalls = [];

  for (const ball of currentBalls) {
    const { x, y, size, colour, originalSize, originalX, originalY, movementState} = ball;
    const newBall = { x, y, size, colour, originalSize, originalX, originalY, movementState };

    // Change newball values here
    
    if (!newBall.movementState.bouncing) {
      // First time the ball is bouncing, so add the default movement state
      newBall.movementState.bouncing = {'angle': 2, 'speed': animationSpeed};
    }

    const speed = newBall.movementState.bouncing.speed;
    const angle = newBall.movementState.bouncing.angle;

    const { newX, newY } = newXY(newBall.x, newBall.y, speed, angle);

    

    newBalls.push(checkCollitionWithWalls(newX, newY, newBall, canvasW, canvasH));
  }
  return newBalls;
}



