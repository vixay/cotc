<template>
  <span class="infotip-container" @mouseenter="showTooltip" @mouseleave="hideTooltip">
    <span class="infotip-icon" :class="confidenceClass">i</span>
    <div 
      v-if="isVisible" 
      class="infotip-tooltip"
      :class="{ 'detailed': detailed }"
    >
      <div class="tooltip-evaluator">{{ sourceData.evaluator }}</div>
      <div class="tooltip-date">{{ formatDate(sourceData.lastUpdated) }}</div>
      <div class="tooltip-confidence">Confidence: {{ sourceData.confidence }}</div>
      
      <div v-if="detailed && sourceData.methodology" class="tooltip-methodology">
        Method: {{ sourceData.methodology }}
      </div>
      
      <div v-if="detailed && sourceData.audience" class="tooltip-audience">
        Audience: {{ sourceData.audience }}
      </div>
      
      <div v-if="detailed && sourceData.reasoning" class="tooltip-reasoning">
        {{ sourceData.reasoning }}
      </div>
      
      <div v-if="detailed && sourceData.sourceUrl" class="tooltip-link">
        <a :href="sourceData.sourceUrl" target="_blank" rel="noopener">View Source</a>
      </div>
    </div>
  </span>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'InfoTip',
  props: {
    sourceData: {
      type: Object,
      required: true,
      validator: (value) => {
        return value && value.evaluator && value.lastUpdated
      }
    },
    detailed: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const isVisible = ref(false)
    
    const confidenceClass = computed(() => {
      const confidence = props.sourceData.confidence?.toLowerCase()
      return `confidence-${confidence || 'unknown'}`
    })
    
    const showTooltip = () => {
      isVisible.value = true
    }
    
    const hideTooltip = () => {
      isVisible.value = false
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return 'Unknown date'
      try {
        return new Date(dateString).toLocaleDateString()
      } catch {
        return dateString
      }
    }
    
    return {
      isVisible,
      confidenceClass,
      showTooltip,
      hideTooltip,
      formatDate
    }
  }
}
</script>

<style scoped>
.infotip-container {
  position: relative;
  display: inline-block;
  margin-left: 4px;
}

.infotip-icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--text-secondary);
  color: var(--bg-primary);
  font-size: var(--font-size-tiny);
  line-height: 14px;
  text-align: center;
  cursor: help;
  font-weight: bold;
  transition: all 0.2s ease;
}

.infotip-icon:hover {
  transform: scale(1.1);
}

/* Confidence-based colors */
.infotip-icon.confidence-high {
  background: var(--success-color);
}

.infotip-icon.confidence-medium {
  background: var(--warning-color);
}

.infotip-icon.confidence-low {
  background: var(--danger-color);
}

.infotip-icon.confidence-unknown {
  background: var(--text-secondary);
}

.infotip-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: var(--font-size-secondary);
  white-space: nowrap;
  z-index: 10001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.infotip-tooltip.detailed {
  white-space: normal;
  width: 250px;
  text-align: left;
}

/* Tooltip arrow */
.infotip-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: var(--bg-secondary);
}

.tooltip-evaluator {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.tooltip-date {
  color: var(--text-secondary);
  font-size: var(--font-size-small);
  margin-bottom: 4px;
}

.tooltip-confidence {
  color: var(--text-secondary);
  font-size: var(--font-size-small);
  margin-bottom: 4px;
}

.tooltip-methodology,
.tooltip-audience {
  color: var(--text-secondary);
  font-size: var(--font-size-small);
  margin-bottom: 4px;
}

.tooltip-reasoning {
  color: var(--text-primary);
  font-size: var(--font-size-secondary);
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid var(--border-light);
}

.tooltip-link {
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid var(--border-light);
}

.tooltip-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-size: var(--font-size-small);
}

.tooltip-link a:hover {
  text-decoration: underline;
}

/* Responsive positioning for small screens */
@media (max-width: 768px) {
  .infotip-tooltip.detailed {
    width: 200px;
    left: -100px;
    transform: none;
  }
  
  .infotip-tooltip.detailed::after {
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>