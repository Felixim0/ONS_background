function drawBall(c, ball) {
  const { x, y, size, colour } = ball;
  c.fillStyle = colour;
  c.beginPath();
  c.ellipse(x, y, size / 2, size / 2, 0, 0, 7);
  c.fill();
}

export function drawBalls(c, ballsToDraw) {
  for (const ball of ballsToDraw) {
    drawBall(c, ball);
   }
}

export function orderBallsBySize(balls) {
  // Sort balls by size in descending order
  return balls.sort((a, b) => b.size - a.size);
}