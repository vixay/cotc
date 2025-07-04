// Global variables
let allCharacters = [];
let filteredCharacters = [];

// Load character data on page load
document.addEventListener('DOMContentLoaded', async function() {
    initializeTheme();
    await loadCharacterData();
    setupEventListeners();
});

// Load and display character data
async function loadCharacterData() {
    try {
        const response = await fetch('data/characters_enhanced.json');
        const data = await response.json();
        
        // Update version and date
        document.getElementById('version').textContent = `v${data.version}`;
        document.getElementById('lastUpdated').textContent = `Last updated: ${data.lastUpdated}`;
        
        // Store character data
        allCharacters = data.characters;
        filteredCharacters = [...allCharacters];
        
        // Render character grid
        renderCharacterGrid();
        
        // Update stats
        updateStats();
        
    } catch (error) {
        console.error('Error loading character data:', error);
        document.getElementById('characterGrid').innerHTML = 
            '<div class="loading-card">Error loading data. Please refresh the page.</div>';
    }
}

// Render character grid
function renderCharacterGrid() {
    const grid = document.getElementById('characterGrid');
    grid.innerHTML = '';
    
    if (filteredCharacters.length === 0) {
        grid.innerHTML = '<div class="loading-card">No characters match your filters.</div>';
        return;
    }
    
    filteredCharacters.forEach(char => {
        const card = createCharacterCard(char);
        grid.appendChild(card);
    });
}

// Create individual character card
function createCharacterCard(char) {
    const card = document.createElement('div');
    card.className = 'character-card';
    
    // Add meta tier class for special styling
    if (char.overallTier && ['S+', 'S'].includes(char.overallTier)) {
        card.classList.add('meta-tier');
    }
    
    const starRating = char.starRating || 5;
    const jobType = char.jobType || 'Unknown';
    const overallTier = char.overallTier || char.a4Tier || 'B';
    const primaryRole = char.roles?.primary || 'Unknown';
    const secondaryRole = char.roles?.secondary;
    
    // Weapon and element display
    const weapons = char.weaponTypes?.join(', ') || 'Unknown';
    const elements = char.elementTypes?.join(', ') || 'Unknown';
    
    // Role tiers display
    const roleTiersHtml = char.roleTiers ? 
        Object.entries(char.roleTiers)
            .map(([role, tier]) => `<span class="role-tier ${tier?.toLowerCase()?.replace('+', '-plus')}">${role}: ${tier}</span>`)
            .join('') : '';
    
    // Key skills display
    const keySkillsHtml = char.keySkills && char.keySkills.length > 0 ?
        `<div class="key-skills">
            <h4>Key Abilities</h4>
            <ul class="skills-list">
                ${char.keySkills.map(skill => `<li>${skill}</li>`).join('')}
            </ul>
        </div>` : '';
    
    // Combat tags from existing tags
    const combatTags = char.tags?.filter(tag => 
        ['buffer', 'debuffer', 'dps', 'tank', 'healer', 'support', 'meta', 'top-tier'].includes(tag)
    ) || [];
    
    card.innerHTML = `
        <div class="character-header">
            <h3 class="character-name">${char.name}${char.isFree ? ' <em>(Free)</em>' : ''}</h3>
            <div class="character-badges">
                <span class="badge star-rating">${starRating}★</span>
                <span class="badge job-type">${jobType}</span>
                <span class="badge overall-tier tier-${overallTier.toLowerCase().replace('+', '-plus')}">${overallTier}</span>
                ${char.canOverclass ? '<span class="badge" style="background: #2ecc71; color: white;">6★</span>' : ''}
            </div>
        </div>
        
        <div class="character-info">
            <div class="info-section">
                <h4>Role</h4>
                <div class="role-info">
                    <span class="role-primary">${primaryRole}</span>
                    ${secondaryRole ? `<span class="role-secondary">+ ${secondaryRole}</span>` : ''}
                </div>
            </div>
            
            <div class="info-section">
                <h4>Role Tiers</h4>
                <div class="role-tiers">
                    ${roleTiersHtml || '<span class="role-tier">Not rated</span>'}
                </div>
            </div>
            
            <div class="info-section">
                <h4>Combat</h4>
                <p><strong>Weapons:</strong> ${weapons}</p>
                <p><strong>Elements:</strong> ${elements}</p>
            </div>
            
            <div class="info-section">
                <h4>Awakening</h4>
                <p><strong>Ultimate:</strong> ${char.ultPriority}</p>
                <p><strong>A4 Tier:</strong> ${char.a4Tier || 'Not Listed'}</p>
            </div>
            
            <div class="combat-info">
                <h4>Tags</h4>
                <div class="combat-tags">
                    ${combatTags.map(tag => `<span class="combat-tag">${tag}</span>`).join('')}
                </div>
                <p><strong>Notes:</strong> ${char.notes}</p>
            </div>
        </div>
        
        ${keySkillsHtml}
    `;
    
    return card;
}

// Setup event listeners
function setupEventListeners() {
    // Search and filter inputs
    document.getElementById('searchBox').addEventListener('input', filterCharacters);
    document.getElementById('starFilter').addEventListener('change', filterCharacters);
    document.getElementById('jobFilter').addEventListener('change', filterCharacters);
    document.getElementById('roleFilter').addEventListener('change', filterCharacters);
    document.getElementById('tierFilter').addEventListener('change', filterCharacters);
    
    // Action buttons
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    document.getElementById('exportCSV').addEventListener('click', exportToCSV);
}

// Filter characters based on all active filters
function filterCharacters() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    const starFilter = document.getElementById('starFilter').value;
    const jobFilter = document.getElementById('jobFilter').value;
    const roleFilter = document.getElementById('roleFilter').value;
    const tierFilter = document.getElementById('tierFilter').value;
    
    filteredCharacters = allCharacters.filter(char => {
        // Search filter
        if (searchTerm && !char.name.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Star rating filter
        if (starFilter && char.starRating?.toString() !== starFilter) {
            return false;
        }
        
        // Job filter
        if (jobFilter && char.jobType !== jobFilter) {
            return false;
        }
        
        // Role filter
        if (roleFilter && 
            char.roles?.primary !== roleFilter && 
            char.roles?.secondary !== roleFilter) {
            return false;
        }
        
        // Tier filter
        if (tierFilter && char.overallTier !== tierFilter) {
            return false;
        }
        
        return true;
    });
    
    renderCharacterGrid();
    updateStats();
}

// Reset all filters
function resetFilters() {
    document.getElementById('searchBox').value = '';
    document.getElementById('starFilter').value = '';
    document.getElementById('jobFilter').value = '';
    document.getElementById('roleFilter').value = '';
    document.getElementById('tierFilter').value = '';
    
    filteredCharacters = [...allCharacters];
    renderCharacterGrid();
    updateStats();
}

// Update statistics
function updateStats() {
    const totalChars = allCharacters.length;
    const filteredCount = filteredCharacters.length;
    const fiveStarCount = allCharacters.filter(char => char.starRating === 5).length;
    const metaTierCount = allCharacters.filter(char => 
        char.overallTier && ['S+', 'S'].includes(char.overallTier)
    ).length;
    
    document.getElementById('totalChars').textContent = totalChars;
    document.getElementById('filteredChars').textContent = filteredCount;
    document.getElementById('fiveStarChars').textContent = fiveStarCount;
    document.getElementById('metaTierChars').textContent = metaTierCount;
}

// Export to CSV
function exportToCSV() {
    const headers = [
        'Character', 'Star Rating', 'Job', 'Primary Role', 'Secondary Role', 
        'Overall Tier', 'A4 Tier', 'Ult Priority', 'Weapons', 'Elements', 
        'Can Overclass', 'Key Skills', 'Notes'
    ];
    
    const rows = filteredCharacters.map(char => [
        char.name,
        char.starRating || '',
        char.jobType || '',
        char.roles?.primary || '',
        char.roles?.secondary || '',
        char.overallTier || '',
        char.a4Tier || '',
        char.ultPriority || '',
        char.weaponTypes?.join(';') || '',
        char.elementTypes?.join(';') || '',
        char.canOverclass ? 'Yes' : 'No',
        char.keySkills?.join(';') || '',
        char.notes || ''
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cotc_character_details_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Theme management functions (reused from main app)
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