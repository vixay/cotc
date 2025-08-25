<template>
  <div class="stats">
    <div class="stat-item">Released: <span>{{ releasedCount }}</span></div>
    <div class="stat-item">Unreleased: <span>{{ unreleasedCount }}</span></div>
    <div class="stat-item">Filtered: <span>{{ filteredCount }}</span></div>
  </div>
</template>

<script>
import { useCharacterStore } from '../stores/character'
import { computed } from 'vue'

export default {
  name: 'StatsSection',
  setup() {
    const characterStore = useCharacterStore()
    
    const releasedCount = computed(() => characterStore.releasedCharactersCount)
    const unreleasedCount = computed(() => characterStore.unreleasedCharactersCount)
    const filteredCount = computed(() => characterStore.filteredCharactersCount)
    
    return {
      releasedCount,
      unreleasedCount,
      filteredCount
    }
  }
}
</script>