---
title: COTC Meta Guide - Project Architecture & Design Decisions
type: note
permalink: project-architecture/cotc-meta-guide-project-architecture-design-decisions
tags:
- '["architecture"'
- '"design-decisions"'
- '"database"'
- '"performance"'
- '"vue"'
- '"cotc"]'
---

# COTC Meta Guide - Architecture & Key Design Decisions

## Project Overview
Champions of the Continent awakening stone priority guide with comprehensive character database, skills search, and accessories information.

## Technology Stack
- **Frontend**: Vue.js 3 + Vite for main character interface
- **Legacy Pages**: Vanilla HTML/CSS/JS for accessories.html and skills.html  
- **Styling**: Global CSS component library (`src/assets/css/ui-components.css`)
- **Data**: JSON databases with normalized character, skills, and accessories data
- **Icons**: Official COTC Wiki assets for authentic game appearance

## Database Architecture

### Character Database (`data/characters.json`)
- **Primary Data**: 244 characters with complete metadata
- **Integrated Skills**: 4076+ skills with descriptions embedded in character records
- **Awakening Data**: A4 and exclusive accessories included in character objects
- **Tagging System**: Comprehensive tag system with tooltips and descriptions

### Accessories Database (`data/accessories.json`)  
- **Scope**: General accessories only (153 items)
- **Architecture Decision**: Character-specific accessories stored in character database
- **Dynamic Combination**: Accessories view combines both sources for complete listing
- **Data Quality**: 91% have complete effect descriptions after extraction fixes

### Skills Integration
- **Source**: Character Markdown files + Notion database + Excel exports
- **Integration**: All skills embedded within character records for performance
- **Documentation**: Comprehensive skills analysis in `docs/SKILLS_DATABASE_ANALYSIS.md`

## Key Architecture Decisions

### 1. Accessory Data Separation (Major Refactor)
**Problem**: Duplication between character and accessory databases
**Decision**: 
- Character-specific accessories (A4, exclusive) → Character database
- General accessories → Separate accessories database
- Views dynamically combine both sources
**Benefit**: Eliminated 244 duplicate records, single source of truth

### 2. Skills Integration Strategy
**Decision**: Embed all skills within character records rather than separate skills database
**Reasoning**: 
- Better performance (single JSON load)
- Maintains character context
- Simplifies data relationships
**Trade-off**: Larger file size but better UX

### 3. Icon Strategy
**Decision**: Use official COTC Wiki status effect icons
**Implementation**:
- Curated collection in `/images/icons/stat_boosts/` for active use
- Complete collection in `/images/wiki-icons/` for future expansion
- Proper attribution in `docs/data_sources.md`
**Benefit**: Authentic game appearance, consistent visual language

### 4. CSS Architecture
**Decision**: Global component library with `ui-` prefixed classes
**Structure**:
- `src/assets/css/ui-components.css` - Core component styles
- `src/utils/uiClasses.js` - Helper functions for consistent class generation
- Scoped styles in Vue components for specific features
**Benefit**: Consistent styling across Vue and vanilla HTML pages

### 5. Tagging System
**Implementation**: TagWithTooltip component with centralized tag definitions
**Features**:
- Hover tooltips with descriptions
- Consistent tag styling across application
- Support for priority tags (Drayleb tiers) and general classification tags

## Data Quality Standards

### Source Hierarchy
1. **Tier 1**: Official game data, MontyVGC Notion database
2. **Tier 2**: dotgg.gg tier lists, Meow Database classifications  
3. **Tier 3**: Community consensus from multiple sources

### Validation Process
- Cross-reference multiple sources for accuracy
- Pattern matching for automated data extraction
- Manual verification of priority assignments
- Community feedback integration

### Effect Description Standards
- Parsed from CSV descriptions using pattern matching
- Manual curation for complex effects
- Removal of redundant stat modifiers (handled by stats section)
- Consistent terminology and formatting

## Performance Optimizations

### Data Loading
- Single JSON file loads for better caching
- Lazy loading of character images with error handling
- Efficient filtering and search algorithms

### Asset Management
- Icon caching and consistent naming conventions
- Optimized image sizes (12px for stat icons)
- Progressive enhancement with fallbacks

## Development Workflow

### Branch Strategy
- Feature branches for major changes (`feature/vue-migration`)
- Separate branches for refactoring (`refactor/component-architecture`)
- Clean main branch with stable releases

### Code Quality
- Root cause analysis over symptom fixing
- Comprehensive documentation of decisions
- Consistent naming conventions and file organization

## Future Architecture Considerations

### Planned Enhancements
1. **Admin Dashboard**: Database editing interface
2. **Unified Search**: PrimeVue-based search combining skills and accessories
3. **Progressive Web App**: Enhanced mobile experience
4. **API Layer**: Potential backend for dynamic data updates

### Scalability Decisions
- Component-based architecture supports growth
- Separated concerns enable independent feature development
- Official asset integration provides authentic foundation for visual expansion

## Documentation Strategy
- **Technical**: Architecture decisions and implementation details
- **Data Sources**: Comprehensive attribution and quality assessment
- **User Guide**: Usage instructions and feature explanations
- **Development**: Setup, workflow, and contribution guidelines

This architecture balances performance, maintainability, and authentic game experience while supporting both current features and future expansion.