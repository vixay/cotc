/**
 * Example integration of tag search with existing character data
 * Shows how to connect the tag system with character filtering
 */

class TagIntegrationExample {
  constructor() {
    this.characters = [];
    this.tagSearch = null;
    this.filteredCharacters = [];
  }

  async init() {
    // Initialize tag search
    const searchContainer = document.getElementById('tagSearchContainer');
    this.tagSearch = new TagSearch({
      container: searchContainer,
      placeholder: 'Search by effects, roles, or abilities...',
      onTagsChange: (tags, mode) => this.handleTagSearch(tags, mode)
    });

    // Load character data (this would be your existing data loading)
    await this.loadCharacterData();
    
    // Set up initial display
    this.displayCharacters(this.characters);
  }

  async loadCharacterData() {
    // Simulate loading character data with tags
    this.characters = [
      {
        id: 'primrose_ex',
        name: 'Primrose EX',
        role: 'Buffer',
        tier: 'S+',
        tags: [
          'buff_atk_phys',
          'buff_atk_elem', 
          'buff_def_phys',
          'buff_def_elem',
          'target_ally_all',
          'heal_hp',
          'trigger_battle_start'
        ],
        ultPriority: 'top',
        a4Priority: 'essential'
      },
      {
        id: 'cyrus',
        name: 'Cyrus',
        role: 'DPS',
        tier: 'S',
        tags: [
          'dmg_fire',
          'dmg_ice', 
          'dmg_lightning',
          'resist_down_fire',
          'target_enemy_single',
          'trigger_critical_hit'
        ],
        ultPriority: 'essential',
        a4Priority: 'good'
      },
      {
        id: 'tressa',
        name: 'Tressa',
        role: 'Support',
        tier: 'A',
        tags: [
          'heal_hp',
          'heal_sp',
          'buff_speed',
          'target_ally_single',
          'bp_generation'
        ],
        ultPriority: 'good',
        a4Priority: 'skip'
      },
      {
        id: 'olberic',
        name: 'Olberic',
        role: 'Tank',
        tier: 'B',
        tags: [
          'shield',
          'redirect_damage',
          'buff_def_phys',
          'target_self',
          'immunity_charm'
        ],
        ultPriority: 'skip',
        a4Priority: 'essential'
      }
    ];
  }

  handleTagSearch(selectedTags, searchMode) {
    if (selectedTags.length === 0) {
      this.filteredCharacters = [...this.characters];
    } else {
      this.filteredCharacters = this.characters.filter(character => {
        if (searchMode === 'AND') {
          // Character must have ALL selected tags
          return selectedTags.every(tag => character.tags.includes(tag));
        } else {
          // Character must have ANY of the selected tags
          return selectedTags.some(tag => character.tags.includes(tag));
        }
      });
    }

    this.displayCharacters(this.filteredCharacters);
    this.updateResultsCount();
  }

  displayCharacters(characters) {
    const container = document.getElementById('charactersContainer');
    
    if (characters.length === 0) {
      container.innerHTML = '<div class="no-results">No characters match your search criteria.</div>';
      return;
    }

    let html = '<div class="character-grid">';
    
    characters.forEach(character => {
      html += `
        <div class="character-card" data-id="${character.id}">
          <div class="character-header">
            <h3 class="character-name">${character.name}</h3>
            <span class="character-tier tier-${character.tier.toLowerCase().replace('+', 'plus')}">${character.tier}</span>
          </div>
          
          <div class="character-details">
            <div class="character-role">${character.role}</div>
            <div class="priority-info">
              <span class="ult-priority priority-${character.ultPriority}">ULT: ${character.ultPriority}</span>
              <span class="a4-priority priority-${character.a4Priority}">A4: ${character.a4Priority}</span>
            </div>
          </div>
          
          <div class="character-tags">
            ${this.renderCharacterTags(character.tags)}
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    container.innerHTML = html;
  }

  renderCharacterTags(tags) {
    const maxDisplayTags = 5;
    const displayTags = tags.slice(0, maxDisplayTags);
    const remainingCount = tags.length - maxDisplayTags;

    let html = '';
    displayTags.forEach(tag => {
      const tagData = this.tagSearch.tagRegistry.get(tag);
      const displayName = tagData ? tagData.uiDisplay : tag;
      const category = tagData ? tagData.category : 'unknown';
      
      html += `<span class="mini-tag tag-${category}" title="${displayName}">${displayName}</span>`;
    });

    if (remainingCount > 0) {
      html += `<span class="more-tags">+${remainingCount} more</span>`;
    }

    return html;
  }

  updateResultsCount() {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
      countElement.textContent = this.filteredCharacters.length;
    }
  }

  // Public API for external integration
  filterByTags(tags, mode = 'AND') {
    this.tagSearch.setSelectedTags(tags);
    this.tagSearch.setSearchMode(mode);
    this.handleTagSearch(tags, mode);
  }

  getFilteredCharacters() {
    return this.filteredCharacters;
  }

  addCustomTags(characterId, newTags) {
    const character = this.characters.find(c => c.id === characterId);
    if (character) {
      character.tags = [...new Set([...character.tags, ...newTags])];
      // Re-apply current filters
      const currentTags = this.tagSearch.getSelectedTags();
      if (currentTags.length > 0) {
        this.handleTagSearch(currentTags, this.tagSearch.getSearchMode());
      }
    }
  }
}

// Usage example
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize the tag integration
  const tagIntegration = new TagIntegrationExample();
  await tagIntegration.init();

  // Example of programmatic filtering
  // tagIntegration.filterByTags(['buff_atk_phys', 'target_ally_all'], 'AND');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TagIntegrationExample;
}