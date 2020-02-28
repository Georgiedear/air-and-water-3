# air-and-water

This has two packages, `client` and `server`.

- The `client` is a React/P5 application that connects to an Arduino through socket.io.
- The `server` connects to an Arduino through `serialport` and relays data to the client through socket.io.
- This setup is needed because a browser cannot directly connect to the Arduino through USB/`serialport`.

These packages have a few scripts:

- `yarn start` - Runs in development mode with live reloading of the client and server.
- `yarn build` - Creates a production build.
- `yarn serve` - Serves a production build.
