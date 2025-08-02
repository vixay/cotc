# COTC Awakening Stone Priority Guide

A community-maintained guide for Octopath Traveler: Champions of the Continent (COTC) awakening stone priorities.

🌐 **Live Site**: https://vixay.github.io/cotc/

## What's New in v2.0.0

🎉 **Major Release** - Complete overhaul with enhanced features and improved user experience!

- **🎨 Visual Tier Grouping**: Characters auto-grouped by tier with collapsible headers
- **👁️ Column Controls**: Show/hide different information groups as needed  
- **📊 Character Details**: Click any name for comprehensive stats and skills
- **🏆 GL Tier Ratings**: Official Global tier rankings with scores
- **⭐ Enhanced Info**: Star ratings, job types, roles, and smart stone display
- **💾 Smart Persistence**: All your preferences saved automatically

[View Full Changelog](docs/CHANGELOG.md#200---2025-08-02)

## Overview

This guide helps COTC players make informed decisions about using their awakening stones. Each character can use up to 5 awakening stones for various benefits:

- **Ultimate Level 10 (U10)**: Powerful ultimate skills
- **Awakening 1-4 (A1-A4)**: Stat boosts and exclusive accessories
- **Sharding**: Converting unwanted stones to awakening shards

### Data Coverage
- **244 Total Characters** including all Global/EN releases, EX variants, and collaborations
- **Enhanced Data Available** with complete stats, skills, and metadata
- **Current through January 2025** with latest characters and balance updates

## Features

### Core Features
- 📊 Complete database of 244+ Global/EN characters
- 🔍 Real-time search and filtering
- 📱 Mobile-responsive design
- 💾 CSV export functionality
- 🏷️ Free character identification
- 📈 Sortable columns with tier-aware sorting
- 🎯 Clear priority recommendations
- 🌙 Dark/Light theme support
- 📌 Sticky table headers for easy navigation

### Enhanced Features (New!)
- 🎨 **Visual Tier Grouping**: Characters automatically grouped by tier with collapsible headers
- 👁️ **Column Visibility Controls**: Show/hide column groups (Basic Info, Tiers, Ownership, Awakening Stones, Combat, Acquisition, Notes)
- 📊 **Advanced Character Details**: Click any character name for detailed stats, skills, and information
- 🏆 **GL Tier Ratings**: Overall tier rankings based on Global meta with scores
- ⭐ **Star Rating Display**: See character rarity (3★, 4★, 5★) and job classifications
- 🎭 **Role Information**: Primary/secondary role classifications for each character
- 👥 **Ownership Tracking**: Track owned characters and their awakening/ultimate levels
- 💎 **Smart Stone Display**: Awakening stones show as N/A for 3★/4★ characters
- 🔄 **Expand/Collapse All**: Quickly expand or collapse all tier groups
- 🌍 **Acquisition Information**: See continent, acquisition method, and release dates
- 💾 **Persistent Settings**: All preferences saved to localStorage

## Quick Start Guide

### For Users

Visit https://vixay.github.io/cotc/ to:
- **Search & Filter**: Find characters by name, tier, priority, or free/gacha status
- **Visual Grouping**: Characters automatically organized by tier with expand/collapse controls
- **Column Control**: Show/hide different information groups based on your needs
- **Character Details**: Click any character name for comprehensive stats and skill information
- **Track Progress**: Mark owned characters and track their awakening/ultimate levels
- **Export Data**: Download filtered results as CSV for your own analysis

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

### Current Production Data
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

### Enhanced Data Available
Complete character data with stats, skills, and metadata is available in:
- [`data/characters_enhanced_v2.json`](data/characters_enhanced_v2.json) - 244 characters with full details
- [`data/characters_jp.json`](data/characters_jp.json) - JP-specific tier ratings and release dates
- [`data/Character Markdown/`](data/Character%20Markdown/) - Individual character skill descriptions and details

The enhanced data includes:
- **Character Stats**: HP, SP, Attack, Defense, Speed, Critical (base and max levels)
- **Classifications**: Star ratings (3★, 4★, 5★), job types, primary/secondary roles
- **Combat Data**: Weapon types, elemental affinities, and weaknesses
- **Meta Information**: GL tier ratings with scores, release dates, availability
- **Skill Details**: Complete skill descriptions from markdown files with icons
- **Special Features**: Blessing of Lantern, Class Breakthrough availability

## Contributing

We welcome community contributions! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed guidelines.

### Quick Contribution Checklist

- ✅ Valid JSON (no trailing commas!)
- ✅ Evidence-based changes
- ✅ Clear pull request description
- ✅ One character per commit

## Community

- **Discord**: [COTC Community Discord](https://discord.gg/octopathcotc)
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
