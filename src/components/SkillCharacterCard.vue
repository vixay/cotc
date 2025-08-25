<template>
  <div class="skill-character-card" :class="{ highlighted: isHighlighted }">
    <div class="character-header">
      <div class="character-avatar">
        <img
          :src="getCharacterPortrait(character.id)"
          :alt="character.name"
          class="character-portrait"
          @error="handleImageError"
        />
        <div v-if="character.starRating" class="star-rating">
          {{ character.starRating }}★
        </div>
      </div>
      
      <div class="character-info">
        <h3 class="character-name">
          {{ character.name }}
          <span v-if="character.name.includes('EX')" class="ex-badge">EX</span>
        </h3>
        
        <div class="character-meta">
          <span v-if="character.job" class="character-job">{{ character.job }}</span>
          <span v-if="character.tierRatings?.gl?.tier" class="character-tier" :class="getTierClass(character.tierRatings.gl.tier)">
            {{ character.tierRatings.gl.tier }}
          </span>
          <span v-if="character.isFree" class="free-badge">FREE</span>
        </div>

        <div class="character-priority">
          <span v-if="character.ultPriority" class="priority-badge" :class="getPriorityClass(character.ultPriority)">
            {{ formatPriority(character.ultPriority) }}
          </span>
        </div>
      </div>

      <div class="character-actions">
        <button 
          class="favorite-btn"
          :class="{ active: isFavorite }"
          @click="toggleFavorite"
          :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
        >
          {{ isFavorite ? '❤️' : '🤍' }}
        </button>
        <button 
          class="expand-btn"
          @click="toggleExpanded"
          :title="isExpanded ? 'Collapse details' : 'Show details'"
        >
          {{ isExpanded ? '▲' : '▼' }}
        </button>
      </div>
    </div>

    <!-- Character Elements & Weapons -->
    <div class="character-combat-info">
      <div v-if="character.elements" class="combat-section">
        <div class="section-label">Elements:</div>
        <div class="element-icons">
          <span
            v-for="element in character.elements"
            :key="element"
            class="element-icon"
            :class="getElementClass(element)"
            :title="element"
          >
            <img :src="getElementIcon(element)" :alt="element" />
          </span>
        </div>
      </div>

      <div v-if="character.weapons" class="combat-section">
        <div class="section-label">Weapons:</div>
        <div class="weapon-icons">
          <span
            v-for="weapon in character.weapons"
            :key="weapon"
            class="weapon-icon"
            :title="weapon"
          >
            <img :src="getWeaponIcon(weapon)" :alt="weapon" />
          </span>
        </div>
      </div>

      <div v-if="character.weaknesses" class="combat-section">
        <div class="section-label">Weaknesses:</div>
        <div class="weakness-badges">
          <span
            v-for="weakness in character.weaknesses.slice(0, 4)"
            :key="weakness"
            class="weakness-badge"
            :class="getWeaknessClass(weakness)"
            :title="`Weak to ${weakness}`"
          >
            {{ weakness }}
          </span>
          <span v-if="character.weaknesses.length > 4" class="more-weaknesses">
            +{{ character.weaknesses.length - 4 }}
          </span>
        </div>
      </div>
    </div>

    <!-- Matching Skills Section -->
    <div v-if="matchingSkills.length > 0" class="matching-skills-section">
      <div class="section-header">
        <div class="section-title">
          🎯 Matching Skills
          <span class="skill-count">{{ matchingSkills.length }}</span>
        </div>
        <button 
          v-if="matchingSkills.length > 3"
          class="show-all-btn"
          @click="showAllSkills = !showAllSkills"
        >
          {{ showAllSkills ? 'Show Less' : 'Show All' }}
        </button>
      </div>

      <div class="skills-list">
        <div
          v-for="(skill, index) in displayedSkills"
          :key="`${skill.name}-${index}`"
          class="skill-match"
          :class="getSkillTypeClass(skill.type)"
        >
          <div class="skill-header">
            <div class="skill-name">
              {{ skill.name }}
              <span v-if="skill.type" class="skill-type-badge" :class="skill.type">
                {{ skill.type.toUpperCase() }}
              </span>
            </div>
            <div v-if="skill.sp_cost" class="skill-cost">
              {{ skill.sp_cost }} SP
            </div>
          </div>
          
          <div class="skill-description">{{ skill.description }}</div>
          
          <div v-if="skill.matchedTags && skill.matchedTags.length > 0" class="skill-tags">
            <span
              v-for="tag in skill.matchedTags.slice(0, 4)"
              :key="tag"
              class="skill-tag"
              :class="getTagCategory(tag)"
              :title="getTagDescription(tag)"
            >
              {{ formatTagName(tag) }}
            </span>
            <span v-if="skill.matchedTags.length > 4" class="more-tags">
              +{{ skill.matchedTags.length - 4 }}
            </span>
          </div>

          <div v-if="skill.potency || skill.hits" class="skill-stats">
            <span v-if="skill.potency" class="skill-potency">
              Potency: {{ skill.potency }}
            </span>
            <span v-if="skill.hits" class="skill-hits">
              {{ skill.hits }} hits
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- All Skills Summary (when expanded) -->
    <div v-if="isExpanded" class="expanded-content">
      <div class="skills-summary">
        <div class="summary-section">
          <h4>All Skills Summary</h4>
          <div class="skill-type-counts">
            <div v-if="character.skills?.passive?.length" class="skill-count">
              <span class="count-number">{{ character.skills.passive.length }}</span>
              <span class="count-label">Passive</span>
            </div>
            <div v-if="character.skills?.battle?.length" class="skill-count">
              <span class="count-number">{{ character.skills.battle.length }}</span>
              <span class="count-label">Battle</span>
            </div>
            <div v-if="character.skills?.ultimate?.length" class="skill-count">
              <span class="count-number">{{ character.skills.ultimate.length }}</span>
              <span class="count-label">Ultimate</span>
            </div>
          </div>
        </div>

        <div v-if="character.a4Accessory" class="accessory-section">
          <h4>A4 Accessory</h4>
          <div class="accessory-info">
            <div class="accessory-name">{{ character.a4Accessory.name }}</div>
            <div v-if="character.a4Accessory.stats" class="accessory-stats">
              <span
                v-for="(value, stat) in character.a4Accessory.stats"
                :key="stat"
                class="stat-bonus"
              >
                {{ stat }}: +{{ value }}
              </span>
            </div>
            <div v-if="character.a4Accessory.effects" class="accessory-effects">
              <div
                v-for="effect in character.a4Accessory.effects"
                :key="effect"
                class="accessory-effect"
              >
                {{ effect }}
              </div>
            </div>
          </div>
        </div>

        <div class="tag-cloud">
          <h4>All Effect Tags</h4>
          <div class="all-tags">
            <span
              v-for="tag in getAllCharacterTags()"
              :key="tag.name"
              class="character-tag"
              :class="getTagCategory(tag.name)"
              :title="getTagDescription(tag.name)"
            >
              {{ formatTagName(tag.name) }}
              <span v-if="tag.source === 'skill_ai_extraction'" class="ai-tag">🤖</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Score (debug mode only) -->
    <div v-if="showDebugInfo && character._searchScore" class="debug-info">
      Search Score: {{ Math.round(character._searchScore * 100) / 100 }}
    </div>
  </div>
</template>

<script>
import { ref, computed, inject } from 'vue'
import { paths } from '../utils/pathUtils'

export default {
  name: 'SkillCharacterCard',
  props: {
    character: {
      type: Object,
      required: true
    },
    matchingSkills: {
      type: Array,
      default: () => []
    },
    isHighlighted: {
      type: Boolean,
      default: false
    },
    showDebugInfo: {
      type: Boolean,
      default: false
    }
  },
  emits: ['favorite-toggled', 'character-selected'],
  setup(props, { emit }) {
    // Inject global services if available
    const favorites = inject('favorites', null)
    
    // State
    const isExpanded = ref(false)
    const showAllSkills = ref(false)

    // Computed properties
    const isFavorite = computed(() => {
      return favorites ? favorites.has(props.character.id) : false
    })

    const displayedSkills = computed(() => {
      if (showAllSkills.value) {
        return props.matchingSkills
      }
      return props.matchingSkills.slice(0, 3)
    })

    // Methods
    const toggleFavorite = () => {
      if (favorites) {
        if (favorites.has(props.character.id)) {
          favorites.delete(props.character.id)
        } else {
          favorites.add(props.character.id)
        }
      }
      emit('favorite-toggled', props.character.id, !isFavorite.value)
    }

    const toggleExpanded = () => {
      isExpanded.value = !isExpanded.value
      if (isExpanded.value) {
        emit('character-selected', props.character)
      }
    }

    const getCharacterPortrait = (characterId) => {
      return paths.images(`characters/portraits/${characterId}.png`)
    }

    const handleImageError = (event) => {
      event.target.src = paths.images('characters/portraits/default.png')
    }

    const getTierClass = (tier) => {
      const tierMap = {
        'S+': 'tier-s-plus',
        'S': 'tier-s',
        'A': 'tier-a', 
        'B': 'tier-b',
        'C': 'tier-c',
        'D': 'tier-d'
      }
      return tierMap[tier] || 'tier-unknown'
    }

    const getPriorityClass = (priority) => {
      const priorityMap = {
        'essential': 'priority-essential',
        'good': 'priority-good',
        'skip': 'priority-skip'
      }
      return priorityMap[priority] || 'priority-unknown'
    }

    const formatPriority = (priority) => {
      const priorityMap = {
        'essential': 'Must Pull',
        'good': 'Should Pull',
        'skip': 'Skip'
      }
      return priorityMap[priority] || priority
    }

    const getElementClass = (element) => {
      return `element-${element.toLowerCase()}`
    }

    const getElementIcon = (element) => {
      return paths.images(`elements/${element}.png`)
    }

    const getWeaponIcon = (weapon) => {
      // Handle weapon name variations
      const weaponMap = {
        'Spear': 'Spear_Polearm',
        'Polearm': 'Spear_Polearm',
        'Staff': 'Staff_Staves'
      }
      const fileName = weaponMap[weapon] || weapon
      return paths.images(`weapons/${fileName}.png`)
    }

    const getWeaknessClass = (weakness) => {
      const isElement = ['Fire', 'Ice', 'Lightning', 'Wind', 'Light', 'Dark'].includes(weakness)
      if (isElement) {
        return `weakness-element weakness-${weakness.toLowerCase()}`
      }
      return `weakness-weapon weakness-${weakness.toLowerCase()}`
    }

    const getSkillTypeClass = (skillType) => {
      return `skill-type-${skillType || 'unknown'}`
    }

    const getTagCategory = (tagName) => {
      if (tagName.includes('dmg') || tagName.includes('damage')) return 'tag-damage'
      if (tagName.includes('buff') || tagName.includes('_up')) return 'tag-buff'
      if (tagName.includes('debuff') || tagName.includes('_down')) return 'tag-debuff'
      if (tagName.includes('heal') || tagName.includes('recovery')) return 'tag-heal'
      if (tagName.includes('target')) return 'tag-target'
      if (tagName.includes('trigger')) return 'tag-trigger'
      return 'tag-misc'
    }

    const getTagDescription = (tagName) => {
      const descriptions = {
        'dmg_fire': 'Deals fire elemental damage',
        'dmg_ice': 'Deals ice elemental damage',
        'dmg_lightning': 'Deals lightning elemental damage',
        'buff_stats_patk_up': 'Increases physical attack stat',
        'buff_stats_eatk_up': 'Increases elemental attack stat',
        'heal_hp': 'Restores health points',
        'heal_sp': 'Restores skill points',
        'target_ally_all': 'Affects all allies',
        'target_enemy_single': 'Targets single enemy'
      }
      return descriptions[tagName] || 'Effect tag'
    }

    const formatTagName = (tagName) => {
      return tagName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    const getAllCharacterTags = () => {
      const allTags = []
      
      if (props.character.tags) {
        for (const category of ['effects', 'targeting', 'triggers', 'meta', 'accessories']) {
          if (props.character.tags[category]) {
            for (const tag of props.character.tags[category]) {
              if (typeof tag === 'string') {
                allTags.push({ name: tag, source: 'manual' })
              } else if (tag.name) {
                allTags.push({ 
                  name: tag.name, 
                  source: tag.source || 'unknown',
                  confidence: tag.confidence
                })
              }
            }
          }
        }
      }

      return allTags
    }

    return {
      // State
      isExpanded,
      showAllSkills,
      
      // Computed
      isFavorite,
      displayedSkills,
      
      // Methods
      toggleFavorite,
      toggleExpanded,
      getCharacterPortrait,
      handleImageError,
      getTierClass,
      getPriorityClass,
      formatPriority,
      getElementClass,
      getElementIcon,
      getWeaponIcon,
      getWeaknessClass,
      getSkillTypeClass,
      getTagCategory,
      getTagDescription,
      formatTagName,
      getAllCharacterTags
    }
  }
}
</script>

<style scoped>
.skill-character-card {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.skill-character-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.skill-character-card.highlighted {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 1px var(--primary-color);
}

.character-header {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 15px;
}

.character-avatar {
  position: relative;
  flex-shrink: 0;
}

.character-portrait {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--bg-tertiary);
  border: 2px solid var(--border-color);
}

.star-rating {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--warning-color);
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: bold;
}

.character-info {
  flex: 1;
  min-width: 0;
}

.character-name {
  margin: 0 0 6px 0;
  font-size: 1.2rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.ex-badge {
  background: linear-gradient(135deg, #ff6b6b, #ffa726);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.character-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.character-job {
  padding: 3px 8px;
  background: var(--primary-color);
  color: white;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.character-tier {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.tier-s-plus { background: #ff4757; color: white; }
.tier-s { background: #ffa726; color: white; }
.tier-a { background: #26de81; color: white; }
.tier-b { background: #45aaf2; color: white; }
.tier-c { background: #a55eea; color: white; }
.tier-d { background: #778ca3; color: white; }

.free-badge {
  padding: 3px 8px;
  background: var(--success-color);
  color: white;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.character-priority {
  margin-top: 4px;
}

.priority-badge {
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
}

.priority-essential { background: var(--danger-color); color: white; }
.priority-good { background: var(--warning-color); color: white; }
.priority-skip { background: var(--text-tertiary); color: white; }

.character-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.favorite-btn,
.expand-btn {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-secondary);
}

.favorite-btn:hover,
.expand-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.favorite-btn.active {
  color: #e74c3c;
}

.character-combat-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 15px;
  padding: 12px;
  background: var(--bg-primary);
  border-radius: 6px;
}

.combat-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.element-icons,
.weapon-icons {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.element-icon,
.weapon-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.element-icon img,
.weapon-icon img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.weakness-badges {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.weakness-badge {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
}

.weakness-element { background: rgba(255, 107, 107, 0.2); color: #e74c3c; border: 1px solid #e74c3c; }
.weakness-weapon { background: rgba(116, 185, 255, 0.2); color: #3498db; border: 1px solid #3498db; }

.more-weaknesses {
  font-size: 0.7rem;
  color: var(--text-tertiary);
  font-style: italic;
}

.matching-skills-section {
  border-top: 1px solid var(--border-color);
  padding-top: 15px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-weight: bold;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 8px;
}

.skill-count {
  background: var(--primary-color);
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: normal;
}

.show-all-btn {
  padding: 4px 8px;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.show-all-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skill-match {
  background: var(--bg-primary);
  border-radius: 6px;
  padding: 12px;
  border-left: 4px solid var(--success-color);
  transition: all 0.2s;
}

.skill-match:hover {
  transform: translateX(2px);
}

.skill-type-passive { border-left-color: #9b59b6; }
.skill-type-battle { border-left-color: #3498db; }
.skill-type-ultimate { border-left-color: #e74c3c; }

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
}

.skill-name {
  font-weight: bold;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.skill-type-badge {
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.6rem;
  font-weight: bold;
}

.skill-type-badge.passive { background: #9b59b6; color: white; }
.skill-type-badge.battle { background: #3498db; color: white; }
.skill-type-badge.ultimate { background: #e74c3c; color: white; }

.skill-cost {
  background: var(--warning-color);
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: bold;
}

.skill-description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 8px;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 6px;
}

.skill-tag {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
}

.tag-damage { background: rgba(231, 76, 60, 0.2); color: #e74c3c; }
.tag-buff { background: rgba(46, 204, 113, 0.2); color: #27ae60; }
.tag-debuff { background: rgba(230, 126, 34, 0.2); color: #e67e22; }
.tag-heal { background: rgba(52, 152, 219, 0.2); color: #2980b9; }
.tag-target { background: rgba(155, 89, 182, 0.2); color: #8e44ad; }
.tag-trigger { background: rgba(241, 196, 15, 0.2); color: #f39c12; }
.tag-misc { background: rgba(149, 165, 166, 0.2); color: #7f8c8d; }

.more-tags {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  font-style: italic;
}

.skill-stats {
  display: flex;
  gap: 12px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.skill-potency,
.skill-hits {
  background: var(--bg-secondary);
  padding: 2px 6px;
  border-radius: 8px;
}

.expanded-content {
  border-top: 1px solid var(--border-color);
  padding-top: 15px;
  margin-top: 15px;
}

.skills-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.summary-section h4,
.accessory-section h4,
.tag-cloud h4 {
  margin: 0 0 10px 0;
  color: var(--primary-color);
  font-size: 1rem;
}

.skill-type-counts {
  display: flex;
  gap: 15px;
}

.skill-count {
  text-align: center;
}

.count-number {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.count-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.accessory-info {
  background: var(--bg-primary);
  padding: 10px;
  border-radius: 6px;
}

.accessory-name {
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.accessory-stats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.stat-bonus {
  background: var(--success-color);
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.8rem;
}

.accessory-effects {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.accessory-effect {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.3;
}

.all-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.character-tag {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.ai-tag {
  font-size: 0.7rem;
}

.debug-info {
  margin-top: 10px;
  padding: 8px;
  background: rgba(255, 193, 7, 0.1);
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--warning-color);
  border: 1px solid var(--warning-color);
}

/* Responsive Design */
@media (max-width: 768px) {
  .character-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .character-combat-info {
    grid-template-columns: 1fr;
  }
  
  .skills-summary {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
}
</style>