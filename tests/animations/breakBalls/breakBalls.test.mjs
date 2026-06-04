import test from 'node:test';
import assert from 'node:assert/strict';

import { breakBalls } from '../../../animations/breakBalls/breakBalls.mjs';

test('breakBalls splits large balls and leaves very small balls unchanged', () => {
  const originalSmallBall = {
    x: 1,
    y: 2,
    size: 10,
    colour: '#aaa',
    originalSize: 10,
    originalX: 1,
    originalY: 2,
    movementState: { bouncing: { angle: 0.5, speed: 2 } },
  };

  const result = breakBalls([
    {
      x: 10,
      y: 20,
      size: 40,
      colour: '#fff',
      originalSize: 40,
      originalX: 10,
      originalY: 20,
      movementState: { bouncing: { angle: 1, speed: 3 } },
    },
    originalSmallBall,
  ]);

  assert.equal(result.length, 3);
  assert.deepEqual(result.slice(0, 2).map((ball) => ball.size), [20, 20]);
  assert.deepEqual(result.slice(0, 2).map((ball) => ball.movementState.bouncing.angle), [46, -44]);
  assert.deepEqual(result.slice(0, 2).map((ball) => ball.movementState.bouncing.speed), [5.4, 5.4]);
  assert.strictEqual(result[2], originalSmallBall);
});

test('breakBalls keeps metadata when splitting a single large ball', () => {
  const source = {
    x: 25,
    y: 35,
    size: 12,
    colour: '#123',
    originalSize: 48,
    originalX: 11,
    originalY: 22,
    movementState: { bouncing: { angle: 2, speed: 4 } },
  };

  const result = breakBalls([source]);

  assert.equal(result.length, 2);
  assert.deepEqual(result.map((ball) => ball.colour), ['#123', '#123']);
  assert.deepEqual(result.map((ball) => ball.originalSize), [48, 48]);
  assert.deepEqual(result.map((ball) => ball.originalX), [11, 11]);
  assert.deepEqual(result.map((ball) => ball.originalY), [22, 22]);
});