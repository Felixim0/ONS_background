import test from 'node:test';
import assert from 'node:assert/strict';

import { drawBalls, orderBallsBySize } from '../../helpers/ball_helpers.mjs';
import { createMockCanvasAndContext } from '../testUtils.mjs';

test('drawBalls draws each ball on the canvas context', () => {
  const { context, calls } = createMockCanvasAndContext();
  const balls = [
    { x: 10, y: 20, size: 30, colour: '#123456' },
    { x: 40, y: 50, size: 60, colour: '#abcdef' },
  ];

  drawBalls(context, balls);

  assert.equal(calls.filter(([name]) => name === 'beginPath').length, 2);
  assert.equal(calls.filter(([name]) => name === 'ellipse').length, 2);
  assert.equal(context.fillStyle, '#abcdef');
});

test('orderBallsBySize sorts balls in descending size order', () => {
  const balls = [{ size: 5 }, { size: 20 }, { size: 10 }];

  const ordered = orderBallsBySize(balls);

  assert.strictEqual(ordered, balls);
  assert.deepEqual(ordered.map((ball) => ball.size), [20, 10, 5]);
});

test('drawBalls does nothing when there are no balls', () => {
  const { context, calls } = createMockCanvasAndContext();

  drawBalls(context, []);

  assert.equal(calls.length, 0);
});

test('orderBallsBySize handles negative and zero sizes', () => {
  const balls = [{ size: 0 }, { size: -5 }, { size: 3 }];

  orderBallsBySize(balls);

  assert.deepEqual(balls.map((ball) => ball.size), [3, 0, -5]);
});