# air-and-water

The client is a React/p5 watercolor installation. It uses PoseNet to count people
and receives breath-sensor readings from an Arduino through Socket.IO. J, K, and L
also operate the three demo wands without sensor hardware.

## Requirements and setup

Use Node.js 22.12 or newer (`.nvmrc` selects Node 22), then run `npm ci` from the
repository root. The npm lockfile is the source of truth for both workspaces.

- `npm start` runs the Vite client on port 3000 and the sensor server on port 8888.
- `npm run build` type-checks and builds both workspaces.
- `npm run serve` previews the client build and runs the built sensor server.
- `npm test` checks serial parsing and delivery through Socket.IO, using simulated
  sensor input so no Arduino is required.
- `npm audit` checks both production and development dependencies.

The client build is written to `client/build`, preserving the existing deployment
output directory. The client-only build command is `npm run build --workspace=air-and-water-client`.

## Camera and Arduino

Allow camera access to enable person detection. The app uses the original
MobileNetV1 PoseNet settings, downloaded from TensorFlow's model host. It can still
run the keyboard demo if the camera or model is unavailable.

Connect the Arduino over USB and upload the sketch in `WindSensor`. The server
selects a device whose manufacturer contains `Arduino`, reads at 9600 baud, and
relays colon-separated values terminated by a newline. Linux requires `udevadm`
for serial-port discovery. Physical sensor and camera calibration still need to
be checked on the installation computer.

The browser connects to `http://localhost:8888`. The sensor server permits the
client origins `http://localhost:3000` and `http://127.0.0.1:3000` by default.
For another client address, set `CLIENT_ORIGINS` to a comma-separated list of
trusted origins before starting the server.
