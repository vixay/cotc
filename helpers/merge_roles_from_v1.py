#!/usr/bin/env python3
"""
Merge role data from v1 enhanced file back into v2 data.
"""

import json
from pathlib import Path

def merge_roles_from_v1():
    """Merge role information from v1 back into v2."""
    
    v1_file = Path('data/characters_enhanced.json')
    v2_file = Path('data/characters_enhanced_v2.json')
    
    if not v1_file.exists():
        print("❌ v1 file not found")
        return
    
    if not v2_file.exists():
        print("❌ v2 file not found")
        return
    
    print("🔄 Loading v1 and v2 data...")
    
    # Load v1 data
    with open(v1_file, 'r', encoding='utf-8') as f:
        v1_data = json.load(f)
    
    # Load v2 data
    with open(v2_file, 'r', encoding='utf-8') as f:
        v2_data = json.load(f)
    
    # Create mapping of v1 characters by id
    v1_chars = {char['id']: char for char in v1_data['characters']}
    
    print(f"📊 v1 has {len(v1_chars)} characters with role data")
    print(f"📊 v2 has {len(v2_data['characters'])} characters")
    
    # Merge role data
    merged_count = 0
    role_fields_added = ['roles', 'roleTiers', 'overallTier', 'keySkills', 'canOverclass']
    
    for char in v2_data['characters']:
        char_id = char['id']
        
        if char_id in v1_chars:
            v1_char = v1_chars[char_id]
            
            # Merge role-related fields
            for field in role_fields_added:
                if field in v1_char:
                    char[field] = v1_char[field]
                    
            merged_count += 1
    
    print(f"✅ Merged role data for {merged_count} characters")
    
    # Update metadata
    v2_data['metadata']['enhancements'] = {
        'merged_from_v1': role_fields_added,
        'characters_enhanced': merged_count,
        'merge_date': '2025-08-02'
    }
    
    # Write updated v2 file
    with open(v2_file, 'w', encoding='utf-8') as f:
        json.dump(v2_data, f, indent=2, ensure_ascii=False)
    
    print(f"💾 Updated {v2_file}")
    print(f"🎉 Role merge complete!")
    
    # Show summary of added fields
    print(f"\n📋 Fields added from v1:")
    for field in role_fields_added:
        count = sum(1 for char in v2_data['characters'] if field in char)
        print(f"  {field}: {count} characters")

if __name__ == '__main__':
    merge_roles_from_v1()