import test from 'node:test';
import assert from 'node:assert/strict';

import {
  checkBallsInOriginalPositionAndSize,
  consolidateBalls,
  returnBallsAnimation,
} from '../../../animations/returnToOriginalPosition/returnAnimation.mjs';
import { getStartingBalls } from '../../../helpers/setup_helpers.mjs';

test('consolidateBalls returns the original set when too many balls exist', () => {
  const originalBalls = getStartingBalls();
  const result = consolidateBalls([...originalBalls, { extra: true }]);

  assert.equal(result.length, originalBalls.length);
});

test('checkBallsInOriginalPositionAndSize reports whether all balls match their originals', () => {
  assert.equal(checkBallsInOriginalPositionAndSize([{ x: 1, y: 2, size: 3, originalX: 1, originalY: 2, originalSize: 3 }]), true);
  assert.equal(checkBallsInOriginalPositionAndSize([{ x: 2, y: 2, size: 3, originalX: 1, originalY: 2, originalSize: 3 }]), false);
});

test('returnBallsAnimation nudges position and size back toward the originals', () => {
  const result = returnBallsAnimation([{
    x: 50,
    y: 60,
    size: 70,
    colour: '#fff',
    originalSize: 100,
    originalX: 100,
    originalY: 110,
    movementState: {},
  }], 1);

  assert.ok(result[0].x > 50 && result[0].x < 100);
  assert.ok(result[0].y > 60 && result[0].y < 110);
  assert.ok(result[0].size > 70 && result[0].size < 100);
});

test('consolidateBalls returns the current set when count is not above original', () => {
  const currentBalls = [{ x: 1, y: 1, size: 10, originalX: 1, originalY: 1, originalSize: 10 }];

  const result = consolidateBalls(currentBalls);

  assert.strictEqual(result, currentBalls);
});

test('returnBallsAnimation snaps position and size when already close enough', () => {
  const result = returnBallsAnimation([{
    x: 100.5,
    y: 99.2,
    size: 49.7,
    colour: '#fff',
    originalSize: 50,
    originalX: 101,
    originalY: 100,
    movementState: {},
  }], 1);

  assert.equal(result[0].x, 101);
  assert.equal(result[0].y, 100);
  assert.equal(result[0].size, 50);
});