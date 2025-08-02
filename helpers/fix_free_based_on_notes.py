#!/usr/bin/env python3
"""
Fix isFree field based on what the notes actually say about being free.
Plus manually specified free characters: Hammy, Cecil
"""

import json

def is_free_from_notes(notes):
    """Check if notes indicate the character is free."""
    if not notes:
        return False
    
    notes_lower = notes.lower()
    free_indicators = [
        'free character',
        'free ',
        'story character',
        'story ',
        'event character',
        'login bonus',
        'give character fragments only',
        'stones give character fragments'
    ]
    
    return any(indicator in notes_lower for indicator in free_indicators)

def fix_free_characters():
    """Fix isFree based on notes content."""
    print("🔧 Fixing isFree based on notes content...")
    
    # Load v2 data
    with open('data/characters_enhanced_v2.json', 'r', encoding='utf-8') as f:
        v2_data = json.load(f)
    
    # Manually specified free characters
    manually_free = ['Hammy', 'Cecil']
    
    fixed_count = 0
    free_count = 0
    
    for char in v2_data['characters']:
        old_is_free = char.get('isFree', False)
        
        # Check if manually specified as free
        if char['name'] in manually_free:
            new_is_free = True
            reason = "manually specified"
        else:
            # Check notes for free indicators
            new_is_free = is_free_from_notes(char.get('notes', ''))
            reason = "based on notes" if new_is_free else "not mentioned in notes"
        
        if old_is_free != new_is_free:
            print(f"  {char['name']}: isFree {old_is_free} -> {new_is_free} ({reason})")
            if new_is_free and char.get('notes'):
                print(f"    Notes: {char['notes'][:100]}...")
            char['isFree'] = new_is_free
            fixed_count += 1
        
        if new_is_free:
            free_count += 1
    
    print(f"\n📊 Results:")
    print(f"Total free characters: {free_count}")
    print(f"Fixed {fixed_count} character isFree values")
    
    # Save the fixed data
    with open('data/characters_enhanced_v2.json', 'w', encoding='utf-8') as f:
        json.dump(v2_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Fixed isFree based on notes content")
    print("📁 Updated file: data/characters_enhanced_v2.json")
    
    # Show all free characters
    print(f"\n📋 All free characters ({free_count}):")
    for char in v2_data['characters']:
        if char.get('isFree'):
            reason = "manual" if char['name'] in manually_free else "notes"
            print(f"  {char['name']} ({reason})")

if __name__ == '__main__':
    fix_free_characters()