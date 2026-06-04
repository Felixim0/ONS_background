export function stubGlobals(overrides) {
  const originals = new Map();

  for (const [key, value] of Object.entries(overrides)) {
    originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, {
      configurable: true,
      writable: true,
      value,
    });
  }

  return () => {
    for (const [key, descriptor] of originals.entries()) {
      if (descriptor === undefined) {
        delete globalThis[key];
      } else {
        Object.defineProperty(globalThis, key, descriptor);
      }
    }
  };
}

export function createClassList(initialClasses = []) {
  const classes = new Set(initialClasses);

  return {
    add(name) {
      classes.add(name);
    },
    remove(name) {
      classes.delete(name);
    },
    toggle(name) {
      if (classes.has(name)) {
        classes.delete(name);
        return false;
      }

      classes.add(name);
      return true;
    },
    contains(name) {
      return classes.has(name);
    },
  };
}

export function createMockCanvasAndContext({ width = 800, height = 600, classes = [] } = {}) {
  const calls = [];

  const canvas = {
    width,
    height,
    classList: createClassList(classes),
    getContext() {
      return context;
    },
  };

  const context = {
    canvas,
    fillStyle: undefined,
    beginPath() {
      calls.push(['beginPath']);
    },
    ellipse(...args) {
      calls.push(['ellipse', ...args]);
    },
    fill() {
      calls.push(['fill']);
    },
    getImageData(...args) {
      calls.push(['getImageData', ...args]);
      return { snapshot: true, args };
    },
    clearRect(...args) {
      calls.push(['clearRect', ...args]);
    },
    putImageData(...args) {
      calls.push(['putImageData', ...args]);
    },
    drawImage(...args) {
      calls.push(['drawImage', ...args]);
    },
    save() {
      calls.push(['save']);
    },
    restore() {
      calls.push(['restore']);
    },
  };

  return { canvas, context, calls };
}

export function createVideoElement({ readyState = 3 } = {}) {
  return {
    readyState,
    srcObject: null,
    playCalls: 0,
    async play() {
      this.playCalls += 1;
    },
  };
}

export function withMathRandom(value) {
  const original = Math.random;
  Math.random = () => value;
  return () => {
    Math.random = original;
  };
}