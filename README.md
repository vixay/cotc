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
