import { getStartingBalls } from "../../helpers/setup_helpers.mjs";

let baseAnimationSpeed = 0.01

export function consolidateBalls(currentBalls) {
  const originalBalls = getStartingBalls();
  const lengthOfOriginalBalls = originalBalls.length;
  const lengthOfCurrentBalls = currentBalls.length;

  // If there are more balls than original, return original
  if (lengthOfCurrentBalls > lengthOfOriginalBalls) {
    return originalBalls;
  }
  return currentBalls;
}

export function checkBallsInOriginalPositionAndSize(currentBalls) {
  for (const ball of currentBalls) {
    if (ball.x !== ball.originalX || ball.y !== ball.originalY || ball.size !== ball.originalSize) {
      return false; // If any ball is not in its original position or size, return false
    }
  }
  return true; // All balls are in their original position and  size
}

export function returnBallsAnimation(currentBalls, animationSpeedMultiplier) {
  // Given pisition, size, colour, calcualte new position and return (drawing the balls is handled after)
  const newBalls = [];
  const animationSpeed = baseAnimationSpeed * animationSpeedMultiplier; 

  for (const ball of currentBalls) {
    const { x, y, size, colour, originalSize, originalX, originalY, movementState} = ball;
    const newBall = { x, y, size, colour, originalSize, originalX, originalY, movementState };
    
    // Change newball values here

    // Find the distance between the balls curernt position and original
    const deltaX = newBall.originalX - newBall.x;
    const deltaY = newBall.originalY - newBall.y;

    // Find the difference between the ball's current size and original size
    const deltaSize = newBall.originalSize - newBall.size;

    // use the diference to find distance
    const distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));

    let newBallX;
    let newBallY;
    let newBallSize;

    // Add a check to see if the ball is *basically close enough* to it's original starting point
    // Otherwise this would go on for ever!
    if (distance <= 2) {
      newBallX = newBall.originalX;
      newBallY = newBall.originalY;
    } else {
      // Move 10% of the way each time (quite nice and smooth :D)
      newBallX = newBall.x + (deltaX * 0.1);
      newBallY = newBall.y + (deltaY * 0.1);
    }

    if (Math.abs(deltaSize) <= 0.5) {
      newBallSize = newBall.originalSize;
    } else {
      newBallSize = newBall.size + (deltaSize * 0.1);
    }

    newBall.x = newBallX;
    newBall.y = newBallY;
    newBall.size = newBallSize;

    newBalls.push(newBall);
  }
  return newBalls;
}