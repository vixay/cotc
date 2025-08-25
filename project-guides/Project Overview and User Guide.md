---
title: Project Overview and User Guide
type: note
permalink: project-guides/project-overview-and-user-guide
---

# OCTOPATH COTC META GUIDE

A community-maintained meta guide for Octopath Traveler: Champions of the Continent (COTC) featuring character priorities, awakening stones, tier rankings, and team building resources.

🌐 **Live Site**: https://vixay.github.io/cotc/

## What's New in v3.0.0

🚀 **Vue 3 Migration** - Complete rewrite with modern framework and enhanced functionality!

- **🏷️ Advanced Tag System**: Interactive search with autocomplete and free text input
- **🎯 Enhanced Filters**: Partial text matching for sources, improved filter controls
- **📱 Better UX**: Floating scrollbar, consistent ALL CAPS priorities, fixed auto-collapse
- **🎨 Visual Polish**: Unified color schemes, better theming, improved consistency
- **🔧 Modern Architecture**: Vue 3 + Pinia for better performance and maintainability
- **🏠 Complete Rebranding**: Now "OCTOPATH COTC META GUIDE" - comprehensive meta resource

[View Full Changelog](docs/CHANGELOG.md#300---2025-08-04)

## Overview

This comprehensive meta guide helps COTC players make informed decisions about character priorities, awakening stones, team composition, and resource management. Each character can use up to 5 awakening stones for various benefits:

- **Ultimate Level 10 (U10)**: Powerful ultimate skills
- **Awakening 1-4 (A1-A4)**: Stat boosts and exclusive accessories  
- **Sharding**: Converting unwanted stones to awakening shards
- **User Decision (?)**: Blank recommendations where you should decide based on your needs

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

1. Go to [`data/characters_enhanced_v2.json`](data/characters_enhanced_v2.json)
2. Click the pencil icon to edit
3. Make your changes following the v2 data format
4. Submit a pull request

#### Advanced Method

```bash
# Clone the repository
git clone https://github.com/vixay/cotc.git
cd cotc

# Create a branch for your changes
git checkout -b update-character-name

# Edit data/characters_enhanced_v2.json
# Test locally with: python -m http.server 8000

# Commit and push
git add data/characters_enhanced_v2.json
git commit -m "Update Character Name priorities"
git push origin update-character-name

# Create a pull request on GitHub
```

## Understanding the Guide

### Priority System

Character priorities are based on dual ratings for both Ultimate and Awakening 4 investment:

- **ESSENTIAL**: High priority characters that significantly impact the meta
- **GOOD**: Solid characters worth investing if you have resources  
- **SKIP**: Low priority characters - save resources for better alternatives

The combination of Ultimate Priority and A4 Priority determines the awakening stone recommendations through an intelligent mapping system (see Awakening Stone System below).

### Awakening Stone System

The guide uses an intelligent priority-based system to provide awakening stone recommendations:

#### Stone Types
- **U10** - Ultimate Level 10 (powerful ultimate skills)
- **A1-A4** - Awakening stages (stat boosts, skill slots, HP, accessories)
- **Shard** - Convert to awakening shards for other characters
- **? (Blank)** - User decision required based on your needs and resources

#### How Recommendations Work

Stone recommendations are generated based on dual priority ratings:

**🔴 ESSENTIAL Priority**: Strong recommendation to use stones
- Characters that significantly impact the meta
- Core units for endgame content
- High-impact ultimates or crucial awakening benefits

**🟢 GOOD Priority**: Worth investing if you have resources
- Solid characters that provide value but aren't essential
- Nice-to-have improvements for roster depth
- Situationally useful units

**⚪ SKIP Priority**: Low priority, save resources for others
- Outdated characters superseded by better alternatives
- Minimal impact units
- Resources better spent elsewhere

#### Decision Logic

The system automatically maps priority combinations to recommendations:

- **SKIP + SKIP** → `Shard` (both awakening and ultimate are weak)
- **ESSENTIAL/TOP priorities** → Use stones (clear community consensus)  
- **GOOD/MIXED priorities** → `?` Blank (you decide based on your situation)
- **MISSING priorities** → `?` Blank (insufficient community data)

#### What Blank Stones (?) Mean

When you see `?` in awakening stone columns, it means:
- The community hasn't reached clear consensus on this character
- Priorities are mixed (e.g., good awakening but skip ultimate)
- You should evaluate based on your:
  - Current roster needs
  - Available resources
  - Content goals
  - Personal preferences

**Example Decision Process:**
- Do you need this character's role in your roster?
- Do you have excess stones after investing in ESSENTIAL characters?
- Is this character useful for content you're currently tackling?

### Free Characters

Characters marked as "Free" (obtained through story/events) have stones that **cannot** be converted to general awakening shards. Their stones only give character-specific fragments.

## Data Structure

### Current Production Data
All character data is stored in [`data/characters_enhanced_v2.json`](data/characters_enhanced_v2.json). Each character entry includes comprehensive information:

```json
{
  "id": "character_id",
  "name": "Character Name",
  "isFree": false,
  "starRating": 5,
  "job": "Hunter",
  "influence": "Power",
  "continent": "Orsterra",
  "obtainedFrom": "Chance Encounters",
  "tierRatings": {
    "gl": {"tier": "S+", "score": 9.5}
  },
  "a4Tier": "S+",
  "ultPriority": "L10",
  "stones": {
    "AS1": "U10",
    "AS2": "A1", 
    "AS3": "A2",
    "AS4": "A3",
    "AS5": "Shard"
  },
  "notes": "Description of recommendation",
  "roles": {
    "primary": "DPS",
    "secondary": "Buffer"
  }
}
```

### Additional Data Files
- [`data/characters_jp.json`](data/characters_jp.json) - JP-specific tier ratings and release dates for future features
- [`data/Character Markdown/`](data/Character%20Markdown/) - Individual character skill descriptions with icons
- [`data/schema.json`](data/schema.json) - JSON schema validation for the v2 data structure

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

- **Framework**: Vue 3 with Composition API + Vite build system
- **State Management**: Pinia for reactive data handling
- **Component Libraries**: @sipec/vue3-tags-input, VueSelect
- **Hosting**: GitHub Pages
- **Data Format**: JSON
- **No Backend**: Pure static site with enhanced client-side functionality

## License

This project is community-maintained and provided as-is for the benefit of COTC players.

## Acknowledgments

- Data sourced from Reddit tier lists, Discord community, and dotgg.gg
- Thanks to all contributors who help keep this guide updated
- Special thanks to the COTC community for their research and discussions

---

**Note**: This guide is not affiliated with Square Enix or the official COTC team. It's a community project maintained by players, for players.

*Original file: README.md*  
*Migrated to Basic Memory: 2025-08-15*