/**
 * Tag-based Search System
 * Provides intelligent auto-complete search with tag suggestions
 */

class TagSearch {
  constructor(options = {}) {
    this.container = options.container || document.body;
    this.placeholder = options.placeholder || 'Type to find characters, skills, or effects...';
    this.onTagsChange = options.onTagsChange || (() => {});
    this.tagRegistry = new Map(); // Will be populated from tag_registry.json
    this.selectedTags = new Set();
    this.searchMode = 'AND'; // 'AND' or 'OR'
    
    this.init();
  }

  async init() {
    await this.loadTagRegistry();
    this.render();
    this.bindEvents();
  }

  async loadTagRegistry() {
    try {
      // In production, this would load from a JSON file generated from tag_registry.md
      const response = await fetch('/data/tag_registry.json');
      const registry = await response.json();
      
      for (const [tag, data] of Object.entries(registry)) {
        this.tagRegistry.set(tag, {
          tag: tag,
          category: data.category,
          definition: data.definition,
          uiDisplay: data.uiDisplay,
          examples: data.examples || [],
          aliases: data.aliases || [] // Alternative search terms
        });
      }
    } catch (error) {
      console.warn('Could not load tag registry, using fallback data');
      this.loadFallbackRegistry();
    }
  }

  loadFallbackRegistry() {
    // Fallback tag data for development
    const fallbackTags = [
      { tag: 'buff_atk_phys', category: 'buff', uiDisplay: 'Physical Attack Buff', aliases: ['physical buff', 'attack boost'] },
      { tag: 'buff_atk_elem', category: 'buff', uiDisplay: 'Elemental Attack Buff', aliases: ['elemental buff', 'magic boost'] },
      { tag: 'target_ally_all', category: 'target', uiDisplay: 'All Allies', aliases: ['party wide', 'team buff'] },
      { tag: 'heal_hp', category: 'heal', uiDisplay: 'HP Recovery', aliases: ['healing', 'restore hp'] },
      { tag: 'immunity_sleep', category: 'immunity', uiDisplay: 'Sleep Immunity', aliases: ['sleep resist', 'anti sleep'] },
      { tag: 'dmg_fire', category: 'damage', uiDisplay: 'Fire Damage', aliases: ['fire attack', 'flame'] },
      { tag: 'resist_down_fire', category: 'debuff', uiDisplay: 'Fire Resistance Down', aliases: ['fire vuln', 'fire weakness'] }
    ];

    fallbackTags.forEach(tagData => {
      this.tagRegistry.set(tagData.tag, tagData);
    });
  }

  render() {
    const html = `
      <div class="tag-search-system">
        <div class="search-controls">
          <div class="search-input-container">
            <input type="text" 
                   id="tagSearchInput" 
                   class="tag-search-input"
                   placeholder="${this.placeholder}"
                   autocomplete="off">
            <div class="search-mode-toggle">
              <button class="mode-btn ${this.searchMode === 'AND' ? 'active' : ''}" data-mode="AND">AND</button>
              <button class="mode-btn ${this.searchMode === 'OR' ? 'active' : ''}" data-mode="OR">OR</button>
            </div>
          </div>
          
          <div id="tagSuggestions" class="tag-suggestions hidden">
            <!-- Dynamic suggestions appear here -->
          </div>
        </div>

        <div class="selected-tags-container">
          <div id="selectedTags" class="selected-tags">
            <!-- Selected tags appear here -->
          </div>
          ${this.selectedTags.size > 0 ? '<button id="clearAllTags" class="clear-all-btn">Clear All</button>' : ''}
        </div>

        <div class="search-results-info">
          <span id="resultsCount">0</span> results found
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }

  bindEvents() {
    const input = this.container.querySelector('#tagSearchInput');
    const suggestions = this.container.querySelector('#tagSuggestions');
    const selectedTagsContainer = this.container.querySelector('#selectedTags');
    const modeButtons = this.container.querySelectorAll('.mode-btn');

    // Input events
    input.addEventListener('input', (e) => this.handleInput(e.target.value));
    input.addEventListener('focus', () => this.showSuggestions());
    input.addEventListener('blur', () => setTimeout(() => this.hideSuggestions(), 150));
    input.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Mode toggle
    modeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.searchMode = e.target.dataset.mode;
        modeButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.onTagsChange(Array.from(this.selectedTags), this.searchMode);
      });
    });

    // Clear all tags
    const clearBtn = this.container.querySelector('#clearAllTags');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearAllTags());
    }
  }

  handleInput(value) {
    if (value.length < 2) {
      this.hideSuggestions();
      return;
    }

    const suggestions = this.findSuggestions(value);
    this.displaySuggestions(suggestions);
  }

  findSuggestions(query) {
    const normalizedQuery = query.toLowerCase().trim();
    const suggestions = [];

    // Score each tag based on relevance
    for (const [tag, data] of this.tagRegistry) {
      if (this.selectedTags.has(tag)) continue; // Skip already selected tags

      let score = 0;
      let matchType = '';

      // Exact tag name match (highest priority)
      if (tag === normalizedQuery) {
        score = 100;
        matchType = 'exact';
      }
      // Tag starts with query
      else if (tag.startsWith(normalizedQuery)) {
        score = 90;
        matchType = 'starts';
      }
      // Tag contains query
      else if (tag.includes(normalizedQuery)) {
        score = 70;
        matchType = 'contains';
      }
      // UI display name match
      else if (data.uiDisplay.toLowerCase().includes(normalizedQuery)) {
        score = 60;
        matchType = 'display';
      }
      // Alias match
      else if (data.aliases && data.aliases.some(alias => alias.toLowerCase().includes(normalizedQuery))) {
        score = 50;
        matchType = 'alias';
      }

      if (score > 0) {
        suggestions.push({
          tag,
          data,
          score,
          matchType
        });
      }
    }

    // Sort by score (descending) and return top results
    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 8); // Limit to 8 suggestions
  }

  displaySuggestions(suggestions) {
    const container = this.container.querySelector('#tagSuggestions');
    
    if (suggestions.length === 0) {
      this.hideSuggestions();
      return;
    }

    // Group by category for better organization
    const grouped = suggestions.reduce((acc, item) => {
      const category = item.data.category || 'other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});

    let html = '';
    for (const [category, items] of Object.entries(grouped)) {
      html += `<div class="suggestion-category">`;
      html += `<div class="category-header">${this.formatCategoryName(category)}</div>`;
      
      items.forEach(item => {
        html += `
          <div class="suggestion-item" data-tag="${item.tag}">
            <div class="tag-name">${item.data.uiDisplay}</div>
            <div class="tag-technical">${item.tag}</div>
            ${item.data.definition ? `<div class="tag-definition">${item.data.definition}</div>` : ''}
          </div>
        `;
      });
      
      html += `</div>`;
    }

    container.innerHTML = html;
    container.classList.remove('hidden');

    // Bind click events to suggestions
    container.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        this.selectTag(item.dataset.tag);
      });
    });
  }

  formatCategoryName(category) {
    const categoryNames = {
      'buff': 'Buffs',
      'debuff': 'Debuffs', 
      'target': 'Targeting',
      'damage': 'Damage',
      'heal': 'Recovery',
      'immunity': 'Immunity',
      'stat': 'Stats',
      'ailment': 'Status Effects',
      'trigger': 'Triggers',
      'special': 'Special'
    };
    return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
  }

  selectTag(tag) {
    this.selectedTags.add(tag);
    this.updateSelectedTagsDisplay();
    this.clearInput();
    this.hideSuggestions();
    this.onTagsChange(Array.from(this.selectedTags), this.searchMode);
  }

  removeTag(tag) {
    this.selectedTags.delete(tag);
    this.updateSelectedTagsDisplay();
    this.onTagsChange(Array.from(this.selectedTags), this.searchMode);
  }

  clearAllTags() {
    this.selectedTags.clear();
    this.updateSelectedTagsDisplay();
    this.onTagsChange([], this.searchMode);
  }

  updateSelectedTagsDisplay() {
    const container = this.container.querySelector('#selectedTags');
    let html = '';

    this.selectedTags.forEach(tag => {
      const tagData = this.tagRegistry.get(tag);
      const displayName = tagData ? tagData.uiDisplay : tag;
      const category = tagData ? tagData.category : 'unknown';
      
      html += `
        <span class="selected-tag tag-${category}" data-tag="${tag}">
          ${displayName}
          <button class="tag-remove" data-tag="${tag}">×</button>
        </span>
      `;
    });

    container.innerHTML = html;

    // Bind remove events
    container.querySelectorAll('.tag-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeTag(e.target.dataset.tag);
      });
    });

    // Update clear all button visibility
    const clearBtn = this.container.querySelector('#clearAllTags');
    if (clearBtn) {
      clearBtn.style.display = this.selectedTags.size > 0 ? 'block' : 'none';
    }
  }

  handleKeydown(e) {
    const suggestions = this.container.querySelector('#tagSuggestions');
    
    switch (e.key) {
      case 'Escape':
        this.hideSuggestions();
        break;
      case 'Enter':
        e.preventDefault();
        const firstSuggestion = suggestions.querySelector('.suggestion-item');
        if (firstSuggestion) {
          this.selectTag(firstSuggestion.dataset.tag);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.navigateSuggestions('down');
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.navigateSuggestions('up');
        break;
    }
  }

  navigateSuggestions(direction) {
    const suggestions = this.container.querySelectorAll('.suggestion-item');
    const current = this.container.querySelector('.suggestion-item.highlighted');
    
    if (suggestions.length === 0) return;

    let nextIndex = 0;
    if (current) {
      const currentIndex = Array.from(suggestions).indexOf(current);
      nextIndex = direction === 'down' 
        ? (currentIndex + 1) % suggestions.length
        : (currentIndex - 1 + suggestions.length) % suggestions.length;
      current.classList.remove('highlighted');
    }

    suggestions[nextIndex].classList.add('highlighted');
  }

  clearInput() {
    this.container.querySelector('#tagSearchInput').value = '';
  }

  showSuggestions() {
    const input = this.container.querySelector('#tagSearchInput');
    if (input.value.length >= 2) {
      this.handleInput(input.value);
    }
  }

  hideSuggestions() {
    this.container.querySelector('#tagSuggestions').classList.add('hidden');
  }

  // Public API
  getSelectedTags() {
    return Array.from(this.selectedTags);
  }

  setSelectedTags(tags) {
    this.selectedTags = new Set(tags);
    this.updateSelectedTagsDisplay();
  }

  getSearchMode() {
    return this.searchMode;
  }

  setSearchMode(mode) {
    this.searchMode = mode;
    this.container.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TagSearch;
}