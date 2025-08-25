# Contributing to COTC Awakening Stone Guide

Thank you for helping maintain this community resource! This guide will help you contribute effectively.

## 🎯 Quick Start

### Option 1: Edit Directly on GitHub (Easiest)

1. Navigate to [`data/characters.json`](../data/characters.json)
2. Click the pencil icon (✏️) to edit
3. Make your changes
4. Scroll down and describe what you changed
5. Click "Propose changes"
6. Click "Create pull request"
7. Fill out the PR template and submit

### Option 2: Using Git (Advanced)

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/cotc.git
   cd cotc
   ```
3. Create a new branch:
   ```bash
   git checkout -b update-character-name
   ```
4. Edit `data/characters.json`
5. Test your changes locally:
   ```bash
   python -m http.server 8000
   # Visit http://localhost:8000
   ```
6. Commit your changes:
   ```bash
   git add data/characters.json
   git commit -m "Update Character Name awakening priorities"
   ```
7. Push to your fork:
   ```bash
   git push origin update-character-name
   ```
8. Create a Pull Request on GitHub

## 📋 Data Format

Each character in `data/characters.json` follows this structure:

```json
{
  "id": "character_id",           // Lowercase, no spaces (e.g., "primrose_ex")
  "name": "Character Name",       // Display name (e.g., "Primrose EX")
  "isFree": false,               // true for free characters
  "a4Tier": "S+",                // S+, S, A, B, C, D, or null
  "ultPriority": "L10",          // L10, L10 First, A1 L10, A4 L10, L9, L1
  "stones": {
    "AS1": "U10",                // U10, A1, A2, A3, A4, Shard, Keep
    "AS2": "A1",
    "AS3": "A2",
    "AS4": "A3",
    "AS5": "Shard"
  },
  "notes": "Brief description",
  "tags": ["tag1", "tag2"]       // Optional tags for filtering
}
```

### Field Explanations

- **id**: Unique identifier, use lowercase with underscores
- **name**: The character's display name
- **isFree**: Set to `true` for characters obtained through story/events (their stones can't be sharded)
- **a4Tier**: The tier rating of their A4 accessory
- **ultPriority**: Their ultimate skill priority level
- **stones**: What to use each awakening stone for
- **notes**: Brief explanation of the recommendation
- **tags**: Optional array for categorization

### Stone Usage Values

- **U10**: Use for Ultimate Level 10
- **A1-A4**: Use for Awakening stages 1-4
- **Shard**: Convert to awakening shards
- **Keep**: Save for future use (typically for free characters)

## ✅ What We Accept

- ✅ Character priority updates based on meta changes
- ✅ New character additions
- ✅ Corrections to existing data
- ✅ Documentation improvements
- ✅ UI/UX enhancements
- ✅ Bug fixes

## ❌ What We Don't Accept

- ❌ Subjective changes without community consensus
- ❌ Breaking changes to data structure without discussion
- ❌ Spam or joke submissions

## 📝 Pull Request Guidelines

1. **Clear Title**: Use format like "Update Lynette priority to X"
2. **Description**: Explain why the change is needed
3. **Evidence**: Link to discussions, patch notes, or community consensus
4. **One Change**: Keep PRs focused on a single character or feature
5. **Valid JSON**: Ensure no syntax errors (no trailing commas!)

### PR Template

```markdown
## Character Change

**Character**: [Character Name]
**Change Type**: [Priority Update / New Character / Fix]

## What Changed

- Previous: [Old values]
- New: [New values]

## Why This Change

[Explain the reasoning - meta shift, new content, community consensus, etc.]

## Evidence

- [Link to discussion]
- [Link to patch notes]
- [Screenshot if applicable]

## Checklist

- [ ] JSON is valid (no trailing commas)
- [ ] Character ID follows naming convention
- [ ] All required fields are present
- [ ] Change is based on evidence/consensus
```

## 🧪 Testing Your Changes

### Quick Validation

1. Copy your JSON to [JSONLint](https://jsonlint.com/)
2. Click "Validate JSON"
3. Fix any errors shown

### Local Testing

1. Start a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx http-server
   
   # PHP
   php -S localhost:8000
   ```

2. Open http://localhost:8000
3. Check that:
   - Your character appears correctly
   - Filtering still works
   - No console errors appear

## 🤝 Code of Conduct

- Be respectful and constructive
- Provide evidence for controversial changes
- Help review other PRs when possible
- Ask questions if you're unsure
- Assume good intentions

## 💬 Getting Help

- **Discord**: [COTC Community Discord](https://discord.gg/cotc)
- **Reddit**: [r/OctopathCotC](https://reddit.com/r/OctopathCotC)
- **Issues**: [GitHub Issues](https://github.com/vixay/cotc/issues)

## 🏷️ Common Tags

Use these tags in the character data:

- **Roles**: buffer, debuffer, healer, tank, dps, support
- **Priority**: top-tier, u10-priority, a4-priority, shardable
- **Type**: 5-star, 4-star, free, collab, story
- **Performance**: poor-performance, early-game, endgame
- **Collab**: nier, bravely-default, triangle-strategy

## 📊 Tier Explanations

### Ultimate Priority Tiers
- **L10**: Top priority, game-changing ultimate
- **L10 First**: Very strong ultimate, prioritize
- **A1, L10**: Get A1 first for stats, then U10
- **A4, L10**: Focus on A4 accessory first
- **L9**: Lower priority ultimate
- **L1**: Very weak ultimate

### A4 Accessory Tiers
- **S+**: Game-changing, must have
- **S**: Excellent, high priority
- **A**: Good, worth getting
- **B**: Moderate, lower priority
- **C**: Weak, often not worth it
- **D**: Very poor, skip

Thank you for contributing to the COTC community! 🎮