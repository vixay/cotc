<template>
  <div 
    :class="portraitClasses"
    @click="handleClick"
    @mouseenter="handleMouseEnter" 
    @mouseleave="handleMouseLeave"
    v-tooltip.top="tooltipText"
  >
    <!-- Portrait Image -->
    <img 
      v-if="imageUrl && !imageError"
      :src="imageUrl"
      :alt="characterName"
      :class="imageClasses"
      @load="handleImageLoad"
      @error="handleImageError"
      loading="lazy"
    />
    
    <!-- Fallback Avatar -->
    <div 
      v-else
      :class="fallbackClasses"
    >
      <span class="fallback-initials">{{ initials }}</span>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <i class="pi pi-spin pi-spinner"></i>
    </div>

    <!-- Character Info Overlay (for hover mode) -->
    <div v-if="showOverlay && characterData" class="character-overlay">
      <div class="overlay-content">
        <h3 class="character-name">{{ characterData.name }}</h3>
        <div class="character-meta">
          <span v-if="characterData.job" class="character-job">
            {{ characterData.job }}
          </span>
          <span v-if="characterData.starRating" class="character-stars">
            {{ '⭐'.repeat(characterData.starRating) }}
          </span>
        </div>
        <div v-if="characterData.tags && characterData.tags.length" class="character-tags">
          <Tag 
            v-for="tag in characterData.tags.slice(0, 3)" 
            :key="tag"
            :value="tag"
            severity="info"
            class="overlay-tag"
          />
          <span v-if="characterData.tags.length > 3" class="more-tags">
            +{{ characterData.tags.length - 3 }} more
          </span>
        </div>
        <Button 
          label="View Details"
          icon="pi pi-eye"
          class="p-button-sm view-details-btn"
          @click.stop="openCharacterModal"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useCharacterStore } from '../stores/character'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

export default {
  name: 'CharacterPortrait',
  components: {
    Button,
    Tag
  },
  props: {
    characterId: {
      type: String,
      required: true
    },
    characterName: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'medium', // small, medium, large, xlarge
      validator: (value) => ['small', 'medium', 'large', 'xlarge'].includes(value)
    },
    clickable: {
      type: Boolean,
      default: true
    },
    showHoverInfo: {
      type: Boolean,
      default: false
    },
    showTooltip: {
      type: Boolean,
      default: true
    },
    lazy: {
      type: Boolean,
      default: true
    }
  },
  emits: ['click', 'load', 'error'],
  setup(props, { emit }) {
    const characterStore = useCharacterStore()
    
    // State
    const isLoading = ref(false)
    const imageError = ref(false)
    const showOverlay = ref(false)
    const hoverTimeout = ref(null)

    // Computed properties
    const characterData = computed(() => {
      return characterStore.getCharacterById(props.characterId)
    })

    const displayName = computed(() => {
      return props.characterName || characterData.value?.name || 'Unknown Character'
    })

    const initials = computed(() => {
      const name = displayName.value
      return name.split(' ')
        .map(word => word.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase()
    })

    const imageUrl = computed(() => {
      if (imageError.value) return null
      
      // Try multiple image paths
      const paths = [
        `/images/characters/portraits/${props.characterId}.png`,
        `/images/characters/sprites/${props.characterId}.png`,
        `/images/characters/${props.characterId}.png`
      ]
      
      // Return the first path for now - we'll handle fallbacks in error handler
      return paths[0]
    })

    const portraitClasses = computed(() => {
      return [
        'character-portrait',
        `portrait-${props.size}`,
        {
          'portrait-clickable': props.clickable,
          'portrait-hover-info': props.showHoverInfo,
          'portrait-loading': isLoading.value,
          'portrait-error': imageError.value
        }
      ]
    })

    const imageClasses = computed(() => {
      return [
        'portrait-image',
        `image-${props.size}`
      ]
    })

    const fallbackClasses = computed(() => {
      return [
        'portrait-fallback',
        `fallback-${props.size}`
      ]
    })

    const tooltipText = computed(() => {
      if (!props.showTooltip) return null
      
      const character = characterData.value
      if (!character) return displayName.value
      
      let tooltip = character.name
      if (character.job) tooltip += ` (${character.job})`
      if (character.starRating) tooltip += ` ${'⭐'.repeat(character.starRating)}`
      
      return tooltip
    })

    // Methods
    const handleClick = () => {
      if (props.clickable) {
        emit('click', { characterId: props.characterId, characterData: characterData.value })
        if (characterData.value) {
          characterStore.openCharacterModal(props.characterId)
        }
      }
    }

    const handleMouseEnter = () => {
      if (props.showHoverInfo && characterData.value) {
        clearTimeout(hoverTimeout.value)
        hoverTimeout.value = setTimeout(() => {
          showOverlay.value = true
        }, 300) // Small delay to prevent accidental triggers
      }
    }

    const handleMouseLeave = () => {
      clearTimeout(hoverTimeout.value)
      showOverlay.value = false
    }

    const handleImageLoad = () => {
      isLoading.value = false
      imageError.value = false
      emit('load', { characterId: props.characterId })
    }

    const handleImageError = () => {
      isLoading.value = false
      imageError.value = true
      emit('error', { characterId: props.characterId, imageUrl: imageUrl.value })
    }

    const openCharacterModal = () => {
      if (characterData.value) {
        characterStore.openCharacterModal(props.characterId)
      }
    }

    // Watchers
    watch(() => props.characterId, () => {
      imageError.value = false
      isLoading.value = true
    })

    // Lifecycle
    onMounted(() => {
      if (imageUrl.value) {
        isLoading.value = true
      }
    })

    return {
      // State
      isLoading,
      imageError,
      showOverlay,
      
      // Computed
      characterData,
      displayName,
      initials,
      imageUrl,
      portraitClasses,
      imageClasses,
      fallbackClasses,
      tooltipText,
      
      // Methods
      handleClick,
      handleMouseEnter,
      handleMouseLeave,
      handleImageLoad,
      handleImageError,
      openCharacterModal
    }
  }
}
</script>

<style scoped>
.character-portrait {
  position: relative;
  display: inline-block;
  border-radius: 50%;
  overflow: hidden;
  background: var(--surface-ground);
  border: 2px solid var(--surface-border);
  transition: all 0.2s ease;
  user-select: none;
}

.portrait-clickable {
  cursor: pointer;
}

.portrait-clickable:hover {
  border-color: var(--primary-color);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.portrait-hover-info {
  z-index: 10;
}

.portrait-loading {
  opacity: 0.7;
}

.portrait-error {
  border-color: var(--red-400);
}

/* Size variants */
.portrait-small {
  width: 32px;
  height: 32px;
}

.portrait-medium {
  width: 48px;
  height: 48px;
}

.portrait-large {
  width: 80px;
  height: 80px;
}

.portrait-xlarge {
  width: 120px;
  height: 120px;
}

/* Image styles */
.portrait-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

/* Fallback styles */
.portrait-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-200), var(--primary-400));
  color: white;
  font-weight: bold;
}

.fallback-small .fallback-initials {
  font-size: 0.7rem;
}

.fallback-medium .fallback-initials {
  font-size: 0.9rem;
}

.fallback-large .fallback-initials {
  font-size: 1.2rem;
}

.fallback-xlarge .fallback-initials {
  font-size: 1.8rem;
}

/* Loading overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  color: var(--primary-color);
}

/* Character info overlay */
.character-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--surface-overlay);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 15px;
  min-width: 250px;
  box-shadow: var(--box-shadow);
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.character-overlay::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  background: var(--surface-overlay);
  border: 1px solid var(--surface-border);
  border-bottom: none;
  border-right: none;
  transform: translateX(-50%) rotate(45deg);
}

.overlay-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;
}

.character-name {
  margin: 0;
  color: var(--primary-color);
  font-size: 1.1rem;
}

.character-meta {
  display: flex;
  justify-content: center;
  gap: 15px;
  align-items: center;
}

.character-job {
  font-size: 0.85rem;
  color: var(--text-color-secondary);
  background: var(--surface-100);
  padding: 2px 8px;
  border-radius: 12px;
}

.character-stars {
  font-size: 0.9rem;
}

.character-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 5px;
}

.overlay-tag {
  font-size: 0.75rem;
}

.more-tags {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}

.view-details-btn {
  margin-top: 5px;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* Special styling for inline usage */
.character-portrait-inline {
  border-radius: 4px;
}

.character-portrait-inline:hover {
  transform: none;
  box-shadow: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .character-overlay {
    min-width: 200px;
    padding: 12px;
  }
  
  .character-name {
    font-size: 1rem;
  }
  
  .character-meta {
    flex-direction: column;
    gap: 5px;
  }
}

/* Dark theme adjustments */
.p-dark .portrait-fallback {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-800));
}

.p-dark .loading-overlay {
  background: rgba(0, 0, 0, 0.8);
}

.p-dark .character-overlay::before {
  background: var(--surface-overlay);
}
</style>