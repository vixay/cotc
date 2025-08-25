# Tag Registry

## Overview
Centralized registry for all tags used across characters, skills, ultimates, accessories, pets, and divine beasts. This ensures consistency, prevents duplication, and maintains a single source of truth for tag definitions.

## Tag Naming Convention

### Structure
`{source}_{effect_type}_{specificity}_{direction}`

**Examples**:
- `active_stats_patk_up` (source: active, effect: stats, specificity: patk, direction: up)
- `passive_res_fire_down` (source: passive, effect: res, specificity: fire, direction: down)
- `trigger_battle_start` (category: trigger, subcategory: battle, specificity: start)

### Rules
1. **Lowercase only** with underscores as separators
2. **Standard abbreviations**: P (physical), E (elemental), atk (attack), def (defense), hp, sp
3. **Consistent ordering**: source → effect type → specificity → direction
4. **Semantic clarity**: tag name should be self-explanatory
5. **Avoid redundancy**: don't create tags that overlap with existing ones

## Tag Categories

### 1. Stat Effects (`stat_*`)
Direct modifications to character statistics.

| Tag | Definition | Examples | UI Display |
|-----|------------|----------|------------|
| `stat_hp` | Increases HP stat | Accessories, passive skills | "HP Boost" |
| `stat_sp` | Increases SP stat | Accessories, passive skills | "SP Boost" |
| `stat_atk_phys` | Increases physical attack | Weapons, buffs | "Physical Attack" |
| `stat_atk_elem` | Increases elemental attack | Staves, scholar buffs | "Elemental Attack" |
| `stat_def_phys` | Increases physical defense | Armor, tank passives | "Physical Defense" |
| `stat_def_elem` | Increases elemental defense | Robes, cleric skills | "Elemental Defense" |
| `stat_crit_rate` | Increases critical hit rate | Daggers, hunter skills | "Critical Rate" |
| `stat_crit_dmg` | Increases critical damage | Accessories, rogue passives | "Critical Damage" |
| `stat_speed` | Increases action speed | Boots, dancer skills | "Speed" |
| `stat_accuracy` | Increases hit rate | Hunter skills, accessories | "Accuracy" |
| `stat_evasion` | Increases dodge rate | Thief skills, light armor | "Evasion" |

### 2. Stat Modifiers
Status effects that modify character stats, organized by COTC's damage calculation groups.

#### Group 1: Stats Modifiers
| Tag | Definition | Examples | UI Display |
|-----|------------|----------|------------|
| `active_stats_patk_up` | Active battle skill physical attack up | Warrior inspire skills | "Physical Attack Up (Active)" |
| `active_stats_eatk_up` | Active battle skill elemental attack up | Scholar support skills | "Elemental Attack Up (Active)" |
| `active_stats_pdef_up` | Active battle skill physical defense up | Guardian skills | "Physical Defense Up (Active)" |
| `active_stats_edef_up` | Active battle skill elemental defense up | Cleric protective magic | "Elemental Defense Up (Active)" |
| `active_stats_speed_up` | Active battle skill speed up | Dancer performance skills | "Speed Up (Active)" |
| `active_stats_crit_up` | Active battle skill critical rate up | Hunter focus skills | "Critical Rate Up (Active)" |
| `active_stats_acc_up` | Active battle skill accuracy up | Archer skills | "Accuracy Up (Active)" |
| `passive_stats_patk_up` | Passive skill physical attack up | Weapon passives | "Physical Attack Up (Passive)" |
| `passive_stats_eatk_up` | Passive skill elemental attack up | Magic weapon passives | "Elemental Attack Up (Passive)" |
| `passive_stats_pdef_up` | Passive skill physical defense up | Armor passives | "Physical Defense Up (Passive)" |
| `passive_stats_edef_up` | Passive skill elemental defense up | Robe passives | "Elemental Defense Up (Passive)" |
| `active_stats_patk_down` | Active skill physical attack down | Intimidation skills | "Physical Attack Down (Active)" |
| `active_stats_eatk_down` | Active skill elemental attack down | Magic suppression | "Elemental Attack Down (Active)" |
| `active_stats_pdef_down` | Active skill physical defense down | Armor break skills | "Physical Defense Down (Active)" |
| `active_stats_edef_down` | Active skill elemental defense down | Magic vulnerability | "Elemental Defense Down (Active)" |
| `active_stats_speed_down` | Active skill speed down | Slow effects | "Speed Down (Active)" |
| `active_stats_acc_down` | Active skill accuracy down | Blind/confusion effects | "Accuracy Down (Active)" |
| `passive_stats_patk_down` | Passive skill physical attack down | Aura debuffs | "Physical Attack Down (Passive)" |
| `passive_stats_pdef_down` | Passive skill physical defense down | Break passives | "Physical Defense Down (Passive)" |

#### Group 2: DMG Modifiers
| Tag | Definition | Examples | UI Display |
|-----|------------|----------|------------|
| `active_dmg_up` | Active battle skill damage up | Battle skill damage boosts | "Damage Up (Active)" |
| `passive_dmg_up` | Passive skill damage up | Weapon/accessory passives | "Damage Up (Passive)" |

#### Group 3: Resistance Modifiers
| Tag | Definition | Examples | UI Display |
|-----|------------|----------|------------|
| `active_res_fire_down` | Active skill fire resistance down | Fire break skills | "Fire Resistance Down (Active)" |
| `active_res_ice_down` | Active skill ice resistance down | Ice break skills | "Ice Resistance Down (Active)" |
| `active_res_lightning_down` | Active skill lightning resistance down | Lightning break skills | "Lightning Resistance Down (Active)" |
| `active_res_wind_down` | Active skill wind resistance down | Wind break skills | "Wind Resistance Down (Active)" |
| `active_res_light_down` | Active skill light resistance down | Light break skills | "Light Resistance Down (Active)" |
| `active_res_dark_down` | Active skill dark resistance down | Dark break skills | "Dark Resistance Down (Active)" |
| `active_res_sword_down` | Active skill sword resistance down | Sword break skills | "Sword Resistance Down (Active)" |
| `active_res_bow_down` | Active skill bow resistance down | Bow break skills | "Bow Resistance Down (Active)" |
| `active_res_dagger_down` | Active skill dagger resistance down | Dagger break skills | "Dagger Resistance Down (Active)" |
| `active_res_axe_down` | Active skill axe resistance down | Axe break skills | "Axe Resistance Down (Active)" |
| `active_res_staff_down` | Active skill staff resistance down | Staff break skills | "Staff Resistance Down (Active)" |
| `active_res_tome_down` | Active skill tome resistance down | Tome break skills | "Tome Resistance Down (Active)" |
| `active_res_fan_down` | Active skill fan resistance down | Fan break skills | "Fan Resistance Down (Active)" |
| `active_res_spear_down` | Active skill spear resistance down | Spear break skills | "Spear Resistance Down (Active)" |
| `passive_res_fire_down` | Passive skill fire resistance down | Fire break passives | "Fire Resistance Down (Passive)" |
| `passive_res_ice_down` | Passive skill ice resistance down | Ice break passives | "Ice Resistance Down (Passive)" |
| `passive_res_lightning_down` | Passive skill lightning resistance down | Lightning break passives | "Lightning Resistance Down (Passive)" |
| `passive_res_wind_down` | Passive skill wind resistance down | Wind break passives | "Wind Resistance Down (Passive)" |
| `passive_res_light_down` | Passive skill light resistance down | Light break passives | "Light Resistance Down (Passive)" |
| `passive_res_dark_down` | Passive skill dark resistance down | Dark break passives | "Dark Resistance Down (Passive)" |

#### Group 4: Ultimate Effects
| Tag | Definition | Source | UI Display |
|-----|------------|--------|------------|
| `ultimate_stats_up` | Ultimate technique stat up | Ultimate skills | "Stats Up (Ultimate)" |
| `ultimate_stats_down` | Ultimate technique stat down | Debuff ultimates | "Stats Down (Ultimate)" |
| `ultimate_dmg_up` | Ultimate technique damage up | Damage boost ultimates | "Damage Up (Ultimate)" |
| `ultimate_res_down` | Ultimate technique resistance down | Break ultimates | "Resistance Down (Ultimate)" |

#### Group 5: Pet Effects
| Tag | Definition | Source | UI Display |
|-----|------------|--------|------------|
| `pet_stats_up` | Pet ability stat up | Pet buffs | "Stats Up (Pet)" |
| `pet_stats_down` | Pet ability stat down | Pet debuffs | "Stats Down (Pet)" |
| `pet_dmg_up` | Pet ability damage up | Pet damage boosts | "Damage Up (Pet)" |
| `pet_res_down` | Pet ability resistance down | Pet breaks | "Resistance Down (Pet)" |

#### Group 6: Divine Beast Effects
| Tag | Definition | Source | UI Display |
|-----|------------|--------|------------|
| `divine_dmg_up` | Divine beast damage up (fixed 10%) | Divine beast effects | "Damage Up (Divine)" |

### 4. Resistance Down (`resist_down_*`)
Reduces enemy resistance to specific damage types.

#### Elemental Resistance Down
| Tag | Definition | UI Display |
|-----|------------|------------|
| `resist_down_fire` | Reduces fire resistance | "Fire Resistance Down" |
| `resist_down_ice` | Reduces ice resistance | "Ice Resistance Down" |
| `resist_down_lightning` | Reduces lightning resistance | "Lightning Resistance Down" |
| `resist_down_wind` | Reduces wind resistance | "Wind Resistance Down" |
| `resist_down_light` | Reduces light resistance | "Light Resistance Down" |
| `resist_down_dark` | Reduces dark resistance | "Dark Resistance Down" |

#### Weapon Resistance Down
| Tag | Definition | UI Display |
|-----|------------|------------|
| `resist_down_sword` | Reduces sword resistance | "Sword Resistance Down" |
| `resist_down_bow` | Reduces bow resistance | "Bow Resistance Down" |
| `resist_down_dagger` | Reduces dagger resistance | "Dagger Resistance Down" |
| `resist_down_axe` | Reduces axe resistance | "Axe Resistance Down" |
| `resist_down_staff` | Reduces staff resistance | "Staff Resistance Down" |
| `resist_down_tome` | Reduces tome resistance | "Tome Resistance Down" |
| `resist_down_fan` | Reduces fan resistance | "Fan Resistance Down" |
| `resist_down_spear` | Reduces spear resistance | "Spear Resistance Down" |

### 5. Status Ailments (`ailment_*`)
Negative status conditions that affect character behavior.

| Tag | Definition | Effect | UI Display |
|-----|------------|--------|------------|
| `ailment_poison` | Deals damage over time | HP loss per turn | "Poison" |
| `ailment_sleep` | Character cannot act | Skip turns | "Sleep" |
| `ailment_charm` | Character attacks allies | Friendly fire | "Charm" |
| `ailment_terror` | Character cannot use skills | Basic attacks only | "Terror" |
| `ailment_confusion` | Random target selection | Unpredictable attacks | "Confusion" |
| `ailment_silence` | Cannot use magic/skills | Physical attacks only | "Silence" |
| `ailment_blind` | Reduced accuracy | Higher miss chance | "Blind" |
| `ailment_paralysis` | Chance to skip turn | Random action loss | "Paralysis" |
| `ailment_burn` | Fire damage over time | Elemental DoT | "Burn" |
| `ailment_freeze` | Temporary immobilization | Skip next turn | "Freeze" |

### 6. Status Immunity (`immunity_*`)
Protection against specific status ailments.

| Tag | Definition | UI Display |
|-----|------------|------------|
| `immunity_poison` | Immune to poison effects | "Poison Immunity" |
| `immunity_sleep` | Immune to sleep effects | "Sleep Immunity" |
| `immunity_charm` | Immune to charm effects | "Charm Immunity" |
| `immunity_terror` | Immune to terror effects | "Terror Immunity" |
| `immunity_confusion` | Immune to confusion effects | "Confusion Immunity" |
| `immunity_silence` | Immune to silence effects | "Silence Immunity" |
| `immunity_blind` | Immune to blind effects | "Blind Immunity" |
| `immunity_paralysis` | Immune to paralysis effects | "Paralysis Immunity" |
| `immunity_all_ailments` | Immune to all status effects | "All Ailment Immunity" |

### 7. Recovery Effects (`heal_*`, `cure_*`, `cleanse_*`)
Positive effects that restore or remove conditions.

| Tag | Definition | UI Display |
|-----|------------|------------|
| `heal_hp` | Restores HP | "HP Recovery" |
| `heal_sp` | Restores SP | "SP Recovery" |
| `revive` | Resurrects fallen allies | "Revive" |
| `cleanse_ailments` | Removes all status ailments | "Cleanse" |
| `cure_poison` | Removes poison specifically | "Cure Poison" |
| `cure_sleep` | Removes sleep specifically | "Wake Up" |
| `cure_charm` | Removes charm specifically | "Break Charm" |

### 8. Damage Types (`dmg_*`)
Categories of damage dealt by attacks.

| Tag | Definition | UI Display |
|-----|------------|------------|
| `dmg_physical` | Physical damage type | "Physical Damage" |
| `dmg_elemental` | Elemental damage type | "Elemental Damage" |
| `dmg_fire` | Fire elemental damage | "Fire Damage" |
| `dmg_ice` | Ice elemental damage | "Ice Damage" |
| `dmg_lightning` | Lightning elemental damage | "Lightning Damage" |
| `dmg_wind` | Wind elemental damage | "Wind Damage" |
| `dmg_light` | Light elemental damage | "Light Damage" |
| `dmg_dark` | Dark elemental damage | "Dark Damage" |
| `dmg_single_target` | Affects one enemy | "Single Target" |
| `dmg_multi_target` | Affects multiple enemies | "Multi-Target" |
| `dmg_aoe` | Area of effect damage | "AoE Damage" |
| `dmg_piercing` | Ignores defense | "Piercing Damage" |
| `dmg_follow_up` | Additional attack after main | "Follow-Up Attack" |
| `dmg_counter` | Retaliatory attack | "Counter Attack" |

### 9. Special Mechanics (`special_*`)
Unique gameplay mechanics that don't fit other categories.

| Tag | Definition | UI Display |
|-----|------------|------------|
| `bp_generation` | Generates extra BP | "BP Generation" |
| `bp_manipulation` | Modifies BP costs/gains | "BP Manipulation" |
| `turn_manipulation` | Affects turn order | "Turn Control" |
| `action_delay` | Delays enemy actions | "Action Delay" |
| `action_speed_up` | Accelerates ally actions | "Action Speed Up" |
| `shield` | Absorbs incoming damage | "Shield" |
| `redirect_damage` | Redirects damage to self | "Damage Redirect" |
| `damage_reduction` | Reduces incoming damage | "Damage Reduction" |
| `reflect_damage` | Returns damage to attacker | "Damage Reflect" |
| `steal_buff` | Takes enemy buffs | "Buff Steal" |
| `dispel_buff` | Removes enemy buffs | "Dispel" |
| `buff_extend_giver` | Extends duration of buffs cast by this character | "Buff Extension (Giver)" |
| `buff_extend_receiver` | Extends duration of buffs received by this character | "Buff Extension (Receiver)" |
| `shorten_debuff` | Reduces debuff duration | "Debuff Reduction" |
| `break_boost` | Increases break damage | "Break Boost" |
| `weakness_exploit` | Extra damage vs weaknesses | "Weakness Exploit" |
| `break_damage` | Damage while enemy broken | "Break Damage" |

### 10. Targeting Patterns (`target_*`)
Defines who/what is affected by abilities.

| Tag | Definition | UI Display |
|-----|------------|------------|
| `target_self` | Affects only the user | "Self" |
| `target_ally_single` | Affects one ally | "Single Ally" |
| `target_ally_all` | Affects all allies | "All Allies" |
| `target_ally_front` | Affects front row allies | "Front Row Allies" |
| `target_ally_back` | Affects back row allies | "Back Row Allies" |
| `target_ally_paired` | Affects paired ally (battle partner) | "Paired Ally" |
| `target_enemy_single` | Affects one enemy | "Single Enemy" |
| `target_enemy_all` | Affects all enemies | "All Enemies" |
| `target_enemy_random` | Affects random enemy | "Random Enemy" |

### 11. Hit Patterns (`hit_*`)
Defines the attack pattern of abilities.

| Tag | Definition | UI Display |
|-----|------------|------------|
| `hit_single` | Single hit attack | "Single Hit" |
| `hit_multi` | Multiple hit attack | "Multi-Hit" |
| `hit_potency_up` | Attack with potency enhancement | "Potency Up" |
| `hit_count_up` | Increased number of attacks | "Attack Count Up" |

### 11. Trigger Conditions (`trigger_*`)
Conditions that activate abilities or effects.

| Tag | Definition | UI Display |
|-----|------------|------------|
| `trigger_battle_start` | Activates at battle beginning | "Battle Start" |
| `trigger_turn_start` | Activates at turn beginning | "Turn Start" |
| `trigger_turn_end` | Activates at turn end | "Turn End" |
| `trigger_break` | Activates when enemy broken | "On Break" |
| `trigger_low_hp` | Activates at low HP | "Low HP" |
| `trigger_ally_down` | Activates when ally defeated | "Ally Down" |
| `trigger_take_damage` | Activates when taking damage | "Take Damage" |
| `trigger_deal_damage` | Activates when dealing damage | "Deal Damage" |
| `trigger_critical_hit` | Activates on critical hit | "Critical Hit" |
| `trigger_dodge` | Activates when dodging | "On Dodge" |
| `trigger_kill` | Activates when defeating enemy | "On Kill" |

### 12. Meta Relevance (`meta_*`)
Tags for tracking current meta utility and content relevance.

| Tag | Definition | UI Display |
|-----|------------|------------|
| `meta_current` | Currently meta-relevant character | "Current Meta" |
| `meta_ex3_clear` | Essential for EX3 content clears | "EX3 Clear" |
| `meta_damage_dealer` | Meta damage dealer | "Meta DPS" |
| `meta_buffer` | Meta buffer/support | "Meta Buffer" |
| `meta_tank` | Meta tank/survivability | "Meta Tank" |
| `meta_niche` | Niche meta use case | "Niche Meta" |
| `meta_outdated` | Previously meta, now outdated | "Outdated Meta" |
| `meta_fire_weak` | Meta for fire weakness bosses | "Fire Weakness Meta" |
| `meta_ice_weak` | Meta for ice weakness bosses | "Ice Weakness Meta" |
| `meta_lightning_weak` | Meta for lightning weakness bosses | "Lightning Weakness Meta" |
| `meta_wind_weak` | Meta for wind weakness bosses | "Wind Weakness Meta" |
| `meta_light_weak` | Meta for light weakness bosses | "Light Weakness Meta" |
| `meta_dark_weak` | Meta for dark weakness bosses | "Dark Weakness Meta" |
| `meta_break_focus` | Meta for break-focused strategies | "Break Meta" |
| `meta_buff_stack` | Meta for buff stacking strategies | "Buff Stack Meta" |

## Tag Governance

### Adding New Tags
1. **Check existing tags** - Ensure no overlap with current registry
2. **Follow naming convention** - Use established patterns
3. **Define clearly** - Provide definition, examples, UI display text
4. **Update registry** - Add to this document with full details
5. **Test compatibility** - Ensure works with existing search/filter systems

### Modifying Existing Tags
1. **Document reason** - Why is the change needed?
2. **Check usage** - Where is the current tag used?
3. **Plan migration** - How to update existing data?
4. **Update registry** - Modify definition and examples
5. **Update UI** - Ensure display text is current

### Deprecating Tags
1. **Mark as deprecated** - Add deprecation notice
2. **Provide alternative** - Suggest replacement tag
3. **Set removal timeline** - Give users time to migrate
4. **Clean up data** - Remove from all references
5. **Remove from registry** - Delete after confirmed cleanup

## UI Integration

### Search Interface Design
The tag system should integrate seamlessly with the existing search, making it intuitive for users to find what they need.

#### Auto-Complete Search Bar
```html
<div class="tag-search-container">
  <input type="text" 
         id="tagSearch" 
         placeholder="Type to find characters, skills, or effects..."
         autocomplete="off">
  <div id="tagSuggestions" class="tag-suggestions">
    <!-- Dynamic suggestions appear here -->
  </div>
</div>
```

#### Tag Suggestion Categories
When user types, show suggestions grouped by relevance:

1. **Direct matches** - Exact tag name matches
2. **Partial matches** - Tags containing the search term
3. **Related tags** - Semantically similar tags
4. **Popular tags** - Most commonly used tags

#### Visual Tag Display
```html
<div class="selected-tags">
  <span class="tag tag-buff">Physical Attack Buff <button class="tag-remove">×</button></span>
  <span class="tag tag-target">All Allies <button class="tag-remove">×</button></span>
</div>
```

#### Search Logic
```javascript
// Multi-tag search with Boolean logic
function searchByTags(selectedTags, searchMode = 'AND') {
  const results = characters.filter(character => {
    const characterTags = getAllTagsForCharacter(character);
    
    if (searchMode === 'AND') {
      return selectedTags.every(tag => characterTags.includes(tag));
    } else if (searchMode === 'OR') {
      return selectedTags.some(tag => characterTags.includes(tag));
    }
  });
  
  return results;
}
```

### Filter Integration
Tags integrate with existing filters to create powerful search combinations:

```javascript
const searchCriteria = {
  tags: ['buff_atk_phys', 'target_ally_all'],
  tagMode: 'AND',
  role: 'Buffer',
  tier: ['S+', 'S'],
  availability: 'gacha'
};
```

This creates a comprehensive, maintainable system for organizing and searching game content while keeping the UI intuitive and responsive.