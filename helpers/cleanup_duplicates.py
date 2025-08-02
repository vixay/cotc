#!/usr/bin/env python3
"""
Clean up duplicate skill icons now that shared library exists.
"""

import os
from pathlib import Path

def cleanup_duplicates():
    """Remove duplicate files from character folders."""
    
    # List of icons now in shared library
    shared_icons = {
        # Stat boosts
        'Phys_Atk_Boost.png', 'Elem_atk_Boost.png', 'BP_Recovery_Boost.png',
        'Critical_Elemental_Damage.png', 'Critical_Force.png',
        'Elem_Atk_Limit_Up.png', 'Phys_Atk_Limit_Up.png',
        
        # Resistances
        'Fire_Resilience.png', 'Ice_Resilience.png', 'Lightning_Resilience.png',
        'Wind_Resilience.png', 'Light_Resilience.png', 'Dark_Resilience.png',
        'FireIce_Resilience.png', 'LightDark_Resilience.png', 'LightningWind_Resilience.png',
        'FireLightning_Resilience.png',
        
        # Healing/Recovery
        'Vim_and_Vigor.png', 'HP_Restoration.png', 'SP_Recovery.png', 'BP_Recovery.png',
        'Rehabilitate.png', 'HP_Restoration_on_Switch.png', 'SP_Restoration_on_Switch.png',
        
        # Special effects
        'Incite.png', 'Cover.png', 'Counter.png', 'Sidesstep.png', 'Analyze.png',
        'Buff.png', 'Debuff.png', 'Barrier.png', 'Weakness_Follow-up.png',
        'Bestow_Barrier.png', 'Enchant.png', 'Raise.png', 'Jump_Follow-up_Attack.png',
        
        # Awakening
        'Awakening_IV.png',
        
        # Common
        'Accessory.png', 'More_Experience_(Joint).png', 'Flag.png'
    }
    
    skills_dir = Path('images/skills')
    removed_count = 0
    empty_dirs = []
    
    print("🧹 Cleaning up duplicate files...")
    
    for char_folder in skills_dir.iterdir():
        if not char_folder.is_dir():
            continue
        
        folder_files = list(char_folder.glob('*.png'))
        files_removed = 0
        
        for icon_file in folder_files:
            if icon_file.name in shared_icons:
                icon_file.unlink()
                removed_count += 1
                files_removed += 1
        
        # Check if folder is now empty
        remaining_files = list(char_folder.glob('*.png'))
        if not remaining_files:
            empty_dirs.append(char_folder)
        elif files_removed > 0:
            print(f"  📁 {char_folder.name}: removed {files_removed} duplicates, {len(remaining_files)} unique icons remain")
    
    print(f"\n📊 Cleanup Summary:")
    print(f"  🗑️  Removed {removed_count} duplicate files")
    print(f"  📁 Found {len(empty_dirs)} empty character folders")
    
    # Remove empty directories
    for empty_dir in empty_dirs:
        empty_dir.rmdir()
        print(f"  ♻️  Removed empty folder: {empty_dir.name}")
    
    # Show final structure
    icons_dir = Path('images/icons')
    if icons_dir.exists():
        print(f"\n📁 Final shared library structure:")
        for category_dir in sorted(icons_dir.iterdir()):
            if category_dir.is_dir():
                icon_count = len(list(category_dir.glob('*.png')))
                print(f"  images/icons/{category_dir.name}/ ({icon_count} icons)")
    
    # Calculate space saved (rough estimate)
    space_saved_kb = removed_count * 5  # Assume ~5KB per icon
    print(f"\n💾 Estimated space saved: ~{space_saved_kb}KB ({space_saved_kb/1024:.1f}MB)")

if __name__ == '__main__':
    cleanup_duplicates()