---
title: Tag-Based Search UX Requirements
type: note
permalink: project-architecture/tag-based-search-ux-requirements
---

# Tag-Based Search UX Requirements

## Problem Identified
In the old accessories.html, users could click on tags to easily filter for specific effects across both skills and accessories. This crucial UX feature is missing in the new Vue implementation.

## User Example
- **User wants**: Find all `damage_cap_up` skills & accessories
- **Old behavior**: Click on `damage_cap_up` tag → instantly filter results
- **Current behavior**: Manual search/filtering required

## Required Implementation
1. **Clickable Tags**: All tag displays should be clickable buttons/links
2. **Cross-Entity Search**: Clicking a tag should filter both skills AND accessories
3. **Combined Results**: Show unified search results across all entities with that tag
4. **Visual Feedback**: Clear indication when a tag filter is active
5. **Tag Frequency**: Show count of how many items have each tag

## Technical Implementation Notes
- Tags need to be consistent across skills and accessories databases
- Tag clicking should update the global search/filter state
- Filter state should be visible and clearable
- URL routing should support tag-based filtering for bookmarking

## Priority: HIGH
This directly impacts user ability to find related content across the entire database and is a major UX regression from the original interface.

## Testing Scenarios
- Click `damage_cap_up` tag → see all skills/accessories with damage cap effects
- Click `trigger_battle_start` tag → see all battle start effects
- Click `buff_stats_patk_up` tag → see all physical attack buffs
- Multiple tag selection for advanced filtering