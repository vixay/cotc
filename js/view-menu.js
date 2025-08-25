/**
 * View Menu System
 * Provides preset view configurations and unified filter controls
 */

class ViewMenuManager {
    constructor() {
        this.currentDropdown = null;
        this.init();
    }
    
    init() {
        this.createViewMenu();
        this.createFilterToggle();
        this.setupEventListeners();
    }
    
    /**
     * Create the main view menu
     */
    createViewMenu() {
        // Find the action group in the filters
        const actionGroup = document.querySelector('.action-group');
        if (!actionGroup) return;
        
        // Create view menu dropdown
        const viewMenuContainer = document.createElement('div');
        viewMenuContainer.className = 'view-menu-container';
        viewMenuContainer.innerHTML = `
            <button id="viewMenuButton" class="btn btn-secondary view-menu-btn" title="Switch view">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,3H11V11H3V3M13,3H21V11H13V3M3,13H11V21H3V13M13,13H21V21H13V13Z"/>
                </svg>
                <span class="view-name">Basic View</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="dropdown-arrow">
                    <path d="M7,10L12,15L17,10H7Z"/>
                </svg>
            </button>
            
            <div id="viewMenuDropdown" class="view-menu-dropdown hidden">
                <div class="view-menu-header">
                    <h3>Views</h3>
                    <p>Preset configurations for different use cases</p>
                </div>
                <div class="view-menu-items">
                    ${this.generateViewMenuItems()}
                </div>
                <div class="view-menu-footer">
                    <button id="resetAllButton" class="btn btn-outline btn-sm">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
                        </svg>
                        Reset All
                    </button>
                </div>
            </div>
        `;
        
        // Insert before the theme toggle
        const themeToggle = actionGroup.querySelector('#themeToggle');
        actionGroup.insertBefore(viewMenuContainer, themeToggle);
    }
    
    /**
     * Generate view menu items HTML
     */
    generateViewMenuItems() {
        const views = window.AppState.views;
        return Object.entries(views).map(([key, view]) => `
            <div class="view-menu-item" data-view="${key}">
                <div class="view-item-header">
                    <span class="view-item-name">${view.name}</span>
                    <span class="view-item-status ${window.AppState.getState('ui.currentView') === key ? 'active' : ''}">
                        ${window.AppState.getState('ui.currentView') === key ? '✓' : ''}
                    </span>
                </div>
                <div class="view-item-description">${view.description}</div>
            </div>
        `).join('');
    }
    
    /**
     * Create the unified filter toggle button
     */
    createFilterToggle() {
        const filterGroup = document.querySelector('.filter-group');
        if (!filterGroup) return;
        
        // Remove the existing column controls (we'll replace with our system)
        const existingColumnControls = document.querySelector('.column-controls');
        if (existingColumnControls) {
            existingColumnControls.remove();
        }
        
        // Create new unified controls
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'unified-controls';
        controlsContainer.innerHTML = `
            <div class="control-section">
                <div class="control-group">
                    <span class="control-label">Display:</span>
                    <button id="toggleAllFilters" class="btn btn-outline btn-sm">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z"/>
                        </svg>
                        <span id="filterToggleText">Show All Filters</span>
                    </button>
                    <button id="toggleGrouping" class="btn btn-outline btn-sm">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3,3H21V5H3V3M3,7H15V9H3V7M3,11H21V13H3V11M3,15H15V17H3V15M3,19H21V21H3V19Z"/>
                        </svg>
                        <span id="groupingToggleText">Disable Grouping</span>
                    </button>
                </div>
            </div>
            
            <div class="control-section column-toggles ${window.AppState.getState('ui.showAllFilters') ? 'visible' : 'hidden'}">
                <div class="control-group">
                    <span class="control-label">Columns:</span>
                    ${this.generateColumnToggles()}
                </div>
            </div>
            
            <div class="control-section filter-controls ${window.AppState.getState('ui.showAllFilters') ? 'visible' : 'hidden'}">
                <div class="control-group">
                    <span class="control-label">Advanced:</span>
                    <label class="toggle-label">
                        <input type="checkbox" id="showUnreleasedToggle" ${window.AppState.getState('filters.showUnreleased') ? 'checked' : ''}>
                        <span>Show Unreleased</span>
                    </label>
                </div>
            </div>
        `;
        
        // Insert after the main filter group
        filterGroup.parentNode.insertBefore(controlsContainer, filterGroup.nextSibling);
    }
    
    /**
     * Generate column toggle buttons
     */
    generateColumnToggles() {
        const columns = [
            { key: 'ownership', label: 'Ownership', icon: '👤' },
            { key: 'awakening', label: 'Awakening Stones', icon: '💎' },
            { key: 'combat', label: 'Combat Info', icon: '⚔️' },
            { key: 'acquisition', label: 'Acquisition', icon: '📍' }
        ];
        
        return columns.map(col => {
            const isVisible = window.AppState.getState(`ui.columns.${col.key}`);
            return `
                <button class="column-toggle btn btn-outline btn-sm ${isVisible ? 'active' : ''}" 
                        data-column="${col.key}" 
                        title="Toggle ${col.label}">
                    <span class="toggle-icon">${isVisible ? '✓' : '−'}</span>
                    ${col.icon} ${col.label}
                </button>
            `;
        }).join('');
    }
    
    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // View menu button
        document.getElementById('viewMenuButton').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleViewMenu();
        });
        
        // View menu items
        document.addEventListener('click', (e) => {
            const viewItem = e.target.closest('.view-menu-item');
            if (viewItem) {
                const viewName = viewItem.dataset.view;
                this.selectView(viewName);
                this.hideViewMenu();
            }
        });
        
        // Reset button
        document.getElementById('resetAllButton').addEventListener('click', (e) => {
            e.stopPropagation();
            this.resetAll();
            this.hideViewMenu();
        });
        
        // Filter toggle
        document.getElementById('toggleAllFilters').addEventListener('click', () => {
            this.toggleAllFilters();
        });
        
        // Grouping toggle
        document.getElementById('toggleGrouping').addEventListener('click', () => {
            this.toggleGrouping();
        });
        
        // Column toggles
        document.querySelectorAll('.column-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const column = btn.dataset.column;
                this.toggleColumn(column);
            });
        });
        
        // Unreleased toggle
        document.getElementById('showUnreleasedToggle').addEventListener('change', (e) => {
            window.AppState.setState('filters.showUnreleased', e.target.checked);
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.view-menu-container')) {
                this.hideViewMenu();
            }
        });
        
        // Listen to state changes to update UI
        window.AppState.subscribe('ui.currentView', (viewName) => {
            this.updateViewButton(viewName);
            this.updateViewMenuItems();
        });
        
        window.AppState.subscribe('ui.showAllFilters', (show) => {
            this.updateFilterVisibility(show);
        });
        
        window.AppState.subscribe('ui.grouping', (grouping) => {
            this.updateGroupingButton(grouping);
        });
        
        window.AppState.subscribe('ui.columns', () => {
            this.updateColumnButtons();
        });
        
        window.AppState.subscribe('*', () => {
            // Re-render table when any state changes
            if (window.renderTable) {
                window.renderTable();
            }
            if (window.updateStats) {
                window.updateStats();
            }
        });
    }
    
    /**
     * Toggle view menu dropdown
     */
    toggleViewMenu() {
        const dropdown = document.getElementById('viewMenuDropdown');
        dropdown.classList.toggle('hidden');
    }
    
    /**
     * Hide view menu dropdown
     */
    hideViewMenu() {
        const dropdown = document.getElementById('viewMenuDropdown');
        dropdown.classList.add('hidden');
    }
    
    /**
     * Select a view
     */
    selectView(viewName) {
        window.AppState.applyView(viewName);
    }
    
    /**
     * Reset all filters and UI state
     */
    resetAll() {
        window.AppState.reset();
    }
    
    /**
     * Toggle all filters visibility
     */
    toggleAllFilters() {
        const current = window.AppState.getState('ui.showAllFilters');
        window.AppState.setState('ui.showAllFilters', !current);
    }
    
    /**
     * Toggle grouping
     */
    toggleGrouping() {
        const current = window.AppState.getState('ui.grouping.enabled');
        window.AppState.setState('ui.grouping.enabled', !current);
    }
    
    /**
     * Toggle column visibility
     */
    toggleColumn(columnKey) {
        const current = window.AppState.getState(`ui.columns.${columnKey}`);
        window.AppState.setState(`ui.columns.${columnKey}`, !current);
    }
    
    /**
     * Update view button display
     */
    updateViewButton(viewName) {
        const view = window.AppState.views[viewName];
        if (view) {
            document.querySelector('.view-name').textContent = view.name;
        }
    }
    
    /**
     * Update view menu items active state
     */
    updateViewMenuItems() {
        const currentView = window.AppState.getState('ui.currentView');
        document.querySelectorAll('.view-menu-item').forEach(item => {
            const status = item.querySelector('.view-item-status');
            const isActive = item.dataset.view === currentView;
            status.classList.toggle('active', isActive);
            status.textContent = isActive ? '✓' : '';
        });
    }
    
    /**
     * Update filter controls visibility
     */
    updateFilterVisibility(show) {
        const sections = document.querySelectorAll('.column-toggles, .filter-controls');
        sections.forEach(section => {
            section.classList.toggle('visible', show);
            section.classList.toggle('hidden', !show);
        });
        
        const toggleText = document.getElementById('filterToggleText');
        toggleText.textContent = show ? 'Hide All Filters' : 'Show All Filters';
        
        // Update table column visibility
        this.updateTableColumns();
    }
    
    /**
     * Update grouping button
     */
    updateGroupingButton(groupingState) {
        const toggleText = document.getElementById('groupingToggleText');
        toggleText.textContent = groupingState.enabled ? 'Disable Grouping' : 'Enable Grouping';
    }
    
    /**
     * Update column toggle buttons
     */
    updateColumnButtons() {
        document.querySelectorAll('.column-toggle').forEach(btn => {
            const column = btn.dataset.column;
            const isVisible = window.AppState.getState(`ui.columns.${column}`);
            const icon = btn.querySelector('.toggle-icon');
            
            btn.classList.toggle('active', isVisible);
            icon.textContent = isVisible ? '✓' : '−';
        });
        
        this.updateTableColumns();
    }
    
    /**
     * Update table column visibility classes
     */
    updateTableColumns() {
        const table = document.getElementById('characterTable');
        if (!table) return;
        
        const columns = window.AppState.getState('ui.columns');
        
        // Update table classes based on column visibility
        Object.keys(columns).forEach(key => {
            const className = `hide-${key}`;
            if (columns[key]) {
                table.classList.remove(className);
            } else {
                table.classList.add(className);
            }
        });
    }
}

// Initialize when DOM is ready - DISABLED FOR NOW
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', () => {
//         window.ViewMenu = new ViewMenuManager();
//     });
// } else {
//     window.ViewMenu = new ViewMenuManager();
// }

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ViewMenuManager;
}