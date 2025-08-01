#!/usr/bin/env python3

import json

# Load V2 data and examine character by character
with open('data/characters_enhanced_v2.json', 'r', encoding='utf-8') as f:
    v2_data = json.load(f)

# Find the H'aanit character specifically
for char in v2_data['characters']:
    name = char['name']
    if 'aanit' in name.lower():
        print('Character:', name)
        for i, c in enumerate(name):
            print(f'  pos {i}: {repr(c)} (Unicode {ord(c)})')
        break