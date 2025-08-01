#!/usr/bin/env python3

import json

def normalize_char_name(name):
    """Normalize character name for matching."""
    # Handle different apostrophes (ASCII, Unicode right/left quotes, backtick)
    name = name.replace("'", "'").replace("'", "'").replace("`", "'").replace("'", "'")
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

# Test with the exact characters
v1_chars = ["Ri'tu", "Z'aanta", "H'aanit", "W'ludai", "H'aanit EX"]  # ASCII apostrophe
v2_chars = ["Ri'tu", "Z'aanta", "H'aanit", "W'ludai", "H'aanit EX"]  # Unicode right single quote

print("Character comparison:")
for v1, v2 in zip(v1_chars, v2_chars):
    print(f"V1: {v1}")
    print(f"V2: {v2}")
    
    # Show apostrophe Unicode values
    v1_apos_pos = v1.find("'")
    v2_apos_pos = v2.find("'")
    
    if v1_apos_pos >= 0:
        v1_apos = v1[v1_apos_pos]
        print(f"  V1 apostrophe: {v1_apos!r} (Unicode {ord(v1_apos)})")
    
    if v2_apos_pos >= 0:
        v2_apos = v2[v2_apos_pos]
        print(f"  V2 apostrophe: {v2_apos!r} (Unicode {ord(v2_apos)})")
    
    # Test normalization
    v1_norm = normalize_char_name(v1)
    v2_norm = normalize_char_name(v2)
    
    print(f"  V1 normalized: {v1_norm!r}")
    print(f"  V2 normalized: {v2_norm!r}")
    print(f"  Match: {v1_norm == v2_norm}")
    print()