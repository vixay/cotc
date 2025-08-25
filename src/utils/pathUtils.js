/**
 * Utility for handling paths with Vite's base URL
 * Automatically works in dev (/) and production (/cotc/)
 */

// Get the base URL from Vite - automatically handles dev vs production
const BASE_URL = import.meta.env.BASE_URL

/**
 * Create a path relative to the app's base URL
 * @param {string} path - Path without leading slash (e.g., 'images/character.png')
 * @returns {string} - Full path with base URL
 */
export function getAssetPath(path) {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${BASE_URL}${cleanPath}`
}

/**
 * Common asset paths - pre-configured for convenience
 */
export const paths = {
  data: (filename) => getAssetPath(`data/${filename}`),
  images: (path) => getAssetPath(`images/${path}`),
  characterPortrait: (id) => getAssetPath(`images/characters/portraits/${id}.png`),
  characterSprite: (id) => getAssetPath(`images/characters/sprites/${id}.png`),
  characterCard: (id) => getAssetPath(`images/characters/cards/${id}.png`),
  skillIcon: (path) => getAssetPath(`images/wiki-icons/${path}`),
  elementIcon: (element) => getAssetPath(`images/elements/${element}.png`),
  weaponIcon: (weapon) => getAssetPath(`images/weapons/${weapon}.png`)
}

export default { getAssetPath, paths }