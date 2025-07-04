# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Local Development
```bash
# Start local server for testing
python -m http.server 8000
# Visit http://localhost:8000

# Alternative with PHP
php -S localhost:8000

# Alternative with Node.js
npx http-server -p 8080
```

### Data Validation
```bash
# Validate character data (requires Node.js)
node scripts/validate.js

# Manual JSON validation
python -m json.tool data/characters.json
```

### Git Workflow for Character Updates
```bash
# Create feature branch
git checkout -b update-character-name

# Edit data/characters.json, then commit
git add data/characters.json
git commit -m "Update Character Name awakening priorities"

# Push and create PR
git push origin update-character-name
```

## Architecture Overview

This is a **pure static site** with no build process or framework dependencies. The architecture follows a simple client-side pattern:

### Data Flow
1. **JSON Data Source**: All character information stored in `data/characters.json`
2. **Client-Side Loading**: JavaScript fetches JSON and populates the interface
3. **Real-Time Filtering**: All search/filter operations happen in-browser
4. **Theme System**: CSS custom properties with localStorage persistence
5. **User Data**: Personal character roster and preferences stored in localStorage

### Core Components

**Data Layer** (`data/characters.json`):
- Single source of truth for all character information
- Structured with metadata, character array, and validation fields
- Each character has: id, name, isFree, tiers, stone recommendations, notes, tags
- **Current**: 122 characters including EX versions, collaborations, and OT2 characters

**UI Layer** (`index.html` + `css/style.css`):
- Collapsible legend section with auto-scroll behavior
- Filter controls (search, dropdowns) with real-time updates
- Sortable data table with visual tier indicators
- Dark/light theme with OS preference detection + manual toggle

**Logic Layer** (`js/app.js`):
- Data loading and table population
- Search/filter/sort algorithms
- CSV export functionality
- Theme management with localStorage
- Legend collapse behavior (auto-collapse on scroll, manual toggle)

### Key Design Patterns

**CSS Custom Properties**: Extensive use of CSS variables for theming
```css
:root { --primary-color: #4a9eff; /* dark default */ }
body.light-theme { --primary-color: #0066cc; }
```

**Responsive Data Display**: Character stones get CSS classes for visual coding
```javascript
function getStoneClass(value) {
  const classMap = { 'U10': 'u10', 'A1': 'a1', 'Shard': 'shard' };
  return classMap[value] || '';
}
```

**Real-Time Filtering**: All operations work on in-memory arrays
```javascript
filteredCharacters = allCharacters.filter(char => {
  // Search, tier, priority, free/gacha filters
});
```

## Data Structure

### Character Schema
```json
{
  "id": "character_id",           // Unique lowercase identifier
  "name": "Display Name",         // Human-readable name
  "isFree": boolean,              // Story/event character vs gacha
  "a4Tier": "S+"|"S"|"A"|"B"|"C"|"D"|null,
  "ultPriority": "L10"|"L10 First"|"A1, L10"|"A4, L10"|"L9"|"L1",
  "ultPriorityGroup": "top"|"high"|"medium"|"low"|"lowest",
  "stones": {
    "AS1": "U10"|"A1"|"A2"|"A3"|"A4"|"Shard"|"Keep",
    "AS2": "...", "AS3": "...", "AS4": "...", "AS5": "..."
  },
  "notes": "Brief recommendation explanation",
  "tags": ["optional", "categorization", "array"]
}
```

### Validation Rules
- Free characters (`isFree: true`) typically use "Keep" instead of "Shard"
- IDs must be unique and lowercase
- All stone values must be from the approved list
- Ultimate priorities follow specific hierarchy

## Theme System Details

The site defaults to **dark theme** but respects OS preferences:

1. **Default**: Dark theme
2. **OS Detection**: `@media (prefers-color-scheme: light)` overrides for light users
3. **Manual Toggle**: Button saves preference to localStorage
4. **Theme Classes**: `body.light-theme` and `body.dark-theme` for manual overrides

## Important Files for Character Updates

- `data/characters.json` - All character data (primary edit target)
- `scripts/validate.js` - Data validation script
- `docs/CONTRIBUTING.md` - Contributor guidelines
- `.github/workflows/validate.yml` - Automated validation on PRs

## Planned Future Features

The following features are planned for future development:

### Character Information Enhancement
- **Star Rating Display**: Show character base star rating (3★, 4★, 5★) and 6★ overclass availability
- **Job Classification**: Display job types (Hunter, Warrior, Cleric, Scholar, Dancer, Merchant, Apothecary, Thief)
- **Role Analysis**: Show primary/secondary roles (DPS, Buffer, Debuffer, Healer, Tank, Support)
- **Role Rankings**: Tier rankings within each role type (S+/S/A/B/C tiers for DPS, Buffer, etc.)
- **Overall Meta Ranking**: Combined ranking considering all roles and meta relevance
- **Multi-Role Units**: Special highlighting for meta units that compress multiple roles (e.g., Primrose EX)
- **Key Skills Display**: Show signature abilities and what makes each character unique
- **Expanded Tag System**: Currently character tags exist in data but aren't displayed in UI

### Advanced Features (Previously Planned)
- **Team Building System**: Create teams for specific fights and content
- **Damage Calculations**: Algorithm display and skill optimization for max damage
- **Accessory Search**: Filter accessories by desired effects (PDF down, SP recovery, RES down, etc.)
- **Battle Simulations**: Calculate optimal damage combinations with specific characters and accessories
- **Advanced Filtering**: Filter by job type, role type, star rating, overclass availability

### Data Structure Enhancements Needed
The current character schema will need expansion to support:
```json
{
  "starRating": 3|4|5,
  "canOverclass": boolean,
  "jobType": "Hunter"|"Warrior"|"Cleric"|"Scholar"|"Dancer"|"Merchant"|"Apothecary"|"Thief",
  "roles": {
    "primary": "DPS"|"Buffer"|"Debuffer"|"Healer"|"Tank"|"Support",
    "secondary": "..." // optional
  },
  "roleTiers": {
    "DPS": "S+"|"S"|"A"|"B"|"C"|null,
    "Buffer": "...",
    "Debuffer": "..."
  },
  "overallRanking": "S+"|"S"|"A"|"B"|"C",
  "keySkills": ["Skill Name 1", "Skill Name 2"],
  "specialNotes": "Multi-role meta unit" // for compressed role units
}
```

### Implementation Priority
1. **Phase 1**: Star ratings, job types, and role display (basic info enhancement)
2. **Phase 2**: Role-specific tier rankings and overall meta ranking
3. **Phase 3**: Advanced filtering by new attributes
4. **Phase 4**: Team building and damage calculation systems

## Community-Driven Content

This guide is maintained by COTC players. When making character updates:
- Base changes on community consensus or meta shifts
- Test locally before committing
- Use descriptive commit messages
- One character per commit for easier review
- Include reasoning in PR descriptions