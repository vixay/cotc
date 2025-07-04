# Claude Code Instructions - Part 5A: Documentation Files

## File 6: README.md

Create this file in the root directory:

```markdown
# COTC Awakening Stone Priority Guide

A community-maintained guide for Octopath Traveler: Champions of the Continent (COTC) awakening stone priorities.

🌐 **Live Site**: https://vixay.github.io/cotc/

## Overview

This guide helps COTC players make informed decisions about using their awakening stones. Each character can use up to 5 awakening stones for various benefits:

- **Ultimate Level 10 (U10)**: Powerful ultimate skills
- **Awakening 1-4 (A1-A4)**: Stat boosts and exclusive accessories
- **Sharding**: Converting unwanted stones to awakening shards

## Features

- 📊 Complete database of all Global/EN characters
- 🔍 Real-time search and filtering
- 📱 Mobile-responsive design
- 💾 CSV export functionality
- 🏷️ Free character identification
- 📈 Sortable columns
- 🎯 Clear priority recommendations

## Quick Start Guide

### For Users

Visit https://vixay.github.io/cotc/ to:
- Search for specific characters
- Filter by A4 tier or ultimate priority
- Export data for your own analysis
- View recommendations for each awakening stone

### For Contributors

#### Easy Method (No coding required!)

1. Go to [`data/characters.json`](data/characters.json)
2. Click the pencil icon to edit
3. Make your changes following the format
4. Submit a pull request

#### Advanced Method

```bash
# Clone the repository
git clone https://github.com/vixay/cotc.git
cd cotc

# Create a branch for your changes
git checkout -b update-character-name

# Edit data/characters.json
# Test locally with: python -m http.server 8000

# Commit and push
git add data/characters.json
git commit -m "Update Character Name priorities"
git push origin update-character-name

# Create a pull request on GitHub
```

## Understanding the Guide

### Priority System

- **L10 (Top Priority)**: Game-changing ultimates - use stones for U10 first
- **L10 First**: Strong ultimates worth prioritizing
- **A1, L10**: Get A1 for stats first, then U10
- **A4, L10**: Focus on A4 accessory first
- **L9**: Lower priority ultimates
- **L1**: Very weak ultimates

### Stone Recommendations

- **U10**: Use for Ultimate Level 10
- **A1-A4**: Use for Awakening stages
- **Shard**: Convert to awakening shards
- **Keep**: Save for future (mainly free characters)

### Free Characters

Characters marked as "Free" (obtained through story/events) have stones that **cannot** be converted to general awakening shards. Their stones only give character-specific fragments.

## Data Structure

All character data is stored in [`data/characters.json`](data/characters.json). Each character entry includes:

```json
{
  "id": "character_id",
  "name": "Character Name",
  "isFree": false,
  "a4Tier": "S+",
  "ultPriority": "L10",
  "stones": {
    "AS1": "U10",
    "AS2": "A1",
    "AS3": "A2",
    "AS4": "A3",
    "AS5": "Shard"
  },
  "notes": "Description of recommendation"
}
```

## Contributing

We welcome community contributions! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed guidelines.

### Quick Contribution Checklist

- ✅ Valid JSON (no trailing commas!)
- ✅ Evidence-based changes
- ✅ Clear pull request description
- ✅ One character per commit

## Community

- **Discord**: [COTC Community Discord](https://discord.gg/cotc)
- **Reddit**: [r/OctopathCotC](https://reddit.com/r/OctopathCotC)
- **Issues**: [Report bugs or suggest features](https://github.com/vixay/cotc/issues)

## Technical Details

- **Framework**: Vanilla JavaScript + HTML/CSS
- **Hosting**: GitHub Pages
- **Data Format**: JSON
- **No Backend**: Pure static site
- **No Dependencies**: No build process required

## License

This project is community-maintained and provided as-is for the benefit of COTC players.

## Acknowledgments

- Data sourced from Reddit tier lists, Discord community, and dotgg.gg
- Thanks to all contributors who help keep this guide updated
- Special thanks to the COTC community for their research and discussions

---

**Note**: This guide is not affiliated with Square Enix or the official COTC team. It's a community project maintained by players, for players.
```

## File 7: docs/CONTRIBUTING.md

Create the directory and file:
1. `mkdir -p docs`
2. Create `docs/CONTRIBUTING.md`:

```markdown
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
  "ultPriorityGroup": "top",     // top, high, medium, low, lowest
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
- **ultPriorityGroup**: General grouping for ultimate priority
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
```

## Next Steps
Continue with Part 5B for more documentation files