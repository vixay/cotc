#!/usr/bin/env python3
"""
Extract skill icons from the Notion export folder based on what's actually referenced in markdown files.
"""

import os
import shutil
import re
from pathlib import Path
from collections import defaultdict

def analyze_required_images():
    """Analyze markdown files to get list of actually needed images."""
    
    markdown_dir = Path('data/Character Markdown')
    source_dir = Path('/mnt/c/Users/VJOverseer/Downloads/Private & Shared/Character List 2dd50eb0e188493fbecee1f55b8691c2')
    
    required_images = set()
    character_specific_images = defaultdict(set)
    
    print("🔍 Analyzing markdown files for image references...")
    
    for md_file in markdown_dir.glob('*.md'):
        try:
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find all image src references
            img_tags = re.findall(r'<img src="([^"]+)"', content)
            
            for img_src in img_tags:
                # Skip external URLs and notion emojis
                if img_src.startswith('https://') or img_src.startswith('notion://'):
                    continue
                
                # Decode URL encoding
                img_src = img_src.replace('%20', ' ')
                
                # Check if it's a character-specific image (has folder path)
                if '/' in img_src:
                    char_folder, img_file = img_src.split('/', 1)
                    character_specific_images[char_folder].add(img_file)
                else:
                    # General image
                    required_images.add(img_src)
                    
        except Exception as e:
            print(f"Error processing {md_file}: {e}")
    
    print(f"📊 Found references to:")
    print(f"  - {len(required_images)} general images")
    print(f"  - {len(character_specific_images)} characters with specific icons")
    
    total_skill_icons = sum(len(icons) for icons in character_specific_images.values())
    print(f"  - {total_skill_icons} total character-specific skill icons")
    
    return required_images, character_specific_images, source_dir

def extract_images():
    """Extract only the images that are actually referenced in markdown files."""
    
    required_images, character_specific_images, source_dir = analyze_required_images()
    
    if not source_dir.exists():
        print(f"❌ Source directory not found: {source_dir}")
        return
    
    # Create destination directories
    dest_images = Path('images')
    dest_skills = dest_images / 'skills'
    dest_skills.mkdir(parents=True, exist_ok=True)
    
    print(f"\n🚀 Extracting images from: {source_dir}")
    
    extracted_count = 0
    missing_count = 0
    
    # Extract character-specific skill icons
    print(f"\n⚔️  Extracting character-specific skill icons...")
    
    for char_folder, skill_icons in character_specific_images.items():
        char_source_dir = source_dir / char_folder
        
        if not char_source_dir.exists():
            print(f"⚠️  Character folder not found: {char_folder}")
            continue
        
        char_dest_dir = dest_skills / char_folder
        char_dest_dir.mkdir(parents=True, exist_ok=True)
        
        for skill_icon in skill_icons:
            source_file = char_source_dir / skill_icon
            dest_file = char_dest_dir / skill_icon
            
            if source_file.exists():
                shutil.copy2(source_file, dest_file)
                extracted_count += 1
                print(f"  ✅ {char_folder}/{skill_icon}")
            else:
                missing_count += 1
                print(f"  ❌ Missing: {char_folder}/{skill_icon}")
    
    # Extract general images (if any are referenced)
    if required_images:
        print(f"\n🖼️  Extracting general images...")
        for img_file in required_images:
            source_file = source_dir / img_file
            dest_file = dest_images / img_file
            
            if source_file.exists():
                shutil.copy2(source_file, dest_file)
                extracted_count += 1
                print(f"  ✅ {img_file}")
            else:
                missing_count += 1
                print(f"  ❌ Missing: {img_file}")
    
    print(f"\n📊 Extraction Summary:")
    print(f"  ✅ Successfully extracted: {extracted_count} images")
    print(f"  ❌ Missing files: {missing_count} images")
    
    # Show final structure
    print(f"\n📁 Final structure:")
    print(f"  images/")
    print(f"  ├── weapons/ ({len(list((dest_images / 'weapons').glob('*.png')) if (dest_images / 'weapons').exists() else [])} files)")
    print(f"  ├── elements/ ({len(list((dest_images / 'elements').glob('*.png')) if (dest_images / 'elements').exists() else [])} files)")
    print(f"  └── skills/ ({len(list(dest_skills.iterdir()))} character folders)")
    
    # Count total skill icons
    total_skill_files = sum(len(list(char_dir.glob('*.png'))) for char_dir in dest_skills.iterdir() if char_dir.is_dir())
    print(f"      └── {total_skill_files} total skill icons")
    
    return extracted_count, missing_count

def create_image_fallback_report():
    """Create a report of which images are missing for fallback handling."""
    
    _, character_specific_images, source_dir = analyze_required_images()
    
    print(f"\n📋 Creating fallback report for missing images...")
    
    missing_by_type = defaultdict(set)
    
    for char_folder, skill_icons in character_specific_images.items():
        char_source_dir = source_dir / char_folder
        
        for skill_icon in skill_icons:
            source_file = char_source_dir / skill_icon
            
            if not source_file.exists():
                # Categorize by icon type
                icon_name = skill_icon.replace('.png', '')
                if any(word in icon_name.lower() for word in ['resilience', 'resistance']):
                    missing_by_type['Resistances'].add(icon_name)
                elif any(word in icon_name.lower() for word in ['boost', 'atk', 'def']):
                    missing_by_type['Stat Boosts'].add(icon_name)
                elif any(word in icon_name.lower() for word in ['healing', 'hp', 'sp']):
                    missing_by_type['Healing/Recovery'].add(icon_name)
                elif any(weapon in icon_name.lower() for weapon in ['sword', 'axe', 'bow', 'dagger', 'spear', 'staff', 'tome', 'fan']):
                    missing_by_type['Weapon Skills'].add(icon_name)
                elif any(element in icon_name.lower() for element in ['fire', 'ice', 'lightning', 'wind', 'light', 'dark']):
                    missing_by_type['Elemental Skills'].add(icon_name)
                else:
                    missing_by_type['Other Skills'].add(icon_name)
    
    print(f"\n📝 Fallback Report:")
    for category, icons in missing_by_type.items():
        print(f"\n{category} ({len(icons)} unique):")
        for icon in sorted(icons):
            print(f"  - {icon}")
    
    return missing_by_type

if __name__ == '__main__':
    print("🎯 COTC Skill Icon Extraction")
    print("=" * 50)
    
    extracted, missing = extract_images()
    
    if missing > 0:
        print(f"\n⚠️  Some images are missing from the source.")
        print(f"Creating fallback strategy report...")
        create_image_fallback_report()
    
    print(f"\n🎉 Extraction complete!")
    print(f"You can now implement the character details modal with proper skill icons.")