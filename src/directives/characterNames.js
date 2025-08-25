/**
 * Vue directive for automatically detecting and making character names interactive
 * Usage: v-character-names
 */

import { useCharacterStore } from '../stores/character'

// Cache for character name patterns to avoid recalculation
let characterNamePattern = null
let characterNameMap = new Map()

// Debounced function to avoid too frequent updates
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Build character name regex pattern and mapping
const buildCharacterPatterns = () => {
  const characterStore = useCharacterStore()
  const characters = characterStore.allCharacters || []
  
  if (characters.length === 0) return
  
  // Clear existing patterns
  characterNameMap.clear()
  
  // Create name variations for each character
  const namePatterns = []
  
  characters.forEach(character => {
    if (!character.name || !character.id) return
    
    const name = character.name
    const variations = [
      name, // Full name
      name.replace(/'/g, "'"), // Handle unicode apostrophes
      name.replace(/'/g, "'"), // Handle regular apostrophes
    ]
    
    // Add EX variant handling
    if (name.includes(' EX')) {
      variations.push(name.replace(' EX', ''))
    } else {
      variations.push(name + ' EX')
    }
    
    // Store all variations in the map
    variations.forEach(variation => {
      if (variation && variation.length > 2) { // Avoid very short names
        characterNameMap.set(variation.toLowerCase(), {
          id: character.id,
          name: character.name,
          originalName: name
        })
        
        // Escape special regex characters
        const escapedName = variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        namePatterns.push(escapedName)
      }
    })
  })
  
  // Sort by length (longest first) to match longer names before shorter ones
  namePatterns.sort((a, b) => b.length - a.length)
  
  // Create regex pattern
  if (namePatterns.length > 0) {
    characterNamePattern = new RegExp(`\\b(${namePatterns.join('|')})\\b`, 'gi')
  }
}

// Process text content to add character name links
const processTextContent = (element, binding) => {
  if (!characterNamePattern) {
    buildCharacterPatterns()
  }
  
  if (!characterNamePattern) return // Still no pattern available
  
  // Get the original text content
  const originalText = element.textContent || element.innerText || ''
  if (!originalText.trim()) return
  
  // Skip if element already has character name links
  if (element.querySelector('.character-name-link')) return
  
  // Find character name matches
  const matches = []
  let match
  
  // Reset regex
  characterNamePattern.lastIndex = 0
  
  while ((match = characterNamePattern.exec(originalText)) !== null) {
    const matchedName = match[1]
    const characterData = characterNameMap.get(matchedName.toLowerCase())
    
    if (characterData) {
      matches.push({
        text: matchedName,
        start: match.index,
        end: match.index + matchedName.length,
        character: characterData
      })
    }
  }
  
  // If no matches found, return
  if (matches.length === 0) return
  
  // Sort matches by start position (reverse order for easier replacement)
  matches.sort((a, b) => b.start - a.start)
  
  // Create new HTML with character name links
  let newHTML = originalText
  
  matches.forEach(match => {
    const { text, start, end, character } = match
    
    // Create character link element
    const linkHTML = `<span class="character-name-link" 
                           data-character-id="${character.id}"
                           data-character-name="${character.name}"
                           title="Click to view ${character.name}"
                           style="
                             color: var(--primary-color);
                             cursor: pointer;
                             text-decoration: underline;
                             text-decoration-style: dotted;
                             position: relative;
                           ">
                        ${text}
                      </span>`
    
    // Replace the matched text with the link
    newHTML = newHTML.slice(0, start) + linkHTML + newHTML.slice(end)
  })
  
  // Update element HTML
  element.innerHTML = newHTML
  
  // Add click event listeners to character name links
  const characterLinks = element.querySelectorAll('.character-name-link')
  characterLinks.forEach(link => {
    link.addEventListener('click', handleCharacterNameClick)
    link.addEventListener('mouseenter', handleCharacterNameHover)
    link.addEventListener('mouseleave', handleCharacterNameLeave)
  })
}

// Handle character name click
const handleCharacterNameClick = (event) => {
  event.preventDefault()
  event.stopPropagation()
  
  const characterId = event.target.dataset.characterId
  const characterName = event.target.dataset.characterName
  
  if (characterId) {
    const characterStore = useCharacterStore()
    characterStore.openCharacterModal(characterId)
    
    // Optional: emit custom event for tracking
    event.target.dispatchEvent(new CustomEvent('character-name-clicked', {
      detail: { characterId, characterName },
      bubbles: true
    }))
  }
}

// Handle character name hover (show portrait preview)
let hoverTimeout = null
let currentPortraitPreview = null

const handleCharacterNameHover = (event) => {
  clearTimeout(hoverTimeout)
  
  hoverTimeout = setTimeout(() => {
    const characterId = event.target.dataset.characterId
    const characterName = event.target.dataset.characterName
    
    if (characterId && !currentPortraitPreview) {
      showPortraitPreview(event.target, characterId, characterName)
    }
  }, 500) // Show preview after 500ms hover
}

const handleCharacterNameLeave = (event) => {
  clearTimeout(hoverTimeout)
  
  setTimeout(() => {
    if (currentPortraitPreview) {
      hidePortraitPreview()
    }
  }, 200) // Small delay to allow moving to preview
}

// Show character portrait preview
const showPortraitPreview = (linkElement, characterId, characterName) => {
  // Create preview element
  const preview = document.createElement('div')
  preview.className = 'character-name-preview'
  preview.innerHTML = `
    <div class="preview-content">
      <div class="preview-portrait">
        <img src="/images/characters/portraits/${characterId}.png" 
             alt="${characterName}"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
             style="width: 60px; height: 60px; object-fit: cover; border-radius: 50%; border: 2px solid var(--primary-color);">
        <div style="display: none; width: 60px; height: 60px; border-radius: 50%; background: var(--primary-200); color: var(--primary-800); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem;">
          ${characterName.split(' ').map(n => n[0]).join('').substring(0, 2)}
        </div>
      </div>
      <div class="preview-info">
        <div class="preview-name">${characterName}</div>
        <div class="preview-hint">Click to view details</div>
      </div>
    </div>
  `
  
  // Style the preview
  Object.assign(preview.style, {
    position: 'absolute',
    background: 'var(--surface-overlay)',
    border: '1px solid var(--surface-border)',
    borderRadius: '8px',
    padding: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: '10000',
    minWidth: '200px',
    fontSize: '0.9rem'
  })
  
  // Position the preview
  const rect = linkElement.getBoundingClientRect()
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  
  preview.style.top = (rect.bottom + scrollTop + 5) + 'px'
  preview.style.left = (rect.left + scrollLeft) + 'px'
  
  // Add CSS for preview content
  const style = document.createElement('style')
  style.textContent = `
    .character-name-preview .preview-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .character-name-preview .preview-name {
      font-weight: 600;
      color: var(--primary-color);
      margin-bottom: 4px;
    }
    .character-name-preview .preview-hint {
      font-size: 0.8rem;
      color: var(--text-color-secondary);
    }
    .character-name-preview {
      animation: fadeInUp 0.2s ease-out;
    }
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `
  
  // Add to DOM
  document.head.appendChild(style)
  document.body.appendChild(preview)
  
  // Store reference
  currentPortraitPreview = { element: preview, style }
  
  // Auto-hide after 3 seconds if not interacted with
  setTimeout(() => {
    if (currentPortraitPreview?.element === preview) {
      hidePortraitPreview()
    }
  }, 3000)
}

// Hide character portrait preview
const hidePortraitPreview = () => {
  if (currentPortraitPreview) {
    currentPortraitPreview.element.remove()
    currentPortraitPreview.style.remove()
    currentPortraitPreview = null
  }
}

// Debounced process function
const debouncedProcess = debounce(processTextContent, 100)

// Vue directive definition
export const characterNamesDirective = {
  // When element is mounted
  mounted(el, binding) {
    // Wait for next tick to ensure DOM is ready
    setTimeout(() => {
      processTextContent(el, binding)
    }, 0)
  },
  
  // When element is updated
  updated(el, binding) {
    // Clear existing character links first
    const existingLinks = el.querySelectorAll('.character-name-link')
    existingLinks.forEach(link => {
      link.removeEventListener('click', handleCharacterNameClick)
      link.removeEventListener('mouseenter', handleCharacterNameHover)
      link.removeEventListener('mouseleave', handleCharacterNameLeave)
    })
    
    // Restore original text content and reprocess
    debouncedProcess(el, binding)
  },
  
  // When element is unmounted
  beforeUnmount(el) {
    // Clean up event listeners
    const characterLinks = el.querySelectorAll('.character-name-link')
    characterLinks.forEach(link => {
      link.removeEventListener('click', handleCharacterNameClick)
      link.removeEventListener('mouseenter', handleCharacterNameHover)
      link.removeEventListener('mouseleave', handleCharacterNameLeave)
    })
    
    // Hide any active preview
    if (currentPortraitPreview) {
      hidePortraitPreview()
    }
  }
}

// Function to manually rebuild patterns (useful when character data changes)
export const rebuildCharacterPatterns = () => {
  characterNamePattern = null
  characterNameMap.clear()
  buildCharacterPatterns()
}

// Function to check if character names directive is available
export const isCharacterNamesAvailable = () => {
  return characterNamePattern !== null || characterNameMap.size > 0
}

export default characterNamesDirective