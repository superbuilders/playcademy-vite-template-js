import './style.css'
import './src/rainbow-status.css'
import { initializeCademy } from './src/playcademy-init'
import viteLogo from '/vite.svg'
import javascriptLogo from '/javascript.svg'

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

const statusTextElement = document.querySelector('.status-text')
const exitButtonElement = document.querySelector('#exitButton')

if (!statusTextElement || !exitButtonElement) {
    console.error('Failed to find essential UI elements!')
} else {
    initializeCademy()
        .then(client => {
            console.log('Cademy Client Initialized:', client)
            statusTextElement.textContent = 'Playcademy SDK Initialized!'
            exitButtonElement.disabled = false

            // Add exit button functionality
            exitButtonElement.addEventListener('click', () => {
                if (window.self !== window.top) {
                    console.log(
                        '[PlaycademyInit] Attempting to exit via client.runtime.exit()...',
                    )
                    client.runtime.exit() // This works in the iframe
                } else {
                    // Provide feedback for standalone mode
                    console.warn(
                        '[PlaycademyInit] Exit Game clicked in Standalone Mode. No actual exit occurs.',
                    )
                    statusTextElement.textContent = 'Exited (Standalone Mode)'
                    statusTextElement.classList.add('exited')
                    exitButtonElement.disabled = true
                }
            })

            // Example: Get user data
            client.users
                .me()
                .then(user => {
                    console.log('User:', user)
                    // You might want to update the UI with the username
                })
                .catch(err => {
                    console.error('Failed to get user:', err)
                })
        })
        .catch(error => {
            console.error('Failed to initialize Cademy Client:', error)
            statusTextElement.textContent = `Error initializing Cademy: ${error instanceof Error ? error.message : String(error)}`
            statusTextElement.classList.remove('rainbow')
            statusTextElement.classList.add('error')
            exitButtonElement.disabled = true
        })
}
