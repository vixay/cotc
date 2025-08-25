<template>
  <tr 
    class="character-row"
    :class="{ 
      'unreleased': isUnreleased,
      'free-character': character.isFree,
      'owned': userData.owned
    }"
  >
    <!-- Core columns -->
    <td class="character-name" @click="handleNameClick" :title="`View details for ${character.name}`">
      <div class="character-name-content">
        <button 
          class="name-button"
        >
          {{ character.name }}
        </button>
        <span v-if="isUnreleased" class="unreleased-badge">Unreleased</span>
      </div>
    </td>
    <td class="job column-group-core compact-cell">{{ character.job || '-' }}</td>
    <td class="star-rating column-group-core compact-cell">
      <span v-if="character.starRating" class="stars">
        {{ character.starRating }}⭐
      </span>
      <span v-else>-</span>
    </td>
    <td class="roles column-group-core compact-cell">
      <div class="role-tags">
        <span v-if="character.roles?.primary" :class="getRoleTagClass(character.roles.primary, true)">
          {{ character.roles.primary.substring(0, 3) }}
        </span>
        <span v-if="character.roles?.secondary" :class="getRoleTagClass(character.roles.secondary, false)">
          {{ character.roles.secondary.substring(0, 3) }}
        </span>
      </div>
    </td>
    <td class="tags column-group-core compact-cell">
      <div class="tag-list">
        <span 
          v-for="tag in getVisibleTags(character.tags)" 
          :key="tag"
          :class="getTagClass(tag)"
          class="tag"
          :title="tag"
        >
          {{ formatTag(tag) }}
        </span>
        <span 
          v-if="hasMoreTags(character.tags)"
          class="tag tag-more"
          @click="toggleTagsExpanded(character.id)"
          :title="`${getHiddenTagsCount(character.tags)} more tags`"
        >
          +{{ getHiddenTagsCount(character.tags) }}
        </span>
      </div>
    </td>
    
    <!-- Ownership columns -->
    <td class="ownership-header column-group-ownership compact-cell">
      <input 
        type="checkbox" 
        :checked="userData.owned || false"
        @click.stop
        @change="updateOwned"
        class="ownership-checkbox"
      >
    </td>
    <td class="column-group-ownership compact-cell">
      <select 
        :value="userData.awakenLevel || ''"
        @click.stop
        @change="updateAwaken"
        class="awaken-select compact-select"
        :disabled="!userData.owned"
      >
        <option value="">-</option>
        <option value="A1">A1</option>
        <option value="A2">A2</option>
        <option value="A3">A3</option>
        <option value="A4">A4</option>
      </select>
    </td>
    <td class="column-group-ownership compact-cell">
      <select 
        :value="userData.ultLevel || ''"
        @click.stop
        @change="updateUlt"
        class="ult-select compact-select"
        :disabled="!userData.owned"
      >
        <option value="">-</option>
        <option value="L1">L1</option>
        <option value="L5">L5</option>
        <option value="L9">L9</option>
        <option value="L10">L10</option>
      </select>
    </td>
    
    <!-- Tier columns -->
    <td class="overall-tier column-group-tiers compact-cell">
      <span :class="getTierClass(character.tierRatings?.gl?.tier)">
        {{ character.tierRatings?.gl?.tier || 'NR' }}
      </span>
    </td>
    <td class="a4-priority column-group-tiers compact-cell">
      <span 
        v-if="character.a4Priority"
        :class="[getA4PriorityClass(character.a4Priority), 'priority-link']"
        @click.stop="openA4Modal"
        :title="`View ${character.name} awakening accessory details`"
      >
        {{ formatA4Priority(character.a4Priority) }}
      </span>
      <span v-else :class="getA4PriorityClass(character.a4Priority)">
        {{ formatA4Priority(character.a4Priority) }}
      </span>
    </td>
    <td class="ult-priority column-group-tiers compact-cell">
      <span 
        v-if="character.ultPriority"
        :class="[getUltPriorityClass(character.ultPriority), 'priority-link']"
        @click.stop="openUltModal"
        :title="`View ${character.name} ultimate skill details`"
      >
        {{ formatUltPriority(character.ultPriority) }}
      </span>
      <span v-else :class="getUltPriorityClass(character.ultPriority)">
        {{ formatUltPriority(character.ultPriority) }}
      </span>
    </td>
    
    <!-- Awakening stone columns -->
    <td class="column-group-awakening">
      <span :class="getStoneClass(character.stones?.AS1)">
        {{ character.stones?.AS1 || '?' }}
      </span>
    </td>
    <td class="column-group-awakening">
      <span :class="getStoneClass(character.stones?.AS2)">
        {{ character.stones?.AS2 || '?' }}
      </span>
    </td>
    <td class="column-group-awakening">
      <span :class="getStoneClass(character.stones?.AS3)">
        {{ character.stones?.AS3 || '?' }}
      </span>
    </td>
    <td class="column-group-awakening">
      <span :class="getStoneClass(character.stones?.AS4)">
        {{ character.stones?.AS4 || '?' }}
      </span>
    </td>
    <td class="column-group-awakening">
      <span :class="getStoneClass(character.stones?.AS5)">
        {{ character.stones?.AS5 || '?' }}
      </span>
    </td>
    
    <!-- Combat columns -->
    <td class="elements column-group-combat">
      <div class="element-list">
        <i 
          v-for="element in character.elements" 
          :key="element"
          :class="getElementIconClass(element, 'only')" 
          :title="element"
        ></i>
      </div>
    </td>
    <td class="weapons column-group-combat">
      <div class="weapon-list">
        <i 
          v-for="weapon in character.weapons" 
          :key="weapon"
          :class="getWeaponIconClass(weapon, 'only')"
          :title="weapon"
        ></i>
      </div>
    </td>
    
    <!-- Acquisition columns -->
    <td class="continent column-group-acquisition">{{ character.continent || '-' }}</td>
    <td class="obtained-from column-group-acquisition">{{ character.obtainedFrom || '-' }}</td>
    <td class="release-date column-group-acquisition">
      {{ formatDate(character.glReleaseDate) }}
    </td>
    
    <!-- Notes -->
    <td class="notes column-group-notes">
      <div v-if="character.notes" class="notes-container">
        <span 
          :class="{ 'notes-truncated': !notesExpanded && isNotesTooLong(character.notes) }"
          @click="isNotesTooLong(character.notes) && toggleNotesExpanded()"
          :title="isNotesTooLong(character.notes) ? 'Click to expand' : null"
        >
          {{ getDisplayNotes(character.notes) }}
        </span>
        <span 
          v-if="!notesExpanded && isNotesTooLong(character.notes)"
          class="notes-expand"
          @click="toggleNotesExpanded()"
          title="Click to expand"
        >
          ...
        </span>
        <InfoTip 
          v-if="character.prioritySource" 
          :sourceData="character.prioritySource"
          :detailed="false"
        />
      </div>
      <span v-else>-</span>
    </td>
  </tr>
</template>

<script>
import { computed, ref } from 'vue'
import debug from '../utils/debug'
import InfoTip from './InfoTip.vue'
import { 
  getStoneClass, 
  getTagClass, 
  getTierClass, 
  getA4PriorityClass, 
  getUltPriorityClass,
  formatTag,
  formatA4Priority,
  formatUltPriority,
  getElementIconClass,
  getWeaponIconClass,
  getRoleTagClass
} from '../utils/uiClasses'

export default {
  name: 'CharacterRow',
  components: {
    InfoTip
  },
  props: {
    character: {
      type: Object,
      required: true
    },
    userData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['updateOwnership', 'openModal'],
  setup(props, { emit }) {
    // State for expandable content
    const tagsExpanded = ref(false)
    const notesExpanded = ref(false)
    
    const isUnreleased = computed(() => {
      const releaseDate = props.character.glReleaseDate
      return !releaseDate || new Date(releaseDate) > new Date()
    })
    
    const updateOwned = (event) => {
      const owned = event.target.checked
      emit('updateOwnership', props.character.id, owned, props.userData.awakenLevel, props.userData.ultLevel)
    }
    
    const updateAwaken = (event) => {
      const awakenLevel = event.target.value
      emit('updateOwnership', props.character.id, props.userData.owned, awakenLevel, props.userData.ultLevel)
    }
    
    const updateUlt = (event) => {
      const ultLevel = event.target.value
      emit('updateOwnership', props.character.id, props.userData.owned, props.userData.awakenLevel, ultLevel)
    }
    
    // UI class functions imported from utilities
    
    const handleNameClick = () => {
      emit('openModal', props.character)
    }
    
    // Stone class function imported from utilities
    
    const formatDate = (dateString) => {
      if (!dateString) return 'TBD'
      try {
        return new Date(dateString).toLocaleDateString()
      } catch {
        return dateString
      }
    }
    
    const getVisibleTags = (tags) => {
      if (!tags || !Array.isArray(tags)) return []
      
      if (tagsExpanded.value) {
        // Show all tags when expanded
        return tags
      }
      
      // Show limited tags when collapsed
      const priorityTags = ['drayleb-must-pull', 'drayleb-should-pull', 'drayleb-luxury']
      const drayleb = tags.find(tag => priorityTags.includes(tag))
      const others = tags.filter(tag => !priorityTags.includes(tag)).slice(0, 2)
      return drayleb ? [drayleb, ...others] : others.slice(0, 3)
    }
    
    const hasMoreTags = (tags) => {
      if (!tags || !Array.isArray(tags)) return false
      const visibleCount = getVisibleTags(tags).length
      return tags.length > visibleCount && !tagsExpanded.value
    }
    
    const getHiddenTagsCount = (tags) => {
      if (!tags || !Array.isArray(tags)) return 0
      const visibleCount = getVisibleTags(tags).length
      return Math.max(0, tags.length - visibleCount)
    }
    
    const toggleTagsExpanded = () => {
      tagsExpanded.value = !tagsExpanded.value
    }
    
    // Notes expansion functions
    const isNotesTooLong = (notes) => {
      if (!notes) return false
      return notes.length > 80 // Characters threshold for truncation
    }
    
    const getDisplayNotes = (notes) => {
      if (!notes) return ''
      if (notesExpanded.value || !isNotesTooLong(notes)) {
        return notes
      }
      return notes.substring(0, 80) // Show first 80 characters
    }
    
    const toggleNotesExpanded = () => {
      notesExpanded.value = !notesExpanded.value
    }
    
    const openA4Modal = () => {
      emit('openModal', props.character, 'accessory')
    }
    
    const openUltModal = () => {
      emit('openModal', props.character, 'ultimate')
    }
    
    // Tag functions imported from utilities
    
    return {
      isUnreleased,
      updateOwned,
      updateAwaken,
      updateUlt,
      getTierClass,
      getA4PriorityClass,
      getUltPriorityClass,
      formatA4Priority,
      formatUltPriority,
      handleNameClick,
      openA4Modal,
      openUltModal,
      getStoneClass,
      formatDate,
      getVisibleTags,
      hasMoreTags,
      getHiddenTagsCount,
      toggleTagsExpanded,
      notesExpanded,
      isNotesTooLong,
      getDisplayNotes,
      toggleNotesExpanded,
      getTagClass,
      formatTag,
      getElementIconClass,
      getWeaponIconClass,
      getRoleTagClass
    }
  }
}
</script>

<style scoped>
.character-row {
  transition: background-color 0.2s ease;
}

.character-row:hover {
  background-color: var(--bg-hover);
}

.character-row.unreleased {
  opacity: 0.7;
}

.character-row.owned {
  background-color: var(--bg-owned);
}

.character-name-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name-button {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  font-weight: 500;
  padding: 2px 4px;
  border-radius: 3px;
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: all 0.2s ease;
}

.name-button:hover {
  background: var(--bg-hover);
  text-decoration-color: var(--primary-color);
  color: var(--primary-hover);
}

.name-button:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 1px;
}

.unreleased-badge {
  background: var(--warning-color);
  color: var(--bg-primary);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: var(--font-size-small);
  font-weight: 500;
}

/* Role tag styling now handled by global ui-role-* classes */
.role-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.ownership-checkbox {
  cursor: pointer;
}

.awaken-select, .ult-select {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 2px 4px;
  border-radius: 4px;
  font-size: var(--font-size-primary);
  cursor: pointer;
}

.awaken-select:disabled, .ult-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.element-list, .weapon-list {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
  align-items: center;
}

.element {
  padding: 1px 3px;
  border-radius: 2px;
  font-size: var(--font-size-tiny);
  font-weight: 500;
}

/* Element text colors - only for text, not icons */
.element-text.element-fire { background: #ff6b6b; color: white; }
.element-text.element-ice { background: #74c0fc; color: white; }
.element-text.element-lightning { background: #ffd43b; color: black; }
.element-text.element-wind { background: #51cf66; color: white; }
.element-text.element-light { background: #f8f9fa; color: black; }
.element-text.element-dark { background: #343a40; color: white; }

/* Element and weapon icons now handled by global ui-element-* and ui-weapon-* classes */

.weapon {
  padding: 1px 3px;
  background: var(--bg-secondary);
  border-radius: 2px;
  font-size: var(--font-size-tiny);
}

/* Compact styling */
.compact-header {
  padding: 6px 8px !important;
  font-size: var(--font-size-primary);
  white-space: nowrap;
}

.compact-cell {
  padding: 4px 6px !important;
  font-size: var(--font-size-secondary);
}

.compact-select {
  font-size: var(--font-size-tiny) !important;
  padding: 1px 3px !important;
  min-width: 35px;
}

/* Tier styling now handled by global ui-tier-* classes */

/* Priority styling now handled by global ui-a4-* and ui-ult-* classes */

/* Priority Link Styling - minimal for clickable cursor */
.priority-link {
  cursor: pointer;
}

/* Stone styling now handled by global ui-stone-* classes */

/* Tag styling now handled by global ui-tag-* classes */
.tag-list {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
}

/* Notes styling */
.notes {
  max-width: 200px;
  word-wrap: break-word;
  word-break: break-word;
}

.notes-container {
  position: relative;
  line-height: 1.4;
}

.notes-truncated {
  cursor: pointer;
  transition: color 0.2s ease;
}

.notes-truncated:hover {
  color: var(--primary-color);
}

.notes-expand {
  color: var(--primary-color);
  cursor: pointer;
  font-weight: bold;
  margin-left: 2px;
  transition: all 0.2s ease;
  user-select: none;
}

.notes-expand:hover {
  color: var(--primary-color-hover);
  transform: scale(1.1);
}
</style>