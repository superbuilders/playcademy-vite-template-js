import './style.css'
import './rainbow-status.css'

import { PlaycademyClient } from '@playcademy/sdk'

import javascriptLogo from '/javascript.svg'
import viteLogo from '/vite.svg'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Vite + JavaScript + Playcademy</h1>
    <div class="status-container">
      <p class="status-text">
        Initializing Playcademy SDK...
      </p>
    </div>
    <button id="exitButton" disabled>Exit Game</button>
  </div>
`

// --- UI Element Selection ---
const statusTextElement = document.querySelector('.status-text')
const exitButtonElement = document.querySelector('#exitButton')

// --- Main Application Flow (IIAFE to handle async) ---

;(async () => {
    let client = null // To hold the initialized client instance

    try {
        // Step 1: Initialize the SDK
        client = await PlaycademyClient.init()
        // Step 2: Update template UI based on success
        updateUIToSuccess(client, statusTextElement, exitButtonElement)
    } catch (error) {
        // Step 2 (Error): Update template UI based on failure
        updateUIToError(error, statusTextElement, exitButtonElement)
    }

    // --- Step 3: Your Game Logic Starts Here ---
    // This block executes only if the SDK was initialized successfully (client is not null).
    if (client) {
        // The initialized 'client' instance is available here.

        // TODO: Address the behavior of client.users.me() (and similar SDK calls) in standalone/mock mode.
        // Currently, these calls attempt to reach /api/users/me (etc.), and the Vite dev server responds
        // with index.html because no actual backend is running at that path.
        // This results in the '.then(data => ...)' callback receiving HTML instead of expected API data.
        // For a better local development experience, implement a robust mocking strategy. Options include:
        // 1. Globally mocking `fetch` to intercept specific API routes and return controlled mock responses.
        // 2. Integrating a library like Mock Service Worker (msw) to create a more comprehensive mock API layer.
        // 3. Developing a sandboxed environment that can be used to use the SDK in development mode.
        // More here: https://github.com/superbuilders/playcademy/issues/19

        // Example: Get user data
        const user = await client.users.me() // This will not work in standalone mode because a mock API is not available yet.
        console.log('[Game Logic] User:', user)

        // Add your game initialization code, main loop, etc., here.
        console.log('[Game Logic] SDK is ready, start the game!')
    }
})()

// --- UI Update Functions (Specific to this template) ---

function updateUIToSuccess(client, statusEl, buttonEl) {
    console.log('[Main] Playcademy SDK Initialized:', client)
    if (statusEl) {
        const isStandalone = window.self === window.top
        statusEl.textContent = `Playcademy SDK Initialized!${isStandalone ? ' [Standalone Mode]' : ''}`
    }
    if (buttonEl) {
        buttonEl.disabled = false

        const newButtonEl = buttonEl.cloneNode(true)
        buttonEl.parentNode?.replaceChild(newButtonEl, buttonEl)

        newButtonEl.addEventListener('click', () => {
            if (window.self !== window.top) {
                console.log('[Main] Attempting to exit via client.runtime.exit()...')
                client.runtime.exit()
            } else {
                console.warn('[Main] Exit Game clicked in Standalone Mode. No actual exit occurs.')
                if (statusEl) {
                    statusEl.textContent = 'Exited [Standalone Mode]'
                    statusEl.classList.add('exited')
                }
                if (newButtonEl) {
                    newButtonEl.disabled = true
                }
            }
        })
    }
}

function updateUIToError(error, statusEl, buttonEl) {
    console.error('[Main] Failed to initialize Playcademy SDK:', error)
    if (statusEl) {
        statusEl.textContent = `Error initializing Cademy: ${error instanceof Error ? error.message : String(error)}`
        statusEl.classList.remove('rainbow')
        statusEl.classList.add('error')
    }
    if (buttonEl) {
        buttonEl.disabled = true
    }
}
