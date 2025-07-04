# Claude Code Instructions - Part 2C: Character Data (Characters 41+) and Close JSON

## Continuing data/characters.json (Part C - Final)

Add these final characters after character 40 (Eliza) in the characters array:

```json
    {
      "id": "joshua",
      "name": "Joshua",
      "isFree": false,
      "a4Tier": "S",
      "ultPriority": "L1",
      "ultPriorityGroup": "lowest",
      "stones": {
        "AS1": "A1",
        "AS2": "A2",
        "AS3": "A3",
        "AS4": "A4",
        "AS5": "Shard"
      },
      "notes": "Good A4 accessory",
      "tags": ["a4-good", "5-star"]
    },
    {
      "id": "sarisa",
      "name": "Sarisa",
      "isFree": false,
      "a4Tier": "S",
      "ultPriority": "L1",
      "ultPriorityGroup": "lowest",
      "stones": {
        "AS1": "A1",
        "AS2": "A2",
        "AS3": "A3",
        "AS4": "A4",
        "AS5": "Shard"
      },
      "notes": "Good A4 accessory",
      "tags": ["a4-good", "5-star"]
    },
    {
      "id": "rinyuu",
      "name": "Rinyuu",
      "isFree": false,
      "a4Tier": "S",
      "ultPriority": "L1",
      "ultPriorityGroup": "lowest",
      "stones": {
        "AS1": "A1",
        "AS2": "A2",
        "AS3": "A3",
        "AS4": "A4",
        "AS5": "Shard"
      },
      "notes": "Excellent backpack support, good A4",
      "tags": ["support", "backpack", "a4-good", "5-star"]
    },
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
    },
    {
      "id": "theo",
      "name": "Theo",
      "isFree": false,
      "a4Tier": "B",
      "ultPriority": "L1",
      "ultPriorityGroup": "lowest",
      "stones": {
        "AS1": "A1",
        "AS2": "Shard",
        "AS3": "Shard",
        "AS4": "Shard",
        "AS5": "Shard"
      },
      "notes": "Decent early game, but outclassed",
      "tags": ["early-game", "shardable", "5-star"]
    },
    {
      "id": "soleil",
      "name": "Soleil",
      "isFree": false,
      "a4Tier": "C",
      "ultPriority": "L1",
      "ultPriorityGroup": "lowest",
      "stones": {
        "AS1": "Shard",
        "AS2": "Shard",
        "AS3": "Shard",
        "AS4": "Shard",
        "AS5": "Shard"
      },
      "notes": "Weak character overall",
      "tags": ["shardable", "poor-performance", "5-star"]
    },
    {
      "id": "cardona",
      "name": "Cardona",
      "isFree": false,
      "a4Tier": "C",
      "ultPriority": "L1",
      "ultPriorityGroup": "lowest",
      "stones": {
        "AS1": "Shard",
        "AS2": "Shard",
        "AS3": "Shard",
        "AS4": "Shard",
        "AS5": "Shard"
      },
      "notes": "Poor performance, easily shardable",
      "tags": ["shardable", "poor-performance", "5-star"]
    },
    {
      "id": "lianna",
      "name": "Lianna",
      "isFree": false,
      "a4Tier": "B",
      "ultPriority": "L1",
      "ultPriorityGroup": "lowest",
      "stones": {
        "AS1": "Shard",
        "AS2": "Shard",
        "AS3": "Shard",
        "AS4": "Shard",
        "AS5": "Shard"
      },
      "notes": "Weak U10 and mediocre A4",
      "tags": ["shardable", "poor-performance", "5-star"]
    },
    {
      "id": "lionel",
      "name": "Lionel",
      "isFree": false,
      "a4Tier": "B",
      "ultPriority": "L1",
      "ultPriorityGroup": "lowest",
      "stones": {
        "AS1": "A1",
        "AS2": "Shard",
        "AS3": "Shard",
        "AS4": "Shard",
        "AS5": "Shard"
      },
      "notes": "Mediocre performance overall",
      "tags": ["shardable", "5-star"]
    },
    {
      "id": "heathcote",
      "name": "Heathcote",
      "isFree": false,
      "a4Tier": "A",
      "ultPriority": "L1",
      "ultPriorityGroup": "lowest",
      "stones": {
        "AS1": "A1",
        "AS2": "A2",
        "AS3": "A3",
        "AS4": "A4",
        "AS5": "Shard"
      },
      "notes": "Decent A4, very weak U10",
      "tags": ["5-star"]
    },
    {
      "id": "sofia",
      "name": "Sofia",
      "isFree": false,
      "a4Tier": "A",
      "ultPriority": "L9",
      "ultPriorityGroup": "low",
      "stones": {
        "AS1": "A1",
        "AS2": "A2",
        "AS3": "A3",
        "AS4": "A4",
        "AS5": "Shard"
      },
      "notes": "Decent A4, lower U10 priority",
      "tags": ["5-star"]
    },
    {
      "id": "lumis",
      "name": "Lumis",
      "isFree": false,
      "a4Tier": "A",
      "ultPriority": "L9",
      "ultPriorityGroup": "low",
      "stones": {
        "AS1": "A1",
        "AS2": "A2",
        "AS3": "A3",
        "AS4": "A4",
        "AS5": "Shard"
      },
      "notes": "Decent A4, lower priority",
      "tags": ["5-star"]
    },
    {
      "id": "cecily",
      "name": "Cecily",
      "isFree": false,
      "a4Tier": "A",
      "ultPriority": "L9",
      "ultPriorityGroup": "low",
      "stones": {
        "AS1": "A1",
        "AS2": "A2",
        "AS3": "A3",
        "AS4": "A4",
        "AS5": "Shard"
      },
      "notes": "Decent A4",
      "tags": ["5-star"]
    },
    {
      "id": "wludai",
      "name": "W'ludai",
      "isFree": false,
      "a4Tier": "A",
      "ultPriority": "L9",
      "ultPriorityGroup": "low",
      "stones": {
        "AS1": "A1",
        "AS2": "A2",
        "AS3": "A3",
        "AS4": "A4",
        "AS5": "Shard"
      },
      "notes": "Tank with decent A4",
      "tags": ["tank", "5-star"]
    }
  ]
}
```

## Important JSON Closing
Make sure the JSON file ends with:
1. A closing `]` for the characters array
2. A closing `}` for the main object
3. NO trailing comma after the last character (W'ludai)

## Complete File Structure Check
The complete `data/characters.json` should have:
- Opening with version info and metadata
- A "characters" array containing all ~54 characters
- Proper JSON formatting (no trailing commas)
- Each character with all required fields

## Next Steps
Continue with Part 3 for CSS styles