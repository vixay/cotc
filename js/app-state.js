/**
 * Centralized State Management for COTC Application
 * Provides single source of truth for all app state and handles system coordination
 */

class AppStateManager {
    constructor() {
        this.state = {
            // Data
            characters: [],
            filteredCharacters: [],
            userCharacterData: {},
            
            // Filters
            filters: {
                search: '',
                a4Tier: '',
                ultPriority: '',
                freeGacha: '',
                ownership: '',
                showUnreleased: false,
                // Column filters
                starRating: [],
                job: [],
                roles: [],
                elements: [],
                weapons: [],
                continent: [],
                obtainedFrom: [],
                tierRating: [],
                a4TierMulti: []
            },
            
            // UI State
            ui: {
                currentView: 'basic',
                sorting: {
                    column: null,
                    direction: 'asc'
                },
                grouping: {
                    enabled: true,
                    groupBy: 'overallTier'
                },
                columns: {
                    core: true,
                    tiers: true,
                    ownership: false,
                    awakening: false,
                    combat: false,
                    acquisition: false,
                    notes: true
                },
                showAllFilters: false,
                theme: 'dark'
            }
        };
        
        this.listeners = new Map();
        this.views = this.initializeViews();
        
        // Load persisted state
        this.loadPersistedState();
    }
    
    /**
     * Initialize predefined views
     */
    initializeViews() {
        return {
            basic: {
                name: 'Basic View',
                description: 'Simple character list with essential info',
                state: {
                    ui: {
                        grouping: { enabled: true, groupBy: 'overallTier' },
                        columns: {
                            core: true, tiers: true, ownership: false,
                            awakening: false, combat: false, acquisition: false, notes: true
                        },
                        showAllFilters: false
                    },
                    filters: { showUnreleased: false }
                }
            },
            
            advanced: {
                name: 'Advanced Analysis',
                description: 'Full data with all columns and filters',
                state: {
                    ui: {
                        grouping: { enabled: false, groupBy: null },
                        columns: {
                            core: true, tiers: true, ownership: true,
                            awakening: true, combat: true, acquisition: true, notes: true
                        },
                        showAllFilters: true
                    },
                    filters: { showUnreleased: true }
                }
            },
            
            metaAnalysis: {
                name: 'Meta Analysis',
                description: 'Focus on tier ratings and competitive viability',
                state: {
                    ui: {
                        grouping: { enabled: true, groupBy: 'overallTier' },
                        columns: {
                            core: true, tiers: true, ownership: false,
                            awakening: true, combat: true, acquisition: false, notes: true
                        },
                        showAllFilters: false
                    },
                    filters: { 
                        showUnreleased: false,
                        tierRating: ['S+', 'S', 'A'] // Only show top tiers
                    }
                }
            },
            
            f2pGuide: {
                name: 'F2P Guide',
                description: 'Focus on free characters and resource management',
                state: {
                    ui: {
                        grouping: { enabled: true, groupBy: 'ultPriority' },
                        columns: {
                            core: true, tiers: true, ownership: true,
                            awakening: true, combat: false, acquisition: false, notes: true
                        },
                        showAllFilters: false
                    },
                    filters: { 
                        showUnreleased: false,
                        freeGacha: 'free' // Only free characters
                    }
                }
            },
            
            collectionTracker: {
                name: 'Collection Tracker',
                description: 'Track your character collection progress',
                state: {
                    ui: {
                        grouping: { enabled: true, groupBy: 'continent' },
                        columns: {
                            core: true, tiers: false, ownership: true,
                            awakening: false, combat: false, acquisition: true, notes: false
                        },
                        showAllFilters: false
                    },
                    filters: { showUnreleased: true }
                }
            },
            
            teamBuilder: {
                name: 'Team Builder',
                description: 'Focus on combat roles and synergies',
                state: {
                    ui: {
                        grouping: { enabled: true, groupBy: 'job' },
                        columns: {
                            core: true, tiers: true, ownership: true,
                            awakening: false, combat: true, acquisition: false, notes: false
                        },
                        showAllFilters: true
                    },
                    filters: { showUnreleased: false }
                }
            }
        };
    }
    
    /**
     * Subscribe to state changes
     */
    subscribe(path, callback) {
        if (!this.listeners.has(path)) {
            this.listeners.set(path, new Set());
        }
        this.listeners.get(path).add(callback);
        
        return () => {
            this.listeners.get(path)?.delete(callback);
        };
    }
    
    /**
     * Update state and notify listeners
     */
    setState(path, value) {
        const pathArray = path.split('.');
        let current = this.state;
        
        // Navigate to parent object
        for (let i = 0; i < pathArray.length - 1; i++) {
            if (!current[pathArray[i]]) {
                current[pathArray[i]] = {};
            }
            current = current[pathArray[i]];
        }
        
        // Set the value
        const lastKey = pathArray[pathArray.length - 1];
        const oldValue = current[lastKey];
        current[lastKey] = value;
        
        // Notify listeners
        this.notifyListeners(path, value, oldValue);
        
        // Save to localStorage for persistence
        this.savePersistedState();
    }
    
    /**
     * Get state value
     */
    getState(path) {
        const pathArray = path.split('.');
        let current = this.state;
        
        for (const key of pathArray) {
            if (current === null || current === undefined) {
                return undefined;
            }
            current = current[key];
        }
        
        return current;
    }
    
    /**
     * Apply a view configuration
     */
    applyView(viewName) {
        const view = this.views[viewName];
        if (!view) {
            console.warn(`View "${viewName}" not found`);
            return;
        }
        
        // Merge view state into current state
        this.mergeState(view.state);
        this.setState('ui.currentView', viewName);
        
        console.log(`Applied view: ${view.name}`);
    }
    
    /**
     * Merge partial state into current state
     */
    mergeState(partialState) {
        this.deepMerge(this.state, partialState);
        
        // Notify all listeners of the bulk change
        this.notifyListeners('*', this.state);
        this.savePersistedState();
    }
    
    /**
     * Deep merge utility
     */
    deepMerge(target, source) {
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key]) target[key] = {};
                this.deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }
    
    /**
     * Notify listeners of state changes
     */
    notifyListeners(path, newValue, oldValue) {
        // Notify specific path listeners
        const pathListeners = this.listeners.get(path);
        if (pathListeners) {
            pathListeners.forEach(callback => {
                try {
                    callback(newValue, oldValue, path);
                } catch (error) {
                    console.error(`Error in listener for ${path}:`, error);
                }
            });
        }
        
        // Notify wildcard listeners
        const wildcardListeners = this.listeners.get('*');
        if (wildcardListeners && path !== '*') {
            wildcardListeners.forEach(callback => {
                try {
                    callback(this.state, path);
                } catch (error) {
                    console.error(`Error in wildcard listener:`, error);
                }
            });
        }
    }
    
    /**
     * Apply all filters and return filtered characters
     */
    applyFilters() {
        const filters = this.state.filters;
        const characters = this.state.characters;
        
        const filtered = characters.filter(char => {
            // Unreleased filter
            if (!filters.showUnreleased) {
                const releaseDate = char.glReleaseDate;
                if (!releaseDate || new Date(releaseDate) > new Date()) {
                    return false;
                }
            }
            
            // Search filter
            if (filters.search && !char.name.toLowerCase().includes(filters.search.toLowerCase())) {
                return false;
            }
            
            // A4 tier filter (single)
            if (filters.a4Tier && (char.a4Tier || 'Not Listed') !== filters.a4Tier) {
                return false;
            }
            
            // Ultimate priority filter
            if (filters.ultPriority && char.ultPriority !== filters.ultPriority) {
                return false;
            }
            
            // Free/Gacha filter
            if (filters.freeGacha === 'free' && !char.isFree) return false;
            if (filters.freeGacha === 'gacha' && char.isFree) return false;
            
            // Ownership filter
            const userData = this.state.userCharacterData[char.id] || {};
            const isOwned = userData.owned || false;
            if (filters.ownership === 'owned' && !isOwned) return false;
            if (filters.ownership === 'not-owned' && isOwned) return false;
            
            // Multi-select filters
            if (filters.starRating.length > 0 && !filters.starRating.includes(char.starRating?.toString())) {
                return false;
            }
            
            if (filters.job.length > 0 && (!char.job || !filters.job.includes(char.job))) {
                return false;
            }
            
            if (filters.roles.length > 0) {
                const hasRole = (char.roles?.primary && filters.roles.includes(char.roles.primary)) ||
                               (char.roles?.secondary && filters.roles.includes(char.roles.secondary));
                if (!hasRole) return false;
            }
            
            if (filters.elements.length > 0) {
                if (!char.elements || !char.elements.some(el => filters.elements.includes(el))) {
                    return false;
                }
            }
            
            if (filters.weapons.length > 0) {
                if (!char.weapons || !char.weapons.some(w => filters.weapons.includes(w))) {
                    return false;
                }
            }
            
            if (filters.continent.length > 0) {
                if (!char.continent || !filters.continent.includes(char.continent)) {
                    return false;
                }
            }
            
            if (filters.obtainedFrom.length > 0) {
                if (!char.obtainedFrom || !filters.obtainedFrom.includes(char.obtainedFrom)) {
                    return false;
                }
            }
            
            if (filters.tierRating.length > 0) {
                const overallTier = char.tierRatings?.gl?.tier;
                if (!overallTier || !filters.tierRating.includes(overallTier)) {
                    return false;
                }
            }
            
            if (filters.a4TierMulti.length > 0) {
                if (!char.a4Tier || !filters.a4TierMulti.includes(char.a4Tier)) {
                    return false;
                }
            }
            
            return true;
        });
        
        this.setState('filteredCharacters', filtered);
        return filtered;
    }
    
    /**
     * Save state to localStorage
     */
    savePersistedState() {
        try {
            const persistedState = {
                filters: this.state.filters,
                ui: this.state.ui,
                userCharacterData: this.state.userCharacterData
            };
            localStorage.setItem('cotc-app-state', JSON.stringify(persistedState));
        } catch (error) {
            console.warn('Failed to save state to localStorage:', error);
        }
    }
    
    /**
     * Load state from localStorage
     */
    loadPersistedState() {
        try {
            const saved = localStorage.getItem('cotc-app-state');
            if (saved) {
                const persistedState = JSON.parse(saved);
                this.deepMerge(this.state, persistedState);
            }
        } catch (error) {
            console.warn('Failed to load state from localStorage:', error);
        }
    }
    
    /**
     * Reset to default state
     */
    reset() {
        // Clear localStorage
        localStorage.removeItem('cotc-app-state');
        
        // Reset to basic view
        this.applyView('basic');
        
        // Clear user data
        this.setState('userCharacterData', {});
        
        // Clear all filters
        const defaultFilters = {
            search: '', a4Tier: '', ultPriority: '', freeGacha: '', ownership: '',
            showUnreleased: false, starRating: [], job: [], roles: [], elements: [],
            weapons: [], continent: [], obtainedFrom: [], tierRating: [], a4TierMulti: []
        };
        
        Object.keys(defaultFilters).forEach(key => {
            this.setState(`filters.${key}`, defaultFilters[key]);
        });
    }
}

// Create global instance
window.AppState = new AppStateManager();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppStateManager;
}