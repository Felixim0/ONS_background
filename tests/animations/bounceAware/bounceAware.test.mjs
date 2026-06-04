import test from 'node:test';
import assert from 'node:assert/strict';

import { bounceAwareAnimation } from '../../../animations/bounceAware/bounceAware.mjs';
import { withMathRandom } from '../../testUtils.mjs';

test('bounceAwareAnimation initializes ids and size-based speeds', () => {
  const restoreRandom = withMathRandom(0);

  try {
    const result = bounceAwareAnimation([
      {
        x: 100,
        y: 100,
        size: 20,
        colour: '#111',
        originalSize: 20,
        originalX: 100,
        originalY: 100,
        movementState: {},
      },
      {
        x: 300,
        y: 300,
        size: 120,
        colour: '#222',
        originalSize: 120,
        originalX: 300,
        originalY: 300,
        movementState: {},
      },
    ], 1, 800, 600, null);

    assert.equal(result.length, 2);
    assert.ok(Number.isInteger(result[0].movementState.bounceAwareId));
    assert.ok(Number.isInteger(result[1].movementState.bounceAwareId));
    assert.notEqual(result[0].movementState.bounceAwareId, result[1].movementState.bounceAwareId);
    assert.ok(result[0].x !== 100 || result[0].y !== 100);
    assert.ok(result[1].x !== 300 || result[1].y !== 300);
    assert.ok(result[1].movementState.bouncing.speed > result[0].movementState.bouncing.speed);
  } finally {
    restoreRandom();
  }
});

test('bounceAwareAnimation reads renderContext image data when provided', () => {
  const restoreRandom = withMathRandom(0.25);
  let imageDataCalls = 0;

  const renderContext = {
    canvas: { width: 200, height: 120 },
    getImageData(x, y, w, h) {
      imageDataCalls += 1;
      return {
        data: new Uint8ClampedArray(w * h * 4),
        width: w,
        height: h,
      };
    },
  };

  try {
    const result = bounceAwareAnimation([
      {
        x: 50,
        y: 50,
        size: 30,
        colour: '#111',
        originalSize: 30,
        originalX: 50,
        originalY: 50,
        movementState: {},
      },
    ], 1, 500, 500, renderContext, 1);

    assert.equal(imageDataCalls, 1);
    assert.equal(result.length, 1);
    assert.ok(result[0].movementState.bouncing.speed > 0);
  } finally {
    restoreRandom();
  }
});