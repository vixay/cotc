// Column-based filtering system for COTC table
// Provides floating dropdown filters for each column with multi-select capability

// Global filter state
window.activeFilters = {
    starRating: [],
    job: [],
    roles: [],
    elements: [],
    weapons: [],
    continent: [],
    obtainedFrom: [],
    tierRating: [],
    a4Tier: [],
    showUnreleased: false // Default to hiding unreleased characters
};

// Filter dropdown component
class FilterDropdown {
    constructor(columnId, filterType, options) {
        this.columnId = columnId;
        this.filterType = filterType;
        this.options = options;
        this.isOpen = false;
        this.dropdown = null;
        this.headerElement = null;
    }

    init() {
        // Find the column header
        this.headerElement = document.querySelector(`th[data-filter="${this.filterType}"]`);
        if (!this.headerElement) return;

        // Add filter indicator
        this.addFilterIndicator();

        // Add click handler
        this.headerElement.addEventListener('click', (e) => {
            if (e.target.closest('.sort-indicator')) return; // Don't interfere with sorting
            e.stopPropagation();
            this.toggle();
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.headerElement.contains(e.target) && !this.dropdown?.contains(e.target)) {
                this.close();
            }
        });
    }

    addFilterIndicator() {
        if (!this.headerElement.querySelector('.filter-indicator')) {
            const indicator = document.createElement('span');
            indicator.className = 'filter-indicator';
            indicator.innerHTML = '▼';
            this.headerElement.appendChild(indicator);
        }
        this.updateFilterBadge();
    }

    updateFilterBadge() {
        let badge = this.headerElement.querySelector('.filter-badge');
        const activeCount = activeFilters[this.filterType]?.length || 0;

        if (activeCount > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'filter-badge';
                this.headerElement.appendChild(badge);
            }
            badge.textContent = activeCount;
        } else if (badge) {
            badge.remove();
        }
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        // Close any other open dropdowns
        document.querySelectorAll('.filter-dropdown').forEach(d => d.remove());

        this.dropdown = this.createDropdown();
        document.body.appendChild(this.dropdown);
        this.positionDropdown();
        this.isOpen = true;

        // Add active class to header
        this.headerElement.classList.add('filter-active');
    }

    close() {
        if (this.dropdown) {
            this.dropdown.remove();
            this.dropdown = null;
        }
        this.isOpen = false;
        this.headerElement.classList.remove('filter-active');
    }

    createDropdown() {
        const dropdown = document.createElement('div');
        dropdown.className = 'filter-dropdown';
        dropdown.innerHTML = `
            <div class="filter-header">
                <span class="filter-title">Filter by ${this.getFilterTitle()}</span>
                <button class="filter-clear-btn" title="Clear filter">Clear</button>
            </div>
            <div class="filter-search">
                <input type="text" placeholder="Search..." class="filter-search-input">
            </div>
            <div class="filter-options">
                <label class="filter-option">
                    <input type="checkbox" class="filter-select-all">
                    <span>Select All</span>
                </label>
                <hr class="filter-divider">
                ${this.createOptionsHTML()}
            </div>
            <div class="filter-footer">
                <button class="filter-apply-btn">Apply</button>
                <button class="filter-cancel-btn">Cancel</button>
            </div>
        `;

        // Set up event handlers
        this.setupDropdownEvents(dropdown);

        return dropdown;
    }

    createOptionsHTML() {
        return this.options.map(option => {
            const isChecked = activeFilters[this.filterType].includes(option.value);
            const count = option.count || '';
            return `
                <label class="filter-option">
                    <input type="checkbox" value="${option.value}" ${isChecked ? 'checked' : ''}>
                    <span>${option.label}</span>
                    ${count ? `<span class="filter-count">(${count})</span>` : ''}
                </label>
            `;
        }).join('');
    }

    setupDropdownEvents(dropdown) {
        // Select All checkbox
        const selectAll = dropdown.querySelector('.filter-select-all');
        const checkboxes = dropdown.querySelectorAll('.filter-option input[type="checkbox"]:not(.filter-select-all)');

        selectAll.addEventListener('change', (e) => {
            checkboxes.forEach(cb => cb.checked = e.target.checked);
        });

        // Update Select All state when individual checkboxes change
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                const allChecked = Array.from(checkboxes).every(c => c.checked);
                const someChecked = Array.from(checkboxes).some(c => c.checked);
                selectAll.checked = allChecked;
                selectAll.indeterminate = someChecked && !allChecked;
            });
        });

        // Search functionality
        const searchInput = dropdown.querySelector('.filter-search-input');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            dropdown.querySelectorAll('.filter-option:not(:first-child)').forEach(option => {
                const label = option.textContent.toLowerCase();
                option.style.display = label.includes(searchTerm) ? '' : 'none';
            });
        });

        // Apply button
        dropdown.querySelector('.filter-apply-btn').addEventListener('click', () => {
            this.applyFilter(dropdown);
        });

        // Cancel button
        dropdown.querySelector('.filter-cancel-btn').addEventListener('click', () => {
            this.close();
        });

        // Clear button
        dropdown.querySelector('.filter-clear-btn').addEventListener('click', () => {
            checkboxes.forEach(cb => cb.checked = false);
            selectAll.checked = false;
            this.applyFilter(dropdown);
        });
    }

    applyFilter(dropdown) {
        const checkboxes = dropdown.querySelectorAll('.filter-option input[type="checkbox"]:not(.filter-select-all)');
        activeFilters[this.filterType] = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        this.updateFilterBadge();
        this.close();
        
        // Trigger table refresh
        if (window.applyColumnFilters) {
            window.applyColumnFilters();
        }

        // Save to localStorage
        saveFilterState();
    }

    positionDropdown() {
        const rect = this.headerElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const dropdownHeight = this.dropdown.offsetHeight;

        // Position below header by default
        let top = rect.bottom + 5;
        let left = rect.left;

        // If not enough space below, position above
        if (top + dropdownHeight > viewportHeight - 20) {
            top = rect.top - dropdownHeight - 5;
        }

        // Ensure dropdown doesn't go off-screen horizontally
        const dropdownWidth = this.dropdown.offsetWidth;
        if (left + dropdownWidth > window.innerWidth - 20) {
            left = window.innerWidth - dropdownWidth - 20;
        }

        this.dropdown.style.position = 'fixed';
        this.dropdown.style.top = `${top}px`;
        this.dropdown.style.left = `${left}px`;
        this.dropdown.style.zIndex = '10000';
    }

    getFilterTitle() {
        const titles = {
            starRating: 'Star Rating',
            job: 'Job',
            roles: 'Role',
            elements: 'Elements',
            weapons: 'Weapons',
            continent: 'Continent',
            obtainedFrom: 'Obtained From',
            tierRating: 'Overall Tier',
            a4Tier: 'A4 Tier'
        };
        return titles[this.filterType] || this.filterType;
    }
}

// Initialize all filter dropdowns
function initializeColumnFilters() {
    // Get unique values from data for each filter type
    const filterOptions = getFilterOptions();

    // Create filter dropdowns for each filterable column
    const filters = [
        { type: 'starRating', options: filterOptions.starRating },
        { type: 'job', options: filterOptions.job },
        { type: 'roles', options: filterOptions.roles },
        { type: 'elements', options: filterOptions.elements },
        { type: 'weapons', options: filterOptions.weapons },
        { type: 'continent', options: filterOptions.continent },
        { type: 'obtainedFrom', options: filterOptions.obtainedFrom },
        { type: 'tierRating', options: filterOptions.tierRating },
        { type: 'a4Tier', options: filterOptions.a4Tier }
    ];

    filters.forEach(({ type, options }) => {
        const filter = new FilterDropdown(type, type, options);
        filter.init();
    });

    // Load saved filter state
    loadFilterState();

    // Add unreleased toggle to advanced section
    addUnreleasedToggle();
}

// Get filter options from character data
function getFilterOptions() {
    const options = {
        starRating: [],
        job: [],
        roles: [],
        elements: [],
        weapons: [],
        continent: [],
        obtainedFrom: [],
        tierRating: [],
        a4Tier: []
    };

    // Count occurrences
    const counts = {
        starRating: {},
        job: {},
        roles: {},
        elements: {},
        weapons: {},
        continent: {},
        obtainedFrom: {},
        tierRating: {},
        a4Tier: {}
    };

    allCharacters.forEach(char => {
        // Star Rating
        if (char.starRating) {
            counts.starRating[char.starRating] = (counts.starRating[char.starRating] || 0) + 1;
        }

        // Job
        if (char.job) {
            counts.job[char.job] = (counts.job[char.job] || 0) + 1;
        }

        // Roles
        if (char.roles?.primary) {
            counts.roles[char.roles.primary] = (counts.roles[char.roles.primary] || 0) + 1;
        }
        if (char.roles?.secondary) {
            counts.roles[char.roles.secondary] = (counts.roles[char.roles.secondary] || 0) + 1;
        }

        // Elements
        if (char.elements) {
            char.elements.forEach(element => {
                counts.elements[element] = (counts.elements[element] || 0) + 1;
            });
        }

        // Weapons
        if (char.weapons) {
            char.weapons.forEach(weapon => {
                counts.weapons[weapon] = (counts.weapons[weapon] || 0) + 1;
            });
        }

        // Continent
        if (char.continent) {
            counts.continent[char.continent] = (counts.continent[char.continent] || 0) + 1;
        }

        // Obtained From
        if (char.obtainedFrom) {
            counts.obtainedFrom[char.obtainedFrom] = (counts.obtainedFrom[char.obtainedFrom] || 0) + 1;
        }

        // Overall Tier
        const overallTier = char.tierRatings?.gl?.tier;
        if (overallTier) {
            counts.tierRating[overallTier] = (counts.tierRating[overallTier] || 0) + 1;
        }

        // A4 Tier
        if (char.a4Tier) {
            counts.a4Tier[char.a4Tier] = (counts.a4Tier[char.a4Tier] || 0) + 1;
        }
    });

    // Convert to options format
    options.starRating = [3, 4, 5].map(stars => ({
        value: stars.toString(),
        label: '★'.repeat(stars),
        count: counts.starRating[stars] || 0
    }));

    // Job options in specific order
    const jobOrder = ['Warrior', 'Hunter', 'Cleric', 'Scholar', 'Dancer', 'Merchant', 'Apothecary', 'Thief'];
    options.job = jobOrder.map(job => ({
        value: job,
        label: job,
        count: counts.job[job] || 0
    }));

    // Role options
    const roleOrder = ['DPS', 'Buffer', 'Debuffer', 'Healer', 'Tank', 'Support'];
    options.roles = roleOrder.map(role => ({
        value: role,
        label: role,
        count: counts.roles[role] || 0
    })).filter(opt => opt.count > 0);

    // Tier options
    const tierOrder = ['S+', 'S', 'A', 'B', 'C', 'D'];
    options.tierRating = tierOrder.map(tier => ({
        value: tier,
        label: tier,
        count: counts.tierRating[tier] || 0
    })).filter(opt => opt.count > 0);

    options.a4Tier = tierOrder.map(tier => ({
        value: tier,
        label: tier,
        count: counts.a4Tier[tier] || 0
    })).filter(opt => opt.count > 0);

    // Sort other options alphabetically
    ['elements', 'weapons', 'continent', 'obtainedFrom'].forEach(type => {
        options[type] = Object.keys(counts[type])
            .sort()
            .map(value => ({
                value: value,
                label: value,
                count: counts[type][value]
            }));
    });

    return options;
}

// Add unreleased characters toggle
function addUnreleasedToggle() {
    const filterGroup = document.querySelector('.filter-group');
    if (!filterGroup) return;

    // Create advanced filters section
    const advancedSection = document.createElement('div');
    advancedSection.className = 'advanced-filters';
    advancedSection.innerHTML = `
        <label class="unreleased-toggle">
            <input type="checkbox" id="showUnreleased" ${window.activeFilters.showUnreleased ? 'checked' : ''}>
            <span>Show Unreleased Characters</span>
        </label>
    `;

    filterGroup.appendChild(advancedSection);

    // Add event handler
    document.getElementById('showUnreleased').addEventListener('change', (e) => {
        window.activeFilters.showUnreleased = e.target.checked;
        saveFilterState();
        // Trigger main filtering system instead
        if (window.applyFilters) {
            window.applyFilters();
        } else {
            // Fallback: trigger search which re-filters everything
            const searchEvent = new Event('input');
            document.getElementById('searchBox').dispatchEvent(searchEvent);
        }
    });
}

// Apply all active filters
function applyColumnFilters() {
    // Get base filtered characters from existing filters
    let filtered = filteredCharacters;

    // Apply column filters
    filtered = filtered.filter(char => {
        // Check unreleased filter
        if (!window.activeFilters.showUnreleased) {
            const releaseDate = char.glReleaseDate;
            if (!releaseDate || new Date(releaseDate) > new Date()) {
                return false;
            }
        }

        // Star Rating filter
        if (window.activeFilters.starRating.length > 0) {
            if (!window.activeFilters.starRating.includes(char.starRating?.toString())) {
                return false;
            }
        }

        // Job filter
        if (window.activeFilters.job.length > 0) {
            if (!char.job || !window.activeFilters.job.includes(char.job)) {
                return false;
            }
        }

        // Role filter (check both primary and secondary)
        if (window.activeFilters.roles.length > 0) {
            const hasRole = (char.roles?.primary && window.activeFilters.roles.includes(char.roles.primary)) ||
                           (char.roles?.secondary && window.activeFilters.roles.includes(char.roles.secondary));
            if (!hasRole) {
                return false;
            }
        }

        // Elements filter (character must have at least one matching element)
        if (window.activeFilters.elements.length > 0) {
            if (!char.elements || !char.elements.some(el => window.activeFilters.elements.includes(el))) {
                return false;
            }
        }

        // Weapons filter (character must have at least one matching weapon)
        if (window.activeFilters.weapons.length > 0) {
            if (!char.weapons || !char.weapons.some(w => window.activeFilters.weapons.includes(w))) {
                return false;
            }
        }

        // Continent filter
        if (window.activeFilters.continent.length > 0) {
            if (!char.continent || !window.activeFilters.continent.includes(char.continent)) {
                return false;
            }
        }

        // Obtained From filter
        if (window.activeFilters.obtainedFrom.length > 0) {
            if (!char.obtainedFrom || !window.activeFilters.obtainedFrom.includes(char.obtainedFrom)) {
                return false;
            }
        }

        // Overall Tier filter
        if (window.activeFilters.tierRating.length > 0) {
            const overallTier = char.tierRatings?.gl?.tier;
            if (!overallTier || !window.activeFilters.tierRating.includes(overallTier)) {
                return false;
            }
        }

        // A4 Tier filter
        if (window.activeFilters.a4Tier.length > 0) {
            if (!char.a4Tier || !window.activeFilters.a4Tier.includes(char.a4Tier)) {
                return false;
            }
        }

        return true;
    });

    // Update filtered characters and re-render
    filteredCharacters = filtered;
    window.renderTable();
    updateStats();
}

// Save filter state to localStorage
function saveFilterState() {
    localStorage.setItem('cotc-column-filters', JSON.stringify(activeFilters));
}

// Load filter state from localStorage
function loadFilterState() {
    const saved = localStorage.getItem('cotc-column-filters');
    if (saved) {
        try {
            const savedFilters = JSON.parse(saved);
            // Merge with defaults to ensure all properties exist
            window.activeFilters = { ...window.activeFilters, ...savedFilters };
            
            // Update UI to reflect loaded state
            updateFilterBadges();
            
            // Update unreleased toggle
            const unreleasedToggle = document.getElementById('showUnreleased');
            if (unreleasedToggle) {
                unreleasedToggle.checked = window.activeFilters.showUnreleased;
            }
        } catch (e) {
            console.error('Error loading filter state:', e);
        }
    }
}

// Update all filter badges
function updateFilterBadges() {
    Object.keys(activeFilters).forEach(filterType => {
        if (filterType !== 'showUnreleased') {
            const header = document.querySelector(`th[data-filter="${filterType}"]`);
            if (header) {
                let badge = header.querySelector('.filter-badge');
                const activeCount = activeFilters[filterType]?.length || 0;

                if (activeCount > 0) {
                    if (!badge) {
                        badge = document.createElement('span');
                        badge.className = 'filter-badge';
                        header.appendChild(badge);
                    }
                    badge.textContent = activeCount;
                } else if (badge) {
                    badge.remove();
                }
            }
        }
    });
}

// Reset column filters
function resetColumnFilters() {
    activeFilters = {
        starRating: [],
        job: [],
        roles: [],
        elements: [],
        weapons: [],
        continent: [],
        obtainedFrom: [],
        tierRating: [],
        a4Tier: [],
        showUnreleased: false
    };
    
    saveFilterState();
    updateFilterBadges();
    
    // Update unreleased toggle
    const unreleasedToggle = document.getElementById('showUnreleased');
    if (unreleasedToggle) {
        unreleasedToggle.checked = false;
    }
}

// Make functions available globally
window.applyColumnFilters = applyColumnFilters;
window.resetColumnFilters = resetColumnFilters;
window.initializeColumnFilters = initializeColumnFilters;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeColumnFilters);
} else {
    initializeColumnFilters();
}