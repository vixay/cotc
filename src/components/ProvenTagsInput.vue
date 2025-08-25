<template>
  <div class="proven-tags-input">
    <VueTagsInput
      v-model="currentTag"
      :tags="selectedTags"
      :autocomplete-items="filteredAutocompleteItems"
      :add-only-from-autocomplete="false"
      :allow-edit-tags="false"
      :placeholder="placeholder"
      :max-tags="20"
      :autocomplete-always-open="false"
      :autocomplete-min-length="0"
      :is-duplicate="() => false"
      @tags-changed="handleTagsChanged"
      @before-adding-tag="handleBeforeAdding"
    >
      <!-- Custom tag template -->
      <template #tag="{ tag, index, performDelete }">
        <div class="tag-wrapper" :class="getTagClass(tag.text)">
          <span class="tag-text">{{ formatTagDisplay(tag.text) }}</span>
          <span class="tag-remove" @click="performDelete(index)">×</span>
        </div>
      </template>

      <!-- Custom autocomplete item template -->
      <template #autocomplete-item="{ item }">
        <div class="autocomplete-item">
          <span class="item-text">{{ item.text }}</span>
          <span class="item-meta">
            <span v-if="item.type" class="item-type">{{ item.type }}</span>
            <span v-if="item.count" class="item-count">({{ item.count }})</span>
          </span>
        </div>
      </template>
    </VueTagsInput>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useCharacterStore } from '../stores/character'
import VueTagsInput from '@sipec/vue3-tags-input'

export default {
  name: 'ProvenTagsInput',
  components: {
    VueTagsInput
  },
  props: {
    placeholder: {
      type: String,
      default: 'Search characters or tags...'
    },
    initialSearch: {
      type: String,
      default: ''
    }
  },
  emits: ['update-search'],
  setup(props, { emit }) {
    const characterStore = useCharacterStore()
    
    const currentTag = ref('')
    const selectedTags = ref([])
    
    // Watch for search state changes from store and sync UI
    watch(
      () => [characterStore.filters.search, characterStore.filters.searchTerms],
      ([currentSearch, currentSearchTerms]) => {
        // Only update if the UI is currently empty (to avoid overriding user input)
        if (selectedTags.value.length === 0 && (currentSearch || (currentSearchTerms && currentSearchTerms.length > 0))) {
          if (currentSearchTerms && currentSearchTerms.length > 0) {
            selectedTags.value = currentSearchTerms.map(term => ({ text: term }))
          } else if (currentSearch) {
            const terms = currentSearch.split(' ').filter(term => term.trim())
            selectedTags.value = terms.map(term => ({ text: term.trim() }))
          }
        }
      },
      { immediate: true }
    )
    
    // Get all unique tags with metadata
    const allTagsWithMeta = computed(() => {
      const tagCounts = new Map()
      characterStore.characters.forEach(char => {
        if (char.tags && Array.isArray(char.tags)) {
          char.tags.forEach(tag => {
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
          })
        }
      })
      
      const tags = Array.from(tagCounts.entries()).map(([tag, count]) => ({
        text: tag,
        type: getTagType(tag),
        count: count,
        displayText: formatTagLabel(tag)
      }))
      
      // Sort by priority: Drayleb tags first, then by usage count
      return tags.sort((a, b) => {
        const aDrayleb = a.text.startsWith('drayleb-')
        const bDrayleb = b.text.startsWith('drayleb-')
        if (aDrayleb && !bDrayleb) return -1
        if (!aDrayleb && bDrayleb) return 1
        return b.count - a.count
      })
    })
    
    // Autocomplete items based on current input
    const filteredAutocompleteItems = computed(() => {
      if (!currentTag.value || currentTag.value.length < 1) {
        // Show popular tags when no input - ensure we always return some items for testing
        const popularTags = allTagsWithMeta.value.slice(0, 8)
        if (popularTags.length === 0) {
          // Fallback for testing
          return [
            { text: 'drayleb-must-pull', type: 'Meta', displayText: 'Drayleb: Must Pull', count: 10 },
            { text: 'buffer', type: 'Tag', displayText: 'Buffer', count: 5 }
          ]
        }
        return popularTags
      }
      
      const query = currentTag.value.toLowerCase()
      const results = []
      
      // Search characters
      const matchingChars = characterStore.characters
        .filter(char => char.name.toLowerCase().includes(query))
        .slice(0, 3)
        .map(char => ({
          text: `char:${char.name}`,
          type: 'Character',
          displayText: char.name
        }))
      
      results.push(...matchingChars)
      
      // Search tags
      const matchingTags = allTagsWithMeta.value
        .filter(tag => 
          tag.displayText.toLowerCase().includes(query) ||
          tag.text.toLowerCase().includes(query)
        )
        .slice(0, 8)
      
      results.push(...matchingTags)
      
      // Add a fallback result for testing
      if (results.length === 0) {
        results.push({
          text: query,
          type: 'Custom',
          displayText: `Add "${query}" as custom tag`
        })
      }
      
      return results
    })
    
    // Handle tag changes
    const handleTagsChanged = (newTags) => {
      selectedTags.value = newTags
      emitSearch()
    }
    
    // Handle before adding tag (validation)
    const handleBeforeAdding = ({ tag, addTag }) => {
      // Always allow the tag to be added
      addTag()
    }
    
    // Emit search terms
    const emitSearch = () => {
      const terms = selectedTags.value.map(tag => tag.text)
      emit('update-search', {
        terms,
        query: terms.join(' ')
      })
    }
    
    // Utility functions
    const formatTagLabel = (tag) => {
      if (tag.startsWith('drayleb-')) {
        const tierMap = {
          'must-pull': 'Must Pull',
          'should-pull': 'Should Pull', 
          'luxury': 'Luxury',
          'skip': 'Skip'
        }
        const tier = tag.replace('drayleb-', '')
        return `Drayleb: ${tierMap[tier] || tier}`
      }
      return tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
    
    const formatTagDisplay = (tagText) => {
      if (tagText.startsWith('char:')) {
        return tagText.replace('char:', '')
      }
      return formatTagLabel(tagText)
    }
    
    const getTagType = (tag) => {
      if (tag.startsWith('drayleb-')) return 'Meta'
      if (tag.startsWith('char:')) return 'Character'
      return 'Tag'
    }
    
    const getTagClass = (tagText) => {
      if (tagText.startsWith('char:')) return 'ui-tag-general' // Character-specific tags
      if (tagText.startsWith('drayleb-')) {
        const tier = tagText.replace('drayleb-', '').split(' ')[0] // Handle "drayleb-must-pull tag text"
        return `ui-tag-drayleb-${tier}`
      }
      return 'ui-tag-general'
    }
    
    // Watch for external changes
    watch(selectedTags, () => {
      emitSearch()
    }, { deep: true })
    
    return {
      currentTag,
      selectedTags,
      filteredAutocompleteItems,
      handleTagsChanged,
      handleBeforeAdding,
      formatTagDisplay,
      getTagClass
    }
  }
}
</script>

<style>
/* Base styles for vue-tags-input (custom implementation since package doesn't include compiled CSS) */
.vue-tags-input {
  max-width: none !important;
  width: 100% !important;
  background-color: var(--bg-secondary) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: 6px !important;
  position: relative !important;
  font-size: var(--font-size-primary) !important;
  font-family: inherit !important;
  overflow: hidden !important;
  min-height: 32px !important;
}

.vue-tags-input.ti-focus {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 2px rgba(74, 158, 255, 0.2) !important;
}

.vue-tags-input .ti-input {
  border: none !important;
  outline: none !important;
  background: transparent !important;
  color: var(--text-primary) !important;
  width: 100% !important;
  min-width: 150px !important;
  padding: 6px 12px !important;
  line-height: 1.5 !important;
  resize: none !important;
  overflow: hidden !important;
  font-size: var(--font-size-primary) !important;
}

/* Target the actual input element that renders */
.vue-tags-input .ti-new-tag-input {
  background: transparent !important;
  color: var(--text-primary) !important;
  border: none !important;
  outline: none !important;
  font-size: var(--font-size-primary) !important;
  width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}

.vue-tags-input .ti-new-tag-input::placeholder {
  color: var(--text-secondary) !important;
}

.vue-tags-input .ti-input::placeholder {
  color: var(--text-secondary) !important;
}

.vue-tags-input .ti-tags {
  display: flex !important;
  flex-wrap: wrap !important;
  padding: 4px 8px !important;
  gap: 4px !important;
}

.vue-tags-input .ti-tag {
  display: inline-flex !important;
  align-items: center !important;
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: 16px !important;
  margin: 0 !important;
  padding: 4px 8px !important;
  position: relative !important;
  font-size: var(--font-size-small) !important;
  font-weight: 500 !important;
}

.vue-tags-input .ti-tag .ti-content {
  word-wrap: anywhere;
  white-space: normal;
}

.vue-tags-input .ti-tag .ti-deletion {
  margin-left: 4px;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.vue-tags-input .ti-tag .ti-deletion:hover {
  opacity: 1;
}

.vue-tags-input .ti-autocomplete {
  background: var(--bg-primary) !important;
  border: 1px solid var(--border-color) !important;
  border-top: none !important;
  border-radius: 0 0 6px 6px !important;
  max-height: 300px !important;
  overflow-y: auto !important;
  position: absolute !important;
  width: calc(100% - 2px) !important;
  z-index: 9999 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  top: calc(100% - 1px) !important;
  left: 1px !important;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.vue-tags-input .ti-item {
  cursor: pointer !important;
  padding: 12px !important;
  border-bottom: 1px solid var(--border-light) !important;
  color: var(--text-primary) !important;
  transition: background-color 0.2s ease !important;
  background: var(--bg-primary) !important;
}

.vue-tags-input .ti-item:hover {
  background: var(--bg-hover) !important;
}

.vue-tags-input .ti-item.ti-selected-item {
  background: var(--bg-secondary) !important;
}

.vue-tags-input .ti-item:last-child {
  border-bottom: none !important;
}

/* Tag color styling based on content - these apply to all tags regardless of component structure */
.vue-tags-input .ti-tag[data-tag*="char:"] {
  background: var(--primary-color) !important;
  color: white !important;
  border-color: var(--primary-color) !important;
}

.vue-tags-input .ti-tag[data-tag*="drayleb-must-pull"] {
  background: var(--danger-color) !important;
  color: white !important;
  border-color: var(--danger-color) !important;
  font-weight: bold !important;
}

.vue-tags-input .ti-tag[data-tag*="drayleb-should-pull"] {
  background: var(--warning-color) !important;
  color: white !important;
  border-color: var(--warning-color) !important;
  font-weight: bold !important;
}

.vue-tags-input .ti-tag[data-tag*="drayleb-luxury"] {
  background: var(--info-color) !important;
  color: white !important;
  border-color: var(--info-color) !important;
}

.vue-tags-input .ti-tag[data-tag*="drayleb-"] {
  background: var(--text-secondary) !important;
  color: white !important;
  border-color: var(--text-secondary) !important;
}
</style>

<style scoped>
.proven-tags-input {
  width: 100%;
  position: relative;
  z-index: 10;
}

/* Tag color overrides based on content */

/* Custom autocomplete item */
.autocomplete-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.item-text {
  font-weight: 500;
}

.item-meta {
  display: flex;
  gap: 8px;
  font-size: var(--font-size-small);
}

.item-type {
  color: var(--text-secondary);
  text-transform: uppercase;
  font-weight: 600;
  font-size: var(--font-size-tiny);
}

.item-count {
  color: var(--text-tertiary);
}

/* Remove default tag validation styles */
:deep(.vue-tags-input .ti-tag.ti-invalid) {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

/* Ensure autocomplete dropdown appears correctly with theme */
:deep(.vue-tags-input .ti-autocomplete) {
  background: var(--bg-primary) !important;
  border: 1px solid var(--border-color) !important;
  border-top: none !important;
  border-radius: 0 0 6px 6px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  z-index: 9999 !important;
}

:deep(.vue-tags-input .ti-item) {
  background: var(--bg-primary) !important;
  color: var(--text-primary) !important;
  border-bottom: 1px solid var(--border-light) !important;
  padding: 12px !important;
}

:deep(.vue-tags-input .ti-item:hover) {
  background: var(--bg-hover) !important;
}

:deep(.vue-tags-input .ti-item.ti-selected-item) {
  background: var(--bg-secondary) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .tag-wrapper {
    font-size: var(--font-size-tiny);
    padding: 3px 6px;
  }
}
</style>