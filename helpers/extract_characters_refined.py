#!/usr/bin/env python3

import pandas as pd
import json
import re
from pathlib import Path

def is_character_name(text):
    """Check if text looks like a character name"""
    if not isinstance(text, str) or len(text.strip()) < 2:
        return False
    
    text = text.strip()
    
    # Skip obvious non-character entries
    skip_patterns = [
        r'^["\(\)\[\]]+$',  # Just punctuation
        r'command|skill|attack|damage|potency|critical|weakness|boost',  # Skill descriptions
        r'turn|duration|power|level|bp|consumption',  # Game mechanics
        r'grant|ability|elemental|shield|magic|def|atk',  # More mechanics
        r'the following|also|when|longer|self|frontrow',  # Sentence fragments
        r'^\d+[%x\s]*\d*$',  # Just numbers/percentages
        r'legend|determination|berserk|mode',  # Ability names
        r'^[A-Z]{2,}$',  # All caps abbreviations
        r'call\s+\w+',  # "Call" abilities
        r'^\*\s*\w+\s+is\s+only',  # Disclaimer text
    ]
    
    for pattern in skip_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return False
    
    # Must contain at least one letter
    if not re.search(r'[a-zA-Z]', text):
        return False
    
    # Reasonable length for character names
    if len(text) > 50:
        return False
    
    return True

def extract_character_names():
    """Extract character names from the main character index sheet"""
    xlsx_path = Path('/mnt/c/Users/VJOverseer/OneDrive/code/vixay/cotc/data/Octopath Traveler COTC Character Index.xlsx')
    
    character_names = set()
    
    try:
        # Focus on the main characters index sheet
        df = pd.read_excel(xlsx_path, sheet_name='🔍 Characters Index')
        print(f"Characters Index sheet shape: {df.shape}")
        print(f"Columns: {list(df.columns)}")
        
        # Look for character names in the first few columns
        for col_idx in range(min(3, len(df.columns))):
            col_name = df.columns[col_idx]
            print(f"Processing column: {col_name}")
            
            for idx, value in enumerate(df.iloc[:, col_idx].dropna()):
                if is_character_name(value):
                    character_names.add(value.strip())
                    if len(character_names) <= 10:  # Show first 10
                        print(f"  Found: {value.strip()}")
        
        # Also try reading individual class sheets for character names
        class_sheets = [
            '⚔️ Warriors ⭐5',
            '🔱 Merchants ⭐5', 
            '🔪 Thieves ⭐5',
            '🪓 Apothecaries ⭐5',
            '🏹 Hunters ⭐5',
            '🧙🏻‍♂️ Clerics ⭐5',
            '📖 Scholars ⭐5',
            '💃 Dancers ⭐5'
        ]
        
        for sheet_name in class_sheets:
            try:
                df = pd.read_excel(xlsx_path, sheet_name=sheet_name)
                # Look for character names in first column
                for value in df.iloc[:, 0].dropna():
                    if is_character_name(value):
                        character_names.add(value.strip())
            except Exception as e:
                print(f"Could not read sheet {sheet_name}: {e}")
                
    except Exception as e:
        print(f"Error reading Excel file: {e}")
        return []
    
    return sorted(list(character_names))

def main():
    print("Extracting character names from XLSX...")
    xlsx_characters = extract_character_names()
    print(f"\nFound {len(xlsx_characters)} potential character names")
    
    # Load existing characters
    with open('/mnt/c/Users/VJOverseer/OneDrive/code/vixay/cotc/data/characters.json', 'r') as f:
        json_data = json.load(f)
    
    existing_names = set()
    for char in json_data['characters']:
        existing_names.add(char['name'].lower().strip())
    
    print(f"Existing characters in JSON: {len(existing_names)}")
    
    # Find truly missing characters
    missing = []
    for name in xlsx_characters:
        if name.lower().strip() not in existing_names:
            missing.append(name)
    
    print(f"\nMissing characters ({len(missing)}):")
    for i, name in enumerate(missing[:30]):  # Show first 30
        print(f"  {i+1:2d}. {name}")
    
    if len(missing) > 30:
        print(f"  ... and {len(missing) - 30} more")
    
    # Save the list for manual review
    with open('/mnt/c/Users/VJOverseer/OneDrive/code/vixay/cotc/missing_characters.txt', 'w') as f:
        f.write("Missing Characters Found in XLSX:\n")
        f.write("="*50 + "\n\n")
        for i, name in enumerate(missing, 1):
            f.write(f"{i:3d}. {name}\n")
    
    print(f"\nFull list saved to: missing_characters.txt")
    print("Please review this list and let me know which characters to add.")

if __name__ == "__main__":
    main()