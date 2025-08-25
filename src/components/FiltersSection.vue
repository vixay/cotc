<template>
  <div class="table-controls-section">
    <!-- Quick Search & Options -->
    <div class="search-controls-row">
      <div class="search-section">
        <ProvenTagsInput 
          @update-search="updateSearch"
          placeholder="Search characters or tags..."
        />
      </div>
      <div class="options-section">
        <label class="compact-checkbox">
          <input 
            type="checkbox" 
            :checked="showUnreleased"
            @change="toggleShowUnreleased"
          > 
          Show Unreleased
        </label>
        

        <button @click="toggleTheme" class="theme-btn" title="Toggle theme">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
          </svg>
        </button>

        <label class="compact-checkbox">
          <input 
            type="checkbox" 
            :checked="groupingEnabled"
            @change="toggleGrouping"
          > 
          Group By Tier
        </label>

        <!-- Export CSV - Hidden until functionality is implemented -->
        <!-- 
        <button @click="exportCSV" class="export-btn" title="Export filtered data as CSV">
          📊 Export CSV
        </button>
        -->
      </div>
    </div>

    <!-- Views Section (Collapsible) -->
    <div class="views-section" :class="{ collapsed: !showViews }">
      <div class="section-header" @click="toggleViews">
        <span class="collapse-icon">{{ showViews ? '▼' : '▶' }}</span>
        <h4>📋 Views</h4>
      </div>
      <div v-if="showViews" class="views-content">
        <div class="quick-views">
          <label>Quick Views:</label>
          <div class="view-buttons">
            <button 
              @click="setColumnPreset('minimal')"
              class="view-preset-btn"
              :class="{ active: isPresetActive('minimal') }"
              title="Show only character names"
            >
              📝 Name Only
            </button>
            <button 
              @click="setColumnPreset('basic')"
              class="view-preset-btn"
              :class="{ active: isPresetActive('basic') }"
              title="Core info: Name, Job, Stars, Tiers"
            >
              🎯 Basic Info
            </button>
            <button 
              @click="setColumnPreset('details')"
              class="view-preset-btn"
              :class="{ active: isPresetActive('details') }"
              title="All info except ownership and awakening levels"
            >
              📋 Details
            </button>
            <button 
              @click="setColumnPreset('complete')"
              class="view-preset-btn"
              :class="{ active: isPresetActive('complete') }"
              title="Show all available columns"
            >
              📊 Complete View
            </button>
          </div>
        </div>
        
        <div class="column-sets">
          <label>Column Sets:</label>
          <div class="column-toggles-horizontal">
            <button 
              @click="toggleColumn('core')"
              class="column-toggle"
              :class="{ active: columns.core }"
              title="Job, Stars, Roles"
            >
              <span class="toggle-icon">{{ columns.core ? '✓' : '−' }}</span>
              🎯 Core
            </button>
            <button 
              @click="toggleColumn('tiers')"
              class="column-toggle"
              :class="{ active: columns.tiers }"
              title="Overall Tier, A4 Priority, Ult Priority"
            >
              <span class="toggle-icon">{{ columns.tiers ? '✓' : '−' }}</span>
              🏆 Tiers
            </button>
            <button 
              @click="toggleColumn('ownership')"
              class="column-toggle"
              :class="{ active: columns.ownership }"
              title="Own, Awaken Level, Ultimate Level"
            >
              <span class="toggle-icon">{{ columns.ownership ? '✓' : '−' }}</span>
              👤 Ownership
            </button>
            <button 
              @click="toggleColumn('awakening')"
              class="column-toggle"
              :class="{ active: columns.awakening }"
              title="AS1, AS2, AS3, AS4, AS5"
            >
              <span class="toggle-icon">{{ columns.awakening ? '✓' : '−' }}</span>
              ⭐ Awakening
            </button>
            <button 
              @click="toggleColumn('combat')"
              class="column-toggle"
              :class="{ active: columns.combat }"
              title="Elements, Weapons"
            >
              <span class="toggle-icon">{{ columns.combat ? '✓' : '−' }}</span>
              ⚔️ Combat
            </button>
            <button 
              @click="toggleColumn('acquisition')"
              class="column-toggle"
              :class="{ active: columns.acquisition }"
              title="Region, Source, Release Date"
            >
              <span class="toggle-icon">{{ columns.acquisition ? '✓' : '−' }}</span>
              🌍 Acquisition
            </button>
            <button 
              @click="toggleColumn('notes')"
              class="column-toggle"
              :class="{ active: columns.notes }"
              title="Notes"
            >
              <span class="toggle-icon">{{ columns.notes ? '✓' : '−' }}</span>
              📝 Notes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Section (Collapsible) -->
    <div class="advanced-filters-section" :class="{ collapsed: !showAdvancedFilters }">
      <div class="section-header" @click="toggleAdvancedFilters">
        <span class="collapse-icon">{{ showAdvancedFilters ? '▼' : '▶' }}</span>
        <h4>🔍 Filters</h4>
      </div>
      <div v-if="showAdvancedFilters" class="filters-content">
        <!-- Vue Select Filter Dropdowns -->
        <div class="vue-select-filters-row" ref="filtersContainer">
          <!-- Job Filter -->
          <VueSelect
            v-if="columns.core"
            v-model="jobFilter"
            :options="availableJobs"
            placeholder="All Jobs"
            multiple
            :close-on-select="false"
            class="filter-select"
            data-filter-id="job"
            :key="'job-' + (availableJobs?.length || 0)"
          />

          <!-- Stars Filter -->
          <VueSelect
            v-if="columns.core"
            v-model="starRatingFilter"
            :options="['3', '4', '5']"
            placeholder="All Stars"
            multiple
            :close-on-select="false"
            class="filter-select"
            data-filter-id="stars"
            key="stars-3"
          />

          <!-- Ownership Filter -->
          <VueSelect
            v-if="columns.ownership"
            v-model="ownershipFilter"
            :options="['owned', 'not-owned']"
            placeholder="All Ownership"
            multiple
            :close-on-select="false"
            class="filter-select"
            data-filter-id="ownership"
            key="ownership-2"
          />

          <!-- Overall Tier Filter -->
          <VueSelect
            v-if="columns.tiers"
            v-model="overallTierFilter"
            :options="['S+', 'S', 'A', 'B', 'C', 'D']"
            placeholder="All Tiers"
            multiple
            :close-on-select="false"
            class="filter-select"
            data-filter-id="overall-tier"
            key="overall-tier-6"
          />

          <!-- A4 Priority Filter -->
          <VueSelect
            v-if="columns.tiers"
            v-model="a4PriorityFilter"
            :options="a4PriorityDisplayOptions"
            placeholder="All A4"
            multiple
            :close-on-select="false"
            class="filter-select"
            label="label"
            :reduce="option => option.value"
            data-filter-id="a4-priority"
            :key="'a4-priority-' + (a4PriorityDisplayOptions?.length || 0)"
          />

          <!-- Ult Priority Filter -->
          <VueSelect
            v-if="columns.tiers"
            v-model="ultPriorityFilter"
            :options="ultPriorityDisplayOptions"
            placeholder="All Ult"
            multiple
            :close-on-select="false"
            class="filter-select"
            label="label"
            :reduce="option => option.value"
            data-filter-id="ult-priority"
            :key="'ult-priority-' + (ultPriorityDisplayOptions?.length || 0)"
          />

          <!-- Elements Filter -->
          <VueSelect
            v-if="columns.combat"
            v-model="elementFilter"
            :options="availableElements"
            placeholder="All Elements"
            multiple
            :close-on-select="false"
            class="filter-select"
            data-filter-id="elements"
            :key="'elements-' + (availableElements?.length || 0)"
          />

          <!-- Weapons Filter -->
          <VueSelect
            v-if="columns.combat"
            v-model="weaponFilter"
            :options="availableWeapons"
            placeholder="All Weapons"
            multiple
            :close-on-select="false"
            class="filter-select"
            data-filter-id="weapons"
            :key="'weapons-' + (availableWeapons?.length || 0)"
          />

          <!-- Region Filter -->
          <VueSelect
            v-if="columns.acquisition"
            v-model="continentFilter"
            :options="availableContinents"
            placeholder="All Regions"
            multiple
            :close-on-select="false"
            class="filter-select"
            data-filter-id="regions"
            :key="'regions-' + (availableContinents?.length || 0)"
          />

          <!-- Source Filter -->
          <VueSelect
            v-if="columns.acquisition"
            v-model="sourceFilter"
            :options="availableObtainedFrom"
            placeholder="Search sources..."
            multiple
            :close-on-select="false"
            taggable
            :push-tags="false"
            @tag="addSourceTag"
            class="filter-select source-filter"
            data-filter-id="sources"
            :key="'sources-' + (availableObtainedFrom?.length || 0)"
          />

          <!-- Clear Filters Button -->
          <button @click="clearAllFilters" class="clear-filters-compact">
            Clear All
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useCharacterStore } from '../stores/character'
import VueSelect from 'vue-select'
import ProvenTagsInput from './ProvenTagsInput.vue'

export default {
  name: 'FiltersSection',
  components: {
    VueSelect,
    ProvenTagsInput
  },
  setup() {
    const characterStore = useCharacterStore()
    
    // UI state - sync with store
    const showViews = computed({
      get: () => characterStore.ui.showViews,
      set: (value) => characterStore.updateUI('showViews', value)
    })
    const showAdvancedFilters = computed({
      get: () => characterStore.ui.showAdvancedFilters,
      set: (value) => characterStore.updateUI('showAdvancedFilters', value)
    })
    
    // Filter state - reactive arrays for Vue Select
    const jobFilter = computed({
      get: () => characterStore.filters.job,
      set: (value) => characterStore.updateFilter('job', value)
    })
    const starRatingFilter = computed({
      get: () => characterStore.filters.starRating,
      set: (value) => characterStore.updateFilter('starRating', value)
    })
    const ownershipFilter = computed({
      get: () => characterStore.filters.ownershipMulti,
      set: (value) => characterStore.updateFilter('ownershipMulti', value)
    })
    const overallTierFilter = computed({
      get: () => characterStore.filters.tierRating,
      set: (value) => characterStore.updateFilter('tierRating', value)
    })
    const a4PriorityFilter = computed({
      get: () => characterStore.filters.a4PriorityMulti,
      set: (value) => characterStore.updateFilter('a4PriorityMulti', value)
    })
    const ultPriorityFilter = computed({
      get: () => characterStore.filters.ultPriorityMulti,
      set: (value) => characterStore.updateFilter('ultPriorityMulti', value)
    })
    const elementFilter = computed({
      get: () => characterStore.filters.elements,
      set: (value) => characterStore.updateFilter('elements', value)
    })
    const weaponFilter = computed({
      get: () => characterStore.filters.weapons,
      set: (value) => characterStore.updateFilter('weapons', value)
    })
    const continentFilter = computed({
      get: () => characterStore.filters.continent,
      set: (value) => characterStore.updateFilter('continent', value)
    })
    const sourceFilter = computed({
      get: () => characterStore.filters.obtainedFrom,
      set: (value) => characterStore.updateFilter('obtainedFrom', value)
    })
    
    
    // Computed properties
    const searchValue = computed({
      get: () => characterStore.filters.search,
      set: (value) => characterStore.updateFilter('search', value)
    })
    
    const columns = computed(() => characterStore.ui.columns)
    const showUnreleased = computed(() => characterStore.filters.showUnreleased)
    const groupingEnabled = computed(() => characterStore.ui.grouping.enabled)
    
    // Available options
    const availableJobs = computed(() => characterStore.availableJobs)
    const availableElements = computed(() => characterStore.availableElements)
    const availableWeapons = computed(() => characterStore.availableWeapons)
    const availableContinents = computed(() => characterStore.availableContinents)
    const availableObtainedFrom = computed(() => characterStore.availableObtainedFrom)
    const availableA4Priorities = computed(() => characterStore.availableA4Priorities)
    const availableUltPriorities = computed(() => characterStore.availableUltPriorities)
    
    // Display options with formatting (object structure for VueSelect)
    const a4PriorityDisplayOptions = computed(() => {
      const priorities = characterStore.availableA4Priorities || []
      return priorities.map(priority => ({
        label: formatA4PriorityDisplay(priority),
        value: priority
      }))
    })
    
    const ultPriorityDisplayOptions = computed(() => {
      const priorities = characterStore.availableUltPriorities || []
      return priorities.map(priority => ({
        label: formatUltPriorityDisplay(priority),
        value: priority
      }))
    })
    
    // Methods
    const updateSearch = (searchData) => {
      // Handle TagSearch component data: { terms: [], query: '' }
      if (searchData && typeof searchData === 'object') {
        characterStore.updateFilter('search', searchData.query)
        // Store search terms for advanced filtering if needed
        characterStore.updateFilter('searchTerms', searchData.terms)
      } else {
        // Handle simple string input (fallback)
        characterStore.updateFilter('search', searchData || '')
      }
    }
    
    const toggleViews = () => {
      const newValue = !showViews.value
      showViews.value = newValue
      characterStore.updateUI('showViews', newValue)
    }
    
    const toggleAdvancedFilters = () => {
      const newValue = !showAdvancedFilters.value
      showAdvancedFilters.value = newValue
      characterStore.updateUI('showAdvancedFilters', newValue)
    }
    
    
    const setColumnPreset = (preset) => {
      const presets = {
        minimal: { core: false, tiers: false, ownership: false, awakening: false, combat: false, acquisition: false, notes: false },
        basic: { core: true, tiers: true, ownership: false, awakening: false, combat: false, acquisition: false, notes: true },
        details: { core: true, tiers: true, ownership: false, awakening: false, combat: true, acquisition: true, notes: true },
        complete: { core: true, tiers: true, ownership: true, awakening: true, combat: true, acquisition: true, notes: true }
      }
      
      Object.entries(presets[preset]).forEach(([key, value]) => {
        characterStore.updateUI(`columns.${key}`, value)
      })
    }
    
    const isPresetActive = (preset) => {
      const presets = {
        minimal: { core: false, tiers: false, ownership: false, awakening: false, combat: false, acquisition: false, notes: false },
        basic: { core: true, tiers: true, ownership: false, awakening: false, combat: false, acquisition: false, notes: true },
        details: { core: true, tiers: true, ownership: false, awakening: false, combat: true, acquisition: true, notes: true },
        complete: { core: true, tiers: true, ownership: true, awakening: true, combat: true, acquisition: true, notes: true }
      }
      
      const targetPreset = presets[preset]
      return Object.entries(targetPreset).every(([key, value]) => columns.value[key] === value)
    }
    
    const toggleColumn = (columnKey) => {
      characterStore.toggleColumn(columnKey)
    }
    
    
    
    const clearAllFilters = () => {
      characterStore.resetFilters()
    }
    
    
    const hasAnyFilters = computed(() => {
      const hasFilters = jobFilter.value.length > 0 ||
             starRatingFilter.value.length > 0 ||
             ownershipFilter.value.length > 0 ||
             overallTierFilter.value.length > 0 ||
             a4PriorityFilter.value.length > 0 ||
             ultPriorityFilter.value.length > 0 ||
             elementFilter.value.length > 0 ||
             weaponFilter.value.length > 0 ||
             continentFilter.value.length > 0 ||
             sourceFilter.value.length > 0 ||
             characterStore.filters.search !== ''
      return hasFilters
    })
    
    const formatA4Priority = (priority) => {
      const formatMap = {
        'essential': 'Essential',
        'high': 'High',
        'medium': 'Medium',
        'low': 'Low',
        'skip': 'Skip'
      }
      return formatMap[priority] || priority
    }
    
    const formatA4PriorityDisplay = (priority) => {
      if (!priority) return ''
      const formatMap = {
        'essential': 'ESSENTIAL',
        'good': 'GOOD',
        'skip': 'SKIP'
      }
      return formatMap[priority] || priority.toUpperCase()
    }
    
    const formatUltPriorityDisplay = (priority) => {
      if (!priority) return ''
      if (priority === 'essential') return 'ESSENTIAL'
      return priority.toUpperCase()
    }
    
    const toggleShowUnreleased = () => {
      characterStore.updateFilter('showUnreleased', !showUnreleased.value)
    }
    
    const toggleGrouping = () => {
      characterStore.updateUI('grouping.enabled', !groupingEnabled.value)
    }
    
    const toggleTheme = () => {
      const currentTheme = document.body.className
      if (currentTheme.includes('light-theme')) {
        document.body.className = 'dark-theme p-dark'
        document.documentElement.classList.add('p-dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.body.className = 'light-theme'
        document.documentElement.classList.remove('p-dark')
        localStorage.setItem('theme', 'light')
      }
    }
    
    const exportCSV = () => {
      // Export functionality to be implemented
    }
    
    const addSourceTag = (newTag) => {
      // Add the custom source tag to current filter
      const currentSources = sourceFilter.value || []
      if (!currentSources.includes(newTag)) {
        sourceFilter.value = [...currentSources, newTag]
      }
    }
    
    return {
      // UI state
      showViews,
      showAdvancedFilters,
      
      // Filter state
      jobFilter,
      starRatingFilter,
      ownershipFilter,
      overallTierFilter,
      a4PriorityFilter,
      ultPriorityFilter,
      elementFilter,
      weaponFilter,
      continentFilter,
      sourceFilter,
      
      // Computed
      searchValue,
      columns,
      showUnreleased,
      groupingEnabled,
      availableJobs,
      availableElements,
      availableWeapons,
      availableContinents,
      availableObtainedFrom,
      availableA4Priorities,
      availableUltPriorities,
      a4PriorityDisplayOptions,
      ultPriorityDisplayOptions,
      hasAnyFilters,
      
      // Methods
      updateSearch,
      toggleViews,
      toggleAdvancedFilters,
      setColumnPreset,
      isPresetActive,
      toggleColumn,
      clearAllFilters,
      formatA4Priority,
      formatA4PriorityDisplay,
      formatUltPriorityDisplay,
      toggleShowUnreleased,
      toggleGrouping,
      toggleTheme,
      exportCSV,
      addSourceTag
    }
  }
}
</script>

<style scoped>
.table-controls-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: visible;
}

.advanced-filters-section {
  overflow: visible;
}


/* Search Controls Row */
.search-controls-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-light);
  border-radius: 8px 8px 0 0; /* Rounded top corners to match container */
  overflow: visible;
  position: relative;
}

.search-section {
  flex: 1;
  position: relative;
  overflow: visible;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: var(--font-size-primary);
}

.filter-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: var(--font-size-secondary);
  transition: border-color 0.2s ease;
}

.filter-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* Source filter styling */
.source-filter {
  width: 200px;
}

.options-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

/* Collapsible Sections */
.views-section {
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 0; /* Remove any margin between sections */
}

.advanced-filters-section {
  /* No border-bottom to maintain rounded bottom corners */
  margin-bottom: 0;
  margin-top: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--bg-hover);
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

/* Section headers get rounded bottom corners when they're the last visible element */
.advanced-filters-section.collapsed .section-header {
  border-radius: 0 0 8px 8px;
}

/* Views section header gets rounded bottom corners when both sections are collapsed or when it's the only visible section */
.views-section.collapsed .section-header:last-child,
.views-section .section-header:last-child {
  border-radius: 0 0 8px 8px;
}

.section-header:hover {
  background: var(--bg-primary);
}

/* Ensure hover states maintain border radius */
.advanced-filters-section.collapsed .section-header:hover {
  border-radius: 0 0 8px 8px;
}

.section-header h4 {
  margin: 0;
  font-size: var(--font-size-primary);
  color: var(--text-primary);
}

.collapse-icon {
  font-size: var(--font-size-secondary);
  color: var(--text-secondary);
  transition: transform 0.2s ease;
  display: inline-block;
}

/* Views Content */
.views-content {
  padding: 16px;
}

/* Views content gets rounded bottom corners when it's the last visible section */
.views-section:last-child .views-content {
  border-radius: 0 0 8px 8px;
}

.quick-views,
.column-sets {
  margin-bottom: 16px;
}

.quick-views:last-child,
.column-sets:last-child {
  margin-bottom: 0;
}

.quick-views label,
.column-sets label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: var(--font-size-secondary);
  color: var(--text-secondary);
}

.view-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.column-toggles-horizontal {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  overflow-x: auto;
  align-items: center;
}

/* Scrollbar styling for horizontal column toggles */
.column-toggles-horizontal::-webkit-scrollbar {
  height: 8px;
}

.column-toggles-horizontal::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 4px;
}

.column-toggles-horizontal::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
  border: 1px solid var(--bg-secondary);
}

.column-toggles-horizontal::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

.view-preset-btn,
.column-toggle {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  font-size: var(--font-size-primary);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.view-preset-btn:hover,
.column-toggle:hover {
  background: var(--bg-hover);
}

.view-preset-btn.active,
.column-toggle.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.toggle-icon {
  font-weight: bold;
  margin-right: 4px;
}

/* Advanced Filters Content - Vue Select Style */
.filters-content {
  padding: 12px 16px;
  overflow: visible;
  border-radius: 0 0 8px 8px; /* Rounded bottom corners to match container */
}

.vue-select-filters-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}


/* Vue Select Styling - Clean individual buttons */
.vue-select-filters-row .filter-select {
  min-width: 120px;
}


.filter-select * {
  box-sizing: border-box;
}

/* Style Vue Select dropdown toggle as clean button */
.filter-select :deep(.vs__dropdown-toggle) {
  border: 1px solid var(--border-color) !important;
  border-radius: 6px !important;
  background: var(--bg-secondary) !important;
  padding: 6px 12px !important;
  min-height: 32px !important;
  font-size: var(--font-size-primary);
}

/* Remove outer container styling to avoid double borders */
.filter-select {
  border: none;
  background: transparent;
  padding: 0;
}

.filter-select :deep(.vs__selected-options) {
  padding: 0 !important;
  margin: 0 !important;
  flex-wrap: wrap;
  gap: 4px;
}

.filter-select :deep(.vs__selected) {
  background: var(--primary-color);
  color: white;
  border-radius: 3px;
  padding: 2px 6px;
  margin: 0;
  font-size: var(--font-size-secondary);
}

.filter-select :deep(.vs__search) {
  color: var(--text-primary);
  background: transparent !important;
  border: none !important;
  margin: 0 !important;
  padding: 0 !important;
  font-size: var(--font-size-primary);
}

.filter-select :deep(.vs__search)::placeholder {
  color: var(--text-muted);
}

.filter-select :deep(.vs__dropdown-menu) {
  background: var(--bg-secondary);
  border: none;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  max-height: 200px;
  overflow-y: auto;
}

/* Vue Select Dropdown Styling - Scoped to Component */
.filter-select :deep(.vs__dropdown-menu) {
  background: var(--bg-secondary);
  border: none;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  max-height: 200px;
  overflow-y: auto;
}

.filter-select :deep(.vs__dropdown-option) {
  color: var(--text-primary);
  padding: 8px 12px;
  font-size: var(--font-size-primary);
}

.filter-select :deep(.vs__dropdown-option--highlight) {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.filter-select :deep(.vs__dropdown-option--selected) {
  background: var(--primary-color);
  color: white;
}

/* Scrollbar styling for Vue Select dropdowns */
.filter-select :deep(.vs__dropdown-menu)::-webkit-scrollbar {
  width: 6px;
}

.filter-select :deep(.vs__dropdown-menu)::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 3px;
}

.filter-select :deep(.vs__dropdown-menu)::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.filter-select :deep(.vs__dropdown-menu)::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

/* Priority color styling */
.filter-select :deep(.vs__dropdown-option[data-label*="ESS"]) {
  color: #dc3545 !important;
  font-weight: bold;
}

.filter-select :deep(.vs__dropdown-option[data-label*="GOOD"]) {
  color: #28a745 !important;
  font-weight: bold;
}

/* Additional Vue Select styling */
.filter-select :deep(.vs__clear) {
  fill: var(--text-secondary);
}

.filter-select :deep(.vs__open-indicator) {
  fill: var(--text-secondary);
}

.filter-select :deep(.vs__selected[title*="ESS"]) {
  background: #dc3545 !important;
  color: white !important;
}

.filter-select :deep(.vs__selected[title*="GOOD"]) {
  background: #28a745 !important;
  color: white !important;
}

.clear-filters-compact {
  padding: 6px 12px;
  border: 1px solid var(--danger-color);
  border-radius: 6px;
  background: transparent;
  color: var(--danger-color);
  cursor: pointer;
  font-size: var(--font-size-primary);
  transition: all 0.2s ease;
  white-space: nowrap;
  margin-left: auto;
}

.clear-filters-compact:hover {
  background: var(--danger-color);
  color: white;
}


/* Options in Search Row */
.compact-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  white-space: nowrap;
  font-size: var(--font-size-primary);
}


.theme-btn {
  padding: 6px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .filter-row-single {
    flex-direction: column;
    gap: 16px;
  }
  
  .filter-group {
    min-width: 120px;
  }
  
  .options-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>