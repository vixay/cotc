#!/usr/bin/env python3
"""
Analyze all v1 JSON files to understand their content and find the most complete dataset.
"""

import json
from pathlib import Path

def load_json(filepath):
    """Load JSON file and return data."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return None

def analyze_json_file(filepath, data):
    """Analyze a single JSON file."""
    if not data:
        return None
    
    characters = data.get('characters', [])
    
    # Get unique character names
    char_names = set()
    has_ex = False
    
    for char in characters:
        name = char.get('name', '')
        char_names.add(name)
        if 'EX' in name or 'Ex' in name:
            has_ex = True
    
    # Check what fields are present
    sample_char = characters[0] if characters else {}
    fields = list(sample_char.keys())
    
    return {
        'total_chars': len(characters),
        'unique_names': len(char_names),
        'has_ex_chars': has_ex,
        'fields': fields,
        'version': data.get('version', 'Unknown'),
        'last_updated': data.get('lastUpdated', 'Unknown')
    }

def main():
    """Main analysis function."""
    print("📊 Analyzing all v1 JSON files...\n")
    
    v1_files = [
        'data/characters.json',
        'data/characters_enhanced.json',
        'data/characters_updated.json'
    ]
    
    all_chars = {}
    
    for filepath in v1_files:
        print(f"\n{'='*60}")
        print(f"📁 {filepath}")
        print('='*60)
        
        data = load_json(filepath)
        if not data:
            continue
            
        analysis = analyze_json_file(filepath, data)
        if not analysis:
            continue
            
        print(f"Version: {analysis['version']}")
        print(f"Last Updated: {analysis['last_updated']}")
        print(f"Total Characters: {analysis['total_chars']}")
        print(f"Has EX Characters: {analysis['has_ex_chars']}")
        print(f"Fields: {', '.join(analysis['fields'][:10])}")
        if len(analysis['fields']) > 10:
            print(f"        ... and {len(analysis['fields']) - 10} more fields")
        
        # Collect all character names
        characters = data.get('characters', [])
        for char in characters:
            name = char.get('name', '')
            if name not in all_chars:
                all_chars[name] = {
                    'files': [],
                    'data': {}
                }
            all_chars[name]['files'].append(filepath)
            all_chars[name]['data'][filepath] = char
    
    # Find characters that are missing in some files
    print("\n\n📊 CHARACTER COVERAGE ANALYSIS")
    print("="*60)
    
    # Count how many files each character appears in
    coverage = {}
    for char_name, info in all_chars.items():
        count = len(info['files'])
        if count not in coverage:
            coverage[count] = []
        coverage[count].append(char_name)
    
    for count in sorted(coverage.keys(), reverse=True):
        print(f"\nCharacters in {count}/3 files ({len(coverage[count])} chars):")
        if len(coverage[count]) <= 10:
            for char in sorted(coverage[count]):
                print(f"  - {char}")
        else:
            # Show first 5
            for char in sorted(coverage[count])[:5]:
                print(f"  - {char}")
            print(f"  ... and {len(coverage[count]) - 5} more")
    
    # Special check for problem characters
    print("\n\n🔍 CHECKING PROBLEM CHARACTERS")
    print("="*60)
    
    problem_chars = ['Agnes', 'H\'aanit', 'Ditrania', 'L\'eeto', 'Odio O', 'Odio S', 
                     'Ri\'tu', 'Thronè', 'W\'ludai', 'Z\'aanta', 'Primrose EX', 'H\'aanit EX']
    
    for char in problem_chars:
        if char in all_chars:
            print(f"\n✅ {char} found in: {', '.join(all_chars[char]['files'])}")
        else:
            # Try variations
            print(f"\n❌ {char} NOT FOUND - checking variations...")
            variations = []
            
            # Check for different apostrophe types
            if "'" in char:
                alt_char = char.replace("'", "'")
                if alt_char in all_chars:
                    variations.append(f"'{alt_char}' in {', '.join(all_chars[alt_char]['files'])}")
            
            # Check for EX variations
            if " EX" in char:
                alt_char = char.replace(" EX", " Ex")
                if alt_char in all_chars:
                    variations.append(f"'{alt_char}' in {', '.join(all_chars[alt_char]['files'])}")
                    
            # Check without spaces
            if " " in char:
                alt_char = char.replace(" ", "")
                if alt_char in all_chars:
                    variations.append(f"'{alt_char}' in {', '.join(all_chars[alt_char]['files'])}")
                    
            if variations:
                print(f"   Found as: {'; '.join(variations)}")

if __name__ == '__main__':
    main()