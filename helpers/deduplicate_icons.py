#!/usr/bin/env python3
"""
Deduplicate skill icons and create shared icon library.
"""

import os
import shutil
import hashlib
from pathlib import Path
from collections import defaultdict

def create_shared_icon_library():
    """Create the shared icon library with organized categories."""
    
    skills_dir = Path('images/skills')
    icons_dir = Path('images/icons')
    
    if not skills_dir.exists():
        print("❌ Skills directory not found")
        return
    
    # Create organized structure
    categories = {
        'stat_boosts': [
            'Phys_Atk_Boost.png', 'Elem_atk_Boost.png', 'BP_Recovery_Boost.png',
            'Critical_Elemental_Damage.png', 'Critical_Force.png', 'Max_HP_Boost.png',
            'Elem_Atk_Limit_Up.png', 'Phys_Atk_Limit_Up.png', 'Max_SP_Boost.png'
        ],
        'resistances': [
            'Fire_Resilience.png', 'Ice_Resilience.png', 'Lightning_Resilience.png',
            'Wind_Resilience.png', 'Light_Resilience.png', 'Dark_Resilience.png',
            'FireIce_Resilience.png', 'LightDark_Resilience.png', 'LightningWind_Resilience.png',
            'FireLightning_Resilience.png'
        ],
        'healing_recovery': [
            'Vim_and_Vigor.png', 'HP_Restoration.png', 'SP_Recovery.png', 'BP_Recovery.png',
            'Rehabilitate.png', 'HP_Restoration_on_Switch.png', 'SP_Restoration_on_Switch.png'
        ],
        'special_effects': [
            'Incite.png', 'Cover.png', 'Counter.png', 'Sidesstep.png', 'Analyze.png',
            'Buff.png', 'Debuff.png', 'Barrier.png', 'Weakness_Follow-up.png',
            'Bestow_Barrier.png', 'Enchant.png', 'Raise.png', 'Jump_Follow-up_Attack.png'
        ],
        'awakening': [
            'Awakening_IV.png'
        ],
        'common': [
            'Accessory.png', 'More_Experience_(Joint).png', 'Flag.png'
        ]
    }
    
    # Create directory structure
    icons_dir.mkdir(exist_ok=True)
    for category in categories.keys():
        (icons_dir / category).mkdir(exist_ok=True)
    
    print("🗂️  Creating shared icon library...")
    
    # Track what we've already copied to avoid duplicates
    copied_icons = set()
    stats = {'copied': 0, 'skipped': 0, 'missing': 0}
    
    # Copy icons by category
    for category, icon_list in categories.items():
        print(f"\n📁 {category.upper().replace('_', ' ')}:")
        category_dir = icons_dir / category
        
        for icon_name in icon_list:
            if icon_name in copied_icons:
                continue
                
            # Find first occurrence of this icon
            source_file = None
            for char_folder in skills_dir.iterdir():
                if not char_folder.is_dir():
                    continue
                potential_file = char_folder / icon_name
                if potential_file.exists():
                    source_file = potential_file
                    break
            
            if source_file:
                dest_file = category_dir / icon_name
                shutil.copy2(source_file, dest_file)
                copied_icons.add(icon_name)
                stats['copied'] += 1
                print(f"  ✅ {icon_name}")
            else:
                stats['missing'] += 1
                print(f"  ❌ {icon_name} (not found)")
    
    print(f"\n📊 Library Creation Summary:")
    print(f"  ✅ Copied: {stats['copied']} icons")
    print(f"  ❌ Missing: {stats['missing']} icons")
    
    return icons_dir, copied_icons

def update_character_modal():
    """Update character-modal.js to use shared icons."""
    
    modal_js = Path('js/character-modal.js')
    if not modal_js.exists():
        print("❌ character-modal.js not found")
        return
    
    print("\n🔧 Updating character-modal.js...")
    
    # Read current content
    with open(modal_js, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add icon resolution function
    icon_resolver = '''
    getSharedIconPath(iconName) {
        // Map common icons to shared locations
        const sharedIcons = {
            // Stat boosts
            'Phys_Atk_Boost.png': 'icons/stat_boosts/Phys_Atk_Boost.png',
            'Elem_atk_Boost.png': 'icons/stat_boosts/Elem_atk_Boost.png',
            'BP_Recovery_Boost.png': 'icons/stat_boosts/BP_Recovery_Boost.png',
            'Critical_Force.png': 'icons/stat_boosts/Critical_Force.png',
            'Critical_Elemental_Damage.png': 'icons/stat_boosts/Critical_Elemental_Damage.png',
            'Max_HP_Boost.png': 'icons/stat_boosts/Max_HP_Boost.png',
            'Elem_Atk_Limit_Up.png': 'icons/stat_boosts/Elem_Atk_Limit_Up.png',
            'Phys_Atk_Limit_Up.png': 'icons/stat_boosts/Phys_Atk_Limit_Up.png',
            
            // Resistances
            'Fire_Resilience.png': 'icons/resistances/Fire_Resilience.png',
            'Ice_Resilience.png': 'icons/resistances/Ice_Resilience.png',
            'Lightning_Resilience.png': 'icons/resistances/Lightning_Resilience.png',
            'Wind_Resilience.png': 'icons/resistances/Wind_Resilience.png',
            'Light_Resilience.png': 'icons/resistances/Light_Resilience.png',
            'Dark_Resilience.png': 'icons/resistances/Dark_Resilience.png',
            'FireIce_Resilience.png': 'icons/resistances/FireIce_Resilience.png',
            'LightDark_Resilience.png': 'icons/resistances/LightDark_Resilience.png',
            'LightningWind_Resilience.png': 'icons/resistances/LightningWind_Resilience.png',
            'FireLightning_Resilience.png': 'icons/resistances/FireLightning_Resilience.png',
            
            // Healing/Recovery
            'Vim_and_Vigor.png': 'icons/healing_recovery/Vim_and_Vigor.png',
            'HP_Restoration.png': 'icons/healing_recovery/HP_Restoration.png',
            'SP_Recovery.png': 'icons/healing_recovery/SP_Recovery.png',
            'BP_Recovery.png': 'icons/healing_recovery/BP_Recovery.png',
            'Rehabilitate.png': 'icons/healing_recovery/Rehabilitate.png',
            
            // Special effects
            'Incite.png': 'icons/special_effects/Incite.png',
            'Cover.png': 'icons/special_effects/Cover.png',
            'Counter.png': 'icons/special_effects/Counter.png',
            'Sidesstep.png': 'icons/special_effects/Sidesstep.png',
            'Analyze.png': 'icons/special_effects/Analyze.png',
            'Buff.png': 'icons/special_effects/Buff.png',
            'Debuff.png': 'icons/special_effects/Debuff.png',
            'Barrier.png': 'icons/special_effects/Barrier.png',
            'Weakness_Follow-up.png': 'icons/special_effects/Weakness_Follow-up.png',
            'Bestow_Barrier.png': 'icons/special_effects/Bestow_Barrier.png',
            'Enchant.png': 'icons/special_effects/Enchant.png',
            'Raise.png': 'icons/special_effects/Raise.png',
            
            // Awakening
            'Awakening_IV.png': 'icons/awakening/Awakening_IV.png',
            
            // Common
            'Accessory.png': 'icons/common/Accessory.png',
            'More_Experience_(Joint).png': 'icons/common/More_Experience_(Joint).png',
            'Flag.png': 'icons/common/Flag.png'
        };
        
        return sharedIcons[iconName] || null;
    }
    '''
    
    # Insert the new function before processImagePath
    if 'processImagePath(imagePath)' in content:
        content = content.replace(
            'processImagePath(imagePath) {',
            icon_resolver + '\n    processImagePath(imagePath) {'
        )
    
    # Update processImagePath to use shared icons
    old_process_image = '''processImagePath(imagePath) {
        // Handle different image sources
        if (imagePath.startsWith('https://')) {
            return imagePath; // External image
        }
        
        if (imagePath.startsWith('notion://')) {
            return this.getNotionEmojiReplacement(imagePath); // Notion emoji
        }
        
        // Local image - try to map it to our organized structure
        if (imagePath.includes('/')) {
            const parts = imagePath.split('/');
            const fileName = parts[parts.length - 1].replace(/%20/g, ' ');
            const characterFolder = parts[0];
            
            return `images/skills/${characterFolder}/${fileName}`;
        }
        
        return `images/${imagePath}`;
    }'''
    
    new_process_image = '''processImagePath(imagePath) {
        // Handle different image sources
        if (imagePath.startsWith('https://')) {
            return imagePath; // External image
        }
        
        if (imagePath.startsWith('notion://')) {
            return this.getNotionEmojiReplacement(imagePath); // Notion emoji
        }
        
        // Local image - try shared icons first
        if (imagePath.includes('/')) {
            const parts = imagePath.split('/');
            const fileName = parts[parts.length - 1].replace(/%20/g, ' ');
            
            // Check if this is a shared icon
            const sharedPath = this.getSharedIconPath(fileName);
            if (sharedPath) {
                return `images/${sharedPath}`;
            }
            
            // Fall back to character-specific path
            const characterFolder = parts[0];
            return `images/skills/${characterFolder}/${fileName}`;
        }
        
        return `images/${imagePath}`;
    }'''
    
    content = content.replace(old_process_image, new_process_image)
    
    # Write updated content
    with open(modal_js, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("  ✅ Updated character-modal.js with shared icon support")

def cleanup_duplicate_files(copied_icons):
    """Remove duplicate files from character folders (keeping one copy)."""
    
    skills_dir = Path('images/skills')
    removed_count = 0
    
    print(f"\n🧹 Cleaning up duplicate files...")
    
    for char_folder in skills_dir.iterdir():
        if not char_folder.is_dir():
            continue
        
        for icon_file in char_folder.glob('*.png'):
            if icon_file.name in copied_icons:
                # This icon now exists in shared library, remove duplicate
                icon_file.unlink()
                removed_count += 1
    
    print(f"  🗑️  Removed {removed_count} duplicate files")
    
    # Clean up empty directories
    empty_dirs = 0
    for char_folder in skills_dir.iterdir():
        if char_folder.is_dir() and not any(char_folder.iterdir()):
            char_folder.rmdir()
            empty_dirs += 1
    
    print(f"  📁 Removed {empty_dirs} empty character folders")

def main():
    print("🎯 COTC Icon Deduplication")
    print("=" * 40)
    
    # Create shared library
    icons_dir, copied_icons = create_shared_icon_library()
    
    # Update JavaScript to use shared icons
    update_character_modal()
    
    # Ask before removing duplicates
    print(f"\n⚠️  About to remove {len(copied_icons)} duplicate files from character folders.")
    response = input("Continue? (y/N): ").lower().strip()
    
    if response == 'y':
        cleanup_duplicate_files(copied_icons)
        print(f"\n🎉 Deduplication complete!")
        print(f"  📁 Shared library: images/icons/")
        print(f"  💾 Space saved: ~{len(copied_icons) * 5}KB")
    else:
        print(f"\n⏸️  Skipped cleanup - shared library created but duplicates remain")

if __name__ == '__main__':
    main()