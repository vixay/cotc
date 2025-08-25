# COTC Awakening Stone Guide - Testing Checklist

## 🧪 Pre-Release Testing Protocol

### 1. **Page Load & Initial State**
- [ ] Page loads without JavaScript errors (check console)
- [ ] All 244 characters load correctly
- [ ] Version number displays correctly
- [ ] Last updated date is accurate
- [ ] Default theme loads (dark/light based on OS preference)
- [ ] Legend section is visible and collapsible
- [ ] Stats show correct total/filtered counts

### 2. **Core Table Functionality**
#### Visual Grouping
- [ ] Characters grouped by tier on initial load
- [ ] Tier headers show correct character counts
- [ ] S+ tier appears first, then S, A, B, C, D
- [ ] No invalid tiers (like "E") appear
- [ ] Expand/collapse individual tier groups works
- [ ] "Expand All" / "Collapse All" buttons work
- [ ] Group state persists on page reload

#### Column Visibility
- [ ] Default columns visible: Basic Info, Tiers, Notes
- [ ] Default columns hidden: Ownership, Awakening Stones, Combat, Acquisition
- [ ] Each column group toggle works correctly
- [ ] Character name always remains visible
- [ ] Column visibility persists on page reload
- [ ] AS1-AS5 shows "N/A" for 3★/4★ characters

#### Sorting
- [ ] Click column headers to sort
- [ ] Sort indicators appear correctly
- [ ] Sorting works within grouped view
- [ ] Tier sorting respects hierarchy (S+ → S → A → B → C → D)
- [ ] Notes sorting prioritizes characters with notes

### 3. **Search & Filtering**
#### Basic Filters
- [ ] Character name search works (case-insensitive)
- [ ] A4 Tier filter dropdown works
- [ ] Ultimate Priority filter dropdown works
- [ ] Free/Gacha filter works
- [ ] Ownership filter works (All/Owned/Not Owned)
- [ ] Multiple filters combine correctly (AND logic)

#### Column Filters (New)
- [ ] Filter indicators (▼) appear on filterable columns
- [ ] Click column header opens filter dropdown
- [ ] Filter dropdown floats above table
- [ ] Multi-select checkboxes work
- [ ] "Select All" checkbox works
- [ ] Search within filter dropdown works
- [ ] Apply/Cancel buttons work
- [ ] Clear button resets filter
- [ ] Active filter badges show count
- [ ] Filters persist on page reload

#### Unreleased Characters
- [ ] Toggle shows/hides characters without release date
- [ ] Toggle shows/hides characters with future release date
- [ ] Toggle state persists on page reload

### 4. **Character Details Modal**
- [ ] Click character name opens modal
- [ ] Modal displays correct character information
- [ ] Stats table shows base and max values
- [ ] Weapon/element icons display correctly
- [ ] Skills section loads from markdown
- [ ] Modal close button (X) works
- [ ] Click outside modal closes it
- [ ] ESC key closes modal

### 5. **Ownership Tracking**
- [ ] Ownership checkbox toggles correctly
- [ ] Awakening level input (0-4) works
- [ ] Ultimate level input (1-10) works
- [ ] Level inputs disabled when not owned
- [ ] Owned characters highlighted
- [ ] Data persists on page reload

### 6. **User Actions**
- [ ] Theme toggle switches between light/dark
- [ ] Theme preference persists
- [ ] Reset button restores all defaults
- [ ] Export CSV includes filtered data
- [ ] CSV has correct headers and data

### 7. **UI/UX Elements**
- [ ] Legend auto-collapses when scrolling down
- [ ] Legend manual toggle works (5-second override)
- [ ] Credits section expands/collapses
- [ ] All links open in new tabs (target="_blank")
- [ ] Hover states work on all interactive elements
- [ ] No overlapping or cut-off content

### 8. **Responsive Design**
#### Desktop (1920x1080)
- [ ] Full table visible without horizontal scroll
- [ ] All features accessible
- [ ] Modals centered properly

#### Tablet (768x1024)
- [ ] Table scrolls horizontally if needed
- [ ] Touch interactions work
- [ ] Filter dropdowns position correctly

#### Mobile (375x667)
- [ ] Readable without zooming
- [ ] Essential features work
- [ ] Modals fit screen

### 9. **Performance**
- [ ] Page loads in < 3 seconds
- [ ] Filtering is instant (< 100ms)
- [ ] Sorting is instant (< 100ms)
- [ ] No lag when toggling features
- [ ] Memory usage stable (no leaks)

### 10. **Browser Compatibility**
#### Chrome (Latest)
- [ ] All features work
- [ ] No console errors

#### Firefox (Latest)
- [ ] All features work
- [ ] No console errors

#### Safari (Latest)
- [ ] All features work
- [ ] No console errors

#### Edge (Latest)
- [ ] All features work
- [ ] No console errors

### 11. **Data Integrity**
- [ ] All character IDs are unique
- [ ] Required fields present for all characters
- [ ] Stone values are valid (U10/A1-A4/Shard/Keep)
- [ ] Tier ratings are valid (S+/S/A/B/C/D)
- [ ] Job types are valid (8 job types)
- [ ] Star ratings are valid (3/4/5)

### 12. **Edge Cases**
- [ ] Empty search returns "No characters match"
- [ ] Invalid filter combinations show appropriate message
- [ ] Characters with missing data display gracefully
- [ ] Very long character names don't break layout
- [ ] Special characters in names display correctly

## 🔄 Regression Testing (After Changes)

When making changes, always test these critical paths:

1. **After JavaScript Changes:**
   - [ ] Page loads without errors
   - [ ] All event listeners work
   - [ ] No functionality broken

2. **After CSS Changes:**
   - [ ] Layout not broken
   - [ ] Theme switching works
   - [ ] Mobile view intact

3. **After Data Changes:**
   - [ ] Characters load correctly
   - [ ] Filters still work
   - [ ] Modal information accurate

## 🚀 Quick Smoke Test (5 minutes)

For minor changes, at minimum test:

1. [ ] Page loads
2. [ ] Search for "Primrose"
3. [ ] Toggle column visibility
4. [ ] Open character modal
5. [ ] Change theme
6. [ ] Check console for errors

## 📝 Test Data

### Known Edge Cases to Test:
- **Therese EX**: No release date (should be hidden when unreleased toggle is off)
- **3★ Characters**: Should show N/A for awakening stones
- **Collab Characters**: Different continent/obtainedFrom values
- **Long Names**: "Primrose, Seductive Songstress" layout

### Test Scenarios:
1. Filter for 5★ Hunters who are Buffers
2. Search for "EX" to find all EX characters
3. Hide all column groups except Basic Info
4. Export filtered results as CSV

## 🐛 Bug Report Template

When a test fails:

```
**Test Case**: [Which test failed]
**Expected**: [What should happen]
**Actual**: [What actually happened]
**Steps to Reproduce**: 
1. [Step 1]
2. [Step 2]
**Browser/Device**: [Chrome on Windows]
**Console Error**: [If any]
```

## 📊 Performance Benchmarks

Target metrics:
- Initial load: < 3s
- Character render: < 500ms for 244 characters
- Filter/sort: < 100ms response time
- Memory: < 50MB usage
- No memory leaks after 10 minutes of use