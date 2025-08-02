#!/usr/bin/env python3
"""
Clean up duplicate numbered images and keep only the necessary base icons.
"""

import os
import shutil
from pathlib import Path

def clean_images():
    """Remove duplicate numbered images and organize into proper structure."""
    
    images_dir = Path('images')
    if not images_dir.exists():
        print("❌ Images directory not found")
        return
    
    # Icons we need to keep (base versions only)
    essential_icons = {
        # Weapons
        'Axe.png',
        'Bow.png', 
        'Dagger.png',
        'Fan.png',
        'Spear_Polearm.png',  # Keep this version as it's referenced in markdown
        'Staff_Staves.png',   # Keep this version as it's referenced in markdown
        'Sword.png',
        'Tome.png',
        
        # Elements  
        'Dark.png',
        'Fire.png',
        'Ice.png',
        'Light.png',
        'Lightning_Thunder.png',  # Keep this version as it's referenced in markdown
        'Wind.png',
        
        # Alternative names (in case markdown uses different naming)
        'Lightning.png',
        'Polearm.png',
        'Staff.png'
    }
    
    # Create backup directory
    backup_dir = Path('images_backup')
    if backup_dir.exists():
        shutil.rmtree(backup_dir)
    backup_dir.mkdir()
    
    print("🔄 Backing up all images...")
    
    # Backup everything first
    for item in images_dir.iterdir():
        if item.is_file():
            shutil.copy2(item, backup_dir / item.name)
    
    print(f"✅ Backed up {len(list(backup_dir.iterdir()))} images to images_backup/")
    
    # Get all current images
    all_images = list(images_dir.glob('*.png'))
    
    # Identify duplicates to remove
    to_remove = []
    to_keep = []
    
    for img in all_images:
        if img.name in essential_icons:
            to_keep.append(img.name)
        else:
            # Check if it's a numbered duplicate
            base_name = img.stem.split(' ')[0] + '.png'  # Get base name without number
            if base_name in essential_icons:
                to_remove.append(img.name)
            else:
                # Check if this is a variant we might need
                print(f"⚠️  Unknown image: {img.name}")
                to_remove.append(img.name)
    
    print(f"\n📊 Analysis:")
    print(f"  - Total images: {len(all_images)}")
    print(f"  - Images to keep: {len(to_keep)}")
    print(f"  - Images to remove: {len(to_remove)}")
    
    print(f"\n✅ Essential icons to keep:")
    for icon in sorted(to_keep):
        print(f"  - {icon}")
    
    # Remove duplicates
    print(f"\n🗑️  Removing {len(to_remove)} duplicate/unnecessary images...")
    
    removed_count = 0
    for img_name in to_remove:
        img_path = images_dir / img_name
        if img_path.exists():
            img_path.unlink()
            removed_count += 1
    
    print(f"✅ Removed {removed_count} images")
    
    # Verify what's left
    remaining = list(images_dir.glob('*.png'))
    print(f"\n📁 Final images directory contains {len(remaining)} files:")
    for img in sorted(remaining):
        print(f"  - {img.name}")
    
    # Create organized folder structure for future
    print(f"\n📁 Creating organized folder structure...")
    
    weapons_dir = images_dir / 'weapons'
    elements_dir = images_dir / 'elements'
    weapons_dir.mkdir(exist_ok=True)
    elements_dir.mkdir(exist_ok=True)
    
    # Move weapons
    weapon_files = ['Axe.png', 'Bow.png', 'Dagger.png', 'Fan.png', 'Spear_Polearm.png', 'Staff_Staves.png', 'Sword.png', 'Tome.png', 'Polearm.png', 'Staff.png']
    for weapon in weapon_files:
        src = images_dir / weapon
        if src.exists():
            dst = weapons_dir / weapon
            shutil.move(str(src), str(dst))
            print(f"  Moved {weapon} to weapons/")
    
    # Move elements
    element_files = ['Dark.png', 'Fire.png', 'Ice.png', 'Light.png', 'Lightning_Thunder.png', 'Wind.png', 'Lightning.png']
    for element in element_files:
        src = images_dir / element
        if src.exists():
            dst = elements_dir / element
            shutil.move(str(src), str(dst))
            print(f"  Moved {element} to elements/")
    
    print(f"\n🎉 Image cleanup complete!")
    print(f"📁 Structure:")
    print(f"  images/")
    print(f"  ├── weapons/ ({len(list(weapons_dir.glob('*.png')))} files)")
    print(f"  └── elements/ ({len(list(elements_dir.glob('*.png')))} files)")
    print(f"  📦 Backup: images_backup/ ({len(list(backup_dir.glob('*.png')))} files)")

if __name__ == '__main__':
    clean_images()