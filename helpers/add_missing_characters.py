#!/usr/bin/env python3

import json
import re
from pathlib import Path

def create_character_id(name):
    """Create a unique ID from character name"""
    char_id = re.sub(r'[^\w\s]', '', str(name)).lower().replace(' ', '_')
    return char_id

def create_character_entry(name):
    """Create a character entry with appropriate defaults"""
    
    # Determine if character is free or collab
    is_free = False
    is_collab = False
    tags = ["5-star", "needs-review"]
    
    # Collaboration characters
    if name in ["2B", "9S", "Agnès", "Kainé"]:
        is_collab = True
        tags.append("collab")
        
    # EX characters are typically high tier
    if name.startswith("EX "):
        tags.append("ex-version")
        tags.append("high-tier")
        
    # Octopath Traveler II characters
    if any(ot2_char in name for ot2_char in ["Agnea", "Castti", "Hikari", "Ochette", "Osvald", "Partitio", "Throné"]):
        tags.append("ot2-character")
        
    # Boss characters (Odio variants)
    if "Odio" in name:
        tags.append("boss-character")
        tags.append("top-tier")
        
    return {
        "id": create_character_id(name),
        "name": name,
        "isFree": is_free,
        "isCollab": is_collab,
        "a4Tier": None,  # Needs manual assessment
        "ultPriority": "L9",  # Conservative default
        "ultPriorityGroup": "medium",  # Conservative default
        "stones": {
            "AS1": "A1",
            "AS2": "A2",
            "AS3": "A3", 
            "AS4": "A4",
            "AS5": "Keep" if is_collab else "Shard"
        },
        "notes": "Needs tier assessment",
        "tags": tags
    }

def main():
    # Valid character names from the extracted list
    new_character_names = [
        "2B",
        "9S", 
        "Agnès",
        "Black Knight",
        "Black Maiden",
        "EX Agnea",
        "EX Araune", 
        "EX Bargello",
        "EX Castti",
        "EX Cygna",
        "EX Cyrus",
        "EX Ditraina",
        "EX Erika",
        "EX Fiore",
        "EX H'aanit",
        "EX Hikari",
        "EX Lyummis",
        "EX Millard",
        "EX Molrusso",
        "EX Ochette",
        "EX Ophilia",
        "EX Osvald",
        "EX Partitio",
        "EX Primrose",
        "EX Rinyuu",
        "EX Sazantos",
        "EX Sigrid",
        "EX Sofia",
        "EX Tatloch",
        "EX Therese",
        "EX Tressa",
        "EX Viola",
        "Kainé",
        "L'eeto",
        "Odio O",
        "Odio S",
        "Rai Mei",
        "Throné"
    ]
    
    # Load existing JSON
    json_path = Path('/mnt/c/Users/VJOverseer/OneDrive/code/vixay/cotc/data/characters.json')
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"Starting with {len(data['characters'])} characters")
    
    # Create new character entries
    new_characters = []
    for name in new_character_names:
        new_char = create_character_entry(name)
        new_characters.append(new_char)
        print(f"Created entry for: {name}")
    
    # Add new characters to data
    data['characters'].extend(new_characters)
    
    # Update metadata
    data['version'] = "1.3.0"
    data['lastUpdated'] = "2025-07-04"
    
    print(f"\nTotal characters after addition: {len(data['characters'])}")
    
    # Write updated file
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Updated {json_path} with {len(new_characters)} new characters")
    
    # Summary by category
    categories = {}
    for char in new_characters:
        for tag in char['tags']:
            if tag not in categories:
                categories[tag] = []
            categories[tag].append(char['name'])
    
    print("\nCharacters added by category:")
    for category, names in categories.items():
        print(f"  {category}: {len(names)} characters")
        for name in names[:5]:
            print(f"    - {name}")
        if len(names) > 5:
            print(f"    ... and {len(names) - 5} more")

if __name__ == "__main__":
    main()