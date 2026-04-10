let baseAnimationSpeed = 0.40

export function breathingAnimation(currentBalls, animationSpeedMultiplier) {
  // Given pisition, size, colour, calcualte new position and return (drawing the balls is handled after)
  const newBalls = [];
  const animationSpeed = baseAnimationSpeed * animationSpeedMultiplier; 

  for (const ball of currentBalls) {
    const { x, y, size, colour, originalSize, originalX, originalY, movementState} = ball;
    const newBall = { x, y, size, colour, originalSize, originalX, originalY, movementState };
    
    // Change newball values here
    
    // Calculate size based on ball original size, so that speed of breathing
    // is linked to the size of the ball - Smaller balls should breath at the SAME SPEED
    // as the bigger balls, so the change in size should be smaller for smaller balls and bigger for bigger balls

    const referenceSize = 20; 
    const speedForThisBall = animationSpeed * Math.pow(newBall.originalSize / referenceSize, 0.5);

    const biggerSize = size + speedForThisBall;
    const smallerSize = size - speedForThisBall;

    // Biggest a ball can breathe to (smallest is it's original size)
    const maxSize = ball.originalSize * 1.8; 

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