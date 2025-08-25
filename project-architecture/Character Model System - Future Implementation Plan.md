---
title: Character Model System - Future Implementation Plan
type: design_proposal
permalink: project-architecture/character-model-system-future-implementation-plan
---

# Character Model System - Future Implementation Plan

## Date: 2025-08-25
## Status: Research complete, implementation deferred
## Context: Database field linking and data consistency issues

## Problem Identified
The current database has data duplication and synchronization issues:
- Character records have `a4Tier` and `a4Priority` fields (truth source)
- Each character also has embedded `a4_accessory` data with its own `tier` field (duplicate)
- 135 accessories show "?" tier while characters have actual tiers
- Violates database normalization principles (DRY)

## Current Architecture (No Model Layer)

**What We Have:**
- **Pinia Store**: `character.js` - handles data fetching, filtering, state management
- **Direct Data Access**: Components access raw JSON data directly (`char.a4Tier`, `char.a4_accessory.tier`)
- **Ad-hoc Computed Values**: Fallbacks scattered in components like `accessory.tier || character.tierRatings?.gl?.tier`

**Problems This Creates:**
1. **Data inconsistency**: `char.a4Tier = "S+"` but `char.a4_accessory.tier = "?"`
2. **Scattered logic**: Fallback logic repeated in multiple components
3. **No validation**: Can't enforce tier/priority relationships
4. **Hard to maintain**: Changes require updating multiple places

## Model System Explanation

A **Model System** creates a data abstraction layer between raw JSON and UI components:

```javascript
// Instead of this (current):
character.a4_accessory.tier  // Could be "?" or wrong

// You use this (with models):
characterModel.getA4AccessoryTier()  // Always returns correct tier
```

**Benefits:**
- **Single source of truth**: Models ensure data consistency
- **Business logic encapsulation**: All tier/priority rules in one place
- **Computed properties**: Auto-calculated values (tier_value from tier)
- **Validation**: Enforce relationships between fields
- **Easy refactoring**: Change logic once, affects all components

## Why We're Not Using Models Currently

1. **Historical development**: Started with simple JSON → UI approach
2. **Vue.js patterns**: Pinia store handles state, components directly access data
3. **Small team**: Simpler to just fix data directly than build abstraction
4. **No immediate need**: Worked fine until data grew complex

**But now we need it because:**
- Database has grown complex (244 characters, multiple data sources)
- Data consistency issues appearing (tier mismatches)
- Multiple people contributing (need enforced standards)

## Implementation Plan: Character Model System

### Phase 1: Create Model Classes
```javascript
// src/models/CharacterModel.js
export class CharacterModel {
  constructor(rawData) {
    this.raw = rawData
  }

  // Computed properties with business logic
  get a4AccessoryTier() {
    return this.raw.a4Tier || 'Unknown'  // Character tier is truth
  }

  get a4AccessoryTierValue() {
    const values = { 'S+': 10, 'S': 9, 'A': 8, 'B': 5, 'C': 3, 'D': 1 }
    return values[this.a4AccessoryTier] || 0
  }

  get a4AccessoryName() {
    return this.raw.a4_accessory?.name || 'No Accessory'
  }

  // Validation methods
  isA4TierConsistent() {
    const charTier = this.raw.a4Tier
    const accTier = this.raw.a4_accessory?.tier
    return !accTier || accTier === '?' || charTier === accTier
  }
}
```

### Phase 2: Update Store to Use Models
```javascript
// In character.js store
import { CharacterModel } from '@/models/CharacterModel'

// Replace direct character access
get modeledCharacters() {
  return this.characters.map(char => new CharacterModel(char))
}
```

### Phase 3: Update Components
```javascript
// Instead of: char.a4_accessory.tier
// Use: characterModel.a4AccessoryTier

// Instead of: fallback logic in template
// Use: clean model methods
```

### Phase 4: Field Linking Implementation
```javascript
// Add linking system
export class CharacterModel {
  // Link embedded accessory fields to character fields
  updateA4Tier(newTier) {
    this.raw.a4Tier = newTier
    // Auto-sync linked fields
    if (this.raw.a4_accessory) {
      this.raw.a4_accessory.tier = newTier
      this.raw.a4_accessory.tier_value = this.getTierValue(newTier)
    }
  }
}
```

### Phase 5: Database Cleanup with Model Validation
- Use models to identify all inconsistencies
- Fix data using model business rules
- Add validation to prevent future issues

## Alternative: Lightweight Computed Properties

If full models seem too heavy, we could start with simple computed properties in the store:

```javascript
// In character.js store
getters: {
  getCharacterWithComputed: (state) => (character) => ({
    ...character,
    // Computed accessory tier (always uses character tier)
    computedA4AccessoryTier: character.a4Tier,
    computedA4AccessoryTierValue: getTierValue(character.a4Tier)
  })
}
```

## Field Linking System Concepts

### Approach 1: JSON Schema with References
```json
{
  "a4_accessory": {
    "id": "orlaeas_pendant",
    "name": "Orlaea's Pendant", 
    "tier": "$ref:a4Tier",  // Reference to parent a4Tier field
    "tier_value": "$ref:a4TierValue",  // Computed from a4Tier
  },
  "a4Tier": "S+",  // Source of truth
}
```

### Approach 2: Data Model Class System
Create a `CharacterDataModel` class that manages field relationships with automatic linking and validation.

### Approach 3: Computed Properties System
Vue-style computed properties that sync automatically when source fields change.

### Approach 4: Database Schema with Link Rules
Schema definition file with validation rules and field linking specifications.

## Current Data Issues Found
Analysis of database shows:
- **Total characters**: 244
- **Has a4Tier**: 81 characters
- **Has embedded accessory**: 235 characters
- **Embedded tier matches**: Only 13 characters
- **Embedded tier unknown (?)**: 135 characters
- **Embedded tier mismatch**: 25 characters

## Files That Would Be Affected
- `src/models/CharacterModel.js` - New model class
- `src/stores/character.js` - Updated to use models
- `src/components/UnifiedSearchPage.vue` - Update data access
- `src/components/CharacterTable.vue` - Update display logic
- `data/characters_enhanced_v3.json` - Database cleanup

## Recommendation
Start with **Phase 1-2** (basic models) to solve immediate consistency issues, then expand to full field linking system. This gives us the benefits without massive refactoring.

## Implementation Priority
- **Low-Medium**: Not urgent but would solve growing consistency problems
- **Good for**: Future admin dashboard, community contributions, data quality
- **Alternative**: Could continue with manual database fixes for now

## Related Issues
- A4 Priority/Tier mismatches (already identified 34 cases)
- Need for admin dashboard (Task 14)
- Database normalization needs
- Field linking requirements