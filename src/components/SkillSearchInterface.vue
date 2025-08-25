<template>
  <div class="skill-search-interface">
    <!-- Search Modes -->
    <div class="search-modes">
      <div 
        v-for="mode in searchModes" 
        :key="mode.id"
        class="search-mode" 
        :class="{ active: currentMode === mode.id }" 
        @click="setMode(mode.id)"
      >
        {{ mode.icon }} {{ mode.label }}
      </div>
    </div>

    <!-- Natural Language Search -->
    <div v-if="currentMode === 'natural'" class="search-section natural-search">
      <input
        v-model="naturalQuery"
        @input="handleNaturalSearch"
        class="natural-search-input"
        :placeholder="naturalSearchPlaceholder"
        type="text"
      />
      <div class="search-suggestions">
        <span
          v-for="suggestion in currentSuggestions"
          :key="suggestion"
          class="search-suggestion"
          @click="applySuggestion(suggestion)"
        >
          {{ suggestion }}
        </span>
      </div>
      <div v-if="naturalQuery && aiSuggestions.length > 0" class="ai-suggestions">
        <div class="ai-suggestions-header">🤖 AI Suggestions:</div>
        <div
          v-for="suggestion in aiSuggestions"
          :key="suggestion.text"
          class="ai-suggestion"
          @click="applyAISuggestion(suggestion)"
        >
          <span class="suggestion-text">{{ suggestion.text }}</span>
          <span class="suggestion-confidence">{{ Math.round(suggestion.confidence * 100) }}%</span>
        </div>
      </div>
    </div>

    <!-- Boolean Logic Builder -->
    <div v-if="currentMode === 'boolean'" class="search-section boolean-builder">
      <div class="boolean-query-display" @click="focusBooleanInput">
        <code v-if="booleanQuery">{{ booleanQuery }}</code>
        <span v-else class="placeholder">Click tags below or type to build your search query...</span>
      </div>
      <div class="boolean-controls">
        <div class="boolean-operators">
          <button 
            v-for="operator in booleanOperators" 
            :key="operator.op"
            class="boolean-operator" 
            :class="operator.class" 
            @click="addBooleanOperator(operator.op)"
            :title="operator.description"
          >
            {{ operator.label }}
          </button>
        </div>
        <div class="boolean-actions">
          <button class="boolean-action" @click="clearBooleanQuery" title="Clear query">
            🗑️ Clear
          </button>
          <button class="boolean-action" @click="validateBooleanQuery" title="Validate syntax">
            ✓ Validate
          </button>
        </div>
      </div>
      <div v-if="booleanError" class="boolean-error">
        ❌ {{ booleanError }}
      </div>
    </div>

    <!-- Tag-based Filters -->
    <div v-if="showTagFilters" class="tag-filters-section">
      <div class="tag-filters-grid">
        <SkillTagFilter
          v-for="category in tagCategories"
          :key="category.id"
          :title="category.title"
          :icon="category.icon"
          :tags="category.tags"
          :selected="selectedTags[category.id]"
          :multiple="true"
          @update="updateTagSelection(category.id, $event)"
          @tag-selected="onTagSelected"
        />
      </div>
    </div>

    <!-- Advanced Filters -->
    <div v-if="currentMode === 'advanced'" class="search-section advanced-filters">
      <div class="advanced-filters-grid">
        <div class="filter-group">
          <label class="filter-label">Character Properties</label>
          <div class="filter-controls">
            <vue-select
              v-model="advancedFilters.jobs"
              :options="availableJobs"
              placeholder="Filter by job..."
              multiple
              class="filter-select"
            />
            <vue-select
              v-model="advancedFilters.tiers"
              :options="availableTiers"
              placeholder="Filter by tier..."
              multiple
              class="filter-select"
            />
            <vue-select
              v-model="advancedFilters.elements"
              :options="availableElements"
              placeholder="Filter by elements..."
              multiple
              class="filter-select"
            />
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-label">Skill Properties</label>
          <div class="filter-controls">
            <div class="range-filter">
              <label>SP Cost Range:</label>
              <div class="range-inputs">
                <input 
                  v-model.number="advancedFilters.spCostMin" 
                  type="number" 
                  min="0" 
                  max="200"
                  placeholder="Min"
                />
                <span>-</span>
                <input 
                  v-model.number="advancedFilters.spCostMax" 
                  type="number" 
                  min="0" 
                  max="200"
                  placeholder="Max"
                />
              </div>
            </div>
            <div class="checkbox-filters">
              <label class="checkbox-label">
                <input 
                  v-model="advancedFilters.hasUltimate" 
                  type="checkbox"
                />
                Has Ultimate Skill
              </label>
              <label class="checkbox-label">
                <input 
                  v-model="advancedFilters.hasPassive" 
                  type="checkbox"
                />
                Has Passive Skills
              </label>
              <label class="checkbox-label">
                <input 
                  v-model="advancedFilters.multiHit" 
                  type="checkbox"
                />
                Multi-hit Abilities
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Filters -->
    <div class="quick-filters">
      <div class="quick-filters-label">Quick Filters:</div>
      <div class="quick-filter-tags">
        <span
          v-for="quickFilter in quickFilters"
          :key="quickFilter.id"
          class="quick-filter-tag"
          :class="{ active: isQuickFilterActive(quickFilter.id) }"
          @click="toggleQuickFilter(quickFilter)"
        >
          {{ quickFilter.icon }} {{ quickFilter.label }}
        </span>
      </div>
    </div>

    <!-- Active Filters Display -->
    <div v-if="activeFilterCount > 0" class="active-filters">
      <div class="active-filters-header">
        Active Filters ({{ activeFilterCount }}):
        <button class="clear-all-filters" @click="clearAllFilters">Clear All</button>
      </div>
      <div class="active-filter-tags">
        <span
          v-for="filter in activeFiltersList"
          :key="filter.id"
          class="active-filter-tag"
          @click="removeFilter(filter)"
        >
          {{ filter.label }}
          <span class="remove-filter">×</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, inject } from 'vue'
import SkillTagFilter from './SkillTagFilter.vue'

export default {
  name: 'SkillSearchInterface',
  components: {
    SkillTagFilter
  },
  emits: ['search-updated', 'mode-changed'],
  setup(props, { emit }) {
    // Inject AI features if available
    const aiFeatures = inject('aiFeatures', null)
    
    // Search modes
    const searchModes = [
      { id: 'natural', icon: '🗣️', label: 'Natural Language' },
      { id: 'tags', icon: '🏷️', label: 'Tag-based' },
      { id: 'boolean', icon: '⚡', label: 'Boolean Logic' },
      { id: 'advanced', icon: '🔧', label: 'Advanced' }
    ]

    // State
    const currentMode = ref('natural')
    const naturalQuery = ref('')
    const booleanQuery = ref('')
    const booleanError = ref('')
    const selectedTags = ref({
      damage: [],
      buffs: [],
      debuffs: [],
      healing: [],
      targeting: [],
      triggers: [],
      meta: []
    })
    const advancedFilters = ref({
      jobs: [],
      tiers: [],
      elements: [],
      spCostMin: null,
      spCostMax: null,
      hasUltimate: false,
      hasPassive: false,
      multiHit: false
    })
    const aiSuggestions = ref([])
    const activeQuickFilters = ref(new Set())

    // Boolean operators
    const booleanOperators = [
      { op: 'AND', label: 'AND', class: 'and', description: 'Both conditions must be true' },
      { op: 'OR', label: 'OR', class: 'or', description: 'Either condition can be true' },
      { op: 'NOT', label: 'NOT', class: 'not', description: 'Exclude this condition' },
      { op: '(', label: '(', class: 'paren', description: 'Start grouping' },
      { op: ')', label: ')', class: 'paren', description: 'End grouping' }
    ]

    // Tag categories for filtering
    const tagCategories = [
      {
        id: 'damage',
        title: 'Damage Effects',
        icon: '💥',
        tags: computed(() => getTagsByPattern(['dmg_', 'damage_']))
      },
      {
        id: 'buffs', 
        title: 'Buff Effects',
        icon: '⬆️',
        tags: computed(() => getTagsByPattern(['buff_', 'boost_', '_up']))
      },
      {
        id: 'debuffs',
        title: 'Debuff Effects', 
        icon: '⬇️',
        tags: computed(() => getTagsByPattern(['debuff_', 'resist_down_', '_down']))
      },
      {
        id: 'healing',
        title: 'Healing Effects',
        icon: '💚',
        tags: computed(() => getTagsByPattern(['heal_', 'recovery_', 'restore_']))
      },
      {
        id: 'targeting',
        title: 'Targeting',
        icon: '🎯', 
        tags: computed(() => getTagsByPattern(['target_']))
      },
      {
        id: 'triggers',
        title: 'Triggers',
        icon: '⚡',
        tags: computed(() => getTagsByPattern(['trigger_', 'condition_']))
      },
      {
        id: 'meta',
        title: 'Meta Categories',
        icon: '🏆',
        tags: computed(() => getTagsByPattern(['meta_', 'role_']))
      }
    ]

    // Quick filters for common searches
    const quickFilters = [
      { id: 'top-tier', icon: '🏆', label: 'Top Tier (S+/S)', query: { tiers: ['S+', 'S'] } },
      { id: 'buffers', icon: '⬆️', label: 'Buffers', query: { tags: ['buff_stats_patk_up', 'buff_stats_eatk_up'] } },
      { id: 'healers', icon: '💚', label: 'Healers', query: { tags: ['heal_hp', 'heal_sp'] } },
      { id: 'aoe-damage', icon: '💥', label: 'AoE Damage', query: { tags: ['dmg_aoe', 'target_enemy_all'] } },
      { id: 'bp-generation', icon: '🔋', label: 'BP Generation', query: { tags: ['bp_generation', 'bp_recovery'] } },
      { id: 'debuffers', icon: '⬇️', label: 'Debuffers', query: { tags: ['resist_down_fire', 'resist_down_ice', 'debuff_'] } },
      { id: 'free-chars', icon: '🆓', label: 'Free Characters', query: { isFree: true } }
    ]

    // Computed properties
    const showTagFilters = computed(() => 
      ['tags', 'boolean', 'advanced'].includes(currentMode.value)
    )

    const naturalSearchPlaceholder = computed(() => {
      const examples = [
        'characters with fire resistance down',
        'skills that buff the entire party', 
        'healing abilities',
        'multi-hit physical damage',
        'BP generation skills',
        'immunity to charm',
        'follow-up attack abilities'
      ]
      return `Try: "${examples[Math.floor(Math.random() * examples.length)]}"`
    })

    const currentSuggestions = computed(() => {
      if (!naturalQuery.value) return quickFilters.map(f => f.label)
      
      // Filter suggestions based on current query
      const query = naturalQuery.value.toLowerCase()
      return [
        'characters with fire resistance down',
        'skills that buff the entire party',
        'healing abilities', 
        'multi-hit physical damage',
        'BP generation skills',
        'immunity to charm effects',
        'follow-up attack abilities',
        'elemental damage dealers',
        'support characters',
        'tank abilities'
      ].filter(s => s.toLowerCase().includes(query) && s !== naturalQuery.value)
    })

    const activeFilterCount = computed(() => {
      let count = 0
      if (naturalQuery.value) count++
      if (booleanQuery.value) count++
      
      Object.values(selectedTags.value).forEach(tagArray => {
        count += tagArray.length
      })
      
      Object.entries(advancedFilters.value).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) count++
        else if (typeof value === 'boolean' && value) count++
        else if (typeof value === 'number' && value !== null) count++
      })
      
      count += activeQuickFilters.value.size
      return count
    })

    const activeFiltersList = computed(() => {
      const filters = []
      
      if (naturalQuery.value) {
        filters.push({
          id: 'natural-query',
          label: `"${naturalQuery.value}"`,
          type: 'natural'
        })
      }
      
      if (booleanQuery.value) {
        filters.push({
          id: 'boolean-query', 
          label: `Boolean: ${booleanQuery.value}`,
          type: 'boolean'
        })
      }
      
      Object.entries(selectedTags.value).forEach(([category, tags]) => {
        tags.forEach(tag => {
          filters.push({
            id: `tag-${category}-${tag}`,
            label: formatTagName(tag),
            type: 'tag',
            category,
            tag
          })
        })
      })
      
      activeQuickFilters.value.forEach(filterId => {
        const filter = quickFilters.find(f => f.id === filterId)
        if (filter) {
          filters.push({
            id: `quick-${filterId}`,
            label: filter.label,
            type: 'quick',
            filterId
          })
        }
      })
      
      return filters
    })

    // Available options for advanced filters
    const availableJobs = ['Warrior', 'Hunter', 'Cleric', 'Scholar', 'Dancer', 'Merchant', 'Apothecary', 'Thief']
    const availableTiers = ['S+', 'S', 'A', 'B', 'C', 'D']
    const availableElements = ['Fire', 'Ice', 'Lightning', 'Wind', 'Light', 'Dark']

    // Methods
    const setMode = (mode) => {
      currentMode.value = mode
      emit('mode-changed', mode)
      emitSearchUpdate()
    }

    const handleNaturalSearch = async () => {
      // Process natural language with AI if available
      if (aiFeatures && naturalQuery.value.length > 3) {
        try {
          const suggestions = await aiFeatures.processNaturalQuery(naturalQuery.value)
          aiSuggestions.value = suggestions
        } catch (error) {
          console.warn('AI suggestions failed:', error)
          aiSuggestions.value = []
        }
      }
      
      emitSearchUpdate()
    }

    const applySuggestion = (suggestion) => {
      naturalQuery.value = suggestion
      handleNaturalSearch()
    }

    const applyAISuggestion = (suggestion) => {
      // Apply AI suggestion by converting to appropriate filters
      if (suggestion.type === 'tags') {
        suggestion.tags.forEach(tag => {
          const category = getTagCategory(tag)
          if (!selectedTags.value[category].includes(tag)) {
            selectedTags.value[category].push(tag)
          }
        })
        currentMode.value = 'tags'
      } else if (suggestion.type === 'natural') {
        naturalQuery.value = suggestion.text
      }
      
      emitSearchUpdate()
    }

    const addBooleanOperator = (operator) => {
      if (booleanQuery.value && !booleanQuery.value.endsWith(' ')) {
        booleanQuery.value += ' '
      }
      booleanQuery.value += operator + ' '
      validateBooleanQuery()
      emitSearchUpdate()
    }

    const clearBooleanQuery = () => {
      booleanQuery.value = ''
      booleanError.value = ''
      emitSearchUpdate()
    }

    const validateBooleanQuery = () => {
      try {
        // Basic syntax validation
        const query = booleanQuery.value.trim()
        if (!query) {
          booleanError.value = ''
          return true
        }
        
        // Check for balanced parentheses
        let parenCount = 0
        for (const char of query) {
          if (char === '(') parenCount++
          if (char === ')') parenCount--
          if (parenCount < 0) {
            booleanError.value = 'Unmatched closing parenthesis'
            return false
          }
        }
        
        if (parenCount > 0) {
          booleanError.value = 'Unclosed parentheses'
          return false
        }
        
        booleanError.value = ''
        return true
      } catch (error) {
        booleanError.value = 'Invalid query syntax'
        return false
      }
    }

    const updateTagSelection = (categoryId, selectedTags) => {
      selectedTags.value[categoryId] = selectedTags
      emitSearchUpdate()
    }

    const onTagSelected = (tag, category) => {
      if (currentMode.value === 'boolean') {
        if (booleanQuery.value && !booleanQuery.value.endsWith(' ')) {
          booleanQuery.value += ' '
        }
        booleanQuery.value += tag
        validateBooleanQuery()
      }
      
      emitSearchUpdate()
    }

    const toggleQuickFilter = (filter) => {
      if (activeQuickFilters.value.has(filter.id)) {
        activeQuickFilters.value.delete(filter.id)
      } else {
        activeQuickFilters.value.add(filter.id)
      }
      emitSearchUpdate()
    }

    const isQuickFilterActive = (filterId) => {
      return activeQuickFilters.value.has(filterId)
    }

    const removeFilter = (filter) => {
      switch (filter.type) {
        case 'natural':
          naturalQuery.value = ''
          break
        case 'boolean':
          booleanQuery.value = ''
          booleanError.value = ''
          break
        case 'tag':
          const tagIndex = selectedTags.value[filter.category].indexOf(filter.tag)
          if (tagIndex > -1) {
            selectedTags.value[filter.category].splice(tagIndex, 1)
          }
          break
        case 'quick':
          activeQuickFilters.value.delete(filter.filterId)
          break
      }
      emitSearchUpdate()
    }

    const clearAllFilters = () => {
      naturalQuery.value = ''
      booleanQuery.value = ''
      booleanError.value = ''
      
      Object.keys(selectedTags.value).forEach(key => {
        selectedTags.value[key] = []
      })
      
      Object.keys(advancedFilters.value).forEach(key => {
        if (Array.isArray(advancedFilters.value[key])) {
          advancedFilters.value[key] = []
        } else if (typeof advancedFilters.value[key] === 'boolean') {
          advancedFilters.value[key] = false
        } else {
          advancedFilters.value[key] = null
        }
      })
      
      activeQuickFilters.value.clear()
      emitSearchUpdate()
    }

    const emitSearchUpdate = () => {
      const searchState = {
        mode: currentMode.value,
        naturalQuery: naturalQuery.value,
        booleanQuery: booleanQuery.value,
        selectedTags: selectedTags.value,
        advancedFilters: advancedFilters.value,
        quickFilters: Array.from(activeQuickFilters.value),
        isValid: currentMode.value === 'boolean' ? !booleanError.value : true
      }
      
      emit('search-updated', searchState)
    }

    // Helper functions
    const getTagsByPattern = (patterns) => {
      // This would be populated from the actual character data
      // For now, return mock data
      const allTags = [
        'dmg_fire', 'dmg_ice', 'dmg_lightning', 'dmg_physical', 'dmg_aoe',
        'buff_stats_patk_up', 'buff_stats_eatk_up', 'buff_stats_pdef_up',
        'debuff_stats_patk_down', 'resist_down_fire', 'resist_down_ice',
        'heal_hp', 'heal_sp', 'recovery_bp',
        'target_self', 'target_ally_single', 'target_enemy_all',
        'trigger_battle_start', 'trigger_low_hp',
        'meta_buffer', 'meta_dps', 'meta_support'
      ]
      
      return allTags.filter(tag => 
        patterns.some(pattern => tag.includes(pattern))
      )
    }

    const getTagCategory = (tag) => {
      if (tag.includes('dmg_') || tag.includes('damage_')) return 'damage'
      if (tag.includes('buff_') || tag.includes('_up')) return 'buffs'
      if (tag.includes('debuff_') || tag.includes('_down')) return 'debuffs'
      if (tag.includes('heal_') || tag.includes('recovery_')) return 'healing'
      if (tag.includes('target_')) return 'targeting'
      if (tag.includes('trigger_')) return 'triggers'
      return 'meta'
    }

    const formatTagName = (tag) => {
      return tag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    const focusBooleanInput = () => {
      // Focus on boolean query for editing
    }

    // Watch for changes
    watch([selectedTags, advancedFilters], emitSearchUpdate, { deep: true })

    return {
      // State
      searchModes,
      currentMode,
      naturalQuery,
      booleanQuery,
      booleanError,
      selectedTags,
      advancedFilters,
      aiSuggestions,
      activeQuickFilters,
      
      // Computed
      showTagFilters,
      naturalSearchPlaceholder,
      currentSuggestions,
      activeFilterCount,
      activeFiltersList,
      tagCategories,
      quickFilters,
      booleanOperators,
      availableJobs,
      availableTiers,
      availableElements,
      
      // Methods
      setMode,
      handleNaturalSearch,
      applySuggestion,
      applyAISuggestion,
      addBooleanOperator,
      clearBooleanQuery,
      validateBooleanQuery,
      updateTagSelection,
      onTagSelected,
      toggleQuickFilter,
      isQuickFilterActive,
      removeFilter,
      clearAllFilters,
      focusBooleanInput
    }
  }
}
</script>

<style scoped>
.skill-search-interface {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.search-modes {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.search-mode {
  padding: 8px 16px;
  border-radius: 20px;
  border: 2px solid var(--border-color);
  background: var(--bg-primary);
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-primary);
}

.search-mode.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.search-mode:hover {
  border-color: var(--primary-color);
}

.search-section {
  margin-bottom: 25px;
}

.natural-search-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: 25px;
  font-size: 1.1rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: border-color 0.2s;
}

.natural-search-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.search-suggestions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.search-suggestion {
  padding: 4px 12px;
  background: var(--bg-tertiary);
  border-radius: 15px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-secondary);
}

.search-suggestion:hover {
  background: var(--primary-color);
  color: white;
}

.ai-suggestions {
  margin-top: 15px;
  padding: 15px;
  background: var(--bg-primary);
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.ai-suggestions-header {
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--primary-color);
}

.ai-suggestion {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 6px;
  background: var(--bg-secondary);
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.ai-suggestion:hover {
  background: var(--bg-tertiary);
}

.suggestion-confidence {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: bold;
}

.boolean-query-display {
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  min-height: 60px;
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
  cursor: text;
  line-height: 1.4;
}

.boolean-query-display code {
  color: var(--text-primary);
}

.boolean-query-display .placeholder {
  color: var(--text-tertiary);
  font-style: italic;
}

.boolean-controls {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  flex-wrap: wrap;
}

.boolean-operators {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.boolean-operator {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
  color: white;
}

.boolean-operator:hover {
  opacity: 0.8;
}

.boolean-operator.and { background: var(--success-color); }
.boolean-operator.or { background: var(--warning-color); }
.boolean-operator.not { background: var(--danger-color); }
.boolean-operator.paren { background: var(--text-secondary); }

.boolean-actions {
  display: flex;
  gap: 8px;
}

.boolean-action {
  padding: 6px 12px;
  background: var(--text-secondary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.boolean-action:hover {
  opacity: 0.8;
}

.boolean-error {
  color: var(--danger-color);
  font-size: 0.9rem;
  margin-top: 8px;
  padding: 8px;
  background: rgba(220, 53, 69, 0.1);
  border-radius: 4px;
  border: 1px solid var(--danger-color);
}

.tag-filters-section {
  margin-bottom: 25px;
}

.tag-filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.advanced-filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.filter-group {
  background: var(--bg-primary);
  border-radius: 6px;
  padding: 15px;
  border: 1px solid var(--border-color);
}

.filter-label {
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--primary-color);
  display: block;
}

.filter-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.range-filter label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-inputs input {
  width: 80px;
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.checkbox-filters {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: var(--text-primary);
  cursor: pointer;
}

.quick-filters {
  margin-bottom: 20px;
  padding: 15px;
  background: var(--bg-primary);
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.quick-filters-label {
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.quick-filter-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.quick-filter-tag {
  padding: 6px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 15px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-primary);
}

.quick-filter-tag:hover {
  border-color: var(--primary-color);
}

.quick-filter-tag.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.active-filters {
  border-top: 1px solid var(--border-color);
  padding-top: 15px;
}

.active-filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-weight: bold;
  color: var(--text-primary);
}

.clear-all-filters {
  padding: 4px 8px;
  background: var(--danger-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: opacity 0.2s;
}

.clear-all-filters:hover {
  opacity: 0.8;
}

.active-filter-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.active-filter-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: var(--primary-color);
  color: white;
  border-radius: 12px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.active-filter-tag:hover {
  opacity: 0.8;
}

.remove-filter {
  font-weight: bold;
  font-size: 1.1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .tag-filters-grid {
    grid-template-columns: 1fr;
  }
  
  .advanced-filters-grid {
    grid-template-columns: 1fr;
  }
  
  .boolean-controls {
    flex-direction: column;
  }
  
  .range-inputs {
    flex-direction: column;
    align-items: stretch;
  }
  
  .range-inputs input {
    width: 100%;
  }
}
</style>