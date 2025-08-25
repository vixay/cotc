// Global variables
let allCharacters = [];
let filteredCharacters = [];

// Load character data on page load
document.addEventListener('DOMContentLoaded', async function() {
    initializeTheme();
    setupBackNavigation();
    await loadCharacterData();
    setupEventListeners();
});

// Load and display character data
async function loadCharacterData() {
    try {
        const response = await fetch('data/characters_enhanced_v2.json');
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
    const tierForStyling = char.overallTier || char.tierRatings?.gl?.tier || char.a4Tier;
    if (tierForStyling && ['S+', 'S'].includes(tierForStyling)) {
        card.classList.add('meta-tier');
    }
    
    const starRating = char.starRating || 5;
    const jobType = char.job || 'Unknown';
    const overallTier = char.overallTier || char.tierRatings?.gl?.tier || char.a4Tier || 'B';
    const influence = char.influence || 'Unknown';
    
    // Role information
    const primaryRole = char.roles?.primary || 'Unknown';
    const secondaryRole = char.roles?.secondary;
    
    // Weapon and element display
    const weapons = char.weapons?.join(', ') || 'Unknown';
    const elements = char.elements?.join(', ') || 'Unknown';
    const weaknesses = char.weaknesses?.join(', ') || 'Unknown';
    
    // Stats display
    const baseStats = char.stats?.base || {};
    const maxStats = char.stats?.max || {};
    
    // Role tiers display
    const roleTiersHtml = char.roleTiers ? 
        Object.entries(char.roleTiers)
            .map(([role, tier]) => `<span class="role-tier tier-${tier?.toLowerCase()?.replace('+', '-plus')}">${role}: ${tier}</span>`)
            .join('') : '';
    
    // Skills display - prefer keySkills from v1, fallback to passive skills
    const keySkills = char.keySkills || char.skills?.passive || [];
    const keySkillsHtml = keySkills.length > 0 ?
        `<div class="key-skills">
            <h4>${char.keySkills ? 'Key Abilities' : 'Passive Skills'}</h4>
            <ul class="skills-list">
                ${keySkills.map(skill => `<li>${skill}</li>`).join('')}
            </ul>
        </div>` : '';
    
    // Ultimate display
    const ultimateSkill = char.skills?.ultimate || 'Unknown';
    
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
                <span class="badge influence">${influence}</span>
                <span class="badge role-primary">${primaryRole}</span>
                ${secondaryRole ? `<span class="badge role-secondary">+${secondaryRole}</span>` : ''}
                <span class="badge overall-tier tier-${overallTier.toLowerCase().replace('+', '-plus')}">${overallTier}</span>
                ${char.canOverclass ? '<span class="badge overclass-available">6★</span>' : ''}
            </div>
        </div>
        
        <div class="character-info">
            <div class="info-section">
                <h4>Role Performance</h4>
                <div class="role-tiers">
                    ${roleTiersHtml || '<span class="role-tier">Not rated</span>'}
                </div>
            </div>
            
            <div class="info-section">
                <h4>Location</h4>
                <p><strong>Continent:</strong> ${char.continent || 'Unknown'}</p>
                <p><strong>Location:</strong> ${char.location || 'Unknown'}</p>
                <p><strong>Obtained From:</strong> ${char.obtainedFrom || 'Unknown'}</p>
            </div>
            
            <div class="info-section">
                <h4>Combat</h4>
                <p><strong>Weapons:</strong> ${weapons}</p>
                <p><strong>Elements:</strong> ${elements}</p>
                <p><strong>Weaknesses:</strong> ${weaknesses}</p>
            </div>
            
            <div class="info-section">
                <h4>Stats (Base → Max)</h4>
                <div class="stats-grid">
                    <div class="stat-item"><span>HP:</span> ${baseStats.hp || 'N/A'} → ${maxStats.hp || 'N/A'}</div>
                    <div class="stat-item"><span>SP:</span> ${baseStats.sp || 'N/A'} → ${maxStats.sp || 'N/A'}</div>
                    <div class="stat-item"><span>P.Atk:</span> ${baseStats.pAtk || 'N/A'} → ${maxStats.pAtk || 'N/A'}</div>
                    <div class="stat-item"><span>P.Def:</span> ${baseStats.pDef || 'N/A'} → ${maxStats.pDef || 'N/A'}</div>
                    <div class="stat-item"><span>E.Atk:</span> ${baseStats.eAtk || 'N/A'} → ${maxStats.eAtk || 'N/A'}</div>
                    <div class="stat-item"><span>E.Def:</span> ${baseStats.eDef || 'N/A'} → ${maxStats.eDef || 'N/A'}</div>
                    <div class="stat-item"><span>Crit:</span> ${baseStats.crit || 'N/A'} → ${maxStats.crit || 'N/A'}</div>
                    <div class="stat-item"><span>Speed:</span> ${baseStats.spd || 'N/A'} → ${maxStats.spd || 'N/A'}</div>
                </div>
            </div>
            
            <div class="info-section">
                <h4>Awakening</h4>
                <p><strong>Ultimate:</strong> ${char.ultPriority || 'Not Listed'}</p>
                <p><strong>Ultimate Skill:</strong> ${ultimateSkill}</p>
                <p><strong>A4 Tier:</strong> ${char.a4Tier || 'Not Listed'}</p>
                <div class="stones-row">
                    <strong>Stones:</strong>
                    <span class="stone as1 ${getStoneClass(char.stones?.AS1)}">${char.stones?.AS1 || 'N/A'}</span>
                    <span class="stone as2 ${getStoneClass(char.stones?.AS2)}">${char.stones?.AS2 || 'N/A'}</span>
                    <span class="stone as3 ${getStoneClass(char.stones?.AS3)}">${char.stones?.AS3 || 'N/A'}</span>
                    <span class="stone as4 ${getStoneClass(char.stones?.AS4)}">${char.stones?.AS4 || 'N/A'}</span>
                    <span class="stone as5 ${getStoneClass(char.stones?.AS5)}">${char.stones?.AS5 || 'N/A'}</span>
                </div>
            </div>
            
            ${char.notes ? `<div class="info-section">
                <h4>Notes</h4>
                <p>${char.notes}</p>
            </div>` : ''}
        </div>
        
        ${keySkillsHtml}
    `;
    
    return card;
}

// Stone priority class mapping (matching main app)
function getStoneClass(value) {
    if (!value) return '';
    
    const classMap = {
        'U10': 'u10',
        'A1': 'a1', 'A2': 'a2', 'A3': 'a3', 'A4': 'a4',
        'Shard': 'shard',
        'Keep': 'keep'
    };
    
    return classMap[value] || '';
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
        if (jobFilter && char.job !== jobFilter) {
            return false;
        }
        
        // Role filter
        if (roleFilter && 
            char.roles?.primary !== roleFilter && 
            char.roles?.secondary !== roleFilter) {
            return false;
        }
        
        // Tier filter
        const charTier = char.overallTier || char.tierRatings?.gl?.tier || char.a4Tier;
        if (tierFilter && charTier !== tierFilter) {
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
    const metaTierCount = allCharacters.filter(char => {
        const tier = char.overallTier || char.tierRatings?.gl?.tier || char.a4Tier;
        return tier && ['S+', 'S'].includes(tier);
    }).length;
    
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

// Setup smart back navigation
function setupBackNavigation() {
    const backLink = document.getElementById('backToGuide');
    if (!backLink) return;

    // Check URL parameters first (e.g., character-details.html?from=vue)
    const urlParams = new URLSearchParams(window.location.search);
    const fromParam = urlParams.get('from');
    
    if (fromParam === 'vue') {
        backLink.href = 'index-vue.html';
        return;
    }
    
    // Check referrer
    const referrer = document.referrer;
    if (referrer) {
        const referrerUrl = new URL(referrer);
        const referrerPath = referrerUrl.pathname;
        
        // If referred from index-vue.html, go back to Vue version
        if (referrerPath.includes('index-vue.html')) {
            backLink.href = 'index-vue.html';
            return;
        }
        
        // If referred from same origin, try to use the specific referrer
        if (referrerUrl.origin === window.location.origin) {
            const filename = referrerPath.split('/').pop();
            if (filename === 'index-vue.html' || filename === 'index.html') {
                backLink.href = filename;
                return;
            }
        }
    }
    
    // Default fallback - check which version exists or is preferred
    // Try to detect Vue version preference from localStorage
    const vueMigrationSeen = localStorage.getItem('vue-migration-seen');
    if (vueMigrationSeen === 'true') {
        backLink.href = 'index-vue.html';
    } else {
        backLink.href = 'index.html';
    }
}