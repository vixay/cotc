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

# Load actual data to get real characters
with open('data/characters.json', 'r', encoding='utf-8') as f:
    v1_data = json.load(f)

with open('data/characters_enhanced_v2.json', 'r', encoding='utf-8') as f:
    v2_data = json.load(f)

# Get the actual problematic characters
v1_names_raw = [char['name'] for char in v1_data['characters']]
v2_names_raw = [char['name'] for char in v2_data['characters']]

# Find the problematic ones
problematic_bases = ['aanit', 'ludai', 'aanta', 'tu']

v1_problematic = []
v2_problematic = []

for name in v1_names_raw:
    for base in problematic_bases:
        if base in name.lower():
            v1_problematic.append(name)
            break

for name in v2_names_raw:
    for base in problematic_bases:
        if base in name.lower():
            v2_problematic.append(name)
            break

print("V1 problematic characters:")
for name in v1_problematic:
    print(f"  {name!r}")

print("\nV2 problematic characters:")
for name in v2_problematic:
    print(f"  {name!r}")

print("\nNormalization test:")
for v1_name in v1_problematic:
    v1_norm = normalize_char_name(v1_name)
    for v2_name in v2_problematic:
        v2_norm = normalize_char_name(v2_name)
        if v1_name.replace("'", "").replace("'", "") == v2_name.replace("'", "").replace("'", ""):
            print(f"  {v1_name!r} -> {v1_norm!r}")
            print(f"  {v2_name!r} -> {v2_norm!r}")
            print(f"  Match: {v1_norm == v2_norm}")
            print()