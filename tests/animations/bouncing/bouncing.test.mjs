import test from 'node:test';
import assert from 'node:assert/strict';

import { bouncingAnimation } from '../../../animations/bouncing/bouncing.mjs';
import { withMathRandom } from '../../testUtils.mjs';

test('bouncingAnimation initializes bouncing state and moves the ball', () => {
  const restoreRandom = withMathRandom(0.5);

  try {
    const balls = [{
      x: 100,
      y: 100,
      size: 20,
      colour: '#fff',
      originalSize: 20,
      originalX: 100,
      originalY: 100,
      movementState: {},
    }];

    const result = bouncingAnimation(balls, 2, 500, 500);

    assert.equal(result.length, 1);
    assert.equal(result[0].movementState.bouncing.speed, 1.8);
    assert.ok(result[0].x !== 100 || result[0].y !== 100);
  } finally {
    restoreRandom();
  }
});

test('bouncingAnimation keeps an existing bouncing state speed', () => {
  const balls = [{
    x: 40,
    y: 60,
    size: 20,
    colour: '#fff',
    originalSize: 20,
    originalX: 40,
    originalY: 60,
    movementState: {
      bouncing: {
        angle: 0,
        speed: 5,
      },
    },
  }];

  const result = bouncingAnimation(balls, 0.5, 500, 500);

  assert.equal(result[0].movementState.bouncing.speed, 5);
  assert.ok(result[0].x > 40);
});