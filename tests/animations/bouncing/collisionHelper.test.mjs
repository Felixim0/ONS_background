import test from 'node:test';
import assert from 'node:assert/strict';

import { checkCollitionWithWalls } from '../../../animations/bouncing/collisionHelper.mjs';

test('checkCollitionWithWalls reflects a ball away from the left wall', () => {
  const ball = {
    x: 5,
    y: 50,
    size: 20,
    movementState: {
      bouncing: {
        angle: (3 * Math.PI) / 4,
        speed: 2,
      },
    },
  };

  const updated = checkCollitionWithWalls(-1, 50, ball, 300, 200, 0);

  assert.strictEqual(updated, ball);
  assert.ok(updated.movementState.bouncing.angle > 0);
  assert.ok(updated.movementState.bouncing.angle < Math.PI / 2);
  assert.ok(updated.x > 5);
});

test('checkCollitionWithWalls reflects a ball away from the right wall', () => {
  const ball = {
    x: 295,
    y: 50,
    size: 20,
    movementState: { bouncing: { angle: Math.PI / 4, speed: 2 } },
  };

  checkCollitionWithWalls(301, 50, ball, 300, 200, 0);

  assert.ok(ball.movementState.bouncing.angle > Math.PI / 2);
  assert.ok(ball.movementState.bouncing.angle < Math.PI);
});

test('checkCollitionWithWalls reflects a ball away from the top wall', () => {
  const ball = {
    x: 150,
    y: 5,
    size: 20,
    movementState: { bouncing: { angle: (5 * Math.PI) / 4, speed: 2 } },
  };

  checkCollitionWithWalls(150, -1, ball, 300, 200, 0);

  assert.ok(ball.movementState.bouncing.angle > Math.PI / 2);
  assert.ok(ball.movementState.bouncing.angle < Math.PI);
});

test('checkCollitionWithWalls reflects a ball away from the bottom wall', () => {
  const ball = {
    x: 150,
    y: 195,
    size: 20,
    movementState: { bouncing: { angle: Math.PI / 4, speed: 2 } },
  };

  checkCollitionWithWalls(150, 205, ball, 300, 200, 0);

  assert.ok(ball.movementState.bouncing.angle > (3 * Math.PI) / 2);
  assert.ok(ball.movementState.bouncing.angle < 2 * Math.PI);
});