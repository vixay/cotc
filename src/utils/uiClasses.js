/**
 * COTC Global UI Class Utilities
 * 
 * Functions to generate consistent UI class names across all components.
 * All functions return `ui-` prefixed classes from the global style library.
 */

import { paths } from './pathUtils.js'

/**
 * Get stone class for awakening stones
 * @param {string} stone - Stone value (U10, A1, A2, A3, A4, Shard, etc.)
 * @returns {string} UI class name
 */
export const getStoneClass = (stone) => {
  if (!stone || stone === '') return 'ui-stone-blank'
  
  const classMap = {
    'U10': 'ui-stone-u10',
    'A1': 'ui-stone-a1', 
    'A2': 'ui-stone-a2',
    'A3': 'ui-stone-a3',
    'A4': 'ui-stone-a4',
    'Shard': 'ui-stone-shard'
  }
  
  return classMap[stone] || 'ui-stone-none'
}

/**
 * Get tag class for character tags
 * @param {string} tag - Tag value (drayleb-must-pull, buffer, etc.)
 * @returns {string} UI class name
 */
export const getTagClass = (tag) => {
  if (!tag) return 'ui-tag-general'
  
  if (tag.startsWith('drayleb-')) {
    const tier = tag.replace('drayleb-', '')
    return `ui-tag-drayleb-${tier}`
  }
  
  return 'ui-tag-general'
}

/**
 * Get tier class for character tiers
 * @param {string} tier - Tier value (S+, S, A, B, C, D)
 * @returns {string} UI class name
 */
export const getTierClass = (tier) => {
  if (!tier) return 'ui-tier-unrated'
  
  const normalizedTier = tier.toLowerCase().replace('+', '-plus')
  return `ui-tier-${normalizedTier}`
}

/**
 * Get A4 priority class
 * @param {string} priority - Priority value (essential, good, skip)
 * @returns {string} UI class name
 */
export const getA4PriorityClass = (priority) => {
  if (!priority) return 'ui-priority-none'
  
  const classMap = {
    'essential': 'ui-a4-essential',
    'good': 'ui-a4-good',
    'skip': 'ui-a4-skip'
  }
  
  return classMap[priority] || 'ui-priority-none'
}

/**
 * Get Ultimate priority class
 * @param {string} priority - Priority value (essential, good, skip)
 * @returns {string} UI class name
 */
export const getUltPriorityClass = (priority) => {
  if (!priority) return 'ui-priority-none'
  
  const classMap = {
    'essential': 'ui-ult-essential',
    'good': 'ui-ult-good', 
    'skip': 'ui-ult-skip'
  }
  
  return classMap[priority] || 'ui-priority-none'
}

/**
 * Get element icon class
 * @param {string} element - Element name (Fire, Ice, Lightning, etc.)
 * @param {string} size - Size variant ('sm', 'only', or default)
 * @returns {string} UI class name
 */
export const getElementIconClass = (element, size = '') => {
  if (!element) return ''
  
  const baseClass = size === 'sm' ? 'ui-element-icon-sm' : 
                   size === 'only' ? 'ui-element-icon-only' : 
                   'ui-element-icon'
                   
  const elementClass = `ui-element-${element.toLowerCase()}`
  
  return `${baseClass} ${elementClass}`
}

/**
 * Get weapon icon class
 * @param {string} weapon - Weapon name (Sword, Bow, Axe, etc.)
 * @param {string} size - Size variant ('sm', 'only', or default)
 * @returns {string} UI class name
 */
export const getWeaponIconClass = (weapon, size = '') => {
  if (!weapon) return ''
  
  const baseClass = size === 'sm' ? 'ui-weapon-icon-sm' : 
                   size === 'only' ? 'ui-weapon-icon-only' : 
                   'ui-weapon-icon'
                   
  const weaponClass = `ui-weapon-${weapon.toLowerCase()}`
  
  return `${baseClass} ${weaponClass}`
}

/**
 * Get weakness badge class
 * @param {string} weakness - Weakness name (element or weapon)
 * @returns {string} UI class name
 */
export const getWeaknessClass = (weakness) => {
  if (!weakness) return 'ui-weakness-badge'
  
  const normalizedWeakness = weakness.toLowerCase()
  return `ui-weakness-badge ui-weakness-${normalizedWeakness}`
}

/**
 * Get character image path
 * @param {string} characterId - Character ID
 * @param {string} imageType - Image type (thumbnail, portrait, full, card)
 * @returns {string} Image path
 */
export const getCharacterImagePath = (characterId, imageType = 'portrait') => {
  if (!characterId) return ''
  
  // Normalize character ID for file system
  const normalizedId = characterId.toLowerCase().replace(/[^a-z0-9]/g, '_')
  
  const imageMap = {
    'thumbnail': paths.images(`characters/thumbnails/${normalizedId}.png`),
    'portrait': paths.images(`characters/portraits/${normalizedId}.png`),
    'full': paths.images(`characters/full/${normalizedId}.png`),
    'card': paths.images(`characters/cards/${normalizedId}.png`)
  }
  
  return imageMap[imageType] || imageMap.portrait
}

/**
 * Get character image class
 * @param {string} imageType - Image type (thumbnail, portrait, full, card)
 * @returns {string} UI class name
 */
export const getCharacterImageClass = (imageType = 'portrait') => {
  return `ui-character-image ui-character-${imageType}`
}

/**
 * Get character placeholder class
 * @param {string} imageType - Image type (thumbnail, portrait, full, card)
 * @returns {string} UI class name
 */
export const getCharacterPlaceholderClass = (imageType = 'portrait') => {
  return `ui-character-placeholder ui-character-placeholder-${imageType}`
}

/**
 * Get role tag class
 * @param {string} role - Role type
 * @param {boolean} isPrimary - Whether this is primary role
 * @returns {string} UI class name
 */
export const getRoleTagClass = (role, isPrimary = true) => {
  const baseClass = 'ui-role-tag'
  const roleClass = isPrimary ? 'ui-role-primary' : 'ui-role-secondary'
  
  return `${baseClass} ${roleClass}`
}

/**
 * Format tag display text
 * @param {string} tag - Tag value
 * @returns {string} Formatted tag text
 */
export const formatTag = (tag) => {
  if (!tag) return ''
  
  if (tag.startsWith('drayleb-')) {
    const tierMap = {
      'must-pull': 'MUST',
      'should-pull': 'REC', 
      'luxury': 'LUX',
      'skip': 'SKIP'
    }
    const tier = tag.replace('drayleb-', '')
    return tierMap[tier] || tier.toUpperCase()
  }
  
  // Format other tags - capitalize and replace hyphens
  return tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).substring(0, 8)
}

/**
 * Format tag display text for modal (full names)
 * @param {string} tag - Tag value
 * @returns {string} Formatted tag text
 */
export const formatModalTag = (tag) => {
  if (!tag) return ''
  
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
  
  // Format other tags - capitalize and replace hyphens  
  return tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Format priority display text
 * @param {string} priority - Priority value
 * @param {string} type - Priority type ('a4' or 'ult')
 * @returns {string} Formatted priority text
 */
export const formatPriority = (priority, type = 'ult') => {
  if (!priority) return '-'
  
  if (priority === 'skip') return 'SKIP'
  
  if (type === 'a4') {
    const formatMap = {
      'essential': 'ESSENTIAL',
      'good': 'GOOD'
    }
    return formatMap[priority] || priority.toUpperCase()
  }
  
  // For ultimate priorities (L10, L10 First, etc.)
  return priority.toUpperCase()
}

/**
 * Format A4 priority display text
 * @param {string} priority - A4 priority value
 * @returns {string} Formatted priority text
 */
export const formatA4Priority = (priority) => {
  return formatPriority(priority, 'a4')
}

/**
 * Format Ultimate priority display text
 * @param {string} priority - Ultimate priority value
 * @returns {string} Formatted priority text
 */
export const formatUltPriority = (priority) => {
  return formatPriority(priority, 'ult')
}

/**
 * Generate badge group classes
 * @param {boolean} compact - Whether to use compact spacing
 * @returns {string} Badge group class name
 */
export const getBadgeGroupClass = (compact = false) => {
  return compact ? 'ui-badge-group-compact' : 'ui-badge-group'
}

/**
 * Generate badge classes with variant
 * @param {string} variant - Badge variant (primary, secondary, success, etc.)
 * @returns {string} Badge class name
 */
export const getBadgeClass = (variant = 'secondary') => {
  return `ui-badge ui-badge-${variant}`
}

/**
 * Utility to combine multiple UI classes
 * @param {...string} classes - Class names to combine
 * @returns {string} Combined class string
 */
export const combineUiClasses = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

/**
 * Get element/weapon list classes for table displays
 * @param {string} type - 'element' or 'weapon'
 * @returns {object} Object with list class and item classes
 */
export const getIconListClasses = (type) => {
  return {
    listClass: `${type}-list ui-flex ui-gap-2 ui-flex-wrap ui-items-center`,
    iconClass: type === 'element' ? 'ui-element-icon-only' : 'ui-weapon-icon-only'
  }
}

/**
 * Get skill type class based on skill category
 * @param {string} skillType - Type of skill ('ultimate', 'passive', 'active', 'support')
 * @returns {string} UI class name
 */
export const getSkillTypeClass = (skillType) => {
  if (!skillType) return 'ui-skill-active'
  
  const classMap = {
    'ultimate': 'ui-skill-ultimate',
    'passive': 'ui-skill-passive', 
    'active': 'ui-skill-active',
    'battle': 'ui-skill-active',
    'support': 'ui-skill-support'
  }
  
  return classMap[skillType.toLowerCase()] || 'ui-skill-active'
}

/**
 * Classify skill name to determine its type
 * @param {string} skillName - Name of the skill
 * @returns {string} Skill type ('ultimate', 'passive', 'active', 'support')
 */
export const classifySkillType = (skillName) => {
  if (!skillName) return 'active'
  
  const name = skillName.toLowerCase()
  
  // Ultimate indicators
  if (name.includes('ultimate') || name.includes('limit') || name.includes('awakening')) {
    return 'ultimate'
  }
  
  // Passive indicators
  if (name.includes('passive') || name.includes('aura') || name.includes('potential') || 
      name.includes('mastery') || name.includes('expertise') || name.includes('resilience') ||
      name.includes('boost') || name.includes('enhancement')) {
    return 'passive'
  }
  
  // Support indicators
  if (name.includes('heal') || name.includes('restore') || name.includes('buff') || 
      name.includes('barrier') || name.includes('protect') || name.includes('blessing') ||
      name.includes('recovery') || name.includes('revive') || name.includes('cure')) {
    return 'support'
  }
  
  // Default to active/battle skill
  return 'active'
}

/**
 * Get skill group title based on skill type
 * @param {string} skillType - Type of skill
 * @returns {string} Formatted group title
 */
export const getSkillGroupTitle = (skillType) => {
  const titleMap = {
    'ultimate': 'Ultimate Skills',
    'passive': 'Passive Abilities', 
    'active': 'Battle Skills',
    'battle': 'Battle Skills',
    'support': 'Support Skills'
  }
  
  return titleMap[skillType.toLowerCase()] || 'Skills'
}

/**
 * Get stat icon class based on stat type
 * @param {string} statType - Type of stat (HP, SP, PATK, PDEF, EATK, EDEF, CRIT, SPD)
 * @param {string} size - Size variant ('sm', 'only', or default)
 * @returns {string} UI class name
 */
export const getStatIconClass = (statType, size = '') => {
  if (!statType) return ''
  
  const baseClass = size === 'sm' ? 'ui-stat-icon-sm' : 
                   size === 'only' ? 'ui-stat-icon-only' : 
                   'ui-stat-icon'
                   
  const statClass = `ui-stat-${statType.toLowerCase()}`
  
  return `${baseClass} ${statClass}`
}

/**
 * Get stat icon path based on stat type
 * Official icons sourced from COTC Wiki: https://octopathtraveler.fandom.com/wiki/Status_Effects_(Champions_of_the_Continent)
 * @param {string} statType - Type of stat
 * @returns {string} Icon path or empty string if no icon available
 */
export const getStatIconPath = (statType) => {
  const iconMap = {
    'patk': paths.images('icons/stat_boosts/Phys_Atk_Up.png'),
    'eatk': paths.images('icons/stat_boosts/Elem_Atk_Up.png'), 
    'crit': paths.images('icons/stat_boosts/Crit_Up.png'),
    'sp': paths.images('icons/healing_recovery/SP_Stock.png'),
    'hp': paths.images('icons/healing_recovery/HP_Barrier.png'),
    'spd': paths.images('icons/stat_boosts/Speed_Up.png'),
    'speed': paths.images('icons/stat_boosts/Speed_Up.png'),
    'edef': paths.images('icons/stat_boosts/Elem_Def_Up.png'),
    'pdef': paths.images('icons/stat_boosts/Phys_Def_Up.png')
  }
  
  return iconMap[statType.toLowerCase()] || ''
}

/**
 * Format stat display with optional icon
 * @param {string} statType - Type of stat
 * @param {number} value - Stat value
 * @param {boolean} showIcon - Whether to show icon
 * @returns {string} Formatted stat HTML
 */
export const formatStatWithIcon = (statType, value, showIcon = true) => {
  if (!statType || !value || value <= 0) return ''
  
  const iconPath = showIcon ? getStatIconPath(statType) : ''
  const iconHtml = iconPath ? `<img src="${iconPath}" class="ui-stat-icon-sm" alt="${statType}" />` : ''
  const statText = `${statType.toUpperCase()}: ${value}`
  
  return `<span class="ui-stat-item">${iconHtml}${statText}</span>`
}

/**
 * Format multiple stats with icons
 * @param {Object} stats - Stats object with stat types as keys and values as numbers
 * @param {boolean} showIcons - Whether to show icons
 * @returns {string} Formatted stats HTML
 */
export const formatStatsWithIcons = (stats, showIcons = true) => {
  if (!stats || typeof stats !== 'object') return '<span style="color: var(--text-tertiary);">No stats</span>'
  
  const statEntries = Object.entries(stats)
    .filter(([key, value]) => value > 0)
    .map(([key, value]) => formatStatWithIcon(key, value, showIcons))
    .filter(Boolean)
  
  return statEntries.length > 0 ? statEntries.join('') : '<span style="color: var(--text-tertiary);">No stats</span>'
}