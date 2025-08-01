#!/usr/bin/env python3

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

# Test the missing characters - V1 uses ASCII apostrophe, V2 uses Unicode right single quote
v1_chars = ["Ri'tu", "Z'aanta", "H'aanit", "W'ludai", "H'aanit EX"]
v2_chars = ["Ri'tu", "Z'aanta", "H'aanit", "W'ludai", "H'aanit EX"]

for i, (v1, v2) in enumerate(zip(v1_chars, v2_chars)):
    v1_norm = normalize_char_name(v1)
    v2_norm = normalize_char_name(v2)
    print(f"Test {i+1}:")
    print(f"  V1: {v1} -> {v1_norm}")
    print(f"  V2: {v2} -> {v2_norm}")
    print(f"  V1 apostrophe Unicode: {ord(v1[v1.find(chr(39)) if chr(39) in v1 else v1.find(chr(8217))])}")
    print(f"  V2 apostrophe Unicode: {ord(v2[v2.find(chr(8217))])}")
    print(f"  Match: {v1_norm == v2_norm}")
    print()