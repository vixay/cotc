#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m'
};

function log(message, color = 'reset') {
    console.log(colors[color] + message + colors.reset);
}

function validateCharacterData() {
    const dataPath = path.join(__dirname, '..', 'data', 'characters.json');
    
    try {
        // Read and parse JSON
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const data = JSON.parse(rawData);
        
        log('✓ JSON syntax is valid', 'green');
        
        // Check required top-level fields
        if (!data.version) log('⚠ Missing version field', 'yellow');
        if (!data.lastUpdated) log('⚠ Missing lastUpdated field', 'yellow');
        if (!data.characters || !Array.isArray(data.characters)) {
            log('✗ Missing or invalid characters array', 'red');
            return false;
        }
        
        // Validate each character
        const requiredFields = ['id', 'name', 'isFree', 'ultPriority', 'stones', 'notes'];
        const validStones = ['U10', 'A1', 'A2', 'A3', 'A4', 'Shard', 'Keep'];
        const validA4Tiers = ['S+', 'S', 'A', 'B', 'C', 'D', null];
        const validUltPriorities = ['L10', 'L10 First', 'A1, L10', 'A4, L10', 'L9', 'L1'];
        
        let errors = 0;
        const ids = new Set();
        
        data.characters.forEach((char, index) => {
            // Check required fields
            requiredFields.forEach(field => {
                if (!(field in char)) {
                    log(`✗ Character at index ${index} missing field: ${field}`, 'red');
                    errors++;
                }
            });
            
            // Check for duplicate IDs
            if (ids.has(char.id)) {
                log(`✗ Duplicate ID found: ${char.id}`, 'red');
                errors++;
            }
            ids.add(char.id);
            
            // Validate ID format
            if (char.id && char.id !== char.id.toLowerCase()) {
                log(`⚠ ID should be lowercase: ${char.id}`, 'yellow');
            }
            
            // Validate boolean
            if (typeof char.isFree !== 'boolean') {
                log(`✗ ${char.name}: isFree must be boolean`, 'red');
                errors++;
            }
            
            // Validate A4 tier
            if (char.a4Tier !== undefined && !validA4Tiers.includes(char.a4Tier)) {
                log(`✗ ${char.name}: Invalid A4 tier: ${char.a4Tier}`, 'red');
                errors++;
            }
            
            // Validate ultimate priority
            if (!validUltPriorities.includes(char.ultPriority)) {
                log(`✗ ${char.name}: Invalid ultimate priority: ${char.ultPriority}`, 'red');
                errors++;
            }
            
            // Validate stones
            if (char.stones) {
                const stoneKeys = ['AS1', 'AS2', 'AS3', 'AS4', 'AS5'];
                stoneKeys.forEach(key => {
                    if (!(key in char.stones)) {
                        log(`✗ ${char.name}: Missing stone ${key}`, 'red');
                        errors++;
                    } else if (!validStones.includes(char.stones[key])) {
                        log(`✗ ${char.name}: Invalid stone value for ${key}: ${char.stones[key]}`, 'red');
                        errors++;
                    }
                });
            }
            
            // Validate free character stones
            if (char.isFree && char.stones) {
                Object.values(char.stones).forEach(stone => {
                    if (stone === 'Shard') {
                        log(`⚠ ${char.name}: Free character has 'Shard' - should be 'Keep' or awakening`, 'yellow');
                    }
                });
            }
        });
        
        if (errors === 0) {
            log(`\n✓ All ${data.characters.length} characters validated successfully!`, 'green');
            return true;
        } else {
            log(`\n✗ Found ${errors} errors`, 'red');
            return false;
        }
        
    } catch (error) {
        if (error.code === 'ENOENT') {
            log('✗ Could not find data/characters.json', 'red');
        } else if (error instanceof SyntaxError) {
            log('✗ JSON syntax error: ' + error.message, 'red');
        } else {
            log('✗ Unexpected error: ' + error.message, 'red');
        }
        return false;
    }
}

// Run validation
if (validateCharacterData()) {
    process.exit(0);
} else {
    process.exit(1);
}