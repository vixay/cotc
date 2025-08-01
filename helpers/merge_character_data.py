#!/usr/bin/env python3
"""
Merge CSV character data and markdown files into enhanced JSON format.
Separates JP-specific data into a different file.
"""

import json
import csv
import os
import re
from pathlib import Path
from datetime import datetime

def parse_csv_attributes(attr_string):
    """Extract weapon and element types from CSV attribute string."""
    if not attr_string:
        return [], []
    
    # Parse the attribute image paths
    attributes = attr_string.split(', ')
    weapons = []
    elements = []
    
    weapon_map = {
        'Sword': 'Sword',
        'Dagger': 'Dagger', 
        'Axe': 'Axe',
        'Spear_Polearm': 'Polearm',
        'Bow': 'Bow',
        'Staff_Staves': 'Staff',
        'Tome': 'Tome',
        'Fan': 'Fan'
    }
    
    element_map = {
        'Fire': 'Fire',
        'Ice': 'Ice',
        'Lightning_Thunder': 'Lightning',
        'Wind': 'Wind',
        'Light': 'Light',
        'Dark': 'Dark'
    }
    
    for attr in attributes:
        # Extract filename from path
        filename = attr.split('/')[-1].replace('.png', '').replace('%20', ' ')
        
        # Check if it's a weapon
        for key, value in weapon_map.items():
            if key in filename:
                weapons.append(value)
                break
        
        # Check if it's an element
        for key, value in element_map.items():
            if key in filename:
                elements.append(value)
                break
    
    return weapons, elements

def parse_star_rating(class_str):
    """Extract star rating from class string."""
    if not class_str:
        return None
    stars = class_str.count('⭐')
    return stars if stars > 0 else None

def parse_markdown_skills(md_file_path):
    """Extract skills from markdown file."""
    try:
        with open(md_file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Basic extraction - this could be enhanced
        skills = {
            'passive': [],
            'battle': [],
            'ultimate': None
        }
        
        # Extract sections
        sections = content.split('##')
        for section in sections:
            if 'Passive Skills' in section:
                # Extract passive skill names
                skill_matches = re.findall(r'\*\*(.+?)\s*\(', section)
                skills['passive'] = skill_matches
            elif 'Ultimate' in section:
                # Extract ultimate description
                ult_match = re.search(r'\*\*(.+?)\*\*', section)
                if ult_match:
                    skills['ultimate'] = ult_match.group(1)
        
        return skills
    except Exception as e:
        print(f"Error parsing markdown {md_file_path}: {e}")
        return None

def normalize_char_name(name):
    """Normalize character name for matching."""
    # Handle different apostrophes (ASCII, Unicode right/left quotes, backtick)
    name = name.replace(chr(8217), "'").replace(chr(8216), "'").replace("`", "'").replace(chr(8219), "'")
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

def map_csv_ult_priority(csv_priority):
    """Map CSV ultimate priority text to v1 format."""
    if not csv_priority:
        return "L1"
    
    csv_priority = csv_priority.lower()
    
    # Direct mappings
    priority_map = {
        "u lv10 game changer": "L10",
        "u lv10 before a1": "L10 First",
        "a1 then u lv10": "A1, L10",
        "a1, l10": "A1, L10",
        "a4 before u lv10": "A4, L10",
        "a4, l10": "A4, L10",
        "leave it at u lv9": "L9",
        "ultimate not worth": "L1"
    }
    
    for key, value in priority_map.items():
        if key in csv_priority:
            return value
    
    # Default fallback
    if "l10" in csv_priority or "lv10" in csv_priority:
        return "L10 First"
    elif "l9" in csv_priority or "lv9" in csv_priority:
        return "L9"
    else:
        return "L1"

def generate_stone_recommendations(ult_priority, is_free=False):
    """Generate stone recommendations based on ultimate priority."""
    if is_free:
        # Free characters can't be sharded
        if ult_priority == "L10" or ult_priority == "L10 First":
            return {"AS1": "U10", "AS2": "A1", "AS3": "A2", "AS4": "A3", "AS5": "Keep"}
        elif ult_priority == "A1, L10":
            return {"AS1": "A1", "AS2": "U10", "AS3": "A2", "AS4": "A3", "AS5": "Keep"}
        elif ult_priority == "A4, L10":
            return {"AS1": "A1", "AS2": "A2", "AS3": "A3", "AS4": "A4", "AS5": "Keep"}
        else:
            return {"AS1": "A1", "AS2": "A2", "AS3": "A3", "AS4": "A4", "AS5": "Keep"}
    else:
        # Gacha characters can be sharded
        if ult_priority == "L10" or ult_priority == "L10 First":
            return {"AS1": "U10", "AS2": "A1", "AS3": "A2", "AS4": "A3", "AS5": "Shard"}
        elif ult_priority == "A1, L10":
            return {"AS1": "A1", "AS2": "U10", "AS3": "A2", "AS4": "A3", "AS5": "Shard"}
        elif ult_priority == "A4, L10":
            return {"AS1": "A1", "AS2": "A2", "AS3": "A3", "AS4": "A4", "AS5": "U10"}
        elif ult_priority == "L9":
            return {"AS1": "A1", "AS2": "A2", "AS3": "A3", "AS4": "A4", "AS5": "Shard"}
        else:  # L1
            return {"AS1": "Shard", "AS2": "Shard", "AS3": "Shard", "AS4": "Shard", "AS5": "Shard"}

def load_existing_data():
    """Load existing v1 data from both characters.json and characters_enhanced.json."""
    all_chars = {}
    
    # Load from characters.json first (base data)
    try:
        with open('data/characters.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            for char in data['characters']:
                name = normalize_char_name(char['name'])
                # Skip blank "EX" entries
                if name.startswith("EX ") and len(name) <= 10:
                    continue
                all_chars[name] = char
    except Exception as e:
        print(f"Error loading characters.json: {e}")
    
    # Load from characters_enhanced.json (has additional fields)
    try:
        with open('data/characters_enhanced.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            for char in data['characters']:
                name = normalize_char_name(char['name'])
                # Skip blank "EX" entries
                if name.startswith("EX ") and len(name) <= 10:
                    continue
                if name in all_chars:
                    # Merge additional fields
                    all_chars[name].update(char)
                else:
                    all_chars[name] = char
    except Exception as e:
        print(f"Error loading characters_enhanced.json: {e}")
    
    return all_chars

def create_enhanced_character(csv_row, existing_char, markdown_skills):
    """Create enhanced character object combining all data sources."""
    
    weapons, elements = parse_csv_attributes(csv_row['Attributes'])
    star_rating = parse_star_rating(csv_row['Class'])
    
    # Base stats
    base_stats = {
        'hp': int(csv_row['HP']) if csv_row['HP'] else None,
        'sp': int(csv_row['SP']) if csv_row['SP'] else None,
        'pAtk': int(csv_row['P.Atk']) if csv_row['P.Atk'] else None,
        'pDef': int(csv_row['P.Def']) if csv_row['P.Def'] else None,
        'eAtk': int(csv_row['E.Atk']) if csv_row['E.Atk'] else None,
        'eDef': int(csv_row['E.Def']) if csv_row['E.Def'] else None,
        'crit': int(csv_row['Crit']) if csv_row['Crit'] else None,
        'spd': int(csv_row['Spd']) if csv_row['Spd'] else None
    }
    
    # Max stats (Lv. 120)
    max_stats = {
        'hp': int(csv_row['HP (Lv. 120)']) if csv_row['HP (Lv. 120)'] else None,
        'sp': int(csv_row['SP (Lv. 120)']) if csv_row['SP (Lv. 120)'] else None,
        'pAtk': int(csv_row['P.Atk (Lv. 120)']) if csv_row['P.Atk (Lv. 120)'] else None,
        'pDef': int(csv_row['P.Def (Lv. 120)']) if csv_row['P.Def (Lv. 120)'] else None,
        'eAtk': int(csv_row['E.Atk (Lv. 120)']) if csv_row['E.Atk (Lv. 120)'] else None,
        'eDef': int(csv_row['E.Def (Lv. 120)']) if csv_row['E.Def (Lv. 120)'] else None,
        'crit': int(csv_row['Crit (Lv. 120)']) if csv_row['Crit (Lv. 120)'] else None,
        'spd': int(csv_row['Spd (Lv. 120)']) if csv_row['Spd (Lv. 120)'] else None
    }
    
    # Enhanced character object for Global
    enhanced_char = {
        'id': existing_char.get('id', csv_row['Name'].lower().replace(' ', '_').replace("'", '')),
        'name': csv_row['Name'],
        'isFree': existing_char.get('isFree', csv_row['General pool'] == 'Never'),
        'starRating': star_rating,
        'job': csv_row['Job'],
        'influence': csv_row['Influence'],
        'continent': csv_row['Continent'],
        'location': csv_row['Location'],
        'obtainedFrom': csv_row['Obtained from'],
        'weapons': weapons,
        'elements': elements,
        'weaknesses': [w.strip() for w in csv_row['Weakness to hit'].split(',')] if csv_row['Weakness to hit'] else [],
        'stats': {
            'base': base_stats,
            'max': max_stats
        },
        'tierRatings': {
            'gl': {
                'tier': csv_row['GL Tier'] if csv_row['GL Tier'] else existing_char.get('a4Tier'),
                'score': float(csv_row['GL Score']) if csv_row['GL Score'] else None
            }
        },
        'glReleaseDate': csv_row['GL Release Date'],
        # Use v1 ultPriority if available, otherwise map from CSV
        'ultPriority': existing_char.get('ultPriority') or map_csv_ult_priority(csv_row['Ultimate Priority']),
        'ultPriorityGroup': existing_char.get('ultPriorityGroup'),
        'a4Tier': existing_char.get('a4Tier'),
        # Use existing stones or generate based on priority
        'stones': existing_char.get('stones') or generate_stone_recommendations(
            existing_char.get('ultPriority') or map_csv_ult_priority(csv_row['Ultimate Priority']),
            existing_char.get('isFree', csv_row['General pool'] == 'Never')
        ),
        'notes': existing_char.get('notes', ''),
        'tags': existing_char.get('tags', []),
        # Add CSV ultimate priority as separate field for reference
        'csvUltPriority': csv_row['Ultimate Priority']
    }
    
    # Add skills if available
    if markdown_skills:
        enhanced_char['skills'] = markdown_skills
    
    # Add BotL and Class Breakthrough info if available
    if csv_row['Blessing of the Lantern'] == 'Available in GL':
        enhanced_char['blessingOfLantern'] = {
            'available': True,
            'dateGL': csv_row['BotL Date in GL']
        }
    
    if csv_row['Class Breakthrough'] == 'Available in GL':
        enhanced_char['classBreakthrough'] = {
            'available': True,
            'dateGL': csv_row['Class Breakthrough Date in GL']
        }
    
    return enhanced_char

def create_jp_character_data(csv_row):
    """Create JP-specific character data."""
    jp_data = {
        'name': csv_row['Name'],
        'japaneseName': csv_row['Japanese Name'],
        'jpReleaseDate': csv_row['JP Release Date'],
        'tierRatings': {
            'jp': {
                'tier': csv_row['JP Tier'],
                'game8Score': float(csv_row['JP game8 Score']) if csv_row['JP game8 Score'] else None
            }
        }
    }
    
    # Add JP-specific dates
    if csv_row['200% Ultimate'] == 'Available in JP':
        jp_data['ultimate200'] = {
            'available': True,
            'dateJP': csv_row['200% Ult. Date in JP']
        }
    
    if csv_row['BotL Date in JP']:
        jp_data['blessingOfLanternJP'] = csv_row['BotL Date in JP']
        
    if csv_row['Class Breakthrough Date in JP']:
        jp_data['classBreakthroughJP'] = csv_row['Class Breakthrough Date in JP']
    
    return jp_data

def main():
    """Main function to merge all character data."""
    
    # Load existing character data
    existing_chars = load_existing_data()
    
    # Read CSV data
    enhanced_characters = []
    jp_characters = []
    
    csv_path = 'data/Character List 2dd50eb0e188493fbecee1f55b8691c2.csv'
    markdown_dir = 'data/Character Markdown'
    
    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            char_name = row['Name']
            normalized_name = normalize_char_name(char_name)
            
            # Find corresponding markdown file
            markdown_skills = None
            for md_file in os.listdir(markdown_dir):
                if md_file.startswith(char_name) and md_file.endswith('.md'):
                    md_path = os.path.join(markdown_dir, md_file)
                    markdown_skills = parse_markdown_skills(md_path)
                    break
            
            # Get existing character data using normalized name
            existing_char = existing_chars.get(normalized_name, {})
            
            # Create enhanced character data
            enhanced_char = create_enhanced_character(row, existing_char, markdown_skills)
            enhanced_characters.append(enhanced_char)
            
            # Create JP-specific data
            jp_char = create_jp_character_data(row)
            jp_characters.append(jp_char)
    
    # Sort characters by name
    enhanced_characters.sort(key=lambda x: x['name'])
    jp_characters.sort(key=lambda x: x['name'])
    
    # Create enhanced JSON structure
    enhanced_data = {
        'version': '2.0.0',
        'lastUpdated': datetime.now().strftime('%Y-%m-%d'),
        'metadata': {
            'dataSource': 'CSV export, Character Markdown files, Reddit tier lists',
            'gameVersion': 'Global/EN',
            'totalCharacters': len(enhanced_characters)
        },
        'characters': enhanced_characters
    }
    
    # Create JP data structure
    jp_data = {
        'version': '1.0.0',
        'lastUpdated': datetime.now().strftime('%Y-%m-%d'),
        'metadata': {
            'dataSource': 'CSV export',
            'gameVersion': 'JP',
            'totalCharacters': len(jp_characters)
        },
        'characters': jp_characters
    }
    
    # Save enhanced data
    with open('data/characters_enhanced_v2.json', 'w', encoding='utf-8') as f:
        json.dump(enhanced_data, f, ensure_ascii=False, indent=2)
    
    # Save JP data
    with open('data/characters_jp.json', 'w', encoding='utf-8') as f:
        json.dump(jp_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Created enhanced character data with {len(enhanced_characters)} characters")
    print(f"✅ Created JP-specific data file")
    print(f"📁 Enhanced data saved to: data/characters_enhanced_v2.json")
    print(f"📁 JP data saved to: data/characters_jp.json")

if __name__ == '__main__':
    main()