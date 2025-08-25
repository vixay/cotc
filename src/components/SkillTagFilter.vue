<template>
  <div class="skill-tag-filter">
    <div class="tag-filter-header">
      <div class="tag-filter-title">
        <span class="filter-icon">{{ icon }}</span>
        <span class="filter-title-text">{{ title }}</span>
        <span class="tag-count">{{ tags.length }}</span>
      </div>
      <div class="filter-actions">
        <button
          v-if="selected.length > 0"
          class="clear-selection"
          @click="clearSelection"
          title="Clear selection"
        >
          ×
        </button>
        <button
          class="toggle-expand"
          @click="toggleExpanded"
          title="Toggle expanded view"
        >
          {{ isExpanded ? '▲' : '▼' }}
        </button>
      </div>
    </div>

    <div v-if="isExpanded" class="tag-filter-content">
      <!-- Search within tags -->
      <div v-if="tags.length > 10" class="tag-search">
        <input
          v-model="searchQuery"
          class="tag-search-input"
          :placeholder="`Search ${title.toLowerCase()}...`"
          type="text"
        />
      </div>

      <!-- Tag selection interface -->
      <div class="tag-selection-mode">
        <button
          v-for="mode in selectionModes"
          :key="mode.id"
          class="selection-mode-btn"
          :class="{ active: selectionMode === mode.id }"
          @click="setSelectionMode(mode.id)"
          :title="mode.description"
        >
          {{ mode.label }}
        </button>
      </div>

      <!-- Vue Select for large tag lists -->
      <div v-if="filteredTags.length > 15" class="tag-select-container">
        <vue-select
          :model-value="selected"
          :options="filteredTags.map(tag => ({ label: formatTagName(tag), value: tag }))"
          label="label"
          :reduce="option => option.value"
          :multiple="multiple"
          :close-on-select="!multiple"
          :placeholder="`Select ${title.toLowerCase()}...`"
          class="tag-select"
          @update:model-value="updateSelection"
        >
          <template #option="{ label, value }">
            <div class="tag-option">
              <span class="tag-name">{{ label }}</span>
              <span class="tag-description">{{ getTagDescription(value) }}</span>
            </div>
          </template>
          <template #selected-option="{ label }">
            <span class="selected-tag">{{ label }}</span>
          </template>
        </vue-select>
      </div>

      <!-- Tag grid for smaller lists -->
      <div v-else class="tag-grid">
        <div
          v-for="tag in filteredTags"
          :key="tag"
          class="tag-item"
          :class="{ 
            selected: isTagSelected(tag),
            highlighted: isTagHighlighted(tag)
          }"
          @click="toggleTag(tag)"
          :title="getTagDescription(tag)"
        >
          <div class="tag-content">
            <span class="tag-name">{{ formatTagName(tag) }}</span>
            <span v-if="getTagUsageCount(tag)" class="tag-usage">
              {{ getTagUsageCount(tag) }}
            </span>
          </div>
          <div v-if="getTagDescription(tag)" class="tag-description">
            {{ getTagDescription(tag) }}
          </div>
        </div>
      </div>

      <!-- Selected tags summary -->
      <div v-if="selected.length > 0" class="selected-summary">
        <div class="selected-summary-header">
          Selected ({{ selected.length }}):
        </div>
        <div class="selected-tags">
          <span
            v-for="tag in selected.slice(0, 5)"
            :key="tag"
            class="selected-tag-chip"
            @click="removeTag(tag)"
            :title="'Click to remove: ' + formatTagName(tag)"
          >
            {{ formatTagName(tag) }}
            <span class="remove-tag">×</span>
          </span>
          <span v-if="selected.length > 5" class="more-selected">
            +{{ selected.length - 5 }} more...
          </span>
        </div>
      </div>

      <!-- Quick selection presets -->
      <div v-if="quickPresets.length > 0" class="quick-presets">
        <div class="presets-header">Quick Select:</div>
        <div class="preset-buttons">
          <button
            v-for="preset in quickPresets"
            :key="preset.id"
            class="preset-btn"
            @click="applyPreset(preset)"
            :title="preset.description"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Compact view for collapsed state -->
    <div v-else class="compact-view">
      <div v-if="selected.length === 0" class="no-selection">
        Click to select {{ title.toLowerCase() }}
      </div>
      <div v-else class="compact-selection">
        <span class="selected-count">{{ selected.length }} selected</span>
        <div class="compact-tags">
          <span
            v-for="tag in selected.slice(0, 3)"
            :key="tag"
            class="compact-tag"
          >
            {{ formatTagName(tag) }}
          </span>
          <span v-if="selected.length > 3" class="more-compact">
            +{{ selected.length - 3 }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'SkillTagFilter',
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: '🏷️'
    },
    tags: {
      type: Array,
      required: true
    },
    selected: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: true
    },
    expandedByDefault: {
      type: Boolean,
      default: false
    },
    showUsageCount: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update', 'tag-selected'],
  setup(props, { emit }) {
    // State
    const isExpanded = ref(props.expandedByDefault)
    const searchQuery = ref('')
    const selectionMode = ref('toggle') // toggle, add, remove
    const tagUsage = ref({}) // Could be populated from character data

    // Selection modes
    const selectionModes = [
      { id: 'toggle', label: '↔️', description: 'Toggle selection' },
      { id: 'add', label: '➕', description: 'Add to selection' },
      { id: 'remove', label: '➖', description: 'Remove from selection' }
    ]

    // Computed properties
    const filteredTags = computed(() => {
      if (!searchQuery.value) return props.tags
      
      const query = searchQuery.value.toLowerCase()
      return props.tags.filter(tag => {
        const formattedName = formatTagName(tag).toLowerCase()
        const description = getTagDescription(tag).toLowerCase()
        return formattedName.includes(query) || description.includes(query)
      })
    })

    // Quick presets based on tag category
    const quickPresets = computed(() => {
      const presets = []
      
      if (props.title.toLowerCase().includes('damage')) {
        presets.push(
          { id: 'elemental', label: '🔥 Elemental', tags: props.tags.filter(t => t.includes('fire') || t.includes('ice') || t.includes('lightning')), description: 'All elemental damage types' },
          { id: 'physical', label: '⚔️ Physical', tags: props.tags.filter(t => t.includes('physical')), description: 'Physical damage types' },
          { id: 'aoe', label: '💥 AoE', tags: props.tags.filter(t => t.includes('aoe') || t.includes('all')), description: 'Area of effect damage' }
        )
      }
      
      if (props.title.toLowerCase().includes('buff')) {
        presets.push(
          { id: 'attack', label: '⚔️ Attack', tags: props.tags.filter(t => t.includes('atk_up')), description: 'Attack boost effects' },
          { id: 'defense', label: '🛡️ Defense', tags: props.tags.filter(t => t.includes('def_up')), description: 'Defense boost effects' },
          { id: 'stats', label: '📊 All Stats', tags: props.tags.filter(t => t.includes('stats')), description: 'All stat boost effects' }
        )
      }
      
      if (props.title.toLowerCase().includes('targeting')) {
        presets.push(
          { id: 'allies', label: '👥 Allies', tags: props.tags.filter(t => t.includes('ally')), description: 'Targets allies' },
          { id: 'enemies', label: '👹 Enemies', tags: props.tags.filter(t => t.includes('enemy')), description: 'Targets enemies' },
          { id: 'all', label: '🌐 All', tags: props.tags.filter(t => t.includes('all')), description: 'Affects everyone' }
        )
      }
      
      return presets.filter(p => p.tags.length > 0)
    })

    // Methods
    const toggleExpanded = () => {
      isExpanded.value = !isExpanded.value
    }

    const setSelectionMode = (mode) => {
      selectionMode.value = mode
    }

    const toggleTag = (tag) => {
      const newSelection = [...props.selected]
      const index = newSelection.indexOf(tag)
      
      if (selectionMode.value === 'add') {
        if (index === -1) {
          if (props.multiple) {
            newSelection.push(tag)
          } else {
            newSelection.splice(0, 1, tag)
          }
        }
      } else if (selectionMode.value === 'remove') {
        if (index > -1) {
          newSelection.splice(index, 1)
        }
      } else { // toggle mode
        if (index > -1) {
          newSelection.splice(index, 1)
        } else {
          if (props.multiple) {
            newSelection.push(tag)
          } else {
            newSelection.splice(0, 1, tag)
          }
        }
      }
      
      updateSelection(newSelection)
      emit('tag-selected', tag, props.title.toLowerCase())
    }

    const removeTag = (tag) => {
      const newSelection = props.selected.filter(t => t !== tag)
      updateSelection(newSelection)
    }

    const updateSelection = (newSelection) => {
      emit('update', newSelection)
    }

    const clearSelection = () => {
      updateSelection([])
    }

    const applyPreset = (preset) => {
      if (selectionMode.value === 'add') {
        const newSelection = [...new Set([...props.selected, ...preset.tags])]
        updateSelection(newSelection)
      } else if (selectionMode.value === 'remove') {
        const newSelection = props.selected.filter(tag => !preset.tags.includes(tag))
        updateSelection(newSelection)
      } else {
        updateSelection([...preset.tags])
      }
    }

    const isTagSelected = (tag) => {
      return props.selected.includes(tag)
    }

    const isTagHighlighted = (tag) => {
      if (!searchQuery.value) return false
      const query = searchQuery.value.toLowerCase()
      return formatTagName(tag).toLowerCase().includes(query)
    }

    const formatTagName = (tag) => {
      return tag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    const getTagDescription = (tag) => {
      // This would ideally come from the Universal Tagging System
      const descriptions = {
        'dmg_fire': 'Deals fire elemental damage',
        'dmg_ice': 'Deals ice elemental damage',
        'dmg_lightning': 'Deals lightning elemental damage',
        'dmg_physical': 'Deals physical damage',
        'dmg_aoe': 'Area of effect damage',
        'buff_stats_patk_up': 'Increases physical attack stat',
        'buff_stats_eatk_up': 'Increases elemental attack stat',
        'heal_hp': 'Restores health points',
        'heal_sp': 'Restores skill points',
        'target_ally_all': 'Affects all allies',
        'target_enemy_single': 'Targets a single enemy',
        'trigger_battle_start': 'Activates at battle start'
      }
      
      return descriptions[tag] || ''
    }

    const getTagUsageCount = (tag) => {
      if (!props.showUsageCount) return 0
      return tagUsage.value[tag] || 0
    }

    // Watch for external selection changes
    watch(() => props.selected, () => {
      // Could trigger animations or other side effects
    })

    return {
      // State
      isExpanded,
      searchQuery,
      selectionMode,
      selectionModes,
      
      // Computed
      filteredTags,
      quickPresets,
      
      // Methods
      toggleExpanded,
      setSelectionMode,
      toggleTag,
      removeTag,
      updateSelection,
      clearSelection,
      applyPreset,
      isTagSelected,
      isTagHighlighted,
      formatTagName,
      getTagDescription,
      getTagUsageCount
    }
  }
}
</script>

<style scoped>
.skill-tag-filter {
  background: var(--bg-primary);
  border-radius: 6px;
  padding: 15px;
  border: 1px solid var(--border-color);
}

.tag-filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
}

.tag-filter-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-color);
  font-weight: bold;
}

.filter-icon {
  font-size: 1.2rem;
}

.tag-count {
  background: var(--text-tertiary);
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: normal;
}

.filter-actions {
  display: flex;
  gap: 8px;
}

.clear-selection,
.toggle-expand {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.clear-selection:hover,
.toggle-expand:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.clear-selection {
  color: var(--danger-color);
  font-weight: bold;
}

.tag-filter-content {
  margin-top: 15px;
}

.tag-search {
  margin-bottom: 15px;
}

.tag-search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.9rem;
}

.tag-search-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.tag-selection-mode {
  display: flex;
  gap: 4px;
  margin-bottom: 15px;
  justify-content: center;
}

.selection-mode-btn {
  padding: 4px 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;
}

.selection-mode-btn:first-child {
  border-radius: 4px 0 0 4px;
}

.selection-mode-btn:last-child {
  border-radius: 0 4px 4px 0;
}

.selection-mode-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.tag-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.tag-item {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--bg-secondary);
}

.tag-item:hover {
  border-color: var(--primary-color);
  transform: translateY(-1px);
}

.tag-item.selected {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.tag-item.highlighted {
  box-shadow: 0 0 0 2px rgba(74, 158, 255, 0.3);
}

.tag-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag-name {
  font-size: 0.9rem;
  font-weight: 500;
}

.tag-usage {
  background: rgba(0,0,0,0.2);
  padding: 1px 4px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: bold;
}

.tag-item.selected .tag-usage {
  background: rgba(255,255,255,0.3);
}

.tag-description {
  font-size: 0.75rem;
  margin-top: 4px;
  opacity: 0.8;
  line-height: 1.2;
}

.tag-select-container {
  margin-bottom: 15px;
}

.tag-option {
  display: flex;
  flex-direction: column;
}

.tag-description {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.selected-summary {
  margin-top: 15px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.selected-summary-header {
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.selected-tag-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--primary-color);
  color: white;
  border-radius: 12px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.selected-tag-chip:hover {
  opacity: 0.8;
}

.remove-tag {
  font-weight: bold;
  font-size: 1.1rem;
}

.more-selected {
  padding: 4px 8px;
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-style: italic;
}

.quick-presets {
  margin-top: 15px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.presets-header {
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.preset-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.preset-btn {
  padding: 4px 8px;
  background: var(--warning-color);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: opacity 0.2s;
}

.preset-btn:hover {
  opacity: 0.8;
}

.compact-view {
  padding: 8px 0;
  cursor: pointer;
}

.no-selection {
  color: var(--text-tertiary);
  font-style: italic;
  font-size: 0.9rem;
}

.compact-selection {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.selected-count {
  font-weight: bold;
  color: var(--primary-color);
  font-size: 0.9rem;
}

.compact-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.compact-tag {
  padding: 2px 6px;
  background: var(--primary-color);
  color: white;
  border-radius: 8px;
  font-size: 0.75rem;
}

.more-compact {
  padding: 2px 6px;
  background: var(--text-secondary);
  color: white;
  border-radius: 8px;
  font-size: 0.75rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .tag-grid {
    grid-template-columns: 1fr;
  }
  
  .tag-filter-header {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
  
  .filter-actions {
    justify-content: center;
  }
}
</style>