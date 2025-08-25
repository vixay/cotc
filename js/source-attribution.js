/**
 * Source Attribution System
 * Handles display of source information with Wikipedia-style info icons
 */

class SourceAttribution {
  constructor() {
    this.sources = new Map();
    this.initializeSourceDisplay();
  }

  /**
   * Add source attribution to recommendation display
   */
  addSourceInfo(element, sourceData) {
    if (!sourceData) return;

    const sourceIcon = this.createSourceIcon(sourceData);
    element.appendChild(sourceIcon);
  }

  /**
   * Create Wikipedia-style source icon with tooltip
   */
  createSourceIcon(sourceData) {
    const sourceInfo = document.createElement('span');
    sourceInfo.className = 'source-info';

    const icon = document.createElement('span');
    icon.className = `source-icon ${this.getConfidenceClass(sourceData.confidence)}`;
    icon.textContent = 'i';
    icon.setAttribute('aria-label', 'Source information');

    const tooltip = this.createTooltip(sourceData);
    
    sourceInfo.appendChild(icon);
    sourceInfo.appendChild(tooltip);

    return sourceInfo;
  }

  /**
   * Create detailed tooltip with source information
   */
  createTooltip(sourceData) {
    const tooltip = document.createElement('div');
    tooltip.className = 'source-tooltip source-tooltip-detailed';

    const evaluator = document.createElement('div');
    evaluator.className = 'source-evaluator';
    evaluator.textContent = sourceData.evaluator;

    const date = document.createElement('div');
    date.className = 'source-date';
    date.textContent = `Updated: ${sourceData.lastUpdated}`;

    const confidence = document.createElement('div');
    confidence.textContent = `Confidence: ${sourceData.confidence}`;

    tooltip.appendChild(evaluator);
    tooltip.appendChild(date);
    tooltip.appendChild(confidence);

    if (sourceData.reasoning) {
      const reasoning = document.createElement('div');
      reasoning.className = 'source-reasoning';
      reasoning.textContent = sourceData.reasoning;
      tooltip.appendChild(reasoning);
    }

    if (sourceData.sourceUrl) {
      const link = document.createElement('div');
      link.innerHTML = `<a href="${sourceData.sourceUrl}" target="_blank" style="color: #4a9eff;">View Source</a>`;
      tooltip.appendChild(link);
    }

    return tooltip;
  }

  /**
   * Get CSS class based on confidence level
   */
  getConfidenceClass(confidence) {
    switch (confidence) {
      case 'very_high':
      case 'high':
        return 'source-high-confidence';
      case 'medium':
        return 'source-medium-confidence';
      case 'low':
      case 'very_low':
        return 'source-low-confidence';
      default:
        return 'source-medium-confidence';
    }
  }

  /**
   * Format character recommendation with F2P/Dolphin and source attribution
   */
  formatRecommendationWithSource(character) {
    const container = document.createElement('div');
    container.className = 'character-recommendation';

    const f2pRec = this.getF2PRecommendation(character);
    const dolphinRec = this.getDolphinRecommendation(character);

    if (f2pRec === dolphinRec) {
      // Same recommendation for both
      const recElement = document.createElement('span');
      recElement.className = 'rec universal';
      recElement.textContent = f2pRec;
      
      if (character.prioritySource) {
        this.addSourceInfo(recElement, character.prioritySource);
      }
      
      container.appendChild(recElement);
    } else {
      // Different F2P vs Dolphin recommendations
      const f2pElement = document.createElement('span');
      f2pElement.className = 'rec f2p';
      f2pElement.textContent = `F2P: ${f2pRec}`;
      
      const dolphinElement = document.createElement('span');
      dolphinElement.className = 'rec dolphin';
      dolphinElement.textContent = `Dolphin: ${dolphinRec}`;

      if (character.prioritySource) {
        this.addSourceInfo(f2pElement, character.prioritySource);
        this.addSourceInfo(dolphinElement, character.prioritySource);
      }

      container.appendChild(f2pElement);
      container.appendChild(document.createTextNode(' | '));
      container.appendChild(dolphinElement);
    }

    return container;
  }

  /**
   * Get F2P recommendation from character data
   */
  getF2PRecommendation(character) {
    const ultPriority = character.ultPriority || 'skip';
    const a4Priority = character.a4Priority || 'skip';

    if (ultPriority === 'skip' && a4Priority === 'skip') return 'Shard';
    if (ultPriority === 'skip' && a4Priority === 'essential') return 'A4';
    if (ultPriority === 'essential' && a4Priority === 'skip') return 'U10';
    if (ultPriority === 'essential' && a4Priority === 'good') return 'U10→A4';
    if (ultPriority === 'good' && a4Priority === 'essential') return 'A4→U10';
    if (ultPriority === 'essential' && a4Priority === 'essential') return 'A4U10';
    
    return 'Shard';
  }

  /**
   * Get Dolphin recommendation (check for override tags)
   */
  getDolphinRecommendation(character) {
    const tags = character.tags || [];
    
    if (tags.includes('dolphin_a4')) return 'A4';
    if (tags.includes('dolphin_u10')) return 'U10';
    if (tags.includes('dolphin_a4u10')) return 'A4U10';
    if (tags.includes('dolphin_shard')) return 'Shard';
    
    // No override - use F2P recommendation
    return this.getF2PRecommendation(character);
  }

  /**
   * Initialize source attribution display for existing elements
   */
  initializeSourceDisplay() {
    // Find all character recommendation elements and add source info
    document.addEventListener('DOMContentLoaded', () => {
      this.enhanceExistingRecommendations();
    });
  }

  /**
   * Enhance existing recommendation displays with source info
   */
  enhanceExistingRecommendations() {
    const recommendationElements = document.querySelectorAll('[data-character-id]');
    
    recommendationElements.forEach(element => {
      const characterId = element.getAttribute('data-character-id');
      // This would fetch character data and add source attribution
      // Implementation depends on how character data is loaded
    });
  }
}

// Initialize source attribution system
const sourceAttribution = new SourceAttribution();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SourceAttribution;
}