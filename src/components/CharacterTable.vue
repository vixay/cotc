<template>
  <div>
    <div class="table-container" ref="tableContainer">
      <table 
        id="characterTable" 
        :class="tableClasses"
      >
      <thead>
        <tr>
          <!-- Core Group (always visible) -->
          <th 
            @click="sort('name')" 
            class="sortable always-visible"
            :class="getSortClass('name')"
          >
            Character <span class="sort-indicator">{{ getSortIndicator('name') }}</span>
          </th>
          <th 
            @click="sort('job')" 
            class="sortable column-group-core filterable compact-header"
            :class="getSortClass('job')"
          >
            Job <span class="sort-indicator">{{ getSortIndicator('job') }}</span>
          </th>
          <th 
            @click="sort('starRating')" 
            class="sortable column-group-core filterable compact-header"
            :class="getSortClass('starRating')"
          >
            ⭐ <span class="sort-indicator">{{ getSortIndicator('starRating') }}</span>
          </th>
          <th class="column-group-core filterable compact-header">Roles</th>
          <th class="column-group-core filterable compact-header">Tags</th>
          
          <!-- Ownership Group -->
          <th class="ownership-header column-group-ownership compact-header">Own</th>
          <th class="column-group-ownership compact-header">A-Lv</th>
          <th class="column-group-ownership compact-header">U-Lv</th>
          
          <!-- Tiers Group -->
          <th 
            @click="sort('overallTier')" 
            class="sortable column-group-tiers filterable compact-header"
            :class="getSortClass('overallTier')"
          >
            Overall <span class="sort-indicator">{{ getSortIndicator('overallTier') }}</span>
          </th>
          <th 
            @click="sort('a4Priority')" 
            class="sortable column-group-tiers filterable compact-header"
            :class="getSortClass('a4Priority')"
          >
            A4 Priority <span class="sort-indicator">{{ getSortIndicator('a4Priority') }}</span>
          </th>
          <th 
            @click="sort('ultPriority')" 
            class="sortable column-group-tiers compact-header"
            :class="getSortClass('ultPriority')"
          >
            Ult Priority <span class="sort-indicator">{{ getSortIndicator('ultPriority') }}</span>
          </th>
          
          <!-- Awakening Stones -->
          <th class="column-group-awakening">AS1</th>
          <th class="column-group-awakening">AS2</th>
          <th class="column-group-awakening">AS3</th>
          <th class="column-group-awakening">AS4</th>
          <th class="column-group-awakening">AS5</th>
          
          <!-- Combat Group -->
          <th class="column-group-combat filterable compact-header">Elements</th>
          <th class="column-group-combat filterable compact-header">Weapons</th>
          
          <!-- Acquisition Group -->
          <th 
            @click="sort('continent')" 
            class="sortable column-group-acquisition filterable compact-header"
            :class="getSortClass('continent')"
          >
            Region <span class="sort-indicator">{{ getSortIndicator('continent') }}</span>
          </th>
          <th 
            @click="sort('obtainedFrom')" 
            class="sortable column-group-acquisition filterable compact-header"
            :class="getSortClass('obtainedFrom')"
          >
            Source <span class="sort-indicator">{{ getSortIndicator('obtainedFrom') }}</span>
          </th>
          <th 
            @click="sort('glReleaseDate')" 
            class="sortable column-group-acquisition compact-header"
            :class="getSortClass('glReleaseDate')"
          >
            Release <span class="sort-indicator">{{ getSortIndicator('glReleaseDate') }}</span>
          </th>
          
          <!-- Notes -->
          <th 
            @click="sort('notes')" 
            class="sortable column-group-notes"
            :class="getSortClass('notes')"
          >
            Notes <span class="sort-indicator">{{ getSortIndicator('notes') }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="columnCount" class="loading">Loading character data...</td>
        </tr>
        <template v-else-if="groupedCharacters.length > 0">
          <template v-for="group in groupedCharacters" :key="group.name">
            <tr v-if="showGrouping" class="group-header">
              <td :colspan="columnCount" class="group-title">
                {{ group.name }} ({{ group.characters.length }})
              </td>
            </tr>
            <CharacterRow 
              v-for="character in group.characters" 
              :key="character.id"
              :character="character"
              :user-data="getUserData(character.id)"
              @update-ownership="updateOwnership"
              @open-modal="openModal"
            />
          </template>
        </template>
        <tr v-else>
          <td :colspan="columnCount" class="no-results">No characters match your filters</td>
        </tr>
      </tbody>
      </table>
    </div>
    
    <!-- Simple Floating Scrollbar -->
    <div 
      v-show="needsFloatingScrollbar" 
      class="floating-scrollbar"
      @scroll="onFloatingScroll"
      ref="floatingBar"
    >
      <div class="floating-content" :style="{ width: floatingContentWidth + 'px' }"></div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useCharacterStore } from '../stores/character'
import CharacterRow from './CharacterRow.vue'
import debug from '../utils/debug'

export default {
  name: 'CharacterTable',
  components: {
    CharacterRow
  },
  setup() {
    const characterStore = useCharacterStore()
    
    // Simple floating scrollbar refs
    const tableContainer = ref(null)
    const floatingBar = ref(null)
    const needsFloatingScrollbar = ref(false)
    const floatingContentWidth = ref(0)
    
    const loading = computed(() => characterStore.loading.characters)
    const filteredCharacters = computed(() => characterStore.filteredCharacters)
    const sortColumn = computed(() => characterStore.ui.sorting.column)
    const sortDirection = computed(() => characterStore.ui.sorting.direction)
    const showGrouping = computed(() => characterStore.ui.grouping.enabled)
    const columns = computed(() => characterStore.ui.columns)
    
    // Calculate column count for colspan
    const columnCount = computed(() => {
      let count = 1 // Name (always visible)
      if (columns.value.core) count += 3 // Job, stars, roles
      if (columns.value.ownership) count += 3 // Own, Awaken, Ult
      if (columns.value.tiers) count += 3 // Overall, A4 Priority, Ult Priority
      if (columns.value.awakening) count += 5 // AS1-AS5
      if (columns.value.combat) count += 2 // Elements, Weapons
      if (columns.value.acquisition) count += 3 // Region, Source, Release
      if (columns.value.notes) count += 1 // Notes
      return count
    })
    
    // Table CSS classes based on column visibility
    const tableClasses = computed(() => {
      const classes = []
      Object.keys(columns.value).forEach(key => {
        if (!columns.value[key]) {
          classes.push(`hide-${key}`)
        }
      })
      return classes.join(' ')
    })
    
    // Group characters if grouping is enabled
    const groupedCharacters = computed(() => {
      if (!showGrouping.value) {
        return [{ name: 'All Characters', characters: filteredCharacters.value }]
      }
      
      const groupBy = characterStore.ui.grouping.groupBy
      const groups = {}
      
      filteredCharacters.value.forEach(char => {
        let groupKey = 'Other'
        
        switch (groupBy) {
          case 'overallTier':
            groupKey = char.tierRatings?.gl?.tier || 'Not Rated'
            break
          case 'a4Tier':
            groupKey = char.a4Tier || 'Not Listed'
            break
          case 'ultPriority':
            groupKey = char.ultPriority || 'Not Set'
            break
          case 'job':
            groupKey = char.job || 'Unknown'
            break
          case 'continent':
            groupKey = char.continent || 'Unknown'
            break
          case 'isFree':
            groupKey = char.isFree ? 'Free Characters' : 'Gacha Characters'
            break
          default:
            groupKey = 'All Characters'
        }
        
        if (!groups[groupKey]) {
          groups[groupKey] = []
        }
        groups[groupKey].push(char)
      })
      
      // Convert to array and sort groups
      const groupArray = Object.entries(groups).map(([name, characters]) => ({
        name,
        characters
      }))
      
      // Sort groups by tier priority if grouping by tiers
      if (groupBy === 'overallTier' || groupBy === 'a4Tier') {
        const tierOrder = { 'S+': 0, 'S': 1, 'A': 2, 'B': 3, 'C': 4, 'D': 5, 'Not Listed': 6, 'Not Rated': 7 }
        groupArray.sort((a, b) => (tierOrder[a.name] ?? 99) - (tierOrder[b.name] ?? 99))
      } else {
        groupArray.sort((a, b) => a.name.localeCompare(b.name))
      }
      
      return groupArray
    })
    
    const getUserData = (characterId) => {
      return characterStore.userCharacterData[characterId] || {}
    }
    
    const updateOwnership = (characterId, ownedState, awakenLevel, ultLevel) => {
      characterStore.updateCharacterOwnership(characterId, ownedState, awakenLevel, ultLevel)
    }
    
    const openModal = (character, section = null) => {
      characterStore.openCharacterModal(character, section)
    }
    
    const sort = (column) => {
      characterStore.sortCharacters(column)
    }
    
    const getSortClass = (column) => {
      return sortColumn.value === column ? `sorted-${sortDirection.value}` : ''
    }
    
    const getSortIndicator = (column) => {
      if (sortColumn.value !== column) return ''
      return sortDirection.value === 'asc' ? '▲' : '▼'
    }
    
    // Simple floating scrollbar logic
    const updateFloatingScrollbar = () => {
      if (!tableContainer.value) return
      
      const hasHorizontalScroll = tableContainer.value.scrollWidth > tableContainer.value.clientWidth
      const rect = tableContainer.value.getBoundingClientRect()
      
      if (hasHorizontalScroll) {
        needsFloatingScrollbar.value = true
        floatingContentWidth.value = tableContainer.value.scrollWidth
        
        if (floatingBar.value) {
          floatingBar.value.style.width = `${tableContainer.value.clientWidth}px`
          floatingBar.value.style.left = `${rect.left}px`
          floatingBar.value.scrollLeft = tableContainer.value.scrollLeft
        }
      } else {
        needsFloatingScrollbar.value = false
      }
    }
    
    const onTableScroll = () => {
      if (floatingBar.value && tableContainer.value) {
        floatingBar.value.scrollLeft = tableContainer.value.scrollLeft
      }
    }
    
    const onFloatingScroll = () => {
      if (tableContainer.value && floatingBar.value) {
        tableContainer.value.scrollLeft = floatingBar.value.scrollLeft
      }
    }
    
    onMounted(() => {
      if (tableContainer.value) {
        tableContainer.value.addEventListener('scroll', onTableScroll)
        updateFloatingScrollbar()
      }
      
      window.addEventListener('resize', updateFloatingScrollbar)
      window.addEventListener('scroll', updateFloatingScrollbar)
      
      // Force update after a short delay to ensure everything is rendered
      setTimeout(updateFloatingScrollbar, 100)
    })
    
    onUnmounted(() => {
      if (tableContainer.value) {
        tableContainer.value.removeEventListener('scroll', onTableScroll)
      }
      window.removeEventListener('resize', updateFloatingScrollbar)
      window.removeEventListener('scroll', updateFloatingScrollbar)
    })
    
    return {
      loading,
      filteredCharacters,
      groupedCharacters,
      showGrouping,
      columns,
      columnCount,
      tableClasses,
      getUserData,
      updateOwnership,
      openModal,
      sort,
      getSortClass,
      getSortIndicator,
      // Floating scrollbar
      tableContainer,
      floatingBar,
      needsFloatingScrollbar,
      floatingContentWidth,
      onFloatingScroll
    }
  }
}
</script>

<style scoped>
/* Table container - ensure sticky headers work */
.table-container {
  overflow-x: auto;
  overflow-y: visible;
  border-radius: 10px;
  background: var(--bg-secondary);
  box-shadow: var(--shadow);
  /* Remove properties that can break sticky positioning */
  /* position: relative; */
  /* transform: none; */
  /* will-change: auto; */
  /* contain: none; */
  /* isolation: auto; */
}

/* Table styling */
table {
  min-width: 100%;
  width: max-content;
  border-collapse: collapse;
}

/* The issue: sticky doesn't work when parent has overflow-x: auto
   This creates a new scrolling context, making sticky relative to the container, not viewport.
   
   For now, disable sticky headers - they don't work with horizontal scrolling containers.
   We'd need a JavaScript solution for true floating headers. */
   
/* table :deep(thead) {
  position: sticky !important;
  top: 0 !important;
  z-index: 100 !important;
}

table :deep(th) {
  position: sticky !important;
  top: 0 !important;
  z-index: 101 !important;
  background: var(--primary-color) !important;
} */

/* Table container scrollbar theming */
.table-container::-webkit-scrollbar {
  height: 12px;
}

.table-container::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
  border: 1px solid var(--bg-secondary);
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

.table-container::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 4px;
}


/* Simple floating scrollbar */
.floating-scrollbar {
  position: fixed;
  bottom: 0;
  height: 16px;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  overflow-x: auto;
  overflow-y: hidden;
  border-radius: 4px 4px 0 0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3);
}

.floating-content {
  height: 1px;
  background: transparent;
}

/* Floating scrollbar styling - match global theme */
.floating-scrollbar::-webkit-scrollbar {
  height: 12px;
}

.floating-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
  border: 1px solid var(--bg-secondary);
}

.floating-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

.floating-scrollbar::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 4px;
}
</style>