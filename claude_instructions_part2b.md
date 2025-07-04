# Claude Code Instructions - Part 2B: Character Data (Characters 21-40)

## Continuing data/characters.json (Part B)

Add these characters after character 20 (Yan Long) in the characters array:

```json
    {
      "id": "largo",
      "name": "Largo",
      "isFree": true,
      "a4Tier": "B",
      "ultPriority": "A4, L10",
      "ultPriorityGroup": "medium",
      "stones": {
        "AS1": "A1",
        "AS2": "A2",
        "AS3": "A3",
        "AS4": "A4",
        "AS5": "Keep"
      },
      "notes": "Free character - stones give character fragments only",
      "tags": ["free", "story"]
    },
    {
      "id": "serenoa",
      "name": "Serenoa",
      "isFree": true,
      "a4Tier": "A",
      "ultPriority": "A4, L10",
      "ultPriorityGroup": "medium",
      "stones": {
        "AS1": "A1",
        "AS2": "A2",
        "AS3": "A3",
        "AS4": "A4",
        "AS5": "Keep"
      },
      "notes": "Free character - stones give character fragments only",
      "tags": ["free", "collab", "triangle-strategy", "a4-good"]
    },
    {
      "id": "hasumi",
      "name": "Hasumi",
      "isFree": false,
      "a4Tier": "S+",
      "ultPriority": "L9",
      "ultPriorityGroup": "low",
      "stones": {
        "AS1": "A1",
        "AS2": "A2",
        "AS3": "A3",
        "AS4": "A4",
        "AS5": "Shard"
      },
      "notes": "Maiden's Bell is excellent, U10 not priority",
      "tags": ["a4-priority", "5-star"]
    },
    {
      "id": "odette",
      "name": "Odette",
      "isFree": false,
      "a4Tier": "S+",
      "ultPriority": "L9",
      "ultPriorityGroup": "low",
      "stones": {
        "AS1": "A1",
        "AS2": "A2",
        "AS3": "A3",
        "AS4": "A4",
        "AS5": "Shard"
      },
      "notes": "Excellent A4, moderate U10",
      "tags": ["a4-priority", "5-star"]
    },
    {
      "id": "frederica",
      "name": "Frederica",
      "isFree": false,
      "a4Tier": "S+",
      "ultPriority": "L9",
      "ultPriorityGroup": "low",
      "stones": {
        "AS1": "A1",
        "AS2": "A2",
        "AS3": "A3",
        "AS4": "A4",
        "AS5": "Shard"
      },
      "notes": "Great A4, lower U10 priority",
      "tags": ["a4-priority", "5-star"]
    },
    {
      "id": "zaanta",
      "name": "Z'aanta",
      "isFree": false,
      "a4Tier": "S+",
      "ultPriority": "L9",
      "ultPriorityGroup": "low",
      "stones": {
        "AS1": "A1",
        "AS2": "A2",
        "AS3": "A3",
        "AS4": "A4",
        "AS5": "Shard"
      },
      "notes": "Excellent A4 accessory",
      "tags": ["a4-priority", "5-star"]
    },
    {
      "id": "molu",
      "name": "Molu",
      "isFree": false,
      "a4Tier": "S+",
      "ultPriority": "L9",
      "ultPriorityGroup": "low",
      "stones": {
        "AS1": "A1",
        "AS2": "A2",
        "AS3": "A3",
        "AS4": "A4",
        "AS5": "Shard"
      },
      "notes": "Top tier A4",
      "tags": ["a4-priority", "5-star"]
    },
    {
      "id": "alfyn",
      "name": "Alfyn",
      "isFree": false,
      "a4Tier": "S",
      "ultPriority": "L9",
      "ultPriorityGroup": "low",
      "stones": {
        "AS1": "A1",
        "AS2": "A2",
        "AS3": "A3",
        "AS4": "A4",
        "AS5": "Shard"
      },
      "notes": "Dreamer's Medicine Box - good A4",
      "tags": ["a4-good", "support", "5-star"]
    },
    {
      "id": "agnes",
      "name": "Agnes",
      "isFree": false,
      "a4Tier": "S",
      "ultPriority": "L9",
      "ultPriorityGroup": "low",
      "stones": {
        "AS1": "A1",
        "AS2": "A2",
        "AS3": "A3",
        "AS4": "A4",
        "AS5": "Shard"
      },
      "notes": "Good A4 accessory",
      "tags": ["a4-good", "collab", "bravely-default", "5-star"]
    },
    {
      "id": "therion",
      "name": "Therion",
      "isFree": false,
      "a4Tier": "S",
      "ultPriority": "L9",
      "ultPriorityGroup": "low",
      "stones": {
        "AS1": "A1",
        "AS2": "A2",
        "AS3": "A3",
        "AS4": "A4",
        "AS5": "Shard"
      },
      "notes": "Good A4, moderate U10",
      "tags": ["a4-good", "thief", "5-star"]
    },
    {
      "id": "tressa",
      "name": "Tressa",
      "isFree": false,
      "a4Tier": "S",
      "ultPriority": "L9",
      "ultPriorityGroup": "low",
      "stones": {
        "AS1": "A1",
        "AS2": "A2",
        "AS3": "A3",
        "AS4": "A4",
        "AS5": "Shard"
      },
      "notes": "Good support A4",
      "tags": ["a4-good", "support", "5-star"]
    },
    {
      "id": "cyrus",
      "name": "Cyrus",
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
      "notes": "Decent A4, moderate U10",
      "tags": ["mage", "5-star"]
    },
    {
      "id": "primrose",
      "name": "Primrose",
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
      "notes": "Regular version, decent A4",
      "tags": ["dancer", "5-star"]
    },
    {
      "id": "olberic",
      "name": "Olberic",
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
      "tags": ["tank", "warrior", "5-star"]
    },
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
    },
    {
      "id": "viola",
      "name": "Viola",
      "isFree": false,
      "a4Tier": "C",
      "ultPriority": "L9",
      "ultPriorityGroup": "low",
      "stones": {
        "AS1": "A1",
        "AS2": "Shard",
        "AS3": "Shard",
        "AS4": "Shard",
        "AS5": "Shard"
      },
      "notes": "Good early debuffer, weak endgame",
      "tags": ["debuffer", "early-game", "shardable", "5-star"]
    },
    {
      "id": "scarecrow",
      "name": "Scarecrow",
      "isFree": false,
      "a4Tier": "D",
      "ultPriority": "L9",
      "ultPriorityGroup": "low",
      "stones": {
        "AS1": "A1",
        "AS2": "Shard",
        "AS3": "Shard",
        "AS4": "Shard",
        "AS5": "Shard"
      },
      "notes": "Weak A4 and U10",
      "tags": ["shardable", "5-star"]
    },
    {
      "id": "haanit",
      "name": "H'aanit",
      "isFree": false,
      "a4Tier": "B",
      "ultPriority": "L9",
      "ultPriorityGroup": "low",
      "stones": {
        "AS1": "A1",
        "AS2": "Shard",
        "AS3": "Shard",
        "AS4": "Shard",
        "AS5": "Shard"
      },
      "notes": "Regular version, moderate performance",
      "tags": ["hunter", "shardable", "5-star"]
    },
    {
      "id": "herminia",
      "name": "Herminia",
      "isFree": false,
      "a4Tier": "B",
      "ultPriority": "L9",
      "ultPriorityGroup": "low",
      "stones": {
        "AS1": "A1",
        "AS2": "Shard",
        "AS3": "Shard",
        "AS4": "Shard",
        "AS5": "Shard"
      },
      "notes": "Moderate performance",
      "tags": ["shardable", "5-star"]
    },
    {
      "id": "eliza",
      "name": "Eliza",
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
      "notes": "Good A4, weak U10",
      "tags": ["a4-good", "5-star"]
    }
```

## Instructions
1. Continue adding these characters to the `characters` array in `data/characters.json`
2. Make sure to add a comma after character 20 (Yan Long) before adding these
3. Continue with Part 2C for the remaining characters