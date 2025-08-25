# COTC Accessory Type Classification

## Overview
COTC accessories are categorized based on their source and usage restrictions. The game uses a 4-type classification system.

## 4-Type Classification System

COTC has **4 distinct accessory types**:

1. **General** (`normal`)
   - **Source**: Various sources (gacha, events, shops, trials, etc.)
   - **Restriction**: Unrestricted - usable by any character
   - **Usage**: Standard accessory pool for general equipment

2. **Character (A4)** (`awakening`) 
   - **Source**: Character's 4th Awakening (A4) from 3★, 4★, and 5★ characters
   - **Restriction**: Unrestricted - usable by any character
   - **Usage**: Typically very powerful

3. **Exclusive** (`exclusive`)
   - **Source**: Special character-restricted accessories (appears in markdown exclusive sections)
   - **Restriction**: Restricted for use by a specific character, shows up in markdown exclusive accessory sections
   - **Usage**: character-specific accessories
   - **Note**: These are DISTINCT from A4 accessories - a character can have both an A4 and an exclusive accessory

4. **Artifact** (`artifact`)
   - **Source**: General accessory with level restriction
   - **Restriction**: Requires equipping character to be Level 120+
   - **Usage**: End-game general accessories with high level requirements

## Database Schema Requirements
The database should properly categorize accessories using the `accessory_type` field with these values:
- `"normal"` - General accessories
- `"awakening"` - A4 character accessories  
- `"exclusive"` - Character-restricted exclusive accessories
- `"artifact"` - Level 120 requirement accessories

## Important Distinctions

**A4 Accessories ≠ Exclusive Accessories**
- These are **separate accessory types** with different sources
- A character can have BOTH an A4 accessory AND an exclusive accessory
- Example: 2B has A4 "2B's Goggles" AND exclusive "Pod 042"
- A4 accessories come from markdown "Awakening IV Accessory" section, exclusive accessories from markdown "Exclusive Accessory" sections

## Database Schema Implementation

### `accessory_type` Field Values:
```json
"accessory_type": "normal" | "awakening" | "exclusive" | "artifact"
```

### Derivation Logic:
```javascript
function getAccessoryType(accessory) {
  // Check source and restrictions
  if (accessory.level_requirement >= 120) {
    return "artifact"
  }
  if (accessory.data_sources?.includes('a4_extraction')) {
    return "awakening"
  }
  if (accessory.character_restriction && accessory.data_sources?.includes('exclusive_extraction')) {
    return "exclusive"
  }
  return "normal"
}
```

### Filter Categories for UI:
- **General (Normal)**: Unrestricted accessories usable by any character
- **Character (A4)**: A4 awakening accessories specific to one character
- **Exclusive**: Character-restricted accessories from markdown exclusive sections
- **Artifact (Lv 120)**: High-level requirement accessories for end-game characters

## Database Integration

Accessories appear in multiple sources:
1. **Main accessories database** (`data/accessories.json`) - general and artifact accessories
2. **Character A4 data** - A4 awakening accessories embedded in character records
3. **Character exclusive data** - exclusive accessories from markdown extraction  embedded in character records

This multi-source approach ensures proper categorization while maintaining the distinct nature of each accessory type.