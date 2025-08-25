# Code Organization & Architecture

## 📁 File Structure

```
cotc/
├── index.html                      # Main application entry point
├── character-details.html          # Character details page (legacy)
├── css/
│   └── style.css                   # All styles (could be split later)
├── js/
│   ├── app.js                      # Core application logic
│   ├── filters.js                  # Basic filtering (legacy)
│   ├── visual-grouping.js          # Visual tier grouping system
│   ├── character-modal.js          # Character details modal
│   └── column-filters.js           # Advanced column filtering (new)
├── data/
│   ├── characters_enhanced_v2.json # Main production data (244 chars)
│   ├── characters_jp.json          # JP-specific data
│   ├── schema.json                 # Data validation schema
│   └── Character Markdown/         # Individual character descriptions
├── images/                         # Character and skill icons
├── docs/                           # Documentation
│   ├── TESTING_CHECKLIST.md        # Testing procedures
│   ├── CODE_ORGANIZATION.md        # This file
│   ├── CHANGELOG.md                # Version history
│   └── CONTRIBUTING.md             # Contributor guidelines
└── .github/                        # GitHub integration
    ├── ISSUE_TEMPLATE/              # Bug/feature templates
    └── workflows/                   # CI/CD validation
```

## 🏗️ JavaScript Architecture

### Core Modules

#### 1. **app.js** - Core Application
```javascript
// Global state
let allCharacters = [];
let filteredCharacters = [];
let userCharacterData = {};

// Core functions
- loadCharacterData()      // Load v2 JSON data
- renderTable()            // Basic table rendering (overridden by visual-grouping)
- setupEventListeners()    // Basic event handlers
- filterTable()            // Legacy filtering
- updateStats()            // Character count display
```

#### 2. **visual-grouping.js** - Enhanced Table Display
```javascript
// State management
let visualGroupingEnabled = true;

// Core functions
- renderVisualGroupedTable()    // Grouped table with collapsible headers
- toggleColumnGroup()           // Show/hide column groups
- setupEnhancedEventListeners() // Event delegation
- resetToDefaults()             // Complete state reset

// Overrides
window.renderTable = enhanced version
```

#### 3. **column-filters.js** - Advanced Filtering (New)
```javascript
// Filter state
let activeFilters = { starRating: [], job: [], ... };

// Classes
- FilterDropdown              // Individual filter dropdown component

// Core functions
- initializeColumnFilters()   // Setup all filters
- applyColumnFilters()        // Apply multi-select filters
- getFilterOptions()          // Extract options from data
```

#### 4. **character-modal.js** - Character Details
```javascript
// Modal system
class CharacterModal {
  - open(character)           // Show character details
  - loadCharacterData()       // Load markdown content
  - generateOverview()        // Stats and basic info
}
```

### Data Flow

```
User Action → Event Handler → State Update → UI Update
     ↓              ↓              ↓           ↓
  Click filter → applyFilters() → filteredCharacters → renderTable()
```

### State Management

#### Global Variables (app.js)
- `allCharacters`: Complete character dataset
- `filteredCharacters`: Characters after all filters applied
- `userCharacterData`: Ownership/progress tracking

#### Module-Specific State
- `visual-grouping.js`: `visualGroupingEnabled`, collapse states
- `column-filters.js`: `activeFilters` object

#### Persistence (localStorage)
- `cotc-user-data`: Ownership and progress
- `cotc-column-visibility`: Show/hide columns
- `cotc-visual-grouping`: Grouping enabled/disabled
- `cotc-collapsed-groups`: Expanded/collapsed tiers
- `cotc-column-filters`: Active filter selections
- `theme`: Light/dark preference

## 🎯 Design Patterns

### 1. **Override Pattern**
```javascript
// visual-grouping.js overrides app.js functions
const originalRenderTable = window.renderTable;
window.renderTable = function() {
  // Enhanced implementation
};
```

### 2. **Event Delegation**
```javascript
// Handle dynamic content with event delegation
document.getElementById('tableBody').addEventListener('click', function(e) {
  if (e.target.classList.contains('character-name-link')) {
    // Handle character modal
  }
});
```

### 3. **Component Classes**
```javascript
class FilterDropdown {
  constructor(columnId, filterType, options) { }
  init() { }         // Setup event handlers
  toggle() { }       // Show/hide dropdown
  applyFilter() { }  // Update global state
}
```

### 4. **State Synchronization**
```javascript
// Always save state after changes
function updateCharacterData(charId, field, value) {
  userCharacterData[charId][field] = value;
  saveUserData(); // Immediate persistence
}
```

## 🧩 Integration Points

### Module Interactions

```
app.js ←→ visual-grouping.js
   ↓         ↓
   └─→ column-filters.js
           ↓
   character-modal.js
```

### Critical Dependencies
1. `allCharacters` must be loaded before other modules initialize
2. `filteredCharacters` is shared between all filtering systems
3. DOM elements must exist before event handlers attach
4. localStorage operations should be wrapped in try/catch

## 📋 Code Standards

### Naming Conventions
- **Functions**: `camelCase` (e.g., `renderTable`, `applyFilters`)
- **Classes**: `PascalCase` (e.g., `FilterDropdown`, `CharacterModal`)
- **Constants**: `UPPER_CASE` (e.g., `TIER_ORDER`, `VALID_STONES`)
- **DOM IDs**: `kebab-case` (e.g., `character-table`, `search-box`)
- **CSS Classes**: `kebab-case` (e.g., `.filter-dropdown`, `.group-header`)

### Error Handling
```javascript
// Always wrap localStorage operations
try {
  const saved = localStorage.getItem('cotc-user-data');
  userCharacterData = JSON.parse(saved);
} catch (e) {
  console.error('Error loading user data:', e);
  userCharacterData = {}; // Fallback
}
```

### Event Cleanup
```javascript
// Remove listeners before adding new ones
button.removeEventListener('click', handler);
button.addEventListener('click', handler);
```

## 🔄 Testing Integration

### Unit Testing Candidates
- `getFilterOptions()` - Data extraction logic
- `applySortLogic()` - Sorting algorithms  
- `generateRowHTML()` - Template generation
- Filter validation functions

### Integration Testing Points
- Data loading → Table rendering
- Filtering → State updates → UI refresh
- User interactions → localStorage persistence

## 🚀 Performance Considerations

### Optimization Strategies
1. **Debounce**: Search input, filter applications
2. **Memoization**: Cache filter options, DOM queries
3. **Virtual Scrolling**: If character count grows significantly
4. **Code Splitting**: Separate non-critical features

### Memory Management
- Remove event listeners when destroying components
- Avoid global variable pollution
- Clean up setInterval/setTimeout
- Monitor DOM node creation/destruction

## 📈 Future Architecture

### Scalability Plans
1. **Module Federation**: Split into more focused modules
2. **State Management**: Consider Redux-like pattern for complex state
3. **TypeScript**: Add type safety as complexity grows
4. **Build Process**: Add bundling/minification when needed

### Potential Modules
```
js/
├── core/
│   ├── data-manager.js      # Data loading/caching
│   ├── state-manager.js     # Centralized state
│   └── event-bus.js         # Module communication
├── components/
│   ├── data-table.js        # Enhanced table component
│   ├── filter-system.js     # Complete filtering
│   └── character-modal.js   # Enhanced modal
└── utils/
    ├── dom-helpers.js       # DOM manipulation
    ├── validators.js        # Data validation
    └── formatters.js        # Display formatting
```

## 🛡️ Defensive Programming

### Input Validation
```javascript
function updateCharacterData(charId, field, value) {
  if (!charId || !field) {
    console.error('Invalid parameters:', { charId, field, value });
    return;
  }
  // Continue with valid inputs
}
```

### Graceful Degradation
```javascript
// Fallback if advanced features fail
if (typeof window.renderTable === 'function') {
  window.renderTable();
} else {
  // Basic table rendering fallback
  console.warn('Enhanced rendering unavailable, using basic fallback');
}
```

### Feature Detection
```javascript
// Check for required browser features
if (!window.localStorage) {
  console.warn('localStorage not available, features will not persist');
}
```