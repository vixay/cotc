// Tag Tooltip System - Provides descriptions for all character and accessory tags

export const tagTooltips = {
  // DRAYLEB PRIORITY SYSTEM
  'drayleb-must-pull': 'Essential meta-defining units - highest priority for pulling and investment. These characters form the backbone of competitive teams.',
  'drayleb-should-pull': 'Strong meta units - recommended for most players to improve their teams. Solid investments with good long-term value.',
  'drayleb-luxury': 'Nice-to-have units - luxury pulls for completionists or specific team compositions. Not essential but can enhance specialized strategies.',

  // PRIMARY ROLES
  'buffer': 'Provides stat boosts, buffs, and team support through enhancement abilities. Essential for maximizing team damage and survivability.',
  'debuffer': 'Applies debuffs, status effects, and enemy stat reductions for team advantage. Crucial for reducing enemy effectiveness.',
  'dps': 'Primary damage dealer - focuses on high damage output and enemy elimination. The core of offensive strategies.',
  'tank': 'Defensive specialist - absorbs damage and protects team members. Essential for survival in difficult content.',
  'healer': 'Restoration specialist - heals HP and provides recovery support. Keeps the team alive during extended battles.',
  'support': 'Utility specialist - provides various team benefits beyond damage or healing. Enables advanced team strategies.',

  // POSITION & TACTICAL MODIFIERS
  'front-row': 'Optimal positioning in front row for maximum effectiveness. Benefits from front-row bonuses or protects back-row allies.',
  'back-row': 'Best utilized in back row positions. Often ranged attackers or support units that need protection.',
  'front-row-buffer': 'Buffer unit optimized for front-row positioning. Provides buffs while maintaining battlefield presence.',

  // SPECIALIZATION TAGS
  'elemental': 'Specializes in specific elemental damage or resistance. Excellent for exploiting enemy weaknesses.',
  'dark-dps': 'Dark elemental damage specialist. Highly effective against light-weak enemies and in dark-focused team compositions.',
  'sword-dps': 'Sword weapon specialist with high physical attack damage. Excels against sword-weak enemies.',
  'weapon-specific': 'Optimized for particular weapon types or combat styles. Best used when enemy weaknesses align.',

  // META & TIER RANKINGS
  'top-tier': 'Among the best units in current meta - exceptional performance across all content types. Safe long-term investments.',
  'meta-relevant': 'Solid choice for current content - reliable performance in meta teams. Good value for investment.',
  'niche': 'Specialized use cases - excellent for specific content or team compositions. Situationally very powerful.',

  // CHARACTER STATUS
  'free': 'Available through story progression, events, or free guidance pulls. Accessible to all players without gacha luck.',
  'collaboration': 'Limited-time crossover character from another game series. May have unique abilities or special restrictions.',

  // TANK SPECIALIZATIONS
  'tank-synergy': 'Tank unit that works exceptionally well with specific team compositions or other tank units.',
  'damage-reduction': 'Specializes in reducing incoming damage through defensive abilities rather than just high HP/DEF.',

  // AWAKENING & INVESTMENT
  'u10-priority': 'Character that should be prioritized for U10 awakening investment. Maximum power unlock requires ultimate awakening.',
  'a4-priority': 'Character that gains significant power from A4 awakening. Strong mid-term investment target.',

  // CONTENT SPECIALIZATION
  'boss-killer': 'Excels at high single-target damage against boss enemies. Essential for challenging boss encounters.',
  'aoe-specialist': 'Area-of-effect damage expert. Excellent for clearing multiple enemies or mob encounters.',
  'weakness-breaker': 'Specialized in exploiting enemy weaknesses effectively. High value in weakness-based strategies.'
}

// Helper function to get tooltip for a tag
export function getTagTooltip(tag) {
  return tagTooltips[tag] || `${tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: Additional information not available.`
}

// Helper function to get all tags with categories for organization
export function getTagsByCategory() {
  return {
    priority: ['drayleb-must-pull', 'drayleb-should-pull', 'drayleb-luxury'],
    roles: ['buffer', 'debuffer', 'dps', 'tank', 'healer', 'support'],
    positioning: ['front-row', 'back-row', 'front-row-buffer'],
    specialization: ['elemental', 'dark-dps', 'sword-dps', 'weapon-specific', 'boss-killer', 'aoe-specialist', 'weakness-breaker'],
    meta: ['top-tier', 'meta-relevant', 'niche'],
    status: ['free', 'collaboration'],
    investment: ['u10-priority', 'a4-priority', 'tank-synergy', 'damage-reduction']
  }
}

// CSS classes for different tag types
export const tagClasses = {
  // Drayleb Priority Colors
  'drayleb-must-pull': 'tag-drayleb-must-pull',
  'drayleb-should-pull': 'tag-drayleb-should-pull', 
  'drayleb-luxury': 'tag-drayleb-luxury',
  
  // Role Colors
  'buffer': 'tag-buffer',
  'debuffer': 'tag-debuffer',
  'dps': 'tag-dps',
  'tank': 'tag-tank',
  'healer': 'tag-healer',
  'support': 'tag-support',
  
  // Meta Tiers
  'top-tier': 'tag-top-tier',
  'meta-relevant': 'tag-meta-relevant',
  'niche': 'tag-niche',
  
  // Special Status
  'free': 'tag-free',
  'collaboration': 'tag-collaboration',
  
  // Default
  'default': 'tag-default'
}

// Get CSS class for a tag
export function getTagClass(tag) {
  return tagClasses[tag] || tagClasses.default
}