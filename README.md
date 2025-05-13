# Playcademy Vite JS Template

This template provides a starting point for integrating a web-native game built with Vite (JavaScript) with the Playcademy platform.

## Features

- **Playcademy SDK Integration**: Includes basic setup for the `@playcademy/sdk`.
- **Manifest Plugin**: Pre-configured with `@playcademy/vite-plugin` to generate `cademy.manifest.json`.
- **Initialization Logic**: Handles SDK initialization for both iframe (Playcademy platform) and standalone (local development) modes.
- **Mock Context**: Provides a mock `window.CADEMY` context for easier local development and testing.
- **Example UI**: Basic UI elements to show initialization status and an exit button.

## Setup

1.  **Install Dependencies**:

    ```bash
    bun install
    # or npm install / yarn install
    ```

2.  **Configure `vite.config.js`**:
    Open `vite.config.js` and update the `gameId` and `gameName` in the `cademyManifestPlugin` configuration to match your game's details on the Playcademy platform.

3.  **Develop Your Game**:
    Build your game logic primarily in the `src` directory. `main.js` is the main entry point.
    The Playcademy client instance is available after the `initializeCademy()` promise resolves in `main.js`.

## Local Development

When running the game locally (e.g., using `bun run dev`), `src/playcademy-init.js` sets up a mock context on `window.CADEMY`. This allows you to test core game logic that might interact with the SDK without needing to run it inside the full Playcademy platform.

- The `baseUrl` in the mock context is set to `/api`. If your local development server for the API (if any) runs on a different port, you might need to configure the proxy in `vite.config.js` (see comments in the file).
- The `client.runtime.exit()` function will only log a warning in standalone mode as there is no platform to exit to.

## Building for Playcademy

Run the build command:

```bash
bun run build
```

This will generate the production build in the `dist` folder, including the `cademy.manifest.json` required by the Playcademy platform.

## Customization

- **Styling**: Modify `style.css` and `src/rainbow-status.css` for UI styling.
- **HTML**: The main HTML structure is in `index.html`, with dynamic content largely injected by `main.js`.
- **SDK Usage**: Expand upon the example SDK usage in `main.js` to integrate features like user data, game state saving/loading, inventory, etc.
