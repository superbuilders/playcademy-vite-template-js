import { initFromWindow } from '@playcademy/sdk'

// --- Public ---

/**
 * Sets up the Playcademy environment by initializing the SDK.
 * Does NOT handle UI updates - that responsibility lies with the caller.
 * @returns {Promise<import('@playcademy/sdk').CademyClient>} A Promise that resolves with the initialized CademyClient instance.
 * @throws {Error} Throws an error if initialization fails.
 */
export async function setupPlaycademy() {
    // Simply awaits the internal initialization and returns the client
    // or propagates the error.
    return initializeCademyInternal()
}

// --- Private ---

/**
 * (Internal) Initializes the Playcademy SDK client.
 *
 * This function handles:
 * - Detecting if running inside the Playcademy Platform or standalone.
 * - Listening for the CADEMY_CONTEXT message when in an iframe.
 * - Setting up a mock context for local development when running standalone.
 * - Calling the core initFromWindow function from the SDK.
 *
 * @returns {Promise<import('@playcademy/sdk').CademyClient>} A Promise that resolves with the initialized CademyClient instance
 *          or rejects if initialization fails.
 */
function initializeCademyInternal() {
    return new Promise((resolve, reject) => {
        if (window.self !== window.top) {
            // --- IFRAME MODE (Running inside Playcademy Platform) ---
            console.log(
                '[PlaycademyInit] Running in iframe mode, waiting for CADEMY_CONTEXT...',
            )
            let contextReceived = false
            const timeoutDuration = 5000

            const handleMessage = event => {
                if (event.data?.type === 'CADEMY_CONTEXT') {
                    console.log(
                        '[PlaycademyInit] Received CADEMY_CONTEXT:',
                        event.data.payload,
                    )
                    contextReceived = true
                    window.removeEventListener('message', handleMessage)
                    clearTimeout(timeoutId)

                    window.CADEMY = event.data.payload

                    initFromWindow()
                        .then(client => {
                            console.log(
                                '[PlaycademyInit] SDK initialized successfully in iframe mode.',
                            )
                            resolve(client)
                        })
                        .catch(err => {
                            console.error(
                                '[PlaycademyInit] SDK initialization failed in iframe mode:',
                                err,
                            )
                            reject(err)
                        })
                }
            }

            window.addEventListener('message', handleMessage)

            const timeoutId = setTimeout(() => {
                if (!contextReceived) {
                    window.removeEventListener('message', handleMessage)
                    console.warn(
                        `[PlaycademyInit] CADEMY_CONTEXT not received within ${timeoutDuration}ms.`,
                    )
                    reject(
                        new Error(
                            'CADEMY_CONTEXT not received within timeout.',
                        ),
                    )
                }
            }, timeoutDuration)
        } else {
            // --- STANDALONE MODE (Local Development) ---
            console.log(
                '[PlaycademyInit] Running in standalone mode, setting up mock context.',
            )

            const mockContext = {
                baseUrl: '/api',
                gameToken: 'mock-game-token-for-local-dev',
                gameId: 'mock-game-id-from-template',
            }

            window.CADEMY = mockContext

            setTimeout(() => {
                initFromWindow()
                    .then(client => {
                        console.log(
                            '[PlaycademyInit] SDK initialized successfully in standalone mode (mock).',
                        )
                        resolve(client)
                    })
                    .catch(err => {
                        console.error(
                            '[PlaycademyInit] SDK initialization failed in standalone mode (mock):',
                            err,
                        )
                        reject(err)
                    })
            }, 500)
        }
    })
}
