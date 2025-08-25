/**
 * AI Features for COTC Meta Guide - User-Facing Intelligence
 * 
 * Provides intelligent features that enhance the user experience through
 * AI-powered recommendations, smart search, and personalized suggestions.
 * 
 * Features:
 * - Smart character recommendations based on usage patterns
 * - Intelligent search suggestions and auto-complete
 * - Personalized team building assistance
 * - AI-powered character insights and explanations
 * - Smart filter suggestions based on search intent
 * - Conversation-based character discovery
 * 
 * @version 1.0.0
 */

import aiMemory from './aiMemory'
import aiValidation from './aiValidation'
import mcpIntegration from './mcpIntegration'
import TagSystem from './tagSystem'
import debug from './debug'

// AI Features Configuration
const AI_FEATURES_CONFIG = {
  // Recommendation settings
  maxRecommendations: 8,
  minRecommendationConfidence: 0.6,
  personalizedWeight: 0.7,
  
  // Search enhancement
  maxSearchSuggestions: 6,
  autoCompleteMinLength: 2,
  searchLearningEnabled: true,
  
  // Team building
  maxTeamSuggestions: 3,
  teamAnalysisEnabled: true,
  synergyDetectionEnabled: true,
  
  // Insights and explanations
  maxInsightLength: 500,
  explanationDetail: 'medium', // brief, medium, detailed
  
  // Performance settings
  debounceDelay: 300,
  maxProcessingTime: 2000,
  
  // Feature toggles
  enableSmartRecommendations: true,
  enableIntelligentSearch: true,
  enableTeamBuilder: true,
  enableCharacterInsights: true,
  enableConversationalUI: true
}

/**
 * AI Features System - User-Facing Intelligence
 */
class AIFeatures {
  constructor(config = {}) {
    this.config = { ...AI_FEATURES_CONFIG, ...config }
    this.tagSystem = new TagSystem()
    this.debounceTimers = new Map()
    this.processingQueue = new Map()
    this.initialized = false
    
    // Add AI features debugger
    if (!debug.aiFeatures) {
      debug.aiFeatures = {
        log: (...args) => debug.general.log('[AI-FEATURES]', ...args),
        warn: (...args) => debug.general.warn('[AI-FEATURES]', ...args),
        error: (...args) => debug.general.error('[AI-FEATURES]', ...args),
        group: (label) => debug.general.group(`[AI-FEATURES] ${label}`),
        groupEnd: () => debug.general.groupEnd()
      }
    }
    
    this.init()
  }

  /**
   * Initialize AI features
   */
  async init() {
    try {
      debug.aiFeatures.log('Initializing AI Features...')
      
      // Initialize feature modules
      await this.initRecommendationEngine()
      await this.initIntelligentSearch()
      await this.initTeamBuilder()
      await this.initInsightsEngine()
      
      this.initialized = true
      debug.aiFeatures.log('AI Features initialized successfully')
      
    } catch (error) {
      debug.aiFeatures.error('Failed to initialize AI Features:', error)
    }
  }

  /**
   * Initialize recommendation engine
   */
  async initRecommendationEngine() {
    if (!this.config.enableSmartRecommendations) return
    
    this.recommendationEngine = {
      userPatterns: new Map(),
      characterScores: new Map(),
      lastUpdate: null
    }
    
    debug.aiFeatures.log('Recommendation engine initialized')
  }

  /**
   * Initialize intelligent search
   */
  async initIntelligentSearch() {
    if (!this.config.enableIntelligentSearch) return
    
    this.searchEngine = {
      queryPatterns: new Map(),
      suggestionCache: new Map(),
      learningData: new Map()
    }
    
    debug.aiFeatures.log('Intelligent search initialized')
  }

  /**
   * Initialize AI team builder
   */
  async initTeamBuilder() {
    if (!this.config.enableTeamBuilder) return
    
    this.teamBuilder = {
      compositionTemplates: new Map(),
      synergyRules: new Map(),
      userPreferences: new Map()
    }
    
    // Load team composition templates
    await this.loadTeamTemplates()
    
    debug.aiFeatures.log('AI team builder initialized')
  }

  /**
   * Initialize insights engine
   */
  async initInsightsEngine() {
    if (!this.config.enableCharacterInsights) return
    
    this.insightsEngine = {
      characterAnalyses: new Map(),
      insightTemplates: new Map(),
      explanationCache: new Map()
    }
    
    debug.aiFeatures.log('Insights engine initialized')
  }

  /**
   * Get personalized character recommendations
   */
  async getPersonalizedRecommendations(context = {}) {
    if (!this.config.enableSmartRecommendations) return []
    
    try {
      debug.aiFeatures.group('Generating personalized recommendations')
      
      // Get user behavior patterns
      const userPatterns = await this.getUserBehaviorPatterns()
      
      // Get character relevance scores
      const relevanceData = await aiMemory.getCharacterRelevanceData()
      
      // Generate recommendations using multiple strategies
      const recommendations = await Promise.all([
        this.getUsageBasedRecommendations(userPatterns),
        this.getSimilarityBasedRecommendations(context.currentCharacter),
        this.getMetaBasedRecommendations(context),
        this.getMCPBasedRecommendations(context)
      ])
      
      // Combine and rank recommendations
      const combinedRecommendations = this.combineRecommendations(recommendations.flat())
      
      // Apply personalization weights
      const personalizedRecommendations = this.applyPersonalization(combinedRecommendations, userPatterns)
      
      // Filter by confidence threshold and limit results
      const finalRecommendations = personalizedRecommendations
        .filter(rec => rec.confidence >= this.config.minRecommendationConfidence)
        .slice(0, this.config.maxRecommendations)
      
      debug.aiFeatures.log(`Generated ${finalRecommendations.length} recommendations`)
      debug.aiFeatures.groupEnd()
      
      return finalRecommendations
      
    } catch (error) {
      debug.aiFeatures.error('Failed to generate recommendations:', error)
      debug.aiFeatures.groupEnd()
      return []
    }
  }

  /**
   * Get intelligent search suggestions
   */
  async getSearchSuggestions(query, currentFilters = {}, characters = []) {
    if (!this.config.enableIntelligentSearch || !query || query.length < this.config.autoCompleteMinLength) {
      return []
    }
    
    const cacheKey = `search_${query}_${JSON.stringify(currentFilters)}`
    
    // Check cache first
    if (this.searchEngine.suggestionCache.has(cacheKey)) {
      const cached = this.searchEngine.suggestionCache.get(cacheKey)
      if (Date.now() - cached.timestamp < 300000) { // 5 minutes cache
        return cached.suggestions
      }
    }
    
    try {
      debug.aiFeatures.group(`Generating search suggestions for: "${query}"`)
      
      // Debounce the request
      const suggestions = await this.debounce(`search_${query}`, async () => {
        const suggestions = []
        
        // Tag-based suggestions
        const tagSuggestions = this.tagSystem.suggestTags(query, 3)
        tagSuggestions.forEach(tag => {
          suggestions.push({
            type: 'tag',
            suggestion: tag.name,
            display: tag.description || tag.name,
            confidence: tag.score / 100,
            category: tag.category
          })
        })
        
        // Character name suggestions
        const nameSuggestions = this.getCharacterNameSuggestions(query, characters)
        suggestions.push(...nameSuggestions)
        
        // Filter suggestions based on query intent
        const filterSuggestions = await this.getFilterSuggestions(query, currentFilters)
        suggestions.push(...filterSuggestions)
        
        // AI-powered contextual suggestions
        const aiSuggestions = await this.getAISuggestions(query, currentFilters)
        suggestions.push(...aiSuggestions)
        
        // Natural language query suggestions
        const nlSuggestions = await this.getNaturalLanguageSuggestions(query)
        suggestions.push(...nlSuggestions)
        
        // Sort by confidence and limit
        const finalSuggestions = suggestions
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, this.config.maxSearchSuggestions)
        
        return finalSuggestions
      })
      
      // Cache results
      this.searchEngine.suggestionCache.set(cacheKey, {
        suggestions,
        timestamp: Date.now()
      })
      
      debug.aiFeatures.log(`Generated ${suggestions.length} search suggestions`)
      debug.aiFeatures.groupEnd()
      
      return suggestions
      
    } catch (error) {
      debug.aiFeatures.error('Failed to generate search suggestions:', error)
      debug.aiFeatures.groupEnd()
      return []
    }
  }

  /**
   * Get AI-powered team suggestions
   */
  async getTeamSuggestions(requirements, ownedCharacters = [], context = {}) {
    if (!this.config.enableTeamBuilder) return []
    
    try {
      debug.aiFeatures.group('Generating AI team suggestions')
      
      // Use MCP for advanced team building if available
      const mcpSuggestions = await mcpIntegration.buildTeam(requirements, {
        ownedCharacters: ownedCharacters.map(c => c.id),
        excludeCharacters: context.excludeCharacters || []
      })
      
      // Generate local team suggestions as backup/supplement
      const localSuggestions = await this.generateLocalTeamSuggestions(requirements, ownedCharacters)
      
      // Combine MCP and local suggestions
      const combinedSuggestions = this.combineTeamSuggestions([mcpSuggestions, localSuggestions])
      
      // Rank by user preferences and meta relevance
      const rankedSuggestions = await this.rankTeamSuggestions(combinedSuggestions, context)
      
      debug.aiFeatures.log(`Generated ${rankedSuggestions.length} team suggestions`)
      debug.aiFeatures.groupEnd()
      
      return rankedSuggestions.slice(0, this.config.maxTeamSuggestions)
      
    } catch (error) {
      debug.aiFeatures.error('Failed to generate team suggestions:', error)
      debug.aiFeatures.groupEnd()
      return []
    }
  }

  /**
   * Get character insights and explanations
   */
  async getCharacterInsights(character, context = {}) {
    if (!this.config.enableCharacterInsights) return null
    
    try {
      debug.aiFeatures.group(`Generating insights for ${character.name}`)
      
      // Check cache first
      const cacheKey = `insights_${character.id}`
      if (this.insightsEngine.characterAnalyses.has(cacheKey)) {
        const cached = this.insightsEngine.characterAnalyses.get(cacheKey)
        if (Date.now() - cached.timestamp < 600000) { // 10 minutes cache
          debug.aiFeatures.log('Using cached insights')
          debug.aiFeatures.groupEnd()
          return cached.insights
        }
      }
      
      // Generate comprehensive insights
      const insights = {
        overview: await this.generateCharacterOverview(character),
        strengths: await this.analyzeCharacterStrengths(character),
        weaknesses: await this.analyzeCharacterWeaknesses(character),
        synergies: await this.analyzeCharacterSynergies(character),
        usage: await this.generateUsageRecommendations(character),
        meta: await this.generateMetaAnalysis(character),
        investment: await this.generateInvestmentGuidance(character),
        aiAnalysis: null
      }
      
      // Get AI-powered detailed analysis if available
      try {
        insights.aiAnalysis = await mcpIntegration.analyzeCharacter(character.id, {
          context: context.analysisContext || 'detailed',
          includeComparisons: true
        })
      } catch (error) {
        debug.aiFeatures.warn('AI analysis unavailable:', error.message)
      }
      
      // Cache the insights
      this.insightsEngine.characterAnalyses.set(cacheKey, {
        insights,
        timestamp: Date.now()
      })
      
      debug.aiFeatures.log('Character insights generated successfully')
      debug.aiFeatures.groupEnd()
      
      return insights
      
    } catch (error) {
      debug.aiFeatures.error('Failed to generate character insights:', error)
      debug.aiFeatures.groupEnd()
      return null
    }
  }

  /**
   * Process natural language queries
   */
  async processNaturalLanguageQuery(query, context = {}) {
    if (!this.config.enableConversationalUI) {
      return {
        understood: false,
        response: 'Natural language queries are not enabled.'
      }
    }
    
    try {
      debug.aiFeatures.group(`Processing natural language query: "${query}"`)
      
      // Use MCP for advanced natural language processing
      const mcpResponse = await mcpIntegration.processNaturalQuery(query, {
        currentFilters: context.currentFilters,
        viewedCharacters: context.viewedCharacters,
        responseFormat: 'detailed'
      })
      
      // Enhance with local processing
      const localAnalysis = this.analyzeQueryIntent(query)
      
      const response = {
        understood: mcpResponse.confidence > 0.5,
        response: mcpResponse.response || 'I couldn\'t understand that query.',
        confidence: mcpResponse.confidence,
        suggestions: mcpResponse.suggestions || [],
        actions: this.extractActionableInsights(mcpResponse, localAnalysis),
        filters: localAnalysis.suggestedFilters || {}
      }
      
      // Track the query for learning
      await aiMemory.trackConversation('natural_language_query', {
        query,
        response: response.response,
        understood: response.understood,
        confidence: response.confidence
      })
      
      debug.aiFeatures.log(`Query processed with ${response.confidence.toFixed(2)} confidence`)
      debug.aiFeatures.groupEnd()
      
      return response
      
    } catch (error) {
      debug.aiFeatures.error('Failed to process natural language query:', error)
      debug.aiFeatures.groupEnd()
      
      return {
        understood: false,
        response: 'Sorry, I encountered an error processing your query. Please try rephrasing.',
        confidence: 0,
        suggestions: [],
        actions: []
      }
    }
  }

  /**
   * Get smart filter suggestions based on context
   */
  async getSmartFilterSuggestions(currentFilters = {}, searchResults = []) {
    try {
      const suggestions = []
      
      // Analyze current results to suggest refinements
      if (searchResults.length > 0) {
        const resultAnalysis = this.analyzeSearchResults(searchResults)
        
        // Suggest filters to narrow down results
        if (searchResults.length > 20) {
          suggestions.push(...this.getNarrowingFilterSuggestions(resultAnalysis, currentFilters))
        }
        
        // Suggest filters to explore related characters
        if (searchResults.length < 5) {
          suggestions.push(...this.getBroadeningFilterSuggestions(resultAnalysis, currentFilters))
        }
      }
      
      // AI-powered contextual suggestions
      const contextualSuggestions = await this.getContextualFilterSuggestions(currentFilters)
      suggestions.push(...contextualSuggestions)
      
      // User pattern-based suggestions
      const patternSuggestions = await this.getPatternBasedFilterSuggestions(currentFilters)
      suggestions.push(...patternSuggestions)
      
      return suggestions.slice(0, 6) // Limit to 6 suggestions
      
    } catch (error) {
      debug.aiFeatures.error('Failed to generate filter suggestions:', error)
      return []
    }
  }

  /**
   * Get personalized explanations for character ratings
   */
  async getPersonalizedExplanation(character, rating, context = {}) {
    try {
      const explanation = {
        summary: '',
        details: [],
        reasoning: [],
        recommendations: [],
        confidence: 0.8
      }
      
      // Generate explanation based on rating type
      switch (rating) {
        case 'tier':
          explanation.summary = await this.explainTierRating(character)
          explanation.details = await this.getTierRatingDetails(character)
          break
          
        case 'priority':
          explanation.summary = await this.explainPriorityRating(character)
          explanation.details = await this.getPriorityDetails(character)
          break
          
        case 'investment':
          explanation.summary = await this.explainInvestmentValue(character)
          explanation.details = await this.getInvestmentDetails(character)
          break
      }
      
      // Add personalized context
      const userContext = await aiMemory.getUserContext?.() || {}
      if (userContext.preferences) {
        explanation.recommendations = this.getPersonalizedRecommendations(character, userContext.preferences)
      }
      
      return explanation
      
    } catch (error) {
      debug.aiFeatures.error('Failed to generate personalized explanation:', error)
      return null
    }
  }

  // ===============================
  // HELPER METHODS
  // ===============================

  /**
   * Debounce utility for preventing excessive API calls
   */
  async debounce(key, fn, delay = this.config.debounceDelay) {
    // Clear existing timer
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key))
    }
    
    // Return promise that resolves after debounce delay
    return new Promise((resolve, reject) => {
      const timer = setTimeout(async () => {
        try {
          const result = await fn()
          resolve(result)
        } catch (error) {
          reject(error)
        } finally {
          this.debounceTimers.delete(key)
        }
      }, delay)
      
      this.debounceTimers.set(key, timer)
    })
  }

  /**
   * Get user behavior patterns for personalization
   */
  async getUserBehaviorPatterns() {
    try {
      const patterns = {
        preferredRoles: await aiMemory.getPreference('preferred_roles', []),
        preferredElements: await aiMemory.getPreference('preferred_elements', []),
        searchHistory: [], // Would be populated from memory
        viewedCharacters: [], // Would be populated from memory
        teamBuildingPatterns: [] // Would be analyzed from memory
      }
      
      return patterns
    } catch (error) {
      debug.aiFeatures.error('Failed to get user patterns:', error)
      return {}
    }
  }

  /**
   * Generate usage-based recommendations
   */
  async getUsageBasedRecommendations(userPatterns) {
    const recommendations = []
    
    // Recommend characters based on role preferences
    if (userPatterns.preferredRoles && userPatterns.preferredRoles.length > 0) {
      userPatterns.preferredRoles.forEach(role => {
        recommendations.push({
          type: 'role_preference',
          characterId: `role_${role}`, // Placeholder - would map to actual characters
          reason: `You frequently view ${role} characters`,
          confidence: 0.7,
          source: 'usage_pattern'
        })
      })
    }
    
    return recommendations
  }

  /**
   * Generate similarity-based recommendations
   */
  async getSimilarityBasedRecommendations(currentCharacter) {
    const recommendations = []
    
    if (currentCharacter) {
      // Find similar characters based on attributes
      const similarTags = this.tagSystem.getAllTagsForCharacter(currentCharacter)
      
      recommendations.push({
        type: 'similarity',
        reason: `Similar to ${currentCharacter.name}`,
        confidence: 0.8,
        source: 'similarity',
        basedOn: similarTags.slice(0, 3)
      })
    }
    
    return recommendations
  }

  /**
   * Generate meta-based recommendations
   */
  async getMetaBasedRecommendations(context) {
    const recommendations = []
    
    // Recommend high-tier characters
    recommendations.push({
      type: 'meta',
      reason: 'Currently meta-relevant',
      confidence: 0.9,
      source: 'meta_analysis',
      category: 'high_tier'
    })
    
    return recommendations
  }

  /**
   * Generate MCP-based recommendations
   */
  async getMCPBasedRecommendations(context) {
    try {
      // This would use MCP integration for advanced recommendations
      return []
    } catch (error) {
      debug.aiFeatures.warn('MCP recommendations unavailable:', error)
      return []
    }
  }

  /**
   * Combine multiple recommendation sources
   */
  combineRecommendations(recommendations) {
    const combined = new Map()
    
    recommendations.forEach(rec => {
      const key = rec.characterId || rec.type
      if (combined.has(key)) {
        const existing = combined.get(key)
        existing.confidence = Math.max(existing.confidence, rec.confidence)
        existing.sources = [...(existing.sources || []), rec.source]
      } else {
        combined.set(key, { ...rec, sources: [rec.source] })
      }
    })
    
    return Array.from(combined.values())
  }

  /**
   * Apply personalization weights to recommendations
   */
  applyPersonalization(recommendations, userPatterns) {
    return recommendations.map(rec => {
      let personalizedConfidence = rec.confidence
      
      // Apply user preference weights
      if (rec.type === 'role_preference' && userPatterns.preferredRoles) {
        personalizedConfidence *= this.config.personalizedWeight
      }
      
      return {
        ...rec,
        confidence: Math.min(1.0, personalizedConfidence)
      }
    })
  }

  /**
   * Get character name suggestions based on partial match
   */
  getCharacterNameSuggestions(query, characters) {
    const suggestions = []
    const queryLower = query.toLowerCase()
    
    characters.forEach(character => {
      if (character.name.toLowerCase().includes(queryLower)) {
        suggestions.push({
          type: 'character',
          suggestion: character.name,
          display: character.name,
          confidence: character.name.toLowerCase().startsWith(queryLower) ? 0.9 : 0.7,
          characterId: character.id
        })
      }
    })
    
    return suggestions.slice(0, 3)
  }

  /**
   * Get filter suggestions based on query analysis
   */
  async getFilterSuggestions(query, currentFilters) {
    const suggestions = []
    const queryLower = query.toLowerCase()
    
    // Job suggestions
    const jobs = ['hunter', 'warrior', 'cleric', 'scholar', 'dancer', 'merchant', 'apothecary', 'thief']
    jobs.forEach(job => {
      if (job.includes(queryLower) && !currentFilters.job?.includes(job)) {
        suggestions.push({
          type: 'filter',
          suggestion: job,
          display: `Filter by ${job}s`,
          confidence: 0.8,
          filter: 'job',
          value: job
        })
      }
    })
    
    // Element suggestions
    const elements = ['fire', 'ice', 'lightning', 'wind', 'light', 'dark']
    elements.forEach(element => {
      if (element.includes(queryLower) && !currentFilters.elements?.includes(element)) {
        suggestions.push({
          type: 'filter',
          suggestion: element,
          display: `Filter by ${element} element`,
          confidence: 0.8,
          filter: 'elements',
          value: element
        })
      }
    })
    
    return suggestions
  }

  /**
   * Get AI-powered contextual suggestions
   */
  async getAISuggestions(query, currentFilters) {
    try {
      // This would use more advanced AI analysis
      return []
    } catch (error) {
      debug.aiFeatures.warn('AI suggestions unavailable:', error)
      return []
    }
  }

  /**
   * Get natural language query suggestions
   */
  async getNaturalLanguageSuggestions(query) {
    const suggestions = []
    
    // Common query patterns
    const patterns = [
      { pattern: /best.*buffer/i, suggestion: 'Show me the best buffer characters', confidence: 0.9 },
      { pattern: /fire.*team/i, suggestion: 'Build a fire element team', confidence: 0.9 },
      { pattern: /free.*character/i, suggestion: 'Show free characters only', confidence: 0.8 }
    ]
    
    patterns.forEach(({ pattern, suggestion, confidence }) => {
      if (pattern.test(query)) {
        suggestions.push({
          type: 'natural_language',
          suggestion,
          display: suggestion,
          confidence,
          isQuery: true
        })
      }
    })
    
    return suggestions
  }

  /**
   * Load team composition templates
   */
  async loadTeamTemplates() {
    // This would load predefined team templates
    this.teamBuilder.compositionTemplates.set('physical_team', {
      name: 'Physical Team',
      roles: ['dps', 'buffer', 'debuffer'],
      elements: [],
      synergies: ['physical_damage', 'break_boost']
    })
    
    this.teamBuilder.compositionTemplates.set('elemental_team', {
      name: 'Elemental Team',
      roles: ['dps', 'buffer'],
      elements: ['fire', 'ice', 'lightning'],
      synergies: ['elemental_damage', 'resist_down']
    })
  }

  /**
   * Generate local team suggestions
   */
  async generateLocalTeamSuggestions(requirements, ownedCharacters) {
    // Local fallback team building logic
    return []
  }

  /**
   * Combine team suggestions from multiple sources
   */
  combineTeamSuggestions(suggestions) {
    // Logic to combine and deduplicate team suggestions
    return suggestions.flat()
  }

  /**
   * Rank team suggestions based on user preferences
   */
  async rankTeamSuggestions(suggestions, context) {
    // Ranking logic based on user preferences and meta relevance
    return suggestions
  }

  /**
   * Generate character overview
   */
  async generateCharacterOverview(character) {
    let overview = `${character.name} is a ${character.starRating || '?'}-star ${character.job || 'character'}`
    
    if (character.tierRatings?.gl?.tier) {
      overview += ` with ${character.tierRatings.gl.tier} tier rating`
    }
    
    if (character.isFree) {
      overview += ', available as a free character'
    }
    
    return overview
  }

  /**
   * Additional helper methods would be implemented here...
   */
  
  analyzeCharacterStrengths(character) { return [] }
  analyzeCharacterWeaknesses(character) { return [] }
  analyzeCharacterSynergies(character) { return [] }
  generateUsageRecommendations(character) { return [] }
  generateMetaAnalysis(character) { return {} }
  generateInvestmentGuidance(character) { return {} }
  analyzeQueryIntent(query) { return {} }
  extractActionableInsights(mcpResponse, localAnalysis) { return [] }
  analyzeSearchResults(results) { return {} }
  getNarrowingFilterSuggestions(analysis, filters) { return [] }
  getBroadeningFilterSuggestions(analysis, filters) { return [] }
  getContextualFilterSuggestions(filters) { return [] }
  getPatternBasedFilterSuggestions(filters) { return [] }
  explainTierRating(character) { return '' }
  getTierRatingDetails(character) { return [] }
  explainPriorityRating(character) { return '' }
  getPriorityDetails(character) { return [] }
  explainInvestmentValue(character) { return '' }
  getInvestmentDetails(character) { return [] }

  /**
   * Get AI Features status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      enabledFeatures: {
        smartRecommendations: this.config.enableSmartRecommendations,
        intelligentSearch: this.config.enableIntelligentSearch,
        teamBuilder: this.config.enableTeamBuilder,
        characterInsights: this.config.enableCharacterInsights,
        conversationalUI: this.config.enableConversationalUI
      },
      cacheStatus: {
        searchSuggestions: this.searchEngine?.suggestionCache?.size || 0,
        characterInsights: this.insightsEngine?.characterAnalyses?.size || 0
      },
      config: this.config
    }
  }
}

// Create and export singleton instance
export const aiFeatures = new AIFeatures()

// Export class for custom instances
export { AIFeatures }

export default aiFeatures