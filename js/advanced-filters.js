/**
 * Advanced Filtering System
 * Separate UI for advanced filters with column toggles
 */

class AdvancedFilters {
    constructor() {
        this.isVisible = false;
        this.init();
    }
    
    init() {
        // HTML is now in the page, just setup interactions
        this.syncWithState();
        this.setupEventListeners();
    }
    
    /**
     * Sync UI with centralized state
     */
    syncWithState() {
        if (!window.AppState) return;
        
        // Sync column visibility - default state is core+tiers+notes visible, others hidden
        const columnStates = {
            ownership: false,
            awakening: false, 
            combat: false,
            acquisition: false
        };
        
        // Update column toggle buttons to reflect actual state
        Object.keys(columnStates).forEach(column => {
            const button = document.querySelector(`[data-column="${column}"]`);
            const icon = button?.querySelector('.toggle-icon');
            if (button && icon) {
                const isVisible = columnStates[column];
                button.classList.toggle('active', isVisible);
                icon.textContent = isVisible ? '✓' : '−';
            }
        });
        
        // Sync unreleased filter with state
        const showUnreleased = window.AppState.getState('filters.showUnreleased') || false;
        const unreleasedCheckbox = document.getElementById('showUnreleasedAdvanced');
        if (unreleasedCheckbox) {
            unreleasedCheckbox.checked = showUnreleased;
        }
    }
    
    /**
     * Create the advanced filters UI section
     */
    createAdvancedFiltersUI() {
        const filtersNav = document.querySelector('.filters');
        if (!filtersNav) {
            console.error('Could not find .filters element');
            return;
        }
        console.log('Creating advanced filters UI...');
        
        // Create advanced filters section after the main filters
        const advancedSection = document.createElement('div');
        advancedSection.className = 'advanced-filters-section';
        advancedSection.innerHTML = `
            <div class="advanced-filters-toggle">
                <button id="toggleAdvancedFilters" class="btn btn-outline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z"/>
                    </svg>
                    <span id="advancedFiltersText">Show Advanced Filters</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="dropdown-arrow">
                        <path d="M7,10L12,15L17,10H7Z"/>
                    </svg>
                </button>
            </div>
            
            <div id="advancedFiltersPanel" class="advanced-filters-panel hidden">
                <div class="filters-row">
                    <div class="filter-section">
                        <h4>Column Visibility</h4>
                        <div class="column-toggles">
                            <button class="column-toggle active" data-column="ownership" title="Toggle ownership tracking">
                                <span class="toggle-icon">−</span> 👤 Ownership
                            </button>
                            <button class="column-toggle active" data-column="awakening" title="Toggle awakening stones">
                                <span class="toggle-icon">−</span> 💎 Awakening Stones
                            </button>
                            <button class="column-toggle active" data-column="combat" title="Toggle combat info">
                                <span class="toggle-icon">−</span> ⚔️ Combat Info
                            </button>
                            <button class="column-toggle active" data-column="acquisition" title="Toggle acquisition info">
                                <span class="toggle-icon">−</span> 📍 Acquisition
                            </button>
                        </div>
                    </div>
                    
                    <div class="filter-section">
                        <h4>Multi-Select Filters</h4>
                        <div class="multi-filters">
                            <div class="filter-group-advanced">
                                <label>Star Rating:</label>
                                <div class="checkbox-group">
                                    <label><input type="checkbox" value="3"> 3★</label>
                                    <label><input type="checkbox" value="4"> 4★</label>
                                    <label><input type="checkbox" value="5"> 5★</label>
                                </div>
                            </div>
                            
                            <div class="filter-group-advanced">
                                <label>Job:</label>
                                <div class="checkbox-group" id="jobFilters">
                                    <!-- Populated dynamically -->
                                </div>
                            </div>
                            
                            <div class="filter-group-advanced">
                                <label>Elements:</label>
                                <div class="checkbox-group" id="elementFilters">
                                    <!-- Populated dynamically -->
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="filter-section">
                        <h4>Options</h4>
                        <div class="filter-options">
                            <label class="checkbox-label">
                                <input type="checkbox" id="showUnreleasedAdvanced"> Show Unreleased Characters
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" id="enableGroupingAdvanced" checked> Enable Grouping
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="filters-actions">
                    <button id="applyAdvancedFilters" class="btn btn-primary">Apply Filters</button>
                    <button id="resetAdvancedFilters" class="btn btn-secondary">Reset Advanced</button>
                </div>
            </div>
        `;
        
        // Insert after the main filters nav
        filtersNav.parentNode.insertBefore(advancedSection, filtersNav.nextSibling);
        
        // Populate dynamic filters
        this.populateJobFilters();
        this.populateElementFilters();
    }
    
    /**
     * Populate job filters dynamically
     */
    populateJobFilters() {
        const jobFilters = document.getElementById('jobFilters');
        if (!jobFilters || !window.allCharacters) return;
        
        const jobs = [...new Set(window.allCharacters.map(char => char.job).filter(Boolean))].sort();
        
        jobFilters.innerHTML = jobs.map(job => `
            <label><input type="checkbox" value="${job}"> ${job}</label>
        `).join('');
    }
    
    /**
     * Populate element filters dynamically
     */
    populateElementFilters() {
        const elementFilters = document.getElementById('elementFilters');
        if (!elementFilters || !window.allCharacters) return;
        
        const elements = [...new Set(
            window.allCharacters.flatMap(char => char.elements || [])
        )].sort();
        
        elementFilters.innerHTML = elements.map(element => `
            <label><input type="checkbox" value="${element}"> ${element}</label>
        `).join('');
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Toggle advanced filters
        document.getElementById('toggleAdvancedFilters').addEventListener('click', () => {
            this.toggleAdvancedFilters();
        });
        
        // Column toggles
        document.querySelectorAll('.column-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleColumn(btn.dataset.column, btn);
            });
        });
        
        // Apply filters button removed - filters apply instantly
        
        // Reset advanced filters
        document.getElementById('resetAdvancedFilters').addEventListener('click', () => {
            this.resetAdvancedFilters();
        });
        
        // Unreleased toggle
        document.getElementById('showUnreleasedAdvanced').addEventListener('change', (e) => {
            if (window.AppState) {
                window.AppState.setState('filters.showUnreleased', e.target.checked);
            }
            this.applyAdvancedFilters();
        });
        
        // Grouping toggle
        document.getElementById('enableGroupingAdvanced').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            console.log('Grouping changed to:', enabled);
            window.visualGroupingEnabled = enabled;
            
            // Force re-render immediately
            if (window.renderTable) {
                window.renderTable();
            }
        });
        
        // Multi-select filter changes
        document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.applyAdvancedFilters();
            });
        });
    }
    
    /**
     * Toggle advanced filters panel
     */
    toggleAdvancedFilters() {
        const panel = document.getElementById('advancedFiltersPanel');
        const text = document.getElementById('advancedFiltersText');
        const arrow = document.querySelector('.advanced-filters-toggle .dropdown-arrow');
        
        this.isVisible = !this.isVisible;
        
        if (this.isVisible) {
            panel.classList.remove('hidden');
            text.textContent = 'Hide Advanced Filters';
            arrow.style.transform = 'rotate(180deg)';
        } else {
            panel.classList.add('hidden');
            text.textContent = 'Show Advanced Filters';
            arrow.style.transform = 'rotate(0deg)';
        }
    }
    
    /**
     * Toggle column visibility
     */
    toggleColumn(columnKey, button) {
        const table = document.getElementById('characterTable');
        if (!table) return;
        
        const className = `hide-${columnKey}`;
        const icon = button.querySelector('.toggle-icon');
        
        if (table.classList.contains(className)) {
            // Show column
            table.classList.remove(className);
            button.classList.add('active');
            icon.textContent = '✓';
        } else {
            // Hide column
            table.classList.add(className);
            button.classList.remove('active');
            icon.textContent = '−';
        }
    }
    
    /**
     * Apply all advanced filters
     */
    applyAdvancedFilters() {
        if (!window.AppState || !window.allCharacters) return;
        
        // Get selected filters - fix star rating selector
        const starRatings = Array.from(document.querySelectorAll('input[type="checkbox"][value="3"], input[type="checkbox"][value="4"], input[type="checkbox"][value="5"]'))
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        console.log('Star ratings selected:', starRatings);
            
        const jobs = Array.from(document.querySelectorAll('#jobFilters input[type="checkbox"]'))
            .filter(cb => cb.checked)
            .map(cb => cb.value);
            
        const elements = Array.from(document.querySelectorAll('#elementFilters input[type="checkbox"]'))
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        // Update state with advanced filter selections
        console.log('Setting state - starRating:', starRatings, 'jobs:', jobs, 'elements:', elements);
        window.AppState.setState('filters.starRating', starRatings);
        window.AppState.setState('filters.job', jobs);
        window.AppState.setState('filters.elements', elements);
        
        // Use centralized filtering
        const filtered = window.AppState.applyFilters();
        console.log('Filtered results:', filtered.length, 'characters');
        
        // Update global for backward compatibility
        window.filteredCharacters = filtered;
        
        // Re-render table
        if (window.renderTable) {
            window.renderTable();
        }
        if (window.updateStats) {
            window.updateStats();
        }
    }
    
    /**
     * Reset advanced filters
     */
    resetAdvancedFilters() {
        // Clear all multi-select checkboxes  
        document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        // Reset unreleased to default (false)
        document.getElementById('showUnreleasedAdvanced').checked = false;
        if (window.AppState) {
            window.AppState.setState('filters.showUnreleased', false);
        }
        
        // Reset grouping to default (true)
        document.getElementById('enableGroupingAdvanced').checked = true;
        window.visualGroupingEnabled = true;
        
        // Reset column visibility to default (hide advanced columns)
        const table = document.getElementById('characterTable');
        if (table) {
            table.className = 'hide-ownership hide-awakening hide-combat hide-acquisition';
        }
        
        // Update column toggle buttons to reflect default state
        document.querySelectorAll('.column-toggle').forEach(btn => {
            btn.classList.remove('active');
            btn.querySelector('.toggle-icon').textContent = '−';
        });
        
        // Clear state arrays
        if (window.AppState) {
            window.AppState.setState('filters.starRating', []);
            window.AppState.setState('filters.job', []);
            window.AppState.setState('filters.elements', []);
        }
        
        // Apply filters
        this.applyAdvancedFilters();
    }
}

// Initialize when DOM is ready
console.log('Advanced filters script loaded');

function initAdvancedFilters() {
    console.log('Attempting to initialize advanced filters...');
    const filtersNav = document.querySelector('.filters');
    if (filtersNav) {
        console.log('Found filters nav, creating AdvancedFilters...');
        window.AdvancedFilters = new AdvancedFilters();
    } else {
        console.log('Filters nav not found, retrying in 100ms...');
        setTimeout(initAdvancedFilters, 100);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdvancedFilters);
} else {
    initAdvancedFilters();
}