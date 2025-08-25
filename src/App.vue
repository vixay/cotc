<template>
  <div id="app" class="container">
    <AppHeader />
    <router-view />
    <Teleport to="body">
      <CharacterModal />
    </Teleport>
    
  </div>
</template>

<script>
import { computed } from 'vue'
import { useCharacterStore } from './stores/character'
import AppHeader from './components/AppHeader.vue'
import CharacterModal from './components/CharacterModal.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    CharacterModal
  },
  setup() {
    const characterStore = useCharacterStore()
    
    const showAdvancedFilters = computed(() => characterStore.ui.showAdvancedFilters)
    
    // Initialize theme from localStorage on app start
    const initializeTheme = () => {
      const savedTheme = localStorage.getItem('theme') || 'dark'
      console.log('🎨 Initializing theme:', savedTheme)
      
      // Apply both our custom theme classes AND PrimeVue's expected classes
      if (savedTheme === 'dark') {
        document.body.className = 'dark-theme p-dark'
        document.documentElement.classList.add('p-dark')
      } else {
        document.body.className = 'light-theme'
        document.documentElement.classList.remove('p-dark')
      }
      
      console.log('🎨 Current body class after setting:', document.body.className)
      console.log('🎨 Document element classes:', document.documentElement.classList.toString())
    }
    
    // Load character data on app start
    characterStore.loadCharacters()
    
    // Initialize theme - ensure it runs after DOM is ready
    setTimeout(() => {
      initializeTheme()
    }, 0)
    
    return {
      showAdvancedFilters
    }
  }
}
</script>

<style>
/* Import existing CSS files - all theme-related CSS */
@import url('../css/style.css');
@import url('../css/advanced-filters.css');
@import url('../css/source-attribution.css');
@import url('../css/character-card-tags.css');
@import url('../css/tag-search.css');
@import url('../css/view-system.css');
</style>