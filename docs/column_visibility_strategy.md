# Column Visibility Strategy

This document outlines the column visibility system to support multiple display views as defined in the [Display Views Roadmap](./display_views_roadmap.md).

## 🎯 View-Based Column Strategy

### 1. **Awakening Priority View** (Current - Enhanced)
**Purpose**: Quick decisions on stone usage  
**Users**: All players needing awakening guidance

**Columns**:
- Character Name (with free indicator)
- A4 Tier 
- Ult Priority
- AS1, AS2, AS3, AS4, AS5 (awakening stones)
- Awaken, Ult (action buttons)
- Notes

**Features**: Current functionality + sortable notes column

### 2. **Meta Tier List View** (High Priority)
**Purpose**: Overall character rankings  
**Users**: New players, returning players

**Columns**:
- Character Name
- Star Rating (visual stars)
- Job/Role
- Overall Tier (S+/S/A/B/C/D - different from A4 tier)
- Key Strengths (short tags)
- Investment Priority (Low/Medium/High/Must Pull)
- Obtained From
- Free Status

**Special Features**:
- Visual tier grouping (colored sections)
- "Why this tier" tooltip on hover
- Reroll recommendation badges

### 3. **Character Details View** (High Priority)
**Purpose**: Deep dive into individual characters  
**Users**: Players evaluating specific units

**Columns**:
- Character Name
- Job
- Star Rating
- Base Stats (HP, SP, P.Atk, P.Def, E.Atk, E.Def, Crit, Speed)
- Max Stats (Level 120)
- Elements & Weapons
- Weaknesses
- A4 Tier
- Ult Priority
- Awakening Benefits
- Notes

### 4. **Team Builder View** (Future)
**Purpose**: Build optimal teams  
**Users**: Mid-to-endgame players

**Columns**:
- Character Name
- Job
- Role Tags (DPS, Buffer, Debuffer, Healer, Tank)
- Elements
- Weapons
- Key Skills Summary
- Team Synergy Score
- Speed Tier

### 5. **Collection Tracker View** (Future)
**Purpose**: Track collection progress  
**Users**: Completionists

**Columns**:
- Character Name (visual card style)
- Star Rating
- Obtained From
- Limited/Permanent Status
- Owned Status (prominent)
- Release Date

## 🔧 Technical Implementation

### Column Configuration System
```javascript
const VIEW_CONFIGS = {
  awakening: {
    label: 'Awakening Priority',
    description: 'Current awakening stone guide',
    columns: ['name', 'a4Tier', 'ultPriority', 'AS1', 'AS2', 'AS3', 'AS4', 'AS5', 'notes'],
    defaultSort: 'a4Tier',
    features: ['ownership', 'export', 'grouping']
  },
  
  meta: {
    label: 'Meta Tier List', 
    description: 'Overall character rankings',
    columns: ['name', 'starRating', 'job', 'overallTier', 'keyStrengths', 'investmentPriority', 'obtainedFrom', 'isFree'],
    defaultSort: 'overallTier',
    features: ['tierGrouping', 'rerollBadges']
  },
  
  details: {
    label: 'Character Details',
    description: 'Complete character information',
    columns: ['name', 'job', 'starRating', 'baseHP', 'baseSP', 'basePAtk', 'baseEAtk', 'elements', 'weapons', 'a4Tier', 'ultPriority', 'notes'],
    defaultSort: 'name',
    features: ['statComparison', 'expandableRows']
  },
  
  team: {
    label: 'Team Builder',
    description: 'Build optimal teams',
    columns: ['name', 'job', 'roleTags', 'elements', 'weapons', 'keySkills', 'speedTier'],
    defaultSort: 'job',
    features: ['roleFiltering', 'teamSelection']
  },
  
  collection: {
    label: 'Collection Tracker',
    description: 'Track your collection',
    columns: ['name', 'starRating', 'obtainedFrom', 'limitedStatus', 'owned', 'releaseDate'],
    defaultSort: 'releaseDate',
    features: ['cardView', 'collectionStats']
  },
  
  custom: {
    label: 'Custom View',
    description: 'Choose your own columns',
    columns: [], // User defined
    features: ['columnSelector']
  }
};
```

### Enhanced Column Definitions
```javascript
const COLUMN_DEFINITIONS = {
  // Basic Info
  name: { label: 'Character', type: 'text', required: true, sortable: true },
  job: { label: 'Job', type: 'text', sortable: true },
  starRating: { label: 'Stars', type: 'visual-stars', sortable: true },
  isFree: { label: 'Free', type: 'boolean-badge', sortable: true },
  
  // Tier Systems
  a4Tier: { label: 'A4 Tier', type: 'tier-badge', sortable: true },
  overallTier: { label: 'Overall Tier', type: 'tier-badge', sortable: true },
  ultPriority: { label: 'Ult Priority', type: 'priority-badge', sortable: true },
  
  // Awakening Stones
  AS1: { label: 'AS1', type: 'stone-badge', sortable: false },
  AS2: { label: 'AS2', type: 'stone-badge', sortable: false },
  AS3: { label: 'AS3', type: 'stone-badge', sortable: false },
  AS4: { label: 'AS4', type: 'stone-badge', sortable: false },
  AS5: { label: 'AS5', type: 'stone-badge', sortable: false },
  
  // Stats
  baseHP: { label: 'HP', type: 'number', sortable: true, source: 'stats.base.hp' },
  baseSP: { label: 'SP', type: 'number', sortable: true, source: 'stats.base.sp' },
  basePAtk: { label: 'P.Atk', type: 'number', sortable: true, source: 'stats.base.pAtk' },
  basePDef: { label: 'P.Def', type: 'number', sortable: true, source: 'stats.base.pDef' },
  baseEAtk: { label: 'E.Atk', type: 'number', sortable: true, source: 'stats.base.eAtk' },
  baseEDef: { label: 'E.Def', type: 'number', sortable: true, source: 'stats.base.eDef' },
  baseCrit: { label: 'Crit', type: 'number', sortable: true, source: 'stats.base.crit' },
  baseSpeed: { label: 'Speed', type: 'number', sortable: true, source: 'stats.base.spd' },
  
  // Combat Info
  elements: { label: 'Elements', type: 'tag-list', sortable: false },
  weapons: { label: 'Weapons', type: 'tag-list', sortable: false },
  weaknesses: { label: 'Weaknesses', type: 'tag-list', sortable: false },
  
  // Meta Info
  obtainedFrom: { label: 'Obtained From', type: 'text', sortable: true },
  keyStrengths: { label: 'Key Strengths', type: 'tag-list', sortable: false },
  investmentPriority: { label: 'Investment', type: 'priority-badge', sortable: true },
  roleTags: { label: 'Roles', type: 'tag-list', sortable: false },
  
  // Additional
  notes: { label: 'Notes', type: 'text', sortable: true },
  releaseDate: { label: 'Release Date', type: 'date', sortable: true }
};
```

## 🎨 UI Implementation

### View Selector
```html
<div class="view-controls">
  <div class="view-tabs">
    <button class="view-tab active" data-view="awakening">Awakening Priority</button>
    <button class="view-tab" data-view="meta">Meta Tier List</button>
    <button class="view-tab" data-view="details">Character Details</button>
    <button class="view-tab" data-view="custom">Custom</button>
  </div>
  
  <div class="view-description">
    <span id="viewDescription">Current awakening stone guide</span>
  </div>
  
  <button id="customizeView" class="customize-btn">
    <i class="icon-settings"></i> Customize
  </button>
</div>
```

### Data Requirements for New Views

#### Meta Tier List View Needs:
- `overallTier` field (S+/S/A/B/C/D for general meta ranking)
- `keyStrengths` array (e.g., ["AoE DPS", "Debuffer", "Speed"])
- `investmentPriority` field ("Low"/"Medium"/"High"/"Must Pull")
- `roleTags` array (["DPS", "Buffer"] etc.)

#### These can be added to the v2 data structure:
```json
{
  "name": "Primrose EX",
  "overallTier": "S+",
  "keyStrengths": ["Multi-role Buffer", "Debuffer", "Meta Compression"],
  "investmentPriority": "Must Pull",
  "roleTags": ["Buffer", "Debuffer", "Support"],
  "speedTier": "Fast"
}
```

## 📱 Mobile Considerations

### Responsive Column Priority
**Priority 1 (Always show)**:
- Character Name
- Main tier (A4 or Overall depending on view)

**Priority 2 (Show on tablet+)**:
- Star Rating
- Key action columns (AS stones, Investment Priority)

**Priority 3 (Desktop only)**:
- Stats, detailed info, notes

### Touch-Friendly Features
- Larger tap targets for sort headers
- Swipe to switch between views
- Expandable rows for details on mobile

## 🚀 Implementation Phases

### Phase 1: Enhanced Current View
- [x] Add Notes column sorting
- [ ] Add column hide/show toggles
- [ ] Save view preferences

### Phase 2: Meta Tier List View
- [ ] Add meta tier data to characters
- [ ] Implement visual tier grouping
- [ ] Add investment priority indicators
- [ ] Create "why this tier" tooltips

### Phase 3: Character Details View
- [ ] Expandable stat comparison
- [ ] Full skill descriptions integration
- [ ] Equipment recommendations

### Phase 4: Advanced Views
- [ ] Team Builder functionality
- [ ] Collection Tracker grid view
- [ ] Custom column builder

This strategy provides a clear path from the current awakening guide to a comprehensive character analysis platform while maintaining backward compatibility.