# Claude Code Instructions - Part 5B: Documentation Files (Continued)

## File 8: docs/DATA_FORMAT.md

Create `docs/DATA_FORMAT.md`:

```markdown
# COTC Character Data Format Specification

This document describes the JSON data format used in `data/characters.json`.

## File Structure

```json
{
  "version": "1.0.0",
  "lastUpdated": "YYYY-MM-DD",
  "metadata": {
    "dataSource": "Source description",
    "gameVersion": "Game version"
  },
  "characters": [
    // Array of character objects
  ]
}
```

## Character Object Structure

```json
{
  "id": "string",
  "name": "string",
  "isFree": boolean,
  "a4Tier": "string|null",
  "ultPriority": "string",
  "ultPriorityGroup": "string",
  "stones": {
    "AS1": "string",
    "AS2": "string",
    "AS3": "string",
    "AS4": "string",
    "AS5": "string"
  },
  "notes": "string",
  "tags": ["string"]
}
```

## Field Definitions

### Required Fields

| Field | Type | Description | Valid Values |
|-------|------|-------------|--------------|
| `id` | string | Unique identifier | Lowercase, underscores for spaces |
| `name` | string | Display name | Any string |
| `isFree` | boolean | Is character free? | true, false |
| `a4Tier` | string\|null | A4 accessory tier | S+, S, A, B, C, D, null |
| `ultPriority` | string | Ultimate priority | See below |
| `ultPriorityGroup` | string | Priority grouping | top, high, medium, low, lowest |
| `stones` | object | Stone usage | See stone values |
| `notes` | string | Description | Any string |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `tags` | array | Categories for filtering |

## Valid Values

### Ultimate Priority Values
- `"L10"` - Top priority ultimate
- `"L10 First"` - Prioritize U10 before A4
- `"A1, L10"` - Get A1 first, then U10
- `"A4, L10"` - Get A4 first, then consider U10
- `"L9"` - Lower priority ultimate
- `"L1"` - Very weak ultimate

### Stone Usage Values
- `"U10"` - Use for Ultimate Level 10
- `"A1"` - Use for Awakening 1
- `"A2"` - Use for Awakening 2
- `"A3"` - Use for Awakening 3
- `"A4"` - Use for Awakening 4
- `"Shard"` - Exchange for awakening shards
- `"Keep"` - Keep for future use

### A4 Tier Values
- `"S+"` - Best tier
- `"S"` - Excellent
- `"A"` - Good
- `"B"` - Average
- `"C"` - Below average
- `"D"` - Poor
- `null` - Not listed/Unknown

## Examples

### High Priority Character
```json
{
  "id": "lynette",
  "name": "Lynette",
  "isFree": false,
  "a4Tier": null,
  "ultPriority": "L10",
  "ultPriorityGroup": "top",
  "stones": {
    "AS1": "U10",
    "AS2": "A1",
    "AS3": "A2",
    "AS4": "A3",
    "AS5": "Shard"
  },
  "notes": "Top priority U10 - Best buffer for EN",
  "tags": ["buffer", "top-tier", "u10-priority", "5-star"]
}
```

### Free Character
```json
{
  "id": "elvis",
  "name": "Elvis",
  "isFree": true,
  "a4Tier": "D",
  "ultPriority": "L9",
  "ultPriorityGroup": "low",
  "stones": {
    "AS1": "Keep",
    "AS2": "Keep",
    "AS3": "Keep",
    "AS4": "Keep",
    "AS5": "Keep"
  },
  "notes": "Free character - stones don't convert to shards",
  "tags": ["free", "collab", "bravely-default", "poor-performance"]
}
```

### Shardable Character
```json
{
  "id": "millard",
  "name": "Millard",
  "isFree": false,
  "a4Tier": "D",
  "ultPriority": "L1",
  "ultPriorityGroup": "lowest",
  "stones": {
    "AS1": "Shard",
    "AS2": "Shard",
    "AS3": "Shard",
    "AS4": "Shard",
    "AS5": "Shard"
  },
  "notes": "Poor character, all stones shardable",
  "tags": ["shardable", "poor-performance", "5-star"]
}
```

## Validation Rules

1. All required fields must be present
2. `id` must be unique across all characters
3. `id` should use lowercase and underscores
4. `isFree` must be a boolean
5. Stone values must be valid (U10, A1-A4, Shard, Keep)
6. JSON must be valid (no trailing commas)
7. Free characters should typically use "Keep" for stones

## Adding New Characters

When adding a new character:

1. Generate a unique `id` (lowercase, underscores)
2. Set `isFree` based on how they're obtained
3. Research their A4 tier and ultimate priority
4. Determine optimal stone usage
5. Add relevant tags
6. Write a clear, concise note

## Updating Existing Characters

When updating:

1. Only change fields that need updating
2. Provide reasoning in your PR
3. Ensure changes are based on community consensus
4. Don't change `id` values (breaks references)
```

## File 9: docs/CHANGELOG.md

Create `docs/CHANGELOG.md`:

```markdown
# Changelog

All notable changes to the COTC Awakening Stone Guide will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] - 2025-07-04

### Added
- Initial release of the COTC Awakening Stone Guide
- Complete character database with 50+ characters
- Interactive filtering by A4 tier, ultimate priority, and free status
- Search functionality
- Sortable columns
- CSV export feature
- Mobile-responsive design
- Comprehensive documentation
- GitHub Pages deployment

### Character Data
- Added all current Global/EN characters as of July 2025
- Marked 12 free characters (Elvis, Serenoa, Tikilen, etc.)
- Included awakening stone recommendations for all characters
- Added tier ratings for A4 accessories
- Categorized ultimate priorities (L10, L9, L1)

### Features
- Real-time filtering with multiple criteria
- Character count statistics
- Legend with usage guidelines
- Free character highlighting
- Export functionality for data analysis

### Documentation
- Contributing guidelines
- Data format specification
- Setup instructions for Claude Code
- Issue templates

---

## How to Update This Changelog

When making changes:

1. Add a new entry under "Unreleased"
2. Use the categories: Added, Changed, Deprecated, Removed, Fixed, Security
3. When releasing, move "Unreleased" items to a new version section
4. Follow semantic versioning (MAJOR.MINOR.PATCH)

Example:

```markdown
## [Unreleased]

### Added
- New character: [Character Name]

### Changed
- Updated [Character Name] priority from X to Y

### Fixed
- Fixed sorting issue with A4 tiers
```
```

## File 10: data/schema.json

Create `data/schema.json` for JSON validation:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "COTC Character Data",
  "type": "object",
  "required": ["version", "lastUpdated", "characters"],
  "properties": {
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$"
    },
    "lastUpdated": {
      "type": "string",
      "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
    },
    "metadata": {
      "type": "object",
      "properties": {
        "dataSource": {"type": "string"},
        "gameVersion": {"type": "string"}
      }
    },
    "characters": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "isFree", "ultPriority", "stones", "notes"],
        "properties": {
          "id": {
            "type": "string",
            "pattern": "^[a-z0-9_]+$"
          },
          "name": {
            "type": "string"
          },
          "isFree": {
            "type": "boolean"
          },
          "a4Tier": {
            "type": ["string", "null"],
            "enum": ["S+", "S", "A", "B", "C", "D", null]
          },
          "ultPriority": {
            "type": "string",
            "enum": ["L10", "L10 First", "A1, L10", "A4, L10", "L9", "L1"]
          },
          "ultPriorityGroup": {
            "type": "string",
            "enum": ["top", "high", "medium", "low", "lowest"]
          },
          "stones": {
            "type": "object",
            "required": ["AS1", "AS2", "AS3", "AS4", "AS5"],
            "properties": {
              "AS1": {"$ref": "#/definitions/stoneValue"},
              "AS2": {"$ref": "#/definitions/stoneValue"},
              "AS3": {"$ref": "#/definitions/stoneValue"},
              "AS4": {"$ref": "#/definitions/stoneValue"},
              "AS5": {"$ref": "#/definitions/stoneValue"}
            }
          },
          "notes": {
            "type": "string"
          },
          "tags": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      }
    }
  },
  "definitions": {
    "stoneValue": {
      "type": "string",
      "enum": ["U10", "A1", "A2", "A3", "A4", "Shard", "Keep"]
    }
  }
}
```

## Next Steps
Continue with Part 6 for GitHub templates and workflows