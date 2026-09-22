# Air + Water client

Run `npm ci` from the repository root using Node.js 22.12 or newer.

- `npm run start --workspace=air-and-water-client`: development server, port 3000.
- `npm run build --workspace=air-and-water-client`: type-check and build to `client/build`.
- `npm run serve --workspace=air-and-water-client`: preview the built application.

Vite handles the build. TensorFlow PoseNet supplies the original pose-detection
model directly, without the old ml5 visualization dependency tree. See the root
README for the sensor server, camera behavior, and tests.
