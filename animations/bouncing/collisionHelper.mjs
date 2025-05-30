import { randInt, randomizeAngle, newXY } from './angleHelpers.mjs';

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

export function checkCollitionWithWalls(newX, newY, newBall, canvasW, canvasH, randomnessMaxJitter) {
  const WIDTH = canvasW;
  const HEIGHT = canvasH;
  let a = newBall.movementState.bouncing.angle;

  // Radius used to bounce off of edges - but if a ball is too big, then it CAN go out of bounds
  let r = newBall.size / 2;
  if (r > 100 ){
    r = 0;
  }

  // LEFT wall
  if (newX - r < 0) {
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
  else if (newX + r > WIDTH) {
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
  else if (newY - r < 0) {
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
  else if (newY + r > HEIGHT) {
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
  a = randomizeAngle(a, randomnessMaxJitter);

  // finally normalize and assign
  newBall.movementState.bouncing.angle = a % (2 * Math.PI);
  return assignBallNewPosition(newBall);
}