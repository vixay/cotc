#!/usr/bin/env python3
"""
Find possible name matches for missing v1 characters in v2 data.
"""

import json
from difflib import SequenceMatcher

def load_json(filepath):
    """Load JSON file and return data."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def similarity(a, b):
    """Calculate string similarity."""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def normalize_for_comparison(name):
    """Normalize name for better comparison."""
    name = name.lower()
    # Remove common variations
    name = name.replace("'", "").replace("'", "").replace("`", "")
    name = name.replace(" ex", "").replace("ex ", "")
    name = name.replace("è", "e").replace("é", "e").replace("ô", "o")
    return name.strip()

def find_matches():
    """Find possible matches for missing characters."""
    # Load missing characters
    with open('helpers/migration_report.json', 'r') as f:
        report = json.load(f)
    
    missing_chars = report['missing_in_v2']
    
    # Load v2 character names
    v2_data = load_json('data/characters_enhanced_v2.json')
    v2_names = [char['name'] for char in v2_data['characters']]
    
    print("🔍 Finding possible name matches for missing v1 characters...\n")
    
    for missing_char in missing_chars:
        print(f"📋 Missing: '{missing_char}'")
        
        # Find potential matches
        matches = []
        
        for v2_name in v2_names:
            # Calculate similarity
            sim_score = similarity(missing_char, v2_name)
            
            # Also check normalized versions
            norm_missing = normalize_for_comparison(missing_char)
            norm_v2 = normalize_for_comparison(v2_name)
            norm_sim = similarity(norm_missing, norm_v2)
            
            # Use the higher score
            best_score = max(sim_score, norm_sim)
            
            if best_score > 0.4:  # Threshold for potential matches
                matches.append((v2_name, best_score))
        
        # Sort by similarity score
        matches.sort(key=lambda x: x[1], reverse=True)
        
        if matches:
            print("   Possible matches:")
            for match_name, score in matches[:5]:  # Show top 5 matches
                print(f"   - {match_name} (similarity: {score:.2f})")
        else:
            print("   No similar matches found")
            
            # Try partial matches for special cases
            partial_matches = []
            missing_parts = missing_char.lower().split()
            
            for v2_name in v2_names:
                v2_lower = v2_name.lower()
                for part in missing_parts:
                    if len(part) > 2 and part in v2_lower:
                        partial_matches.append(v2_name)
                        break
            
            if partial_matches:
                print("   Partial word matches:")
                for match in partial_matches[:3]:
                    print(f"   - {match}")
        
        print()

if __name__ == '__main__':
    find_matches()