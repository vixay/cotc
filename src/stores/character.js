import { defineStore } from 'pinia'
import { findMarkdownFile } from '../utils/markdownParser'
import debug from '../utils/debug'

export const useCharacterStore = defineStore('character', {
  state: () => ({
    // Character data
    characters: [],
    filteredCharacters: [],
    userCharacterData: {},
    
    // Filter state
    filters: {
      search: '',
      searchTerms: [], // Array of individual search terms/tags
      a4Tier: '',
      ultPriority: '',
      freeGacha: '',
      ownership: '',
      showUnreleased: false,
      // Multi-select filters
      starRating: [],
      job: [],
      roles: [],
      elements: [],
      weapons: [],
      continent: [],
      obtainedFrom: [],
      tierRating: [],
      a4PriorityMulti: [],
      ultPriorityMulti: [],
      freeGachaMulti: [],
      ownershipMulti: []
    },
    
    // UI state
    ui: {
      currentView: 'basic',
      showViews: true,
      showAdvancedFilters: false,
      theme: 'dark',
      sorting: {
        column: null,
        direction: 'asc'
      },
      grouping: {
        enabled: true,
        groupBy: 'overallTier'
      },
      columns: {
        core: true,
        tiers: true,
        ownership: false,
        awakening: false,
        combat: false,
        acquisition: false,
        notes: true
      },
      // UnifiedSearchPage preferences
      unifiedSearch: {
        pageSize: 25,
        selectedContentTypes: [],
        selectedCharacters: [],
        selectedSkillTypes: [],
        selectedAccessoryTypes: [],
        selectedTags: [],
        spCostRange: { min: null, max: null },
        searchMode: 'any'
      }
    },
    
    // Loading states
    loading: {
      characters: false,
      characterDetails: false
    },
    
    // Modal state
    modal: {
      isOpen: false,
      selectedCharacter: null,
      markdownContent: '',
      section: null
    }
  }),
  
  getters: {
    // Get released characters count
    releasedCharactersCount: (state) => {
      return state.characters.filter(char => {
        const releaseDate = char.glReleaseDate
        return releaseDate && new Date(releaseDate) <= new Date()
      }).length
    },
    
    // Get unreleased characters count
    unreleasedCharactersCount: (state) => {
      return state.characters.filter(char => {
        const releaseDate = char.glReleaseDate
        return !releaseDate || new Date(releaseDate) > new Date()
      }).length
    },
    
    // Get filtered characters count
    filteredCharactersCount: (state) => state.filteredCharacters.length,
    
    // Get available filter options
    availableJobs: (state) => {
      if (!state.characters || !Array.isArray(state.characters)) return []
      const jobs = [...new Set(state.characters.map(char => char.job).filter(Boolean))]
      return jobs.sort()
    },
    
    availableElements: (state) => {
      if (!state.characters || !Array.isArray(state.characters)) return []
      const elements = [...new Set(state.characters.flatMap(char => char.elements || []))]
      return elements.sort()
    },
    
    availableContinents: (state) => {
      if (!state.characters || !Array.isArray(state.characters)) return []
      const continents = [...new Set(state.characters.map(char => char.continent).filter(Boolean))]
      return continents.sort()
    },
    
    availableObtainedFrom: (state) => {
      if (!state.characters || !Array.isArray(state.characters)) return []
      const sources = [...new Set(state.characters.map(char => char.obtainedFrom).filter(Boolean))]
      return sources.sort()
    },
    
    availableWeapons: (state) => {
      if (!state.characters || !Array.isArray(state.characters)) return []
      const weapons = [...new Set(state.characters.flatMap(char => char.weapons || []))]
      return weapons.sort()
    },
    
    availableA4Priorities: (state) => {
      if (!state.characters || !Array.isArray(state.characters)) return []
      const priorities = [...new Set(state.characters.map(char => char.a4Priority).filter(Boolean))]
      return priorities.sort((a, b) => {
        const order = { 'essential': 0, 'good': 1, 'skip': 2 }
        return (order[a] ?? 99) - (order[b] ?? 99)
      })
    },
    
    availableUltPriorities: (state) => {
      if (!state.characters || !Array.isArray(state.characters)) return []
      const priorities = [...new Set(state.characters.map(char => char.ultPriority).filter(Boolean))]
      return priorities.sort()
    },

    // Get character by ID
    getCharacterById: (state) => (id) => {
      return state.characters.find(char => char.id === id)
    }
  },
  
  actions: {
    // Load character data
    async loadCharacters() {
      this.loading.characters = true
      
      try {
        const dataUrl = '/data/characters_enhanced_v3.json'
        const response = await fetch(dataUrl)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        this.characters = data.characters || []
        this.applyFilters()
        
        // Load user data from localStorage
        this.loadUserData()
        
      } catch (error) {
        console.error('Failed to load character data:', error)
      } finally {
        this.loading.characters = false
      }
    },
    
    // Apply all filters
    applyFilters() {
      const filters = this.filters
      
      this.filteredCharacters = this.characters.filter(char => {
        // Unreleased filter
        if (!filters.showUnreleased) {
          const releaseDate = char.glReleaseDate
          if (!releaseDate || new Date(releaseDate) > new Date()) {
            return false
          }
        }
        
        // Search filter (name + tags)
        if (filters.search || (filters.searchTerms && filters.searchTerms.length > 0)) {
          // Handle both regular search and tag-based search
          const searchTerms = []
          
          // Add regular search term if exists
          if (filters.search) {
            searchTerms.push(filters.search.toLowerCase())
          }
          
          // Add individual search terms if exists
          if (filters.searchTerms && filters.searchTerms.length > 0) {
            filters.searchTerms.forEach(term => {
              if (term && typeof term === 'string') {
                searchTerms.push(term.toLowerCase())
              }
            })
          }
          
          // Character must match ALL search terms (AND logic)
          const allTermsMatch = searchTerms.every(searchTerm => {
            // Handle character-specific tags (char:name)
            if (searchTerm.startsWith('char:')) {
              const charName = searchTerm.replace('char:', '')
              return char.name.toLowerCase().includes(charName)
            }
            
            // Regular search: check name and tags
            const nameMatch = char.name.toLowerCase().includes(searchTerm)
            const tagMatch = char.tags && char.tags.some(tag => 
              tag.toLowerCase().includes(searchTerm)
            )
            return nameMatch || tagMatch
          })
          
          if (!allTermsMatch) {
            return false
          }
        }
        
        // A4 tier filter (single)
        if (filters.a4Tier && (char.a4Tier || 'Not Listed') !== filters.a4Tier) {
          return false
        }
        
        // Ultimate priority filter
        if (filters.ultPriority && char.ultPriority !== filters.ultPriority) {
          return false
        }
        
        // Free/Gacha filter
        if (filters.freeGacha === 'free' && !char.isFree) return false
        if (filters.freeGacha === 'gacha' && char.isFree) return false
        
        // Ownership filter
        const userData = this.userCharacterData[char.id] || {}
        const isOwned = userData.owned || false
        if (filters.ownership === 'owned' && !isOwned) return false
        if (filters.ownership === 'not-owned' && isOwned) return false
        
        // Multi-select filters
        if (filters.starRating.length > 0 && !filters.starRating.includes(char.starRating?.toString())) {
          return false
        }
        
        if (filters.job.length > 0 && (!char.job || !filters.job.includes(char.job))) {
          return false
        }
        
        if (filters.roles.length > 0) {
          const hasRole = (char.roles?.primary && filters.roles.includes(char.roles.primary)) ||
                         (char.roles?.secondary && filters.roles.includes(char.roles.secondary))
          if (!hasRole) return false
        }
        
        if (filters.elements.length > 0) {
          if (!char.elements || !char.elements.some(el => filters.elements.includes(el))) {
            return false
          }
        }
        
        if (filters.weapons.length > 0) {
          if (!char.weapons || !char.weapons.some(w => filters.weapons.includes(w))) {
            return false
          }
        }
        
        if (filters.continent.length > 0) {
          if (!char.continent || !filters.continent.includes(char.continent)) {
            return false
          }
        }
        
        if (filters.obtainedFrom.length > 0) {
          if (!char.obtainedFrom) {
            return false
          }
          
          // Support both exact matches and partial text searches
          const sourceMatches = filters.obtainedFrom.some(filterSource => {
            // Exact match for dropdown selections
            if (char.obtainedFrom === filterSource) {
              return true
            }
            // Partial match for free text input (case insensitive)
            return char.obtainedFrom.toLowerCase().includes(filterSource.toLowerCase())
          })
          
          if (!sourceMatches) {
            return false
          }
        }
        
        
        if (filters.tierRating.length > 0) {
          const overallTier = char.tierRatings?.gl?.tier
          if (!overallTier || !filters.tierRating.includes(overallTier)) {
            return false
          }
        }
        
        if (filters.a4PriorityMulti.length > 0) {
          if (!char.a4Priority || !filters.a4PriorityMulti.includes(char.a4Priority)) {
            return false
          }
        }
        
        if (filters.ultPriorityMulti.length > 0) {
          if (!char.ultPriority || !filters.ultPriorityMulti.includes(char.ultPriority)) {
            return false
          }
        }
        
        if (filters.freeGachaMulti.length > 0) {
          const isFreeMatch = filters.freeGachaMulti.includes('free') && char.isFree
          const isGachaMatch = filters.freeGachaMulti.includes('gacha') && !char.isFree
          if (!isFreeMatch && !isGachaMatch) {
            return false
          }
        }
        
        if (filters.ownershipMulti.length > 0) {
          const userData = this.userCharacterData[char.id] || {}
          const isOwned = userData.owned || false
          const isOwnedMatch = filters.ownershipMulti.includes('owned') && isOwned
          const isNotOwnedMatch = filters.ownershipMulti.includes('not-owned') && !isOwned
          if (!isOwnedMatch && !isNotOwnedMatch) {
            return false
          }
        }
        
        return true
      })
    },
    
    // Update filter
    updateFilter(filterName, value) {
      this.filters[filterName] = value
      this.applyFilters()
      this.saveUserData()
    },
    
    // Toggle multi-select filter value
    toggleMultiSelectFilter(filterName, value) {
      const currentValues = this.filters[filterName]
      const index = currentValues.indexOf(value)
      
      if (index === -1) {
        currentValues.push(value)
      } else {
        currentValues.splice(index, 1)
      }
      
      this.applyFilters()
      this.saveUserData()
    },
    
    // Reset all filters
    resetFilters() {
      this.filters = {
        search: '',
        searchTerms: [],
        a4Tier: '',
        ultPriority: '',
        freeGacha: '',
        ownership: '',
        showUnreleased: false,
        starRating: [],
        job: [],
        roles: [],
        elements: [],
        weapons: [],
        continent: [],
        obtainedFrom: [],
        obtainedFromSearch: '',
        tierRating: [],
        a4PriorityMulti: [],
        ultPriorityMulti: [],
        freeGachaMulti: [],
        ownershipMulti: []
      }
      this.applyFilters()
      this.saveUserData()
    },
    
    // Update UI state
    updateUI(key, value) {
      const keys = key.split('.')
      let current = this.ui
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      this.saveUserData()
    },
    
    // Toggle column visibility
    toggleColumn(columnKey) {
      this.ui.columns[columnKey] = !this.ui.columns[columnKey]
      this.saveUserData()
    },
    
    // Update character ownership
    updateCharacterOwnership(characterId, ownedState, awakenLevel = null, ultLevel = null) {
      if (!this.userCharacterData[characterId]) {
        this.userCharacterData[characterId] = {}
      }
      
      const userData = this.userCharacterData[characterId]
      userData.owned = ownedState
      
      if (awakenLevel !== null) userData.awakenLevel = awakenLevel
      if (ultLevel !== null) userData.ultLevel = ultLevel
      
      this.saveUserData()
      this.applyFilters() // Re-apply filters to handle ownership filter
    },
    
    // Sort characters
    sortCharacters(column, direction = null) {
      if (!direction) {
        // Toggle direction if same column, otherwise default to asc
        direction = this.ui.sorting.column === column && this.ui.sorting.direction === 'asc' 
          ? 'desc' : 'asc'
      }
      
      this.ui.sorting.column = column
      this.ui.sorting.direction = direction
      
      this.filteredCharacters.sort((a, b) => {
        let aVal = a[column]
        let bVal = b[column]
        
        // Handle nested properties
        if (column === 'overallTier') {
          aVal = a.tierRatings?.gl?.tier || 'Z'
          bVal = b.tierRatings?.gl?.tier || 'Z'
        }
        
        // Handle A4 priority sorting
        if (column === 'a4Priority') {
          const priorityOrder = { 'essential': 0, 'good': 1, 'skip': 2 }
          aVal = priorityOrder[a.a4Priority] ?? 99
          bVal = priorityOrder[b.a4Priority] ?? 99
        }
        
        // Handle tier sorting (S+ > S > A > B > C > D)
        if (column === 'overallTier') {
          const tierOrder = { 'S+': 0, 'S': 1, 'A': 2, 'B': 3, 'C': 4, 'D': 5, 'Not Listed': 6, 'Z': 7 }
          aVal = tierOrder[aVal] ?? 99
          bVal = tierOrder[bVal] ?? 99
        }
        
        // Handle dates
        if (column === 'glReleaseDate') {
          aVal = aVal ? new Date(aVal) : new Date('9999-12-31')
          bVal = bVal ? new Date(bVal) : new Date('9999-12-31')
        }
        
        // Handle null/undefined values
        if (aVal == null) aVal = ''
        if (bVal == null) bVal = ''
        
        // Numeric comparison
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return direction === 'asc' ? aVal - bVal : bVal - aVal
        }
        
        // String comparison
        const comparison = aVal.toString().localeCompare(bVal.toString())
        return direction === 'asc' ? comparison : -comparison
      })
      
      this.saveUserData()
    },
    
    // Open character modal
    openCharacterModal(character, section = null) {
      this.modal.selectedCharacter = character
      this.modal.section = section
      this.modal.isOpen = true
      this.modal.markdownContent = '' // Clear previous content
      this.loading.characterDetails = true

      // Fetch and process markdown content
      findMarkdownFile(character)
        .then(markdownPath => {
          if (markdownPath) {
            return fetch(markdownPath).then(res => {
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
              return res.text()
            })
          } else {
            return '# No detailed markdown found for this character.'
          }
        })
        .then(markdown => {
          this.modal.markdownContent = markdown
        })
        .catch(error => {
          console.error('Failed to load markdown for modal:', error)
          this.modal.markdownContent = '# Error loading details.'
        })
        .finally(() => {
          this.loading.characterDetails = false
        })
    },
    
    // Close character modal
    closeCharacterModal() {
      this.modal.isOpen = false
      this.modal.selectedCharacter = null
      this.modal.section = null
    },
    
    // Save user data to localStorage
    saveUserData() {
      try {
        const userData = {
          filters: this.filters,
          ui: this.ui,
          userCharacterData: this.userCharacterData
        }
        localStorage.setItem('cotc-vue-data', JSON.stringify(userData))
      } catch (error) {
        console.warn('Failed to save user data:', error)
      }
    },
    
    // Load user data from localStorage
    loadUserData() {
      try {
        const saved = localStorage.getItem('cotc-vue-data')
        if (saved) {
          const userData = JSON.parse(saved)
          
          // Merge saved data with current state
          if (userData.filters) {
            Object.assign(this.filters, userData.filters)
          }
          if (userData.ui) {
            Object.assign(this.ui, userData.ui)
          }
          if (userData.userCharacterData) {
            this.userCharacterData = userData.userCharacterData
          }
          
          // Apply filters after loading them from storage
          this.applyFilters()
        }
      } catch (error) {
        console.warn('Failed to load user data:', error)
      }
    },

    // Load accessories data - placeholder for unified search
    async loadAccessories() {
      // Accessories are embedded in character data for v2/v3 database
      // This method is for compatibility with UnifiedSearchPage
      return Promise.resolve()
    }
  }
})