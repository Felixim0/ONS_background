# ONS_background
The background for ONS digital has spheres and other iconography. 

As part of a fun and whimsical side project I would like to animate them in order to further my skills in javascript and to test vibe coding.

# How to use

1. [Visit the ONS Background site here](https://felixim0.github.io/ONS_background/)

2. Press c to toggle the webcam cutout mode on and off.

3. When enabled, the browser asks for camera permission and removes your background in real time.

4. The page can now be used directly as a browser camera scene (no NVIDIA Broadcast required).

5. Use OBS LAUNCH WITH --use-fake-ui-for-media-stream  to capture browser window and use as camera input

## Tests

Run the automated test suite locally with:

```bash
npm install
npm test
```

The test suite uses Node's built-in test runner, so no extra test framework is required.

GitHub Actions also runs the same tests automatically on every push and pull request.

## Browser notes

* Camera access requires HTTPS or localhost.
* Works best in modern Chromium, Firefox, and Safari versions.
* If camera does not start, check browser camera permissions and refresh.

## Legacy setup (optional)

1. [Download OBS](https://obsproject.com/download)

2. [Download NVIDIA Broadcast](https://www.nvidia.com/en-gb/geforce/broadcasting/broadcast-app/)

3. Setup

Use NVIDIA Broadcast to "remove background" on your webcam.

Setup OBS to use your NVIDIA Broadcast camera output.

Setup OBS to use https://felixim0.github.io/ONS_background/ as a website background.

You can then use the "Interact" option in OBS to change the ball animations, speed, toggle the menu visiblity on or off.

If you place the webcam input in OBS in the usual position, then the UI should be hidden by your own picture, allowing you to see and update the balls live, without anyone seeing in teams/meet/etc.


## TODO
* [] Add "ball breaker" option to make more balls on button press
* [] Add "reset" keyboard shortcut to reset all balls to initial state
* [x] Create "GitHub" pages for the background 

## TODO - Extras (feel free to PR these fixes)
* [] Add TODO - Extras requirements!