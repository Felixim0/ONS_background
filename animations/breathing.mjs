
export function breathingAnimation(currentBalls, animationSpeed) {
  // Given pisition, size, colour, calcualte new position and return (drawing the balls is handled after)
  const newBalls = [];
  for (const ball of currentBalls) {
    const { x, y, size, colour, originalSize, originalX, originalY, movementState} = ball;
    const newBall = { x, y, size, colour, originalSize, originalX, originalY, movementState };
    
    // Change newball values here
    const biggerSize = size + animationSpeed;
    const smallerSize = size - animationSpeed;
    const maxSize = ball.originalSize * 1.2; 

    console.log( newBall );

    if (!newBall.movementState.breathing) {
      // First time the ball is breathing, so add the default movement state
      newBall.movementState.breathing = {'growShrinkState': 'grow'};
    }

    const ballState = newBall.movementState.breathing.growShrinkState;

    if (ballState === 'grow') {
      if (biggerSize >= maxSize) {
        // If the ball has reached the maximum size, switch to shrinking
        newBall.movementState.breathing.growShrinkState = 'shrink';
      } else {
        newBall.size = biggerSize;
      }
    }

    if (ballState === 'shrink') {
      if (smallerSize <= originalSize) {
        // If the ball has reached the original size, switch to growing
        newBall.movementState.breathing.growShrinkState = 'grow';
      } else {
        newBall.size = smallerSize;
      }
    }

    newBalls.push(newBall);
  }
  return newBalls;
}