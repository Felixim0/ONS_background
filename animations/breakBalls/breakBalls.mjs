
// Setup preferences
const minBallSize = 10; // do not break balls smaller than this

export function breakBalls(currentBalls) {
  const newBalls = [];

  for (const ball of currentBalls) {
    const { x, y, size, colour, originalSize, originalX, originalY, movementState } = ball;
    const angle = movementState.bouncing.angle;
    const speed = movementState.bouncing.speed;

    // If the ball too small, just add it without breakign
    if (size <= minBallSize) {
      newBalls.push(ball);
      continue;
    } 

    // Otherwise, break the ball into 2 smaller balls
    const newSize = size / 2;

    // Get the agnle of original movement and create the angles 45 degrees either side
    const angleForBall1 = angle + 45;
    const angleForBall2 = angle - 45;
    const newSpeed = speed * 1.8 ; // Less mass, more speed

    // Movement States
    const movementStateForBall1 = { bouncing: { angle: angleForBall1, speed: newSpeed } };
    const movementStateForBall2 = { bouncing: { angle: angleForBall2, speed: newSpeed } };

    newBalls.push(
      { x, y, size: newSize, colour, originalSize, originalX, originalY, movementState: movementStateForBall1 },
      { x, y, size: newSize, colour, originalSize, originalX, originalY, movementState: movementStateForBall2 },
    );
  }

  return newBalls;
}