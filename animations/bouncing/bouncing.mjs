import { checkCollitionWithWalls} from './collisionHelper.mjs';
import { newXY } from './angleHelpers.mjs';

let baseAnimationSpeed = 0.5;

export function bouncingAnimation( currentBalls, animationSpeedMultiplier, canvasW, canvasH ) {
  const animationSpeed = baseAnimationSpeed * animationSpeedMultiplier;
  const newBalls = [];

  for (const ball of currentBalls) {
    const { x, y, size, colour, originalSize, originalX, originalY, movementState } = ball;
    const newBall = {x, y, size, colour, originalSize, originalX, originalY, movementState };

    if (!newBall.movementState.bouncing) {
      newBall.movementState.bouncing = { angle: 2, speed: animationSpeed };
    }

    const speed = newBall.movementState.bouncing.speed;
    const angle = newBall.movementState.bouncing.angle;
    const { newX, newY } = newXY(newBall.x, newBall.y, speed, angle);
    const randomnessMaxJitter = 2;

    newBalls.push(
      checkCollitionWithWalls(newX, newY, newBall, canvasW, canvasH, randomnessMaxJitter )
    );
  }

  return newBalls;
}