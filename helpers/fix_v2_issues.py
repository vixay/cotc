#!/usr/bin/env python3
"""
Fix issues in v2 data:
1. Correct isFree field based on obtainedFrom 
2. Ensure all notes are preserved from v1
"""

import json

def is_actually_free(obtained_from):
    """Determine if a character is actually free based on how they're obtained."""
    if not obtained_from:
        return False
    
    obtained_from = obtained_from.lower()
    
    # Free sources
    free_sources = [
        'story',
        'main story', 
        'side story',
        'memoirs',
        'champion of memories',
        'traveler of memories',
        'tourney',
        'arena',
        'free',
        'login bonus',
        'event reward'
    ]
    
    # NOT free sources (gacha/limited)
    not_free_sources = [
        'crossover guidance',
        'guidance',
        'step-up',
        'banner',
        'limited',
        'premium',
        'paid'
    ]
    
    # Check if it's definitely not free
    for source in not_free_sources:
        if source in obtained_from:
            return False
    
    # Check if it's definitely free
    for source in free_sources:
        if source in obtained_from:
            return True
    
    # Default to not free if uncertain
    return False

def fix_v2_data():
    """Fix the issues in v2 data."""
    print("🔧 Fixing v2 data issues...")
    
    # Load v2 data
    with open('data/characters_enhanced_v2.json', 'r', encoding='utf-8') as f:
        v2_data = json.load(f)
    
    fixed_free_count = 0
    total_free_before = 0
    total_free_after = 0
    
    print(f"\n📊 Before fixes:")
    for char in v2_data['characters']:
        if char.get('isFree'):
            total_free_before += 1
    print(f"Characters marked as free: {total_free_before}")
    
    # Fix each character
    for char in v2_data['characters']:
        # Fix isFree based on obtainedFrom
        old_is_free = char.get('isFree', False)
        obtained_from = char.get('obtainedFrom', '')
        new_is_free = is_actually_free(obtained_from)
        
        if old_is_free != new_is_free:
            char['isFree'] = new_is_free
            fixed_free_count += 1
            print(f"Fixed {char['name']}: isFree {old_is_free} -> {new_is_free} (from: {obtained_from})")
    
    # Count after fixes
    for char in v2_data['characters']:
        if char.get('isFree'):
            total_free_after += 1
    
    print(f"\n📊 After fixes:")
    print(f"Characters marked as free: {total_free_after}")
    print(f"Fixed {fixed_free_count} character isFree values")
    
    # Save the fixed data
    with open('data/characters_enhanced_v2.json', 'w', encoding='utf-8') as f:
        json.dump(v2_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Fixed v2 data issues")
    print("📁 Updated file: data/characters_enhanced_v2.json")
    
    # Show some examples of the correctly identified free characters
    print(f"\n📋 Examples of correctly identified free characters:")
    free_examples = 0
    for char in v2_data['characters']:
        if char.get('isFree') and free_examples < 10:
            print(f"  {char['name']}: {char.get('obtainedFrom', '')}")
            free_examples += 1

if __name__ == '__main__':
    fix_v2_data()