// Global variables
let allCharacters = [];
let filteredCharacters = [];
let sortColumn = null;
let sortDirection = 'asc';
let userCharacterData = {};

// Load character data on page load
document.addEventListener('DOMContentLoaded', async function() {
    initializeTheme();
    loadUserData();
    await loadCharacterData();
    setupEventListeners();
    setupLegendCollapse();
    setupCreditsCollapse();
});

// Load and display character data
async function loadCharacterData() {
    try {
        const response = await fetch('data/characters_enhanced_v2.json');
        const data = await response.json();
        
        // Update version and date
        document.getElementById('version').textContent = `v${data.version}`;
        document.getElementById('lastUpdated').textContent = `Last updated: ${data.lastUpdated}`;
        
        // Store character data in state
        window.AppState.setState('characters', data.characters);
        
        // Update legacy globals for backward compatibility
        allCharacters = data.characters;
        filteredCharacters = [...allCharacters];
        
        // Apply initial filters and render
        window.AppState.applyFilters();
        renderTable();
        
        // Setup filters
        populateFilterOptions();
        
        // Update stats
        updateStats();
        
    } catch (error) {
        console.error('Error loading character data:', error);
        document.getElementById('tableBody').innerHTML = 
            '<tr><td colspan="12" class="loading">Error loading data. Please refresh the page.</td></tr>';
    }
}

// Render table with current filtered data (placeholder - overridden by visual-grouping.js)
function renderTable() {
    // This function is overridden by visual-grouping.js
    // Left here for compatibility if visual-grouping.js fails to load
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '<tr><td colspan="19" class="loading">Loading enhanced features...</td></tr>';
}

// Old renderGroupedTable function removed - now handled by visual-grouping.js

// Get CSS class for ultimate priority
function getUltClass(priority) {
    if (!priority) return '';
    if (priority.includes('L10')) return 'u10';
    if (priority === 'L9') return 'u9';
    if (priority === 'L1') return 'u1-7';
    return '';
}

// Get CSS class for stone usage
function getStoneClass(stone) {
    if (!stone) return '';
    if (stone === 'U10') return 'u10';
    if (stone.startsWith('A')) return stone.toLowerCase();
    if (stone === 'Shard') return 'shard';
    if (stone === 'Keep') return 'keep';
    return '';
}

// Populate filter options from data
function populateFilterOptions() {
    // A4 tiers are already hardcoded in HTML
    // Ultimate priorities could be dynamic if needed
}

// Setup event listeners
function setupEventListeners() {
    // Search box
    document.getElementById('searchBox').addEventListener('input', filterTable);
    
    // Filter dropdowns
    document.getElementById('a4Filter').addEventListener('change', filterTable);
    document.getElementById('ultFilter').addEventListener('change', filterTable);
    document.getElementById('freeFilter').addEventListener('change', filterTable);
    document.getElementById('ownershipFilter').addEventListener('change', filterTable);
    
    // Theme toggle button
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Reset button
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    
    // Export button (disabled for now)
    // document.getElementById('exportCSV').addEventListener('click', exportToCSV);
    
    // Sort headers
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.addEventListener('click', () => sortTable(th.dataset.sort));
    });
    
    // Character name clicks (delegated event listener)
    document.getElementById('tableBody').addEventListener('click', function(e) {
        if (e.target.classList.contains('character-name-link')) {
            e.preventDefault();
            const charId = e.target.dataset.charId;
            const character = allCharacters.find(c => c.id === charId);
            if (character && window.characterModal) {
                window.characterModal.open(character);
            }
        }
    });
}

// Filter table based on all active filters
function filterTable() {
    // Update state with current filter values
    const searchTerm = document.getElementById('searchBox').value;
    const a4Filter = document.getElementById('a4Filter').value;
    const ultFilter = document.getElementById('ultFilter').value;
    const freeFilter = document.getElementById('freeFilter').value;
    const ownershipFilter = document.getElementById('ownershipFilter').value;
    
    // Update state
    window.AppState.setState('filters.search', searchTerm);
    window.AppState.setState('filters.a4Tier', a4Filter);
    window.AppState.setState('filters.ultPriority', ultFilter);
    window.AppState.setState('filters.freeGacha', freeFilter);
    window.AppState.setState('filters.ownership', ownershipFilter);
    
    // Apply all filters through state system
    const filtered = window.AppState.applyFilters();
    
    // Update legacy global for backward compatibility
    filteredCharacters = filtered;
    
    renderTable();
    updateStats();
}

// Reset all filters
function resetFilters() {
    // Use the centralized reset function
    window.AppState.reset();
    
    // Update UI elements to match reset state
    document.getElementById('searchBox').value = '';
    document.getElementById('a4Filter').value = '';
    document.getElementById('ultFilter').value = '';
    document.getElementById('freeFilter').value = '';
    document.getElementById('ownershipFilter').value = '';
}

// Sort table by column
function sortTable(column) {
    const headers = document.querySelectorAll('th[data-sort]');
    headers.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
    
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }
    
    const currentHeader = document.querySelector(`th[data-sort="${column}"]`);
    currentHeader.classList.add(`sort-${sortDirection}`);
    
    filteredCharacters.sort((a, b) => {
        let aVal = a[column] || '';
        let bVal = b[column] || '';
        
        // Special handling for tier sorting
        if (column === 'a4Tier') {
            const tierOrder = {'S+': 1, 'S': 2, 'A': 3, 'B': 4, 'C': 5, 'D': 6, '': 7};
            aVal = tierOrder[aVal] || 7;
            bVal = tierOrder[bVal] || 7;
        }
        
        // Special handling for ult priority sorting
        if (column === 'ultPriority') {
            const ultOrder = {
                'L10': 1,
                'L10 First': 2,
                'A1, L10': 3,
                'A4, L10': 4,
                'L9': 5,
                'L1': 6
            };
            aVal = ultOrder[aVal] || 99;
            bVal = ultOrder[bVal] || 99;
        }
        
        // Special handling for notes sorting (characters with notes first)
        if (column === 'notes') {
            const aHasNotes = aVal && aVal.trim().length > 0;
            const bHasNotes = bVal && bVal.trim().length > 0;
            
            // If one has notes and other doesn't, prioritize the one with notes
            if (aHasNotes && !bHasNotes) return sortDirection === 'asc' ? -1 : 1;
            if (!aHasNotes && bHasNotes) return sortDirection === 'asc' ? 1 : -1;
            
            // If both have notes or both don't have notes, sort alphabetically by notes content
            // For empty notes, they will be handled by the string comparison below
        }
        
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (sortDirection === 'asc') {
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
    });
    
    renderTable();
}

// Update statistics with released/unreleased breakdown
function updateStats() {
    const now = new Date();
    let releasedCount = 0;
    let unreleasedCount = 0;
    
    allCharacters.forEach(char => {
        const releaseDate = char.glReleaseDate;
        if (!releaseDate || new Date(releaseDate) > now) {
            unreleasedCount++;
        } else {
            releasedCount++;
        }
    });
    
    document.getElementById('releasedChars').textContent = releasedCount;
    document.getElementById('unreleasedChars').textContent = unreleasedCount;
    document.getElementById('filteredChars').textContent = filteredCharacters.length;
}

// Export table to CSV
function exportToCSV() {
    const headers = ['Character', 'Free', 'A4 Tier', 'Ult Priority', 'AS1', 'AS2', 'AS3', 'AS4', 'AS5', 'Notes'];
    const rows = filteredCharacters.map(char => [
        char.name,
        char.isFree ? 'Yes' : 'No',
        char.a4Tier || 'Not Listed',
        char.ultPriority,
        char.stones.AS1,
        char.stones.AS2,
        char.stones.AS3,
        char.stones.AS4,
        char.stones.AS5,
        char.notes
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cotc_awakening_guide_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Theme management functions
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.body.className = savedTheme;
    } else if (prefersDark) {
        document.body.className = 'dark-theme';
    } else {
        document.body.className = 'light-theme';
    }
}

function toggleTheme() {
    const body = document.body;
    const currentTheme = body.className;
    const newTheme = currentTheme === 'dark-theme' ? 'light-theme' : 'dark-theme';
    
    body.className = newTheme;
    localStorage.setItem('theme', newTheme);
}

// Legend collapse functionality
function setupLegendCollapse() {
    const legend = document.getElementById('legend');
    const legendHeader = document.getElementById('legendHeader');
    let lastScrollTop = 0;
    let isManuallyToggled = false;
    
    // Manual toggle on click
    legendHeader.addEventListener('click', function() {
        legend.classList.toggle('collapsed');
        isManuallyToggled = true;
        
        // Reset manual toggle after some time
        setTimeout(() => {
            isManuallyToggled = false;
        }, 5000);
    });
    
    // Auto-collapse on scroll
    window.addEventListener('scroll', function() {
        if (isManuallyToggled) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const legendRect = legend.getBoundingClientRect();
        const statsRect = document.getElementById('stats').getBoundingClientRect();
        
        // Auto-collapse when scrolling down past the stats section
        if (scrollTop > lastScrollTop && statsRect.top < window.innerHeight / 2) {
            legend.classList.add('collapsed');
        }
        // Auto-expand when scrolling back up to the top
        else if (scrollTop < lastScrollTop && scrollTop < 100) {
            legend.classList.remove('collapsed');
        }
        
        lastScrollTop = scrollTop;
    });
}

// User data management
function loadUserData() {
    const saved = localStorage.getItem('cotc-user-data');
    if (saved) {
        try {
            userCharacterData = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading user data:', e);
            userCharacterData = {};
        }
    }
}

function saveUserData() {
    localStorage.setItem('cotc-user-data', JSON.stringify(userCharacterData));
}

function updateCharacterData(charId, field, value) {
    if (!userCharacterData[charId]) {
        userCharacterData[charId] = {
            owned: false,
            awakenLevel: 0,
            ultLevel: 1
        };
    }
    
    userCharacterData[charId][field] = value;
    saveUserData();
}

// Setup event listeners for character controls
function setupCharacterControlListeners() {
    // Ownership checkboxes
    document.querySelectorAll('.ownership-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const charId = this.dataset.charId;
            const isOwned = this.checked;
            
            updateCharacterData(charId, 'owned', isOwned);
            
            // Enable/disable level inputs
            const row = this.closest('tr');
            const awakenInput = row.querySelector('.awaken-level');
            const ultInput = row.querySelector('.ult-level');
            
            awakenInput.disabled = !isOwned;
            ultInput.disabled = !isOwned;
            
            // Update row styling
            if (isOwned) {
                row.classList.add('owned');
                row.classList.remove('not-owned');
            } else {
                row.classList.remove('owned');
                row.classList.add('not-owned');
                // Reset levels when unowned
                awakenInput.value = 0;
                ultInput.value = 1;
                updateCharacterData(charId, 'awakenLevel', 0);
                updateCharacterData(charId, 'ultLevel', 1);
            }
        });
    });
    
    // Awaken level inputs
    document.querySelectorAll('.awaken-level').forEach(input => {
        input.addEventListener('change', function() {
            const charId = this.dataset.charId;
            const level = parseInt(this.value) || 0;
            
            // Clamp to valid range
            if (level < 0) this.value = 0;
            if (level > 4) this.value = 4;
            
            updateCharacterData(charId, 'awakenLevel', parseInt(this.value));
        });
    });
    
    // Ultimate level inputs
    document.querySelectorAll('.ult-level').forEach(input => {
        input.addEventListener('change', function() {
            const charId = this.dataset.charId;
            const level = parseInt(this.value) || 1;
            
            // Clamp to valid range
            if (level < 1) this.value = 1;
            if (level > 10) this.value = 10;
            
            updateCharacterData(charId, 'ultLevel', parseInt(this.value));
        });
    });
}

// Credits collapse functionality
function setupCreditsCollapse() {
    const credits = document.getElementById('credits');
    const creditsHeader = document.getElementById('creditsHeader');
    const creditsContent = document.getElementById('creditsContent');
    
    if (!credits || !creditsHeader || !creditsContent) return;
    
    // Start collapsed
    credits.classList.add('collapsed');
    
    creditsHeader.addEventListener('click', function() {
        const isCollapsed = credits.classList.contains('collapsed');
        
        if (isCollapsed) {
            credits.classList.remove('collapsed');
            creditsContent.classList.add('expanded');
        } else {
            credits.classList.add('collapsed');
            creditsContent.classList.remove('expanded');
        }
    });
}