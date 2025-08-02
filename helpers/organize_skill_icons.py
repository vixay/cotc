#!/usr/bin/env python3
"""
Reorganize skill icons by deduplicating and creating a shared icon library.
Analyze icon usage patterns and create categories.
"""

import os
import shutil
import hashlib
from pathlib import Path
from collections import defaultdict, Counter

def get_file_hash(file_path):
    """Get MD5 hash of a file to identify duplicates."""
    hash_md5 = hashlib.md5()
    try:
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    except Exception as e:
        print(f"Error hashing {file_path}: {e}")
        return None

def analyze_skill_icons():
    """Analyze all skill icons to find duplicates and patterns."""
    
    skills_dir = Path('images/skills')
    if not skills_dir.exists():
        print("❌ Skills directory not found")
        return
    
    # Track all icons by filename and hash
    icon_files = defaultdict(list)  # filename -> list of (character_folder, file_path)
    icon_hashes = defaultdict(list)  # hash -> list of file_paths
    icon_names = Counter()  # count occurrences of each icon name
    
    print("🔍 Analyzing skill icons...")
    
    total_files = 0
    for char_folder in skills_dir.iterdir():
        if not char_folder.is_dir():
            continue
            
        for icon_file in char_folder.glob('*.png'):
            total_files += 1
            filename = icon_file.name
            icon_files[filename].append((char_folder.name, icon_file))
            icon_names[filename] += 1
            
            # Get file hash to identify true duplicates
            file_hash = get_file_hash(icon_file)
            if file_hash:
                icon_hashes[file_hash].append(icon_file)
    
    print(f"📊 Analysis Results:")
    print(f"  - Total icon files: {total_files}")
    print(f"  - Unique filenames: {len(icon_files)}")
    print(f"  - Character folders: {len(list(skills_dir.iterdir()))}")
    
    # Find duplicates by filename
    duplicate_names = {name: paths for name, paths in icon_files.items() if len(paths) > 1}
    print(f"  - Duplicate filenames: {len(duplicate_names)}")
    
    # Find exact file duplicates by hash
    exact_duplicates = {hash_val: paths for hash_val, paths in icon_hashes.items() if len(paths) > 1}
    print(f"  - Exact duplicate files: {len(exact_duplicates)}")
    
    return icon_files, duplicate_names, exact_duplicates, icon_names

def categorize_icons(icon_names):
    """Categorize icons by their apparent function based on filename."""
    
    categories = {
        'stat_boosts': [],
        'resistances': [],
        'healing_recovery': [],
        'damage_effects': [],
        'weapon_skills': [],
        'element_skills': [],
        'special_effects': [],
        'awakening': [],
        'character_specific': []
    }
    
    for icon_name, count in icon_names.items():
        name_lower = icon_name.lower()
        
        # Stat boosts
        if any(word in name_lower for word in ['boost', 'atk', 'def', 'spd', 'crit']):
            categories['stat_boosts'].append((icon_name, count))
        
        # Resistances
        elif any(word in name_lower for word in ['resilience', 'resistance']):
            categories['resistances'].append((icon_name, count))
        
        # Healing/Recovery
        elif any(word in name_lower for word in ['healing', 'hp', 'sp', 'recovery', 'restoration', 'vim']):
            categories['healing_recovery'].append((icon_name, count))
        
        # Damage effects
        elif any(word in name_lower for word in ['damage', 'critical', 'force', 'limit', 'potency']):
            categories['damage_effects'].append((icon_name, count))
        
        # Weapon skills
        elif any(weapon in name_lower for weapon in ['sword', 'axe', 'bow', 'dagger', 'spear', 'staff', 'tome', 'fan']):
            categories['weapon_skills'].append((icon_name, count))
        
        # Element skills
        elif any(element in name_lower for element in ['fire', 'ice', 'lightning', 'wind', 'light', 'dark']):
            categories['element_skills'].append((icon_name, count))
        
        # Awakening
        elif 'awakening' in name_lower:
            categories['awakening'].append((icon_name, count))
        
        # Special effects
        elif any(word in name_lower for word in ['follow', 'jump', 'counter', 'barrier', 'incite', 'cover', 'analyze', 'buff', 'debuff']):
            categories['special_effects'].append((icon_name, count))
        
        # Character specific (names or unique abilities)
        else:
            categories['character_specific'].append((icon_name, count))
    
    return categories

def create_shared_library(duplicate_names, categories):
    """Create a shared icon library and suggest reorganization."""
    
    shared_dir = Path('images/icons')
    shared_dir.mkdir(exist_ok=True)
    
    # Create category subdirectories
    for category in categories.keys():
        (shared_dir / category).mkdir(exist_ok=True)
    
    print(f"\n📁 Suggested reorganization:")
    print(f"  images/icons/")
    
    total_duplicates = 0
    space_saved = 0
    
    for category, icons in categories.items():
        if not icons:
            continue
            
        print(f"  ├── {category}/ ({len(icons)} icons)")
        category_dir = shared_dir / category
        
        for icon_name, count in sorted(icons, key=lambda x: x[1], reverse=True)[:5]:  # Show top 5
            if count > 1:
                total_duplicates += count - 1
                # Estimate space saved (assuming ~5KB per icon)
                space_saved += (count - 1) * 5
            print(f"  │   ├── {icon_name} (used {count}x)")
    
    print(f"\n💾 Potential space savings:")
    print(f"  - Duplicate files to remove: {total_duplicates}")
    print(f"  - Estimated space saved: ~{space_saved}KB ({space_saved/1024:.1f}MB)")
    
    return shared_dir

def generate_icon_mapping():
    """Generate a mapping file for the modal to find shared icons."""
    
    mapping = {}
    
    # Common icon mappings based on filename patterns
    icon_patterns = {
        # Stat boosts
        'Phys_Atk_Boost.png': 'icons/stat_boosts/Phys_Atk_Boost.png',
        'Elem_atk_Boost.png': 'icons/stat_boosts/Elem_atk_Boost.png',
        'Max_HP_Boost.png': 'icons/stat_boosts/Max_HP_Boost.png',
        'Critical_Force.png': 'icons/damage_effects/Critical_Force.png',
        'BP_Recovery_Boost.png': 'icons/healing_recovery/BP_Recovery_Boost.png',
        
        # Resistances
        'Fire_Resilience.png': 'icons/resistances/Fire_Resilience.png',
        'Ice_Resilience.png': 'icons/resistances/Ice_Resilience.png',
        'Lightning_Resilience.png': 'icons/resistances/Lightning_Resilience.png',
        'Wind_Resilience.png': 'icons/resistances/Wind_Resilience.png',
        'Light_Resilience.png': 'icons/resistances/Light_Resilience.png',
        'Dark_Resilience.png': 'icons/resistances/Dark_Resilience.png',
        
        # Healing/Recovery
        'HP_Restoration.png': 'icons/healing_recovery/HP_Restoration.png',
        'SP_Recovery.png': 'icons/healing_recovery/SP_Recovery.png',
        'Vim_and_Vigor.png': 'icons/healing_recovery/Vim_and_Vigor.png',
        'Rehabilitate.png': 'icons/healing_recovery/Rehabilitate.png',
        
        # Special effects
        'Incite.png': 'icons/special_effects/Incite.png',
        'Cover.png': 'icons/special_effects/Cover.png',
        'Counter.png': 'icons/special_effects/Counter.png',
        'Sidesstep.png': 'icons/special_effects/Sidesstep.png',
        'Analyze.png': 'icons/special_effects/Analyze.png',
        
        # Awakening
        'Awakening_IV.png': 'icons/awakening/Awakening_IV.png',
    }
    
    return icon_patterns

def main():
    print("🎯 COTC Skill Icon Organization")
    print("=" * 50)
    
    # Analyze current structure
    icon_files, duplicate_names, exact_duplicates, icon_names = analyze_skill_icons()
    
    # Categorize icons
    print(f"\n🏷️  Categorizing icons...")
    categories = categorize_icons(icon_names)
    
    # Show categories
    for category, icons in categories.items():
        if icons:
            print(f"\n{category.upper().replace('_', ' ')} ({len(icons)} unique):")
            # Show most common icons in each category
            for icon_name, count in sorted(icons, key=lambda x: x[1], reverse=True)[:10]:
                print(f"  • {icon_name} (used {count}x)")
    
    # Suggest reorganization
    shared_dir = create_shared_library(duplicate_names, categories)
    
    # Generate mapping
    icon_mapping = generate_icon_mapping()
    
    print(f"\n🔗 Icon mapping suggestions:")
    for old_name, new_path in list(icon_mapping.items())[:10]:
        print(f"  {old_name} → {new_path}")
    
    print(f"\n📋 Next steps:")
    print(f"  1. Create shared icons directory with categories")
    print(f"  2. Copy one instance of each duplicate to shared location")
    print(f"  3. Update character-modal.js to use shared icons")
    print(f"  4. Remove duplicate character-specific folders")
    print(f"  5. Keep only truly character-specific icons in character folders")

if __name__ == '__main__':
    main()