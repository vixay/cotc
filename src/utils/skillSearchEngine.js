/**
 * Skill Search Engine - Advanced search capabilities for COTC characters
 * 
 * Provides Boolean logic, natural language processing, and comprehensive
 * filtering for character skills and effects.
 */

import debug from './debug'
import { TagSystem } from './tagSystem'

export class SkillSearchEngine {
  constructor(characters = []) {
    this.characters = characters
    this.tagSystem = new TagSystem()
    this.searchIndex = this.buildSearchIndex()
    this.naturalLanguagePatterns = this.buildNaturalLanguagePatterns()
  }

  /**
   * Main search method - routes to appropriate search type
   */
  search(query, options = {}) {
    const searchType = this.detectSearchType(query)
    debug.search.log('Performing search:', { query, searchType, options })

    let results = []

    switch (searchType) {
      case 'boolean':
        results = this.searchBoolean(query.booleanQuery, options)
        break
      case 'natural':
        results = this.searchNatural(query.naturalQuery, options)
        break
      case 'tags':
        results = this.searchTags(query.selectedTags, options)
        break
      case 'advanced':
        results = this.searchAdvanced(query, options)
        break
      default:
        results = this.searchSimple(query, options)
    }

    return this.processResults(results, options)
  }

  /**
   * Boolean Logic Search
   * Supports: AND, OR, NOT, parentheses grouping
   */
  searchBoolean(booleanQuery, options = {}) {
    debug.search.group('Boolean Search')
    debug.search.log('Query:', booleanQuery)

    try {
      const parsedQuery = this.parseBooleanQuery(booleanQuery)
      debug.search.log('Parsed query:', parsedQuery)

      const results = this.characters.filter(character => {
        return this.evaluateBooleanExpression(parsedQuery, character)
      })

      debug.search.log('Results count:', results.length)
      debug.search.groupEnd()

      return results
    } catch (error) {
      debug.search.error('Boolean search failed:', error)
      debug.search.groupEnd()
      return []
    }
  }

  /**
   * Natural Language Search
   * Processes human-readable queries and converts to searchable terms
   */
  searchNatural(naturalQuery, options = {}) {
    debug.search.group('Natural Language Search')
    debug.search.log('Query:', naturalQuery)

    const processedQuery = this.processNaturalLanguage(naturalQuery)
    debug.search.log('Processed query:', processedQuery)

    let results = this.characters.filter(character => {
      return this.matchesNaturalQuery(character, processedQuery)
    })

    // Apply confidence scoring for natural language results
    results = results.map(character => ({
      ...character,
      _searchScore: this.calculateNaturalSearchScore(character, processedQuery)
    })).sort((a, b) => b._searchScore - a._searchScore)

    debug.search.log('Results count:', results.length)
    debug.search.groupEnd()

    return results
  }

  /**
   * Tag-based Search
   * Filters characters by selected effect tags
   */
  searchTags(selectedTags, options = {}) {
    debug.search.group('Tag-based Search')
    debug.search.log('Selected tags:', selectedTags)

    const allTags = this.flattenTagSelection(selectedTags)
    debug.search.log('Flattened tags:', allTags)

    if (allTags.length === 0) {
      debug.search.groupEnd()
      return this.characters
    }

    const logicMode = options.tagLogic || 'AND' // AND, OR, or MIXED
    const results = this.characters.filter(character => {
      return this.matchesTagCriteria(character, allTags, logicMode)
    })

    debug.search.log('Results count:', results.length)
    debug.search.groupEnd()

    return results
  }

  /**
   * Advanced Search
   * Combines multiple filter types with complex logic
   */
  searchAdvanced(query, options = {}) {
    debug.search.group('Advanced Search')
    debug.search.log('Query:', query)

    let results = this.characters

    // Apply character property filters
    if (query.advancedFilters) {
      results = this.applyAdvancedFilters(results, query.advancedFilters)
    }

    // Apply tag filters
    if (query.selectedTags && Object.values(query.selectedTags).some(tags => tags.length > 0)) {
      results = results.filter(character => 
        this.matchesTagCriteria(character, this.flattenTagSelection(query.selectedTags), 'AND')
      )
    }

    // Apply natural language filter if present
    if (query.naturalQuery) {
      const processedQuery = this.processNaturalLanguage(query.naturalQuery)
      results = results.filter(character => 
        this.matchesNaturalQuery(character, processedQuery)
      )
    }

    debug.search.log('Results count:', results.length)
    debug.search.groupEnd()

    return results
  }

  /**
   * Parse Boolean query into executable expression tree
   */
  parseBooleanQuery(query) {
    // Tokenize the query
    const tokens = this.tokenizeBooleanQuery(query)
    
    // Convert to postfix notation (Shunting Yard algorithm)
    const postfix = this.infixToPostfix(tokens)
    
    // Build expression tree
    return this.buildExpressionTree(postfix)
  }

  tokenizeBooleanQuery(query) {
    const tokens = []
    const regex = /\s*(AND|OR|NOT|\(|\)|[^()\s]+)\s*/gi
    let match

    while ((match = regex.exec(query)) !== null) {
      const token = match[1].trim()
      if (token) {
        tokens.push(token)
      }
    }

    return tokens
  }

  infixToPostfix(tokens) {
    const output = []
    const operators = []
    const precedence = { 'NOT': 3, 'AND': 2, 'OR': 1 }
    const rightAssociative = { 'NOT': true }

    for (const token of tokens) {
      if (token === '(') {
        operators.push(token)
      } else if (token === ')') {
        while (operators.length > 0 && operators[operators.length - 1] !== '(') {
          output.push(operators.pop())
        }
        operators.pop() // Remove '('
      } else if (precedence[token]) {
        while (
          operators.length > 0 &&
          operators[operators.length - 1] !== '(' &&
          (
            precedence[operators[operators.length - 1]] > precedence[token] ||
            (
              precedence[operators[operators.length - 1]] === precedence[token] &&
              !rightAssociative[token]
            )
          )
        ) {
          output.push(operators.pop())
        }
        operators.push(token)
      } else {
        output.push(token)
      }
    }

    while (operators.length > 0) {
      output.push(operators.pop())
    }

    return output
  }

  buildExpressionTree(postfix) {
    const stack = []

    for (const token of postfix) {
      if (['AND', 'OR', 'NOT'].includes(token)) {
        const node = { operator: token, operands: [] }
        
        if (token === 'NOT') {
          node.operands = [stack.pop()]
        } else {
          const right = stack.pop()
          const left = stack.pop()
          node.operands = [left, right]
        }
        
        stack.push(node)
      } else {
        stack.push({ term: token })
      }
    }

    return stack[0]
  }

  evaluateBooleanExpression(node, character) {
    if (!node) return false

    if (node.term) {
      // Terminal node - check if character matches this term
      return this.characterMatchesTerm(character, node.term)
    }

    if (node.operator === 'AND') {
      return node.operands.every(operand => 
        this.evaluateBooleanExpression(operand, character)
      )
    }

    if (node.operator === 'OR') {
      return node.operands.some(operand => 
        this.evaluateBooleanExpression(operand, character)
      )
    }

    if (node.operator === 'NOT') {
      return !this.evaluateBooleanExpression(node.operands[0], character)
    }

    return false
  }

  characterMatchesTerm(character, term) {
    // Check if term is a tag
    if (this.isValidTag(term)) {
      return this.characterHasTag(character, term)
    }

    // Check if term matches character properties
    const termLower = term.toLowerCase()
    
    // Name match
    if (character.name.toLowerCase().includes(termLower)) return true
    
    // Job match
    if (character.job?.toLowerCase().includes(termLower)) return true
    
    // Skill name match
    if (character.skills) {
      const allSkills = [
        ...(character.skills.passive || []),
        ...(character.skills.battle || []),
        ...(character.skills.ultimate || [])
      ]
      
      for (const skill of allSkills) {
        if (skill.name?.toLowerCase().includes(termLower)) return true
        if (skill.description?.toLowerCase().includes(termLower)) return true
      }
    }

    return false
  }

  /**
   * Process natural language queries
   */
  processNaturalLanguage(query) {
    const queryLower = query.toLowerCase()
    const processedQuery = {
      original: query,
      intent: this.detectIntent(queryLower),
      entities: this.extractEntities(queryLower),
      tags: this.extractTagsFromQuery(queryLower),
      filters: this.extractFiltersFromQuery(queryLower)
    }

    return processedQuery
  }

  detectIntent(query) {
    const intents = {
      'find_characters': /(?:find|show|get|list).*(?:character|char)/i,
      'find_skills': /(?:find|show|get|list).*(?:skill|ability|effect)/i,
      'compare': /(?:compare|versus|vs|difference)/i,
      'recommend': /(?:recommend|suggest|best|good|should)/i,
      'team_build': /(?:team|party|group|comp)/i
    }

    for (const [intent, pattern] of Object.entries(intents)) {
      if (pattern.test(query)) {
        return intent
      }
    }

    return 'search'
  }

  extractEntities(query) {
    const entities = {
      characters: [],
      jobs: [],
      elements: [],
      effects: [],
      numbers: []
    }

    // Extract character names
    for (const character of this.characters) {
      const namePattern = new RegExp(character.name.replace(/\s+/g, '\\s*'), 'i')
      if (namePattern.test(query)) {
        entities.characters.push(character.name)
      }
    }

    // Extract jobs
    const jobs = ['warrior', 'hunter', 'cleric', 'scholar', 'dancer', 'merchant', 'apothecary', 'thief']
    for (const job of jobs) {
      if (query.includes(job)) {
        entities.jobs.push(job)
      }
    }

    // Extract elements
    const elements = ['fire', 'ice', 'lightning', 'wind', 'light', 'dark']
    for (const element of elements) {
      if (query.includes(element)) {
        entities.elements.push(element)
      }
    }

    // Extract numbers
    const numberMatches = query.match(/\d+/g)
    if (numberMatches) {
      entities.numbers = numberMatches.map(n => parseInt(n))
    }

    return entities
  }

  extractTagsFromQuery(query) {
    const suggestedTags = []

    // Map common phrases to tags
    const phraseToTagMap = {
      'fire damage': ['dmg_fire'],
      'ice damage': ['dmg_ice'], 
      'lightning damage': ['dmg_lightning'],
      'physical damage': ['dmg_physical'],
      'heal hp': ['heal_hp'],
      'heal sp': ['heal_sp'],
      'buff attack': ['buff_stats_patk_up', 'buff_stats_eatk_up'],
      'buff defense': ['buff_stats_pdef_up', 'buff_stats_edef_up'],
      'resistance down': ['resist_down_fire', 'resist_down_ice', 'resist_down_lightning'],
      'all enemies': ['target_enemy_all'],
      'all allies': ['target_ally_all'],
      'entire party': ['target_ally_all'],
      'bp generation': ['bp_generation'],
      'follow up': ['follow_up_attack'],
      'multi hit': ['dmg_multi_hit']
    }

    for (const [phrase, tags] of Object.entries(phraseToTagMap)) {
      if (query.includes(phrase)) {
        suggestedTags.push(...tags)
      }
    }

    return [...new Set(suggestedTags)]
  }

  extractFiltersFromQuery(query) {
    const filters = {}

    // Extract tier filters
    const tierMatch = query.match(/(?:tier|rank)\s*([sab+])/i)
    if (tierMatch) {
      filters.tier = tierMatch[1].toUpperCase()
    }

    // Extract free/gacha filters  
    if (query.includes('free')) {
      filters.isFree = true
    }
    if (query.includes('gacha') || query.includes('pull')) {
      filters.isFree = false
    }

    return filters
  }

  /**
   * Calculate search relevance score
   */
  calculateNaturalSearchScore(character, processedQuery) {
    let score = 0

    // Name match bonus
    if (character.name.toLowerCase().includes(processedQuery.original.toLowerCase())) {
      score += 10
    }

    // Tag match bonus
    for (const tag of processedQuery.tags) {
      if (this.characterHasTag(character, tag)) {
        score += 5
      }
    }

    // Skill match bonus
    if (character.skills) {
      const allSkills = [
        ...(character.skills.passive || []),
        ...(character.skills.battle || []), 
        ...(character.skills.ultimate || [])
      ]

      for (const skill of allSkills) {
        const skillText = `${skill.name || ''} ${skill.description || ''}`.toLowerCase()
        if (skillText.includes(processedQuery.original.toLowerCase())) {
          score += 3
        }
      }
    }

    // Entity match bonus
    if (processedQuery.entities.characters.includes(character.name)) {
      score += 15
    }
    if (processedQuery.entities.jobs.includes(character.job?.toLowerCase())) {
      score += 8
    }

    return score
  }

  /**
   * Helper methods
   */
  buildSearchIndex() {
    debug.search.log('Building search index for', this.characters.length, 'characters')
    
    const index = {
      byName: new Map(),
      byJob: new Map(),
      byTag: new Map(),
      bySkill: new Map()
    }

    for (const character of this.characters) {
      // Index by name
      index.byName.set(character.id, character)
      
      // Index by job
      if (character.job) {
        if (!index.byJob.has(character.job)) {
          index.byJob.set(character.job, [])
        }
        index.byJob.get(character.job).push(character)
      }

      // Index by tags
      if (character.tags) {
        const allTags = this.extractAllTags(character)
        for (const tag of allTags) {
          if (!index.byTag.has(tag)) {
            index.byTag.set(tag, [])
          }
          index.byTag.get(tag).push(character)
        }
      }

      // Index by skills
      if (character.skills) {
        const allSkills = [
          ...(character.skills.passive || []),
          ...(character.skills.battle || []),
          ...(character.skills.ultimate || [])
        ]
        
        for (const skill of allSkills) {
          const skillKey = skill.name?.toLowerCase().replace(/\s+/g, '_')
          if (skillKey) {
            if (!index.bySkill.has(skillKey)) {
              index.bySkill.set(skillKey, [])
            }
            index.bySkill.get(skillKey).push({ character, skill })
          }
        }
      }
    }

    debug.search.log('Search index built:', {
      names: index.byName.size,
      jobs: index.byJob.size,
      tags: index.byTag.size,
      skills: index.bySkill.size
    })

    return index
  }

  buildNaturalLanguagePatterns() {
    return {
      damageTypes: /(?:fire|ice|lightning|wind|light|dark|physical|elemental)\s*(?:damage|dmg)/gi,
      effects: /(?:heal|buff|debuff|resistance|immunity|break|boost)/gi,
      targets: /(?:all|entire|single|front|back|row|party|team|ally|allies|enemy|enemies)/gi,
      triggers: /(?:battle start|turn start|low hp|critical|counter|follow up)/gi,
      modifiers: /(?:multi|aoe|area|massive|huge|small|minor|major)/gi
    }
  }

  flattenTagSelection(selectedTags) {
    const allTags = []
    
    for (const category of Object.values(selectedTags)) {
      if (Array.isArray(category)) {
        allTags.push(...category)
      }
    }

    return allTags
  }

  matchesTagCriteria(character, tags, logicMode) {
    const characterTags = this.extractAllTags(character)
    
    if (logicMode === 'OR') {
      return tags.some(tag => characterTags.includes(tag))
    } else { // AND mode
      return tags.every(tag => characterTags.includes(tag))
    }
  }

  matchesNaturalQuery(character, processedQuery) {
    // Check for exact character name match
    if (processedQuery.entities.characters.length > 0) {
      return processedQuery.entities.characters.some(name => 
        character.name.toLowerCase().includes(name.toLowerCase())
      )
    }

    // Check for tag matches
    if (processedQuery.tags.length > 0) {
      const characterTags = this.extractAllTags(character)
      const hasMatchingTags = processedQuery.tags.some(tag => 
        characterTags.includes(tag)
      )
      if (hasMatchingTags) return true
    }

    // Check for skill text matches
    if (character.skills) {
      const allSkills = [
        ...(character.skills.passive || []),
        ...(character.skills.battle || []),
        ...(character.skills.ultimate || [])
      ]

      for (const skill of allSkills) {
        const skillText = `${skill.name || ''} ${skill.description || ''}`.toLowerCase()
        if (skillText.includes(processedQuery.original.toLowerCase())) {
          return true
        }
      }
    }

    // Check for job/element matches
    if (processedQuery.entities.jobs.length > 0) {
      return processedQuery.entities.jobs.some(job => 
        character.job?.toLowerCase().includes(job)
      )
    }

    if (processedQuery.entities.elements.length > 0) {
      return processedQuery.entities.elements.some(element => 
        character.elements?.some(e => e.toLowerCase().includes(element))
      )
    }

    return false
  }

  applyAdvancedFilters(characters, filters) {
    let results = characters

    if (filters.jobs && filters.jobs.length > 0) {
      results = results.filter(char => filters.jobs.includes(char.job))
    }

    if (filters.tiers && filters.tiers.length > 0) {
      results = results.filter(char => 
        filters.tiers.includes(char.tierRatings?.gl?.tier)
      )
    }

    if (filters.elements && filters.elements.length > 0) {
      results = results.filter(char =>
        char.elements?.some(element => filters.elements.includes(element))
      )
    }

    if (filters.spCostMin !== null) {
      results = results.filter(char => this.hasSkillWithSpCost(char, filters.spCostMin, 'min'))
    }

    if (filters.spCostMax !== null) {
      results = results.filter(char => this.hasSkillWithSpCost(char, filters.spCostMax, 'max'))
    }

    if (filters.hasUltimate) {
      results = results.filter(char => char.skills?.ultimate?.length > 0)
    }

    if (filters.hasPassive) {
      results = results.filter(char => char.skills?.passive?.length > 0)
    }

    if (filters.multiHit) {
      results = results.filter(char => this.characterHasTag(char, 'dmg_multi_hit'))
    }

    return results
  }

  hasSkillWithSpCost(character, cost, comparison) {
    if (!character.skills) return false

    const allSkills = [
      ...(character.skills.battle || []),
      ...(character.skills.ultimate || [])
    ]

    return allSkills.some(skill => {
      if (!skill.sp_cost) return false
      
      if (comparison === 'min') {
        return skill.sp_cost >= cost
      } else {
        return skill.sp_cost <= cost
      }
    })
  }

  extractAllTags(character) {
    const tags = []
    
    if (character.tags) {
      for (const category of ['effects', 'targeting', 'triggers', 'meta', 'accessories']) {
        if (character.tags[category]) {
          for (const tag of character.tags[category]) {
            const tagName = typeof tag === 'string' ? tag : tag.name
            if (tagName) tags.push(tagName)
          }
        }
      }
    }

    return tags
  }

  characterHasTag(character, targetTag) {
    const characterTags = this.extractAllTags(character)
    return characterTags.includes(targetTag)
  }

  isValidTag(term) {
    // Check if term matches tag naming pattern
    return /^[a-z_]+$/.test(term) && (
      term.includes('dmg_') ||
      term.includes('buff_') ||
      term.includes('debuff_') ||
      term.includes('heal_') ||
      term.includes('target_') ||
      term.includes('trigger_') ||
      term.includes('meta_')
    )
  }

  detectSearchType(query) {
    if (typeof query === 'object') {
      if (query.booleanQuery) return 'boolean'
      if (query.naturalQuery) return 'natural'  
      if (query.selectedTags) return 'tags'
      if (query.advancedFilters) return 'advanced'
    }

    return 'simple'
  }

  processResults(results, options) {
    // Remove internal search properties
    const cleanResults = results.map(character => {
      const { _searchScore, ...cleanCharacter } = character
      return cleanCharacter
    })

    // Apply result limits
    if (options.limit) {
      return cleanResults.slice(0, options.limit)
    }

    return cleanResults
  }

  /**
   * Get search suggestions based on partial query
   */
  getSuggestions(partialQuery, limit = 10) {
    const suggestions = []
    const queryLower = partialQuery.toLowerCase()

    // Character name suggestions
    for (const character of this.characters) {
      if (character.name.toLowerCase().includes(queryLower)) {
        suggestions.push({
          type: 'character',
          text: character.name,
          description: `${character.job} - ${character.tierRatings?.gl?.tier || 'Unranked'}`,
          confidence: 0.9
        })
      }
    }

    // Tag suggestions
    const allTags = new Set()
    for (const character of this.characters) {
      this.extractAllTags(character).forEach(tag => allTags.add(tag))
    }

    for (const tag of allTags) {
      if (tag.includes(queryLower)) {
        suggestions.push({
          type: 'tag',
          text: tag,
          description: this.getTagDescription(tag),
          confidence: 0.7
        })
      }
    }

    // Natural language pattern suggestions
    const patterns = [
      'characters with fire damage',
      'skills that heal HP',
      'buff entire party',
      'resistance down effects',
      'multi-hit abilities',
      'BP generation skills'
    ]

    for (const pattern of patterns) {
      if (pattern.includes(queryLower)) {
        suggestions.push({
          type: 'pattern',
          text: pattern,
          description: 'Natural language search',
          confidence: 0.6
        })
      }
    }

    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit)
  }

  getTagDescription(tag) {
    const descriptions = {
      'dmg_fire': 'Deals fire elemental damage',
      'dmg_ice': 'Deals ice elemental damage',
      'dmg_lightning': 'Deals lightning elemental damage',
      'buff_stats_patk_up': 'Increases physical attack',
      'heal_hp': 'Restores health points',
      'target_ally_all': 'Affects all allies'
    }

    return descriptions[tag] || 'Effect tag'
  }
}

export default SkillSearchEngine