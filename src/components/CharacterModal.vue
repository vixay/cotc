<template>
  <div v-if="isOpen" class="char-modal-overlay" @click="closeModal">
    <div @click.stop class="char-modal-container" tabindex="-1">
      <div class="char-modal-header">
        <button @click="closeModal" class="char-modal-close">
          &times;
        </button>
        
        <div class="char-modal-hero">
          <div class="char-modal-portrait-wrapper" v-if="character">
            <img 
              :src="getCharacterImagePath(character.id, 'portrait')"
              :alt="character.name"
              class="char-modal-portrait"
              @error="handleImageError"
            />
          </div>
          
          <div class="char-modal-info-wrapper">
            <div class="char-modal-name-section">
              <h1 class="char-modal-name">{{ character?.name || 'Character Details' }}</h1>
              <div class="char-modal-stars" v-if="character?.starRating">
                <span v-for="n in character.starRating" :key="n" class="star">★</span>
              </div>
            </div>
            
            <div class="char-modal-quick-info">
              <div class="info-row">
                <div class="char-modal-info-badge" v-if="character?.job">
                  <span class="badge-label">Job</span>
                  <span class="badge-value">{{ character.job }}</span>
                </div>
                <div class="char-modal-info-badge" v-if="character?.tierRatings?.gl?.tier">
                  <span class="badge-label">Tier</span>
                  <span class="badge-value tier-badge" :class="getTierClass(character.tierRatings.gl.tier)">
                    {{ character.tierRatings.gl.tier }}
                  </span>
                </div>
              </div>
              <div class="info-row">
                <div class="char-modal-info-badge" v-if="character?.continent">
                  <span class="badge-label">Region</span>
                  <span class="badge-value">{{ character.continent }}</span>
                </div>
                <div class="char-modal-info-badge">
                  <span class="badge-label">Type</span>
                  <span class="badge-value">{{ character?.isFree ? 'Free' : 'Gacha' }}</span>
                </div>
              </div>
            </div>
            
            <!-- Element & Weapon Weaknesses Display -->
            <div class="char-modal-weaknesses" v-if="character && (character.elements?.length || character.weapons?.length)">
              <div class="weakness-section" v-if="character.elements?.length">
                <span class="weakness-label">Elements:</span>
                <div class="weakness-badges">
                  <span 
                    v-for="element in character.elements" 
                    :key="element"
                    :class="getWeaknessClass(element)"
                  >
                    <i :class="getElementIconClass(element, 'sm')" :title="element"></i>
                    {{ element }}
                  </span>
                </div>
              </div>
              <div class="weakness-section" v-if="character.weapons?.length">
                <span class="weakness-label">Weapons:</span>
                <div class="weakness-badges">
                  <span 
                    v-for="weapon in character.weapons" 
                    :key="weapon"
                    :class="getWeaknessClass(weapon)"
                  >
                    <i :class="getWeaponIconClass(weapon, 'sm')" :title="weapon"></i>
                    {{ weapon }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="char-modal-priorities" v-if="character">
              <div class="priority-item" v-if="character.ultPriority">
                <span class="priority-label">Ultimate Priority</span>
                <span class="priority-value" :class="getUltPriorityClass(character.ultPriority)">{{ formatUltPriority(character.ultPriority) }}</span>
              </div>
              <div class="priority-item" v-if="character.a4Priority">
                <span class="priority-label">A4 Priority</span>
                <span class="priority-value" :class="getA4PriorityClass(character.a4Priority)">{{ formatA4Priority(character.a4Priority) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="char-modal-body">
        <!-- Awakening Stones Section -->
        <div v-if="character && character.stones" class="char-modal-section">
          <h3 class="char-modal-section-title">
            <i class="section-icon">⚡</i>
            Awakening Stone Recommendations
          </h3>
          <div class="char-modal-stones-row">
            <div v-for="(stone, key) in character.stones" :key="key" class="char-modal-stone-cell">
              <div class="stone-label">{{ key }}</div>
              <div :class="['stone-value', getStoneClass(stone)]">{{ stone || '?' }}</div>
            </div>
          </div>
        </div>

        <!-- Skills Section with Color Coding -->
        <div v-if="character && character.skills" class="char-modal-section">
          <h3 class="char-modal-section-title">
            <i class="section-icon">🛡️</i>
            Skills & Abilities
          </h3>
          <div class="skills-container">
            <!-- Ultimate Skill -->
            <div v-if="character.skills.ultimate" class="skill-group ultimate-group">
              <h4 class="skill-group-title ultimate-title">Ultimate</h4>
              <div class="skill-item ultimate-skill">
                <div class="skill-name">{{ character.skills.ultimate }}</div>
              </div>
            </div>
            
            <!-- Passive Skills -->
            <div v-if="character.skills.passive?.length" class="skill-group passive-group">
              <h4 class="skill-group-title passive-title">Passive Skills</h4>
              <div class="skill-list">
                <div v-for="skill in character.skills.passive" :key="skill" class="skill-item passive-skill">
                  <div class="skill-name">{{ skill }}</div>
                </div>
              </div>
            </div>
            
            <!-- Battle Skills -->
            <div v-if="character.skills.battle?.length" class="skill-group active-group">
              <h4 class="skill-group-title active-title">Battle Skills</h4>
              <div class="skill-list">
                <div v-for="skill in character.skills.battle" :key="skill" class="skill-item active-skill">
                  <div class="skill-name">{{ skill }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Tags Section -->
        <div v-if="character && character.tags && character.tags.length" class="char-modal-section">
          <h3 class="char-modal-section-title">
            <i class="section-icon">🏷️</i>
            Character Tags
          </h3>
          <div class="char-modal-badge-group">
            <TagWithTooltip
              v-for="tag in character.tags"
              :key="tag"
              :tag="tag"
              class="char-modal-tag"
            />
          </div>
        </div>
        
        <!-- Notes Section -->
        <div v-if="character && character.notes" class="char-modal-section">
          <h3 class="char-modal-section-title">
            <i class="section-icon">📝</i>
            Strategy Notes
            <InfoTip 
              v-if="character.prioritySource" 
              :sourceData="character.prioritySource"
              :detailed="true"
            />
          </h3>
          <div class="char-modal-notes">
            <p>{{ character.notes }}</p>
          </div>
        </div>
        
        <!-- Detailed Information Section -->
        <div v-if="characterStore.modal.markdownContent" class="char-modal-section">
          <h3 class="char-modal-section-title">
            <i class="section-icon">📊</i>
            Detailed Information
          </h3>
          <div v-html="processedMarkdown" class="char-modal-markdown"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useCharacterStore } from '../stores/character'
import debug from '../utils/debug'
import InfoTip from './InfoTip.vue'
import TagWithTooltip from './TagWithTooltip.vue'
import { markdownToHtml, createCompactStatsTable, createAttributesSection, extractMetadata, getNotionEmojiReplacement } from '../utils/markdownParser'
import {
  getStoneClass,
  getTagClass as getModalTagClass,
  getTierClass,
  formatModalTag,
  formatA4Priority,
  formatUltPriority,
  getElementIconClass,
  getWeaponIconClass,
  getWeaknessClass,
  getA4PriorityClass,
  getUltPriorityClass,
  getCharacterImagePath
} from '../utils/uiClasses'

export default {
  name: 'CharacterModal',
  components: {
    InfoTip,
    TagWithTooltip
  },
  setup() {
    const characterStore = useCharacterStore()
    
    const isOpen = computed(() => characterStore.modal.isOpen)
    const character = computed(() => characterStore.modal.selectedCharacter)
    const loading = computed(() => characterStore.loading.characterDetails)
    const section = computed(() => characterStore.modal.section)
    
    const closeModal = () => {
      characterStore.closeCharacterModal()
    }
    
    // Handle ESC key press
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen.value) {
        closeModal()
      }
    }
    
    // Auto-scroll to section when modal opens with section parameter
    const scrollToSection = async (sectionName) => {
      if (!sectionName) return
      
      await nextTick() // Wait for DOM to render
      
      const element = document.getElementById(`modal-${sectionName}-section`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        // Add highlight effect
        element.classList.add('section-highlight')
        setTimeout(() => {
          element.classList.remove('section-highlight')
        }, 2000)
      }
    }
    
    // Watch for modal opening with section parameter
    watch([isOpen, section], ([newIsOpen, newSection]) => {
      if (newIsOpen && newSection) {
        // Delay scrolling to allow modal animation to complete
        setTimeout(() => {
          scrollToSection(newSection)
        }, 300)
      }
    })
    
    onMounted(() => {
      document.addEventListener('keydown', handleEscKey)
      // Focus the modal container for better accessibility
      const modalContainer = document.querySelector('.char-modal-container')
      if (modalContainer) {
        modalContainer.focus()
      }
    })
    
    onUnmounted(() => {
      document.removeEventListener('keydown', handleEscKey)
    })
    
    const getCharacterSubtitle = () => {
      if (!character.value) return ''
      const parts = []
      if (character.value.job) parts.push(character.value.job)
      if (character.value.starRating) parts.push(`${character.value.starRating}★`)
      if (character.value.continent) parts.push(character.value.continent)
      return parts.join(' • ')
    }
    
    // getTierClass imported from utilities
    
    const getA4PriorityClass = (priority) => {
      if (!priority) return 'priority-none'
      const classMap = {
        'essential': 'a4-essential',
        'high': 'a4-high', 
        'medium': 'a4-medium',
        'low': 'a4-low',
        'skip': 'a4-skip'
      }
      return classMap[priority] || 'priority-none'
    }
    
    const getUltPriorityClass = (priority) => {
      if (!priority) return 'priority-none'
      const classMap = {
        'essential': 'ult-essential',
        'good': 'ult-good',
        'skip': 'ult-skip'
      }
      return classMap[priority] || 'priority-none'
    }
    
    const formatUltPriority = (priority) => {
      if (!priority) return '-'
      if (priority === 'skip') return 'SKIP'
      return priority.toUpperCase()
    }
    
    const formatA4Priority = (priority) => {
      if (!priority) return '-'
      if (priority === 'skip') return 'SKIP'
      const formatMap = {
        'essential': 'ESSENTIAL',
        'good': 'GOOD'
      }
      return formatMap[priority] || priority.toUpperCase()
    }
    
    // UI class functions imported from utilities

    // Removed duplicate createWeaknessesSection - weaknesses are shown in template header
    
    // Handle image error by replacing with placeholder
    const handleImageError = (event) => {
      const img = event.target
      const character = img.alt
      const initials = character.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase()
      
      // Create placeholder div
      const placeholder = document.createElement('div')
      placeholder.className = 'char-modal-portrait-placeholder'
      placeholder.textContent = initials
      
      img.parentNode.replaceChild(placeholder, img)
    }

    const processedMarkdown = computed(() => {
      if (!characterStore.modal.markdownContent || !character.value) return ''
      const metadata = extractMetadata(characterStore.modal.markdownContent)
      const compactStats = createCompactStatsTable(metadata)
      const markdownHtml = markdownToHtml(characterStore.modal.markdownContent)

      return `
        <div class="character-overview">
          <div class="character-info-grid">
            ${compactStats}
          </div>
        </div>
        <div class="character-content">
          ${markdownHtml}
        </div>
      `
    })
    
    return {
      isOpen,
      character,
      loading,
      closeModal,
      getCharacterSubtitle,
      getTierClass,
      getA4PriorityClass,
      getUltPriorityClass,
      formatA4Priority,
      formatUltPriority,
      getStoneClass,
      getModalTagClass,
      formatModalTag,
      getElementIconClass,
      getWeaponIconClass,
      getWeaknessClass,
      getCharacterImagePath,
      handleImageError,
      processedMarkdown,
      characterStore // Expose characterStore to the template
    }
  }
}
</script>

<style>
/* Theme Variables for Character Modal */
:root {
  /* Dark theme (default) */
  --modal-bg: #2a2a2a;
  --modal-text: #e0e0e0;
  --modal-heading: #ffffff;
  --modal-subtext: #b0b0b0;
  --modal-border: #444;
  --modal-section-bg: #333;
  --modal-badge-bg: #444;
  --modal-badge-text: #e0e0e0;
  --modal-stone-bg: #3a3a3a;
  --modal-stone-border: #555;
  --modal-notes-bg: #333;
  --modal-notes-border: #4a9eff;
}

body.light-theme {
  --modal-bg: #ffffff;
  --modal-text: #333333;
  --modal-heading: #000000;
  --modal-subtext: #666666;
  --modal-border: #e0e0e0;
  --modal-section-bg: #f9f9f9;
  --modal-badge-bg: #e8e8e8;
  --modal-badge-text: #333333;
  --modal-stone-bg: #f0f0f0;
  --modal-stone-border: #ddd;
  --modal-notes-bg: #f0f0f0;
  --modal-notes-border: #0066cc;
}

/* Character Modal Styles */

.char-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow-y: auto;
}

.char-modal-container {
  background: var(--modal-bg, #ffffff);
  color: var(--modal-text, #000000);
  padding: 20px;
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  outline: none; /* Remove default focus outline */
}

.char-modal-container:focus-visible {
  outline: 2px solid var(--primary-color, #4a9eff);
  outline-offset: -2px;
}

.char-modal-header {
  position: relative;
  padding: 24px;
  background: linear-gradient(135deg, var(--modal-section-bg, #333) 0%, transparent 100%);
  border-bottom: 2px solid var(--modal-border, #444);
  margin: -20px -20px 20px -20px;
  border-radius: 8px 8px 0 0;
}

.char-modal-hero {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 20px;
  min-width: 0; /* Prevents container overflow */
}

.char-modal-portrait-wrapper {
  flex-shrink: 0;
}

.char-modal-info-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0; /* Prevents flex item from overflowing */
}

.char-modal-portrait {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid var(--modal-border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.char-modal-portrait-placeholder {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--modal-section-bg);
  border: 2px solid var(--modal-border);
  border-radius: 8px;
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--modal-subtext);
}

.char-modal-name-section {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.char-modal-name {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
  color: var(--modal-heading, #fff);
  line-height: 1.2;
}

.char-modal-stars {
  display: flex;
  gap: 2px;
  font-size: 1.5rem;
  color: #ffd700;
  text-shadow: 0 0 3px rgba(255, 215, 0, 0.5);
}

.char-modal-quick-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.char-modal-info-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--modal-badge-bg, #444);
  border-radius: 20px;
  font-size: 0.9rem;
}

.badge-label {
  color: var(--modal-subtext, #b0b0b0);
  font-size: 0.85rem;
}

.badge-value {
  color: var(--modal-text, #e0e0e0);
  font-weight: 600;
}

.tier-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}

.tier-s-plus { background: #ff6b6b; color: white; }
.tier-s { background: #f59e0b; color: white; }
.tier-a { background: #10b981; color: white; }
.tier-b { background: #3b82f6; color: white; }
.tier-c { background: #8b5cf6; color: white; }
.tier-d { background: #6b7280; color: white; }

.char-modal-priorities {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  padding-top: 12px;
  border-top: 1px solid var(--modal-border, #444);
}

.priority-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.priority-label {
  font-size: 0.85rem;
  color: var(--modal-subtext, #b0b0b0);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.priority-value {
  font-size: 1rem;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  text-align: center;
  min-width: 80px;
}

.char-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--modal-text, #e0e0e0);
  padding: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s, transform 0.2s;
  z-index: 1;
}

.char-modal-close:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.section-title {
  margin: 20px 0 16px 0;
  border-bottom: 1px solid var(--modal-border, #eee);
  padding-bottom: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--modal-heading, #333);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-weight: 500;
  color: var(--modal-label, #666);
  font-size: 0.9rem;
}

.info-value {
  font-weight: 600;
  color: var(--modal-text, #000);
}

.tier-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.9rem;
  text-align: center;
  max-width: fit-content;
}

.tier-s-plus { background: #ff6b6b; color: white; }
.tier-s { background: #ffa726; color: white; }
.tier-a { background: #66bb6a; color: white; }
.tier-b { background: #42a5f5; color: white; }
.tier-c { background: #ab47bc; color: white; }
.tier-d { background: #78909c; color: white; }
.tier-unrated { background: #e0e0e0; color: #666; }

.priority-essential { background: #4caf50; color: white; }
.priority-good { background: #2196f3; color: white; }
.priority-skip { background: #f44336; color: white; }

.element-tags, .weapon-tags, .character-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.element-tag, .weapon-tag, .character-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: var(--tag-bg, #e3f2fd);
  color: var(--tag-text, #1565c0);
}

/* ========================================
   ENHANCED MODAL BODY SECTIONS
   ======================================== */

.char-modal-body {
  padding: 0 24px 24px 24px;
}

.char-modal-section {
  margin-bottom: 32px;
  background: var(--modal-section-bg, #333);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--modal-border, #444);
  transition: background-color 0.3s ease;
}

/* Section highlight animation */
.char-modal-section.section-highlight {
  animation: highlight-fade 2s ease-out;
}

@keyframes highlight-fade {
  0% { 
    background-color: rgba(255, 235, 59, 0.3);
    border-color: rgba(255, 235, 59, 0.6);
  }
  100% { 
    background-color: var(--modal-section-bg, #333);
    border-color: var(--modal-border, #444);
  }
}

.char-modal-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--modal-heading, #fff);
  padding-bottom: 8px;
  border-bottom: 2px solid var(--primary-color, #4a9eff);
}

.section-icon {
  font-size: 1.1rem;
  opacity: 0.8;
}

/* ========================================
   WEAKNESSES DISPLAY
   ======================================== */

.char-modal-weaknesses {
  background: var(--modal-section-bg, #333);
  border: 1px solid var(--modal-border, #444);
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
}

.weakness-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.weakness-section:last-child {
  margin-bottom: 0;
}

.weakness-label {
  font-weight: 600;
  color: var(--modal-subtext, #b0b0b0);
  min-width: 80px;
  font-size: 0.9rem;
}

.weakness-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* ========================================
   AWAKENING STONES SECTION
   ======================================== */

.char-modal-stones-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 8px 0;
}

.char-modal-stone-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 80px;
  padding: 12px;
  background: var(--modal-bg, #2a2a2a);
  border-radius: 8px;
  border: 1px solid var(--modal-stone-border, #555);
}

.stone-label {
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--modal-subtext, #b0b0b0);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stone-value {
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  text-align: center;
  min-width: 50px;
}

/* ========================================
   SKILLS SECTION WITH COLOR CODING
   ======================================== */

.skills-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skill-group {
  background: var(--modal-bg, #2a2a2a);
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid transparent;
}

.skill-group-title {
  margin: 0 0 12px 0;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.skill-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skill-item {
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;
}

.skill-name {
  font-weight: 500;
  color: var(--modal-text, #e0e0e0);
}

/* Ultimate Skills - Gold/Orange Theme */
.ultimate-group {
  border-left-color: #f59e0b;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, var(--modal-bg, #2a2a2a) 100%);
}

.ultimate-title {
  color: #fbbf24;
}

.ultimate-skill {
  background: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.3);
}

.ultimate-skill .skill-name {
  color: #fbbf24;
  font-weight: 600;
}

/* Passive Skills - Green/Teal Theme */
.passive-group {
  border-left-color: #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, var(--modal-bg, #2a2a2a) 100%);
}

.passive-title {
  color: #34d399;
}

.passive-skill {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.3);
}

.passive-skill .skill-name {
  color: #34d399;
}

/* Active/Battle Skills - Blue Theme */
.active-group {
  border-left-color: #3b82f6;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, var(--modal-bg, #2a2a2a) 100%);
}

.active-title {
  color: #60a5fa;
}

.active-skill {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}

.active-skill .skill-name {
  color: #60a5fa;
}

/* Support Skills - Purple Theme */
.support-group {
  border-left-color: #8b5cf6;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, var(--modal-bg, #2a2a2a) 100%);
}

.support-title {
  color: #a78bfa;
}

.support-skill {
  background: rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.3);
}

.support-skill .skill-name {
  color: #a78bfa;
}

/* ========================================
   TAGS SECTION
   ======================================== */

.char-modal-badge-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.char-modal-tag {
  font-size: 0.85rem;
  font-weight: 500;
}

.char-modal-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  white-space: nowrap;
}

/* ========================================
   NOTES SECTION
   ======================================== */

.char-modal-notes {
  background: var(--modal-notes-bg, #333);
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid var(--primary-color, #4a9eff);
  line-height: 1.6;
  color: var(--modal-text, #e0e0e0);
  font-size: 0.95rem;
}

.char-modal-notes p {
  margin: 0;
}

.notes-section {
  background: var(--notes-bg, #f9f9f9);
  padding: 16px;
  border-radius: 6px;
  border-left: 4px solid var(--primary-color, #007bff);
  margin: 20px 0;
  line-height: 1.5;
  color: var(--modal-text, #333);
}

.markdown-content {
  padding: 10px;
  background: var(--markdown-bg, #f9f9f9);
  border-radius: 5px;
  line-height: 1.6;
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3 {
  color: var(--modal-heading, #333);
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.markdown-content h1 { font-size: 1.5rem; }
.markdown-content h2 { font-size: 1.3rem; }
.markdown-content h3 { font-size: 1.1rem; }

.character-overview {
  margin-bottom: 20px;
}

.character-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.compact-stats {
  background: var(--stats-bg, #f5f5f5);
  padding: 15px;
  border-radius: 6px;
}

.compact-stats h4 {
  margin: 0 0 10px 0;
  color: var(--modal-heading, #333);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--modal-label, #666);
  font-weight: 500;
}

.stat-value {
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--modal-text, #333);
}

.skill-item {
  margin: 15px 0;
  padding: 15px;
  background: var(--skill-bg, #ffffff);
  border: 1px solid var(--skill-border, #e0e0e0);
  border-radius: 6px;
}

.skill-content {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.skill-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.skill-icon-fallback {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--icon-fallback, #f0f0f0);
  border-radius: 4px;
  font-size: 16px;
}

.skill-details {
  flex: 1;
}

.skill-name {
  font-weight: bold;
  margin-bottom: 4px;
  color: var(--modal-heading, #333);
}

.skill-description {
  color: var(--modal-text, #666);
  line-height: 1.4;
}

.section-content {
  margin: 10px 0;
  line-height: 1.6;
}

/* ========================================
   THEME ADAPTATIONS
   ======================================== */

/* Light theme overrides */
body.light-theme .char-modal-container {
  --modal-bg: #ffffff;
  --modal-text: #2d3748;
  --modal-border: #e2e8f0;
  --modal-heading: #1a202c;
  --modal-subtext: #4a5568;
  --modal-label: #718096;
  --modal-section-bg: #f7fafc;
  --modal-badge-bg: #e2e8f0;
  --modal-badge-text: #2d3748;
  --modal-stone-bg: #f7fafc;
  --modal-stone-border: #cbd5e0;
  --modal-notes-bg: #f0fff4;
  --modal-notes-border: #38a169;
}

/* Light theme skill color adjustments */
body.light-theme .ultimate-group {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, #f7fafc 100%);
}

body.light-theme .passive-group {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, #f7fafc 100%);
}

body.light-theme .active-group {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, #f7fafc 100%);
}

body.light-theme .support-group {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, #f7fafc 100%);
}

body.light-theme .ultimate-title { color: #d69e2e; }
body.light-theme .passive-title { color: #38a169; }
body.light-theme .active-title { color: #3182ce; }
body.light-theme .support-title { color: #805ad5; }

body.light-theme .ultimate-skill { 
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.2);
}

body.light-theme .passive-skill {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.2);
}

body.light-theme .active-skill {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
}

body.light-theme .support-skill {
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.2);
}

body.light-theme .ultimate-skill .skill-name { color: #d69e2e; }
body.light-theme .passive-skill .skill-name { color: #38a169; }
body.light-theme .active-skill .skill-name { color: #3182ce; }
body.light-theme .support-skill .skill-name { color: #805ad5; }

/* Dark theme overrides */
body.dark-theme .char-modal-container {
  --modal-bg: #2d3748;
  --modal-text: #e2e8f0;
  --modal-border: #4a5568;
  --modal-heading: #f7fafc;
  --modal-subtext: #a0aec0;
  --modal-label: #718096;
  --modal-hover: rgba(255, 255, 255, 0.1);
  --tag-bg: #2d3748;
  --tag-text: #63b3ed;
  --stone-bg: #2d3748;
  --stone-border: #4a5568;
  --notes-bg: #2d3748;
  --markdown-bg: #2d3748;
  --stats-bg: #2d3748;
  --skill-bg: #2d3748;
  --skill-border: #4a5568;
  --icon-fallback: #4a5568;
}

/* ========================================
   RESPONSIVE DESIGN
   ======================================== */

@media (max-width: 768px) {
  .char-modal-container {
    margin: 10px;
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 20px);
    padding: 16px;
  }
  
  .char-modal-header {
    padding: 20px 16px;
    margin: -16px -16px 16px -16px;
  }
  
  .char-modal-body {
    padding: 0 16px 16px 16px;
  }
  
  .char-modal-hero {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .char-modal-portrait,
  .char-modal-portrait-placeholder {
    width: 80px;
    height: 80px;
  }
  
  .char-modal-name {
    font-size: 1.5rem;
  }
  
  .char-modal-quick-info {
    gap: 8px;
  }
  
  .char-modal-info-badge {
    font-size: 0.8rem;
    padding: 4px 8px;
  }
  
  .char-modal-section {
    padding: 16px;
    margin-bottom: 20px;
  }
  
  .char-modal-section-title {
    font-size: 1.1rem;
  }
  
  .char-modal-stones-row {
    gap: 12px;
  }
  
  .char-modal-stone-cell {
    min-width: 70px;
    padding: 8px;
  }
  
  .weakness-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .weakness-label {
    min-width: auto;
  }
  
  .skills-container {
    gap: 16px;
  }
  
  .skill-group {
    padding: 12px;
  }
  
  .skill-group-title {
    font-size: 0.9rem;
  }
  
  .skill-item {
    padding: 6px 10px;
  }
  
  .character-info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stones-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }
}

@media (max-width: 480px) {
  .char-modal-container {
    margin: 5px;
    max-width: calc(100vw - 10px);
    padding: 12px;
  }
  
  .char-modal-header {
    padding: 16px 12px;
    margin: -12px -12px 12px -12px;
  }
  
  .char-modal-body {
    padding: 0 12px 12px 12px;
  }
  
  .char-modal-name {
    font-size: 1.3rem;
  }
  
  .char-modal-section {
    padding: 12px;
    margin-bottom: 16px;
  }
  
  .char-modal-stones-row {
    gap: 8px;
  }
  
  .char-modal-stone-cell {
    min-width: 60px;
    padding: 6px;
  }
  
  .stone-label {
    font-size: 0.7rem;
  }
  
  .stone-value {
    font-size: 0.8rem;
    min-width: 40px;
  }
  
  .skill-item {
    padding: 4px 8px;
  }
  
  .weakness-badges .ui-weakness-badge {
    font-size: 0.75rem;
    padding: 2px 6px;
  }
}

/* Markdown Content Styles */
.char-modal-markdown {
  line-height: 1.6;
  font-size: 0.95rem;
  padding: 16px;
  background: var(--modal-section-bg, #333);
  border-radius: 8px;
}

/* Stats Table Styles */
.char-modal-markdown .stats-table-container {
  background: var(--modal-bg, #2a2a2a);
  border: 1px solid var(--modal-border, #444);
  border-radius: 8px;
  padding: 0;
  margin: 16px 0;
  overflow: hidden;
}

.char-modal-markdown .stats-table-container h4 {
  margin: 0;
  padding: 12px 16px;
  background: var(--modal-section-bg, #333);
  color: var(--modal-heading, #fff);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid var(--modal-border, #444);
}

.char-modal-markdown .stats-table {
  width: 100%;
  border-collapse: collapse;
}

.char-modal-markdown .stats-table tr {
  border-bottom: 1px solid var(--modal-border, #444);
}

.char-modal-markdown .stats-table tr:last-child {
  border-bottom: none;
}

.char-modal-markdown .stats-table td {
  padding: 10px 16px;
  text-align: left;
}

.char-modal-markdown .stats-table .stat-label {
  color: var(--modal-subtext, #b0b0b0);
  font-size: 0.9rem;
  font-weight: 500;
  width: 25%;
}

.char-modal-markdown .stats-table .stat-value {
  color: var(--modal-heading, #fff);
  font-size: 1.1rem;
  font-weight: bold;
  width: 25%;
}

@media (max-width: 600px) {
  .char-modal-markdown .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Element and Weapon Icon Classes */
.element-icon, .weapon-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  vertical-align: middle;
}

/* ========================================
   ICON FIXES & FALLBACKS
   ======================================== */

/* Ensure icons load correctly in modal context */
.char-modal-weaknesses .ui-element-icon,
.char-modal-weaknesses .ui-weapon-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

/* Icon fallback for missing images */
.char-modal-weaknesses .ui-element-icon:not([style]),
.char-modal-weaknesses .ui-weapon-icon:not([style]) {
  background: var(--text-tertiary, #888);
  border-radius: 2px;
  position: relative;
}

.char-modal-weaknesses .ui-element-icon:not([style]):before,
.char-modal-weaknesses .ui-weapon-icon:not([style]):before {
  content: '⚡';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  color: white;
}

.char-modal-weaknesses .ui-weapon-icon:not([style]):before {
  content: '⚔️';
}

/* Icon badges in modal */
.icon-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: var(--modal-badge-bg, #444);
  border-radius: 20px;
  font-size: 0.9rem;
  color: var(--modal-text, #e0e0e0);
  margin: 2px;
}

.icon-badge .element-icon,
.icon-badge .weapon-icon {
  margin-right: 6px;
}

/* Weaknesses Section */
.char-modal-markdown .weapons-elements-container {
  background: var(--modal-bg, #2a2a2a);
  border: 1px solid var(--modal-border, #444);
  border-radius: 8px;
  padding: 0;
  margin: 16px 0;
  overflow: hidden;
}

.char-modal-markdown .weapons-elements-container h4 {
  margin: 0;
  padding: 12px 16px;
  background: var(--modal-section-bg, #333);
  color: var(--modal-heading, #fff);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid var(--modal-border, #444);
}

.char-modal-markdown .attributes-content {
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}


/* Icon badges styling */
.char-modal-markdown .icon-badge.weakness-badge {
  background: var(--modal-badge-bg, #444);
  border-radius: 20px;
  color: var(--modal-text, #e0e0e0);
  font-size: 0.9rem;
}

/* Element-specific badge colors */
.char-modal-markdown .icon-badge.element-fire {
  background: rgba(255, 107, 107, 0.2) !important;
  border: 1px solid #ff6b6b !important;
}

.char-modal-markdown .icon-badge.element-ice {
  background: rgba(116, 192, 252, 0.2) !important;
  border: 1px solid #74c0fc !important;
}

.char-modal-markdown .icon-badge.element-lightning {
  background: rgba(255, 212, 59, 0.2) !important;
  border: 1px solid #ffd43b !important;
  color: var(--modal-bg, #2a2a2a) !important;
}

.char-modal-markdown .icon-badge.element-wind {
  background: rgba(81, 207, 102, 0.2) !important;
  border: 1px solid #51cf66 !important;
}

.char-modal-markdown .icon-badge.element-light {
  background: rgba(248, 249, 250, 0.2) !important;
  border: 1px solid #f8f9fa !important;
  color: var(--modal-bg, #2a2a2a) !important;
}

.char-modal-markdown .icon-badge.element-dark {
  background: rgba(52, 58, 64, 0.3) !important;
  border: 1px solid #343a40 !important;
}
</style>