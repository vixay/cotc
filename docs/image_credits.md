# Image Credits and Attribution

This document provides proper attribution for all character images used in the COTC Meta Guide project.

## Primary Image Sources

### 1. Octopath Traveler Wiki (Fandom)
- **URL**: https://octopathtraveler.fandom.com/
- **Content**: Official character artwork and sprites
- **License**: Images are property of Square Enix
- **Usage**: Fair use for community database and educational purposes

**Specific Sources**:
- Character artwork from official game assets
- High-quality PNG portraits
- Systematic naming convention: `{Character}_Artwork.png`

**Example Attribution**:
> Character artwork courtesy of the Octopath Traveler Wiki (https://octopathtraveler.fandom.com/)
> Original artwork and characters © Square Enix

### 2. Tier List Maker Repository
- **URL**: https://github.com/octopath-tier-list-maker/octopath-tier-list-maker.github.io
- **Content**: Numbered character images (1.png through 246.png)
- **License**: Images are property of Square Enix
- **Status**: Researched but mapping required

### 3. The Spriters Resource
- **URL**: https://www.spriters-resource.com/mobile/octopathtravelerchampionsofthecontinent/
- **Content**: Mobile game sprites and assets
- **Categories**: 
  - Playable Characters: 212 sprites
  - Collab Characters: 22 sprites
  - Non-Playable Characters: 103 sprites
- **License**: Property of Square Enix
- **Status**: Available but requires sprite extraction

## Character Portrait Sources

### Confirmed Wiki Downloads
These characters have verified high-quality artwork available from the wiki:

1. **Primrose Azelhart**
   - Source: `CotC_Primrose_Artwork.png`
   - URL: https://static.wikia.nocookie.net/octopath-traveler/images/5/57/CotC_Primrose_Artwork.png
   - Size: 1.86 MB
   - Format: PNG

2. **Original Octopath Traveler Characters**
   - Cyrus Albright (Champions of the Continent)
   - Olberic Eisenberg (Champions of the Continent)
   - Tressa Colzione (Champions of the Continent) + EX
   - Ophilia Clement (Champions of the Continent)
   - Therion (Champions of the Continent)
   - Alfyn Greengrass (Champions of the Continent)
   - H'aanit (Champions of the Continent) + EX

3. **Collaboration Characters**
   - 2B (NieR:Automata)
   - 9S (NieR:Automata)
   - A2 (NieR:Automata)
   - Adelle (Bravely Default)
   - Agnès (Bravely Default)
   - Aedelgard (Triangle Strategy)

4. **Champions-Exclusive Characters** (Partial list)
   - Canary, Cardona, Chloe, Eleonora, Falco
   - Fiore EX, Hasumi, Hayes, Jillmeila, Kouren
   - Lemaire, Lumis EX, Millard EX, Molu
   - Nina-Lanna, Nivelle, Nona, Sarisa, Sertet
   - Shana, Sofia EX, Soleil, Tithi, Yukes

## Legal Considerations

### Copyright Notice
All character images, artwork, and sprites are the intellectual property of:
- **Square Enix Holdings Co., Ltd.**
- **Square Enix Co., Ltd.**

### Fair Use Statement
These images are used under fair use for:
- Educational and informational purposes
- Community database and resource compilation  
- Non-commercial meta analysis and strategy guides
- Transformative use in database applications

### Usage Guidelines
1. **Attribution Required**: Always credit Square Enix as copyright holder
2. **Non-Commercial**: Images used only for community purposes
3. **Transformative**: Used in context of database and meta analysis
4. **Limited Distribution**: Not redistributing original assets

## Image Processing Standards

### Directory Structure
```
/images/characters/
├── thumbnails/     (48x48px circular for table rows)
├── portraits/      (120x120px for modal headers)  
├── cards/          (200x280px for team building)
└── full/           (high-resolution for detail pages)
```

### Naming Convention
- Format: `{normalized_character_id}.png`
- Normalization: lowercase, underscores, no special characters
- Examples:
  - `primrose_azelhart.png`
  - `2b.png`
  - `haanit_ex.png`

### Processing Workflow
1. Download original high-resolution artwork
2. Process into standardized sizes
3. Apply consistent formatting and compression
4. Maintain original quality for 'full' directory
5. Generate optimized versions for web use

## Alternative Sources Investigated

### Creative Uncut
- **URL**: https://www.creativeuncut.com/art_octopath-traveler-champions-of-the-continent_a.html
- **Content**: Official concept art by Naoki Ikushima
- **Status**: Reference only, may require permission for download

### Official Art Books
1. **OCTOPATH TRAVELER Design Works THE ART OF OCTOPATH 2016-2020**
   - Released: January 28, 2021 (Japan), January 31, 2024 (West)
   - Contains: Early development artwork for Champions of the Continent
   
2. **OCTOPATH TRAVELER Design Works THE ART OF OCTOPATH 2020-2023**  
   - Released: May 17, 2023 (Japan)
   - Contains: Champions of the Continent and Octopath Traveler II artwork

## Implementation Notes

### Missing Characters
As of research date (August 7, 2025), the following approach is needed:
1. **Priority 1**: Download confirmed wiki artwork (36+ characters)
2. **Priority 2**: Map tier list maker numbered images to character names
3. **Priority 3**: Extract sprites from Spriters Resource as fallback
4. **Priority 4**: Create placeholder images for any remaining characters

### Quality Standards
- **Minimum Resolution**: 256x256px for portraits
- **Preferred Format**: PNG with transparency
- **Fallback Strategy**: Generate placeholder images with character initials
- **Consistency**: Uniform aspect ratios and styling across all character images

## Contact Information

For questions about image usage, attribution, or licensing:
- **Project Repository**: https://github.com/vixay/cotc
- **Community**: COTC Discord community
- **Legal**: All rights belong to Square Enix

---

*Last Updated: August 7, 2025*
*Research Status: Character sources identified, download process ready to begin*