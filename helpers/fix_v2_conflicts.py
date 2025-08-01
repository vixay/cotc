#!/usr/bin/env python3
"""
Fix the 5 characters in v2 that have data conflicts with v1.
Update v2 to use the correct v1 data.
"""

import json
from pathlib import Path

def normalize_char_name(name):
    """Normalize character name for matching."""
    # Handle different apostrophes (ASCII, Unicode right/left quotes, backtick)
    name = name.replace(chr(8217), "'").replace(chr(8216), "'").replace("`", "'").replace(chr(8219), "'")
    # Normalize EX suffix
    name = name.replace(" Ex", " EX")
    # Handle accent variations
    name = name.replace("è", "e").replace("é", "e").replace("ô", "o").replace("à", "a")
    # Handle specific character name variations
    name_variations = {
        "Agnes": "Agnès",
        "Thronè": "Throné", 
        "Ditrania": "Ditraina"
    }
    if name in name_variations:
        name = name_variations[name]
    return name

def load_combined_v1_data():
    """Load and combine v1 data from all sources."""
    all_chars = {}
    
    # Load from characters.json first
    v1_data_path = 'data/characters.json'
    if Path(v1_data_path).exists():
        with open(v1_data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for char in data['characters']:
                name = normalize_char_name(char['name'])
                # Skip blank "EX" entries
                if name.startswith("EX ") and len(name) <= 10:
                    continue
                all_chars[name] = char
    
    # Merge with characters_enhanced.json
    enhanced_data_path = 'data/characters_enhanced.json'
    if Path(enhanced_data_path).exists():
        with open(enhanced_data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for char in data['characters']:
                name = normalize_char_name(char['name'])
                # Skip blank "EX" entries
                if name.startswith("EX ") and len(name) <= 10:
                    continue
                if name in all_chars:
                    all_chars[name].update(char)
                else:
                    all_chars[name] = char
    
    return all_chars

def fix_v2_conflicts():
    """Fix the 5 characters in v2 that have conflicts with v1."""
    print("🔧 Fixing v2 data conflicts with v1...")
    
    # Load v1 and v2 data
    v1_chars = load_combined_v1_data()
    
    with open('data/characters_enhanced_v2.json', 'r', encoding='utf-8') as f:
        v2_data = json.load(f)
    
    # Characters that need fixing based on the verification report
    conflicted_chars = ["H'aanit", "H'aanit EX", "Ri'tu", "W'ludai", "Z'aanta"]
    
    fixed_count = 0
    
    for i, v2_char in enumerate(v2_data['characters']):
        v2_name = normalize_char_name(v2_char['name'])
        
        if v2_name in conflicted_chars and v2_name in v1_chars:
            v1_char = v1_chars[v2_name]
            
            print(f"\n🔄 Fixing {v2_char['name']}:")
            
            # Update fields that were missing or incorrect in v2
            fields_to_update = ['a4Tier', 'ultPriority', 'ultPriorityGroup', 'stones', 'notes', 'tags']
            
            for field in fields_to_update:
                if field in v1_char:
                    old_value = v2_char.get(field)
                    new_value = v1_char[field]
                    
                    if old_value != new_value:
                        print(f"  - {field}: {old_value} -> {new_value}")
                        v2_char[field] = new_value
            
            fixed_count += 1
    
    # Save the fixed v2 data
    with open('data/characters_enhanced_v2.json', 'w', encoding='utf-8') as f:
        json.dump(v2_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Fixed {fixed_count} characters in v2 data")
    print("📁 Updated file: data/characters_enhanced_v2.json")
    
    return fixed_count

if __name__ == '__main__':
    fixed_count = fix_v2_conflicts()
    print(f"\n🎉 Successfully fixed {fixed_count} character conflicts!")