/**
 * AI Validation System for COTC Meta Guide
 * 
 * Enhanced validation with improved accuracy, confidence scoring, and automated
 * quality assurance for character data, tags, and recommendations.
 * 
 * Features:
 * - Multi-layer validation with confidence scoring
 * - Learning from human corrections
 * - Automated data consistency checking
 * - Quality metrics and reporting
 * - Integration with Universal Tagging System
 * 
 * @version 2.0.0
 */

import TagSystem from './tagSystem'
import aiMemory from './aiMemory'
import debug from './debug'

// Validation configuration
const VALIDATION_CONFIG = {
  // Confidence thresholds
  highConfidence: 0.9,
  mediumConfidence: 0.7,
  lowConfidence: 0.5,
  
  // Validation rules
  strictMode: false,
  autoCorrectEnabled: true,
  learningEnabled: true,
  
  // Quality thresholds
  minDataCompleteness: 0.8,
  maxInconsistencyRate: 0.1,
  
  // Performance settings
  batchSize: 50,
  maxValidationTime: 5000, // 5 seconds
  
  // Reporting
  detailedReporting: true,
  includeFixSuggestions: true
}

/**
 * Enhanced AI Validation System
 */
class AIValidationSystem {
  constructor(config = {}) {
    this.config = { ...VALIDATION_CONFIG, ...config }
    this.tagSystem = new TagSystem()
    this.validationRules = new Map()
    this.qualityMetrics = new Map()
    this.learningData = new Map()
    this.initialized = false
    
    // Add validation debugger
    if (!debug.validation) {
      debug.validation = {
        log: (...args) => debug.general.log('[VALIDATION]', ...args),
        warn: (...args) => debug.general.warn('[VALIDATION]', ...args),
        error: (...args) => debug.general.error('[VALIDATION]', ...args),
        group: (label) => debug.general.group(`[VALIDATION] ${label}`),
        groupEnd: () => debug.general.groupEnd()
      }
    }
    
    this.init()
  }

  /**
   * Initialize validation system
   */
  async init() {
    try {
      debug.validation.log('Initializing AI Validation System...')
      
      // Load validation rules
      await this.loadValidationRules()
      
      // Initialize quality metrics
      this.initQualityMetrics()
      
      // Load learning data from memory
      await this.loadLearningData()
      
      this.initialized = true
      debug.validation.log('AI Validation System initialized successfully')
      
    } catch (error) {
      debug.validation.error('Failed to initialize validation system:', error)
      throw error
    }
  }

  /**
   * Load and define validation rules
   */
  async loadValidationRules() {
    // Character data validation rules
    this.validationRules.set('character_completeness', {
      name: 'Character Data Completeness',
      type: 'completeness',
      weight: 1.0,
      validator: (character) => {
        const requiredFields = ['id', 'name', 'starRating', 'job', 'isFree']
        const optionalFields = ['elements', 'weapons', 'continent', 'ultPriority', 'a4Priority']
        
        const missingRequired = requiredFields.filter(field => !character[field])
        const missingOptional = optionalFields.filter(field => !character[field])
        
        const completeness = (requiredFields.length - missingRequired.length + 
                            (optionalFields.length - missingOptional.length) * 0.5) / 
                           (requiredFields.length + optionalFields.length * 0.5)
        
        return {
          valid: missingRequired.length === 0,
          confidence: completeness,
          score: completeness,
          issues: missingRequired.map(field => ({
            type: 'missing_required',
            field,
            severity: 'error',
            message: `Missing required field: ${field}`
          })).concat(missingOptional.map(field => ({
            type: 'missing_optional',
            field,
            severity: 'warning',
            message: `Missing optional field: ${field}`
          })))
        }
      }
    })

    this.validationRules.set('tier_consistency', {
      name: 'Tier Rating Consistency',
      type: 'consistency',
      weight: 0.9,
      validator: (character) => {
        const issues = []
        let confidence = 1.0
        
        // Check if tier ratings exist and are consistent
        const glTier = character.tierRatings?.gl?.tier
        const a4Priority = character.a4Priority
        const ultPriority = character.ultPriority
        
        // Tier vs priority consistency checks
        if (glTier === 'S+' || glTier === 'S') {
          if (a4Priority === 'skip') {
            issues.push({
              type: 'tier_priority_mismatch',
              field: 'a4Priority',
              severity: 'warning',
              message: `High tier (${glTier}) character has 'skip' A4 priority`
            })
            confidence -= 0.2
          }
          if (ultPriority && !['essential', 'good'].includes(ultPriority)) {
            issues.push({
              type: 'tier_priority_mismatch',
              field: 'ultPriority',
              severity: 'warning',
              message: `High tier (${glTier}) character has low ultimate priority`
            })
            confidence -= 0.2
          }
        }
        
        // Free character checks
        if (character.isFree && glTier && ['C', 'D'].includes(glTier)) {
          confidence -= 0.1 // Free characters are usually better rated
        }
        
        return {
          valid: issues.filter(i => i.severity === 'error').length === 0,
          confidence: Math.max(0, confidence),
          score: Math.max(0, confidence),
          issues
        }
      }
    })

    this.validationRules.set('tag_quality', {
      name: 'Tag Quality and Consistency',
      type: 'tagging',
      weight: 0.8,
      validator: (character) => {
        const issues = []
        let confidence = 1.0
        let validTags = 0
        let totalTags = 0
        
        if (!character.tags) {
          return {
            valid: true,
            confidence: 0.5,
            score: 0.5,
            issues: [{
              type: 'no_tags',
              severity: 'info',
              message: 'Character has no tags'
            }]
          }
        }
        
        // Validate tag structure and content
        const allTags = this.tagSystem.getAllTagsForCharacter(character)
        totalTags = allTags.length
        
        allTags.forEach(tagName => {
          const taxonomy = this.tagSystem.taxonomy[tagName]
          if (taxonomy) {
            validTags++
          } else {
            issues.push({
              type: 'unknown_tag',
              field: 'tags',
              severity: 'warning',
              message: `Unknown tag: ${tagName}`,
              suggestion: this.suggestTagCorrection(tagName)
            })
          }
        })
        
        // Check for tag-field duplications
        const duplications = this.checkTagFieldDuplication(character)
        duplications.forEach(dup => {
          issues.push({
            type: 'tag_field_duplication',
            field: 'tags',
            severity: 'warning',
            message: `Tag '${dup.tag}' duplicates field '${dup.field}' (${dup.fieldValue})`,
            suggestion: `Remove tag '${dup.tag}' as it's covered by ${dup.field} field`
          })
          confidence -= 0.1
        })
        
        const tagValidityRatio = totalTags > 0 ? validTags / totalTags : 0.5
        confidence = Math.min(confidence, tagValidityRatio)
        
        return {
          valid: issues.filter(i => i.severity === 'error').length === 0,
          confidence: Math.max(0, confidence),
          score: tagValidityRatio,
          issues,
          metadata: {
            totalTags,
            validTags,
            duplications: duplications.length
          }
        }
      }
    })

    this.validationRules.set('awakening_priority', {
      name: 'Awakening Priority Logic',
      type: 'priority',
      weight: 0.9,
      validator: (character) => {
        const issues = []
        let confidence = 1.0
        
        const { ultPriority, a4Priority, stones, isFree } = character
        
        // Priority consistency with stones
        if (stones) {
          const stoneValues = Object.values(stones)
          const hasU10 = stoneValues.includes('U10')
          const hasA1 = stoneValues.includes('A1')
          
          // Ultimate priority vs stones
          if (ultPriority === 'essential' && !hasU10) {
            issues.push({
              type: 'priority_stone_mismatch',
              field: 'ultPriority',
              severity: 'warning',
              message: 'Essential ultimate priority but no U10 stones',
              suggestion: 'Consider adding U10 stones or adjusting priority'
            })
            confidence -= 0.2
          }
          
          // A4 priority vs stones
          if (a4Priority === 'essential' && !hasA1) {
            issues.push({
              type: 'priority_stone_mismatch',
              field: 'a4Priority',
              severity: 'warning',
              message: 'Essential A4 priority but no A1 stones',
              suggestion: 'Consider adding A1 stones or adjusting priority'
            })
            confidence -= 0.2
          }
        }
        
        // Free character special rules
        if (isFree) {
          if (ultPriority && ultPriority !== 'essential') {
            issues.push({
              type: 'free_character_priority',
              field: 'ultPriority',
              severity: 'info',
              message: 'Free characters typically have essential ultimate priority',
              suggestion: 'Consider setting ultPriority to "essential"'
            })
            confidence -= 0.1
          }
        }
        
        return {
          valid: issues.filter(i => i.severity === 'error').length === 0,
          confidence: Math.max(0, confidence),
          score: Math.max(0, confidence),
          issues
        }
      }
    })

    debug.validation.log(`Loaded ${this.validationRules.size} validation rules`)
  }

  /**
   * Initialize quality metrics tracking
   */
  initQualityMetrics() {
    this.qualityMetrics.set('overall_completeness', 0)
    this.qualityMetrics.set('tag_quality', 0)
    this.qualityMetrics.set('consistency_score', 0)
    this.qualityMetrics.set('validation_accuracy', 0)
    this.qualityMetrics.set('human_corrections', 0)
  }

  /**
   * Load learning data from memory system
   */
  async loadLearningData() {
    if (!this.config.learningEnabled) return
    
    try {
      // Load correction patterns from memory
      const correctionData = await aiMemory.getPreference('validation_corrections', {})
      Object.entries(correctionData).forEach(([key, value]) => {
        this.learningData.set(key, value)
      })
      
      debug.validation.log(`Loaded ${this.learningData.size} learning patterns`)
    } catch (error) {
      debug.validation.warn('Failed to load learning data:', error)
    }
  }

  /**
   * Validate a single character with enhanced confidence scoring
   */
  async validateCharacter(character) {
    const startTime = Date.now()
    const validation = {
      characterId: character.id,
      characterName: character.name,
      timestamp: Date.now(),
      valid: true,
      overallConfidence: 0,
      overallScore: 0,
      ruleResults: new Map(),
      issues: [],
      suggestions: [],
      metadata: {
        validationTime: 0,
        rulesApplied: 0,
        autoCorrectionsApplied: 0
      }
    }
    
    try {
      debug.validation.group(`Validating ${character.name}`)
      
      // Apply each validation rule
      for (const [ruleId, rule] of this.validationRules) {
        try {
          const result = rule.validator(character)
          result.ruleId = ruleId
          result.ruleName = rule.name
          result.weight = rule.weight
          
          validation.ruleResults.set(ruleId, result)
          
          // Accumulate issues
          if (result.issues) {
            validation.issues.push(...result.issues.map(issue => ({
              ...issue,
              ruleId,
              ruleName: rule.name
            })))
          }
          
          // Track if any rule failed
          if (!result.valid) {
            validation.valid = false
          }
          
          validation.metadata.rulesApplied++
          
        } catch (error) {
          debug.validation.error(`Rule ${ruleId} failed:`, error)
          validation.issues.push({
            type: 'rule_error',
            ruleId,
            severity: 'error',
            message: `Validation rule failed: ${error.message}`
          })
        }
      }
      
      // Calculate overall confidence and score
      const { overallConfidence, overallScore } = this.calculateOverallScore(validation.ruleResults)
      validation.overallConfidence = overallConfidence
      validation.overallScore = overallScore
      
      // Generate AI-powered suggestions
      validation.suggestions = await this.generateSuggestions(character, validation)
      
      // Apply auto-corrections if enabled
      if (this.config.autoCorrectEnabled) {
        const corrections = await this.applyAutoCorrections(character, validation)
        validation.metadata.autoCorrectionsApplied = corrections.length
        
        if (corrections.length > 0) {
          validation.corrections = corrections
        }
      }
      
      validation.metadata.validationTime = Date.now() - startTime
      
      debug.validation.log(`Validation complete: ${validation.overallConfidence.toFixed(3)} confidence, ${validation.issues.length} issues`)
      debug.validation.groupEnd()
      
      return validation
      
    } catch (error) {
      debug.validation.error('Character validation failed:', error)
      validation.valid = false
      validation.issues.push({
        type: 'validation_error',
        severity: 'error',
        message: `Validation failed: ${error.message}`
      })
      
      return validation
    }
  }

  /**
   * Validate multiple characters in batches
   */
  async validateCharacters(characters, options = {}) {
    const {
      batchSize = this.config.batchSize,
      includeValid = false,
      progressCallback = null
    } = options
    
    debug.validation.log(`Starting batch validation of ${characters.length} characters`)
    
    const results = {
      totalCharacters: characters.length,
      validCharacters: 0,
      invalidCharacters: 0,
      validations: [],
      summary: {
        overallQuality: 0,
        commonIssues: new Map(),
        qualityMetrics: {},
        recommendations: []
      },
      metadata: {
        startTime: Date.now(),
        endTime: null,
        totalTime: 0,
        averageValidationTime: 0
      }
    }
    
    // Process in batches
    for (let i = 0; i < characters.length; i += batchSize) {
      const batch = characters.slice(i, i + batchSize)
      
      for (const character of batch) {
        try {
          const validation = await this.validateCharacter(character)
          
          if (validation.valid) {
            results.validCharacters++
          } else {
            results.invalidCharacters++
          }
          
          // Store validation results
          if (!validation.valid || includeValid) {
            results.validations.push(validation)
          }
          
          // Track common issues
          validation.issues.forEach(issue => {
            const issueKey = `${issue.type}:${issue.severity}`
            results.summary.commonIssues.set(
              issueKey,
              (results.summary.commonIssues.get(issueKey) || 0) + 1
            )
          })
          
          // Progress callback
          if (progressCallback) {
            progressCallback({
              processed: i + batch.indexOf(character) + 1,
              total: characters.length,
              current: character.name,
              valid: validation.valid
            })
          }
          
        } catch (error) {
          debug.validation.error(`Failed to validate ${character.name}:`, error)
          results.invalidCharacters++
        }
      }
      
      // Prevent blocking the main thread
      await new Promise(resolve => setTimeout(resolve, 0))
    }
    
    // Calculate summary statistics
    results.metadata.endTime = Date.now()
    results.metadata.totalTime = results.metadata.endTime - results.metadata.startTime
    results.metadata.averageValidationTime = results.metadata.totalTime / characters.length
    
    results.summary.overallQuality = results.validCharacters / characters.length
    results.summary.qualityMetrics = this.calculateQualityMetrics(results.validations)
    results.summary.recommendations = this.generateBatchRecommendations(results)
    
    debug.validation.log(`Batch validation complete: ${results.validCharacters}/${characters.length} valid characters`)
    
    return results
  }

  /**
   * Calculate overall confidence and score from rule results
   */
  calculateOverallScore(ruleResults) {
    let totalWeightedScore = 0
    let totalWeight = 0
    let totalWeightedConfidence = 0
    
    ruleResults.forEach(result => {
      const weight = result.weight || 1.0
      totalWeightedScore += result.score * weight
      totalWeightedConfidence += result.confidence * weight
      totalWeight += weight
    })
    
    return {
      overallScore: totalWeight > 0 ? totalWeightedScore / totalWeight : 0,
      overallConfidence: totalWeight > 0 ? totalWeightedConfidence / totalWeight : 0
    }
  }

  /**
   * Generate AI-powered suggestions for improvements
   */
  async generateSuggestions(character, validation) {
    const suggestions = []
    
    // Analyze validation results to generate contextual suggestions
    validation.ruleResults.forEach((result, ruleId) => {
      if (result.issues) {
        result.issues.forEach(issue => {
          if (issue.suggestion) {
            suggestions.push({
              type: 'rule_suggestion',
              source: ruleId,
              priority: this.getSuggestionPriority(issue.severity),
              suggestion: issue.suggestion,
              context: issue.message
            })
          }
        })
      }
    })
    
    // AI-powered contextual suggestions
    const contextualSuggestions = await this.generateContextualSuggestions(character, validation)
    suggestions.push(...contextualSuggestions)
    
    // Learning-based suggestions from previous corrections
    const learningSuggestions = this.generateLearningSuggestions(character, validation)
    suggestions.push(...learningSuggestions)
    
    return suggestions.sort((a, b) => b.priority - a.priority).slice(0, 10)
  }

  /**
   * Generate contextual suggestions based on character analysis
   */
  async generateContextualSuggestions(character, validation) {
    const suggestions = []
    
    try {
      // Missing tag suggestions based on character attributes
      if (character.job && character.elements) {
        const expectedTags = this.predictExpectedTags(character)
        const currentTags = this.tagSystem.getAllTagsForCharacter(character)
        
        const missingTags = expectedTags.filter(tag => !currentTags.includes(tag))
        missingTags.forEach(tag => {
          suggestions.push({
            type: 'missing_tag',
            source: 'ai_prediction',
            priority: 0.7,
            suggestion: `Consider adding tag: ${tag}`,
            context: `Based on character job (${character.job}) and elements`
          })
        })
      }
      
      // Priority recommendations based on tier
      if (character.tierRatings?.gl?.tier) {
        const tier = character.tierRatings.gl.tier
        const expectedPriority = this.predictPriorityFromTier(tier)
        
        if (expectedPriority.ult && character.ultPriority !== expectedPriority.ult) {
          suggestions.push({
            type: 'priority_recommendation',
            source: 'tier_analysis',
            priority: 0.8,
            suggestion: `Consider setting ultPriority to "${expectedPriority.ult}"`,
            context: `Tier ${tier} characters typically have ${expectedPriority.ult} ultimate priority`
          })
        }
      }
      
      // Role-based suggestions
      if (character.roles?.primary) {
        const roleSuggestions = await this.generateRoleBasedSuggestions(character)
        suggestions.push(...roleSuggestions)
      }
      
    } catch (error) {
      debug.validation.error('Failed to generate contextual suggestions:', error)
    }
    
    return suggestions
  }

  /**
   * Generate suggestions based on learning data
   */
  generateLearningSuggestions(character, validation) {
    const suggestions = []
    
    if (!this.config.learningEnabled) return suggestions
    
    try {
      // Check if similar characters have been corrected before
      const similarCharacters = this.findSimilarCharacterPatterns(character)
      
      similarCharacters.forEach(pattern => {
        if (pattern.corrections && pattern.corrections.length > 0) {
          pattern.corrections.forEach(correction => {
            suggestions.push({
              type: 'learning_suggestion',
              source: 'previous_corrections',
              priority: 0.6,
              suggestion: correction.suggestion,
              context: `Similar correction applied to ${pattern.characterName}`
            })
          })
        }
      })
      
    } catch (error) {
      debug.validation.error('Failed to generate learning suggestions:', error)
    }
    
    return suggestions
  }

  /**
   * Apply auto-corrections where confidence is high
   */
  async applyAutoCorrections(character, validation) {
    const corrections = []
    
    if (!this.config.autoCorrectEnabled) return corrections
    
    try {
      // Apply high-confidence corrections
      validation.ruleResults.forEach((result, ruleId) => {
        if (result.confidence > this.config.highConfidence && result.issues) {
          result.issues.forEach(issue => {
            if (issue.suggestion && issue.severity === 'warning') {
              const correction = this.generateAutoCorrection(character, issue)
              if (correction) {
                corrections.push(correction)
              }
            }
          })
        }
      })
      
    } catch (error) {
      debug.validation.error('Auto-correction failed:', error)
    }
    
    return corrections
  }

  /**
   * Track human corrections for learning
   */
  async trackHumanCorrection(characterId, correctionType, before, after, context = {}) {
    if (!this.config.learningEnabled) return
    
    try {
      const correction = {
        characterId,
        correctionType,
        before,
        after,
        context,
        timestamp: Date.now(),
        sessionId: aiMemory.getSessionId()
      }
      
      // Store in learning data
      const correctionKey = `${correctionType}_${characterId}_${Date.now()}`
      this.learningData.set(correctionKey, correction)
      
      // Save to memory system
      const corrections = await aiMemory.getPreference('validation_corrections', {})
      corrections[correctionKey] = correction
      await aiMemory.setPreference('validation_corrections', corrections, 'validation')
      
      // Update quality metrics
      this.qualityMetrics.set('human_corrections', 
        this.qualityMetrics.get('human_corrections') + 1)
      
      debug.validation.log('Human correction tracked:', correctionType, characterId)
      
      // Track in memory for analytics
      await aiMemory.trackConversation('validation_correction', {
        characterId,
        correctionType,
        before: JSON.stringify(before),
        after: JSON.stringify(after)
      })
      
    } catch (error) {
      debug.validation.error('Failed to track human correction:', error)
    }
  }

  /**
   * Get suggestion priority based on severity
   */
  getSuggestionPriority(severity) {
    const priorities = {
      'error': 1.0,
      'warning': 0.8,
      'info': 0.6,
      'suggestion': 0.4
    }
    return priorities[severity] || 0.5
  }

  /**
   * Predict expected tags based on character attributes
   */
  predictExpectedTags(character) {
    const expectedTags = []
    
    // Job-based tags
    if (character.job) {
      expectedTags.push(`job_${character.job.toLowerCase()}`)
    }
    
    // Element-based tags
    if (character.elements) {
      character.elements.forEach(element => {
        expectedTags.push(`element_${element.toLowerCase()}`)
      })
    }
    
    // Star rating tags
    if (character.starRating) {
      expectedTags.push(`star_${character.starRating}`)
    }
    
    // Role-based tags
    if (character.roles?.primary) {
      expectedTags.push(`role_${character.roles.primary.toLowerCase()}`)
    }
    
    return expectedTags.filter(tag => this.tagSystem.taxonomy[tag])
  }

  /**
   * Predict priority from tier rating
   */
  predictPriorityFromTier(tier) {
    const tierPriorities = {
      'S+': { ult: 'essential', a4: 'essential' },
      'S': { ult: 'essential', a4: 'good' },
      'A': { ult: 'good', a4: 'good' },
      'B': { ult: 'good', a4: 'skip' },
      'C': { ult: 'skip', a4: 'skip' },
      'D': { ult: 'skip', a4: 'skip' }
    }
    
    return tierPriorities[tier] || { ult: 'good', a4: 'good' }
  }

  /**
   * Generate role-based suggestions
   */
  async generateRoleBasedSuggestions(character) {
    const suggestions = []
    
    const role = character.roles.primary.toLowerCase()
    const roleTags = {
      'dps': ['dmg_high', 'damage_dealer'],
      'buffer': ['buff_stats', 'support_ally'],
      'healer': ['heal_hp', 'support_heal'],
      'debuffer': ['debuff_enemy', 'resist_down'],
      'tank': ['hp_high', 'damage_reduction']
    }
    
    if (roleTags[role]) {
      const expectedTags = roleTags[role]
      const currentTags = this.tagSystem.getAllTagsForCharacter(character)
      
      expectedTags.forEach(tag => {
        if (!currentTags.includes(tag)) {
          suggestions.push({
            type: 'role_tag',
            source: 'role_analysis',
            priority: 0.7,
            suggestion: `Consider adding ${role} tag: ${tag}`,
            context: `Typical tag for ${role} role characters`
          })
        }
      })
    }
    
    return suggestions
  }

  /**
   * Find similar character patterns for learning
   */
  findSimilarCharacterPatterns(character) {
    const patterns = []
    
    this.learningData.forEach((correction, key) => {
      if (correction.characterId !== character.id) {
        // Find similar characters based on job, tier, role, etc.
        const similarity = this.calculateCharacterSimilarity(character, correction.context?.character)
        
        if (similarity > 0.7) {
          patterns.push({
            similarity,
            characterName: correction.context?.character?.name || 'Unknown',
            corrections: [correction]
          })
        }
      }
    })
    
    return patterns.sort((a, b) => b.similarity - a.similarity)
  }

  /**
   * Calculate character similarity for learning patterns
   */
  calculateCharacterSimilarity(char1, char2) {
    if (!char1 || !char2) return 0
    
    let similarity = 0
    let factors = 0
    
    // Job similarity
    if (char1.job && char2.job) {
      similarity += char1.job === char2.job ? 1 : 0
      factors++
    }
    
    // Star rating similarity
    if (char1.starRating && char2.starRating) {
      similarity += char1.starRating === char2.starRating ? 1 : 0
      factors++
    }
    
    // Role similarity
    if (char1.roles?.primary && char2.roles?.primary) {
      similarity += char1.roles.primary === char2.roles.primary ? 1 : 0
      factors++
    }
    
    // Tier similarity
    const tier1 = char1.tierRatings?.gl?.tier
    const tier2 = char2.tierRatings?.gl?.tier
    if (tier1 && tier2) {
      similarity += tier1 === tier2 ? 1 : 0
      factors++
    }
    
    return factors > 0 ? similarity / factors : 0
  }

  /**
   * Generate auto-correction
   */
  generateAutoCorrection(character, issue) {
    // Implementation would depend on specific correction types
    return null // Placeholder
  }

  /**
   * Check for tag-field duplications
   */
  checkTagFieldDuplication(character) {
    const duplications = []
    const currentTags = this.tagSystem.getAllTagsForCharacter(character)
    
    // Check job duplication
    if (character.job && currentTags.includes(`job_${character.job.toLowerCase()}`)) {
      duplications.push({
        tag: `job_${character.job.toLowerCase()}`,
        field: 'job',
        fieldValue: character.job
      })
    }
    
    // Check star rating duplication
    if (character.starRating && currentTags.includes(`star_${character.starRating}`)) {
      duplications.push({
        tag: `star_${character.starRating}`,
        field: 'starRating',
        fieldValue: character.starRating
      })
    }
    
    // Check element duplications
    if (character.elements) {
      character.elements.forEach(element => {
        const elementTag = `element_${element.toLowerCase()}`
        if (currentTags.includes(elementTag)) {
          duplications.push({
            tag: elementTag,
            field: 'elements',
            fieldValue: element
          })
        }
      })
    }
    
    return duplications
  }

  /**
   * Suggest tag corrections based on similarity
   */
  suggestTagCorrection(unknownTag) {
    const suggestions = this.tagSystem.suggestTags(unknownTag, 3)
    return suggestions.length > 0 ? suggestions[0].name : null
  }

  /**
   * Calculate quality metrics from validation results
   */
  calculateQualityMetrics(validations) {
    const metrics = {
      averageConfidence: 0,
      averageScore: 0,
      issuesByType: new Map(),
      issuesBySeverity: new Map(),
      completenessDistribution: new Map(),
      qualityDistribution: new Map()
    }
    
    if (validations.length === 0) return metrics
    
    let totalConfidence = 0
    let totalScore = 0
    
    validations.forEach(validation => {
      totalConfidence += validation.overallConfidence
      totalScore += validation.overallScore
      
      // Track issues by type and severity
      validation.issues.forEach(issue => {
        metrics.issuesByType.set(issue.type, (metrics.issuesByType.get(issue.type) || 0) + 1)
        metrics.issuesBySeverity.set(issue.severity, (metrics.issuesBySeverity.get(issue.severity) || 0) + 1)
      })
      
      // Quality distribution
      const qualityTier = validation.overallScore >= 0.9 ? 'excellent' :
                         validation.overallScore >= 0.8 ? 'good' :
                         validation.overallScore >= 0.6 ? 'average' : 'poor'
      metrics.qualityDistribution.set(qualityTier, 
        (metrics.qualityDistribution.get(qualityTier) || 0) + 1)
    })
    
    metrics.averageConfidence = totalConfidence / validations.length
    metrics.averageScore = totalScore / validations.length
    
    return metrics
  }

  /**
   * Generate batch recommendations
   */
  generateBatchRecommendations(results) {
    const recommendations = []
    
    // Top issues to address
    const topIssues = Array.from(results.summary.commonIssues.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    
    topIssues.forEach(([issueKey, count]) => {
      const [type, severity] = issueKey.split(':')
      recommendations.push({
        type: 'batch_issue',
        priority: severity === 'error' ? 1.0 : 0.8,
        issue: type,
        affectedCount: count,
        recommendation: `Address ${type} issues affecting ${count} characters`
      })
    })
    
    // Quality improvement suggestions
    if (results.summary.overallQuality < this.config.minDataCompleteness) {
      recommendations.push({
        type: 'quality_improvement',
        priority: 0.9,
        recommendation: `Overall data quality (${(results.summary.overallQuality * 100).toFixed(1)}%) is below target (${(this.config.minDataCompleteness * 100)}%)`
      })
    }
    
    return recommendations.sort((a, b) => b.priority - a.priority)
  }

  /**
   * Export validation report
   */
  exportValidationReport(results, options = {}) {
    const report = {
      metadata: {
        generatedAt: new Date().toISOString(),
        validator: 'AIValidationSystem v2.0.0',
        config: this.config,
        ...results.metadata
      },
      summary: results.summary,
      qualityMetrics: this.qualityMetrics,
      detailedResults: options.includeDetails ? results.validations : null,
      recommendations: results.summary.recommendations
    }
    
    return report
  }

  /**
   * Get validation system status
   */
  getSystemStatus() {
    return {
      initialized: this.initialized,
      rulesLoaded: this.validationRules.size,
      learningDataSize: this.learningData.size,
      qualityMetrics: Object.fromEntries(this.qualityMetrics),
      config: this.config
    }
  }
}

// Create and export singleton instance
export const aiValidation = new AIValidationSystem()

// Export class for custom instances
export { AIValidationSystem }

export default aiValidation