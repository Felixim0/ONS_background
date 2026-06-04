import test from 'node:test';
import assert from 'node:assert/strict';

import { breathingAnimation } from '../../../animations/breathing/breathing.mjs';

test('breathingAnimation initializes grow state and increases ball size', () => {
  const result = breathingAnimation([{
    x: 0,
    y: 0,
    size: 100,
    colour: '#fff',
    originalSize: 100,
    originalX: 0,
    originalY: 0,
    movementState: {},
  }], 1);

  assert.equal(result[0].movementState.breathing.growShrinkState, 'grow');
  assert.ok(result[0].size > 100);
});

test('breathingAnimation shrinks balls that are already in shrink mode', () => {
  const result = breathingAnimation([{
    x: 0,
    y: 0,
    size: 150,
    colour: '#fff',
    originalSize: 100,
    originalX: 0,
    originalY: 0,
    movementState: {
      breathing: {
        growShrinkState: 'shrink',
      },
    },
  }], 1);

  assert.ok(result[0].size < 150);
});

test('breathingAnimation flips to shrink when reaching max size', () => {
  const result = breathingAnimation([{
    x: 0,
    y: 0,
    size: 180,
    colour: '#fff',
    originalSize: 100,
    originalX: 0,
    originalY: 0,
    movementState: {
      breathing: {
        growShrinkState: 'grow',
      },
    },
  }], 1);

  assert.equal(result[0].movementState.breathing.growShrinkState, 'shrink');
  assert.equal(result[0].size, 180);
});

test('breathingAnimation snaps to grow when shrinking reaches original size', () => {
  const result = breathingAnimation([{
    x: 0,
    y: 0,
    size: 100,
    colour: '#fff',
    originalSize: 100,
    originalX: 0,
    originalY: 0,
    movementState: {
      breathing: {
        growShrinkState: 'shrink',
      },
    },
  }], 1);

  assert.equal(result[0].movementState.breathing.growShrinkState, 'grow');
  assert.equal(result[0].size, 100);
});