<template>
  <div class="unified-search-container">
    <!-- Header -->
    <div class="search-header">
      <h1 class="search-title">
        <i class="pi pi-search"></i>
        {{ pageTitle }}
      </h1>
      <p class="search-subtitle">
        {{ pageSubtitle }}
      </p>
    </div>

    <!-- Search Controls -->
    <div class="search-controls">
      <div class="search-input-group">
        <span class="p-input-icon-left">
          <i class="pi pi-search"></i>
          <InputText 
            v-model="searchQuery"
            placeholder="Search: tag:healing type:passive job:warrior sp:>30 tier:S+"
            class="search-input"
            @input="performSearch"
          />
        </span>
        <Button 
          icon="pi pi-times" 
          class="p-button-text clear-button"
          @click="clearSearch"
          :disabled="!searchQuery"
          v-tooltip.top="'Clear search'"
        />
        <Button 
          icon="pi pi-filter-slash" 
          label="Clear All Filters"
          class="p-button-outlined clear-all-button"
          @click="clearAllFilters"
          :disabled="!hasActiveFilters"
          v-tooltip.top="'Reset all filters and search'"
        />
      </div>

      <!-- Search Syntax Hints -->
      <div class="search-hints" v-if="!searchQuery">
        <div class="hints-content">
          <span class="hints-label">Search examples:</span>
          <div class="hint-examples">
            <code class="hint-example" @click="setSearchExample('tag:healing')">tag:healing</code>
            <code class="hint-example" @click="setSearchExample('type:passive')">type:passive</code>
            <code class="hint-example" @click="setSearchExample('job:warrior')">job:warrior</code>
            <code class="hint-example" @click="setSearchExample('sp:>30')">sp:>30</code>
            <code class="hint-example" @click="setSearchExample('tier:S+')">tier:S+</code>
            <code class="hint-example" @click="setSearchExample('character:primrose')">character:primrose</code>
          </div>
        </div>
      </div>

      <!-- Quick Filters -->
      <div class="quick-filters">
        <div class="filter-group" v-if="!defaultContentType">
          <label class="filter-label">Content Type:</label>
          <SelectButton 
            v-model="selectedContentTypes" 
            :options="contentTypeOptions" 
            optionLabel="label"
            optionValue="value"
            multiple
            class="content-type-selector"
          />
        </div>



        <div class="filter-group" v-if="selectedContentTypes.includes('skills')">
          <label class="filter-label">Skill Type:</label>
          <MultiSelect 
            v-model="selectedSkillTypes"
            :options="skillTypeOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="All types"
            :showClear="true"
            display="chip"
            class="skill-type-selector"
            :maxSelectedLabels="3"
            :showSelectAll="false"
            :showToggleAll="false"
          />
        </div>

        <div class="filter-group" v-if="selectedContentTypes.includes('accessories')">
          <label class="filter-label">Accessory Type:</label>
          <MultiSelect 
            v-model="selectedAccessoryTypes"
            :options="accessoryTypeOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="All types"
            :showClear="true"
            display="chip"
            class="accessory-type-selector"
            :maxSelectedLabels="2"
            :emptyFilterMessage="'No matching types found'"
            :filter="false"
            :showSelectAll="false"
            :showToggleAll="false"
          />
        </div>

        <div class="filter-group">
          <label class="filter-label">Sort by:</label>
          <Dropdown 
            v-model="sortOption" 
            :options="sortOptions" 
            optionLabel="label"
            optionValue="value"
            placeholder="Name (A-Z)"
            class="sort-dropdown"
          />
        </div>
      </div>

      <!-- Advanced Filters Toggle -->
      <Button 
        :label="showAdvancedFilters ? 'Hide Advanced' : 'Show Advanced'"
        :icon="showAdvancedFilters ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
        class="p-button-text advanced-filters-toggle"
        @click="showAdvancedFilters = !showAdvancedFilters"
      />

      <!-- Advanced Filters -->
      <div 
        v-if="showAdvancedFilters"
        class="advanced-filters-panel"
      >
      <div class="advanced-filters-grid">
        <div class="filter-row">
          <div class="filter-col">
            <label class="filter-label">Tags ({{ availableTags.length }} available):</label>
            <MultiSelect 
              v-model="selectedTags"
              :options="availableTags"
              placeholder="Filter by tags"
              :filter="true"
              :showClear="true"
              display="chip"
              class="tag-selector"
              :maxSelectedLabels="3"
            />
            <small style="display: block; margin-top: 4px; color: #666;">
              Debug: {{ availableTags.slice(0, 5).join(', ') }}{{ availableTags.length > 5 ? '...' : '' }}
            </small>
          </div>
          <div class="filter-col">
            <label class="filter-label">SP Cost Range:</label>
            <div class="sp-cost-range">
              <InputNumber 
                v-model="spCostRange.min" 
                placeholder="Min"
                :min="0"
                :max="200"
                class="sp-input"
              />
              <span class="range-separator">to</span>
              <InputNumber 
                v-model="spCostRange.max" 
                placeholder="Max"
                :min="0"
                :max="200"
                class="sp-input"
              />
            </div>
          </div>
        </div>

        <div class="filter-row">
          <div class="filter-col">
            <label class="filter-label">Search Mode:</label>
            <SelectButton 
              v-model="searchMode" 
              :options="searchModeOptions"
              optionLabel="label"
              optionValue="value"
              class="search-mode-selector"
            />
          </div>
          <div class="filter-col">
            <label class="filter-label">Results Per Page:</label>
            <Select 
              v-model="pageSize" 
              :options="pageSizeOptions"
              class="page-size-selector"
            />
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- Results Summary -->
    <div class="results-summary" v-if="searchResults.length > 0 || searchQuery">
      <div class="summary-stats">
        <span class="result-count">
          {{ filteredResults.length }} of {{ searchResults.length }} results
          <span v-if="searchQuery">for "{{ searchQuery }}"</span>
        </span>
        <div class="summary-breakdown">
          <span v-if="skillResults.length" class="breakdown-item">
            <i class="pi pi-flash"></i> {{ skillResults.length }} skills
          </span>
          <span v-if="accessoryResults.length" class="breakdown-item">
            <i class="pi pi-shield"></i> {{ accessoryResults.length }} accessories
          </span>
        </div>
      </div>

      <!-- Export Options -->
      <div class="export-controls">
        <Button 
          icon="pi pi-download" 
          label="Export"
          class="p-button-outlined export-button"
          @click="toggleExportMenu"
        />
        <Menu ref="exportMenu" :model="exportMenuItems" :popup="true" />
      </div>
    </div>

    <!-- Results Table -->
    <DataTable 
      :value="filteredResults"
      :paginator="true"
      :rows="pageSize"
      :totalRecords="filteredResults.length"
      :lazy="false"
      :loading="isLoading"
      class="unified-results-table"
      :resizableColumns="true"
      columnResizeMode="fit"
      stripedRows
      responsiveLayout="scroll"
    >

      <!-- Combined Type Column -->
      <Column field="type" header="Type" :sortable="true" style="min-width: 120px; max-width: 160px; width: 12%">
        <template #body="{ data }">
          <div class="combined-type-cell">
            <div class="type-display">
              <div class="main-type">{{ getMainType(data) }}</div>
              <div class="sub-type">
                <Tag 
                  :value="getSubType(data)"
                  :severity="getCombinedTypeSeverity(data)"
                  :icon="getCombinedTypeIcon(data)"
                  class="sub-type-tag"
                />
              </div>
            </div>
          </div>
        </template>
      </Column>

      <!-- Name Column -->
      <Column field="name" header="Name" :sortable="true" style="min-width: 160px; max-width: 240px; width: 20%">
        <template #body="{ data }">
          <div class="name-cell">
            <span class="item-name" :title="data.name">{{ data.name }}</span>
            <div v-if="data.character" class="character-link">
              <CharacterPortrait 
                :characterId="data.character.id"
                :characterName="data.character.name"
                size="small"
                :clickable="true"
                class="character-portrait-inline"
                @click="openCharacterModal(data.character)"
              />
              <span 
                class="character-name clickable-name" 
                @click="openCharacterModal(data.character)"
                :title="'Click to view ' + data.character.name"
              >{{ data.character.name }}</span>
            </div>
          </div>
        </template>
      </Column>

      <!-- Tier Column -->
      <Column field="tier" header="Tier" :sortable="true" style="min-width: 80px; max-width: 100px; width: 80px;">
        <template #body="{ data }">
          <div class="tier-cell">
            <Tag 
              v-if="data.tier"
              :value="data.tier"
              :severity="getTierSeverity(data.tier)"
              class="tier-badge"
            />
            <span v-else class="tier-empty">-</span>
          </div>
        </template>
      </Column>

      <!-- Stats Column -->
      <Column field="stats" header="Stats" style="min-width: 100px; max-width: 160px; width: 12%;">
        <template #body="{ data }">
          <div class="stats-cell">
            <div v-if="data.stats && Object.keys(data.stats).length" class="stats-icons">
              <div 
                v-for="[statType, value] in Object.entries(data.stats).slice(0, 4)" 
                :key="statType"
                class="stat-item"
                v-tooltip.top="getStatTooltip({type: statType, value: value})"
              >
                <img 
                  v-if="getStatIcon(statType)"
                  :src="getStatIcon(statType)" 
                  :alt="statType"
                  class="stat-icon ui-stat-icon-sm"
                />
                <span 
                  v-else
                  class="stat-icon-placeholder"
                  :title="statType"
                ></span>
                <span class="stat-value">{{ formatStatValue(value) }}</span>
              </div>
              <span v-if="Object.keys(data.stats).length > 4" class="more-stats">
                +{{ Object.keys(data.stats).length - 4 }} more
              </span>
            </div>
            <span v-else class="stats-empty">No stats</span>
          </div>
        </template>
      </Column>

      <!-- Effects Column -->
      <Column field="effects" header="Effects" style="min-width: 180px; max-width: 280px; width: 22%;">
        <template #body="{ data }">
          <div class="effects-cell">
            <p class="effects-text">{{ data.effects || data.description }}</p>
          </div>
        </template>
      </Column>

      <!-- Tags Column -->
      <Column field="notes" header="Tags" style="min-width: 120px; max-width: 200px; width: 15%;">
        <template #body="{ data }">
          <div class="notes-cell">
            <p class="notes-text">{{ data.notes || '' }}</p>
            <div v-if="data.tags && data.tags.length" class="tags-container">
              <Chip 
                v-for="tag in data.tags.slice(0, 3)" 
                :key="tag"
                :label="tag"
                class="skill-tag"
                :class="{ 'selected-tag': selectedTags.includes(tag) }"
                @click="toggleTagFilter(tag)"
                :removable="false"
              />
              <Chip 
                v-if="data.tags.length > 3"
                :label="`+${data.tags.length - 3} more`"
                class="more-tags-indicator"
                @click="viewDetails(data)"
                :removable="false"
              />
            </div>
          </div>
        </template>
      </Column>

      <!-- Details Column -->
      <Column field="details" header="Details" style="min-width: 100px; max-width: 140px; width: 10%;">
        <template #body="{ data }">
          <div class="details-cell">
            <div v-if="data.spCost" class="detail-item">
              <i class="pi pi-bolt"></i>
              <span>{{ data.spCost }} SP</span>
            </div>
          </div>
        </template>
      </Column>

      <!-- Actions Column -->
      <Column header="Actions" style="min-width: 100px; width: 8%;">
        <template #body="{ data }">
          <div class="action-buttons">
            <Button 
              icon="pi pi-eye"
              class="p-button-text p-button-sm view-button"
              @click="viewDetails(data)"
              v-tooltip.top="'View details'"
            />
            <Button 
              v-if="data.character"
              icon="pi pi-user"
              class="p-button-text p-button-sm character-button"
              @click="openCharacterModal(data.character)"
              v-tooltip.top="'View character'"
            />
          </div>
        </template>
      </Column>

      <!-- Empty State -->
      <template #empty>
        <div class="empty-state">
          <i class="pi pi-search empty-icon"></i>
          <h3 class="empty-title">No results found</h3>
          <p class="empty-message" v-if="searchQuery">
            No skills or accessories match your search for "{{ searchQuery }}".
          </p>
          <p class="empty-message" v-else>
            Enter a search term or adjust your filters to see results.
          </p>
        </div>
      </template>
    </DataTable>

    <!-- Details Modal -->
    <Dialog 
      v-model:visible="showDetailsModal" 
      :header="selectedItem?.name || 'Details'"
      :modal="true"
      class="details-modal"
      :style="{ width: '70vw', maxWidth: '800px' }"
    >
      <div v-if="selectedItem" class="item-details">
        <div class="detail-header">
          <div class="header-tags">
            <Tag 
              :value="selectedItem.type"
              :severity="getTypeSeverity(selectedItem.type)"
              :icon="getTypeIcon(selectedItem.type)"
              class="type-tag-large"
            />
            <Tag 
              v-if="selectedItem.type === 'skills' && selectedItem.skillType"
              :value="selectedItem.skillType"
              :severity="getSkillTypeSeverity(selectedItem.skillType)"
              :icon="getSkillTypeIcon(selectedItem.skillType)"
              class="skill-type-tag-large"
            />
          </div>
          <h2 class="item-title">{{ selectedItem.name }}</h2>
        </div>

        <div class="detail-content">
          <div class="description-section">
            <h3>Description</h3>
            <p class="full-description">{{ selectedItem.description }}</p>
          </div>

          <div v-if="selectedItem.tags && selectedItem.tags.length" class="tags-section">
            <h3>Tags</h3>
            <div class="tags-grid">
              <Chip 
                v-for="tag in selectedItem.tags" 
                :key="tag"
                :label="tag"
                class="detail-tag"
                :class="{ 'selected-tag': selectedTags.includes(tag) }"
                @click="toggleTagFilter(tag)"
                :removable="false"
              />
            </div>
          </div>

          <div v-if="selectedItem.stats && Object.keys(selectedItem.stats).length && selectedItem.type === 'accessories'" class="stats-section">
            <h3>Stats</h3>
            <div class="stats-grid">
              <div 
                v-for="(value, statType) in selectedItem.stats" 
                :key="statType"
                v-show="value > 0"
                class="stat-item"
              >
                <img 
                  v-if="getStatIcon(statType)"
                  :src="getStatIcon(statType)" 
                  :alt="statType"
                  class="stat-icon"
                />
                <span class="stat-value">{{ formatStatValue(value, statType) }}</span>
              </div>
            </div>
          </div>

          <div class="metadata-section">
            <h3>Details</h3>
            <div class="metadata-grid">
              <div v-if="selectedItem.spCost" class="metadata-item">
                <strong>SP Cost:</strong> {{ selectedItem.spCost }}
              </div>
              <div v-if="selectedItem.accessoryType" class="metadata-item">
                <strong>Type:</strong> {{ selectedItem.accessoryType }}
              </div>
              <div v-if="selectedItem.character" class="metadata-item">
                <strong>Character:</strong> {{ selectedItem.character.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted, watch, nextTick } from 'vue'
import { useCharacterStore } from '../stores/character'
import { useToast } from 'primevue/usetoast'
import CharacterPortrait from './CharacterPortrait.vue'
import { paths } from '../utils/pathUtils.js'

// PrimeVue Components
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import SelectButton from 'primevue/selectbutton'
import Select from 'primevue/select'
import Dropdown from 'primevue/dropdown'
import MultiSelect from 'primevue/multiselect'
import InputNumber from 'primevue/inputnumber'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Chip from 'primevue/chip'
import Dialog from 'primevue/dialog'
import Menu from 'primevue/menu'

export default {
  name: 'UnifiedSearchPage',
  props: {
    defaultContentType: {
      type: String,
      default: null // null means show both skills and accessories (unified search)
    }
  },
  components: {
    InputText,
    Button,
    SelectButton,
    Select,
    Dropdown,
    MultiSelect,
    InputNumber,
    DataTable,
    Column,
    Tag,
    Chip,
    Dialog,
    Menu,
    CharacterPortrait
  },
  setup(props) {
    const characterStore = useCharacterStore()
    const toast = useToast()

    // Reactive state
    const searchQuery = ref('')
    const isLoading = ref(false)
    const showAdvancedFilters = ref(false)
    const showDetailsModal = ref(false)
    const selectedItem = ref(null)
    const pageSize = ref(25)
    const exportMenu = ref()

    // Initialize content types based on route prop
    const getInitialContentTypes = () => {
      if (props.defaultContentType === 'skills') {
        return ['skills']
      } else if (props.defaultContentType === 'accessories') {
        return ['accessories']
      } else {
        return ['skills', 'accessories'] // unified search
      }
    }

    // Filters
    const selectedContentTypes = ref(getInitialContentTypes())
    const selectedCharacters = ref([])
    const selectedSkillTypes = ref([])
    const selectedAccessoryTypes = ref([])
    const selectedTags = ref([])
    const spCostRange = reactive({ min: null, max: null })
    const searchMode = ref('contains')
    const sortOption = ref('name_asc')

    // Search results
    const searchResults = ref([])
    const allSkills = ref([])
    const allAccessories = ref([])

    // Options
    const contentTypeOptions = [
      { label: 'Skills', value: 'skills' },
      { label: 'Accessories', value: 'accessories' }
    ]

    const searchModeOptions = [
      { label: 'Contains', value: 'contains' },
      { label: 'Starts with', value: 'startsWith' },
      { label: 'Exact match', value: 'exact' }
    ]

    const pageSizeOptions = [10, 25, 50, 100]
    
    const sortOptions = [
      { label: 'Name (A-Z)', value: 'name_asc' },
      { label: 'Name (Z-A)', value: 'name_desc' },
      { label: 'P.Atk (High → Low)', value: 'patk_desc' },
      { label: 'P.Atk (Low → High)', value: 'patk_asc' },
      { label: 'E.Atk (High → Low)', value: 'eatk_desc' },
      { label: 'E.Atk (Low → High)', value: 'eatk_asc' },
      { label: 'HP (High → Low)', value: 'hp_desc' },
      { label: 'HP (Low → High)', value: 'hp_asc' },
      { label: 'Speed (High → Low)', value: 'speed_desc' },
      { label: 'Speed (Low → High)', value: 'speed_asc' },
      { label: 'SP (High → Low)', value: 'sp_desc' },
      { label: 'SP (Low → High)', value: 'sp_asc' },
      { label: 'Crit (High → Low)', value: 'crit_desc' },
      { label: 'Crit (Low → High)', value: 'crit_asc' }
    ]

    const skillTypeOptions = [
      { label: 'Passive', value: 'passive' },
      { label: 'Active', value: 'active' },
      { label: 'Ultimate', value: 'ultimate' },
      { label: 'EX', value: 'ex' },
      { label: 'Blessing', value: 'blessing' }
    ].filter(option => option.value && option.label && option.value.trim() && option.label.trim())
    
    const accessoryTypeOptions = [
      { label: 'General', value: 'normal' },
      { label: 'Character (A4)', value: 'awakening' },
      { label: 'Exclusive', value: 'exclusive' },
      { label: 'Artifact (Lv 120)', value: 'artifact' }
    ].filter(option => option.value && option.label && option.value.trim() && option.label.trim())

    // Computed properties
    const characterOptions = computed(() => {
      if (!characterStore.characters) return []
      return characterStore.characters.map(char => ({
        id: char.id,
        name: char.name
      }))
    })



    const totalCharacters = computed(() => characterStore.characters?.length || 0)
    const totalSkills = computed(() => allSkills.value?.length || 0)
    const totalAccessories = computed(() => allAccessories.value?.length || 0)

    const availableTags = computed(() => {
      const tags = new Set()
      
      // Add tags from skills
      if (allSkills.value && allSkills.value.length > 0) {
        allSkills.value.forEach(skill => {
          if (skill.tags && skill.tags.length > 0) {
            skill.tags.forEach(tag => tags.add(tag))
          }
        })
      }
      
      // Add tags from accessories
      if (allAccessories.value && allAccessories.value.length > 0) {
        allAccessories.value.forEach(accessory => {
          if (accessory.tags && accessory.tags.length > 0) {
            accessory.tags.forEach(tag => tags.add(tag))
          }
        })
      }
      
      return Array.from(tags).sort()
    })

    // Dynamic titles based on content type
    const pageTitle = computed(() => {
      if (props.defaultContentType === 'skills') {
        return 'Skills Search'
      } else if (props.defaultContentType === 'accessories') {
        return 'Accessories Search'  
      } else {
        return 'Search All - Skills & Accessories'
      }
    })

    const pageSubtitle = computed(() => {
      if (props.defaultContentType === 'skills') {
        return `Search across ${totalSkills.value} skills from all ${totalCharacters.value} characters`
      } else if (props.defaultContentType === 'accessories') {
        return `Search across ${totalAccessories.value} accessories from all ${totalCharacters.value} characters`
      } else {
        return `Search across ${totalSkills.value} skills and ${totalAccessories.value} accessories from all ${totalCharacters.value} characters`
      }
    })

    const filteredResults = computed(() => {
      let results = [...(searchResults.value || [])]

      // Filter by content type
      if (selectedContentTypes.value.length > 0) {
        results = results.filter(item => selectedContentTypes.value.includes(item.type))
      }

      // Filter by unreleased characters (respect main page setting)
      if (characterStore && characterStore.filters && !characterStore.filters.showUnreleased) {
        const currentDate = new Date()
        results = results.filter(item => {
          // Only filter items that have associated characters
          if (item.character) {
            const releaseDate = item.character.glReleaseDate
            // Filter out if no release date (empty string) or release date is in the future
            if (!releaseDate || releaseDate.trim() === '') {
              return false // No release date = unreleased
            }
            const parsedDate = new Date(releaseDate)
            // Filter out if release date is in the future
            return parsedDate <= currentDate
          }
          // Items without characters always show (not character-dependent)
          return true
        })
      }

      // Filter by skill types
      if (selectedSkillTypes.value.length > 0) {
        results = results.filter(item => 
          item.type === 'skills' ? selectedSkillTypes.value.includes(item.skillType) : true
        )
      }

      // Filter by accessory types
      if (selectedAccessoryTypes.value.length > 0) {
        results = results.filter(item => 
          item.type === 'accessories' ? selectedAccessoryTypes.value.includes(item.accessoryType) : true
        )
      }

      // Filter by tags
      if (selectedTags.value.length > 0) {
        results = results.filter(item => 
          item.tags && item.tags.some(tag => selectedTags.value.includes(tag))
        )
      }

      // Filter by SP cost range
      if (spCostRange.min !== null || spCostRange.max !== null) {
        results = results.filter(item => {
          if (!item.spCost) return false
          const cost = parseInt(item.spCost)
          if (spCostRange.min !== null && cost < spCostRange.min) return false
          if (spCostRange.max !== null && cost > spCostRange.max) return false
          return true
        })
      }

      // Apply sorting
      if (sortOption.value && sortOption.value !== 'name_asc') {
        const [statType, direction] = sortOption.value.split('_')
        const isAsc = direction === 'asc'
        
        if (statType === 'name') {
          results.sort((a, b) => {
            const nameA = a.name || ''
            const nameB = b.name || ''
            return isAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
          })
        } else {
          // Stat-based sorting
          results.sort((a, b) => {
            const valueA = a.stats?.[statType] || 0
            const valueB = b.stats?.[statType] || 0
            return isAsc ? valueA - valueB : valueB - valueA
          })
        }
      } else {
        // Default name ascending sort
        results.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      }

      return results
    })

    const paginatedResults = computed(() => {
      const start = 0
      const end = pageSize.value
      return filteredResults.value.slice(start, end)
    })

    const skillResults = computed(() => 
      filteredResults.value.filter(item => item.type === 'skills')
    )

    const accessoryResults = computed(() => 
      filteredResults.value.filter(item => item.type === 'accessories')
    )

    const exportMenuItems = [
      {
        label: 'Export as JSON',
        icon: 'pi pi-file',
        command: () => exportResults('json')
      },
      {
        label: 'Export as CSV', 
        icon: 'pi pi-table',
        command: () => exportResults('csv')
      },
      {
        label: 'Export as Markdown',
        icon: 'pi pi-book',
        command: () => exportResults('markdown')
      }
    ]

    // Methods
    const loadData = async () => {
      isLoading.value = true
      try {
        await characterStore.loadCharacters()
        await characterStore.loadAccessories()
        
        // Extract all skills from characters using skills_full (comprehensive data)
        allSkills.value = []
        if (characterStore.characters) {
          characterStore.characters.forEach(character => {
            // Use skills_full structure which has complete skill categorization
            if (!character.skills_full) return
            
            // Helper function to validate skills (filter out junk/artifacts)
            const isValidSkill = (skill) => {
              if (!skill || !skill.name) return false
              
              const name = skill.name
              const description = skill.description || ''
              
              // Skip extraction artifacts and invalid patterns
              const invalidPatterns = [
                /^Lv\.\d+/,           // "Lv.88", "Lv.96"
                /^Lv\.\d+\s*\|/,      // "Lv.88 |"  
                /^\(/,                // "("
                /^\)/,                // ")"
                /^\|/,                // "|"
                /^\d+\s*\|/,          // "88 |"
                /^[\|\(\)\s]+$/,      // Only symbols and spaces
                /^twice per battle$/, // Extraction artifacts
                /^once per battle$/,  // Extraction artifacts
              ]
              
              for (const pattern of invalidPatterns) {
                if (pattern.test(name)) return false
              }
              
              // Skip skills without proper descriptions
              if (!description || description.length < 5) return false
              if (['(', ')', '|', 'N/A', 'No stats'].includes(description)) return false
              
              return true
            }
            
            // Helper function to process skills by type
            const processSkills = (skillArray, skillType, categoryName) => {
              if (!skillArray || !Array.isArray(skillArray)) return
              
              skillArray.forEach(skill => {
                // Filter out invalid/junk skills
                if (!isValidSkill(skill)) return
                
                allSkills.value.push({
                  id: `${character.id}-${categoryName}-${skill.name}`,
                  type: 'skills',
                  name: skill.name,
                  effects: skill.description || '',
                  notes: skill.notes || skill.skill_notes || '',
                  description: skill.description || '',
                  skillType: skillType,
                  spCost: skill.sp_cost,
                  tier: character.tierRatings?.gl?.tier || null,
                  stats: null,
                  tags: skill.tags || [],
                  character: character // Include full character reference for filtering
                })
              })
            }
            
            // Process each skill category
            processSkills(character.skills_full.battle, 'active', 'battle')
            processSkills(character.skills_full.passive, 'passive', 'passive')
            processSkills(character.skills_full.ultimate, 'ultimate', 'ultimate')
            processSkills(character.skills_full.ex_skills, 'ex', 'ex')
            processSkills(character.skills_full.blessing_of_lantern, 'blessing', 'blessing')
          })
        }

        // Load accessories from accessories.json
        allAccessories.value = []
        try {
          const response = await fetch(paths.data('accessories.json'))
          const accessoriesData = await response.json()
          
          if (accessoriesData.accessories) {
            Object.values(accessoriesData.accessories).forEach(accessory => {
              allAccessories.value.push({
                id: accessory.id,
                type: 'accessories',
                name: accessory.name || 'Unknown Accessory',
                effects: accessory.effects?.map(e => e.description || e).join('; ') || '',
                notes: accessory.tier_explanation || accessory.notes || '',
                description: accessory.effects?.map(e => e.description || e).join('; ') || accessory.tier_explanation || '', // Keep for backward compatibility
                accessoryType: accessory.accessory_type || 'normal', // Use database value
                tier: accessory.tier || null,
                stats: accessory.stats || {},
                tags: accessory.tags || [],
                character: null // Normal accessories are not character-specific
              })
            })
          }
        } catch (error) {
          console.error('Error loading accessories data:', error)
        }


        // Also extract A4 accessories from characters
        if (characterStore.characters) {
          characterStore.characters.forEach(character => {
            // Extract A4 accessory (awakening type)
            if (character.a4_accessory) {
              const accessory = character.a4_accessory
              
              allAccessories.value.push({
                id: `${character.id}-${accessory.id || accessory.name}`,
                type: 'accessories',
                name: accessory.name || 'Unknown Accessory',
                effects: accessory.effects?.map(e => e.description || e).join('; ') || '',
                notes: accessory.notes || accessory.tier_explanation || '',
                description: accessory.effects?.map(e => e.description || e).join('; ') || '', // Keep for backward compatibility
                accessoryType: 'awakening', // A4 accessories are awakening type
                tier: accessory.tier || character.tierRatings?.gl?.tier || null,
                stats: accessory.stats || {},
                tags: accessory.tags || [],
                character: character // Include full character reference for filtering
              })
            }
            
            // Extract exclusive accessory (separate from A4)
            if (character.exclusive_accessory) {
              const accessory = character.exclusive_accessory
              
              allAccessories.value.push({
                id: `${character.id}-exclusive-${accessory.id || accessory.name}`,
                type: 'accessories',
                name: accessory.name || 'Unknown Exclusive Accessory',
                effects: accessory.effects?.map(e => e.description || e).join('; ') || '',
                notes: accessory.notes || accessory.tier_explanation || '',
                description: accessory.effects?.map(e => e.description || e).join('; ') || '',
                accessoryType: 'exclusive', // Exclusive accessories
                tier: accessory.tier || character.tierRatings?.gl?.tier || null,
                stats: accessory.stats || {},
                tags: accessory.tags || [],
                character: character // Include full character reference for filtering
              })
            }
          })
        }

      } catch (error) {
        console.error('Error loading data:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load data',
          life: 3000
        })
      } finally {
        isLoading.value = false
      }
    }

    // Parse search query into structured filters
    const parseSearchQuery = (query) => {
      const filters = {
        text: [],
        tags: [],
        types: [],
        characters: [],
        spRange: null,
        tier: null,
        job: null
      }
      
      if (!query) return filters
      
      // Match operator:value patterns
      const operatorRegex = /(tag|type|character|sp|tier|job):([^\s]+)/gi
      let remainingQuery = query
      
      // Extract operators
      let match
      while ((match = operatorRegex.exec(query)) !== null) {
        const [full, operator, value] = match
        const op = operator.toLowerCase()
        
        switch (op) {
          case 'tag':
            filters.tags.push(value.toLowerCase())
            break
          case 'type':
            filters.types.push(value.toLowerCase())
            break
          case 'character':
            filters.characters.push(value.toLowerCase())
            break
          case 'job':
            filters.job = value.toLowerCase()
            break
          case 'tier':
            filters.tier = value.toUpperCase()
            break
          case 'sp':
            // Handle sp:>30, sp:<50, sp:20-40, sp:30
            if (value.includes('-')) {
              const [min, max] = value.split('-').map(v => parseInt(v))
              filters.spRange = { min, max }
            } else if (value.startsWith('>')) {
              filters.spRange = { min: parseInt(value.slice(1)) + 1 }
            } else if (value.startsWith('<')) {
              filters.spRange = { max: parseInt(value.slice(1)) - 1 }
            } else {
              const sp = parseInt(value)
              filters.spRange = { min: sp, max: sp }
            }
            break
        }
        
        // Remove operator from remaining query
        remainingQuery = remainingQuery.replace(full, '').trim()
      }
      
      // Remaining text is general search
      if (remainingQuery) {
        filters.text = remainingQuery.toLowerCase().split(/\s+/).filter(Boolean)
      }
      
      return filters
    }

    const performSearch = () => {
      const query = searchQuery.value.trim()
      const results = []
      
      // If no search query, show all results
      const showAll = !query
      const searchFilters = showAll ? null : parseSearchQuery(query)

      // Search skills
      if (selectedContentTypes.value.includes('skills')) {
        allSkills.value.forEach(skill => {
          if (showAll || matchesSearchFilters(skill, searchFilters)) {
            results.push(skill)
          }
        })
      }

      // Search accessories
      if (selectedContentTypes.value.includes('accessories')) {
        allAccessories.value.forEach(accessory => {
          if (showAll || matchesSearchFilters(accessory, searchFilters)) {
            results.push(accessory)
          }
        })
      }

      searchResults.value = results
    }

    const matchesSearchFilters = (item, filters) => {
      if (!filters) return true
      
      // Check tag filters
      if (filters.tags.length > 0) {
        const itemTags = (item.tags || []).map(tag => tag.toLowerCase())
        if (!filters.tags.some(tag => itemTags.includes(tag))) {
          return false
        }
      }
      
      // Check type filters
      if (filters.types.length > 0) {
        const itemType = (item.type || '').toLowerCase()
        if (!filters.types.includes(itemType)) {
          return false
        }
      }
      
      // Check character filters
      if (filters.characters.length > 0) {
        const characterName = (item.character?.name || '').toLowerCase()
        if (!filters.characters.some(char => characterName.includes(char))) {
          return false
        }
      }
      
      // Check job filter
      if (filters.job) {
        const itemJob = (item.character?.job || '').toLowerCase()
        if (itemJob !== filters.job) {
          return false
        }
      }
      
      // Check tier filter
      if (filters.tier) {
        const itemTier = item.character?.tierRatings?.gl?.tier
        if (itemTier !== filters.tier) {
          return false
        }
      }
      
      // Check SP range filter
      if (filters.spRange && item.spCost) {
        const sp = parseInt(item.spCost)
        if (isNaN(sp)) return false
        
        if (filters.spRange.min !== undefined && sp < filters.spRange.min) {
          return false
        }
        if (filters.spRange.max !== undefined && sp > filters.spRange.max) {
          return false
        }
      }
      
      // Check text search (general search terms)
      if (filters.text.length > 0) {
        const searchFields = [
          item.name,
          item.description,
          item.character?.name,
          ...(item.tags || [])
        ].filter(Boolean).map(field => field.toLowerCase())
        
        // All text terms must match somewhere
        const allTextMatches = filters.text.every(term => 
          searchFields.some(field => field.includes(term))
        )
        
        if (!allTextMatches) {
          return false
        }
      }
      
      return true
    }

    const clearSearch = () => {
      searchQuery.value = ''
      performSearch() // Show all results when search is cleared
    }

    const clearAllFilters = () => {
      // Clear search query
      searchQuery.value = ''
      
      // Reset all filter selections
      selectedContentTypes.value = getInitialContentTypes()
      selectedSkillTypes.value = []
      selectedAccessoryTypes.value = []
      selectedTags.value = []
      spCostRange.min = null
      spCostRange.max = null
      searchMode.value = 'any'
      sortOption.value = 'name_asc'  // Reset sort to default
      
      
      // Hide advanced filters
      showAdvancedFilters.value = false
      
      // Perform search to show all results
      performSearch()
    }

    const hasActiveFilters = computed(() => {
      return searchQuery.value !== '' ||
             selectedSkillTypes.value.length > 0 ||
             selectedAccessoryTypes.value.length > 0 ||
             selectedTags.value.length > 0 ||
             spCostRange.min !== null ||
             spCostRange.max !== null ||
             searchMode.value !== 'any' ||
             (selectedContentTypes.value.length > 0 && selectedContentTypes.value.length < contentTypeOptions.length)
    })

    const getTypeSeverity = (type) => {
      return type === 'skills' ? 'info' : 'success'
    }

    const getTypeIcon = (type) => {
      return type === 'skills' ? 'pi pi-flash' : 'pi pi-shield'
    }

    const getSkillTypeSeverity = (skillType) => {
      if (!skillType) return 'secondary'
      const type = skillType.toLowerCase()
      
      switch (type) {
        case 'ultimate': return 'danger'
        case 'ex': return 'warning'
        case 'blessing': return 'info'
        case 'active': return 'success'
        case 'passive': return 'secondary'
        default: return 'secondary'
      }
    }

    const getSkillTypeIcon = (skillType) => {
      if (!skillType) return null
      const type = skillType.toLowerCase()
      
      switch (type) {
        case 'ultimate': return 'pi pi-star-fill'
        case 'ex': return 'pi pi-bolt'
        case 'blessing': return 'pi pi-heart-fill'
        case 'active': return 'pi pi-play'
        case 'passive': return 'pi pi-circle'
        default: return 'pi pi-question'
      }
    }

    // Combined type functions for the unified column
    const getCombinedTypeDisplay = (data) => {
      if (data.type === 'skills') {
        const skillType = data.skillType ? data.skillType : 'Unknown'
        return `Skills > ${skillType}`
      } else if (data.type === 'accessories') {
        const accessoryType = data.accessoryType ? data.accessoryType : 'General'
        // Use shorter format for accessories
        if (accessoryType.toLowerCase() === 'awakening' || accessoryType.toLowerCase() === 'a4') {
          return 'Acc. > A4'
        } else if (accessoryType.toLowerCase() === 'regular' || accessoryType.toLowerCase() === 'general') {
          return 'Acc. > Regular'
        }
        return `Acc. > ${accessoryType}`
      }
      return data.type
    }

    const getCombinedTypeSeverity = (data) => {
      if (data.type === 'skills') {
        return getSkillTypeSeverity(data.skillType)
      } else if (data.type === 'accessories') {
        const accessoryType = data.accessoryType ? data.accessoryType : 'General'
        // Different colors for different accessory types
        if (accessoryType.toLowerCase() === 'awakening' || accessoryType.toLowerCase() === 'a4') {
          return 'warning' // Orange for A4 accessories
        } else if (accessoryType.toLowerCase() === 'exclusive') {
          return 'danger' // Red for Exclusive accessories  
        } else {
          return 'secondary' // Gray/no color for Regular accessories (like passive)
        }
      }
      return getTypeSeverity(data.type)
    }

    const getCombinedTypeIcon = (data) => {
      if (data.type === 'skills') {
        return getSkillTypeIcon(data.skillType) || 'pi pi-flash'
      } else if (data.type === 'accessories') {
        return 'pi pi-shield'
      }
      return getTypeIcon(data.type)
    }

    // Multi-line type display functions
    const getMainType = (data) => {
      if (data.type === 'skills') {
        return 'Skills'
      } else if (data.type === 'accessories') {
        return 'Acc.'
      }
      return data.type
    }

    const getSubType = (data) => {
      if (data.type === 'skills') {
        return data.skillType ? data.skillType : 'Unknown'
      } else if (data.type === 'accessories') {
        const accessoryType = data.accessoryType ? data.accessoryType : 'General'
        if (accessoryType.toLowerCase() === 'awakening' || accessoryType.toLowerCase() === 'a4') {
          return 'A4'
        } else if (accessoryType.toLowerCase() === 'regular' || accessoryType.toLowerCase() === 'general') {
          return 'Regular'
        }
        return accessoryType
      }
      return ''
    }

    const getTierSeverity = (tier) => {
      if (!tier) return 'secondary'
      const tierUpper = tier.toString().toUpperCase()
      
      if (tierUpper.includes('S+') || tierUpper.includes('SS')) return 'danger'
      if (tierUpper.includes('S')) return 'warning'
      if (tierUpper.includes('A')) return 'success'
      if (tierUpper.includes('B')) return 'info'
      if (tierUpper.includes('C') || tierUpper.includes('D')) return 'secondary'
      
      // For numeric ratings
      const numericTier = parseInt(tier)
      if (!isNaN(numericTier)) {
        if (numericTier >= 9) return 'danger'
        if (numericTier >= 7) return 'warning'
        if (numericTier >= 5) return 'success'
        if (numericTier >= 3) return 'info'
        return 'secondary'
      }
      
      return 'secondary'
    }

    const getStatIcon = (statType) => {
      if (!statType || typeof statType !== 'string') return null
      
      const statMap = {
        // Database stat names to wiki-icons (new approach)
        'patk': 'Buff_Phys._Atk._Up.png',
        'eatk': 'Buff_Elem._Atk._Up.png',
        'pdef': 'Buff_Phys._Def._Up.png',
        'edef': 'Buff_Elem._Def._Up.png',
        'crit': 'Buff_Crit._Up.png',
        'spd': 'Buff_Spd._Up.png',
        'speed': 'Buff_Spd._Up.png',
        'sp': 'Buff_SP_Stock.png',
        'hp': 'Buff_HP_Barrier.png',
        // Alternative names
        'physical_attack': 'Buff_Phys._Atk._Up.png',
        'elemental_attack': 'Buff_Elem._Atk._Up.png',
        'physical_defense': 'Buff_Phys._Def._Up.png',
        'elemental_defense': 'Buff_Elem._Def._Up.png',
        'critical': 'Buff_Crit._Up.png',
        'phys_atk': 'Buff_Phys._Atk._Up.png',
        'elem_atk': 'Buff_Elem._Atk._Up.png',
        'phys_def': 'Buff_Phys._Def._Up.png',
        'elem_def': 'Buff_Elem._Def._Up.png'
      }
      
      const normalizedStat = statType.toLowerCase().replace(/\s+/g, '_')
      const iconFile = statMap[normalizedStat]
      return iconFile ? paths.images(`wiki-icons/${iconFile}`) : null
    }

    const formatStatValue = (value) => {
      if (!value) return ''
      if (typeof value === 'number') {
        return value > 0 ? `+${value}` : value.toString()
      }
      return value.toString()
    }

    const getStatTooltip = (stat) => {
      const name = stat.type || stat.name || 'Unknown'
      const value = formatStatValue(stat.value || stat.amount)
      return `${name}: ${value}`
    }


    const viewDetails = (item) => {
      selectedItem.value = item
      showDetailsModal.value = true
    }

    const copyToClipboard = async (item) => {
      const text = `${item.name}: ${item.description}`
      try {
        await navigator.clipboard.writeText(text)
        toast.add({
          severity: 'success',
          summary: 'Copied',
          detail: 'Item information copied to clipboard',
          life: 2000
        })
      } catch (error) {
        console.error('Failed to copy:', error)
      }
    }

    const toggleTagFilter = (tag) => {
      const index = selectedTags.value.indexOf(tag)
      if (index > -1) {
        // Remove tag if already selected
        selectedTags.value.splice(index, 1)
      } else {
        // Add tag if not selected
        selectedTags.value.push(tag)
      }
      
      // Auto-show active filters when tag is selected
      if (selectedTags.value.length > 0) {
        showDetailsModal.value = false
      }
      
      // Provide user feedback
      toast.add({
        severity: 'info',
        summary: 'Filter Updated',
        detail: `${selectedTags.value.includes(tag) ? 'Added' : 'Removed'} tag filter: ${tag}`,
        life: 2000
      })
    }


    const openCharacterModal = (character) => {
      characterStore.openCharacterModal(character)
    }

    const toggleExportMenu = (event) => {
      exportMenu.value.toggle(event)
    }

    const exportResults = (format) => {
      const data = filteredResults.value
      let content = ''
      let filename = `search-results-${new Date().toISOString().split('T')[0]}`

      switch (format) {
        case 'json':
          content = JSON.stringify(data, null, 2)
          filename += '.json'
          break
        case 'csv':
          const headers = ['Type', 'Name', 'Description', 'Character', 'Tags']
          const rows = data.map(item => [
            item.type,
            item.name,
            item.description,
            item.character?.name || '',
            (item.tags || []).join('; ')
          ])
          content = [headers, ...rows].map(row => 
            row.map(cell => `"${cell}"`).join(',')
          ).join('\n')
          filename += '.csv'
          break
        case 'markdown':
          content = '# Search Results\n\n'
          content += `Found ${data.length} results\n\n`
          data.forEach(item => {
            content += `## ${item.name}\n\n`
            content += `**Type:** ${item.type}\n\n`
            content += `**Description:** ${item.description}\n\n`
            if (item.character) {
              content += `**Character:** ${item.character.name}\n\n`
            }
            if (item.tags && item.tags.length) {
              content += `**Tags:** ${item.tags.join(', ')}\n\n`
            }
            content += '---\n\n'
          })
          filename += '.md'
          break
      }

      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)

      toast.add({
        severity: 'success',
        summary: 'Exported',
        detail: `Results exported as ${format.toUpperCase()}`,
        life: 3000
      })
    }

    // Watchers
    watch(searchQuery, () => {
      performSearch() // Always call performSearch - it handles empty queries correctly
    })

    // Watch for props changes (route changes) and reinitialize content types
    watch(() => props.defaultContentType, (newContentType) => {
      selectedContentTypes.value = getInitialContentTypes()
      performSearch() // Reload search with new content type filter
    })

    // Lifecycle
    onMounted(() => {
      console.log('UnifiedSearchPage onMounted called')
      loadData().then(() => {
        console.log('loadData completed')
        console.log('allSkills.value length after load:', allSkills.value?.length)
        console.log('allAccessories.value length after load:', allAccessories.value?.length)
        console.log('availableTags computed:', availableTags.value)
        performSearch() // Show all results by default when page loads
      }).catch(error => {
        console.error('Error loading data:', error)
      })
    })

    const setSearchExample = (example) => {
      searchQuery.value = example
      performSearch()
    }

    return {
      // State
      searchQuery,
      isLoading,
      showAdvancedFilters,
      showDetailsModal,
      selectedItem,
      pageSize,
      exportMenu,
      
      // Filters
      selectedContentTypes,
      selectedSkillTypes,
      selectedAccessoryTypes,
      selectedTags,
      spCostRange,
      searchMode,
      sortOption,
      
      // Data
      searchResults,
      
      // Options
      contentTypeOptions,
      searchModeOptions,
      pageSizeOptions,
      sortOptions,
      skillTypeOptions,
      accessoryTypeOptions,
      
      // Computed
      totalCharacters,
      totalSkills,
      totalAccessories,
      availableTags,
      pageTitle,
      pageSubtitle,
      filteredResults,
      paginatedResults,
      skillResults,
      accessoryResults,
      exportMenuItems,
      
      // Methods
      performSearch,
      clearSearch,
      clearAllFilters,
      hasActiveFilters,
      setSearchExample,
      getTypeSeverity,
      getTypeIcon,
      getSkillTypeSeverity,
      getSkillTypeIcon,
      getCombinedTypeDisplay,
      getCombinedTypeSeverity,
      getCombinedTypeIcon,
      getMainType,
      getSubType,
      getTierSeverity,
      getStatIcon,
      formatStatValue,
      getStatTooltip,
      viewDetails,
      copyToClipboard,
      toggleTagFilter,
      openCharacterModal,
      toggleExportMenu,
      exportResults
    }
  }
}
</script>

<style scoped>
/* Search Hints */
.search-hints {
  margin: 0.5rem 0 1rem 0;
  padding: 0.75rem;
  background: var(--surface-50);
  border: 1px solid var(--surface-200);
  border-radius: 6px;
  font-size: 0.875rem;
}

.hints-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.hints-label {
  color: var(--text-color-secondary);
  font-weight: 500;
  margin-right: 0.5rem;
}

.hint-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.hint-example {
  background: var(--primary-50);
  color: var(--primary-600);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--primary-200);
}

.hint-example:hover {
  background: var(--primary-100);
  border-color: var(--primary-300);
  transform: translateY(-1px);
}

.hint-example:active {
  transform: translateY(0);
  background: var(--primary-200);
}

/* Sort Dropdown */
.sort-dropdown {
  min-width: 200px;
}

.unified-search-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.search-header {
  text-align: center;
  margin-bottom: 30px;
}

.search-title {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.search-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.search-controls {
  background: var(--bg-secondary);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: var(--shadow);
}

.search-input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input-group .p-input-icon-left {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
}

.search-input-group .p-input-icon-left i {
  position: absolute;
  left: 1rem;
  z-index: 1;
}

.search-input {
  width: 100%;
  font-size: 1.1rem;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
}

.clear-all-button {
  margin-left: 10px;
}

.clear-all-button:disabled {
  opacity: 0.6;
}

.quick-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-end;
  margin-bottom: 15px;
}

.advanced-filters-toggle {
  margin-top: 0.5rem;
  align-self: flex-end;
  font-size: 0.875rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.advanced-filters-panel {
  margin-top: 1rem;
  width: 100%;
}

.advanced-filters-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.filter-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sp-cost-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sp-input {
  flex: 1;
}

.range-separator {
  color: var(--text-secondary);
}

.results-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: var(--bg-secondary);
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: var(--shadow);
}

.summary-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-count {
  font-weight: 600;
  font-size: 1.1rem;
}

.summary-breakdown {
  display: flex;
  gap: 20px;
}

.breakdown-item {
  color: var(--text-secondary);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.unified-results-table {
  background: var(--bg-secondary);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow);
}

.type-tag {
  font-weight: 600;
}

.name-cell {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.item-name {
  font-weight: 600;
  color: var(--primary-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  max-width: 100%;
}

.character-link {
  display: flex;
  align-items: center;
  gap: 8px;
}

.character-portrait-inline {
  width: 24px;
  height: 24px;
}

.character-name {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.clickable-name {
  cursor: pointer;
  color: var(--primary-color);
  text-decoration: underline;
  text-decoration-style: dotted;
}

.clickable-name:hover {
  color: var(--primary-hover);
  text-decoration-style: solid;
}

.combined-type-cell {
  display: flex;
  align-items: center;
}

.type-display {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: flex-start;
}

.main-type {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  line-height: 1;
}

.sub-type {
  display: flex;
  align-items: center;
}

.sub-type-tag {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
}

.combined-type-tag {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tier-cell {
  display: flex;
  justify-content: center;
  align-items: center;
}

.tier-badge {
  font-weight: 700;
  font-size: 0.85rem;
  min-width: 40px;
  text-align: center;
}

.tier-empty {
  color: var(--text-secondary);
  font-style: italic;
}

.stats-cell {
  display: flex;
  align-items: center;
}

.stats-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 2px 4px;
  background: var(--bg-hover);
  border-radius: 4px;
  font-size: 0.75rem;
}

.stat-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.stat-icon-placeholder {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  background: var(--text-tertiary);
  border: 1px dashed var(--text-tertiary);
  border-radius: 2px;
  display: inline-block;
  opacity: 0.5;
}

.stat-value {
  font-weight: 600;
  color: var(--primary-color);
  font-size: 0.7rem;
}

.more-stats {
  color: var(--text-secondary);
  font-size: 0.7rem;
  font-style: italic;
}

.stats-empty {
  color: var(--text-secondary);
  font-style: italic;
}

.description-cell,
.effects-cell,
.notes-cell {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.description-text,
.effects-text,
.notes-text {
  margin: 0;
  line-height: 1.4;
  font-size: 0.9rem;
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  overflow-wrap: break-word;
  hyphens: auto;
}

.effects-text {
  font-weight: 500;
}

.notes-text {
  font-style: italic;
  color: var(--text-secondary);
}

.tags-container {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.skill-tag {
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.skill-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.skill-tag.selected-tag {
  background-color: var(--primary-color) !important;
  color: white !important;
}

.more-tags-indicator {
  font-size: 0.75rem;
}

.details-cell {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.action-buttons {
  display: flex;
  gap: 5px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 3rem;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.empty-title {
  margin-bottom: 10px;
  color: var(--text-primary);
}

.empty-message {
  color: var(--text-secondary);
  margin: 0;
}

.details-modal .detail-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.header-tags {
  display: flex;
  gap: 8px;
  align-items: center;
}

.skill-type-tag-large {
  font-size: 0.9rem;
}

.type-tag-large {
  font-size: 1rem;
}

.item-title {
  margin: 0;
  color: var(--primary-color);
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.detail-content h3 {
  margin: 0 0 10px 0;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 5px;
}

.full-description {
  margin: 0;
  line-height: 1.6;
}

.tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.detail-tag {
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.detail-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.detail-tag.selected-tag {
  background-color: var(--primary-color) !important;
  color: white !important;
}

.metadata-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.metadata-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stats-section .stats-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.stats-section .stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: var(--bg-hover);
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
}

.stats-section .stat-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.stats-section .stat-value {
  color: var(--text-primary);
}

/* PrimeVue DataTable Text Wrapping */
.unified-results-table :deep(.p-datatable-tbody > tr > td) {
  white-space: normal !important;
  word-wrap: break-word !important;
  overflow-wrap: break-word !important;
  vertical-align: top !important;
}

/* PrimeVue DataTable Dark Mode Overrides */
.unified-results-table :deep(.p-datatable-thead > tr > th) {
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

.unified-results-table :deep(.p-datatable-tbody > tr) {
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

.unified-results-table :deep(.p-datatable-tbody > tr:nth-child(even)) {
  background: var(--bg-primary) !important;
}

.unified-results-table :deep(.p-datatable-tbody > tr:hover) {
  background: var(--bg-hover) !important;
}

.unified-results-table :deep(.p-datatable-tbody > tr.p-highlight) {
  background: var(--primary-color) !important;
  color: white !important;
}

.unified-results-table :deep(.p-paginator) {
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

.unified-results-table :deep(.p-paginator .p-paginator-pages .p-paginator-page) {
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

.unified-results-table :deep(.p-paginator .p-paginator-pages .p-paginator-page:hover) {
  background: var(--bg-hover) !important;
}

.unified-results-table :deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background: var(--primary-color) !important;
  color: white !important;
}

/* PrimeVue Input/Select Dark Mode Overrides */
.search-controls :deep(.p-inputtext) {
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

.search-controls :deep(.p-select) {
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

.search-controls :deep(.p-select .p-select-label) {
  color: var(--text-primary) !important;
}

.search-controls :deep(.p-select-overlay) {
  background: var(--bg-secondary) !important;
  border-color: var(--border-color) !important;
}

.search-controls :deep(.p-select-overlay .p-select-option) {
  color: var(--text-primary) !important;
}

.search-controls :deep(.p-select-overlay .p-select-option:hover) {
  background: var(--bg-hover) !important;
}

.search-controls :deep(.p-selectbutton .p-button) {
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

.search-controls :deep(.p-selectbutton .p-button:hover) {
  background: var(--bg-hover) !important;
}

.search-controls :deep(.p-selectbutton .p-button.p-highlight) {
  background: var(--primary-color) !important;
  color: white !important;
}

/* PrimeVue Panel Dark Mode Overrides */
:deep(.p-panel) {
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

:deep(.p-panel .p-panel-header) {
  background: var(--bg-primary) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

:deep(.p-panel .p-panel-content) {
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

:deep(.p-panel .p-panel-header .p-panel-title) {
  color: var(--text-primary) !important;
}

:deep(.p-panel .p-panel-header .p-panel-header-icon) {
  color: var(--text-secondary) !important;
}

/* PrimeVue InputNumber Dark Mode Overrides */
.search-controls :deep(.p-inputnumber),
.search-controls :deep(.p-inputnumber .p-inputnumber-input) {
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

/* PrimeVue Button Dark Mode Overrides */
.search-controls :deep(.p-button:not(.p-highlight):not(.p-button-text)) {
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

.search-controls :deep(.p-button:not(.p-highlight):not(.p-button-text):hover) {
  background: var(--bg-hover) !important;
}

/* PrimeVue Tag Input/Chips Dark Mode Overrides */
.search-controls :deep(.p-chips) {
  background: var(--bg-secondary) !important;
  border-color: var(--border-color) !important;
}

.search-controls :deep(.p-chips .p-chips-multiple-container) {
  background: var(--bg-secondary) !important;
}

.search-controls :deep(.p-chips .p-chips-token) {
  background: var(--primary-color) !important;
  color: white !important;
}

.search-controls :deep(.p-chips .p-chips-input-token input) {
  background: transparent !important;
  color: var(--text-primary) !important;
}

/* PrimeVue AutoComplete Dark Mode Overrides */
.search-controls :deep(.p-autocomplete),
.search-controls :deep(.p-autocomplete .p-autocomplete-input) {
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

.search-controls :deep(.p-autocomplete-overlay) {
  background: var(--bg-secondary) !important;
  border-color: var(--border-color) !important;
}

.search-controls :deep(.p-autocomplete-overlay .p-autocomplete-item) {
  color: var(--text-primary) !important;
}

.search-controls :deep(.p-autocomplete-overlay .p-autocomplete-item:hover) {
  background: var(--bg-hover) !important;
}

.search-controls :deep(.p-autocomplete-overlay .p-autocomplete-item.p-highlight) {
  background: var(--primary-color) !important;
  color: white !important;
}

/* PrimeVue Tag/Badge Dark Mode Overrides for Table */
.unified-results-table :deep(.p-tag) {
  background: var(--primary-color) !important;
  color: white !important;
}

.unified-results-table :deep(.p-tag.p-tag-info) {
  background: var(--info-color) !important;
  color: white !important;
}

.unified-results-table :deep(.p-tag.p-tag-success) {
  background: var(--success-color) !important;
  color: white !important;
}

.unified-results-table :deep(.p-tag.p-tag-warning) {
  background: var(--warning-color) !important;
  color: white !important;
}

.unified-results-table :deep(.p-tag.p-tag-danger) {
  background: var(--danger-color) !important;
  color: white !important;
}

.unified-results-table :deep(.p-tag.p-tag-secondary) {
  background: var(--text-secondary) !important;
  color: var(--bg-secondary) !important;
}

/* PrimeVue Badge Dark Mode Overrides */
:deep(.p-badge) {
  background: var(--primary-color) !important;
  color: white !important;
}

:deep(.p-badge.p-badge-info) {
  background: var(--info-color) !important;
}

:deep(.p-badge.p-badge-success) {
  background: var(--success-color) !important;
}

:deep(.p-badge.p-badge-warning) {
  background: var(--warning-color) !important;
}

:deep(.p-badge.p-badge-danger) {
  background: var(--danger-color) !important;
}

:deep(.p-badge.p-badge-secondary) {
  background: var(--text-secondary) !important;
  color: var(--bg-secondary) !important;
}

/* Global PrimeVue Form Field Dark Mode Overrides */
:deep(.p-multiselect),
:deep(.p-multiselect .p-multiselect-label),
:deep(.p-multiselect .p-multiselect-trigger) {
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

:deep(.p-multiselect-panel) {
  background: var(--bg-secondary) !important;
  border-color: var(--border-color) !important;
}

:deep(.p-multiselect-panel .p-multiselect-item) {
  color: var(--text-primary) !important;
}

:deep(.p-multiselect-panel .p-multiselect-item:hover) {
  background: var(--bg-hover) !important;
}

:deep(.p-multiselect-panel .p-multiselect-item.p-highlight) {
  background: var(--primary-color) !important;
  color: white !important;
}

/* Ensure all overlays and dropdowns are dark themed */
:deep(.p-component-overlay),
:deep(.p-overlaypanel),
:deep(.p-tooltip) {
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

:deep(.p-tooltip .p-tooltip-text) {
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
}

/* Toggle Switch Dark Mode */
:deep(.p-toggleswitch) {
  background: var(--bg-primary) !important;
}

:deep(.p-toggleswitch.p-highlight) {
  background: var(--primary-color) !important;
}

:deep(.p-toggleswitch .p-toggleswitch-slider) {
  background: var(--bg-secondary) !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-input-group .p-input-icon-left {
    min-width: 100%;
  }
  
  .quick-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-row {
    grid-template-columns: 1fr;
  }
  
  .results-summary {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .metadata-grid {
    grid-template-columns: 1fr;
  }
}
</style>