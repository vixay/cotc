# Unified Column Visibility Strategy

This document consolidates the column visibility system based on the Display Views Roadmap, previous strategies, and user feedback.

## 🎯 Core Principles

### Column Groups (Per User Feedback)
1. **Ownership Data Group**: Own, Awaken, Ult (user tracking)
2. **Tiers Group**: Overall Tier, A4 Tier, Ult Priority
   - *Special Rule*: Ult Priority toggle also controls AS1-AS5 visibility
3. **Core Info**: Name, Job, Stars, Overall Tier, Roles (default visible)
4. **Stats Group**: HP, SP, P.Atk, E.Atk, Crit, Speed
5. **Combat Group**: Weapons, Elements, Weaknesses
6. **Meta Group**: Role Tiers, Key Skills, Notes
7. **Location Group**: Continent, Obtained From, Release Date

### Default View Configuration
**Always Visible**: Name, Job, Stars, Overall Tier, Roles
**Optional Groups**: All others toggled via group controls

## 📋 View Modes (from Display Views Roadmap)

### 1. **Awakening Priority View** (Current - Enhanced)
**Purpose**: Stone usage decisions
**Columns**: Name, A4 Tier, Ult Priority, AS1-AS5, Own/Awaken/Ult, Notes
**Features**: Current functionality, sortable notes
**Status**: ✅ Active (needs column toggles)

### 2. **Meta Tier List View**
**Purpose**: Overall character evaluation
**Columns**: Name, Stars, Job, Overall Tier, Roles, Key Strengths, Investment Priority
**Features**: Visual tier grouping, reroll badges
**Status**: 📋 Phase 1 Priority

### 3. ~~**Character Details View**~~
**Status**: ❌ Not needed - Already implemented as:
- Separate character details page with cards
- Modal popup when clicking character names

### 4. **Team Builder View**
**Purpose**: Team composition
**Columns**: Name, Job, Roles, Elements, Weapons, Speed Tier, Synergy Tags
**Features**: Role filtering, team slots
**Status**: 📋 Phase 2

### 5. **Collection Tracker View**
**Purpose**: Collection progress
**Columns**: Name (card style), Stars, Obtained From, Limited Status, Owned
**Features**: Visual grid option, statistics
**Status**: 📋 Phase 2

### 6. **Custom View**
**Purpose**: User-defined columns
**Columns**: User selectable from all available
**Features**: Save/load configurations

## 🔧 Technical Implementation

### Column Configuration Structure
```javascript
const COLUMN_GROUPS = {
  ownership: {
    label: 'Ownership',
    columns: ['own', 'awaken', 'ult'],
    defaultVisible: true,
    description: 'Track your character progress'
  },
  
  tiers: {
    label: 'Tier Ratings',
    columns: ['overallTier', 'a4Tier', 'ultPriority'],
    linkedColumns: {
      'ultPriority': ['AS1', 'AS2', 'AS3', 'AS4', 'AS5'] // Special rule
    },
    defaultVisible: true,
    description: 'Character power rankings'
  },
  
  core: {
    label: 'Basic Info',
    columns: ['name', 'job', 'starRating', 'overallTier', 'roles'],
    defaultVisible: true,
    alwaysVisible: ['name'], // Cannot be hidden
    description: 'Essential character information'
  },
  
  stats: {
    label: 'Combat Stats',
    columns: ['hp', 'sp', 'pAtk', 'pDef', 'eAtk', 'eDef', 'crit', 'speed'],
    defaultVisible: false,
    description: 'Base character statistics'
  },
  
  combat: {
    label: 'Combat Info',
    columns: ['weapons', 'elements', 'weaknesses'],
    defaultVisible: false,
    description: 'Weapons, elements, and weaknesses'
  },
  
  meta: {
    label: 'Meta Information',
    columns: ['roleTiers', 'keySkills', 'notes'],
    defaultVisible: false,
    description: 'Role performance and recommendations'
  },
  
  location: {
    label: 'Acquisition',
    columns: ['continent', 'obtainedFrom', 'releaseDate'],
    defaultVisible: false,
    description: 'Where and how to obtain'
  }
};

// View mode presets
const VIEW_PRESETS = {
  awakening: {
    label: 'Awakening Priority',
    groups: ['ownership', 'tiers', 'meta'],
    customColumns: ['notes']
  },
  
  meta: {
    label: 'Meta Tier List',
    groups: ['core', 'meta'],
    customColumns: ['investmentPriority', 'keyStrengths']
  },
  
  
  teamBuilder: {
    label: 'Team Builder',
    groups: ['core', 'combat'],
    customColumns: ['speedTier', 'synergyTags']
  },
  
  collection: {
    label: 'Collection Tracker',
    groups: ['core', 'ownership', 'location'],
    customColumns: ['limitedStatus']
  }
};
```

## 🎨 UI Design

### Column Toggle Interface
```html
<div class="column-controls">
  <!-- View Mode Tabs -->
  <div class="view-tabs">
    <button class="view-tab active" data-view="awakening">Awakening</button>
    <button class="view-tab" data-view="meta">Meta Tier</button>
    <button class="view-tab" data-view="teamBuilder">Team Builder</button>
    <button class="view-tab" data-view="collection">Collection</button>
    <button class="view-tab" data-view="custom">Custom</button>
  </div>
  
  <!-- Column Group Toggles -->
  <div class="column-groups">
    <button class="group-toggle active" data-group="ownership">
      <i class="icon-check"></i> Ownership
    </button>
    <button class="group-toggle active" data-group="tiers">
      <i class="icon-check"></i> Tiers
    </button>
    <button class="group-toggle" data-group="stats">
      <i class="icon-minus"></i> Stats
    </button>
    <button class="group-toggle" data-group="combat">
      <i class="icon-minus"></i> Combat
    </button>
    <button class="group-toggle" data-group="meta">
      <i class="icon-minus"></i> Meta
    </button>
    <button class="group-toggle" data-group="location">
      <i class="icon-minus"></i> Location
    </button>
  </div>
  
  <!-- Quick Actions -->
  <div class="column-actions">
    <button id="showAllColumns">Show All</button>
    <button id="resetColumns">Reset to Default</button>
    <button id="customizeColumns">Customize...</button>
  </div>
</div>
```

### Mobile Behavior
**< 768px**: Show only core columns + primary action column
**768px - 1024px**: Show core + ownership + selected group
**> 1024px**: Show all selected groups

## 📊 Data Requirements

### Required Fields for Full Implementation
```javascript
// Current v2 fields used
{
  // Core
  "name": "Character Name",
  "job": "Warrior",
  "starRating": 5,
  
  // Tiers
  "overallTier": "S+",        // Need to add/calculate
  "a4Tier": "S",
  "ultPriority": "L10",
  
  // Ownership (localStorage)
  "own": true/false,
  "awaken": 0-4,
  "ult": 1-10,
  
  // Stats
  "stats": {
    "base": { hp, sp, pAtk, pDef, eAtk, eDef, crit, speed }
  },
  
  // Combat
  "weapons": ["Sword", "Axe"],
  "elements": ["Fire", "Dark"],
  "weaknesses": ["Ice", "Light"],
  
  // Meta
  "roles": { primary: "DPS", secondary: "Debuffer" },
  "roleTiers": { "DPS": "S+", "Debuffer": "A" },
  "keySkills": ["AoE Nuke", "PDF Down"],
  "notes": "Recommendation text",
  
  // Location
  "continent": "Orsterra",
  "obtainedFrom": "Limited Guidance",
  "releaseDate": "2022-07-27"
}
```

### Fields to Add/Calculate
1. **overallTier**: Combine role tiers + a4Tier for meta ranking
2. **investmentPriority**: Derive from tiers ("Must Pull", "High", "Medium", "Low")
3. **keyStrengths**: Extract from keySkills/notes
4. **speedTier**: Calculate from speed stat breakpoints
5. **synergyTags**: Derive from skills/roles

## 🚀 Implementation Phases

### Phase 1: Core Column System
- [ ] Implement column group toggles
- [ ] Add Ult Priority → AS1-AS5 linked visibility
- [ ] Save preferences to localStorage
- [ ] Mobile responsive column priorities

### Phase 2: View Presets
- [ ] Add view mode tabs
- [ ] Implement preset configurations
- [ ] Quick switch between views
- [ ] Custom view builder

### Phase 3: Advanced Features
- [ ] Column reordering (drag & drop)
- [ ] Column width adjustment
- [ ] Export respects visibility
- [ ] URL state for sharing

### Phase 4: New Data Integration
- [ ] Calculate overallTier from existing data
- [ ] Add missing meta fields
- [ ] Implement view-specific features

## ✅ Success Criteria
1. **Group Control**: Toggle entire column groups with one click
2. **Special Rules**: Ult Priority controls AS1-AS5 visibility
3. **Default View**: Shows Name, Job, Stars, Overall Tier, Roles
4. **Persistence**: Settings saved across sessions
5. **Performance**: No lag with 244+ characters
6. **Mobile**: Automatic column hiding on small screens
7. **Export**: CSV respects current visibility

## 🎯 Next Steps
1. Implement column group toggle UI
2. Add special rule for Ult Priority → AS columns
3. Create view preset system
4. Add localStorage persistence
5. Test mobile responsive behavior