import test from 'node:test';
import assert from 'node:assert/strict';

import { getStartingBalls } from '../../helpers/setup_helpers.mjs';

test('getStartingBalls adds original coordinates, original size, and movement state', () => {
  const balls = getStartingBalls();

  assert.ok(balls.length > 0);

  for (const ball of balls) {
    assert.equal(ball.originalX, ball.x);
    assert.equal(ball.originalY, ball.y);
    assert.equal(ball.originalSize, ball.size);
    assert.deepEqual(ball.movementState, {});
  }
});

test('getStartingBalls returns the same underlying array reference across calls', () => {
  const first = getStartingBalls();
  const second = getStartingBalls();

  assert.strictEqual(first, second);
});