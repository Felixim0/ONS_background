import test from 'node:test';
import assert from 'node:assert/strict';

import { createCameraCutoutController } from '../../helpers/camera_cutout_helpers.mjs';
import { createMockCanvasAndContext, createVideoElement, stubGlobals } from '../testUtils.mjs';

test('createCameraCutoutController throws when camera elements are missing', () => {
  const restoreGlobals = stubGlobals({
    document: {
      querySelector() {
        return null;
      },
    },
  });

  try {
    assert.throws(
      () => createCameraCutoutController({ videoSelector: '#video', canvasSelector: '#canvas' }),
      /Camera elements were not found/
    );
  } finally {
    restoreGlobals();
  }
});

test('camera controller can start in raw-video fallback mode and stop cleanly', async () => {
  const { canvas, context, calls } = createMockCanvasAndContext({ classes: ['hidden'] });
  const video = createVideoElement();
  const track = {
    stopCalls: 0,
    stop() {
      this.stopCalls += 1;
    },
  };
  const stream = {
    getTracks() {
      return [track];
    },
  };

  let frameRequestId;
  let cancelRequestId;
  let stateChangeCalls = 0;
  const originalWarn = console.warn;
  console.warn = () => {};

  const restoreGlobals = stubGlobals({
    document: {
      querySelector(selector) {
        if (selector === '#video') {
          return video;
        }

        if (selector === '#canvas') {
          return canvas;
        }

        return null;
      },
      createElement() {
        return {
          dataset: {},
          addEventListener() {},
        };
      },
      head: {
        appendChild(script) {
          queueMicrotask(() => {
            script.onerror?.(new Error('load failed'));
          });
        },
      },
    },
    window: {
      innerWidth: 1024,
      innerHeight: 768,
      requestAnimationFrame(callback) {
        frameRequestId = 99;
        return frameRequestId;
      },
      cancelAnimationFrame(id) {
        cancelRequestId = id;
      },
    },
    navigator: {
      mediaDevices: {
        async getUserMedia() {
          return stream;
        },
      },
    },
  });

  try {
    const controller = createCameraCutoutController({
      videoSelector: '#video',
      canvasSelector: '#canvas',
      onStateChange() {
        stateChangeCalls += 1;
      },
    });

    await controller.start();

    assert.equal(controller.isEnabled(), true);
    assert.equal(controller.getStatus(), 'on');
    assert.equal(video.srcObject, stream);
    assert.equal(video.playCalls, 1);
    assert.equal(canvas.classList.contains('hidden'), false);
    assert.equal(canvas.width, 1024);
    assert.equal(canvas.height, 768);
    assert.equal(frameRequestId, 99);
    assert.ok(stateChangeCalls >= 2);

    controller.stop();

    assert.equal(controller.isEnabled(), false);
    assert.equal(controller.getStatus(), 'off');
    assert.equal(video.srcObject, null);
    assert.equal(track.stopCalls, 1);
    assert.equal(cancelRequestId, 99);
    assert.equal(canvas.classList.contains('hidden'), true);
    assert.ok(calls.some(([name]) => name === 'clearRect'));
    assert.strictEqual(canvas.getContext('2d'), context);
  } finally {
    console.warn = originalWarn;
    restoreGlobals();
  }
});

test('camera controller sets error status when getUserMedia is unavailable', async () => {
  const { canvas } = createMockCanvasAndContext({ classes: ['hidden'] });
  const video = createVideoElement();
  let stateChangeCalls = 0;
  const originalError = console.error;
  console.error = () => {};

  const restoreGlobals = stubGlobals({
    document: {
      querySelector(selector) {
        if (selector === '#video') return video;
        if (selector === '#canvas') return canvas;
        return null;
      },
    },
    window: {
      innerWidth: 640,
      innerHeight: 360,
      requestAnimationFrame() {
        return 1;
      },
      cancelAnimationFrame() {},
    },
    navigator: {},
  });

  try {
    const controller = createCameraCutoutController({
      videoSelector: '#video',
      canvasSelector: '#canvas',
      onStateChange() {
        stateChangeCalls += 1;
      },
    });

    await controller.start();

    assert.equal(controller.getStatus(), 'error');
    assert.equal(controller.isEnabled(), false);
    assert.equal(video.srcObject, null);
    assert.ok(stateChangeCalls >= 2);
  } finally {
    console.error = originalError;
    restoreGlobals();
  }
});

test('camera controller toggle starts then stops the stream', async () => {
  const { canvas } = createMockCanvasAndContext({ classes: ['hidden'] });
  const video = createVideoElement();
  const track = {
    stopped: false,
    stop() {
      this.stopped = true;
    },
  };
  const stream = {
    getTracks() {
      return [track];
    },
  };
  const originalWarn = console.warn;
  console.warn = () => {};

  const restoreGlobals = stubGlobals({
    document: {
      querySelector(selector) {
        if (selector === '#video') return video;
        if (selector === '#canvas') return canvas;
        return null;
      },
      createElement() {
        return {
          dataset: {},
          addEventListener() {},
        };
      },
      head: {
        appendChild(script) {
          queueMicrotask(() => script.onerror?.(new Error('load failed')));
        },
      },
    },
    window: {
      innerWidth: 1280,
      innerHeight: 720,
      requestAnimationFrame() {
        return 101;
      },
      cancelAnimationFrame() {},
    },
    navigator: {
      mediaDevices: {
        async getUserMedia() {
          return stream;
        },
      },
    },
  });

  try {
    const controller = createCameraCutoutController({
      videoSelector: '#video',
      canvasSelector: '#canvas',
    });

    await controller.toggle();
    assert.equal(controller.isEnabled(), true);

    await controller.toggle();
    assert.equal(controller.isEnabled(), false);
    assert.equal(track.stopped, true);
  } finally {
    console.warn = originalWarn;
    restoreGlobals();
  }
});