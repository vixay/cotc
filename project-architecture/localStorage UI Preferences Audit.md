---
title: localStorage UI Preferences Audit
type: note
permalink: project-architecture/local-storage-ui-preferences-audit
---

# localStorage UI Preferences Audit

## Current localStorage Usage

### ✅ Properly Persisted Preferences
1. **Theme**: `localStorage.getItem('theme')` - Used in App.vue and FiltersSection.vue
2. **Character Store State**: `localStorage.getItem('cotc-vue-data')` - Comprehensive state management
   - `filters` - All filter states
   - `ui` - UI preferences (view, advanced filters, theme, sorting, grouping, columns)
   - `userCharacterData` - User-specific character data

3. **Legacy System** (from old static version):
   - `cotc-collapsed-groups` - Visual grouping collapse states
   - `cotc-column-visibility` - Column visibility preferences
   - `cotc-visual-grouping` - Visual grouping enabled/disabled
   - `cotc-column-filters` - Column filter states
   - `cotc-user-data` - Legacy user data
   - `cotc-app-state` - Legacy app state

4. **Debug Preferences**: `localStorage.getItem('cotc-debug')` - Debug mode toggle

### ❌ Missing from localStorage (UnifiedSearchPage)
**These UI preferences are NOT being persisted:**

1. `showAdvancedFilters` - Whether advanced filters panel is expanded
2. `pageSize` - Results per page (25, 50, 100)
3. `selectedContentTypes` - Skills/accessories filter selection
4. `selectedCharacters` - Character filter selection
5. `selectedSkillTypes` - Skill type filters
6. `selectedAccessoryTypes` - Accessory type filters
7. `selectedTags` - Tag filters
8. `spCostRange` - SP cost range filters
9. `searchMode` - Search mode (any/all)

## Solution Strategy

### Recommended Approach
Integrate UnifiedSearchPage preferences into the existing character store UI state system:

1. **Added to character.js**: New `ui.unifiedSearch` section for UnifiedSearchPage preferences
2. **Next Steps**: Update UnifiedSearchPage to use store instead of local reactive refs
3. **Benefits**: 
   - Consistent localStorage management
   - Automatic persistence via existing `saveUserData()` method
   - No duplicate localStorage keys
   - Centralized UI state management

### Implementation Plan
```javascript
// In character store ui.unifiedSearch:
{
  pageSize: 25,
  selectedContentTypes: [],
  selectedCharacters: [],
  selectedSkillTypes: [],
  selectedAccessoryTypes: [],
  selectedTags: [],
  spCostRange: { min: null, max: null },
  searchMode: 'any'
}
```

### Migration Required
- Update UnifiedSearchPage.vue to use `characterStore.ui.unifiedSearch` instead of local refs
- Ensure `characterStore.saveUserData()` is called when preferences change
- Test that preferences persist across page reloads and navigation

## Current State
- ✅ Added `ui.unifiedSearch` to character store
- ⏳ Need to update UnifiedSearchPage to use store state
- ⏳ Need to ensure saveUserData() is called on preference changes