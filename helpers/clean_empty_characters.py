#!/usr/bin/env python3
"""
Remove empty/blank characters from v1 JSON files.
Characters are considered empty if they lack essential data like stones, ultPriority, etc.
"""

import json
import shutil
from datetime import datetime

def is_empty_character(char):
    """Check if a character has no meaningful data."""
    # Check for missing essential fields
    essential_fields = ['ultPriority', 'stones']
    
    for field in essential_fields:
        if not char.get(field):
            return True
    
    # Check if stones are all empty
    stones = char.get('stones', {})
    if not stones or all(not v for v in stones.values()):
        return True
    
    # Check if character name is just "EX" or very short
    name = char.get('name', '')
    if name.startswith('EX ') and len(name.strip()) <= 10:
        return True
    
    # Check if notes indicate it's a placeholder
    notes = char.get('notes', '').lower()
    if 'placeholder' in notes or 'empty' in notes or notes.strip() == '':
        return True
    
    return False

def clean_json_file(filepath):
    """Clean empty characters from a JSON file."""
    print(f"\n📁 Cleaning {filepath}")
    
    # Create backup
    backup_path = filepath + '.backup'
    shutil.copy2(filepath, backup_path)
    print(f"   💾 Backup created: {backup_path}")
    
    # Load data
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    original_count = len(data['characters'])
    
    # Filter out empty characters
    clean_characters = []
    removed_characters = []
    
    for char in data['characters']:
        if is_empty_character(char):
            removed_characters.append(char['name'])
            print(f"   🗑️  Removing: {char['name']}")
        else:
            clean_characters.append(char)
    
    # Update data
    data['characters'] = clean_characters
    data['lastUpdated'] = datetime.now().strftime('%Y-%m-%d')
    
    # Add cleaning metadata
    if 'metadata' not in data:
        data['metadata'] = {}
    data['metadata']['lastCleaned'] = datetime.now().strftime('%Y-%m-%d')
    data['metadata']['charactersRemoved'] = len(removed_characters)
    
    # Save cleaned data
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"   ✅ Cleaned: {original_count} → {len(clean_characters)} characters")
    print(f"   📊 Removed {len(removed_characters)} empty characters")
    
    return removed_characters

def main():
    """Clean all v1 JSON files."""
    print("🧹 Cleaning empty characters from v1 JSON files...\n")
    
    files_to_clean = [
        'data/characters.json',
        'data/characters_enhanced.json',
        'data/characters_updated.json'
    ]
    
    all_removed = []
    
    for filepath in files_to_clean:
        try:
            removed = clean_json_file(filepath)
            all_removed.extend(removed)
        except Exception as e:
            print(f"❌ Error cleaning {filepath}: {e}")
    
    print(f"\n📊 SUMMARY")
    print("=" * 50)
    print(f"Total characters removed: {len(set(all_removed))}")
    
    if all_removed:
        print(f"\nRemoved characters:")
        for char in sorted(set(all_removed)):
            print(f"  - {char}")
    
    print(f"\n✅ Cleaning complete!")
    print(f"💾 Backups created with .backup extension")

if __name__ == '__main__':
    main()