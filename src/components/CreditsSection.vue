<template>
  <div class="credits" :class="{ collapsed: isCollapsed }">
    <h3 class="credits-header" @click="toggleCredits">
      Credits & Acknowledgments
      <span class="collapse-indicator">▼</span>
    </h3>
    <div class="credits-content" :class="{ expanded: !isCollapsed }">
      <div class="credits-grid">
        <div class="credits-section">
          <h4>Data Sources</h4>
          <ul>
            <li><strong>Community Tier Lists:</strong> Reddit COTC community, Discord discussions</li>
            <li><strong>dotgg.gg:</strong> Character tier rankings and meta analysis</li>
            <li><strong>Meow Database:</strong> Role-specific classifications and buff/debuff guides</li>
            <li><strong>Excel Database:</strong> Comprehensive character abilities and stats</li>
          </ul>
        </div>
        <div class="credits-section">
          <h4>Contributors</h4>
          <ul>
            <li><strong>vixay:</strong> Project creator and maintainer</li>
            <li><strong><a href="https://www.reddit.com/user/MontyVGC/" target="_blank" rel="noopener">MontyVGC</a>:</strong> Comprehensive Notion database with character stats and skills</li>
            <li><strong><a href="https://www.reddit.com/user/Drayleb/" target="_blank" rel="noopener">Drayleb</a>:</strong> Character tier assessments and meta analysis</li>
            <li><strong>COTC Community:</strong> Character assessments and feedback</li>
            <li><strong>Claude Code:</strong> Data analysis and application development</li>
            <li><strong>GitHub Contributors:</strong> Bug reports and feature suggestions</li>
          </ul>
        </div>
        <div class="credits-section">
          <h4>Tools & Technologies</h4>
          <ul>
            <li><strong>Vue 3:</strong> Progressive JavaScript framework</li>
            <li><strong>Pinia:</strong> Intuitive state management</li>
            <li><strong>CSS Custom Properties:</strong> Dynamic theming system</li>
            <li><strong>Python:</strong> Data extraction and enhancement scripts</li>
            <li><strong>GitHub Pages:</strong> Free hosting and deployment</li>
            <li><strong>Inter Font:</strong> Typography by Rasmus Andersson</li>
          </ul>
        </div>
        <div class="credits-section">
          <h4>Special Thanks</h4>
          <ul>
            <li><strong>Square Enix:</strong> Octopath Traveler: Champions of the Continent</li>
            <li><strong>COTC Players:</strong> Ongoing meta discussions and tier assessments</li>
            <li><strong>Open Source Community:</strong> Libraries and inspiration</li>
            <li><strong>Coffee Supporters:</strong> Fuel for late-night coding sessions ☕</li>
          </ul>
        </div>
      </div>
      <div class="disclaimer">
        <p><strong>Disclaimer:</strong> This is a fan-made tool not affiliated with Square Enix. Character assessments are based on community consensus and may vary with game updates.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreditsSection',
  data() {
    return {
      isCollapsed: false
    }
  },
  methods: {
    toggleCredits() {
      console.log('Credits toggle clicked, current state:', this.isCollapsed)
      this.isCollapsed = !this.isCollapsed
      console.log('Credits new state:', this.isCollapsed)
    }
  }
}
</script>