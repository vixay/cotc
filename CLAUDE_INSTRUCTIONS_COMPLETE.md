# COTC Awakening Stone Priority Guide - Complete Instructions

## Overview

This document contains the complete instructions for understanding and contributing to the COTC (Octopath Traveler: Champions of the Continent) Awakening Stone Priority Guide web application. The guide helps players decide how to use their awakening stones efficiently based on character tiers and priorities.

**Live Site**: https://vixay.github.io/cotc/

## Project Goals

1. Create a clean, searchable web interface for awakening stone recommendations
2. Support filtering by character tier, ultimate priority, and free/gacha status
3. Enable CSV export for offline use
4. Maintain the guide through community contributions
5. Validate data integrity automatically

## Repository Structure

```
cotc/
├── index.html          # Main HTML page
├── css/
│   └── style.css      # All styles with dark/light theme support
├── js/
│   ├── app.js         # Main application logic
│   └── filters.js     # Additional filter functions (placeholder)
├── data/
│   ├── characters.json # Character data and recommendations
│   └── schema.json    # JSON validation schema
├── docs/
│   ├── README.md      # Project overview
│   ├── CONTRIBUTING.md # Contribution guidelines
│   ├── DATA_FORMAT.md # JSON schema documentation
│   └── CHANGELOG.md   # Version history
├── scripts/
│   └── validate.js    # Local validation script
├── .github/
│   ├── workflows/
│   │   └── validate.yml # GitHub Actions workflow
│   └── ISSUE_TEMPLATE/
│       ├── character-update.md
│       ├── new-character.md
│       └── bug-report.md
└── old/               # Archive of previous versions
```

## Core Files Breakdown

### 1. Main HTML Structure
**File**: [`index.html`](index.html)

The main page structure includes:
- **Header** with title, version info, GitHub/donation links
- **Collapsible Legend** explaining stone priorities and tier system
- **Stats Bar** showing total and filtered character counts
- **Filter Controls** with search box, tier/priority dropdowns, and action buttons
- **Data Table** with sortable columns for character information
- **Footer** with community links and contribution info

Key features:
- Dark theme toggle button with sun/moon icon
- Auto-collapsing legend section on scroll
- Responsive design for mobile devices
- Semantic HTML structure for accessibility

### 2. Character Data
**File**: [`data/characters.json`](data/characters.json)

The core data file containing all character information and awakening stone recommendations. Structure includes:

```json
{
  "version": "1.2.0",
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
        "AS1": "U10", "AS2": "A1", "AS3": "A2", "AS4": "A3", "AS5": "Shard"
      },
      "notes": "Top priority U10 - Best buffer for EN",
      "tags": ["buffer", "top-tier", "u10-priority", "5-star"]
    }
    // ... more characters
  ]
}
```

Key features:
- **Character Schema**: ID, name, tier ratings, stone recommendations, tags
- **Free Character Handling**: Special rules for characters that can't be sharded
- **Metadata Tracking**: Version control and data sources
- **Community Input**: Regularly updated based on player feedback

### 3. Styling System
**File**: [`css/style.css`](css/style.css)

Comprehensive stylesheet implementing the dark-first theme system and responsive design. Key features:

**Theme Architecture**:
- **Dark Default**: Dark theme as base styling
- **OS Detection**: `@media (prefers-color-scheme: light)` for light theme users
- **Manual Override**: `body.light-theme` and `body.dark-theme` classes
- **CSS Custom Properties**: Extensive use of CSS variables for theming

**Core Design Elements**:
- **Inter Font**: Modern typography with multiple weights
- **Card-Based Layout**: Consistent shadows and rounded corners
- **Color-Coded Tiers**: Visual indicators for character tiers (S+, S, A, B, C, D)
- **Stone Priority Colors**: Different colors for U10, awakening stages, sharding
- **Responsive Grid**: Adaptive layouts for mobile devices

**Interactive Components**:
- **Collapsible Legend**: Smooth animations for expanding/collapsing
- **Sortable Table**: Visual indicators for sort direction
- **Hover Effects**: Subtle interactions throughout interface
- **Theme Toggle**: Rotating icon animation on theme switch

### 4. Application Logic
**File**: [`js/app.js`](js/app.js)

Core JavaScript handling all interactive functionality. Pure vanilla JS with no framework dependencies.

**Main Functions**:
- **Data Loading**: Fetches JSON, populates table, handles errors gracefully
- **Real-Time Filtering**: Search box, tier/priority dropdowns, free/gacha toggle
- **Table Sorting**: Click column headers to sort by name, tier, or priority
- **CSV Export**: Downloads current filtered view as spreadsheet
- **Theme Management**: OS detection, localStorage persistence, manual toggle
- **Legend Collapse**: Auto-collapse on scroll, manual toggle with 5s override

**Key Implementation Details**:
```javascript
// Theme initialization with fallback chain
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.body.className = savedTheme;
    } else if (prefersDark) {
        document.body.className = 'dark-theme';
    } else {
        document.body.className = 'light-theme';
    }
}

// Stone priority CSS class mapping
function getStoneClass(value) {
    const classMap = {
        'U10': 'u10', 'A1': 'a1', 'Shard': 'shard', 'Keep': 'keep'
    };
    return classMap[value] || '';
}
```

**Additional Files**:
- [`js/filters.js`](js/filters.js): Placeholder for future filter expansions

## Documentation Overview

### Core Documentation Files

**Project Documentation**:
- [`README.md`](README.md): Main project overview, features, quick start guide
- [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md): Detailed contribution guidelines for community members
- [`docs/DATA_FORMAT.md`](docs/DATA_FORMAT.md): Complete JSON schema documentation and validation rules
- [`docs/CHANGELOG.md`](docs/CHANGELOG.md): Version history and update tracking

Key aspects covered in documentation:
- **User Guide**: How to search, filter, sort, and export data
- **Contributor Workflows**: GitHub Issues vs Pull Request methods
- **Data Standards**: Character naming, tier ratings, stone priority values
- **Validation Process**: Local testing and automated checks

## Automation & Validation

### Data Validation System
**Files**: 
- [`data/schema.json`](data/schema.json): JSON Schema for character data validation
- [`scripts/validate.js`](scripts/validate.js): Node.js validation script with comprehensive checks
- [`.github/workflows/validate.yml`](.github/workflows/validate.yml): GitHub Actions automated validation

**Validation Features**:
- **JSON Schema**: Validates structure, required fields, and allowed values
- **Business Logic**: Checks free character constraints, duplicate detection
- **Automated Testing**: Runs on all Pull Requests targeting character data
- **Local Development**: `node scripts/validate.js` for pre-commit testing

### Community Contribution Templates
**Files**: [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE/)
- [`character-update.md`](.github/ISSUE_TEMPLATE/character-update.md): Template for updating existing character data
- [`new-character.md`](.github/ISSUE_TEMPLATE/new-character.md): Template for adding newly released characters  
- [`bug-report.md`](.github/ISSUE_TEMPLATE/bug-report.md): Template for reporting issues

**Template Features**:
- **Structured Forms**: Consistent data collection from contributors
- **Required Fields**: Ensures all necessary information is provided
- **Auto-Labeling**: Categorizes issues for easier management
- **Validation Reminders**: Built-in checklists for data quality

## Development Workflow

### Local Development
```bash
# Start local server for testing
python -m http.server 8000
# Visit http://localhost:8000

# Validate data changes
node scripts/validate.js

# Git workflow for updates
git checkout -b update-character-name
# Edit data/characters.json
git add data/characters.json
git commit -m "Update Character Name priorities"
git push origin update-character-name
```

### Key Architecture Principles

1. **No Build Process**: Pure static site with no compilation steps
2. **Client-Side Only**: All data processing happens in browser
3. **Community-Driven**: JSON data maintained by game community
4. **Validation-First**: Automated checks ensure data quality
5. **Theme-Aware**: Dark-first design with OS detection
6. **Mobile-Responsive**: Works across all device types

### Technology Stack
- **Frontend**: Vanilla HTML/CSS/JavaScript (no frameworks)
- **Data**: JSON with JSON Schema validation
- **Hosting**: GitHub Pages (static hosting)
- **CI/CD**: GitHub Actions for automated validation
- **Community**: GitHub Issues and Pull Requests for contributions

This architecture enables rapid community contributions while maintaining data quality and user experience consistency.