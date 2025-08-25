/**
 * Universal Tagging System - Frontend Utilities
 * 
 * Provides comprehensive tag-based search, filtering, and analysis
 * capabilities for the COTC Meta Guide.
 */

import debug from './debug'

export class TagSystem {
  constructor(taxonomy = null) {
    this.taxonomy = taxonomy || this.getDefaultTaxonomy()
    this.searchIndex = this.buildSearchIndex()
    this.teamPatterns = this.buildTeamSearchPatterns()
  }

  /**
   * Default taxonomy for immediate use
   */
  getDefaultTaxonomy() {
    return {
      // Core effect tags
      'buff_stats_patk_up': { category: 'effects', description: 'Increases physical attack' },
      'buff_stats_eatk_up': { category: 'effects', description: 'Increases elemental attack' },
      'buff_stats_pdef_up': { category: 'effects', description: 'Increases physical defense' },
      'buff_stats_edef_up': { category: 'effects', description: 'Increases elemental defense' },
      'dmg_fire': { category: 'effects', description: 'Deals fire damage' },
      'dmg_ice': { category: 'effects', description: 'Deals ice damage' },
      'dmg_lightning': { category: 'effects', description: 'Deals lightning damage' },
      'dmg_aoe': { category: 'effects', description: 'Area of effect damage' },
      'heal_hp': { category: 'effects', description: 'Restores HP' },
      'heal_sp': { category: 'effects', description: 'Restores SP' },
      'bp_generation': { category: 'effects', description: 'Generates BP' },
      'sp_recovery': { category: 'effects', description: 'Automatic SP recovery' },
      
      // Targeting tags
      'target_ally_all': { category: 'targeting', description: 'Affects all allies' },
      'target_ally_front_row': { category: 'targeting', description: 'Affects front row allies' },
      'target_enemy_single': { category: 'targeting', description: 'Single enemy target' },
      'target_enemy_all': { category: 'targeting', description: 'All enemies' },
      
      // Meta tags
      'meta_current': { category: 'meta', description: 'Currently meta-relevant' },
      'meta_buffer': { category: 'meta', description: 'Meta buffer role' },
      'meta_dps': { category: 'meta', description: 'Meta DPS role' },
      'meta_support': { category: 'meta', description: 'Meta support role' },
      
      // Synergy tags
      'synergy_buff_stacking': { category: 'synergy', description: 'Works well with buff stackers' },
      'synergy_elemental_team': { category: 'synergy', description: 'Synergizes with elemental teams' }
    }
  }

  /**
   * Search characters by selected tags
   */
  searchByTags(characters, selectedTags, mode = 'AND') {
    if (!selectedTags || selectedTags.length === 0) {
      return characters
    }

    debug.tags.log(`Searching ${characters.length} characters with tags:`, selectedTags, `Mode: ${mode}`)

    const results = characters.filter(character => {
      const characterTags = this.getAllTagsForCharacter(character)
      
      if (mode === 'AND') {
        return selectedTags.every(tag => characterTags.includes(tag))
      } else if (mode === 'OR') {
        return selectedTags.some(tag => characterTags.includes(tag))
      }
      
      return false
    })

    debug.tags.log(`Found ${results.length} matching characters`)
    return results
  }

  /**
   * Get all tags for a character (flattened from all categories)
   */
  getAllTagsForCharacter(character) {
    const tags = []
    
    if (!character.tags) {
      return tags
    }

    // Handle legacy format (simple array)
    if (Array.isArray(character.tags)) {
      return character.tags.filter(tag => typeof tag === 'string')
    }

    // Handle v3 format (structured object)
    if (typeof character.tags === 'object') {
      Object.values(character.tags).forEach(tagCategory => {
        if (Array.isArray(tagCategory)) {
          tagCategory.forEach(tagItem => {
            if (typeof tagItem === 'string') {
              tags.push(tagItem)
            } else if (tagItem && tagItem.name) {
              tags.push(tagItem.name)
            }
          })
        }
      })
    }
    
    return [...new Set(tags)] // Remove duplicates
  }

  /**
   * Get tags by category for a character
   */
  getTagsByCategory(character, category) {
    if (!character.tags || typeof character.tags !== 'object' || Array.isArray(character.tags)) {
      return []
    }

    const categoryTags = character.tags[category]
    if (!Array.isArray(categoryTags)) {
      return []
    }

    return categoryTags.map(tag => typeof tag === 'string' ? tag : tag.name).filter(Boolean)
  }

  /**
   * Find similar tags for autocomplete
   */
  suggestTags(query, limit = 10) {
    if (!query || query.length < 2) {
      return []
    }

    const suggestions = []
    const queryLower = query.toLowerCase()

    Object.entries(this.taxonomy).forEach(([tagName, tagData]) => {
      const score = this.calculateRelevanceScore(tagName, query)
      if (score > 0) {
        suggestions.push({
          name: tagName,
          category: tagData.category,
          description: tagData.description,
          score
        })
      }
    })

    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  /**
   * Calculate relevance score for tag suggestions
   */
  calculateRelevanceScore(tagName, query) {
    const tagLower = tagName.toLowerCase()
    const queryLower = query.toLowerCase()

    // Exact match gets highest score
    if (tagLower === queryLower) return 100

    // Starts with query gets high score
    if (tagLower.startsWith(queryLower)) return 80

    // Contains query gets medium score
    if (tagLower.includes(queryLower)) return 60

    // Word boundary matches get lower score
    const words = tagLower.split('_')
    for (const word of words) {
      if (word.startsWith(queryLower)) return 40
      if (word.includes(queryLower)) return 20
    }

    return 0
  }

  /**
   * Build search index for fast lookups
   */
  buildSearchIndex() {
    const index = {
      byCategory: {},
      byKeyword: {}
    }

    Object.entries(this.taxonomy).forEach(([tagName, tagData]) => {
      const category = tagData.category || 'uncategorized'
      
      if (!index.byCategory[category]) {
        index.byCategory[category] = []
      }
      index.byCategory[category].push(tagName)

      // Index by keywords
      const keywords = [
        ...tagName.split('_'),
        ...(tagData.description || '').toLowerCase().split(' ')
      ]

      keywords.forEach(keyword => {
        if (keyword.length > 2) {
          if (!index.byKeyword[keyword]) {
            index.byKeyword[keyword] = []
          }
          index.byKeyword[keyword].push(tagName)
        }
      })
    })

    return index
  }

  /**
   * Build predefined team search patterns
   */
  buildTeamSearchPatterns() {
    return {
      // Common team archetypes
      physical_team: {
        name: 'Physical Team',
        required: ['dmg_physical', 'buff_stats_patk_up'],
        optional: ['resist_down_sword', 'resist_down_axe', 'break_boost'],
        description: 'Physical damage-focused team'
      },
      elemental_team: {
        name: 'Elemental Team', 
        required: ['dmg_elemental', 'buff_stats_eatk_up'],
        optional: ['resist_down_fire', 'resist_down_ice', 'elemental_synergy'],
        description: 'Elemental damage-focused team'
      },
      support_core: {
        name: 'Support Core',
        required: ['heal_hp', 'buff_stats_up'],
        optional: ['cleanse_ailments', 'buff_extend_giver', 'sp_recovery'],
        description: 'Support and healing focused team'
      },
      break_team: {
        name: 'Break Team',
        required: ['break_boost', 'weakness_exploit'],
        optional: ['break_damage', 'multi_hit', 'speed_manipulation'],
        description: 'Break-focused strategy team'
      },

      // Content-specific patterns
      ex3_clear: {
        name: 'EX3 Clear Team',
        required: ['meta_current', 'dmg_aoe'],
        optional: ['immunity_ailments', 'damage_reduction', 'revive'],
        description: 'Team optimized for EX3 content'
      },
      fire_weakness_boss: {
        name: 'Fire Weakness Boss',
        required: ['dmg_fire', 'resist_down_fire'],
        optional: ['meta_fire_weak', 'fire_synergy', 'elemental_boost'],
        description: 'Team for fire-weak bosses'
      },
      
      // Role-based patterns
      buff_stack_team: {
        name: 'Buff Stacking Team',
        required: ['buff_extend_giver', 'buff_stats_up'],
        optional: ['multiple_buffs', 'buff_synergy', 'long_duration'],
        description: 'Team focused on stacking and extending buffs'
      }
    }
  }

  /**
   * Analyze team composition and suggest improvements
   */
  analyzeTeam(selectedCharacters) {
    const analysis = {
      currentTags: [],
      roleDistribution: {},
      missingRoles: [],
      synergySuggestions: [],
      patternMatches: []
    }

    // Collect all tags from selected characters
    selectedCharacters.forEach(character => {
      const characterTags = this.getAllTagsForCharacter(character)
      analysis.currentTags.push(...characterTags)
    })
    
    // Remove duplicates
    analysis.currentTags = [...new Set(analysis.currentTags)]

    // Analyze role distribution
    analysis.roleDistribution = this.analyzeRoleDistribution(analysis.currentTags)

    // Check pattern matches
    analysis.patternMatches = this.checkTeamPatterns(analysis.currentTags)

    // Suggest missing roles
    analysis.missingRoles = this.suggestMissingRoles(analysis.roleDistribution)

    // Find synergy opportunities
    analysis.synergySuggestions = this.findSynergySuggestions(analysis.currentTags)

    debug.tags.log('Team analysis complete:', analysis)
    return analysis
  }

  /**
   * Analyze role distribution in current team
   */
  analyzeRoleDistribution(tags) {
    const roles = {
      dps: tags.filter(tag => tag.startsWith('dmg_') || tag.includes('_dps')).length,
      buffer: tags.filter(tag => tag.startsWith('buff_') || tag.includes('buffer')).length,
      healer: tags.filter(tag => tag.startsWith('heal_') || tag.includes('heal')).length,
      debuffer: tags.filter(tag => tag.startsWith('debuff_') || tag.startsWith('resist_down_')).length,
      support: tags.filter(tag => tag.includes('support') || tag.includes('utility')).length
    }

    return roles
  }

  /**
   * Check how well current team matches predefined patterns
   */
  checkTeamPatterns(currentTags) {
    const matches = []

    Object.entries(this.teamPatterns).forEach(([patternId, pattern]) => {
      const requiredMatches = pattern.required.filter(tag => currentTags.includes(tag))
      const optionalMatches = pattern.optional.filter(tag => currentTags.includes(tag))
      
      const completionScore = (requiredMatches.length / pattern.required.length) * 100
      const bonusScore = (optionalMatches.length / pattern.optional.length) * 20

      if (completionScore > 0) {
        matches.push({
          patternId,
          name: pattern.name,
          description: pattern.description,
          completionScore: Math.round(completionScore + bonusScore),
          requiredMatches,
          optionalMatches,
          missingRequired: pattern.required.filter(tag => !currentTags.includes(tag)),
          missingOptional: pattern.optional.filter(tag => !currentTags.includes(tag))
        })
      }
    })

    return matches.sort((a, b) => b.completionScore - a.completionScore)
  }

  /**
   * Suggest missing roles based on current composition
   */
  suggestMissingRoles(roleDistribution) {
    const suggestions = []

    if (roleDistribution.dps === 0) {
      suggestions.push({
        role: 'DPS',
        priority: 'high',
        tags: ['dmg_fire', 'dmg_physical', 'dmg_aoe'],
        reason: 'Team needs damage dealers'
      })
    }

    if (roleDistribution.healer === 0) {
      suggestions.push({
        role: 'Healer',
        priority: 'medium',
        tags: ['heal_hp', 'heal_sp', 'cleanse_ailments'],
        reason: 'Team needs healing support'
      })
    }

    if (roleDistribution.buffer === 0) {
      suggestions.push({
        role: 'Buffer',
        priority: 'high',
        tags: ['buff_stats_patk_up', 'buff_stats_eatk_up', 'buff_extend_giver'],
        reason: 'Team needs stat buffs'
      })
    }

    return suggestions
  }

  /**
   * Find synergy opportunities in current team
   */
  findSynergySuggestions(currentTags) {
    const suggestions = []

    // Check for buff synergies
    const hasBuffs = currentTags.some(tag => tag.startsWith('buff_'))
    const hasBuffExtender = currentTags.includes('buff_extend_giver')
    
    if (hasBuffs && !hasBuffExtender) {
      suggestions.push({
        type: 'synergy',
        suggestion: 'Add a character with buff extension',
        tags: ['buff_extend_giver'],
        reason: 'Maximize buff duration for existing buffers'
      })
    }

    // Check for elemental synergies
    const fireEffects = currentTags.filter(tag => tag.includes('fire')).length
    if (fireEffects > 1) {
      suggestions.push({
        type: 'synergy',
        suggestion: 'Build around fire element',
        tags: ['dmg_fire', 'resist_down_fire', 'fire_synergy'],
        reason: 'Multiple fire effects detected'
      })
    }

    return suggestions
  }

  /**
   * Find characters that have specific tags
   */
  findCharactersWithTags(characters, requiredTags, mode = 'AND') {
    return this.searchByTags(characters, requiredTags, mode).map(character => ({
      character,
      matchingTags: this.getAllTagsForCharacter(character).filter(tag => requiredTags.includes(tag)),
      relevanceScore: this.calculateCharacterRelevance(character, requiredTags)
    })).sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  /**
   * Calculate how relevant a character is for specific tags
   */
  calculateCharacterRelevance(character, targetTags) {
    const characterTags = this.getAllTagsForCharacter(character)
    const matches = characterTags.filter(tag => targetTags.includes(tag)).length
    const total = targetTags.length
    
    return Math.round((matches / total) * 100)
  }

  /**
   * Get tag statistics for debugging and analysis
   */
  getTagStatistics(characters) {
    const stats = {
      totalCharacters: characters.length,
      charactersWithTags: 0,
      totalTags: 0,
      uniqueTags: new Set(),
      tagDistribution: {},
      categoryDistribution: {}
    }

    characters.forEach(character => {
      const tags = this.getAllTagsForCharacter(character)
      if (tags.length > 0) {
        stats.charactersWithTags++
        stats.totalTags += tags.length
        
        tags.forEach(tag => {
          stats.uniqueTags.add(tag)
          stats.tagDistribution[tag] = (stats.tagDistribution[tag] || 0) + 1
          
          const category = this.taxonomy[tag]?.category || 'unknown'
          stats.categoryDistribution[category] = (stats.categoryDistribution[category] || 0) + 1
        })
      }
    })

    return {
      ...stats,
      uniqueTags: stats.uniqueTags.size,
      averageTagsPerCharacter: Math.round(stats.totalTags / stats.charactersWithTags * 100) / 100,
      tagCoverage: Math.round((stats.charactersWithTags / stats.totalCharacters) * 100)
    }
  }

  /**
   * Export current taxonomy for external use
   */
  exportTaxonomy() {
    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      taxonomy: this.taxonomy,
      categories: Object.keys(this.searchIndex.byCategory),
      totalTags: Object.keys(this.taxonomy).length
    }
  }

  /**
   * Import and merge external taxonomy
   */
  importTaxonomy(externalTaxonomy) {
    if (!externalTaxonomy || !externalTaxonomy.taxonomy) {
      throw new Error('Invalid taxonomy format')
    }

    // Merge taxonomies (external takes precedence)
    this.taxonomy = {
      ...this.taxonomy,
      ...externalTaxonomy.taxonomy
    }

    // Rebuild search index
    this.searchIndex = this.buildSearchIndex()
    this.teamPatterns = this.buildTeamSearchPatterns()

    debug.tags.log('Taxonomy imported and merged successfully')
    return this.taxonomy
  }
}

/**
 * Utility functions for tag manipulation
 */
export const TagUtils = {
  /**
   * Convert legacy tags to v3 format
   */
  migrateLegacyTags(legacyTags, source = 'migration') {
    if (!Array.isArray(legacyTags)) {
      return { effects: [], targeting: [], meta: [], synergies: [], legacy: [] }
    }

    const migrated = {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      totalTags: legacyTags.length,
      effects: [],
      targeting: [],
      meta: [],
      synergies: [],
      legacy: []
    }

    legacyTags.forEach(tag => {
      const tagObj = {
        name: tag,
        source: source,
        confidence: 'medium',
        migrated: true
      }

      // Categorize based on tag prefix
      if (tag.startsWith('buff_') || tag.startsWith('debuff_') || tag.startsWith('dmg_') || tag.startsWith('heal_')) {
        migrated.effects.push(tagObj)
      } else if (tag.startsWith('target_')) {
        migrated.targeting.push(tagObj)
      } else if (tag.startsWith('meta_') || tag.includes('drayleb')) {
        migrated.meta.push(tagObj)
      } else if (tag.startsWith('synergy_')) {
        migrated.synergies.push(tagObj)
      } else {
        migrated.legacy.push(tagObj)
      }
    })

    return migrated
  },

  /**
   * Validate tag object structure
   */
  isValidTagObject(tagObj) {
    return tagObj && 
           typeof tagObj === 'object' &&
           typeof tagObj.name === 'string' &&
           typeof tagObj.source === 'string' &&
           typeof tagObj.confidence === 'string'
  },

  /**
   * Clean and normalize tag names
   */
  normalizeTagName(tagName) {
    if (typeof tagName !== 'string') return ''
    
    return tagName
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_')  // Replace non-alphanumeric with underscore
      .replace(/_+/g, '_')          // Collapse multiple underscores
      .replace(/^_|_$/g, '')        // Remove leading/trailing underscores
  }
}

// Default export
export default TagSystem