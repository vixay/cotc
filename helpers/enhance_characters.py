#!/usr/bin/env python3
"""
Script to enhance the existing characters.json with detailed character information
extracted from Excel analysis and web research.
"""

import json
import re
from pathlib import Path

# Load enhancement data from our research
ENHANCEMENT_DATA = {
    # Data from Excel analysis and web research
    "lynette": {
        "starRating": 5,
        "jobType": "Dancer", 
        "weaponTypes": ["fan"],
        "elementTypes": ["dark"],
        "canOverclass": True,
        "roles": {"primary": "Buffer", "secondary": "Support"},
        "roleTiers": {"Buffer": "S+", "Support": "S", "Debuffer": "A"},
        "overallTier": "S+",
        "keySkills": [
            "Triple buff system (active/passive/ultimate)",
            "Fire elemental damage", 
            "Team speed boost"
        ]
    },
    "primrose_ex": {
        "starRating": 5,
        "jobType": "Dancer",
        "weaponTypes": ["dagger"], 
        "elementTypes": ["dark"],
        "canOverclass": True,
        "roles": {"primary": "Buffer", "secondary": "Debuffer"},
        "roleTiers": {"Buffer": "S+", "Debuffer": "S+", "Support": "S+"},
        "overallTier": "S+",
        "keySkills": [
            "Complete buffer and debuffer kit",
            "Attack and elemental attack debuffs",
            "Front row speed increases",
            "Multi-role compression"
        ]
    },
    "solon": {
        "starRating": 5,
        "jobType": "Scholar",
        "weaponTypes": ["tome"],
        "elementTypes": ["fire"],
        "canOverclass": True,
        "roles": {"primary": "DPS", "secondary": "Support"},
        "roleTiers": {"DPS": "S+", "Support": "S", "Buffer": "A"},
        "overallTier": "S+",
        "keySkills": [
            "Double ultimate usage",
            "Unit potency doubling", 
            "P.Atk, E.Def, Polearm, Fire Res reduction",
            "AoE Fire attacks with combustion"
        ]
    },
    "signa": {
        "starRating": 5,
        "jobType": "Dancer",
        "weaponTypes": ["fan"],
        "elementTypes": ["wind"],
        "canOverclass": True,
        "roles": {"primary": "Debuffer", "secondary": "Support"},
        "roleTiers": {"Debuffer": "S+", "Support": "S", "Buffer": "B"},
        "overallTier": "S+",
        "keySkills": [
            "20% all stats debuff",
            "Queen of debuff abilities",
            "Wind elemental coverage"
        ]
    },
    "gilderoy": {
        "starRating": 5,
        "jobType": "Warrior",
        "weaponTypes": ["sword"],
        "elementTypes": ["lightning"],
        "canOverclass": True,
        "roles": {"primary": "Tank", "secondary": "DPS"},
        "roleTiers": {"Tank": "S", "DPS": "A", "Support": "B"},
        "overallTier": "S",
        "keySkills": [
            "Great tank capabilities",
            "Lightning sword attacks",
            "Team protection abilities"
        ]
    },
    "viola": {
        "starRating": 5,
        "jobType": "Thief",
        "weaponTypes": ["dagger"],
        "elementTypes": ["wind"],
        "canOverclass": True,
        "roles": {"primary": "Debuffer", "secondary": "DPS"},
        "roleTiers": {"Debuffer": "S+", "DPS": "A", "Support": "A"},
        "overallTier": "S+",
        "keySkills": [
            "One of the best debuffers in game",
            "Wind dagger specialist",
            "Endgame viable debuffing"
        ]
    },
    "lionel": {
        "starRating": 5,
        "jobType": "Warrior",
        "weaponTypes": ["sword"],
        "elementTypes": ["ice"],
        "canOverclass": True,
        "roles": {"primary": "Tank", "secondary": "DPS"},
        "roleTiers": {"Tank": "B", "DPS": "C", "Support": "C"},
        "overallTier": "B",
        "keySkills": [
            "Ice sword attacks",
            "Basic tanking abilities",
            "AoE sword skills"
        ]
    },
    "alfyn": {
        "starRating": 5,
        "jobType": "Apothecary",
        "weaponTypes": ["axe"],
        "elementTypes": ["ice"],
        "canOverclass": True,
        "roles": {"primary": "Healer", "secondary": "Support"},
        "roleTiers": {"Healer": "S", "Support": "S", "Buffer": "A"},
        "overallTier": "S",
        "keySkills": [
            "BP recovery support",
            "Team healing abilities",
            "Ice axe attacks"
        ]
    },
    "cyrus": {
        "starRating": 5,
        "jobType": "Scholar", 
        "weaponTypes": ["tome"],
        "elementTypes": ["ice", "fire", "lightning"],
        "canOverclass": True,
        "roles": {"primary": "DPS", "secondary": "Debuffer"},
        "roleTiers": {"DPS": "S", "Debuffer": "A", "Support": "B"},
        "overallTier": "S",
        "keySkills": [
            "Elemental nuker specialist",
            "Multi-element coverage",
            "High magical damage output"
        ]
    },
    "ophilia": {
        "starRating": 5,
        "jobType": "Cleric",
        "weaponTypes": ["staff"],
        "elementTypes": ["light"],
        "canOverclass": True,
        "roles": {"primary": "Healer", "secondary": "Support"},
        "roleTiers": {"Healer": "S", "Support": "A", "Buffer": "B"},
        "overallTier": "S",
        "keySkills": [
            "Dedicated healer",
            "Light elemental support",
            "Team healing optimization"
        ]
    }
}

def enhance_character(char_data, char_id):
    """Enhance a character entry with additional metadata"""
    if char_id not in ENHANCEMENT_DATA:
        # Set default values for characters without specific enhancement data
        default_star = 5 if not char_data.get("isFree") else 4
        default_job = infer_job_from_tags(char_data.get("tags", []))
        
        char_data.update({
            "starRating": default_star,
            "jobType": default_job,
            "weaponTypes": [],
            "elementTypes": [],
            "canOverclass": not char_data.get("isFree", False),
            "roles": {"primary": "Unknown", "secondary": None},
            "roleTiers": {},
            "overallTier": char_data.get("a4Tier", "B"),
            "keySkills": []
        })
        return char_data
    
    enhancement = ENHANCEMENT_DATA[char_id]
    char_data.update(enhancement)
    
    # Update notes if we have better information
    if "keySkills" in enhancement and enhancement["keySkills"]:
        skills_text = ", ".join(enhancement["keySkills"][:2])
        if len(char_data.get("notes", "")) < 100:  # If notes are brief
            char_data["notes"] = f"{char_data.get('notes', '')}. Key abilities: {skills_text}".strip(". ")
    
    # Update tags with role information
    if "tags" not in char_data:
        char_data["tags"] = []
    
    # Add role-based tags
    if enhancement.get("roles", {}).get("primary"):
        role_tag = enhancement["roles"]["primary"].lower()
        if role_tag not in char_data["tags"]:
            char_data["tags"].append(role_tag)
    
    # Add tier tags
    if enhancement.get("overallTier") in ["S+", "S"]:
        if "meta" not in char_data["tags"]:
            char_data["tags"].append("meta")
    
    return char_data

def infer_job_from_tags(tags):
    """Infer job type from existing tags"""
    job_mapping = {
        "buffer": "Dancer",
        "debuffer": "Dancer", 
        "healer": "Cleric",
        "tank": "Warrior",
        "dps": "Hunter",
        "support": "Cleric"
    }
    
    for tag in tags:
        if tag in job_mapping:
            return job_mapping[tag]
    
    return "Unknown"

def main():
    # Load existing characters.json
    json_path = Path('/mnt/c/Users/VJOverseer/OneDrive/code/vixay/cotc/data/characters.json')
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"Enhancing {len(data['characters'])} characters...")
    
    # Enhance each character
    enhanced_count = 0
    for char in data['characters']:
        char_id = char['id']
        original_keys = set(char.keys())
        
        enhance_character(char, char_id)
        
        new_keys = set(char.keys())
        if new_keys != original_keys:
            enhanced_count += 1
            print(f"Enhanced {char['name']} ({char_id})")
    
    # Update metadata
    data['version'] = "1.4.0"
    data['metadata']['dataSource'] = "Reddit tier lists, Discord community, dotgg.gg, Excel analysis, Web research"
    data['metadata']['schema_version'] = "2.0"
    data['metadata']['enhancements'] = {
        "added_fields": [
            "starRating", "jobType", "roles", "weaponTypes", "elementTypes", 
            "overallTier", "roleTiers", "keySkills", "canOverclass"
        ],
        "enhanced_characters": enhanced_count,
        "data_sources": [
            "Excel file analysis for job types and abilities",
            "dotgg.gg tier lists for overall rankings", 
            "meowdb.com for role-specific classifications",
            "Community meta analysis for role tiers"
        ]
    }
    
    # Save enhanced file
    enhanced_path = json_path.parent / 'characters_enhanced.json'
    with open(enhanced_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\\nEnhancement complete!")
    print(f"Enhanced {enhanced_count} characters")
    print(f"Saved to: {enhanced_path}")
    print(f"Version updated to: {data['version']}")

if __name__ == "__main__":
    main()