# Display Views Roadmap

This document outlines potential display views for the COTC Awakening Guide to serve different user needs.

## 🎯 Display Views for Different User Needs

### 1. **Awakening Priority View** (Current)
- **Purpose**: Quick decisions on stone usage
- **Users**: All players needing awakening guidance
- **Key Info**: Stone priorities, tier ratings, ult priorities
- **Features**: Grouping by tier, ownership tracking
- **Status**: ✅ Implemented

### 2. **Team Builder View**
- **Purpose**: Build optimal teams for specific content
- **Users**: Mid-to-endgame players
- **Key Features**:
  - Filter by role (DPS, Buffer, Debuffer, Healer)
  - Show elemental/weapon coverage
  - Team synergy indicators
  - Save/load team compositions
  - Show skill interactions
- **Status**: 📋 Planned

### 3. **Character Details View** 
- **Purpose**: Deep dive into individual characters
- **Users**: Players evaluating specific units
- **Key Info**:
  - Full stats comparison (base vs max)
  - Complete skill descriptions with modifiers
  - Awakening benefits breakdown
  - Optimal equipment suggestions
  - Synergy with other characters
- **Status**: 📋 Planned (High Priority)

### 4. **Meta Tier List View**
- **Purpose**: Overall character rankings
- **Users**: New players, returning players
- **Key Features**:
  - Visual tier list (S+/S/A/B/C/D)
  - Filter by role and star rating
  - Quick "why this tier" explanations
  - Reroll recommendations
  - Investment priority guide
- **Status**: 📋 Planned (High Priority)

### 5. **Collection Tracker View**
- **Purpose**: Track collection progress
- **Users**: Completionists, long-term players
- **Features**:
  - Visual grid of all characters
  - Show owned/missing at a glance
  - Filter by obtainability (limited/permanent)
  - Collection statistics
  - Missing character roadmap
- **Status**: 📋 Planned

### 6. **Damage Calculator View**
- **Purpose**: Optimize damage output
- **Users**: Hardcore min-maxers
- **Features**:
  - Input character stats/levels
  - Calculate skill damage
  - Compare different setups
  - Show damage rotations
  - Enemy weakness exploitation
- **Status**: 📋 Future

### 7. **New Player Guide View**
- **Purpose**: Onboard new players
- **Users**: Beginners
- **Features**:
  - Simplified tier list
  - "First 10 characters to focus on"
  - Resource allocation guide
  - Common mistakes to avoid
  - Progressive unlock recommendations
- **Status**: 📋 Planned

### 8. **Event/Banner Analysis View**
- **Purpose**: Pull decisions
- **Users**: All players during new banners
- **Features**:
  - Current banner analysis
  - Pull value calculator
  - Comparison with existing roster
  - Future banner predictions
  - Ruby spending recommendations
- **Status**: 📋 Future

### 9. **Speed Reference View**
- **Purpose**: Turn order optimization
- **Users**: PvP and speed-run players
- **Features**:
  - Sort by speed stats
  - Speed tier breakpoints
  - Turn order simulator
  - Speed buff/debuff impacts
- **Status**: 📋 Future

### 10. **Skill Search View**
- **Purpose**: Find specific abilities
- **Users**: Team builders, strategists
- **Features**:
  - Search by effect (e.g., "PDF down")
  - Filter by buff/debuff duration
  - Show skill stacking rules
  - Ability cooldowns and BP costs
- **Status**: 📋 Future

## Implementation Priority

### Phase 1 (Next Release)
1. **Character Details View** - Natural extension of current data
2. **Meta Tier List View** - High demand from community

### Phase 2
3. **Team Builder View** - Advanced feature for engaged players
4. **Collection Tracker View** - Enhance current ownership system
5. **New Player Guide View** - Improve onboarding

### Phase 3
6. **Skill Search View** - Power user feature
7. **Speed Reference View** - Specialized use case
8. **Damage Calculator View** - Complex implementation
9. **Event/Banner Analysis View** - Requires external data feeds

## Technical Notes

- Each view could be a separate page or tab
- Share components for consistency (character cards, filter controls)
- The enhanced data structure (v2) supports all these views
- Consider lazy loading for performance with 244+ characters
- Mobile-first design for all new views

## Future Considerations

- **JP/Global Toggle**: Switch between regions (JP data already separated)
- **API Integration**: Live data updates from game servers (if available)
- **User Accounts**: Cloud save for teams, preferences, and ownership
- **Community Features**: Share teams, vote on tier placements