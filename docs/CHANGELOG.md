# Changelog

All notable changes to the COTC Awakening Stone Guide will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- **Table Grouping Feature**
  - New dropdown to group characters by A4 Tier or Ultimate Priority
  - Sticky group headers that remain visible while scrolling
  - Visual separation between groups with borders
  - Groups sorted in logical order (S+ → S → A → B → C → D for A4, L10 → L9 → L1 for Ultimate)

### Changed
- **Table Header Improvements**
  - Made table headers sticky to stay visible when scrolling
  - Applied to entire `<thead>` element for better browser compatibility
  - Added subtle shadow for visual separation
- **Dark Mode Enhancements**
  - Significantly improved tier color visibility in dark mode
  - Changed tier backgrounds from #5a3a3a range to #8b4444 range for better contrast
  - Removed background highlighting for C and D tiers
  - Fixed S+ tier highlighting by updating class name handling
- **Visual Refinements**
  - Changed owned row highlighting to subtle background instead of intrusive gold
  - Improved text readability with consistent text shadows on hover
  - Fixed shard cell backgrounds to respect row states
  - Enhanced contrast for all text elements in owned rows

### Fixed
- Fixed S+ tier not showing background color (changed class from `tier-s\+` to `tier-s-plus`)
- Fixed tier column colors overriding row hover states
- Fixed poor text contrast for shard/keep/A1-A4 text in owned rows
- Fixed inconsistent text shadow application on hover

## [1.3.0] - 2025-07-04

### Added
- **Character Ownership Tracking System**
  - Added ownership checkboxes for each character
  - Added awakening level tracking (0-4) for owned characters
  - Added ultimate level tracking (1-10) for owned characters
  - Added ownership filter dropdown (All Characters / Owned Only / Not Owned)
  - All user data stored locally in browser using localStorage
- **Visual Enhancements**
  - Owned characters highlighted with distinct background
  - Non-owned characters shown with reduced opacity
  - Level inputs automatically disabled for non-owned characters
  - Smooth visual transitions for ownership state changes

### Changed
- Expanded table layout with new "Own", "Awaken", and "Ult" columns
- Updated filter system to include ownership status
- Enhanced character data structure to support user tracking

### Character Data
- Added 38 new characters bringing total from 84 to 122 characters
- **NieR Collaboration**: 2B, 9S, Kainé, Agnès
- **EX Characters**: 24 new EX versions including Primrose EX, Agnea EX, Castti EX, etc.
- **Octopath Traveler II**: Agnea, Castti, Hikari, Ochette, Osvald, Partitio, Throné
- **Boss Characters**: Odio O, Odio S
- **Other Additions**: Black Knight, Black Maiden, L'eeto, Rai Mei

## [1.2.0] - 2025-07-04

### Added
- **Dark Theme Implementation**
  - Dark theme set as default with automatic OS preference detection
  - Manual theme toggle button with localStorage persistence
  - Comprehensive dark/light theme variables using CSS custom properties
- **UI Reorganization**
  - Moved "How to Use" guide to first position
  - Added collapsible legend with auto-collapse on scroll
  - 5-second manual override protection for legend collapse
- **Donation Support**
  - Added donation link to https://coff.ee/vixay in header
  - Styled with coffee icon and hover effects

### Changed
- Reorganized page layout: Legend → Stats → Filters → Table
- Enhanced legend with collapsible functionality
- Improved theme detection with fallback chain
- Updated CSS architecture with CSS custom properties

### Fixed
- Fixed shard field background color in dark theme
- Resolved theme toggle button styling inconsistencies

## [1.1.0] - 2025-07-04

### Added
- Enhanced character filtering and search capabilities
- Improved mobile responsiveness
- Additional character validation and data quality improvements

### Changed
- Refined character data extraction process
- Updated character categorization system

## [1.0.0] - 2025-07-04

### Added
- Initial release of the COTC Awakening Stone Guide
- Complete character database with 50+ characters
- Interactive filtering by A4 tier, ultimate priority, and free status
- Search functionality
- Sortable columns
- CSV export feature
- Mobile-responsive design
- Comprehensive documentation
- GitHub Pages deployment

### Character Data
- Added all current Global/EN characters as of July 2025
- Marked 12 free characters (Elvis, Serenoa, Tikilen, etc.)
- Included awakening stone recommendations for all characters
- Added tier ratings for A4 accessories
- Categorized ultimate priorities (L10, L9, L1)

### Features
- Real-time filtering with multiple criteria
- Character count statistics
- Legend with usage guidelines
- Free character highlighting
- Export functionality for data analysis

### Documentation
- Contributing guidelines
- Data format specification
- Setup instructions for Claude Code
- Issue templates

---

## How to Update This Changelog

When making changes:

1. Add a new entry under "Unreleased"
2. Use the categories: Added, Changed, Deprecated, Removed, Fixed, Security
3. When releasing, move "Unreleased" items to a new version section
4. Follow semantic versioning (MAJOR.MINOR.PATCH)

Example:

```markdown
## [Unreleased]

### Added
- New character: [Character Name]

### Changed
- Updated [Character Name] priority from X to Y

### Fixed
- Fixed sorting issue with A4 tiers
```