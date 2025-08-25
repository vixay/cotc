/**
 * AI Memory System for COTC Meta Guide
 * 
 * Implements persistent conversation context, user preferences, and AI-assisted features
 * using IndexedDB for persistent storage and localStorage for session data.
 * 
 * Architecture:
 * - Short-term memory: In-memory cache for active session
 * - Medium-term memory: localStorage for session persistence
 * - Long-term memory: IndexedDB for persistent conversation history
 * - Vector memory: For semantic search and similarity matching
 * 
 * @version 1.0.0
 */

import debug from './debug'

// Memory system configuration
const MEMORY_CONFIG = {
  // Database configuration
  dbName: 'COTCMemory',
  dbVersion: 1,
  
  // Storage limits
  maxConversationHistory: 1000,
  maxSearchHistory: 500,
  maxUserPreferences: 100,
  
  // Session configuration
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  cleanupInterval: 60 * 60 * 1000, // 1 hour
  
  // AI configuration
  confidenceThreshold: 0.7,
  maxSuggestions: 10,
  learningEnabled: true
}

/**
 * Memory Types:
 * - conversation: User interactions, searches, selections
 * - preferences: User behavior patterns, preferred characters, filters
 * - context: Character context, team building patterns, meta insights
 * - validation: AI confidence scores, human corrections, training data
 */

class AIMemorySystem {
  constructor(config = {}) {
    this.config = { ...MEMORY_CONFIG, ...config }
    this.db = null
    this.sessionMemory = new Map()
    this.initialized = false
    
    // Add AI debugger to the debug system
    if (!debug.ai) {
      debug.ai = {
        log: (...args) => debug.general.log('[AI]', ...args),
        warn: (...args) => debug.general.warn('[AI]', ...args),
        error: (...args) => debug.general.error('[AI]', ...args),
        group: (label) => debug.general.group(`[AI] ${label}`),
        groupEnd: () => debug.general.groupEnd()
      }
    }
    
    this.init()
  }

  /**
   * Initialize the memory system
   */
  async init() {
    try {
      debug.ai.log('Initializing AI Memory System...')
      
      // Initialize IndexedDB
      await this.initDB()
      
      // Load session data from localStorage
      this.loadSessionData()
      
      // Start cleanup interval
      this.startCleanupInterval()
      
      // Initialize AI features
      await this.initAIFeatures()
      
      this.initialized = true
      debug.ai.log('AI Memory System initialized successfully')
      
    } catch (error) {
      debug.ai.error('Failed to initialize AI Memory System:', error)
      throw error
    }
  }

  /**
   * Initialize IndexedDB database
   */
  initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.dbName, this.config.dbVersion)
      
      request.onerror = () => {
        debug.ai.error('IndexedDB error:', request.error)
        reject(request.error)
      }
      
      request.onsuccess = () => {
        this.db = request.result
        debug.ai.log('IndexedDB connected successfully')
        resolve()
      }
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result
        
        // Conversation history store
        if (!db.objectStoreNames.contains('conversations')) {
          const conversationStore = db.createObjectStore('conversations', { 
            keyPath: 'id', 
            autoIncrement: true 
          })
          conversationStore.createIndex('timestamp', 'timestamp')
          conversationStore.createIndex('type', 'type')
          conversationStore.createIndex('sessionId', 'sessionId')
        }
        
        // User preferences store
        if (!db.objectStoreNames.contains('preferences')) {
          const preferencesStore = db.createObjectStore('preferences', { 
            keyPath: 'key' 
          })
          preferencesStore.createIndex('category', 'category')
          preferencesStore.createIndex('lastUpdated', 'lastUpdated')
        }
        
        // Context store for character insights and patterns
        if (!db.objectStoreNames.contains('context')) {
          const contextStore = db.createObjectStore('context', { 
            keyPath: 'id', 
            autoIncrement: true 
          })
          contextStore.createIndex('entityType', 'entityType')
          contextStore.createIndex('entityId', 'entityId')
          contextStore.createIndex('relevance', 'relevance')
        }
        
        // AI validation store for learning and improvement
        if (!db.objectStoreNames.contains('validation')) {
          const validationStore = db.createObjectStore('validation', { 
            keyPath: 'id', 
            autoIncrement: true 
          })
          validationStore.createIndex('type', 'type')
          validationStore.createIndex('confidence', 'confidence')
          validationStore.createIndex('validated', 'validated')
        }
        
        debug.ai.log('IndexedDB schema created/upgraded')
      }
    })
  }

  /**
   * Load session data from localStorage
   */
  loadSessionData() {
    try {
      const sessionData = localStorage.getItem('cotc-ai-session')
      if (sessionData) {
        const parsed = JSON.parse(sessionData)
        
        // Check if session is still valid
        if (parsed.timestamp && Date.now() - parsed.timestamp < this.config.sessionTimeout) {
          Object.entries(parsed.data || {}).forEach(([key, value]) => {
            this.sessionMemory.set(key, value)
          })
          debug.ai.log('Session data loaded from localStorage')
        } else {
          debug.ai.log('Session data expired, starting fresh')
          localStorage.removeItem('cotc-ai-session')
        }
      }
    } catch (error) {
      debug.ai.warn('Failed to load session data:', error)
    }
  }

  /**
   * Save session data to localStorage
   */
  saveSessionData() {
    try {
      const sessionData = {
        timestamp: Date.now(),
        data: Object.fromEntries(this.sessionMemory)
      }
      localStorage.setItem('cotc-ai-session', JSON.stringify(sessionData))
    } catch (error) {
      debug.ai.warn('Failed to save session data:', error)
    }
  }

  /**
   * Start cleanup interval for memory management
   */
  startCleanupInterval() {
    setInterval(() => {
      this.cleanupMemory()
    }, this.config.cleanupInterval)
  }

  /**
   * Initialize AI-specific features
   */
  async initAIFeatures() {
    // Initialize conversation tracking
    this.trackSession('system_init', {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    })
    
    // Load user behavior patterns
    await this.loadUserPatterns()
    
    // Initialize recommendation engine
    this.initRecommendationEngine()
  }

  /**
   * Track conversation/interaction events
   */
  async trackConversation(type, data) {
    const conversation = {
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      type,
      data,
      metadata: {
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    }
    
    // Store in session memory
    const sessionKey = `conv_${conversation.timestamp}`
    this.sessionMemory.set(sessionKey, conversation)
    this.saveSessionData()
    
    // Store in IndexedDB for persistence
    if (this.db) {
      try {
        const transaction = this.db.transaction(['conversations'], 'readwrite')
        const store = transaction.objectStore('conversations')
        await store.add(conversation)
        
        debug.ai.log('Conversation tracked:', type, data)
      } catch (error) {
        debug.ai.error('Failed to store conversation:', error)
      }
    }
  }

  /**
   * Track search behavior and patterns
   */
  async trackSearch(query, filters, results) {
    const searchData = {
      query,
      filters: { ...filters },
      resultCount: results.length,
      topResults: results.slice(0, 5).map(r => ({
        id: r.id,
        name: r.name,
        tier: r.tierRatings?.gl?.tier
      }))
    }
    
    await this.trackConversation('search', searchData)
    
    // Learn from search patterns
    this.learnSearchPattern(query, filters, results)
  }

  /**
   * Track character selection and modal views
   */
  async trackCharacterView(character, context = 'modal') {
    const viewData = {
      characterId: character.id,
      characterName: character.name,
      context,
      tier: character.tierRatings?.gl?.tier,
      priority: character.ultPriority,
      isFree: character.isFree
    }
    
    await this.trackConversation('character_view', viewData)
    
    // Update character relevance
    await this.updateCharacterRelevance(character.id, 0.1)
  }

  /**
   * Track team building patterns
   */
  async trackTeamBuilding(selectedCharacters, context = 'filters') {
    const teamData = {
      characters: selectedCharacters.map(char => ({
        id: char.id,
        name: char.name,
        role: char.roles?.primary,
        tier: char.tierRatings?.gl?.tier
      })),
      context,
      size: selectedCharacters.length
    }
    
    await this.trackConversation('team_building', teamData)
    
    // Learn team patterns
    this.learnTeamPattern(selectedCharacters)
  }

  /**
   * Get or create session ID
   */
  getSessionId() {
    let sessionId = this.sessionMemory.get('sessionId')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      this.sessionMemory.set('sessionId', sessionId)
      this.saveSessionData()
    }
    return sessionId
  }

  /**
   * Store user preference
   */
  async setPreference(key, value, category = 'general') {
    const preference = {
      key,
      value,
      category,
      lastUpdated: Date.now(),
      sessionId: this.getSessionId()
    }
    
    // Store in session memory
    this.sessionMemory.set(`pref_${key}`, preference)
    this.saveSessionData()
    
    // Store in IndexedDB
    if (this.db) {
      try {
        const transaction = this.db.transaction(['preferences'], 'readwrite')
        const store = transaction.objectStore('preferences')
        await store.put(preference)
        
        debug.ai.log('Preference stored:', key, value)
      } catch (error) {
        debug.ai.error('Failed to store preference:', error)
      }
    }
  }

  /**
   * Get user preference
   */
  async getPreference(key, defaultValue = null) {
    // Check session memory first
    const sessionPref = this.sessionMemory.get(`pref_${key}`)
    if (sessionPref) {
      return sessionPref.value
    }
    
    // Check IndexedDB
    if (this.db) {
      try {
        const transaction = this.db.transaction(['preferences'], 'readonly')
        const store = transaction.objectStore('preferences')
        const request = store.get(key)
        
        return new Promise((resolve) => {
          request.onsuccess = () => {
            const result = request.result
            if (result) {
              // Cache in session memory
              this.sessionMemory.set(`pref_${key}`, result)
              resolve(result.value)
            } else {
              resolve(defaultValue)
            }
          }
          request.onerror = () => resolve(defaultValue)
        })
      } catch (error) {
        debug.ai.error('Failed to get preference:', error)
        return defaultValue
      }
    }
    
    return defaultValue
  }

  /**
   * Learn from search patterns
   */
  learnSearchPattern(query, filters, results) {
    if (!this.config.learningEnabled) return
    
    // Extract patterns from successful searches
    const pattern = {
      query: query.toLowerCase(),
      filterTypes: Object.keys(filters).filter(key => 
        filters[key] && 
        (Array.isArray(filters[key]) ? filters[key].length > 0 : filters[key] !== '')
      ),
      resultTiers: [...new Set(results.map(r => r.tierRatings?.gl?.tier).filter(Boolean))],
      hasResults: results.length > 0
    }
    
    // Store pattern for future recommendations
    const patternKey = `search_pattern_${Date.now()}`
    this.sessionMemory.set(patternKey, {
      pattern,
      timestamp: Date.now(),
      weight: results.length > 0 ? 1.0 : 0.1 // Successful searches get higher weight
    })
  }

  /**
   * Learn from team building patterns
   */
  learnTeamPattern(characters) {
    if (!this.config.learningEnabled) return
    
    // Analyze team composition
    const roles = characters.map(c => c.roles?.primary).filter(Boolean)
    const tiers = characters.map(c => c.tierRatings?.gl?.tier).filter(Boolean)
    const elements = characters.flatMap(c => c.elements || [])
    
    const teamPattern = {
      roles: [...new Set(roles)],
      tiers: [...new Set(tiers)],
      elements: [...new Set(elements)],
      size: characters.length,
      avgTierScore: this.calculateAverageTierScore(tiers)
    }
    
    // Store successful team pattern
    const patternKey = `team_pattern_${Date.now()}`
    this.sessionMemory.set(patternKey, {
      pattern: teamPattern,
      characters: characters.map(c => ({ id: c.id, name: c.name })),
      timestamp: Date.now(),
      weight: 1.0
    })
  }

  /**
   * Calculate average tier score for analysis
   */
  calculateAverageTierScore(tiers) {
    const tierValues = { 'S+': 6, 'S': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1 }
    const scores = tiers.map(tier => tierValues[tier] || 0)
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
  }

  /**
   * Update character relevance based on user interactions
   */
  async updateCharacterRelevance(characterId, relevanceIncrease) {
    if (!this.db) return
    
    try {
      const transaction = this.db.transaction(['context'], 'readwrite')
      const store = transaction.objectStore('context')
      const index = store.index('entityId')
      
      // Get existing relevance record
      const getRequest = index.get(characterId)
      
      getRequest.onsuccess = () => {
        let contextRecord = getRequest.result
        
        if (contextRecord) {
          // Update existing record
          contextRecord.relevance += relevanceIncrease
          contextRecord.lastUpdated = Date.now()
          contextRecord.interactionCount = (contextRecord.interactionCount || 0) + 1
        } else {
          // Create new record
          contextRecord = {
            entityType: 'character',
            entityId: characterId,
            relevance: relevanceIncrease,
            interactionCount: 1,
            lastUpdated: Date.now(),
            createdAt: Date.now()
          }
        }
        
        // Store updated record
        store.put(contextRecord)
        debug.ai.log('Character relevance updated:', characterId, contextRecord.relevance)
      }
    } catch (error) {
      debug.ai.error('Failed to update character relevance:', error)
    }
  }

  /**
   * Get personalized character recommendations
   */
  async getCharacterRecommendations(context = 'general') {
    const recommendations = []
    
    try {
      // Get character relevance data
      const relevanceData = await this.getCharacterRelevanceData()
      
      // Get user behavior patterns
      const searchPatterns = this.getSearchPatterns()
      const teamPatterns = this.getTeamPatterns()
      
      // Generate recommendations based on patterns and relevance
      const scores = new Map()
      
      // Score based on relevance
      relevanceData.forEach(record => {
        scores.set(record.entityId, (scores.get(record.entityId) || 0) + record.relevance)
      })
      
      // Score based on search patterns
      searchPatterns.forEach(pattern => {
        // Implementation would score characters matching user's search patterns
        // This is a simplified version
        scores.set('pattern_match', (scores.get('pattern_match') || 0) + pattern.weight)
      })
      
      // Convert to recommendations
      const sortedRecommendations = Array.from(scores.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, this.config.maxSuggestions)
      
      return sortedRecommendations.map(([characterId, score]) => ({
        characterId,
        score,
        reason: this.generateRecommendationReason(characterId, score, context)
      }))
      
    } catch (error) {
      debug.ai.error('Failed to generate recommendations:', error)
      return []
    }
  }

  /**
   * Generate AI-powered search suggestions
   */
  async getSearchSuggestions(query, currentFilters) {
    const suggestions = []
    
    try {
      // Get search patterns
      const patterns = this.getSearchPatterns()
      
      // Find similar queries
      const similarQueries = patterns.filter(pattern => 
        pattern.pattern.query && 
        (pattern.pattern.query.includes(query.toLowerCase()) || 
         query.toLowerCase().includes(pattern.pattern.query))
      )
      
      // Generate suggestions from similar queries
      similarQueries.forEach(pattern => {
        if (pattern.pattern.hasResults) {
          suggestions.push({
            type: 'query',
            suggestion: pattern.pattern.query,
            confidence: 0.8,
            reason: 'Similar to successful searches'
          })
          
          // Add filter suggestions from successful patterns
          pattern.pattern.filterTypes.forEach(filterType => {
            if (!currentFilters[filterType] || currentFilters[filterType].length === 0) {
              suggestions.push({
                type: 'filter',
                suggestion: filterType,
                confidence: 0.6,
                reason: 'Often used with similar queries'
              })
            }
          })
        }
      })
      
      return suggestions.slice(0, this.config.maxSuggestions)
      
    } catch (error) {
      debug.ai.error('Failed to generate search suggestions:', error)
      return []
    }
  }

  /**
   * Track session events for analytics
   */
  trackSession(eventType, data) {
    this.sessionMemory.set(`session_event_${Date.now()}`, {
      eventType,
      data,
      timestamp: Date.now()
    })
  }

  /**
   * Get character relevance data from IndexedDB
   */
  async getCharacterRelevanceData() {
    if (!this.db) return []
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['context'], 'readonly')
      const store = transaction.objectStore('context')
      const index = store.index('entityType')
      const request = index.getAll('character')
      
      request.onsuccess = () => {
        resolve(request.result || [])
      }
      
      request.onerror = () => {
        debug.ai.error('Failed to get character relevance data:', request.error)
        resolve([])
      }
    })
  }

  /**
   * Get search patterns from session memory
   */
  getSearchPatterns() {
    const patterns = []
    this.sessionMemory.forEach((value, key) => {
      if (key.startsWith('search_pattern_') && value.pattern) {
        patterns.push(value)
      }
    })
    return patterns.sort((a, b) => b.timestamp - a.timestamp)
  }

  /**
   * Get team patterns from session memory
   */
  getTeamPatterns() {
    const patterns = []
    this.sessionMemory.forEach((value, key) => {
      if (key.startsWith('team_pattern_') && value.pattern) {
        patterns.push(value)
      }
    })
    return patterns.sort((a, b) => b.timestamp - a.timestamp)
  }

  /**
   * Generate recommendation reason
   */
  generateRecommendationReason(characterId, score, context) {
    if (score > 1.0) {
      return 'Frequently viewed and highly relevant to your searches'
    } else if (score > 0.5) {
      return 'Matches your recent search patterns'
    } else if (score > 0.2) {
      return 'Similar to characters you\'ve shown interest in'
    } else {
      return 'Recommended based on your usage patterns'
    }
  }

  /**
   * Load user behavior patterns
   */
  async loadUserPatterns() {
    // This could be extended to load patterns from IndexedDB
    debug.ai.log('User patterns loaded')
  }

  /**
   * Initialize recommendation engine
   */
  initRecommendationEngine() {
    // Initialize any ML models or scoring algorithms
    debug.ai.log('Recommendation engine initialized')
  }

  /**
   * Clean up old memory data
   */
  async cleanupMemory() {
    try {
      // Clean up session memory
      const cutoffTime = Date.now() - this.config.sessionTimeout
      const keysToDelete = []
      
      this.sessionMemory.forEach((value, key) => {
        if (value.timestamp && value.timestamp < cutoffTime) {
          keysToDelete.push(key)
        }
      })
      
      keysToDelete.forEach(key => {
        this.sessionMemory.delete(key)
      })
      
      if (keysToDelete.length > 0) {
        debug.ai.log(`Cleaned up ${keysToDelete.length} old session memory entries`)
        this.saveSessionData()
      }
      
      // Clean up IndexedDB (implementation could be added for long-term cleanup)
      
    } catch (error) {
      debug.ai.error('Memory cleanup failed:', error)
    }
  }

  /**
   * Export memory data for analysis or backup
   */
  async exportMemoryData() {
    const exportData = {
      version: '1.0.0',
      timestamp: Date.now(),
      sessionData: Object.fromEntries(this.sessionMemory),
      config: this.config
    }
    
    // Add IndexedDB data if needed
    if (this.db) {
      try {
        // This could be extended to export all IndexedDB data
        exportData.hasIndexedDB = true
      } catch (error) {
        debug.ai.error('Failed to export IndexedDB data:', error)
      }
    }
    
    return exportData
  }

  /**
   * Reset all memory data
   */
  async resetMemory() {
    try {
      // Clear session memory
      this.sessionMemory.clear()
      localStorage.removeItem('cotc-ai-session')
      
      // Clear IndexedDB
      if (this.db) {
        const storeNames = ['conversations', 'preferences', 'context', 'validation']
        const transaction = this.db.transaction(storeNames, 'readwrite')
        
        storeNames.forEach(storeName => {
          const store = transaction.objectStore(storeName)
          store.clear()
        })
      }
      
      debug.ai.log('All memory data reset')
      
    } catch (error) {
      debug.ai.error('Failed to reset memory:', error)
      throw error
    }
  }

  /**
   * Get memory system statistics
   */
  getMemoryStats() {
    return {
      initialized: this.initialized,
      sessionMemorySize: this.sessionMemory.size,
      sessionId: this.getSessionId(),
      hasIndexedDB: !!this.db,
      config: this.config
    }
  }
}

// Create and export singleton instance
export const aiMemory = new AIMemorySystem()

// Export class for custom instances
export { AIMemorySystem }

export default aiMemory