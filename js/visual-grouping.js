// Visual grouping functionality for COTC table
// This extends the existing app.js with collapsible group headers

// Track grouping state
let visualGroupingEnabled = true;

// CSS class helper functions (needed for visual grouping)
function getUltClass(priority) {
    if (!priority) return '';
    if (priority.includes('L10')) return 'u10';
    if (priority === 'L9') return 'u9';
    if (priority === 'L1') return 'u1-7';
    return '';
}

// Format dual-priority system with source attribution
function formatDualPriorityWithSource(char) {
    if (!window.sourceAttribution) {
        // If source attribution system isn't loaded yet, fall back to legacy display
        return char.ultPriority || 'Not Listed';
    }
    
    const f2pRec = getF2PRecommendation(char);
    const dolphinRec = getDolphinRecommendation(char);
    
    let displayText = '';
    
    if (f2pRec === dolphinRec) {
        // Same recommendation for both
        displayText = f2pRec;
    } else {
        // Different F2P vs Dolphin recommendations
        displayText = `F2P: ${f2pRec} | Dolphin: ${dolphinRec}`;
    }
    
    // Add source attribution if available
    if (char.prioritySource) {
        const sourceIcon = createSourceIconHTML(char.prioritySource);
        displayText += sourceIcon;
    }
    
    return displayText;
}

// Get F2P recommendation from character data (simplified for display)
function getF2PRecommendation(char) {
    const ultPriority = char.ultPriority || 'skip';
    const a4Priority = char.a4Priority || 'skip';
    
    if (ultPriority === 'skip' && a4Priority === 'skip') return 'Shard';
    if (ultPriority === 'skip' && a4Priority === 'essential') return 'A4';
    if (ultPriority === 'essential' && a4Priority === 'skip') return 'U10';
    if (ultPriority === 'essential' && a4Priority === 'good') return 'U10→A4';
    if (ultPriority === 'good' && a4Priority === 'essential') return 'A4→U10';
    if (ultPriority === 'essential' && a4Priority === 'essential') return 'A4U10';
    
    // Legacy fallback
    return char.ultPriority || 'Not Listed';
}

// Get Dolphin recommendation (check for override tags)
function getDolphinRecommendation(char) {
    const tags = char.tags || [];
    
    if (tags.includes('dolphin_a4')) return 'A4';
    if (tags.includes('dolphin_u10')) return 'U10';
    if (tags.includes('dolphin_a4u10')) return 'A4U10';
    if (tags.includes('dolphin_shard')) return 'Shard';
    
    // No override - use F2P recommendation
    return getF2PRecommendation(char);
}

// Create source icon HTML (simplified version for table display)
function createSourceIconHTML(sourceData) {
    if (!sourceData) return '';
    
    const confidenceClass = getConfidenceClass(sourceData.confidence);
    const tooltipText = `${sourceData.evaluator} (${sourceData.lastUpdated})`;
    
    return `<span class="source-info">
        <span class="source-icon ${confidenceClass}" title="${tooltipText}" aria-label="Source information">i</span>
    </span>`;
}

// Get CSS class based on confidence level
function getConfidenceClass(confidence) {
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

// Format notes with source attribution
function formatNotesWithSource(char) {
    let notesText = char.notes || '';
    
    // Add source attribution if available and notes are from a specific source
    if (char.prioritySource && notesText) {
        const sourceIcon = createSourceIconHTML(char.prioritySource);
        notesText += sourceIcon;
    }
    
    return notesText;
}

function getStoneClass(stone) {
    if (!stone) return '';
    if (stone === 'U10') return 'u10';
    if (stone.startsWith('A')) return stone.toLowerCase();
    if (stone === 'Shard') return 'shard';
    if (stone === 'Keep') return 'keep';
    return '';
}

// Format release date for display
function formatReleaseDate(dateString) {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } catch (e) {
        return dateString; // Return original if parsing fails
    }
}

// Override the renderTable function to conditionally show grouped data
const originalRenderTable = window.renderTable;
window.renderTable = function() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    if (filteredCharacters.length === 0) {
        tbody.innerHTML = '<tr><td colspan="19" class="loading">No characters match your filters.</td></tr>';
        return;
    }
    
    if (visualGroupingEnabled) {
        // Render with tier grouping
        renderVisualGroupedTable('overallTier');
        setupGroupHeaderListeners();
    } else {
        // Render flat table
        renderFlatTable();
    }
    
    // Setup event listeners for controls
    setupCharacterControlListeners();
    setupCharacterModalListeners();
};

// Render flat table without grouping
function renderFlatTable() {
    const tbody = document.getElementById('tableBody');
    
    // Use the current sorted order from filteredCharacters
    filteredCharacters.forEach(char => {
        const row = document.createElement('tr');
        const userData = userCharacterData[char.id] || {};
        const isOwned = userData.owned || false;
        
        if (char.isFree) row.classList.add('free-char');
        row.classList.add('character-row');
        
        if (isOwned) {
            row.classList.add('owned');
        } else {
            row.classList.add('not-owned');
        }
        
        row.innerHTML = generateEnhancedRowHTML(char, userData, isOwned);
        tbody.appendChild(row);
    });
}

// Enhanced grouped table rendering with collapsible headers
function renderVisualGroupedTable(groupBy) {
    const tbody = document.getElementById('tableBody');
    
    // Group characters
    const groups = {};
    filteredCharacters.forEach(char => {
        const key = getGroupKey(char, groupBy);
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(char);
    });
    
    // Define sort order for groups
    const tierOrder = ['S+', 'S', 'A', 'B', 'C', 'D', 'Not Listed'];
    const ultOrder = ['L10', 'L10 First', 'A1, L10', 'A4, L10', 'L9', 'L1', 'Not Listed'];
    
    const sortedKeys = Object.keys(groups).sort((a, b) => {
        if (groupBy === 'a4Tier' || groupBy === 'overallTier') {
            return tierOrder.indexOf(a) - tierOrder.indexOf(b);
        } else if (groupBy === 'ultPriority') {
            return ultOrder.indexOf(a) - ultOrder.indexOf(b);
        }
        return a.localeCompare(b);
    });
    
    // Load collapsed state from localStorage
    const collapsedGroups = JSON.parse(localStorage.getItem('cotc-collapsed-groups') || '{}');
    
    // Render each group
    sortedKeys.forEach(groupKey => {
        const groupId = `group-${groupBy}-${groupKey.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        const isCollapsed = collapsedGroups[groupId] || false;
        const characterCount = groups[groupKey].length;
        
        // Add collapsible group header
        const headerRow = document.createElement('tr');
        headerRow.classList.add('group-header', 'collapsible');
        if (isCollapsed) headerRow.classList.add('collapsed');
        headerRow.dataset.groupId = groupId;
        
        headerRow.innerHTML = `
            <td colspan="19" class="group-title">
                <span class="group-icon">${isCollapsed ? '▶' : '▼'}</span>
                <span class="group-name">${groupKey}</span>
                <span class="group-count">(${characterCount} characters)</span>
            </td>
        `;
        tbody.appendChild(headerRow);
        
        // Sort characters within group if there's an active sort
        let groupCharacters = groups[groupKey];
        if (window.sortColumn && window.sortDirection) {
            groupCharacters = [...groupCharacters].sort((a, b) => {
                return applySortLogic(a, b, window.sortColumn, window.sortDirection);
            });
        }
        
        // Render characters in group using enhanced generateRowHTML
        groupCharacters.forEach(char => {
            const row = document.createElement('tr');
            const userData = userCharacterData[char.id] || {};
            const isOwned = userData.owned || false;
            
            if (char.isFree) row.classList.add('free-char');
            row.classList.add('character-row', 'group-member');
            row.dataset.groupId = groupId;
            
            if (isCollapsed) row.classList.add('hidden');
            
            if (isOwned) {
                row.classList.add('owned');
            } else {
                row.classList.add('not-owned');
            }
            
            // Use enhanced row HTML with new column structure
            row.innerHTML = generateEnhancedRowHTML(char, userData, isOwned);
            tbody.appendChild(row);
        });
    });
}

// Enhanced row HTML generation for new column structure
function generateEnhancedRowHTML(char, userData, isOwned) {
    // Calculate overall tier (only use GL ranking, no fallback to a4Tier)
    const overallTier = char.tierRatings?.gl?.tier || 'Not Listed';
    
    // Format roles
    const primaryRole = char.roles?.primary || '-';
    const secondaryRole = char.roles?.secondary || '';
    const rolesDisplay = secondaryRole ? `${primaryRole}/${secondaryRole}` : primaryRole;
    
    // Get awakening stone values (N/A for 3★ and 4★)
    const showStones = char.starRating === 5;
    const stoneValue = (stone) => showStones ? stone : 'N/A';
    const stoneClass = (stone) => showStones ? getStoneClass(stone) : 'na-stone';
    
    return `
        <!-- Core Group (Name always visible) -->
        <td class="always-visible"><strong><a href="#" class="character-name-link" data-char-id="${char.id}">${char.name}</a></strong>${char.isFree ? ' <em>(Free)</em>' : ''}</td>
        <td class="column-group-core">${char.job || '-'}</td>
        <td class="column-group-core">${'★'.repeat(char.starRating || 5)}</td>
        <td class="column-group-core">${rolesDisplay}</td>
        
        <!-- Ownership Group (grouped together) -->
        <td class="ownership-header column-group-ownership">
            <input type="checkbox" class="ownership-checkbox" 
                   data-char-id="${char.id}" 
                   ${isOwned ? 'checked' : ''}>
        </td>
        <td class="column-group-ownership">
            <input type="number" class="level-input awaken-level" 
                   min="0" max="${char.starRating === 3 ? 3 : 4}" 
                   value="${userData.awakenLevel || 0}" 
                   data-char-id="${char.id}" 
                   ${!isOwned ? 'disabled' : ''}>
        </td>
        <td class="column-group-ownership">
            <input type="number" class="level-input ult-level" 
                   min="1" max="10" 
                   value="${userData.ultLevel || 1}" 
                   data-char-id="${char.id}" 
                   ${!isOwned ? 'disabled' : ''}>
        </td>
        
        <!-- Tiers Group -->
        <td class="column-group-tiers tier-${overallTier.toLowerCase().replace('+', '-plus')}">${overallTier}${char.tierRatings?.gl?.score ? ` (${char.tierRatings.gl.score})` : ''}</td>
        <td class="column-group-tiers tier-${(char.a4Tier || 'none').toLowerCase().replace('+', '-plus')}">${char.a4Tier || 'Not Listed'}</td>
        <td class="column-group-tiers ${getUltClass(char.ultPriority)}">${formatDualPriorityWithSource(char)}</td>
        
        <!-- Awakening Stones (linked to Ult Priority) -->
        <td class="column-group-awakening ${stoneClass(char.stones?.AS1)}">${stoneValue(char.stones?.AS1)}</td>
        <td class="column-group-awakening ${stoneClass(char.stones?.AS2)}">${stoneValue(char.stones?.AS2)}</td>
        <td class="column-group-awakening ${stoneClass(char.stones?.AS3)}">${stoneValue(char.stones?.AS3)}</td>
        <td class="column-group-awakening ${stoneClass(char.stones?.AS4)}">${stoneValue(char.stones?.AS4)}</td>
        <td class="column-group-awakening ${stoneClass(char.stones?.AS5)}">${stoneValue(char.stones?.AS5)}</td>
        
        <!-- Combat Group -->
        <td class="column-group-combat">${char.elements?.join(', ') || '-'}</td>
        <td class="column-group-combat">${char.weapons?.join(', ') || '-'}</td>
        
        <!-- Acquisition Group -->
        <td class="column-group-acquisition">${char.continent || '-'}</td>
        <td class="column-group-acquisition">${char.obtainedFrom || '-'}</td>
        <td class="column-group-acquisition">${formatReleaseDate(char.glReleaseDate)}</td>
        
        <!-- Notes -->
        <td class="column-group-notes">${formatNotesWithSource(char)}</td>
    `;
}

// Get group key for a character
function getGroupKey(char, groupBy) {
    switch (groupBy) {
        case 'overallTier':
            const tier = char.tierRatings?.gl?.tier;
            // Only allow valid tiers, exclude invalid ones like "E"
            const validTiers = ['S+', 'S', 'A', 'B', 'C', 'D'];
            return validTiers.includes(tier) ? tier : 'Not Listed';
        case 'a4Tier':
            const a4tier = char.a4Tier;
            const validA4Tiers = ['S+', 'S', 'A', 'B', 'C', 'D'];
            return validA4Tiers.includes(a4tier) ? a4tier : 'Not Listed';
        case 'ultPriority':
            return char.ultPriority || 'Not Listed';
        case 'job':
            return char.job || 'Unknown';
        case 'starRating':
            return `${char.starRating || 5}★`;
        default:
            return char[groupBy] || 'Not Listed';
    }
}

// Setup event listeners for group headers
function setupGroupHeaderListeners() {
    document.querySelectorAll('.group-header.collapsible').forEach(header => {
        header.addEventListener('click', function() {
            const groupId = this.dataset.groupId;
            const isCollapsed = this.classList.contains('collapsed');
            
            // Toggle header state
            if (isCollapsed) {
                this.classList.remove('collapsed');
                this.querySelector('.group-icon').textContent = '▼';
            } else {
                this.classList.add('collapsed');
                this.querySelector('.group-icon').textContent = '▶';
            }
            
            // Toggle group members
            document.querySelectorAll(`[data-group-id="${groupId}"].group-member`).forEach(row => {
                if (isCollapsed) {
                    row.classList.remove('hidden');
                } else {
                    row.classList.add('hidden');
                }
            });
            
            // Save state to localStorage
            const collapsedGroups = JSON.parse(localStorage.getItem('cotc-collapsed-groups') || '{}');
            collapsedGroups[groupId] = !isCollapsed;
            localStorage.setItem('cotc-collapsed-groups', JSON.stringify(collapsedGroups));
        });
    });
}

// Apply sorting logic (extracted from original sortTable function)
function applySortLogic(a, b, column, direction) {
    let aVal = a[column] || '';
    let bVal = b[column] || '';
    
    // Special handling for overallTier sorting
    if (column === 'overallTier') {
        const tierOrder = {'S+': 1, 'S': 2, 'A': 3, 'B': 4, 'C': 5, 'D': 6, '': 7};
        const aTier = a.tierRatings?.gl?.tier || '';
        const bTier = b.tierRatings?.gl?.tier || '';
        aVal = tierOrder[aTier] || 7;
        bVal = tierOrder[bTier] || 7;
    }
    
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
    
    // Special handling for star rating
    if (column === 'starRating') {
        aVal = a.starRating || 5;
        bVal = b.starRating || 5;
    }
    
    // Special handling for job sorting
    if (column === 'job') {
        aVal = a.job || '';
        bVal = b.job || '';
    }
    
    // Special handling for notes sorting (characters with notes first)
    if (column === 'notes') {
        const aHasNotes = aVal && aVal.trim().length > 0;
        const bHasNotes = bVal && bVal.trim().length > 0;
        
        // If one has notes and other doesn't, prioritize the one with notes
        if (aHasNotes && !bHasNotes) return direction === 'asc' ? -1 : 1;
        if (!aHasNotes && bHasNotes) return direction === 'asc' ? 1 : -1;
    }
    
    // Special handling for acquisition fields
    if (column === 'continent') {
        aVal = a.continent || '';
        bVal = b.continent || '';
    }
    
    if (column === 'obtainedFrom') {
        aVal = a.obtainedFrom || '';
        bVal = b.obtainedFrom || '';
    }
    
    if (column === 'glReleaseDate') {
        // Sort by date, with empty dates last
        const aDate = a.glReleaseDate ? new Date(a.glReleaseDate) : new Date('9999-12-31');
        const bDate = b.glReleaseDate ? new Date(b.glReleaseDate) : new Date('9999-12-31');
        aVal = aDate.getTime();
        bVal = bDate.getTime();
    }
    
    if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
    }
    
    if (direction === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
}

// Column visibility management using CSS classes
function toggleColumnGroup(group) {
    const table = document.getElementById('characterTable');
    const toggleButton = document.querySelector(`[data-group="${group}"]`);
    
    if (!table || !toggleButton) return;
    
    const hideClass = `hide-${group}`;
    const isCurrentlyHidden = table.classList.contains(hideClass);
    
    // Toggle table class to show/hide column group
    if (isCurrentlyHidden) {
        table.classList.remove(hideClass);
    } else {
        table.classList.add(hideClass);
    }
    
    // Update button state
    const icon = toggleButton.querySelector('.toggle-icon');
    if (isCurrentlyHidden) {
        toggleButton.classList.add('active');
        if (icon) icon.textContent = '✓';
    } else {
        toggleButton.classList.remove('active');
        if (icon) icon.textContent = '−';
    }
    
    // Save state to localStorage
    saveColumnVisibility(group, isCurrentlyHidden);
}

function saveColumnVisibility(group, visible) {
    const saved = JSON.parse(localStorage.getItem('cotc-column-visibility') || '{}');
    saved[group] = visible;
    localStorage.setItem('cotc-column-visibility', JSON.stringify(saved));
}

function loadColumnVisibility() {
    const saved = JSON.parse(localStorage.getItem('cotc-column-visibility') || '{}');
    const table = document.getElementById('characterTable');
    
    if (!table) return;
    
    // Apply saved visibility states using CSS classes
    Object.entries(saved).forEach(([group, visible]) => {
        const hideClass = `hide-${group}`;
        const toggleButton = document.querySelector(`[data-group="${group}"]`);
        
        // Set table class based on saved state
        if (visible) {
            table.classList.remove(hideClass);
        } else {
            table.classList.add(hideClass);
        }
        
        // Update button state
        if (toggleButton) {
            const icon = toggleButton.querySelector('.toggle-icon');
            if (visible) {
                toggleButton.classList.add('active');
                if (icon) icon.textContent = '✓';
            } else {
                toggleButton.classList.remove('active');
                if (icon) icon.textContent = '−';
            }
        }
    });
}

// Toggle visual grouping on/off
function toggleVisualGrouping() {
    visualGroupingEnabled = !visualGroupingEnabled;
    localStorage.setItem('cotc-visual-grouping', visualGroupingEnabled);
    
    // Update toggle button
    const toggleButton = document.getElementById('groupingToggle');
    const expandAllButton = document.getElementById('expandAllToggle');
    
    if (toggleButton) {
        toggleButton.textContent = visualGroupingEnabled ? 'Disable Grouping' : 'Enable Grouping';
        toggleButton.classList.toggle('active', visualGroupingEnabled);
    }
    
    // Show/hide expand all button based on grouping state
    if (expandAllButton) {
        expandAllButton.style.display = visualGroupingEnabled ? 'inline-block' : 'none';
    }
    
    // Re-render table
    window.renderTable();
}

// Expand or collapse all groups
function toggleExpandAll() {
    const expandAllButton = document.getElementById('expandAllToggle');
    const isCurrentlyExpanded = expandAllButton.textContent === 'Collapse All';
    
    // Get all group headers
    const groupHeaders = document.querySelectorAll('.group-header.collapsible');
    const collapsedGroups = {};
    
    groupHeaders.forEach(header => {
        const groupId = header.dataset.groupId;
        const groupMembers = document.querySelectorAll(`[data-group-id="${groupId}"].group-member`);
        
        if (isCurrentlyExpanded) {
            // Collapse all
            header.classList.add('collapsed');
            header.querySelector('.group-icon').textContent = '▶';
            groupMembers.forEach(row => row.classList.add('hidden'));
            collapsedGroups[groupId] = true;
        } else {
            // Expand all
            header.classList.remove('collapsed');
            header.querySelector('.group-icon').textContent = '▼';
            groupMembers.forEach(row => row.classList.remove('hidden'));
            collapsedGroups[groupId] = false;
        }
    });
    
    // Update button text
    expandAllButton.textContent = isCurrentlyExpanded ? 'Expand All' : 'Collapse All';
    
    // Save state to localStorage
    localStorage.setItem('cotc-collapsed-groups', JSON.stringify(collapsedGroups));
}

// Reset all filters, grouping, and column visibility to defaults
function resetToDefaults() {
    // Reset filters (existing functionality)
    document.getElementById('searchBox').value = '';
    document.getElementById('a4Filter').value = '';
    document.getElementById('ultFilter').value = '';
    document.getElementById('freeFilter').value = '';
    document.getElementById('ownershipFilter').value = '';
    
    // Reset column filters
    if (window.resetColumnFilters) {
        window.resetColumnFilters();
    }
    
    // Reset to default grouping (enabled and expanded)
    visualGroupingEnabled = true;
    localStorage.setItem('cotc-visual-grouping', true);
    
    // Clear collapsed groups (all expanded by default)
    localStorage.setItem('cotc-collapsed-groups', '{}');
    
    // Reset column visibility to defaults
    const defaultColumnVisibility = {
        core: true,
        tiers: true,
        notes: true,
        ownership: false,
        awakening: false,
        combat: false,
        acquisition: false
    };
    localStorage.setItem('cotc-column-visibility', JSON.stringify(defaultColumnVisibility));
    
    // Reset sort state
    window.sortColumn = null;
    window.sortDirection = 'asc';
    
    // Update UI states
    updateUIToDefaults();
    
    // Reset data and re-render
    filteredCharacters = [...allCharacters];
    window.renderTable();
    updateStats();
}

// Update UI elements to reflect default states
function updateUIToDefaults() {
    // Update grouping toggle
    const groupingToggle = document.getElementById('groupingToggle');
    if (groupingToggle) {
        groupingToggle.textContent = 'Disable Grouping';
        groupingToggle.classList.add('active');
    }
    
    // Update expand all toggle
    const expandAllToggle = document.getElementById('expandAllToggle');
    if (expandAllToggle) {
        expandAllToggle.style.display = 'inline-block';
        expandAllToggle.textContent = 'Collapse All';
    }
    
    // Update column toggles
    document.querySelectorAll('.group-toggle').forEach(button => {
        const group = button.dataset.group;
        const icon = button.querySelector('.toggle-icon');
        
        if (['core', 'tiers', 'notes'].includes(group)) {
            button.classList.add('active');
            if (icon) icon.textContent = '✓';
        } else {
            button.classList.remove('active');
            if (icon) icon.textContent = '−';
        }
    });
    
    // Reset table column classes
    const table = document.getElementById('characterTable');
    if (table) {
        table.className = 'hide-ownership hide-awakening hide-combat hide-acquisition';
    }
    
    // Clear sort indicators
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
    });
}

// Setup character modal click handlers
function setupCharacterModalListeners() {
    const tableBody = document.getElementById('tableBody');
    
    // Remove any existing listener to avoid duplicates
    tableBody.removeEventListener('click', handleCharacterNameClick);
    tableBody.addEventListener('click', handleCharacterNameClick);
}

// Handle character name clicks for modal
function handleCharacterNameClick(e) {
    if (e.target.classList.contains('character-name-link')) {
        e.preventDefault();
        const charId = e.target.dataset.charId;
        const character = allCharacters.find(c => c.id === charId);
        if (character && window.characterModal) {
            window.characterModal.open(character);
        }
    }
}

// Setup enhanced event listeners
function setupEnhancedEventListeners() {
    // Column group toggle buttons
    document.querySelectorAll('.group-toggle').forEach(button => {
        button.addEventListener('click', function() {
            const group = this.dataset.group;
            toggleColumnGroup(group);
        });
    });
    
    // Grouping toggle button
    const groupingToggle = document.getElementById('groupingToggle');
    if (groupingToggle) {
        groupingToggle.addEventListener('click', toggleVisualGrouping);
    }
    
    // Expand/collapse all toggle button
    const expandAllToggle = document.getElementById('expandAllToggle');
    if (expandAllToggle) {
        expandAllToggle.addEventListener('click', toggleExpandAll);
    }
    
    // Theme toggle button (ensure it works with visual grouping)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle && window.toggleTheme) {
        // Remove any existing listeners and add the theme toggle
        themeToggle.removeEventListener('click', window.toggleTheme);
        themeToggle.addEventListener('click', window.toggleTheme);
    }
    
    // Override reset button to use enhanced reset
    const resetButton = document.getElementById('resetFilters');
    if (resetButton) {
        // Remove existing event listeners by cloning the button
        const newResetButton = resetButton.cloneNode(true);
        resetButton.parentNode.replaceChild(newResetButton, resetButton);
        
        // Add new event listener
        newResetButton.addEventListener('click', resetToDefaults);
    }
    
    // Setup sorting (override original sort function to work with visual grouping)
    setupEnhancedSorting();
}

// Enhanced sorting that works with visual grouping
function setupEnhancedSorting() {
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const column = th.dataset.sort;
            
            // Update sort state
            const headers = document.querySelectorAll('th[data-sort]');
            headers.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
            
            if (window.sortColumn === column) {
                window.sortDirection = window.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                window.sortColumn = column;
                window.sortDirection = 'asc';
            }
            
            // Update header visual indicator
            th.classList.add(`sort-${window.sortDirection}`);
            
            // Sort the data
            filteredCharacters.sort((a, b) => {
                return applySortLogic(a, b, window.sortColumn, window.sortDirection);
            });
            
            // Re-render table with sorted data
            window.renderTable();
        });
    });
}

// Initialize enhanced functionality
function initializeEnhancedFeatures() {
    // Initialize global sort variables
    if (typeof window.sortColumn === 'undefined') {
        window.sortColumn = null;
        window.sortDirection = 'asc';
    }
    
    // Load saved states
    const savedGrouping = localStorage.getItem('cotc-visual-grouping');
    if (savedGrouping !== null) {
        visualGroupingEnabled = JSON.parse(savedGrouping);
    }
    
    // Initialize UI states based on loaded preferences
    initializeUIStates();
    
    loadColumnVisibility();
    setupEnhancedEventListeners();
    
    // Ensure legend collapse functionality is working
    ensureLegendCollapse();
}

// Initialize UI states based on current settings
function initializeUIStates() {
    // Update grouping toggle button
    const groupingToggle = document.getElementById('groupingToggle');
    if (groupingToggle) {
        groupingToggle.textContent = visualGroupingEnabled ? 'Disable Grouping' : 'Enable Grouping';
        groupingToggle.classList.toggle('active', visualGroupingEnabled);
    }
    
    // Show/hide expand all button based on grouping state
    const expandAllButton = document.getElementById('expandAllToggle');
    if (expandAllButton) {
        expandAllButton.style.display = visualGroupingEnabled ? 'inline-block' : 'none';
        expandAllButton.textContent = 'Collapse All'; // Default to collapse all on load
    }
}

// Ensure legend collapse functionality is working
function ensureLegendCollapse() {
    const legend = document.getElementById('legend');
    const legendHeader = document.getElementById('legendHeader');
    
    if (!legend || !legendHeader) return;
    
    // Check if legend collapse is already set up
    if (legend.dataset.collapseSetup === 'true') return;
    
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
        const statsElement = document.getElementById('stats');
        
        if (statsElement) {
            const statsRect = statsElement.getBoundingClientRect();
            
            // Auto-collapse when scrolling down past the stats section
            if (scrollTop > lastScrollTop && statsRect.top < window.innerHeight / 2) {
                legend.classList.add('collapsed');
            }
            // Auto-expand when scrolling back up to the top
            else if (scrollTop < lastScrollTop && scrollTop < 100) {
                legend.classList.remove('collapsed');
            }
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Mark as set up to avoid duplicate listeners
    legend.dataset.collapseSetup = 'true';
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEnhancedFeatures);
} else {
    initializeEnhancedFeatures();
}