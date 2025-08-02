#!/usr/bin/env python3
"""
Analyze markdown files to identify missing images and icons.
"""

import os
import re
from pathlib import Path
from collections import defaultdict

def analyze_markdown_images():
    """Analyze all markdown files to find missing images."""
    
    markdown_dir = Path('data/Character Markdown')
    missing_images = defaultdict(set)
    image_patterns = {
        'skill_icons': set(),
        'weapon_icons': set(),
        'element_icons': set(),
        'general_icons': set(),
        'external_urls': set(),
        'notion_emojis': set()
    }
    
    # Process all markdown files
    for md_file in markdown_dir.glob('*.md'):
        try:
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find all image references
            img_tags = re.findall(r'<img src="([^"]+)"', content)
            
            for img_src in img_tags:
                # Decode URL encoding
                img_src = img_src.replace('%20', ' ')
                
                # Categorize image types
                if img_src.startswith('https://img.game8.jp/'):
                    image_patterns['external_urls'].add(img_src)
                elif img_src.startswith('notion://'):
                    image_patterns['notion_emojis'].add(img_src)
                elif '/' in img_src and img_src.endswith('.png'):
                    # Character-specific skill icons
                    image_patterns['skill_icons'].add(img_src)
                else:
                    image_patterns['general_icons'].add(img_src)
            
            # Find attribute references (weapons/elements)
            attributes = re.findall(r'Attributes: ([^\n]+)', content)
            for attr_line in attributes:
                attr_files = [a.strip() for a in attr_line.split(',')]
                for attr_file in attr_files:
                    attr_file = attr_file.replace('%20', ' ')
                    if 'Sword' in attr_file or 'Axe' in attr_file or 'Bow' in attr_file or 'Dagger' in attr_file or 'Spear' in attr_file or 'Staff' in attr_file or 'Tome' in attr_file or 'Fan' in attr_file:
                        image_patterns['weapon_icons'].add(attr_file)
                    elif 'Fire' in attr_file or 'Ice' in attr_file or 'Lightning' in attr_file or 'Wind' in attr_file or 'Light' in attr_file or 'Dark' in attr_file:
                        image_patterns['element_icons'].add(attr_file)
                    else:
                        image_patterns['general_icons'].add(attr_file)
                        
        except Exception as e:
            print(f"Error processing {md_file}: {e}")
    
    return image_patterns

def generate_image_requirements():
    """Generate a list of required images organized by type."""
    
    patterns = analyze_markdown_images()
    
    print("📋 MISSING IMAGES ANALYSIS FOR CHARACTER DETAILS VIEW")
    print("=" * 60)
    
    print(f"\n🗡️  WEAPON ICONS ({len(patterns['weapon_icons'])} unique):")
    weapon_icons = set()
    for icon in sorted(patterns['weapon_icons']):
        # Extract base weapon name
        base_name = icon.split(' ')[0].replace('.png', '')
        weapon_icons.add(base_name)
    
    for weapon in sorted(weapon_icons):
        print(f"  - {weapon}.png")
    
    print(f"\n🔥 ELEMENT ICONS ({len(patterns['element_icons'])} unique):")
    element_icons = set()
    for icon in sorted(patterns['element_icons']):
        # Extract base element name
        base_name = icon.split(' ')[0].replace('.png', '')
        if 'Lightning_Thunder' in icon:
            base_name = 'Lightning'
        if 'Staff_Staves' in icon:
            base_name = 'Staff'
        if 'Spear_Polearm' in icon:
            base_name = 'Spear'
        element_icons.add(base_name)
    
    for element in sorted(element_icons):
        print(f"  - {element}.png")
    
    print(f"\n⚔️  SKILL ICONS (Character-specific - {len(patterns['skill_icons'])} unique):")
    skill_types = set()
    for icon in sorted(patterns['skill_icons']):
        # Extract skill icon name from path
        if '/' in icon:
            skill_name = icon.split('/')[-1]
            skill_types.add(skill_name)
    
    for skill in sorted(skill_types):
        print(f"  - {skill}")
    
    print(f"\n🌐 EXTERNAL IMAGES ({len(patterns['external_urls'])} unique):")
    print("  These are hosted on game8.jp and should work as-is:")
    for url in sorted(list(patterns['external_urls'])[:5]):  # Limit to 5 examples
        print(f"  - {url}")
    if len(patterns['external_urls']) > 5:
        print(f"  ... and {len(patterns['external_urls']) - 5} more")
    
    print(f"\n🎭 NOTION EMOJIS ({len(patterns['notion_emojis'])} unique):")
    print("  These are Notion-specific and need replacement:")
    for emoji in patterns['notion_emojis']:
        print(f"  - {emoji}")
    
    print(f"\n📊 SUMMARY:")
    print(f"  - Weapon icons needed: {len(weapon_icons)}")
    print(f"  - Element icons needed: {len(element_icons)}")  
    print(f"  - Skill icons needed: {len(skill_types)}")
    print(f"  - External URLs (working): {len(patterns['external_urls'])}")
    print(f"  - Notion emojis (need replacement): {len(patterns['notion_emojis'])}")
    
    # Generate file structure suggestion
    print(f"\n📁 SUGGESTED FOLDER STRUCTURE:")
    print("  images/")
    print("  ├── weapons/")
    for weapon in sorted(weapon_icons):
        print(f"  │   ├── {weapon}.png")
    print("  ├── elements/")
    for element in sorted(element_icons):
        print(f"  │   ├── {element}.png")
    print("  ├── skills/")
    print("  │   ├── [character-specific skill icons]")
    print("  └── ui/")
    print("      └── [general UI icons]")

if __name__ == '__main__':
    generate_image_requirements()