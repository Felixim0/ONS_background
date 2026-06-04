function resizeCanvasToViewport(canvasEl) {
  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;
}

async function loadSelfieSegmentationScript() {
  if (window.SelfieSegmentation) {
    return;
  }

  await new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-mediapipe-selfie="true"]');
    if (existing) {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js';
    script.crossOrigin = 'anonymous';
    script.dataset.mediapipeSelfie = 'true';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function renderSegmentationFrame(results, canvasEl, canvasCtx) {
  const width = canvasEl.width;
  const height = canvasEl.height;

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, width, height);
  canvasCtx.drawImage(results.segmentationMask, 0, 0, width, height);
  canvasCtx.globalCompositeOperation = 'source-in';
  canvasCtx.drawImage(results.image, 0, 0, width, height);
  canvasCtx.restore();
}

function createSegmenter(onResults) {
  if (!window.SelfieSegmentation) {
    throw new Error('MediaPipe selfie segmentation is not available.');
  }

  const segmenter = new window.SelfieSegmentation({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
  });

  segmenter.setOptions({ modelSelection: 1 });
  segmenter.onResults(onResults);

  return segmenter;
}

export function createCameraCutoutController({ videoSelector, canvasSelector, onStateChange }) {
  const videoEl = document.querySelector(videoSelector);
  const canvasEl = document.querySelector(canvasSelector);

  if (!videoEl || !canvasEl) {
    throw new Error('Camera elements were not found in the DOM.');
  }

  const canvasCtx = canvasEl.getContext('2d');

  let segmenter;
  let stream;
  let enabled = false;
  let processing = false;
  let busy = false;
  let frameRequestId;
  let status = 'off';

  const notifyStateChange = () => {
    if (typeof onStateChange === 'function') {
      onStateChange();
    }
  };

  const setStatus = (nextStatus) => {
    status = nextStatus;
    notifyStateChange();
  };

  const stop = ({ preserveStatus = false } = {}) => {
    enabled = false;

    if (frameRequestId) {
      window.cancelAnimationFrame(frameRequestId);
      frameRequestId = undefined;
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = undefined;
    }

    videoEl.srcObject = null;
    canvasEl.classList.add('hidden');
    canvasCtx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    if (!preserveStatus) {
      setStatus('off');
    }
  };

  const drawRawFrame = () => {
    if (!enabled) {
      return;
    }

    const width = canvasEl.width;
    const height = canvasEl.height;
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, width, height);
    canvasCtx.drawImage(videoEl, 0, 0, width, height);
    canvasCtx.restore();

    frameRequestId = window.requestAnimationFrame(drawRawFrame);
  };

  const processFrame = async () => {
    if (!enabled || !segmenter) {
      return;
    }

    if (videoEl.readyState < 2 || processing) {
      frameRequestId = window.requestAnimationFrame(processFrame);
      return;
    }

    processing = true;

    try {
      await segmenter.send({ image: videoEl });
    } catch (error) {
      console.error('Camera segmentation failed:', error);
      stop();
    } finally {
      processing = false;
      if (enabled) {
        frameRequestId = window.requestAnimationFrame(processFrame);
      }
    }
  };

  const start = async () => {
    if (enabled || busy) {
      return;
    }

    busy = true;
    setStatus('starting');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser.');
      }

      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      videoEl.srcObject = stream;
      await videoEl.play();
      resizeCanvasToViewport(canvasEl);
      canvasEl.classList.remove('hidden');
      enabled = true;

      try {
        await loadSelfieSegmentationScript();
        if (!segmenter && window.SelfieSegmentation) {
          segmenter = createSegmenter((results) => {
            if (!enabled) {
              return;
            }

            renderSegmentationFrame(results, canvasEl, canvasCtx);
          });
        }
      } catch (error) {
        console.warn('MediaPipe could not be loaded. Falling back to raw camera.', error);
      }

      setStatus('on');
      if (segmenter) {
        processFrame();
      } else {
        drawRawFrame();
      }
    } catch (error) {
      console.error('Unable to start camera:', error);
      setStatus('error');
      stop({ preserveStatus: true });
    } finally {
      busy = false;
      notifyStateChange();
    }
  };

  const toggle = async () => {
    if (enabled) {
      stop();
      return;
    }

    await start();
  };

  const resize = () => {
    resizeCanvasToViewport(canvasEl);
  };

  return {
    isEnabled: () => enabled,
    getStatus: () => status,
    resize,
    start,
    stop,
    toggle,
  };
}
