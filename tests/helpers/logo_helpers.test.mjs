import test from 'node:test';
import assert from 'node:assert/strict';

import { saveCanvasPicture } from '../../helpers/canvas_helpers.mjs';
import { prepareLogo, prepareText } from '../../helpers/logo_helpers.mjs';
import { createMockCanvasAndContext, stubGlobals } from '../testUtils.mjs';

class MockImage {
  constructor() {
    this.listeners = new Map();
    MockImage.instances.push(this);
  }

  addEventListener(name, callback) {
    this.listeners.set(name, callback);
  }

  dispatch(name) {
    const callback = this.listeners.get(name);
    if (callback) {
      callback();
    }
  }
}

MockImage.instances = [];

test('prepareLogo loads and draws the logo image', () => {
  MockImage.instances = [];
  const { context, calls } = createMockCanvasAndContext();
  const restoreGlobals = stubGlobals({ Image: MockImage });

  try {
    saveCanvasPicture(context);
    prepareLogo(context);

    const logo = MockImage.instances[0];
    logo.width = 100;
    logo.height = 50;
    logo.dispatch('load');

    const drawCall = calls.find(([name, image]) => name === 'drawImage' && image === logo);
    assert.equal(logo.src, './text_images/ons_logo_white.svg');
    assert.deepEqual(drawCall.slice(2), [30, 20, 260, 130]);
  } finally {
    restoreGlobals();
  }
});

test('prepareText loads and draws the text image', () => {
  MockImage.instances = [];
  const { context, calls } = createMockCanvasAndContext();
  const restoreGlobals = stubGlobals({ Image: MockImage });

  try {
    saveCanvasPicture(context);
    prepareText(context);

    const logoText = MockImage.instances[0];
    logoText.width = 200;
    logoText.height = 40;
    logoText.dispatch('load');

    const drawCall = calls.find(([name, image]) => name === 'drawImage' && image === logoText);
    assert.equal(logoText.src, './text_images/digital_services.svg');
    assert.deepEqual(drawCall.slice(2), [410, 0, 320, 64]);
  } finally {
    restoreGlobals();
  }
});

test('prepareLogo does not draw before load event fires', () => {
  MockImage.instances = [];
  const { context, calls } = createMockCanvasAndContext();
  const restoreGlobals = stubGlobals({ Image: MockImage });

  try {
    saveCanvasPicture(context);
    prepareLogo(context);

    assert.equal(MockImage.instances.length, 1);
    assert.equal(calls.some(([name]) => name === 'drawImage'), false);
  } finally {
    restoreGlobals();
  }
});