import test from 'node:test';
import assert from 'node:assert/strict';

import { restoreCanvasPicture, saveCanvasPicture } from '../../helpers/canvas_helpers.mjs';
import { createMockCanvasAndContext } from '../testUtils.mjs';

test('saveCanvasPicture captures the current canvas and restoreCanvasPicture replays it', () => {
  const { context, calls } = createMockCanvasAndContext({ width: 320, height: 240 });

  saveCanvasPicture(context);
  restoreCanvasPicture(context);

  assert.deepEqual(calls[0], ['getImageData', 0, 0, 320, 240]);
  assert.deepEqual(calls[1], ['clearRect', 0, 0, 320, 240]);
  assert.equal(calls[2][0], 'putImageData');
  assert.deepEqual(calls[2][1], { snapshot: true, args: [0, 0, 320, 240] });
});

test('restoreCanvasPicture still clears and attempts to draw even without a prior save', () => {
  const { context, calls } = createMockCanvasAndContext({ width: 640, height: 480 });

  restoreCanvasPicture(context);

  assert.deepEqual(calls[0], ['clearRect', 0, 0, 640, 480]);
  assert.equal(calls[1][0], 'putImageData');
  assert.equal(calls[1][2], 0);
  assert.equal(calls[1][3], 0);
});