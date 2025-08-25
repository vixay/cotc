---
title: Tag Consolidation Plan
type: note
permalink: project-guides/tag-consolidation-plan
---

# Tag Consolidation Plan

## Overview
Consolidate duplicate and similar tags across the character database to improve search and organization while adding descriptive hover tooltips.

## Tag Categories for Consolidation

### 1. **Drayleb Priority Tags** (HIGH PRIORITY)
**Current**: 3 separate tags
- `drayleb-must-pull` (5 characters)
- `drayleb-should-pull` (4 characters) 
- `drayleb-luxury` (3 characters)

**Consolidation Strategy**: Keep separate but add hover tooltips
- `drayleb-must-pull`: "Essential meta-defining units - highest priority for pulling"
- `drayleb-should-pull`: "Strong meta units - recommended for most players"
- `drayleb-luxury`: "Nice-to-have units - luxury pulls for completionists"

### 2. **Role Tags**
**Current**: Multiple variants for same concepts
- Buffer: `buffer`, `front-row-buffer`
- Damage: `dps`, `dark-dps`, `sword-dps`, `damage-reduction`
- Tank: `tank`, `tank-synergy`
- Support: `debuffer`

**Consolidation Strategy**: Create primary tags with modifiers
- `buffer` (primary) + `front-row` (position modifier)
- `dps` (primary) + `dark` or `sword` (element/weapon modifier)
- `tank` (primary) + `synergy` (modifier)
- `debuffer` (keep separate from buffer)

### 3. **Tier Tags**
**Current**: `top-tier` and tier indicators
**Strategy**: Standardize tier terminology and add explanations

## Implementation Plan

### Phase 1: Create Tag Taxonomy
Create a standardized tag system with:
- **Primary Role Tags**: `buffer`, `debuffer`, `dps`, `tank`, `healer`, `support`
- **Modifier Tags**: `front-row`, `back-row`, `elemental`, `weapon-specific`
- **Priority Tags**: Keep Drayleb system as-is
- **Meta Tags**: `top-tier`, `meta-relevant`, `niche`

### Phase 2: Add Hover Tooltips
Create tooltip system for all tags with detailed explanations for each category.

### Phase 3: Database Migration
Systematically update character tags to follow the new consolidated taxonomy while preserving all meaning and context.

## Benefits
- **Improved Search**: Consistent tagging improves searchability
- **Better UX**: Tooltips provide context for all tags
- **Maintainability**: Standardized system easier to manage
- **Community Clarity**: Clear explanations reduce confusion

*Status: Planning phase - ready for implementation*