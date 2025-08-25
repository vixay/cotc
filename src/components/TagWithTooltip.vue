<template>
  <span 
    :class="['tag-with-tooltip', tagClass]"
    :title="tooltip"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    {{ formattedDisplayName }}
    
    <!-- Custom Tooltip (optional enhancement) -->
    <div 
      v-if="showTooltip && useCustomTooltip" 
      class="custom-tooltip"
    >
      {{ tooltip }}
    </div>
  </span>
</template>

<script>
import { getTagTooltip } from '../utils/tagTooltips'
import { getTagClass, formatModalTag } from '../utils/uiClasses'

export default {
  name: 'TagWithTooltip',
  props: {
    tag: {
      type: String,
      required: true
    },
    displayName: {
      type: String,
      default: null
    },
    useCustomTooltip: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showTooltip: false
    }
  },
  computed: {
    tooltip() {
      return getTagTooltip(this.tag)
    },
    tagClass() {
      return getTagClass(this.tag)
    },
    formattedDisplayName() {
      return this.displayName || formatModalTag(this.tag)
    }
  }
}
</script>

<style scoped>
.tag-with-tooltip {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: help;
  display: inline-block;
  position: relative;
  transition: all 0.2s ease;
}

.tag-with-tooltip:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Custom tooltip styling (if enabled) */
.custom-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.4;
  max-width: 250px;
  width: max-content;
  z-index: 1000;
  pointer-events: none;
  
  /* Tooltip arrow */
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
  }
}

/* Tag spacing in groups */
.tag-with-tooltip + .tag-with-tooltip {
  margin-left: 4px;
}
</style>