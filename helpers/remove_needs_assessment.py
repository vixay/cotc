#!/usr/bin/env python3
"""
Remove all characters with "needs tier assessment" from v1 JSON files.
"""

import json
import shutil
from datetime import datetime

def needs_assessment(char):
    """Check if character needs tier assessment."""
    notes = char.get('notes', '').lower()
    return 'needs tier assessment' in notes or 'needs assessment' in notes

def clean_assessment_characters(filepath):
    """Remove characters that need tier assessment from a JSON file."""
    print(f"\n📁 Cleaning {filepath}")
    
    # Create backup
    backup_path = filepath + '.needs_assessment_backup'
    shutil.copy2(filepath, backup_path)
    print(f"   💾 Backup created: {backup_path}")
    
    # Load data
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    original_count = len(data['characters'])
    
    # Filter out characters that need assessment
    keep_characters = []
    removed_characters = []
    
    for char in data['characters']:
        if needs_assessment(char):
            removed_characters.append(char['name'])
            print(f"   🗑️  Removing: {char['name']} (needs tier assessment)")
        else:
            keep_characters.append(char)
    
    # Update data
    data['characters'] = keep_characters
    data['lastUpdated'] = datetime.now().strftime('%Y-%m-%d')
    
    # Add cleaning metadata
    if 'metadata' not in data:
        data['metadata'] = {}
    data['metadata']['lastAssessmentCleaning'] = datetime.now().strftime('%Y-%m-%d')
    data['metadata']['assessmentCharactersRemoved'] = len(removed_characters)
    
    # Save cleaned data
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"   ✅ Cleaned: {original_count} → {len(keep_characters)} characters")
    print(f"   📊 Removed {len(removed_characters)} characters needing assessment")
    
    return removed_characters

def main():
    """Clean all v1 JSON files."""
    print("🧹 Removing characters that need tier assessment from v1 JSON files...\n")
    
    files_to_clean = [
        'data/characters.json',
        'data/characters_enhanced.json',
        'data/characters_updated.json'
    ]
    
    all_removed = []
    
    for filepath in files_to_clean:
        try:
            removed = clean_assessment_characters(filepath)
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
    
    print(f"\n✅ Assessment cleaning complete!")
    print(f"💾 Backups created with .needs_assessment_backup extension")

if __name__ == '__main__':
    main()