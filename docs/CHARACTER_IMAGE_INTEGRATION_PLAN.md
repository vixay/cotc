# Character Image Integration Plan

## Executive Summary

This document outlines the complete strategy for downloading, organizing, and integrating character images into the COTC Meta Guide project. Based on comprehensive research and analysis, we have identified sources for all 244 characters and created a systematic approach for implementation.

## Current Status

### ✅ Completed
- **Directory Structure**: Created organized folders (`thumbnails/`, `portraits/`, `cards/`, `full/`)
- **Source Research**: Identified 3 primary image sources with coverage for all characters
- **Character Analysis**: 38 characters have confirmed wiki sources, 206 need additional research
- **Attribution Documentation**: Complete credits and licensing information documented
- **Mapping System**: Created `ImageMapper` utility class for consistent filename handling
- **Analysis Tools**: Built comprehensive analysis scripts to track progress

### 🔄 In Progress
- **Integration Planning**: Defining Vue.js integration approach
- **Download Strategy**: Prioritizing immediate downloads vs research phase

### ⏳ Pending
- **Image Downloads**: 38 confirmed characters ready for immediate download
- **Research Phase**: 206 characters need wiki page investigation
- **Processing Pipeline**: Resize/optimize images for different use cases
- **Vue Integration**: Update components to use new image system

## Implementation Phases

### Phase 1: Immediate Downloads (38 Characters) 🚀

**Target**: Characters with confirmed wiki artwork sources
**Timeline**: 1-2 days
**Deliverables**: High-quality portraits for meta-relevant characters

**Priority Characters** (Ready to download):
- **Original Octopath Cast**: Primrose, Cyrus, Olberic, Tressa, Ophilia, Therion, Alfyn, H'aanit (+ EX variants)
- **NieR Collaboration**: 2B, 9S, A2
- **High-Tier Meta Characters**: Confirmed through Drayleb analysis
- **Popular Characters**: Frequently referenced in community discussions

**Download Process**:
```bash
# Use the confirmed wiki URLs to download artwork
# Example: https://static.wikia.nocookie.net/octopath-traveler/images/5/57/CotC_Primrose_Artwork.png
```

### Phase 2: Research & Discovery (206 Characters) 🔍

**Target**: Characters without confirmed wiki sources
**Timeline**: 1 week (parallel with Phase 1)
**Deliverables**: Expanded wiki source mapping

**Research Strategy**:
1. **Manual Wiki Investigation**: Check individual character pages for artwork
2. **Systematic Pattern Testing**: Try common naming patterns:
   - `{CharacterName}_Artwork.png`
   - `{CharacterName}_CotC_Artwork.png` 
   - `{CharacterName}_Sprite.png`
3. **Community Source Verification**: Cross-reference with community resources

**High-Priority Research Targets**:
- **Solistia Characters** (35 characters): Newer game characters likely to have artwork
- **5-Star Meta Characters**: Based on tier rankings and community usage
- **Free Characters**: Story-important characters more likely to have official artwork

### Phase 3: Alternative Sources (Remaining Characters) 🎨

**Target**: Characters without wiki artwork
**Timeline**: 2-3 days
**Deliverables**: Complete character image coverage

**Alternative Strategies**:

1. **Tier List Maker Repository**:
   - 246 numbered images available
   - Requires mapping numbers to character names
   - Likely has most/all characters

2. **Spriters Resource**:
   - 212 playable character sprites
   - 22 collaboration character sprites
   - Requires sprite extraction and processing

3. **Placeholder Generation**:
   - Character initials with job class icons
   - Consistent styling with main image set
   - Temporary solution until better sources found

### Phase 4: Processing & Optimization 🛠️

**Target**: All downloaded images
**Timeline**: 1 day per batch
**Deliverables**: Web-optimized images in all required sizes

**Processing Pipeline**:
```
Original Image (Wiki/Source)
├── full/ (original resolution, optimized compression)
├── cards/ (200x280px, team building interface) 
├── portraits/ (120x120px, modal headers)
└── thumbnails/ (48x48px circular, table rows)
```

**Optimization Standards**:
- **Format**: PNG with transparency support
- **Compression**: Balanced quality/file size
- **Consistency**: Uniform aspect ratios and styling
- **Fallbacks**: Error handling for missing images

### Phase 5: Vue.js Integration 🔧

**Target**: Complete image system integration
**Timeline**: 2-3 days
**Deliverables**: Full image support in application

**Integration Points**:

1. **Character Table Rows**: Thumbnail images (48x48px)
2. **Character Modal**: Portrait images (120x120px)
3. **Future Features**: Card images for team building, full images for detail pages

**Implementation Changes**:

```javascript
// Update CharacterRow.vue
<img 
  :src="getCharacterImagePath(character.id, 'thumbnail')" 
  :alt="character.name"
  class="character-thumbnail"
  @error="handleImageError"
/>

// Update CharacterModal.vue  
<img 
  :src="getCharacterImagePath(character.id, 'portrait')" 
  :alt="character.name"
  class="character-portrait"
  @error="handleImageError"
/>

// Add to utils/imageHelper.js
import ImageMapper from '@/helpers/image_mapper.js'

const imageMapper = new ImageMapper()

export function getCharacterImagePath(characterId, imageType = 'portrait') {
  return imageMapper.getImagePath(characterId, imageType)
}

export function handleImageError(event) {
  // Fallback to placeholder image
  event.target.src = '/images/characters/placeholders/default.png'
}
```

## Technical Architecture

### File Structure
```
/images/characters/
├── thumbnails/         # 48x48px for table rows
│   ├── primrose.png
│   ├── cyrus.png
│   └── ...
├── portraits/          # 120x120px for modals
│   ├── primrose.png
│   ├── cyrus.png
│   └── ...
├── cards/             # 200x280px for team building
│   ├── primrose.png
│   ├── cyrus.png
│   └── ...
├── full/              # Original resolution
│   ├── primrose.png
│   ├── cyrus.png
│   └── ...
└── placeholders/      # Fallback images
    ├── default.png
    ├── warrior.png
    ├── hunter.png
    └── ...
```

### Naming Convention
- **Format**: `{normalized_character_id}.png`
- **Normalization**: Lowercase, underscores, no special characters
- **Examples**:
  - `primrose` → `primrose.png`
  - `h'aanit_ex` → `haanit_ex.png`
  - `2b` → `2b.png`

### ImageMapper Class Features
- **Character ID Normalization**: Consistent filename generation
- **Path Generation**: Support for all image types
- **Fallback Logic**: Graceful handling of missing images
- **Extensibility**: Easy to add new character mappings

## Success Metrics

### Coverage Targets
- **Phase 1**: 38 characters (15.6% coverage)
- **Phase 2**: Additional 100+ characters (estimated 60% total coverage)
- **Phase 3**: Remaining characters (100% coverage with fallbacks)

### Quality Standards
- **Resolution**: Minimum 256x256px for portraits
- **Consistency**: Uniform styling and aspect ratios
- **Performance**: Optimized file sizes for web delivery
- **User Experience**: Seamless integration with existing UI

### Performance Impact
- **Initial Load**: Minimal impact (lazy loading)
- **Memory Usage**: Optimized image sizes
- **Network**: Progressive loading strategy
- **Caching**: Browser cache optimization

## Risk Mitigation

### Copyright Compliance
- **Attribution**: All images credited to Square Enix
- **Fair Use**: Educational/community database usage
- **Non-Commercial**: Community resource only
- **Takedown Protocol**: Process for handling copyright issues

### Technical Risks
- **Missing Images**: Placeholder system prevents broken layouts
- **Performance**: Lazy loading and optimization minimize impact
- **Maintenance**: Automated analysis tools track completion status
- **Scalability**: Modular system supports future character additions

## Next Steps

### Immediate Actions (This Week)
1. **Begin Phase 1 Downloads**: Start with confirmed 38 characters
2. **Research Phase Setup**: Create systematic wiki investigation workflow
3. **Processing Pipeline**: Set up image optimization tools
4. **Vue Integration Planning**: Prepare component updates

### Medium Term (Next 2 Weeks)
1. **Complete Phase 1**: All confirmed characters downloaded and processed
2. **Research Phase Results**: Significant expansion of wiki source mapping
3. **Alternative Source Integration**: Begin tier list maker mapping
4. **Beta Testing**: Test image integration with subset of characters

### Long Term (Next Month)
1. **Full Coverage**: All 244 characters have appropriate images
2. **Performance Optimization**: Complete optimization and lazy loading
3. **Feature Integration**: Character images fully integrated in all UI components
4. **Documentation**: Complete user-facing documentation and contributor guides

## Resources

### Scripts & Tools
- `helpers/analyze_character_portraits.py`: Character analysis and progress tracking
- `helpers/image_mapper.js`: Filename and path management
- `docs/image_credits.md`: Complete attribution and licensing documentation

### Data Files
- `helpers/character_portrait_analysis.json`: Analysis results for download scripts
- `data/characters_enhanced_v2.json`: Character database with 244 characters

### Community Resources
- **Octopath Traveler Wiki**: Primary source for confirmed artwork
- **COTC Discord**: Community feedback and additional source identification
- **Reddit Discussions**: Meta analysis and character prioritization

---

*Last Updated: August 7, 2025*  
*Status: Research complete, ready for implementation*  
*Next Milestone: Phase 1 downloads (38 characters)*