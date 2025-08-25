<template>
  <div class="legend" id="legend" :class="{ collapsed: isCollapsed }">
    <h3 class="legend-header" @click="toggleLegend">
      How to Use the OCTOPATH COTC META GUIDE
      <span class="collapse-indicator">▼</span>
    </h3>
    <div v-show="!isCollapsed" class="legend-content">
      <div class="legend-grid">
        <div class="legend-section">
          <h4>Search & Filtering</h4>
          <div class="legend-item"><span class="legend-key">🔍 Main Search:</span> Type character names or add tags as search pills</div>
          <div class="legend-item"><span class="legend-key">🎯 Filters:</span> Filter by job, stars, tier, priority, elements, etc.</div>
          <div class="legend-item"><span class="legend-key">📋 Views:</span> Toggle column groups (Core, Tiers, Ownership, etc.)</div>
          <div class="legend-item"><span class="legend-key">👤 Ownership:</span> Track owned characters, awaken levels, and ultimate levels</div>
          <div class="legend-item"><span class="legend-key">🏆 Group by Tier:</span> Organize characters by overall tier rating</div>
        </div>
        
        <div class="legend-section">
          <h4>Priority System</h4>
          <div class="legend-item"><span class="legend-key priority-essential">ESSENTIAL:</span> High priority for awakening/ultimate</div>
          <div class="legend-item"><span class="legend-key priority-good">GOOD:</span> Worth investing if you have resources</div>
          <div class="legend-item"><span class="legend-key priority-skip">SKIP:</span> Low priority, save resources for others</div>
          <div class="legend-item"><span class="legend-key">A4 Priority:</span> Awakening 4 investment priority</div>
          <div class="legend-item"><span class="legend-key">Ult Priority:</span> Ultimate level priority (U10, etc.)</div>
        </div>
        
        <div class="legend-section">
          <h4>Awakening Stones</h4>
          <div class="legend-item"><span class="legend-key">AS1-AS5:</span> Awakening Stones 1 through 5</div>
          <div class="legend-item"><span class="legend-key stone-u10">U10:</span> Ultimate Level 10 (highest priority)</div>
          <div class="legend-item"><span class="legend-key stone-a1">A1-A4:</span> Awakening stages 1-4</div>
          <div class="legend-item"><span class="legend-key stone-shard">Shard:</span> Exchange for awakening shards (definite recommendation)</div>
          <div class="legend-item"><span class="legend-key stone-blank">?:</span> User decides - mixed/uncertain priorities</div>
          <div class="legend-item free-note">• Free characters cannot be sharded!</div>
          <div class="legend-item free-note">• Blank stones (?) mean you should decide based on your needs and resources</div>
        </div>
        
        <div class="legend-section">
          <h4>Usage Tips</h4>
          <div class="legend-item">• Click character names to view detailed information</div>
          <div class="legend-item">• Use multiple filters simultaneously for precise results</div>
          <div class="legend-item">• Sources filter supports free text (e.g., type "free" to find all free sources)</div>
          <div class="legend-item">• Column visibility persists between sessions</div>
          <div class="legend-item">• 6 shards = 6000 fragments = 1 chosen dupe</div>
          <div class="legend-item">
            📖 <a href="https://github.com/vixay/cotc/blob/main/README.md" target="_blank" rel="noopener">Read the full guide</a> for detailed features and usage tips
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted } from 'vue'

export default {
  name: 'LegendSection',
  data() {
    return {
      isCollapsed: this.getInitialCollapsedState(),
      manualOverride: false,
      manualOverrideTimer: null,
      hasAutoCollapsed: false
    }
  },
  methods: {
    getInitialCollapsedState() {
      try {
        const saved = localStorage.getItem('cotc-legend-collapsed')
        return saved !== null ? JSON.parse(saved) : false
      } catch (error) {
        console.warn('Failed to load legend state from localStorage:', error)
        return false // Default to expanded
      }
    },
    
    saveLegendState() {
      try {
        localStorage.setItem('cotc-legend-collapsed', JSON.stringify(this.isCollapsed))
      } catch (error) {
        console.warn('Failed to save legend state to localStorage:', error)
      }
    },
    
    toggleLegend() {
      this.isCollapsed = !this.isCollapsed
      this.saveLegendState()
      
      // Set manual override to prevent auto-collapse for 5 seconds
      this.manualOverride = true
      if (this.manualOverrideTimer) {
        clearTimeout(this.manualOverrideTimer)
      }
      this.manualOverrideTimer = setTimeout(() => {
        this.manualOverride = false
      }, 5000)
    },
    
    handleScroll() {
      if (this.manualOverride) return
      
      const scrollPosition = window.scrollY || document.documentElement.scrollTop
      
      // Auto-collapse after scrolling 200px (only the first time)
      if (scrollPosition > 200 && !this.hasAutoCollapsed) {
        this.isCollapsed = true
        this.hasAutoCollapsed = true
        this.saveLegendState()
      }
      // Don't auto-expand again - user must manually expand after first auto-collapse
    }
  },
  
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll)
    if (this.manualOverrideTimer) {
      clearTimeout(this.manualOverrideTimer)
    }
  }
}
</script>

<style scoped>
/* Priority visual examples */
.legend-key.priority-essential {
  background: var(--danger-color);
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: bold;
  font-size: var(--font-size-small);
}

.legend-key.priority-good {
  background: var(--success-color);
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: bold;
  font-size: var(--font-size-small);
}

.legend-key.priority-skip {
  color: var(--text-tertiary);
  font-size: var(--font-size-small);
}

/* Stone visual examples */
.legend-key.stone-u10 {
  background: var(--success-color);
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: bold;
  font-size: var(--font-size-small);
}

.legend-key.stone-a1 {
  background: var(--primary-color);
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: var(--font-size-small);
}

.legend-key.stone-shard {
  background: var(--text-secondary);
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: var(--font-size-small);
}

.legend-key.stone-blank {
  color: var(--text-tertiary);
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px dashed var(--text-tertiary);
  font-style: italic;
  font-size: var(--font-size-small);
}

</style>