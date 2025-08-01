#!/usr/bin/env python3
"""
Verify that v2 enhanced data contains all information from v1 data.
Generate a detailed report of any differences.
"""

import json
from pathlib import Path
from collections import defaultdict

def load_json(filepath):
    """Load JSON file and return data."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def compare_character_data(v1_char, v2_char, char_name):
    """Compare a single character between v1 and v2."""
    issues = []
    
    # Check critical fields that must match
    critical_fields = ['isFree', 'a4Tier', 'ultPriority', 'ultPriorityGroup', 'stones', 'notes']
    
    for field in critical_fields:
        v1_value = v1_char.get(field)
        v2_value = v2_char.get(field)
        
        if v1_value != v2_value:
            issues.append(f"  - {field}: v1='{v1_value}' vs v2='{v2_value}'")
    
    # Special check for stones (dict comparison)
    if 'stones' in v1_char and 'stones' in v2_char:
        v1_stones = v1_char['stones']
        v2_stones = v2_char['stones']
        
        for stone_key in ['AS1', 'AS2', 'AS3', 'AS4', 'AS5']:
            if v1_stones.get(stone_key) != v2_stones.get(stone_key):
                issues.append(f"  - stones.{stone_key}: v1='{v1_stones.get(stone_key)}' vs v2='{v2_stones.get(stone_key)}'")
    
    # Check tags (handle None and empty list)
    v1_tags = v1_char.get('tags', []) or []
    v2_tags = v2_char.get('tags', []) or []
    
    if set(v1_tags) != set(v2_tags):
        issues.append(f"  - tags: v1={v1_tags} vs v2={v2_tags}")
    
    return issues

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

def load_combined_v1_data():
    """Load and combine v1 data from all sources."""
    all_chars = {}
    
    # Load from characters.json first
    v1_data = load_json('data/characters.json')
    if v1_data:
        for char in v1_data['characters']:
            name = normalize_char_name(char['name'])
            # Skip blank "EX" entries
            if name.startswith("EX ") and len(name) <= 10:
                continue
            all_chars[name] = char
    
    # Merge with characters_enhanced.json
    enhanced_data = load_json('data/characters_enhanced.json')
    if enhanced_data:
        for char in enhanced_data['characters']:
            name = normalize_char_name(char['name'])
            # Skip blank "EX" entries
            if name.startswith("EX ") and len(name) <= 10:
                continue
            if name in all_chars:
                all_chars[name].update(char)
            else:
                all_chars[name] = char
    
    return all_chars

def verify_data_migration():
    """Main verification function."""
    print("🔍 Verifying data migration from v1 to v2...\n")
    
    # Load data files
    v1_chars = load_combined_v1_data()
    v2_data = load_json('data/characters_enhanced_v2.json')
    
    v2_chars = {normalize_char_name(char['name']): char for char in v2_data['characters']}
    
    # Track statistics
    stats = {
        'v1_total': len(v1_chars),
        'v2_total': len(v2_chars),
        'perfect_matches': 0,
        'characters_with_issues': 0,
        'missing_in_v2': [],
        'new_in_v2': []
    }
    
    # Report storage
    report = []
    
    # Check all v1 characters exist in v2
    print("📊 Character Count:")
    print(f"  - V1 (original): {stats['v1_total']} characters")
    print(f"  - V2 (enhanced): {stats['v2_total']} characters")
    print()
    
    # Find missing characters (using normalized names)
    for char_name in v1_chars:
        normalized_name = normalize_char_name(char_name)
        if normalized_name not in v2_chars:
            stats['missing_in_v2'].append(char_name)
    
    # Find new characters in v2
    for char_name in v2_chars:
        if char_name not in v1_chars:
            # Get original name from v2 data
            original_name = next((c['name'] for c in v2_data['characters'] if normalize_char_name(c['name']) == char_name), char_name)
            stats['new_in_v2'].append(original_name)
    
    # Compare matching characters
    print("🔄 Comparing character data...")
    issues_by_char = defaultdict(list)
    
    for char_name in v1_chars:
        normalized_name = normalize_char_name(char_name)
        if normalized_name in v2_chars:
            issues = compare_character_data(v1_chars[char_name], v2_chars[normalized_name], char_name)
            if issues:
                issues_by_char[char_name] = issues
                stats['characters_with_issues'] += 1
            else:
                stats['perfect_matches'] += 1
    
    # Generate report
    print("\n📋 VERIFICATION REPORT")
    print("=" * 50)
    
    if stats['missing_in_v2']:
        print(f"\n❌ Characters MISSING in v2 ({len(stats['missing_in_v2'])}):")
        for char in sorted(stats['missing_in_v2']):
            print(f"  - {char}")
    else:
        print("\n✅ All v1 characters found in v2!")
    
    if stats['new_in_v2']:
        print(f"\n➕ NEW characters in v2 ({len(stats['new_in_v2'])}):")
        # Only show first 10 to avoid clutter
        for char in sorted(stats['new_in_v2'])[:10]:
            print(f"  - {char}")
        if len(stats['new_in_v2']) > 10:
            print(f"  ... and {len(stats['new_in_v2']) - 10} more")
    
    if issues_by_char:
        print(f"\n⚠️  Characters with data mismatches ({len(issues_by_char)}):")
        for char_name, issues in sorted(issues_by_char.items()):
            print(f"\n{char_name}:")
            for issue in issues:
                print(issue)
    else:
        print("\n✅ All matching characters have identical awakening data!")
    
    # Summary
    print("\n📊 SUMMARY")
    print("=" * 50)
    print(f"Perfect matches: {stats['perfect_matches']}/{stats['v1_total']} ({stats['perfect_matches']/stats['v1_total']*100:.1f}%)")
    print(f"Characters with issues: {stats['characters_with_issues']}")
    print(f"New characters added: {len(stats['new_in_v2'])}")
    
    # Check if safe to migrate
    print("\n🚦 MIGRATION READINESS:")
    if not stats['missing_in_v2'] and stats['characters_with_issues'] == 0:
        print("✅ SAFE TO MIGRATE - All v1 data is preserved in v2!")
    else:
        print("❌ NOT READY - Please fix the issues above before migrating.")
    
    # Save detailed report
    report_data = {
        'summary': stats,
        'issues_by_character': dict(issues_by_char),
        'missing_in_v2': stats['missing_in_v2'],
        'new_in_v2': sorted(stats['new_in_v2'])
    }
    
    with open('helpers/migration_report.json', 'w', encoding='utf-8') as f:
        json.dump(report_data, f, ensure_ascii=False, indent=2)
    
    print("\n📁 Detailed report saved to: helpers/migration_report.json")
    
    return stats['missing_in_v2'] == [] and stats['characters_with_issues'] == 0

if __name__ == '__main__':
    is_ready = verify_data_migration()
    exit(0 if is_ready else 1)