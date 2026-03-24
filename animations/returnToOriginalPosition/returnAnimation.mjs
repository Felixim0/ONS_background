let baseAnimationSpeed = 0.01

export function checkBallsInOriginalPosition(currentBalls) {
  for (const ball of currentBalls) {
    if (ball.x !== ball.originalX || ball.y !== ball.originalY) {
      return false; // If any ball is not in its original position, return false
    }
  }
  return true; // All balls are in their original position
}

export function returnBallsAnimation(currentBalls, animationSpeedMultiplier) {
  // Given pisition, size, colour, calcualte new position and return (drawing the balls is handled after)
  const newBalls = [];
  const animationSpeed = baseAnimationSpeed * animationSpeedMultiplier; 

  for (const ball of currentBalls) {
    const { x, y, size, colour, originalSize, originalX, originalY, movementState} = ball;
    const newBall = { x, y, size, colour, originalSize, originalX, originalY, movementState };
    
    // Change newball values here

    const deltaX = newBall.originalX - newBall.x;
    const deltaY = newBall.originalY - newBall.y;

    const distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));

    let newBallX;
    let newBallY;

    if (distance <= 2) {
      newBallX = newBall.originalX;
      newBallY = newBall.originalY;
    } else {
      newBallX = newBall.x + (deltaX * 0.1);
      newBallY = newBall.y + (deltaY * 0.1);
    }

    newBall.x = newBallX;
    newBall.y = newBallY;

    newBalls.push(newBall);
  }
  return newBalls;
}