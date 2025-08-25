import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { characterNamesDirective } from './directives/characterNames'

// PrimeVue imports
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'

// CSS imports
import 'vue-select/dist/vue-select.css'
import 'primeicons/primeicons.css'
import './assets/css/ui-components.css'

console.log('🚀 Starting Vue app initialization...')

// Mark that user has accessed Vue version for better back navigation
localStorage.setItem('vue-migration-seen', 'true')

try {
  // Create the Vue app
  console.log('📦 Creating Vue app...')
  const app = createApp(App)
  
  // Create and use Pinia store
  console.log('🏪 Setting up Pinia store...')
  const pinia = createPinia()
  app.use(pinia)
  
  // Setup PrimeVue
  console.log('🎨 Setting up PrimeVue...')
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        prefix: 'p',
        darkModeSelector: '.p-dark',
        cssLayer: false
      }
    }
  })
  app.use(ToastService)
  app.directive('tooltip', Tooltip)
  
  // Setup router
  console.log('🗺️ Setting up Vue Router...')
  app.use(router)
  
  // Register global directives
  console.log('📝 Registering global directives...')
  app.directive('character-names', characterNamesDirective)
  
  // Mount the app
  console.log('🎯 Mounting app to #app...')
  const mountedApp = app.mount('#app')
  console.log('✅ Vue app mounted successfully!', mountedApp)
  
} catch (error) {
  console.error('❌ Failed to initialize Vue app:', error)
  
  // Show error in DOM
  const appElement = document.getElementById('app')
  if (appElement) {
    appElement.innerHTML = `
      <div style="padding: 20px; background: #dc3545; color: white; text-align: center;">
        <h2>Vue App Error</h2>
        <p>Failed to initialize the application:</p>
        <pre style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px; margin: 10px 0; text-align: left;">${error.message}</pre>
        <p>Check the console for more details.</p>
      </div>
    `
  }
}