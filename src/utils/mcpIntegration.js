/**
 * MCP (Model Context Protocol) Integration for COTC Meta Guide
 * 
 * Provides MCP server integration for AI-enhanced data processing,
 * character analysis, and intelligent recommendations.
 * 
 * Features:
 * - Character database MCP server integration
 * - AI-powered character analysis tools
 * - Team building recommendations via MCP
 * - Data validation and enhancement through AI models
 * - Natural language queries for character data
 * 
 * @version 1.0.0
 */

import aiMemory from './aiMemory'
import aiValidation from './aiValidation'
import debug from './debug'

// MCP Integration Configuration
const MCP_CONFIG = {
  // Server endpoints
  localServer: 'http://localhost:3001/mcp',
  remoteServer: 'https://api.cotc.guide/mcp',
  
  // Connection settings
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
  
  // Tool configurations
  enableCharacterAnalysis: true,
  enableTeamBuilding: true,
  enableDataValidation: true,
  enableNaturalLanguageQuery: true,
  
  // AI model settings
  confidenceThreshold: 0.8,
  maxResponseLength: 2000,
  
  // Caching
  cacheEnabled: true,
  cacheTTL: 300000, // 5 minutes
}

/**
 * MCP Tools Available for Character Analysis
 */
const MCP_TOOLS = {
  // Character analysis tools
  analyze_character: {
    name: 'analyze_character',
    description: 'Analyze a character and provide detailed insights about their meta relevance, synergies, and usage recommendations',
    inputSchema: {
      type: 'object',
      properties: {
        characterId: { type: 'string', description: 'Character ID to analyze' },
        context: { type: 'string', description: 'Analysis context (meta, teambuilding, etc.)' },
        includeComparisons: { type: 'boolean', description: 'Include comparisons with similar characters' }
      },
      required: ['characterId']
    }
  },
  
  build_team: {
    name: 'build_team',
    description: 'Generate optimal team compositions based on requirements and available characters',
    inputSchema: {
      type: 'object',
      properties: {
        requirements: {
          type: 'object',
          description: 'Team requirements (roles, elements, content type)',
          properties: {
            roles: { type: 'array', items: { type: 'string' } },
            elements: { type: 'array', items: { type: 'string' } },
            contentType: { type: 'string', description: 'Content type (ex3, towers, etc.)' },
            budget: { type: 'string', description: 'Budget constraint (free, low, high)' }
          }
        },
        ownedCharacters: { type: 'array', items: { type: 'string' }, description: 'List of owned character IDs' },
        excludeCharacters: { type: 'array', items: { type: 'string' }, description: 'Characters to exclude' }
      },
      required: ['requirements']
    }
  },
  
  validate_data: {
    name: 'validate_data',
    description: 'Validate character data for consistency and completeness using AI analysis',
    inputSchema: {
      type: 'object',
      properties: {
        characterData: { type: 'object', description: 'Character data to validate' },
        validationType: { type: 'string', enum: ['full', 'quick', 'specific'], description: 'Type of validation to perform' },
        includeFixSuggestions: { type: 'boolean', description: 'Include AI-generated fix suggestions' }
      },
      required: ['characterData']
    }
  },
  
  natural_query: {
    name: 'natural_query',
    description: 'Process natural language queries about characters and provide intelligent responses',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Natural language query' },
        context: { type: 'object', description: 'Additional context (current filters, viewed characters, etc.)' },
        responseFormat: { type: 'string', enum: ['detailed', 'summary', 'list'], description: 'Desired response format' }
      },
      required: ['query']
    }
  },
  
  enhance_tags: {
    name: 'enhance_tags',
    description: 'Use AI to enhance character tags based on skills and abilities',
    inputSchema: {
      type: 'object',
      properties: {
        characterData: { type: 'object', description: 'Character data including skills' },
        existingTags: { type: 'array', items: { type: 'string' }, description: 'Current tags' },
        tagCategories: { type: 'array', items: { type: 'string' }, description: 'Specific tag categories to focus on' }
      },
      required: ['characterData']
    }
  },
  
  compare_characters: {
    name: 'compare_characters',
    description: 'Compare multiple characters and provide detailed analysis of their strengths, weaknesses, and use cases',
    inputSchema: {
      type: 'object',
      properties: {
        characterIds: { type: 'array', items: { type: 'string' }, description: 'Character IDs to compare' },
        comparisonType: { type: 'string', enum: ['general', 'role', 'synergy', 'meta'], description: 'Type of comparison' },
        includeRecommendations: { type: 'boolean', description: 'Include usage recommendations' }
      },
      required: ['characterIds']
    }
  }
}

/**
 * MCP Integration System
 */
class MCPIntegration {
  constructor(config = {}) {
    this.config = { ...MCP_CONFIG, ...config }
    this.connected = false
    this.serverUrl = null
    this.cache = new Map()
    this.activeRequests = new Map()
    
    // Add MCP debugger
    if (!debug.mcp) {
      debug.mcp = {
        log: (...args) => debug.general.log('[MCP]', ...args),
        warn: (...args) => debug.general.warn('[MCP]', ...args),
        error: (...args) => debug.general.error('[MCP]', ...args),
        group: (label) => debug.general.group(`[MCP] ${label}`),
        groupEnd: () => debug.general.groupEnd()
      }
    }
    
    this.init()
  }

  /**
   * Initialize MCP connection
   */
  async init() {
    try {
      debug.mcp.log('Initializing MCP integration...')
      
      // Try to connect to MCP server (local first, then remote)
      await this.connectToServer()
      
      // Initialize available tools
      await this.initializeTools()
      
      // Start cache cleanup interval
      this.startCacheCleanup()
      
      debug.mcp.log('MCP integration initialized successfully')
      
    } catch (error) {
      debug.mcp.error('Failed to initialize MCP integration:', error)
      // Continue without MCP functionality
    }
  }

  /**
   * Connect to MCP server
   */
  async connectToServer() {
    const servers = [this.config.localServer, this.config.remoteServer]
    
    for (const serverUrl of servers) {
      try {
        debug.mcp.log(`Attempting to connect to ${serverUrl}...`)
        
        const response = await this.makeRequest(serverUrl + '/health', {
          method: 'GET',
          timeout: 5000
        })
        
        if (response.ok) {
          this.serverUrl = serverUrl
          this.connected = true
          debug.mcp.log(`Connected to MCP server: ${serverUrl}`)
          return
        }
        
      } catch (error) {
        debug.mcp.warn(`Failed to connect to ${serverUrl}:`, error.message)
      }
    }
    
    throw new Error('No MCP servers available')
  }

  /**
   * Initialize available tools
   */
  async initializeTools() {
    if (!this.connected) return
    
    try {
      // Get available tools from server
      const response = await this.makeRequest(`${this.serverUrl}/tools`, {
        method: 'GET'
      })
      
      if (response.ok) {
        const serverTools = await response.json()
        debug.mcp.log(`Server provides ${serverTools.tools?.length || 0} tools`)
        
        // Store available tools for reference
        this.availableTools = serverTools.tools || []
      }
      
    } catch (error) {
      debug.mcp.warn('Failed to get available tools:', error)
    }
  }

  /**
   * Start cache cleanup interval
   */
  startCacheCleanup() {
    if (!this.config.cacheEnabled) return
    
    setInterval(() => {
      const now = Date.now()
      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > this.config.cacheTTL) {
          this.cache.delete(key)
        }
      }
    }, this.config.cacheTTL / 2)
  }

  /**
   * Analyze character using AI
   */
  async analyzeCharacter(characterId, options = {}) {
    try {
      debug.mcp.group(`Analyzing character ${characterId}`)
      
      const payload = {
        characterId,
        context: options.context || 'general',
        includeComparisons: options.includeComparisons || false,
        userContext: await this.getUserContext()
      }
      
      const result = await this.callTool('analyze_character', payload)
      
      if (result.success) {
        // Store analysis in memory for learning
        await aiMemory.trackConversation('character_analysis', {
          characterId,
          analysis: result.data,
          context: options.context
        })
        
        debug.mcp.log('Character analysis completed successfully')
        debug.mcp.groupEnd()
        
        return result.data
      } else {
        throw new Error(result.error || 'Analysis failed')
      }
      
    } catch (error) {
      debug.mcp.error('Character analysis failed:', error)
      debug.mcp.groupEnd()
      
      // Return fallback analysis
      return this.getFallbackAnalysis(characterId)
    }
  }

  /**
   * Build team using AI recommendations
   */
  async buildTeam(requirements, options = {}) {
    try {
      debug.mcp.group('Building team with AI')
      
      const payload = {
        requirements,
        ownedCharacters: options.ownedCharacters || [],
        excludeCharacters: options.excludeCharacters || [],
        userPreferences: await this.getUserPreferences(),
        userContext: await this.getUserContext()
      }
      
      const result = await this.callTool('build_team', payload)
      
      if (result.success) {
        // Track team building patterns
        await aiMemory.trackTeamBuilding(result.data.team, 'ai_recommendation')
        
        debug.mcp.log('AI team building completed successfully')
        debug.mcp.groupEnd()
        
        return result.data
      } else {
        throw new Error(result.error || 'Team building failed')
      }
      
    } catch (error) {
      debug.mcp.error('AI team building failed:', error)
      debug.mcp.groupEnd()
      
      // Return fallback recommendations
      return this.getFallbackTeamRecommendation(requirements)
    }
  }

  /**
   * Validate character data using AI
   */
  async validateCharacterData(characterData, options = {}) {
    try {
      const payload = {
        characterData,
        validationType: options.validationType || 'full',
        includeFixSuggestions: options.includeFixSuggestions !== false
      }
      
      const result = await this.callTool('validate_data', payload)
      
      if (result.success) {
        // Combine with local validation
        const localValidation = await aiValidation.validateCharacter(characterData)
        
        return {
          aiValidation: result.data,
          localValidation,
          combined: this.combineValidationResults(result.data, localValidation)
        }
      } else {
        throw new Error(result.error || 'AI validation failed')
      }
      
    } catch (error) {
      debug.mcp.error('AI validation failed:', error)
      
      // Fall back to local validation only
      const localValidation = await aiValidation.validateCharacter(characterData)
      return {
        aiValidation: null,
        localValidation,
        combined: localValidation
      }
    }
  }

  /**
   * Process natural language query
   */
  async processNaturalQuery(query, context = {}) {
    try {
      debug.mcp.group(`Processing query: "${query}"`)
      
      const payload = {
        query,
        context: {
          ...context,
          userHistory: await this.getUserSearchHistory(),
          currentSession: aiMemory.getSessionId()
        },
        responseFormat: context.responseFormat || 'detailed'
      }
      
      const result = await this.callTool('natural_query', payload)
      
      if (result.success) {
        // Track query for learning
        await aiMemory.trackConversation('natural_query', {
          query,
          response: result.data,
          context
        })
        
        debug.mcp.log('Natural query processed successfully')
        debug.mcp.groupEnd()
        
        return result.data
      } else {
        throw new Error(result.error || 'Query processing failed')
      }
      
    } catch (error) {
      debug.mcp.error('Natural query processing failed:', error)
      debug.mcp.groupEnd()
      
      // Return basic fallback response
      return {
        response: 'Sorry, I couldn\'t process that query right now. Please try rephrasing or use the manual search.',
        confidence: 0,
        suggestions: []
      }
    }
  }

  /**
   * Enhance character tags using AI
   */
  async enhanceCharacterTags(characterData, options = {}) {
    try {
      const payload = {
        characterData,
        existingTags: characterData.tags || [],
        tagCategories: options.tagCategories || ['effects', 'roles', 'synergies']
      }
      
      const result = await this.callTool('enhance_tags', payload)
      
      if (result.success) {
        // Track tag enhancements
        await aiMemory.trackConversation('tag_enhancement', {
          characterId: characterData.id,
          originalTags: characterData.tags || [],
          enhancedTags: result.data.tags,
          confidence: result.data.confidence
        })
        
        return result.data
      } else {
        throw new Error(result.error || 'Tag enhancement failed')
      }
      
    } catch (error) {
      debug.mcp.error('Tag enhancement failed:', error)
      
      // Return original tags with low confidence
      return {
        tags: characterData.tags || [],
        newTags: [],
        confidence: 0,
        reasoning: 'AI enhancement unavailable'
      }
    }
  }

  /**
   * Compare characters using AI analysis
   */
  async compareCharacters(characterIds, options = {}) {
    try {
      debug.mcp.group(`Comparing ${characterIds.length} characters`)
      
      const payload = {
        characterIds,
        comparisonType: options.comparisonType || 'general',
        includeRecommendations: options.includeRecommendations !== false
      }
      
      const result = await this.callTool('compare_characters', payload)
      
      if (result.success) {
        // Track comparison patterns
        await aiMemory.trackConversation('character_comparison', {
          characterIds,
          comparison: result.data,
          comparisonType: options.comparisonType
        })
        
        debug.mcp.log('Character comparison completed')
        debug.mcp.groupEnd()
        
        return result.data
      } else {
        throw new Error(result.error || 'Character comparison failed')
      }
      
    } catch (error) {
      debug.mcp.error('Character comparison failed:', error)
      debug.mcp.groupEnd()
      
      // Return basic comparison fallback
      return this.getFallbackComparison(characterIds)
    }
  }

  /**
   * Call MCP tool with error handling and caching
   */
  async callTool(toolName, parameters) {
    if (!this.connected) {
      throw new Error('MCP server not connected')
    }
    
    // Check cache first
    const cacheKey = `${toolName}_${JSON.stringify(parameters)}`
    if (this.config.cacheEnabled && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.config.cacheTTL) {
        debug.mcp.log(`Using cached result for ${toolName}`)
        return cached.result
      }
    }
    
    // Check if request is already in progress
    if (this.activeRequests.has(cacheKey)) {
      debug.mcp.log(`Waiting for existing ${toolName} request`)
      return await this.activeRequests.get(cacheKey)
    }
    
    // Create request promise
    const requestPromise = this.executeToolCall(toolName, parameters)
    this.activeRequests.set(cacheKey, requestPromise)
    
    try {
      const result = await requestPromise
      
      // Cache successful results
      if (this.config.cacheEnabled && result.success) {
        this.cache.set(cacheKey, {
          result,
          timestamp: Date.now()
        })
      }
      
      return result
      
    } finally {
      this.activeRequests.delete(cacheKey)
    }
  }

  /**
   * Execute the actual tool call
   */
  async executeToolCall(toolName, parameters) {
    const payload = {
      tool: toolName,
      parameters,
      metadata: {
        timestamp: Date.now(),
        sessionId: aiMemory.getSessionId(),
        userAgent: navigator.userAgent
      }
    }
    
    const response = await this.makeRequest(`${this.serverUrl}/tools/call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    return await response.json()
  }

  /**
   * Make HTTP request with retry logic
   */
  async makeRequest(url, options = {}) {
    const requestOptions = {
      timeout: this.config.timeout,
      ...options
    }
    
    let lastError
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), requestOptions.timeout)
        
        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        return response
        
      } catch (error) {
        lastError = error
        
        if (attempt < this.config.retryAttempts) {
          debug.mcp.warn(`Request attempt ${attempt} failed, retrying...`)
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * attempt))
        }
      }
    }
    
    throw lastError
  }

  /**
   * Get user context for AI requests
   */
  async getUserContext() {
    try {
      const preferences = await this.getUserPreferences()
      const searchHistory = await this.getUserSearchHistory()
      const sessionData = aiMemory.getMemoryStats()
      
      return {
        preferences,
        recentSearches: searchHistory.slice(0, 10),
        sessionInfo: {
          sessionId: sessionData.sessionId,
          sessionMemorySize: sessionData.sessionMemorySize
        },
        timestamp: Date.now()
      }
      
    } catch (error) {
      debug.mcp.warn('Failed to get user context:', error)
      return {}
    }
  }

  /**
   * Get user preferences for personalization
   */
  async getUserPreferences() {
    const preferences = {
      preferredRoles: await aiMemory.getPreference('preferred_roles', []),
      preferredElements: await aiMemory.getPreference('preferred_elements', []),
      budgetPreference: await aiMemory.getPreference('budget_preference', 'medium'),
      contentFocus: await aiMemory.getPreference('content_focus', 'general'),
      favoriteCharacters: await aiMemory.getPreference('favorite_characters', [])
    }
    
    return preferences
  }

  /**
   * Get user search history for context
   */
  async getUserSearchHistory() {
    // This would integrate with aiMemory to get recent searches
    try {
      const memoryStats = aiMemory.getMemoryStats()
      // Extract search patterns from memory
      return [] // Placeholder
    } catch (error) {
      debug.mcp.warn('Failed to get search history:', error)
      return []
    }
  }

  /**
   * Combine AI and local validation results
   */
  combineValidationResults(aiResult, localResult) {
    return {
      valid: aiResult.valid && localResult.valid,
      confidence: (aiResult.confidence + localResult.overallConfidence) / 2,
      score: (aiResult.score + localResult.overallScore) / 2,
      issues: [...(aiResult.issues || []), ...localResult.issues],
      suggestions: [...(aiResult.suggestions || []), ...localResult.suggestions],
      source: 'combined'
    }
  }

  /**
   * Get fallback analysis when AI is unavailable
   */
  getFallbackAnalysis(characterId) {
    return {
      characterId,
      analysis: 'Detailed AI analysis is currently unavailable. Please check the character data manually.',
      confidence: 0,
      recommendations: [],
      source: 'fallback'
    }
  }

  /**
   * Get fallback team recommendation
   */
  getFallbackTeamRecommendation(requirements) {
    return {
      team: [],
      reasoning: 'AI team building is currently unavailable. Please use manual filters and team building tools.',
      confidence: 0,
      alternatives: [],
      source: 'fallback'
    }
  }

  /**
   * Get fallback character comparison
   */
  getFallbackComparison(characterIds) {
    return {
      characters: characterIds.map(id => ({ id, analysis: 'Analysis unavailable' })),
      comparison: 'Detailed AI comparison is currently unavailable. Please compare characters manually.',
      recommendations: [],
      confidence: 0,
      source: 'fallback'
    }
  }

  /**
   * Get MCP integration status
   */
  getStatus() {
    return {
      connected: this.connected,
      serverUrl: this.serverUrl,
      availableTools: this.availableTools?.length || 0,
      cacheSize: this.cache.size,
      activeRequests: this.activeRequests.size,
      config: this.config
    }
  }

  /**
   * Disconnect from MCP server
   */
  disconnect() {
    this.connected = false
    this.serverUrl = null
    this.cache.clear()
    this.activeRequests.clear()
    debug.mcp.log('Disconnected from MCP server')
  }

  /**
   * Reconnect to MCP server
   */
  async reconnect() {
    this.disconnect()
    await this.init()
  }
}

// Create and export singleton instance
export const mcpIntegration = new MCPIntegration()

// Export class for custom instances
export { MCPIntegration, MCP_TOOLS }

export default mcpIntegration