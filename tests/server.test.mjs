import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const PROJECT_DIR = '/Users/felixaldam/ONS/1.Training/ONS_background';

async function waitForServerReady(processHandle) {
  let output = '';

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Server startup timed out. Output: ${output}`));
    }, 7000);

    const onData = (chunk) => {
      output += chunk.toString();
      if (output.includes('Listening on port 3000')) {
        clearTimeout(timeout);
        cleanup();
        resolve();
      }
    };

    const onExit = (code) => {
      clearTimeout(timeout);
      cleanup();
      reject(new Error(`Server exited early with code ${code}. Output: ${output}`));
    };

    const cleanup = () => {
      processHandle.stdout.off('data', onData);
      processHandle.stderr.off('data', onData);
      processHandle.off('exit', onExit);
    };

    processHandle.stdout.on('data', onData);
    processHandle.stderr.on('data', onData);
    processHandle.on('exit', onExit);
  });
}

test('server serves index page and static assets', async (t) => {
  const server = spawn('node', ['server.js'], {
    cwd: PROJECT_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  t.after(async () => {
    if (!server.killed) {
      server.kill('SIGTERM');
      await delay(50);
      if (!server.killed) {
        server.kill('SIGKILL');
      }
    }
  });

  await waitForServerReady(server);

  const indexResponse = await fetch('http://localhost:3000/');
  const indexBody = await indexResponse.text();
  assert.equal(indexResponse.status, 200);
  assert.match(indexBody, /<canvas/i);

  const cssResponse = await fetch('http://localhost:3000/style.css');
  const cssBody = await cssResponse.text();
  assert.equal(cssResponse.status, 200);
  assert.match(cssBody, /body/i);
});