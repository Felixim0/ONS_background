import test from 'node:test';
import assert from 'node:assert/strict';

import { newXY, randInt, randomizeAngle } from '../../../animations/bouncing/angleHelpers.mjs';
import { withMathRandom } from '../../testUtils.mjs';

test('randInt returns the lower and upper bound deterministically', () => {
  let restoreRandom = withMathRandom(0);
  assert.equal(randInt(3, 7), 3);
  restoreRandom();

  restoreRandom = withMathRandom(0.999999);
  assert.equal(randInt(3, 7), 7);
  restoreRandom();
});

test('randomizeAngle adds a bounded jitter in radians', () => {
  const restoreRandom = withMathRandom(0.999999);

  try {
    const angle = randomizeAngle(Math.PI, 10);
    assert.ok(Math.abs(angle - (Math.PI + (10 * Math.PI / 180))) < 1e-12);
  } finally {
    restoreRandom();
  }
});

test('newXY returns the next coordinates from speed and angle', () => {
  const result = newXY(1, 2, 5, Math.PI / 2);

  assert.ok(Math.abs(result.newX - 1) < 1e-12);
  assert.ok(Math.abs(result.newY - 7) < 1e-12);
});

test('randInt returns the exact value when min and max match', () => {
  assert.equal(randInt(4, 4), 4);
});

test('randomizeAngle can apply a negative jitter', () => {
  const restoreRandom = withMathRandom(0);

  try {
    const angle = randomizeAngle(Math.PI, 10);
    assert.ok(Math.abs(angle - (Math.PI - (10 * Math.PI / 180))) < 1e-12);
  } finally {
    restoreRandom();
  }
});