#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Starting cleanup...');

// Remove dist-assets folder
try {
  fs.rmSync('dist-assets', { recursive: true, force: true });
  console.log('✅ Removed dist-assets/');
} catch (e) {
  console.log('ℹ️ dist-assets/ not found');
}

// Remove production index.html
try {
  if (fs.existsSync('index.html')) {
    const content = fs.readFileSync('index.html', 'utf8');
    if (content.includes('dist-assets')) {
      fs.unlinkSync('index.html');
      console.log('✅ Removed production index.html');
    } else {
      console.log('ℹ️ No production index.html found');
    }
  }
} catch (e) {
  console.log('ℹ️ index.html cleanup skipped');
}

// Revert index-vue.html to development state using git
try {
  const { execSync } = require('child_process');
  
  // Check if index-vue.html has been modified
  try {
    execSync('git diff --quiet index-vue.html', { stdio: 'ignore' });
    console.log('ℹ️ index-vue.html already in development state');
  } catch (e) {
    // File has changes, reset it
    execSync('git checkout -- index-vue.html', { stdio: 'inherit' });
    console.log('✅ Reverted index-vue.html to development state using git');
  }
} catch (e) {
  console.log('⚠️ Could not revert index-vue.html using git:', e.message);
  console.log('ℹ️ Make sure you have committed the clean version of index-vue.html');
}

console.log('🧹 Cleanup complete!');