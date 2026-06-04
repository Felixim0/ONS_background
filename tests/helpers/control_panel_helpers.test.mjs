import test from 'node:test';
import assert from 'node:assert/strict';

import { getNewMode, toggleControlPanelVisibility } from '../../helpers/control_panel_helpers.mjs';
import { createClassList, stubGlobals } from '../testUtils.mjs';

test('toggleControlPanelVisibility toggles the hidden class on the control panel', () => {
  const panel = { classList: createClassList(['hidden']) };
  const restoreGlobals = stubGlobals({
    document: {
      querySelector(selector) {
        assert.equal(selector, '.control-panel');
        return panel;
      },
    },
  });

  try {
    toggleControlPanelVisibility();
    assert.equal(panel.classList.contains('hidden'), false);

    toggleControlPanelVisibility();
    assert.equal(panel.classList.contains('hidden'), true);
  } finally {
    restoreGlobals();
  }
});

test('getNewMode wraps around both ends of the mode list', () => {
  const modes = ['one', 'two', 'three'];

  assert.equal(getNewMode(1, 2, modes), 0);
  assert.equal(getNewMode(-1, 0, modes), 2);
  assert.equal(getNewMode(1, 0, modes), 1);
});

test('getNewMode returns zero when direction overshoots high boundary', () => {
  const modes = ['one', 'two', 'three'];

  assert.equal(getNewMode(5, 1, modes), 0);
});

test('getNewMode returns last index when direction overshoots low boundary', () => {
  const modes = ['one', 'two', 'three'];

  assert.equal(getNewMode(-10, 1, modes), 2);
});