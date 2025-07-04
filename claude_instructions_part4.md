# Claude Code Instructions - Part 4: JavaScript Files

## File 4: js/app.js

Create the directory and file:
1. `mkdir -p js`
2. Create `js/app.js` with the following content:

```javascript
// Global variables
let allCharacters = [];
let filteredCharacters = [];
let sortColumn = null;
let sortDirection = 'asc';

// Load character data on page load
document.addEventListener('DOMContentLoaded', async function() {
    await loadCharacterData();
    setupEventListeners();
});

// Load and display character data
async function loadCharacterData() {
    try {
        const response = await fetch('data/characters.json');
        const data = await response.json();
        
        // Update version and date
        document.getElementById('version').textContent = `v${data.version}`;
        document.getElementById('lastUpdated').textContent = `Last updated: ${data.lastUpdated}`;
        
        // Store character data
        allCharacters = data.characters;
        filteredCharacters = [...allCharacters];
        
        // Populate table
        renderTable();
        
        // Setup filters
        populateFilterOptions();
        
        // Update stats
        updateStats();
        
    } catch (error) {
        console.error('Error loading character data:', error);
        document.getElementById('tableBody').innerHTML = 
            '<tr><td colspan="9" class="loading">Error loading data. Please refresh the page.</td></tr>';
    }
}

// Render table with current filtered data
function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    if (filteredCharacters.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="loading">No characters match your filters.</td></tr>';
        return;
    }
    
    filteredCharacters.forEach(char => {
        const row = document.createElement('tr');
        if (char.isFree) row.classList.add('free-char');
        
        row.innerHTML = `
            <td><strong>${char.name}</strong>${char.isFree ? ' <em>(Free)</em>' : ''}</td>
            <td class="tier-${(char.a4Tier || 'none').toLowerCase().replace('+', '\\+')}">${char.a4Tier || 'Not Listed'}</td>
            <td class="${getUltClass(char.ultPriority)}">${char.ultPriority}</td>
            <td class="${getStoneClass(char.stones.AS1)}">${char.stones.AS1}</td>
            <td class="${getStoneClass(char.stones.AS2)}">${char.stones.AS2}</td>
            <td class="${getStoneClass(char.stones.AS3)}">${char.stones.AS3}</td>
            <td class="${getStoneClass(char.stones.AS4)}">${char.stones.AS4}</td>
            <td class="${getStoneClass(char.stones.AS5)}">${char.stones.AS5}</td>
            <td>${char.notes}</td>
        `;
        
        tbody.appendChild(row);
    });
}

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
    
    // Reset button
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    
    // Export button
    document.getElementById('exportCSV').addEventListener('click', exportToCSV);
    
    // Sort headers
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.addEventListener('click', () => sortTable(th.dataset.sort));
    });
}

// Filter table based on all active filters
function filterTable() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    const a4Filter = document.getElementById('a4Filter').value;
    const ultFilter = document.getElementById('ultFilter').value;
    const freeFilter = document.getElementById('freeFilter').value;
    
    filteredCharacters = allCharacters.filter(char => {
        // Search filter
        if (searchTerm && !char.name.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // A4 tier filter
        if (a4Filter && (char.a4Tier || 'Not Listed') !== a4Filter) {
            return false;
        }
        
        // Ultimate priority filter
        if (ultFilter && char.ultPriority !== ultFilter) {
            return false;
        }
        
        // Free/Gacha filter
        if (freeFilter === 'free' && !char.isFree) {
            return false;
        }
        if (freeFilter === 'gacha' && char.isFree) {
            return false;
        }
        
        return true;
    });
    
    renderTable();
    updateStats();
}

// Reset all filters
function resetFilters() {
    document.getElementById('searchBox').value = '';
    document.getElementById('a4Filter').value = '';
    document.getElementById('ultFilter').value = '';
    document.getElementById('freeFilter').value = '';
    
    filteredCharacters = [...allCharacters];
    renderTable();
    updateStats();
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

// Update statistics
function updateStats() {
    document.getElementById('totalChars').textContent = allCharacters.length;
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
```

## File 5: js/filters.js

Create `js/filters.js` (currently empty but available for future expansion):

```javascript
// Additional filter functions can go here if needed
// Currently all filter logic is in app.js
// This file is included for future expansion and better code organization
```

## Next Steps
Continue with Part 5 for documentation files