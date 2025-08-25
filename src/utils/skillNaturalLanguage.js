/**
 * Natural Language Processing for Skill Search
 * 
 * Advanced NLP capabilities for processing user queries and converting
 * them to structured search parameters using AI-powered analysis.
 */

import debug from './debug'

export class SkillNaturalLanguageProcessor {
  constructor() {
    this.queryPatterns = this.buildQueryPatterns()
    this.entityRecognition = this.buildEntityRecognition()
    this.intentClassification = this.buildIntentClassification()
    this.contextMemory = new Map()
  }

  /**
   * Main entry point for processing natural language queries
   */
  async processQuery(query, context = {}) {
    debug.nlp.group('Processing Natural Language Query')
    debug.nlp.log('Input query:', query)
    debug.nlp.log('Context:', context)

    try {
      const analysis = {
        original: query,
        normalized: this.normalizeQuery(query),
        intent: await this.classifyIntent(query, context),
        entities: await this.extractEntities(query),
        tags: await this.extractTags(query),
        filters: await this.extractFilters(query),
        suggestions: await this.generateSuggestions(query, context),
        confidence: 0,
        timestamp: new Date().toISOString()
      }

      // Calculate overall confidence
      analysis.confidence = this.calculateConfidence(analysis)

      // Store in context memory for learning
      this.updateContextMemory(query, analysis)

      debug.nlp.log('Analysis result:', analysis)
      debug.nlp.groupEnd()

      return analysis
    } catch (error) {
      debug.nlp.error('NLP processing failed:', error)
      debug.nlp.groupEnd()
      
      return {
        original: query,
        normalized: query.toLowerCase(),
        intent: 'search',
        entities: {},
        tags: [],
        filters: {},
        suggestions: [],
        confidence: 0.1,
        error: error.message
      }
    }
  }

  /**
   * Normalize query text for consistent processing
   */
  normalizeQuery(query) {
    return query
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  /**
   * Classify user intent from natural language
   */
  async classifyIntent(query, context = {}) {
    const normalized = this.normalizeQuery(query)
    
    // Define intent patterns with confidence scores
    const intentPatterns = [
      {
        intent: 'find_characters',
        patterns: [
          /(?:find|show|list|get|search).+(?:character|char|unit)/i,
          /(?:who|which).+(?:character|char|unit)/i,
          /characters?.+(?:with|that|having)/i
        ],
        confidence: 0.9
      },
      {
        intent: 'find_skills',
        patterns: [
          /(?:find|show|list|get|search).+(?:skill|ability|effect|power)/i,
          /(?:skills?|abilities).+(?:that|which|with)/i,
          /(?:who|what).+(?:skill|ability|effect)/i
        ],
        confidence: 0.9
      },
      {
        intent: 'team_building',
        patterns: [
          /(?:team|party|comp|composition|group)/i,
          /(?:build|create|make).+(?:team|party)/i,
          /(?:best|good|optimal).+(?:team|party|comp)/i
        ],
        confidence: 0.8
      },
      {
        intent: 'comparison',
        patterns: [
          /(?:compare|vs|versus|difference|better)/i,
          /(?:which is|who is).+(?:better|stronger|best)/i,
          /.+(?:or).+(?:\?)/i
        ],
        confidence: 0.8
      },
      {
        intent: 'recommendation',
        patterns: [
          /(?:recommend|suggest|should|best|good|top)/i,
          /(?:who should|what should|which should)/i,
          /(?:worth|pull|skip|priority)/i
        ],
        confidence: 0.7
      },
      {
        intent: 'meta_analysis',
        patterns: [
          /(?:meta|tier|rank|rating|power)/i,
          /(?:current|latest|new).+meta/i,
          /(?:op|overpowered|broken|strong)/i
        ],
        confidence: 0.7
      }
    ]

    let bestMatch = { intent: 'search', confidence: 0.1 }

    for (const intentPattern of intentPatterns) {
      for (const pattern of intentPattern.patterns) {
        if (pattern.test(query)) {
          if (intentPattern.confidence > bestMatch.confidence) {
            bestMatch = {
              intent: intentPattern.intent,
              confidence: intentPattern.confidence
            }
          }
        }
      }
    }

    // Use context to boost confidence for related intents
    if (context.previousIntent === bestMatch.intent) {
      bestMatch.confidence = Math.min(bestMatch.confidence + 0.1, 1.0)
    }

    return bestMatch
  }

  /**
   * Extract named entities from the query
   */
  async extractEntities(query) {
    const entities = {
      characters: [],
      jobs: [],
      elements: [],
      effects: [],
      numbers: [],
      tiers: [],
      modifiers: []
    }

    const normalized = this.normalizeQuery(query)

    // Character names (this would be populated from actual character data)
    const characterNames = [
      'primrose', 'cyrus', 'tressa', 'haanit', 'alfyn', 'therion', 'ophilia', 'olberic',
      'agnea', 'partitio', 'osvald', 'throne', 'castti', 'ochette', 'temenos', 'hikari'
    ]

    for (const name of characterNames) {
      if (normalized.includes(name)) {
        entities.characters.push(name)
      }
    }

    // Job classes
    const jobs = ['warrior', 'hunter', 'cleric', 'scholar', 'dancer', 'merchant', 'apothecary', 'thief']
    for (const job of jobs) {
      if (normalized.includes(job)) {
        entities.jobs.push(job)
      }
    }

    // Elements
    const elements = ['fire', 'ice', 'lightning', 'thunder', 'wind', 'light', 'dark']
    for (const element of elements) {
      if (normalized.includes(element)) {
        entities.elements.push(element === 'thunder' ? 'lightning' : element)
      }
    }

    // Effects
    const effects = [
      'damage', 'heal', 'buff', 'debuff', 'boost', 'break', 'resistance', 'immunity',
      'poison', 'sleep', 'charm', 'confusion', 'paralysis', 'blind', 'silence'
    ]
    for (const effect of effects) {
      if (normalized.includes(effect)) {
        entities.effects.push(effect)
      }
    }

    // Numbers
    const numberMatches = query.match(/\b\d+\b/g)
    if (numberMatches) {
      entities.numbers = numberMatches.map(n => parseInt(n))
    }

    // Tiers
    const tierMatches = normalized.match(/\b([s][+]?|[abc])\b/g)
    if (tierMatches) {
      entities.tiers = tierMatches.map(t => t.toUpperCase())
    }

    // Modifiers
    const modifiers = [
      'best', 'worst', 'top', 'bottom', 'high', 'low', 'strong', 'weak',
      'fast', 'slow', 'all', 'any', 'most', 'least', 'multiple', 'single'
    ]
    for (const modifier of modifiers) {
      if (normalized.includes(modifier)) {
        entities.modifiers.push(modifier)
      }
    }

    return entities
  }

  /**
   * Extract relevant tags from natural language
   */
  async extractTags(query) {
    const tags = []
    const normalized = this.normalizeQuery(query)

    // Define phrase-to-tag mappings
    const phraseToTags = {
      // Damage types
      'fire damage': ['dmg_fire'],
      'ice damage': ['dmg_ice'],
      'lightning damage': ['dmg_lightning'],
      'thunder damage': ['dmg_lightning'],
      'wind damage': ['dmg_wind'],
      'light damage': ['dmg_light'],
      'dark damage': ['dmg_dark'],
      'physical damage': ['dmg_physical'],
      'elemental damage': ['dmg_elemental'],
      'magic damage': ['dmg_elemental'],
      
      // Healing
      'heal hp': ['heal_hp'],
      'heal health': ['heal_hp'],
      'restore hp': ['heal_hp'],
      'heal sp': ['heal_sp'],
      'restore sp': ['heal_sp'],
      'heal mana': ['heal_sp'],
      
      // Buffs
      'buff attack': ['buff_stats_patk_up', 'buff_stats_eatk_up'],
      'buff defense': ['buff_stats_pdef_up', 'buff_stats_edef_up'],
      'buff speed': ['buff_stats_spd_up'],
      'boost attack': ['buff_stats_patk_up', 'buff_stats_eatk_up'],
      'increase attack': ['buff_stats_patk_up', 'buff_stats_eatk_up'],
      
      // Debuffs  
      'resistance down': ['resist_down_fire', 'resist_down_ice', 'resist_down_lightning'],
      'debuff attack': ['debuff_stats_patk_down'],
      'debuff defense': ['debuff_stats_pdef_down'],
      'lower resistance': ['resist_down_fire', 'resist_down_ice', 'resist_down_lightning'],
      
      // Targeting
      'all enemies': ['target_enemy_all'],
      'all allies': ['target_ally_all'],
      'entire party': ['target_ally_all'],
      'whole team': ['target_ally_all'],
      'single enemy': ['target_enemy_single'],
      'single ally': ['target_ally_single'],
      'front row': ['target_ally_front_row', 'target_enemy_front_row'],
      'back row': ['target_ally_back_row', 'target_enemy_back_row'],
      
      // Special effects
      'bp generation': ['bp_generation', 'bp_recovery'],
      'bp recovery': ['bp_generation', 'bp_recovery'],
      'battle points': ['bp_generation', 'bp_recovery'],
      'follow up': ['follow_up_attack'],
      'counter attack': ['counter_attack'],
      'multi hit': ['dmg_multi_hit'],
      'area effect': ['dmg_aoe'],
      'aoe': ['dmg_aoe'],
      
      // Status effects
      'poison': ['status_poison'],
      'sleep': ['status_sleep'],
      'charm': ['status_charm'],
      'confusion': ['status_confusion'],
      'paralysis': ['status_paralysis'],
      'blind': ['status_blind'],
      'silence': ['status_silence'],
      
      // Triggers
      'battle start': ['trigger_battle_start'],
      'turn start': ['trigger_turn_start'],
      'low hp': ['trigger_low_hp'],
      'critical hit': ['trigger_critical_hit']
    }

    // Check for phrase matches
    for (const [phrase, tagList] of Object.entries(phraseToTags)) {
      if (normalized.includes(phrase)) {
        tags.push(...tagList)
      }
    }

    // Advanced pattern matching for complex queries
    const patterns = [
      {
        pattern: /(\w+)\s+resistance\s+down/i,
        extract: (match) => [`resist_down_${match[1].toLowerCase()}`]
      },
      {
        pattern: /buff\s+(\w+)\s+(?:by\s+)?(\d+)%?/i,
        extract: (match) => [`buff_stats_${match[1].toLowerCase()}_up`]
      },
      {
        pattern: /(\w+)\s+element(?:al)?\s+damage/i,
        extract: (match) => [`dmg_${match[1].toLowerCase()}`]
      },
      {
        pattern: /hit\s+(\d+)\s+times?/i,
        extract: (match) => ['dmg_multi_hit']
      }
    ]

    for (const { pattern, extract } of patterns) {
      const match = normalized.match(pattern)
      if (match) {
        tags.push(...extract(match))
      }
    }

    return [...new Set(tags)] // Remove duplicates
  }

  /**
   * Extract filters from natural language
   */
  async extractFilters(query) {
    const filters = {}
    const normalized = this.normalizeQuery(query)

    // Tier filtering
    const tierMatch = normalized.match(/(?:tier|rank)\s*([sab+]+)/i)
    if (tierMatch) {
      filters.tiers = [tierMatch[1].toUpperCase()]
    }

    // Free vs Gacha
    if (normalized.includes('free character') || normalized.includes('story character')) {
      filters.isFree = true
    }
    if (normalized.includes('gacha') || normalized.includes('summon') || normalized.includes('pull')) {
      filters.isFree = false
    }

    // Job filtering
    const jobs = ['warrior', 'hunter', 'cleric', 'scholar', 'dancer', 'merchant', 'apothecary', 'thief']
    const foundJobs = jobs.filter(job => normalized.includes(job))
    if (foundJobs.length > 0) {
      filters.jobs = foundJobs.map(job => job.charAt(0).toUpperCase() + job.slice(1))
    }

    // Element filtering
    const elements = ['fire', 'ice', 'lightning', 'wind', 'light', 'dark']
    const foundElements = elements.filter(element => normalized.includes(element))
    if (foundElements.length > 0) {
      filters.elements = foundElements.map(element => 
        element.charAt(0).toUpperCase() + element.slice(1)
      )
    }

    // SP cost filtering
    const spCostMatch = normalized.match(/sp\s*(?:cost|requirement)\s*(?:(?:less|under|below)\s*)?(\d+)/i)
    if (spCostMatch) {
      const cost = parseInt(spCostMatch[1])
      if (normalized.includes('less') || normalized.includes('under') || normalized.includes('below')) {
        filters.spCostMax = cost
      } else {
        filters.spCostMin = cost
      }
    }

    // Priority filtering
    if (normalized.includes('must pull') || normalized.includes('essential')) {
      filters.priority = ['essential']
    }
    if (normalized.includes('skip') || normalized.includes('not worth')) {
      filters.priority = ['skip']
    }

    return filters
  }

  /**
   * Generate query suggestions based on partial input
   */
  async generateSuggestions(query, context = {}) {
    const suggestions = []
    const normalized = this.normalizeQuery(query)

    // Common query templates
    const templates = [
      'characters with {effect} effects',
      'skills that {action} {target}',
      '{element} damage dealers',
      'best {job} characters',
      'characters that can {ability}',
      '{tier} tier characters',
      'free characters with {effect}',
      'team for {content} content'
    ]

    // Extract key terms for template filling
    const keyTerms = normalized.split(' ').filter(word => word.length > 2)

    for (const template of templates) {
      // Try to fill template with extracted terms
      const placeholders = template.match(/\{(\w+)\}/g)
      if (placeholders) {
        for (const term of keyTerms) {
          let suggestion = template
          for (const placeholder of placeholders) {
            const placeholderKey = placeholder.slice(1, -1)
            suggestion = suggestion.replace(placeholder, this.getTermForPlaceholder(term, placeholderKey))
          }
          
          if (!suggestion.includes('{') && suggestion !== query) {
            suggestions.push({
              text: suggestion,
              type: 'template',
              confidence: 0.7,
              category: 'completion'
            })
          }
        }
      }
    }

    // Common complete queries
    const commonQueries = [
      'characters with fire resistance down',
      'skills that buff the entire party',
      'best healers in the game',
      'multi-hit physical damage dealers',
      'BP generation characters',
      'immunity to charm effects',
      'follow-up attack abilities',
      'AoE elemental damage',
      'top tier buffer characters',
      'free characters worth investing'
    ]

    for (const commonQuery of commonQueries) {
      if (commonQuery.includes(normalized) && commonQuery !== query) {
        suggestions.push({
          text: commonQuery,
          type: 'common',
          confidence: 0.8,
          category: 'popular'
        })
      }
    }

    // Context-aware suggestions
    if (context.previousQueries) {
      for (const prevQuery of context.previousQueries.slice(-3)) {
        if (prevQuery.includes(normalized) && prevQuery !== query) {
          suggestions.push({
            text: prevQuery,
            type: 'history',
            confidence: 0.6,
            category: 'recent'
          })
        }
      }
    }

    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 8)
  }

  /**
   * Calculate confidence score for the analysis
   */
  calculateConfidence(analysis) {
    let confidence = 0.3 // Base confidence

    // Intent confidence
    if (analysis.intent && analysis.intent.confidence) {
      confidence += analysis.intent.confidence * 0.3
    }

    // Entity extraction confidence
    const totalEntities = Object.values(analysis.entities).flat().length
    if (totalEntities > 0) {
      confidence += Math.min(totalEntities * 0.1, 0.2)
    }

    // Tag extraction confidence
    if (analysis.tags.length > 0) {
      confidence += Math.min(analysis.tags.length * 0.05, 0.2)
    }

    // Filter extraction confidence
    const filterCount = Object.keys(analysis.filters).length
    if (filterCount > 0) {
      confidence += Math.min(filterCount * 0.05, 0.15)
    }

    return Math.min(confidence, 1.0)
  }

  /**
   * Update context memory for learning
   */
  updateContextMemory(query, analysis) {
    const key = this.normalizeQuery(query)
    
    if (!this.contextMemory.has(key)) {
      this.contextMemory.set(key, {
        count: 0,
        analyses: []
      })
    }

    const memory = this.contextMemory.get(key)
    memory.count++
    memory.analyses.push({
      analysis,
      timestamp: new Date().toISOString()
    })

    // Keep only recent analyses
    if (memory.analyses.length > 5) {
      memory.analyses = memory.analyses.slice(-5)
    }
  }

  /**
   * Helper methods
   */
  getTermForPlaceholder(term, placeholder) {
    const mappings = {
      'effect': this.isEffect(term) ? term : 'buff',
      'action': this.isAction(term) ? term : 'increase',
      'target': this.isTarget(term) ? term : 'allies',
      'element': this.isElement(term) ? term : 'fire',
      'job': this.isJob(term) ? term : 'warrior',
      'ability': this.isAbility(term) ? term : 'heal',
      'tier': this.isTier(term) ? term : 'S',
      'content': this.isContent(term) ? term : 'battle'
    }

    return mappings[placeholder] || term
  }

  isEffect(term) {
    const effects = ['damage', 'heal', 'buff', 'debuff', 'poison', 'charm', 'sleep']
    return effects.includes(term)
  }

  isAction(term) {
    const actions = ['increase', 'decrease', 'boost', 'lower', 'heal', 'damage', 'protect']
    return actions.includes(term)
  }

  isTarget(term) {
    const targets = ['ally', 'allies', 'enemy', 'enemies', 'party', 'team', 'self']
    return targets.includes(term)
  }

  isElement(term) {
    const elements = ['fire', 'ice', 'lightning', 'wind', 'light', 'dark']
    return elements.includes(term)
  }

  isJob(term) {
    const jobs = ['warrior', 'hunter', 'cleric', 'scholar', 'dancer', 'merchant', 'apothecary', 'thief']
    return jobs.includes(term)
  }

  isAbility(term) {
    const abilities = ['heal', 'damage', 'buff', 'debuff', 'protect', 'attack', 'support']
    return abilities.includes(term)
  }

  isTier(term) {
    return /^[sab][+]?$/i.test(term)
  }

  isContent(term) {
    const content = ['battle', 'boss', 'tower', 'arena', 'story', 'quest']
    return content.includes(term)
  }

  buildQueryPatterns() {
    return {
      damageQuery: /(?:characters?|who).+(?:deal|do|cause).+(?:damage|dmg)/i,
      healQuery: /(?:characters?|who).+(?:heal|restore|recovery)/i,
      buffQuery: /(?:characters?|who).+(?:buff|boost|increase|enhance)/i,
      debuffQuery: /(?:characters?|who).+(?:debuff|lower|reduce|weaken)/i,
      teamQuery: /(?:team|party|group|comp).+(?:for|against|with)/i,
      metaQuery: /(?:meta|tier|rank|best|top|strongest)/i
    }
  }

  buildEntityRecognition() {
    return {
      characterNames: new Set([
        'primrose', 'cyrus', 'tressa', 'haanit', 'alfyn', 'therion', 'ophilia', 'olberic',
        'agnea', 'partitio', 'osvald', 'throne', 'castti', 'ochette', 'temenos', 'hikari'
      ]),
      jobNames: new Set(['warrior', 'hunter', 'cleric', 'scholar', 'dancer', 'merchant', 'apothecary', 'thief']),
      elementNames: new Set(['fire', 'ice', 'lightning', 'thunder', 'wind', 'light', 'dark']),
      effectNames: new Set(['damage', 'heal', 'buff', 'debuff', 'poison', 'charm', 'sleep', 'paralysis'])
    }
  }

  buildIntentClassification() {
    return {
      searchIntents: [
        'find_characters',
        'find_skills', 
        'team_building',
        'comparison',
        'recommendation',
        'meta_analysis'
      ],
      confidenceThreshold: 0.6
    }
  }
}

export default SkillNaturalLanguageProcessor