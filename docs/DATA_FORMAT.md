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