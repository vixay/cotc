#!/usr/bin/env python3
"""
Fix isFree conflicts by using v1 data (as requested by user).
Note: The CSV data appears more accurate, but user prefers v1 values.
"""

import json

def normalize_char_name(name):
    """Normalize character name for matching."""
    name = name.replace(chr(8217), "'").replace(chr(8216), "'").replace("`", "'").replace(chr(8219), "'")
    name = name.replace(" Ex", " EX")
    name = name.replace("è", "e").replace("é", "e").replace("ô", "o").replace("à", "a")
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
    try:
        with open('data/characters.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            for char in data['characters']:
                name = normalize_char_name(char['name'])
                if not (name.startswith("EX ") and len(name) <= 10):
                    all_chars[name] = char
    except FileNotFoundError:
        print("Note: characters.json not found (already removed)")
    
    # Try to load from backup if original is gone
    try:
        with open('data/characters.json.backup', 'r', encoding='utf-8') as f:
            data = json.load(f)
            for char in data['characters']:
                name = normalize_char_name(char['name'])
                if not (name.startswith("EX ") and len(name) <= 10):
                    all_chars[name] = char
    except FileNotFoundError:
        pass
        
    return all_chars

def fix_isfree_conflicts():
    """Fix isFree conflicts by using v1 values."""
    print("🔧 Fixing isFree conflicts with v1 data...")
    
    # Load v1 and v2 data
    v1_chars = load_combined_v1_data()
    
    if not v1_chars:
        print("❌ Could not load v1 data - files may have been removed")
        return
    
    with open('data/characters_enhanced_v2.json', 'r', encoding='utf-8') as f:
        v2_data = json.load(f)
    
    # Characters with isFree conflicts from verification report
    conflicted_chars = [
        "Alaune EX", "Auguste", "Bargello", "Elrica", "Eltrix", "Herminia",
        "Richard", "Rinyuu", "Rondo", "Sazantos", "Signa", "Solon", 
        "Sonia", "Tatloch", "Temenos", "Throné", "Tiziano", "Tytos"
    ]
    
    fixed_count = 0
    
    for char in v2_data['characters']:
        char_name = normalize_char_name(char['name'])
        
        if char['name'] in conflicted_chars and char_name in v1_chars:
            v1_is_free = v1_chars[char_name].get('isFree', False)
            v2_is_free = char.get('isFree', False)
            
            if v1_is_free != v2_is_free:
                print(f"  {char['name']}: isFree {v2_is_free} -> {v1_is_free} (using v1 value)")
                char['isFree'] = v1_is_free
                fixed_count += 1
    
    # Save the fixed data
    with open('data/characters_enhanced_v2.json', 'w', encoding='utf-8') as f:
        json.dump(v2_data, f, ensure_ascii=False, indent=2)
    
    print(f"\\n✅ Fixed {fixed_count} isFree conflicts using v1 data")
    print("📁 Updated file: data/characters_enhanced_v2.json")
    
    if fixed_count > 0:
        print("\\n⚠️  Note: Some characters like Temenos, Throné, Agnea are likely")
        print("   actually free (OT2 story characters), but using v1 values as requested.")

if __name__ == '__main__':
    fix_isfree_conflicts()