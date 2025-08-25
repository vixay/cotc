<template>
  <header>
    <!-- Title and Metadata Row -->
    <div class="header-top">
      <h1>OCTOPATH COTC META GUIDE</h1>
      <div class="header-meta">
        <a :href="versionLink" class="version" target="_blank" rel="noopener">{{ version }}</a>
        <a href="https://github.com/vixay/cotc" class="github-link" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          Contribute
        </a>
      </div>
    </div>
    
    <!-- Navigation Row -->
    <div class="header-nav">
      <nav class="main-navigation">
        <router-link :to="{ name: 'Home' }" class="nav-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
          </svg>
          Home
        </router-link>
        <router-link :to="{ name: 'SearchAll' }" class="nav-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5,12C18,12 20,14 20,16.5C20,17.38 19.75,18.21 19.31,18.9L22.39,22L21,23.39L17.88,20.32C17.19,20.75 16.37,21 15.5,21C13,21 11,19 11,16.5C11,14 13,12 15.5,12M15.5,14A2.5,2.5 0 0,0 13,16.5A2.5,2.5 0 0,0 15.5,19A2.5,2.5 0 0,0 18,16.5A2.5,2.5 0 0,0 15.5,14M6.5,2C8.89,2 10.56,3.58 10.83,5.75C11.39,5.27 12.09,5 12.83,5C13.74,5 14.56,5.35 15.13,5.96C16.38,7.14 16.38,9.13 15.13,10.31C14.56,10.92 13.74,11.27 12.83,11.27C12.09,11.27 11.39,11 10.83,10.52C10.56,12.69 8.89,14.27 6.5,14.27C3.89,14.27 1.77,12.15 1.77,9.54C1.77,6.93 3.89,4.81 6.5,4.81C6.5,3.26 6.5,2 6.5,2M6.5,6.81C4.29,6.81 2.5,8.6 2.5,10.81C2.5,13.02 4.29,14.81 6.5,14.81C8.71,14.81 10.5,13.02 10.5,10.81C10.5,8.6 8.71,6.81 6.5,6.81Z"/>
          </svg>
          Search All
        </router-link>
        <router-link :to="{ name: 'Skills' }" class="nav-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
          </svg>
          Skills
        </router-link>
        <router-link :to="{ name: 'Accessories' }" class="nav-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2C12.74,2 13.4,2.31 13.85,2.85L14.15,3.15C14.6,3.6 15.26,3.91 16,3.91H16.5C17.88,3.91 19,5.03 19,6.41V6.91C19,7.65 19.31,8.31 19.85,8.85L20.15,9.15C20.69,9.6 21,10.26 21,11S20.69,12.4 20.15,12.85L19.85,13.15C19.4,13.6 19,14.26 19,15V15.5C19,16.88 17.88,18 16.5,18H16C15.26,18 14.6,18.31 14.15,18.85L13.85,19.15C13.4,19.69 12.74,20 12,20S10.6,19.69 10.15,19.15L9.85,18.85C9.4,18.4 8.74,18 8,18H7.5C6.12,18 5,16.88 5,15.5V15C5,14.26 4.69,13.6 4.15,13.15L3.85,12.85C3.31,12.4 3,11.74 3,11S3.31,9.6 3.85,9.15L4.15,8.85C4.6,8.4 5,7.74 5,7V6.5C5,5.12 6.12,4 7.5,4H8C8.74,4 9.4,3.69 9.85,3.15L10.15,2.85C10.6,2.31 11.26,2 12,2M12,8A3,3 0 0,0 9,11A3,3 0 0,0 12,14A3,3 0 0,0 15,11A3,3 0 0,0 12,8Z"/>
          </svg>
          Accessories
        </router-link>
        <router-link :to="{ name: 'Credits' }" class="nav-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M17,12L12,17L7,12L8.41,10.58L11,13.17V7H13V13.17L15.58,10.58L17,12Z"/>
          </svg>
          Credits
        </router-link>
        <a href="https://coff.ee/vixay" class="nav-link donation" target="_blank" rel="noopener">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2,21V19H20V21H2M20,8V5H18V8H20M20,3A2,2 0 0,1 22,5V8A2,2 0 0,1 20,10H18V13A4,4 0 0,1 14,17H8A4,4 0 0,1 4,13V3H6V13A2,2 0 0,0 8,15H14A2,2 0 0,0 16,13V3H20Z"/>
          </svg>
          Buy me a coffee
        </a>
      </nav>
    </div>
  </header>
</template>

<script>
import { useCharacterStore } from '../stores/character'

export default {
  name: 'AppHeader',
  data() {
    return {
      version: 'Loading...',
      lastUpdated: 'Loading...',
      versionLink: 'docs/CHANGELOG.md'
    }
  },
  setup() {
    const characterStore = useCharacterStore()
    return { characterStore }
  },
  mounted() {
    this.loadVersionInfo()
  },
  methods: {
    async loadVersionInfo() {
      try {
        // Vue version with character markdown modal support
        this.version = 'v3.0.0-vue'
        this.lastUpdated = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short', 
          day: 'numeric'
        })
      } catch (error) {
        console.warn('Failed to load version info:', error)
        this.version = 'v3.0.0-vue'
        this.lastUpdated = 'Unknown'
      }
    }
  }
}
</script>

<style scoped>
/* Two-row header: Title+meta on top, navigation on bottom */
header {
  position: sticky !important;
  top: 0 !important;
  z-index: 1000 !important;
  background: var(--bg-primary) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
}

.header-top {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 1rem !important;
  border-bottom: 1px solid var(--border-color) !important;
  max-width: 1400px !important;
  margin: 0 auto !important;
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}

.header-top h1 {
  color: var(--primary-color) !important;
  margin: 0 !important;
  font-size: 1.5rem !important;
  font-weight: 700 !important;
}

.header-meta {
  display: flex !important;
  align-items: center !important;
  gap: 1rem !important;
}

.version {
  color: var(--text-secondary) !important;
  font-size: 0.9rem !important;
  font-weight: 500 !important;
  text-decoration: none !important;
}

.github-link {
  color: var(--text-secondary) !important;
  text-decoration: none !important;
  font-size: 0.9rem !important;
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  transition: color 0.2s !important;
}

.github-link:hover {
  color: var(--primary-color) !important;
}

.header-nav {
  background: var(--bg-primary) !important;
  padding: 0 !important;
}

.main-navigation {
  display: flex !important;
  align-items: center !important;
  gap: 0 !important;
  max-width: 1400px !important;
  margin: 0 auto !important;
  padding: 0 !important;
  flex-wrap: nowrap !important;
}

.nav-link {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  padding: 16px 24px !important;
  color: var(--text-secondary) !important;
  text-decoration: none !important;
  font-weight: 500 !important;
  font-size: 1.1em !important;
  border-bottom: 3px solid transparent !important;
  transition: all 0.2s ease !important;
}

.nav-link:hover {
  color: var(--primary-color) !important;
  background: var(--bg-hover) !important;
}

.nav-link.router-link-active,
.nav-link.active {
  color: var(--primary-color) !important;
  border-bottom-color: var(--primary-color) !important;
}

.nav-link.donation {
  color: var(--warning-color) !important;
  margin-left: auto !important;
}

.nav-link.donation:hover {
  color: #ffa000 !important;
  background: rgba(255, 193, 7, 0.1) !important;
}

.nav-link svg {
  width: 20px !important;
  height: 20px !important;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .header-top {
    flex-direction: column !important;
    gap: 0.5rem !important;
    text-align: center !important;
  }

  .header-top h1 {
    font-size: 1.3rem !important;
  }

  .main-navigation {
    flex-wrap: wrap !important;
    justify-content: center !important;
  }

  .nav-link {
    padding: 12px 16px !important;
    font-size: 1rem !important;
  }

  .nav-link.donation {
    margin-left: 0 !important;
  }
}
</style>