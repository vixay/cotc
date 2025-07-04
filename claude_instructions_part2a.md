# Claude Code Instructions - Part 2A: Character Data (Characters 1-20)

## File 2: data/characters.json (Part A)

Create the file `data/characters.json` and start with this structure. This contains characters 1-20:

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-07-04",
  "metadata": {
    "dataSource": "Reddit tier lists, Discord community, dotgg.gg",
    "gameVersion": "Global/EN"
  },
  "characters": [
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
    },
    {
      "id": "primrose_ex",
      "name": "Primrose EX",
      "isFree": false,
      "a4Tier": "S+",
      "ultPriority": "L10",
      "ultPriorityGroup": "top",
      "stones": {
        "AS1": "U10",
        "AS2": "A1",
        "AS3": "A2",
        "AS4": "A3",
        "AS5": "A4"
      },
      "notes": "Better than Lynette ult + excellent A4",
      "tags": ["buffer", "top-tier", "u10-priority", "a4-priority", "5-star"]
    },
    {
      "id": "solon",
      "name": "Solon",
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
      "notes": "Doubles unit potency - pairs with Odio-O",
      "tags": ["support", "top-tier", "u10-priority", "5-star"]
    },
    {
      "id": "signa",
      "name": "Signa",
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
      "notes": "Queen of debuff - 20% all stats down",
      "tags": ["debuffer", "top-tier", "u10-priority", "5-star"]
    },
    {
      "id": "gilderoy",
      "name": "Gilderoy",
      "isFree": false,
      "a4Tier": "C",
      "ultPriority": "L10 First",
      "ultPriorityGroup": "high",
      "stones": {
        "AS1": "U10",
        "AS2": "A1",
        "AS3": "A2",
        "AS4": "A3",
        "AS5": "Shard"
      },
      "notes": "Strong U10, weak A4 - shard after U10",
      "tags": ["u10-priority", "5-star"]
    },
    {
      "id": "nicola",
      "name": "Nicola",
      "isFree": false,
      "a4Tier": "S",
      "ultPriority": "L10 First",
      "ultPriorityGroup": "high",
      "stones": {
        "AS1": "U10",
        "AS2": "A1",
        "AS3": "A2",
        "AS4": "A3",
        "AS5": "A4"
      },
      "notes": "Good U10 and A4",
      "tags": ["u10-priority", "a4-good", "5-star"]
    },
    {
      "id": "richard",
      "name": "Richard",
      "isFree": false,
      "a4Tier": "A",
      "ultPriority": "L10 First",
      "ultPriorityGroup": "high",
      "stones": {
        "AS1": "U10",
        "AS2": "A1",
        "AS3": "A2",
        "AS4": "A3",
        "AS5": "A4"
      },
      "notes": "Excellent support, priority U10",
      "tags": ["support", "u10-priority", "a4-good", "5-star"]
    },
    {
      "id": "ophilia",
      "name": "Ophilia",
      "isFree": false,
      "a4Tier": "B",
      "ultPriority": "L10 First",
      "ultPriorityGroup": "high",
      "stones": {
        "AS1": "U10",
        "AS2": "A1",
        "AS3": "A2",
        "AS4": "A3",
        "AS5": "Shard"
      },
      "notes": "Good healer U10, weak A4",
      "tags": ["healer", "u10-priority", "5-star"]
    },
    {
      "id": "glossom",
      "name": "Glossom",
      "isFree": true,
      "a4Tier": null,
      "ultPriority": "L10 First",
      "ultPriorityGroup": "high",
      "stones": {
        "AS1": "U10",
        "AS2": "A1",
        "AS3": "A2",
        "AS4": "A3",
        "AS5": "Keep"
      },
      "notes": "Free character - stones give character fragments only",
      "tags": ["free", "story", "u10-priority"]
    },
    {
      "id": "auguste",
      "name": "Auguste",
      "isFree": false,
      "a4Tier": "S+",
      "ultPriority": "A1, L10",
      "ultPriorityGroup": "high",
      "stones": {
        "AS1": "A1",
        "AS2": "U10",
        "AS3": "A2",
        "AS4": "A3",
        "AS5": "A4"
      },
      "notes": "Playwright's Quill - full ultimate bar start",
      "tags": ["a4-priority", "u10-good", "5-star"]
    },
    {
      "id": "rondo",
      "name": "Rondo",
      "isFree": false,
      "a4Tier": "A",
      "ultPriority": "A1, L10",
      "ultPriorityGroup": "high",
      "stones": {
        "AS1": "A1",
        "AS2": "U10",
        "AS3": "A2",
        "AS4": "A3",
        "AS5": "A4"
      },
      "notes": "Self-sustaining warrior",
      "tags": ["warrior", "u10-good", "a4-good", "5-star"]
    },
    {
      "id": "a2",
      "name": "A2",
      "isFree": false,
      "a4Tier": "S+",
      "ultPriority": "A4, L10",
      "ultPriorityGroup": "medium",
      "stones": {
        "AS1": "A1",
        "AS2": "A2",
        "AS3": "A3",
        "AS4": "A4",
        "AS5": "U10"
      },
      "notes": "Excellent A4 accessory, U10 optional",
      "tags": ["a4-priority", "collab", "nier", "5-star"]
    },
    {
      "id": "therese",
      "name": "Therese",
      "isFree": false,
      "a4Tier": "S+",
      "ultPriority": "A4, L10",
      "ultPriorityGroup": "medium",
      "stones": {
        "AS1": "A1",
        "AS2": "A2",
        "AS3": "A3",
        "AS4": "A4",
        "AS5": "Keep"
      },
      "notes": "Top tier A4 accessory",
      "tags": ["a4-priority", "5-star"]
    },
    {
      "id": "edea",
      "name": "Edea",
      "isFree": false,
      "a4Tier": "S+",
      "ultPriority": "A4, L10",
      "ultPriorityGroup": "medium",
      "stones": {
        "AS1": "A1",
        "AS2": "A2",
        "AS3": "A3",
        "AS4": "A4",
        "AS5": "Keep"
      },
      "notes": "Strong A4 accessory",
      "tags": ["a4-priority", "collab", "bravely-default", "5-star"]
    },
    {
      "id": "tikilen",
      "name": "Tikilen",
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
      "tags": ["free", "story", "a4-good"]
    },
    {
      "id": "varkyn",
      "name": "Varkyn",
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
      "id": "ritu",
      "name": "Ri'tu",
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
      "tags": ["free", "story", "a4-good"]
    },
    {
      "id": "gertrude",
      "name": "Gertrude",
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
      "id": "yunnie",
      "name": "Yunnie",
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
      "id": "yan_long",
      "name": "Yan Long",
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
      "tags": ["free", "story", "a4-good"]
    }
```

## Instructions for Claude Code
1. Create the directory structure: `mkdir -p data`
2. Create the file `data/characters.json`
3. Add the content above
4. Continue with Part 2B for the remaining characters