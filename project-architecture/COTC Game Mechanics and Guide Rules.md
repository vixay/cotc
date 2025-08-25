---
title: COTC Game Mechanics and Guide Rules
type: guideline
permalink: project-architecture/cotc-game-mechanics-and-guide-rules
---

# COTC Game Mechanics and Guide Rules

## Date: 2025-08-25
## Purpose: Centralized documentation of game mechanics and guide conventions

## 1. Awakening Accessory Priority System

### Priority Levels
- **essential**: Must have for character to function properly
- **good**: Significant improvement, worth considering
- **skip**: Not worth the investment for F2P players
- **None/null**: Not yet evaluated

### A4 Tier to Priority Mapping
Expected correlations (though exceptions exist):
- **S+ Tier** → `essential` (top-tier accessories)
- **S Tier** → `essential` (excellent accessories)
- **A Tier** → `good` (solid improvements)
- **B Tier** → `skip` or sometimes `good` (situational)
- **C Tier** → `skip` (minimal impact)
- **D Tier** → `skip` (not worth resources)
- **E Tier** → `skip` (avoid)

### Important Exceptions
Some characters may have priority/tier mismatches due to:
- Unique character mechanics that make accessory more/less valuable
- Synergy with specific team compositions
- Special use cases (e.g., farming, specific boss fights)

### Ultimate Priority (ultPriority)
- **essential**: Game-changing ultimate, prioritize
- **good**: Useful ultimate, worth unlocking
- **skip**: Weak ultimate, save resources

### A4 Priority (a4Priority)
- **essential**: Critical for character performance
- **good**: Notable improvement
- **skip**: Minimal impact

## 2. Character Evaluation System

### Tier Ratings Structure
```json
"tierRatings": {
  "gl": {
    "tier": "S",  // Letter grade
    "score": 9.5  // Numeric score
  }
}
```

### Role-Based Evaluation
Characters can have different tiers for different roles:
- **overallTier**: General performance
- **roleTiers**: Specific role performance (DPS, Support, Healer, etc.)

## 4. Accessory System

### Accessory Types (4-Type Classification)
1. **General**: Available to all characters
2. **Character (A4)**: Character-specific from A4 awakening
3. **Exclusive**: Special character-specific accessories
4. **Artifact**: Special event/limited accessories

### Accessory Tiers
- **S+**: Best in slot, game-changing
- **S**: Excellent, highly recommended
- **A**: Good, solid choice
- **B**: Decent, situational use
- **C**: Below average
- **D**: Poor choice
- **?**: Not yet evaluated

## 5. Skills System

### Skill Categories
- **battle**: Active combat skills
- **passive**: Always-active buffs
- **ultimate**: Ultimate skills (requires ultimate unlock)
- **ex_skills**: 6★ Overclass skills (NOT related to EX character variants)
- **blessing_of_lantern**: BotL skills from lantern system

### EX Skills (6★ Overclass System) - CORRECTED UNDERSTANDING
**What They Are:**
- 6★ overclass upgrade skills that ANY character can potentially get
- Universal system affecting regular characters, not character variants
- "EX Characters" (like Primrose EX) are completely separate from EX skills

**Availability Rules:**
- `canOverclass` field determines eligibility (canOverclass: true required)
- Not everyone has them yet - gradual rollout in game
- Eventually all characters will get overclass capability
- Should only exist for characters with canOverclass: true

**Database Structure:**
- Stored in `skills_full.ex_skills[]` array
- Characters without overclass should have empty ex_skills array
- Field `canOverclass` is the authoritative source for eligibility

### BotL Skills (Blessing of the Lantern System)
**What They Are:**
- Blessing of the Lantern skills from the lantern enhancement system
- Character enhancement system separate from base skills

**Availability Rules:**
- **Separate BotL release schedule** - independent from character release date
- **BotL release date stored in markdown files** - distinct from `glReleaseDate`
- Older Characters get BotL updates in batches/waves after their initial release, newer characters come with it. 
- Must check BotL-specific release date if available

**Database Structure:**
- Primarily tagged in other categories with `blessing_of_lantern` tag
- BotL release date sourced from markdown files during extraction

### Skill Star Ratings
At what star level of the character the skill can be unlocked. 
- **5★**: Highest tier skills
- **4★**: High tier skills
- **3★**: Mid tier skills
- **2★**: Low tier skills
- **1★**: Basic skills

## 6. Database Conventions

### Priority Sources
All priority recommendations include:
```json
"prioritySource": {
  "evaluator": "Drayleb",
  "sourceUrl": "https://www.reddit.com/user/Drayleb/",
  "lastUpdated": "2025-08-04",
  "confidence": "high",
  "methodology": "F2P dupe usage analysis",
  "audience": "F2P players"
}
```

### Version Management
- Database versions use semantic versioning (e.g., 5.0.0)
- Major version: Schema changes
- Minor version: Content updates
- Patch version: Bug fixes

## 7. Free/Limited Characters

### Free Character Tags
Characters obtainable without gacha:
- `isFree: true` for completely free characters
- `limited: true` for time-limited availability
- Special tags: `collab`, `welfare`, `story`

### Free Character Priorities
Cannot shard awakening stones for awakening stone shards, so can use all awakening stones for maxing out the character. 

## 8. Tag System

### Universal Tags
Standardized tags for filtering:
- Effect tags: `buff_`, `debuff_`, `shield_`, etc.
- Trigger tags: `trigger_hp_threshold`, `trigger_battle_start`
- Target tags: `target_self`, `target_ally`, `target_enemy`
- Special tags: `unique`, `meta`, `niche`

## 9. Community Guidelines

### Update Philosophy
- Base changes on community consensus
- Prioritize F2P player perspective
- Document all sources and reasoning
- Maintain backwards compatibility

### Data Quality Standards
- Verify from multiple sources
- Test changes locally first
- Create backups before major updates
- Validate with helper scripts

## 10. Important Notes

### Molrusso Case Study
- Originally marked as `skip` despite S tier
- Demonstrates importance of regular audits
- Shows that tier should generally align with priority

### Known Issues to Watch
- Character name variations (e.g., "Agnès" vs "Agnes")
- Unicode characters in names (smart quotes, special characters)
- Skill description formatting (HTML/Markdown remnants)
- Accessory data corruption patterns

## References
- Drayleb's analysis: Reddit F2P guides
- Community tier lists: Discord consensus
- Official game data: COTC Wiki
- Data extraction: Markdown files from community

## 11. Data Integrity Issues Discovered (2025-08-25)

### EX Skills Data Loss
**Issue**: 32 characters have `canOverclass: true` but missing EX skills in database
**Root Cause**: Database cleaning operations deleted valid 6★ EX skills
**Affected Characters**: A2, Agnès, Auguste, Canary, Cardona, Ditraina, Eliza, Elrica, and 24 others
**Solution Needed**: Restore EX skills from backup or re-extract from source data

### Database Field Coverage Issues
**Missing canOverclass Field**: 165/244 characters lack this critical field
**Impact**: Cannot properly validate EX skills without field
**Missing BotL Release Dates**: BotL availability determined by separate release dates in markdown files, not glReleaseDate
**Solution Needed**: 
- Populate canOverclass field for all characters
- Extract BotL release dates from markdown files during processing

### Validation Rules for Database Cleaning
**EX Skills**: Never delete skills from characters with `canOverclass: true`
**BotL Skills**: Never delete BotL skills from released characters (check glReleaseDate)
**Field Dependencies**: Always check game state fields before removing skills
**Backup Strategy**: Create targeted backups before any skill cleaning operations