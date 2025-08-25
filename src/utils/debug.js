/**
 * Debug utility for COTC Vue application
 * Uses environment variables to control debug output
 */

// Check if we're in development environment
const isDev = import.meta.env.DEV || import.meta.env.NODE_ENV === 'development'

// Global debug flag - enabled in dev, can be overridden by localStorage
const getDebugFlag = () => {
  // Check localStorage first for runtime override
  const localStorageDebug = localStorage.getItem('cotc-debug')
  if (localStorageDebug !== null) {
    return localStorageDebug === 'true'
  }
  
  // Fall back to environment (enabled in dev)
  return isDev
}

// Create debug logger with different levels
const createDebugger = (namespace) => {
  const prefix = `[COTC:${namespace}]`
  
  return {
    log: (...args) => {
      if (getDebugFlag()) {
        console.log(prefix, ...args)
      }
    },
    
    warn: (...args) => {
      if (getDebugFlag()) {
        console.warn(prefix, ...args)
      }
    },
    
    error: (...args) => {
      if (getDebugFlag()) {
        console.error(prefix, ...args)
      }
    },
    
    table: (data) => {
      if (getDebugFlag()) {
        console.log(prefix)
        console.table(data)
      }
    },
    
    group: (label) => {
      if (getDebugFlag()) {
        console.group(`${prefix} ${label}`)
      }
    },
    
    groupEnd: () => {
      if (getDebugFlag()) {
        console.groupEnd()
      }
    }
  }
}

// Export debug utilities
export const debug = {
  // Component-specific debuggers
  modal: createDebugger('Modal'),
  store: createDebugger('Store'),
  table: createDebugger('Table'),
  row: createDebugger('Row'),
  filters: createDebugger('Filters'),
  
  // General debugger
  general: createDebugger('General'),
  
  // Utility functions
  isEnabled: getDebugFlag,
  enable: () => localStorage.setItem('cotc-debug', 'true'),
  disable: () => localStorage.setItem('cotc-debug', 'false'),
  
  // Performance timing
  time: (label) => {
    if (getDebugFlag()) {
      console.time(`[COTC] ${label}`)
    }
  },
  
  timeEnd: (label) => {
    if (getDebugFlag()) {
      console.timeEnd(`[COTC] ${label}`)
    }
  }
}

// Add to window for runtime debugging in production
if (typeof window !== 'undefined') {
  window.cotcDebug = debug
}

export default debug