
export function breathingAnimation(currentBalls) {
  // Given pisition, size, colour, calcualte new position and return (drawing the balls is handled after)
  const newBalls = [];
  for (const ball of currentBalls) {
    const { x, y, size, colour } = ball;
    const newBall = { x, y, size, colour };
    newBall.x = x + 1;

    newBalls.push(newBall);
  }
  return newBalls;
}