# Changelog

All notable changes to the COTC Awakening Stone Guide will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [2.0.0] - 2025-08-02

### Added
- **🎨 Visual Tier Grouping System**
  - Characters automatically grouped by tier with collapsible headers
  - Always-visible visual group headers showing tier and character count
  - Expand/collapse functionality for each tier group
  - "Expand All" / "Collapse All" toggle for quick group management
  - Intelligent tier ordering (S+ → S → A → B → C → D → Not Listed)
  - Group state persistence using localStorage

- **👁️ Advanced Column Visibility Controls**
  - Dynamic column group toggles: Basic Info, Tiers, Ownership, Awakening Stones, Combat, Notes
  - CSS-based column hiding for better performance
  - Real-time toggle with visual feedback (✓ for visible, − for hidden)
  - Column visibility state persistence using localStorage
  - Always-visible character name column for consistent navigation

- **📊 Enhanced Character Details Modal**
  - Click any character name to view comprehensive details
  - Complete character stats (HP, SP, Attack, Defense, Critical, Speed)
  - Weapon types and elemental affinities with icons
  - Skill descriptions with images and metadata
  - Comprehensive character mapping covering all 244+ characters
  - Dynamic markdown content processing
  - Mobile-responsive modal design

- **🏆 GL Tier Rating System**
  - Overall tier rankings based on Global meta analysis
  - Tier scores displayed in individual character cells (e.g., "S+ (9.5)")
  - Clean tier group headers without score clutter
  - Separated from A4 tier ratings for clearer categorization

- **⭐ Enhanced Character Information**
  - Star rating display (3★, 4★, 5★) for character rarity
  - Job classification (Hunter, Warrior, Cleric, Scholar, etc.)
  - Primary/secondary role information (DPS, Buffer, etc.)
  - Smart awakening stone display (N/A for 3★/4★ characters)
  - Enhanced free character identification

- **🔧 Technical Improvements**
  - Complete migration to enhanced v2 character data (244 characters)
  - Advanced sorting within tier groups
  - Enhanced event handling and DOM management
  - Robust error handling and null safety checks
  - Performance optimizations for large datasets

### Changed
- **📋 Completely Redesigned Table Layout**
  - Reorganized columns with logical grouping
  - Ownership columns moved adjacent to each other
  - Overall Tier moved to tiers group for better organization
  - AS1-AS5 made into proper column group
  - Character name always remains visible

- **🎯 Enhanced Sorting System**
  - Tier-aware sorting that respects tier hierarchies
  - Sorting works within grouped views
  - Notes sorting prioritizes characters with notes
  - Enhanced sort indicators and visual feedback

- **💾 Improved State Management**
  - All preferences persist across sessions
  - Enhanced localStorage handling with fallbacks
  - Comprehensive settings restoration
  - Reset button restores complete default state

- **🎨 Visual and UX Improvements**
  - Default view now uses visual tier grouping
  - Enhanced theme toggle compatibility
  - Improved mobile responsiveness
  - Better accessibility with proper ARIA labels
  - Consistent design language across all features

### Fixed
- **🐛 Critical Bug Fixes**
  - Fixed character modal not loading for many characters (including Shana)
  - Fixed theme toggle not working with visual grouping system
  - Fixed missing CSS helper functions in visual grouping
  - Fixed column visibility controls not functioning
  - Fixed sorting breaking when visual grouping was enabled

- **🔧 Data and Display Issues**
  - Fixed overall tier calculation to use only GL rankings
  - Fixed awakening stone display for different star ratings
  - Fixed icon element safety checks to prevent JavaScript errors
  - Fixed event listener conflicts between systems
  - Fixed group ordering showing invalid tiers

### Character Data Updates
- **Hikari**: Updated to S tier overall, S+ A4 tier with notes "A4 gives physical res down on break"
- **Complete character mapping**: All 244+ characters now accessible via modal
- **Enhanced metadata**: Full integration of v2 character data with stats, skills, and classifications

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