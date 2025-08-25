/**
 * Skill Search Export & Sharing Utilities
 * 
 * Provides comprehensive export and sharing capabilities for skill search results,
 * including CSV, JSON, and URL sharing with query state preservation.
 */

import debug from './debug'

export class SkillSearchExporter {
  constructor() {
    this.exportFormats = ['csv', 'json', 'markdown', 'text']
    this.shareFormats = ['url', 'reddit', 'discord', 'clipboard']
  }

  /**
   * Export search results to various formats
   */
  async exportResults(characters, searchState, format = 'csv', options = {}) {
    debug.export.group('Exporting Search Results')
    debug.export.log('Format:', format, 'Characters:', characters.length)
    debug.export.log('Search state:', searchState)
    debug.export.log('Options:', options)

    try {
      let exportData
      let filename = this.generateFilename(searchState, format)

      switch (format.toLowerCase()) {
        case 'csv':
          exportData = this.exportToCSV(characters, searchState, options)
          break
        case 'json':
          exportData = this.exportToJSON(characters, searchState, options)
          break
        case 'markdown':
          exportData = this.exportToMarkdown(characters, searchState, options)
          break
        case 'text':
          exportData = this.exportToText(characters, searchState, options)
          break
        default:
          throw new Error(`Unsupported export format: ${format}`)
      }

      // Trigger download
      await this.downloadFile(exportData.content, filename, exportData.mimeType)

      debug.export.log('Export completed successfully')
      debug.export.groupEnd()

      return {
        success: true,
        filename,
        format,
        characterCount: characters.length,
        size: exportData.content.length
      }
    } catch (error) {
      debug.export.error('Export failed:', error)
      debug.export.groupEnd()
      throw error
    }
  }

  /**
   * Export to CSV format
   */
  exportToCSV(characters, searchState, options = {}) {
    const columns = options.columns || [
      'name', 'job', 'tier', 'priority', 'isFree', 'elements', 'weapons',
      'matchingSkills', 'skillCount', 'tags', 'notes'
    ]

    const headers = columns.map(col => this.formatColumnHeader(col))
    const rows = characters.map(character => 
      columns.map(column => this.getCharacterValue(character, column, searchState))
    )

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => this.escapeCSVValue(cell)).join(','))
    ].join('\n')

    // Add metadata header
    const metadata = [
      `# COTC Skill Search Export`,
      `# Generated: ${new Date().toISOString()}`,
      `# Query: ${this.getSearchDescription(searchState)}`,
      `# Results: ${characters.length} characters`,
      ``
    ].join('\n')

    return {
      content: metadata + csvContent,
      mimeType: 'text/csv'
    }
  }

  /**
   * Export to JSON format
   */
  exportToJSON(characters, searchState, options = {}) {
    const includeSkills = options.includeSkills !== false
    const includeFullData = options.includeFullData === true

    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        searchQuery: searchState,
        resultCount: characters.length,
        exportOptions: options,
        version: '1.0.0'
      },
      search: {
        description: this.getSearchDescription(searchState),
        appliedFilters: this.getAppliedFilters(searchState),
        mode: searchState.mode || 'unknown'
      },
      results: characters.map(character => {
        const result = {
          id: character.id,
          name: character.name,
          job: character.job,
          tier: character.tierRatings?.gl?.tier,
          priority: character.ultPriority,
          isFree: character.isFree,
          elements: character.elements,
          weapons: character.weapons
        }

        if (includeSkills && character.skills) {
          result.skills = {
            passive: character.skills.passive?.map(s => ({
              name: s.name,
              description: s.description,
              tags: s.extracted_tags || []
            })) || [],
            battle: character.skills.battle?.map(s => ({
              name: s.name,
              description: s.description,
              sp_cost: s.sp_cost,
              potency: s.potency,
              tags: s.extracted_tags || []
            })) || [],
            ultimate: character.skills.ultimate?.map(s => ({
              name: s.name,
              description: s.description,
              tags: s.extracted_tags || []
            })) || []
          }
        }

        if (includeFullData) {
          result.fullData = character
        }

        // Add search-specific data
        if (character._searchScore) {
          result.searchScore = character._searchScore
        }

        return result
      })
    }

    return {
      content: JSON.stringify(exportData, null, 2),
      mimeType: 'application/json'
    }
  }

  /**
   * Export to Markdown format
   */
  exportToMarkdown(characters, searchState, options = {}) {
    const includeSkills = options.includeSkills !== false
    const includeTags = options.includeTags !== false

    let markdown = []

    // Header
    markdown.push(`# COTC Skill Search Results`)
    markdown.push('')
    markdown.push(`**Search Query:** ${this.getSearchDescription(searchState)}`)
    markdown.push(`**Results:** ${characters.length} characters`)
    markdown.push(`**Generated:** ${new Date().toLocaleString()}`)
    markdown.push('')

    // Applied Filters
    const filters = this.getAppliedFilters(searchState)
    if (filters.length > 0) {
      markdown.push(`## Applied Filters`)
      markdown.push('')
      filters.forEach(filter => {
        markdown.push(`- **${filter.category}:** ${filter.values.join(', ')}`)
      })
      markdown.push('')
    }

    // Results Table
    markdown.push(`## Search Results`)
    markdown.push('')
    markdown.push('| Character | Job | Tier | Priority | Type |')
    markdown.push('|-----------|-----|------|----------|------|')

    characters.forEach(character => {
      const tier = character.tierRatings?.gl?.tier || 'Unranked'
      const priority = character.ultPriority || 'Unknown'
      const type = character.isFree ? 'Free' : 'Gacha'
      
      markdown.push(`| ${character.name} | ${character.job} | ${tier} | ${priority} | ${type} |`)
    })

    markdown.push('')

    // Detailed Character Information
    if (includeSkills) {
      markdown.push(`## Detailed Character Information`)
      markdown.push('')

      characters.forEach(character => {
        markdown.push(`### ${character.name}`)
        markdown.push('')
        markdown.push(`- **Job:** ${character.job}`)
        markdown.push(`- **Tier:** ${character.tierRatings?.gl?.tier || 'Unranked'}`)
        markdown.push(`- **Priority:** ${character.ultPriority || 'Unknown'}`)
        markdown.push(`- **Type:** ${character.isFree ? 'Free' : 'Gacha'}`)
        
        if (character.elements) {
          markdown.push(`- **Elements:** ${character.elements.join(', ')}`)
        }
        
        if (character.weapons) {
          markdown.push(`- **Weapons:** ${character.weapons.join(', ')}`)
        }

        // Skills
        if (character.skills) {
          if (character.skills.passive?.length > 0) {
            markdown.push('')
            markdown.push('**Passive Skills:**')
            character.skills.passive.forEach(skill => {
              markdown.push(`- **${skill.name}:** ${skill.description || 'No description available'}`)
            })
          }

          if (character.skills.battle?.length > 0) {
            markdown.push('')
            markdown.push('**Battle Skills:**')
            character.skills.battle.forEach(skill => {
              const spCost = skill.sp_cost ? ` (${skill.sp_cost} SP)` : ''
              markdown.push(`- **${skill.name}${spCost}:** ${skill.description || 'No description available'}`)
            })
          }

          if (character.skills.ultimate?.length > 0) {
            markdown.push('')
            markdown.push('**Ultimate Skills:**')
            character.skills.ultimate.forEach(skill => {
              markdown.push(`- **${skill.name}:** ${skill.description || 'No description available'}`)
            })
          }
        }

        // Tags
        if (includeTags && character.tags) {
          const allTags = this.getAllCharacterTags(character)
          if (allTags.length > 0) {
            markdown.push('')
            markdown.push(`**Effect Tags:** ${allTags.join(', ')}`)
          }
        }

        markdown.push('')
      })
    }

    // Footer
    markdown.push('---')
    markdown.push('')
    markdown.push('*Generated by COTC Skill Search - https://cotc-meta-guide.example.com*')

    return {
      content: markdown.join('\n'),
      mimeType: 'text/markdown'
    }
  }

  /**
   * Export to plain text format
   */
  exportToText(characters, searchState, options = {}) {
    const lines = []

    // Header
    lines.push('COTC SKILL SEARCH RESULTS')
    lines.push('='.repeat(50))
    lines.push('')
    lines.push(`Search Query: ${this.getSearchDescription(searchState)}`)
    lines.push(`Results: ${characters.length} characters`)
    lines.push(`Generated: ${new Date().toLocaleString()}`)
    lines.push('')

    // Applied Filters
    const filters = this.getAppliedFilters(searchState)
    if (filters.length > 0) {
      lines.push('APPLIED FILTERS:')
      filters.forEach(filter => {
        lines.push(`  ${filter.category}: ${filter.values.join(', ')}`)
      })
      lines.push('')
    }

    // Character List
    lines.push('CHARACTERS:')
    lines.push('-'.repeat(30))

    characters.forEach((character, index) => {
      lines.push(`${index + 1}. ${character.name}`)
      lines.push(`   Job: ${character.job}`)
      lines.push(`   Tier: ${character.tierRatings?.gl?.tier || 'Unranked'}`)
      lines.push(`   Priority: ${character.ultPriority || 'Unknown'}`)
      lines.push(`   Type: ${character.isFree ? 'Free' : 'Gacha'}`)
      
      if (character.elements) {
        lines.push(`   Elements: ${character.elements.join(', ')}`)
      }
      
      if (character.weapons) {
        lines.push(`   Weapons: ${character.weapons.join(', ')}`)
      }

      // Matching skills count
      if (character.skills) {
        const passiveCount = character.skills.passive?.length || 0
        const battleCount = character.skills.battle?.length || 0
        const ultimateCount = character.skills.ultimate?.length || 0
        const totalSkills = passiveCount + battleCount + ultimateCount
        lines.push(`   Skills: ${totalSkills} total (${passiveCount} passive, ${battleCount} battle, ${ultimateCount} ultimate)`)
      }

      lines.push('')
    })

    // Footer
    lines.push('-'.repeat(50))
    lines.push('Generated by COTC Skill Search')
    lines.push('https://cotc-meta-guide.example.com')

    return {
      content: lines.join('\n'),
      mimeType: 'text/plain'
    }
  }

  /**
   * Share search results via URL or social platforms
   */
  async shareResults(characters, searchState, format = 'url', options = {}) {
    debug.export.group('Sharing Search Results')
    debug.export.log('Format:', format, 'Characters:', characters.length)

    try {
      let shareData

      switch (format.toLowerCase()) {
        case 'url':
          shareData = await this.createShareURL(searchState, options)
          break
        case 'reddit':
          shareData = await this.createRedditPost(characters, searchState, options)
          break
        case 'discord':
          shareData = await this.createDiscordMessage(characters, searchState, options)
          break
        case 'clipboard':
          shareData = await this.copyToClipboard(characters, searchState, options)
          break
        default:
          throw new Error(`Unsupported share format: ${format}`)
      }

      debug.export.log('Share completed successfully')
      debug.export.groupEnd()

      return shareData
    } catch (error) {
      debug.export.error('Share failed:', error)
      debug.export.groupEnd()
      throw error
    }
  }

  /**
   * Create shareable URL with encoded search state
   */
  async createShareURL(searchState, options = {}) {
    const baseURL = options.baseURL || window.location.origin + window.location.pathname

    // Encode search state into URL parameters
    const params = new URLSearchParams()

    if (searchState.naturalQuery) {
      params.set('q', searchState.naturalQuery)
    }

    if (searchState.booleanQuery) {
      params.set('bq', searchState.booleanQuery)
    }

    if (searchState.mode && searchState.mode !== 'natural') {
      params.set('mode', searchState.mode)
    }

    // Encode selected tags
    if (searchState.selectedTags) {
      const flatTags = this.flattenTagSelection(searchState.selectedTags)
      if (flatTags.length > 0) {
        params.set('tags', flatTags.join(','))
      }
    }

    // Encode advanced filters
    if (searchState.advancedFilters) {
      Object.entries(searchState.advancedFilters).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          params.set(`filter_${key}`, value.join(','))
        } else if (typeof value === 'boolean' && value) {
          params.set(`filter_${key}`, 'true')
        } else if (typeof value === 'number' && value !== null) {
          params.set(`filter_${key}`, value.toString())
        }
      })
    }

    // Add timestamp for tracking
    params.set('shared', Date.now().toString())

    const shareURL = `${baseURL}?${params.toString()}`

    // Copy to clipboard if supported
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareURL)
    }

    return {
      url: shareURL,
      copied: !!navigator.clipboard,
      description: this.getSearchDescription(searchState)
    }
  }

  /**
   * Create Reddit-formatted post
   */
  async createRedditPost(characters, searchState, options = {}) {
    const title = options.title || `COTC Characters: ${this.getSearchDescription(searchState)}`
    const postLines = []

    postLines.push(`**Search Query:** ${this.getSearchDescription(searchState)}`)
    postLines.push(`**Results:** ${characters.length} characters`)
    postLines.push('')

    // Top results
    const topCharacters = characters.slice(0, options.limit || 10)
    postLines.push('**Top Results:**')
    postCharacters.forEach((character, index) => {
      const tier = character.tierRatings?.gl?.tier || 'Unranked'
      const type = character.isFree ? '(Free)' : '(Gacha)'
      postLines.push(`${index + 1}. **${character.name}** - ${character.job} ${tier} ${type}`)
    })

    if (characters.length > (options.limit || 10)) {
      postLines.push(`\n...and ${characters.length - (options.limit || 10)} more characters`)
    }

    postLines.push('')
    postLines.push('*Generated with [COTC Skill Search](https://cotc-meta-guide.example.com/skills.html)*')

    const postContent = postLines.join('\n')

    // Create Reddit URL
    const redditURL = `https://www.reddit.com/r/OctopathCotC/submit?${new URLSearchParams({
      title: title,
      text: postContent
    }).toString()}`

    return {
      title,
      content: postContent,
      url: redditURL,
      platform: 'reddit'
    }
  }

  /**
   * Create Discord-formatted message
   */
  async createDiscordMessage(characters, searchState, options = {}) {
    const lines = []

    lines.push('```')
    lines.push('🔍 COTC Skill Search Results')
    lines.push('─'.repeat(30))
    lines.push(`Query: ${this.getSearchDescription(searchState)}`)
    lines.push(`Found: ${characters.length} characters`)
    lines.push('```')

    // Top results with Discord formatting
    const topCharacters = characters.slice(0, options.limit || 8)
    topCharacters.forEach((character, index) => {
      const tier = character.tierRatings?.gl?.tier || '?'
      const type = character.isFree ? '🆓' : '💎'
      const emoji = this.getJobEmoji(character.job)
      
      lines.push(`${index + 1}. **${character.name}** ${type}`)
      lines.push(`   ${emoji} ${character.job} • Tier ${tier}`)
    })

    if (characters.length > (options.limit || 8)) {
      lines.push(`\n*...and ${characters.length - (options.limit || 8)} more*`)
    }

    lines.push('\n🔗 *Search with COTC Skill Search*')

    const message = lines.join('\n')

    // Copy to clipboard if supported
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(message)
    }

    return {
      content: message,
      copied: !!navigator.clipboard,
      platform: 'discord'
    }
  }

  /**
   * Copy formatted results to clipboard
   */
  async copyToClipboard(characters, searchState, options = {}) {
    const format = options.format || 'text'
    
    let content
    if (format === 'markdown') {
      const exportData = this.exportToMarkdown(characters, searchState, options)
      content = exportData.content
    } else {
      const exportData = this.exportToText(characters, searchState, options)
      content = exportData.content
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(content)
      return {
        copied: true,
        content: content.substring(0, 200) + '...',
        format
      }
    }

    throw new Error('Clipboard not supported')
  }

  /**
   * Helper methods
   */
  generateFilename(searchState, format) {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const searchDesc = this.getSearchDescription(searchState)
      .substring(0, 30)
      .replace(/[^a-zA-Z0-9]/g, '_')
      .toLowerCase()
    
    return `cotc_skill_search_${searchDesc}_${timestamp}.${format}`
  }

  getSearchDescription(searchState) {
    if (searchState.naturalQuery) {
      return searchState.naturalQuery
    }

    if (searchState.booleanQuery) {
      return `Boolean: ${searchState.booleanQuery}`
    }

    if (searchState.selectedTags) {
      const flatTags = this.flattenTagSelection(searchState.selectedTags)
      if (flatTags.length > 0) {
        return `Tags: ${flatTags.slice(0, 3).join(', ')}${flatTags.length > 3 ? '...' : ''}`
      }
    }

    return 'All characters'
  }

  getAppliedFilters(searchState) {
    const filters = []

    if (searchState.selectedTags) {
      Object.entries(searchState.selectedTags).forEach(([category, tags]) => {
        if (tags.length > 0) {
          filters.push({
            category: category.charAt(0).toUpperCase() + category.slice(1),
            values: tags
          })
        }
      })
    }

    if (searchState.advancedFilters) {
      Object.entries(searchState.advancedFilters).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          filters.push({
            category: key.charAt(0).toUpperCase() + key.slice(1),
            values: value
          })
        } else if (typeof value === 'boolean' && value) {
          filters.push({
            category: key.charAt(0).toUpperCase() + key.slice(1),
            values: ['Yes']
          })
        }
      })
    }

    return filters
  }

  flattenTagSelection(selectedTags) {
    const allTags = []
    Object.values(selectedTags).forEach(tagArray => {
      if (Array.isArray(tagArray)) {
        allTags.push(...tagArray)
      }
    })
    return allTags
  }

  formatColumnHeader(column) {
    const headerMap = {
      'name': 'Character Name',
      'job': 'Job',
      'tier': 'Tier',
      'priority': 'Priority',
      'isFree': 'Free Character',
      'elements': 'Elements',
      'weapons': 'Weapons',
      'matchingSkills': 'Matching Skills',
      'skillCount': 'Total Skills',
      'tags': 'Tags',
      'notes': 'Notes'
    }
    return headerMap[column] || column
  }

  getCharacterValue(character, column, searchState) {
    switch (column) {
      case 'name':
        return character.name
      case 'job':
        return character.job || ''
      case 'tier':
        return character.tierRatings?.gl?.tier || ''
      case 'priority':
        return character.ultPriority || ''
      case 'isFree':
        return character.isFree ? 'Free' : 'Gacha'
      case 'elements':
        return character.elements?.join(', ') || ''
      case 'weapons':
        return character.weapons?.join(', ') || ''
      case 'matchingSkills':
        return this.getMatchingSkillNames(character, searchState)
      case 'skillCount':
        return this.getTotalSkillCount(character)
      case 'tags':
        return this.getAllCharacterTags(character).join(', ')
      case 'notes':
        return character.notes || ''
      default:
        return ''
    }
  }

  getMatchingSkillNames(character, searchState) {
    // This would need to be implemented based on the search logic
    return ''
  }

  getTotalSkillCount(character) {
    if (!character.skills) return 0
    const passiveCount = character.skills.passive?.length || 0
    const battleCount = character.skills.battle?.length || 0
    const ultimateCount = character.skills.ultimate?.length || 0
    return passiveCount + battleCount + ultimateCount
  }

  getAllCharacterTags(character) {
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

  escapeCSVValue(value) {
    const stringValue = String(value || '')
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }
    return stringValue
  }

  getJobEmoji(job) {
    const emojiMap = {
      'Warrior': '⚔️',
      'Hunter': '🏹',
      'Cleric': '✨',
      'Scholar': '📚',
      'Dancer': '💃',
      'Merchant': '💰',
      'Apothecary': '⚗️',
      'Thief': '🗡️'
    }
    return emojiMap[job] || '❓'
  }

  async downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

export default SkillSearchExporter