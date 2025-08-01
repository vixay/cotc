#!/usr/bin/env python3

import json

# Load actual V2 data and find the exact Unicode characters
with open('data/characters_enhanced_v2.json', 'r', encoding='utf-8') as f:
    v2_data = json.load(f)

# Find characters with apostrophes - simpler approach
apostrophe_chars = ["'", "'", "'", "`"]
for char in v2_data['characters']:
    name = char['name']
    if any(base in name.lower() for base in ['aanit', 'aanta', 'ludai', 'tu']):
        for apos in apostrophe_chars:
            if apos in name:
                print(f'{name}: contains {repr(apos)} (Unicode {ord(apos)})')
                break
        else:
            print(f'{name}: no apostrophe found')

# Also check V1 data
print("\nV1 characters:")
with open('data/characters.json', 'r', encoding='utf-8') as f:
    v1_data = json.load(f)

for char in v1_data['characters']:
    name = char['name']
    if any(base in name.lower() for base in ['aanit', 'aanta', 'ludai', 'tu']):
        for apos in apostrophe_chars:
            if apos in name:
                print(f'{name}: contains {repr(apos)} (Unicode {ord(apos)})')
                break
        else:
            print(f'{name}: no apostrophe found')