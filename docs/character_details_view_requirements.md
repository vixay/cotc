# Character Details View Requirements

## 🎯 Project Goal: Character Detail Modal/Page

**Purpose**: Allow users to click on character names to view detailed character information from the markdown files.

**User Story**: "As a player, when I click on a character name in the table, I want to see their complete skill descriptions, stats, and detailed information in a well-formatted view."

## 📋 Current Status

- ✅ **Markdown files exist**: 244+ character markdown files with detailed skill descriptions
- ❌ **Images missing**: Critical icons and images needed for proper display
- ❌ **Modal/page not implemented**: No UI to display character details
- ❌ **Markdown parser not integrated**: Need to process and display markdown content

## 🖼️ Missing Images Analysis

### Critical Images Needed (15 total)

#### Weapon Icons (9 required)
```
images/weapons/
├── Axe.png
├── Bow.png  
├── Dagger.png
├── Fan.png
├── Spear.png (referenced as Spear_Polearm.png)
├── Staff.png (referenced as Staff_Staves.png)
├── Sword.png
├── Tome.png
└── Polearm.png
```

#### Element Icons (6 required)
```
images/elements/
├── Dark.png
├── Fire.png
├── Ice.png
├── Light.png
├── Lightning.png (referenced as Lightning_Thunder.png)
└── Wind.png
```

### Skill Icons (416+ unique)
**High Priority Skills** (most commonly referenced):
- BP_Recovery_Boost.png
- Critical_Force.png
- Phys_Atk_Boost.png
- Elem_atk_Boost.png
- Max_HP_Boost.png
- SP_Recovery.png
- Fire_Resilience.png
- Wind_Resilience.png
- Light_Resilience.png
- Dark_Resilience.png
- Healing_Mindset.png
- Battle_Mindset.png

### External Images (78 working)
- Game8.jp hosted images work as-is
- No action needed for external URLs

### Notion Emojis (52 need replacement)
- These are Notion-specific custom emojis
- Need to find generic equivalents or create custom icons

## 🏗️ Implementation Plan

### Phase 1: Basic Character Details View
1. **Create character detail modal**
   - Modal overlay when clicking character names
   - Basic markdown rendering
   - Close button and navigation

2. **Add essential icons** (Priority 1)
   - 9 weapon icons
   - 6 element icons
   - Basic fallback for missing skill icons

3. **Markdown processing**
   - Parse markdown files
   - Handle image path resolution
   - Basic skill section formatting

### Phase 2: Enhanced Display
1. **Add common skill icons** (Priority 2)
   - Top 20-30 most referenced skill icons
   - Better visual presentation

2. **Handle Notion emoji replacements**
   - Replace with generic alternatives
   - Document which emojis map to what concepts

3. **Improved layout**
   - Tabbed interface (Skills, Stats, etc.)
   - Better responsive design

### Phase 3: Advanced Features
1. **Full skill icon library**
   - All 416+ skill icons
   - Character-specific icon sets

2. **Interactive elements**
   - Stat comparisons
   - Skill calculators
   - Equipment recommendations

## 🎨 UI Design Considerations

### Modal Layout
```
┌─────────────────────────────────────────┐
│ [X] Primrose EX                    ⭐⭐⭐⭐⭐ │
├─────────────────────────────────────────┤
│ Job: Apothecary | Power | Orsterra     │
│ 🗡️ Axe  ⚡ Lightning                    │
├─────────────────────────────────────────┤
│ [Stats] [Skills] [Ultimate] [Notes]     │
├─────────────────────────────────────────┤
│                                         │
│ ## Passive Skills                       │
│                                         │
│ [🔄] Quick Wit (1★)                    │
│ If own BP is 0 after natural           │
│ recovery, recover 1 BP.                 │
│                                         │
│ [⚡] SP Restoration With 75% or More    │
│ At 75% HP or more: Grant automatic      │
│ SP recovery (potency: 5).               │
│                                         │
└─────────────────────────────────────────┘
```

### Fallback Strategies
1. **Missing skill icons**: Show generic skill icon or text badge
2. **Missing character images**: Show placeholder or character name
3. **Missing Notion emojis**: Show text description or generic icon

## 🚀 Integration with Existing System

### Current Table Integration
- Add click handlers to character names
- Pass character data to modal
- Maintain current table functionality

### Data Sources
- Use existing v2 character data for basic info
- Load corresponding markdown file for detailed descriptions
- Combine structured data with markdown content

### Performance Considerations
- Lazy load markdown files (only when modal opens)
- Cache parsed markdown content
- Optimize image loading with proper fallbacks

## 📁 File Structure Updates Needed

```
project/
├── images/
│   ├── weapons/ (9 icons needed)
│   ├── elements/ (6 icons needed)
│   └── skills/ (416+ icons - implement gradually)
├── js/
│   ├── character-modal.js (new)
│   └── markdown-parser.js (new)
└── css/
    └── character-modal.css (new)
```

## ✅ Success Criteria

1. **Functional**: Click any character name → modal opens with their details
2. **Visual**: Weapon and element icons display correctly
3. **Content**: Skill descriptions render with proper formatting
4. **Performance**: Modal loads quickly with good UX
5. **Responsive**: Works well on mobile and desktop
6. **Fallbacks**: Graceful handling of missing images

## 🎯 Next Steps

1. **Immediate**: Add the 15 critical icons (weapons + elements) to images folder
2. **Week 1**: Implement basic modal with markdown rendering
3. **Week 2**: Add top 20 skill icons and improve layout
4. **Week 3**: Handle edge cases and responsive design
5. **Future**: Gradually add remaining skill icons as needed

This feature will transform the awakening guide from a simple reference table into a comprehensive character database, significantly enhancing the user experience for players researching characters.