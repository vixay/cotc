# Claude Code Instructions - Part 6: GitHub Templates and Workflows

## File 11: .github/ISSUE_TEMPLATE/character-update.md

Create the directory structure and file:
1. `mkdir -p .github/ISSUE_TEMPLATE`
2. Create `.github/ISSUE_TEMPLATE/character-update.md`:

```markdown
---
name: Character Update
about: Suggest changes to a character's awakening priorities
title: '[Character Update] Character Name'
labels: 'character-update'
assignees: ''
---

## Character Information

**Character Name**: 
**Current Priority**: 
**Suggested Priority**: 

## What needs to change?

- [ ] Ultimate priority (L10, L9, L1, etc.)
- [ ] A4 tier rating
- [ ] Stone usage recommendations
- [ ] Character notes
- [ ] Other: 

## Detailed Changes

### Current Values
```
Ultimate Priority: 
A4 Tier: 
AS1: 
AS2: 
AS3: 
AS4: 
AS5: 
```

### Suggested Values
```
Ultimate Priority: 
A4 Tier: 
AS1: 
AS2: 
AS3: 
AS4: 
AS5: 
```

## Reasoning

Why should this change be made? Please provide evidence:

- [ ] Recent game update/balance change
- [ ] Community consensus
- [ ] New strategy discovered
- [ ] Error in current data

## Evidence

Please provide links to:
- Patch notes: 
- Reddit/Discord discussions: 
- Video demonstrations: 
- Other sources: 

## Additional Context

Add any other context or screenshots about the change here.
```

## File 12: .github/ISSUE_TEMPLATE/new-character.md

Create `.github/ISSUE_TEMPLATE/new-character.md`:

```markdown
---
name: New Character
about: Add a new character to the guide
title: '[New Character] Character Name'
labels: 'new-character'
assignees: ''
---

## Character Information

**Character Name**: 
**How to Obtain**: (Gacha/Free/Collab)
**Release Date**: 

## Awakening Recommendations

**Ultimate Priority**: (L10/L10 First/A1 L10/A4 L10/L9/L1)
**A4 Accessory Tier**: (S+/S/A/B/C/D/Not Listed)

### Stone Usage
- AS1: 
- AS2: 
- AS3: 
- AS4: 
- AS5: 

## Character Notes

Brief description of why these recommendations:


## Evidence/Sources

- Official announcement: 
- Community discussion: 
- Tier lists: 

## Character Tags

Suggested tags for this character:
- [ ] Role (buffer/debuffer/healer/tank/dps)
- [ ] Rarity (5-star/4-star)
- [ ] Type (free/collab/limited)
- [ ] Priority (top-tier/u10-priority/a4-priority/shardable)

## JSON Entry

If you're comfortable with JSON, provide the complete entry:

```json
{
  "id": "",
  "name": "",
  "isFree": false,
  "a4Tier": "",
  "ultPriority": "",
  "ultPriorityGroup": "",
  "stones": {
    "AS1": "",
    "AS2": "",
    "AS3": "",
    "AS4": "",
    "AS5": ""
  },
  "notes": "",
  "tags": []
}
```
```

## File 13: .github/ISSUE_TEMPLATE/bug-report.md

Create `.github/ISSUE_TEMPLATE/bug-report.md`:

```markdown
---
name: Bug Report
about: Report a problem with the site
title: '[Bug] '
labels: 'bug'
assignees: ''
---

## Bug Description

A clear and concise description of what the bug is.

## Steps to Reproduce

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior

What you expected to happen.

## Actual Behavior

What actually happened.

## Screenshots

If applicable, add screenshots to help explain your problem.

## Environment

- **Browser**: (e.g., Chrome 91, Firefox 89)
- **Device**: (e.g., Desktop, iPhone 12)
- **OS**: (e.g., Windows 10, iOS 14)

## Additional Context

Add any other context about the problem here.
```

## File 14: .github/workflows/validate-data.yml

Create the directory and file:
1. `mkdir -p .github/workflows`
2. Create `.github/workflows/validate-data.yml`:

```yaml
name: Validate Character Data

on:
  pull_request:
    paths:
      - 'data/characters.json'
  push:
    branches:
      - main
    paths:
      - 'data/characters.json'

jobs:
  validate:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
    
    - name: Validate JSON syntax
      run: |
        echo "Validating JSON syntax..."
        python -m json.tool data/characters.json > /dev/null
        if [ $? -eq 0 ]; then
          echo "✅ JSON syntax is valid"
        else
          echo "❌ JSON syntax error detected"
          exit 1
        fi
    
    - name: Check for required fields
      run: |
        node -e "
        const fs = require('fs');
        const data = JSON.parse(fs.readFileSync('data/characters.json', 'utf8'));
        const requiredFields = ['id', 'name', 'isFree', 'ultPriority', 'stones', 'notes'];
        let errors = [];
        
        data.characters.forEach((char, index) => {
          requiredFields.forEach(field => {
            if (!(field in char)) {
              errors.push(\`Character at index \${index} (\${char.name || 'unnamed'}) missing field: \${field}\`);
            }
          });
          
          // Check stones
          if (char.stones) {
            const stoneFields = ['AS1', 'AS2', 'AS3', 'AS4', 'AS5'];
            stoneFields.forEach(stone => {
              if (!(stone in char.stones)) {
                errors.push(\`Character \${char.name} missing stone: \${stone}\`);
              }
            });
          }
        });
        
        if (errors.length > 0) {
          console.error('❌ Validation errors:');
          errors.forEach(err => console.error('  - ' + err));
          process.exit(1);
        } else {
          console.log('✅ All required fields present');
        }
        "
    
    - name: Check for duplicate IDs
      run: |
        node -e "
        const fs = require('fs');
        const data = JSON.parse(fs.readFileSync('data/characters.json', 'utf8'));
        const ids = data.characters.map(c => c.id);
        const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
        
        if (duplicates.length > 0) {
          console.error('❌ Duplicate IDs found:', duplicates);
          process.exit(1);
        } else {
          console.log('✅ No duplicate IDs');
        }
        "
    
    - name: Validate stone values
      run: |
        node -e "
        const fs = require('fs');
        const data = JSON.parse(fs.readFileSync('data/characters.json', 'utf8'));
        const validStones = ['U10', 'A1', 'A2', 'A3', 'A4', 'Shard', 'Keep'];
        let errors = [];
        
        data.characters.forEach(char => {
          Object.entries(char.stones).forEach(([key, value]) => {
            if (!validStones.includes(value)) {
              errors.push(\`\${char.name} has invalid stone value for \${key}: \${value}\`);
            }
          });
        });
        
        if (errors.length > 0) {
          console.error('❌ Invalid stone values:');
          errors.forEach(err => console.error('  - ' + err));
          process.exit(1);
        } else {
          console.log('✅ All stone values are valid');
        }
        "
    
    - name: Post validation results
      uses: actions/github-script@v6
      if: github.event_name == 'pull_request' && failure()
      with:
        script: |
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: '❌ Character data validation failed. Please check the JSON syntax and ensure all required fields are present.'
          })
    
    - name: Post success message
      uses: actions/github-script@v6
      if: github.event_name == 'pull_request' && success()
      with:
        script: |
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: '✅ Character data validation passed! The changes look good.'
          })
```

## File 15: scripts/validate.js

Create the directory and file:
1. `mkdir -p scripts`
2. Create `scripts/validate.js`:

```javascript
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
```

## Final Setup Instructions

1. **Create all files** in the structure shown
2. **Make validate.js executable**: `chmod +x scripts/validate.js`
3. **Test locally**: `python -m http.server 8000`
4. **Commit everything**: 
   ```bash
   git add .
   git commit -m "Initial COTC Awakening Stone Guide setup"
   git push origin main
   ```
5. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
   - Save

## Summary

You now have a complete COTC Awakening Stone Guide with:
- ✅ All HTML, CSS, and JavaScript files
- ✅ Complete character database
- ✅ Documentation for contributors
- ✅ GitHub issue templates
- ✅ Automated validation
- ✅ Local validation script
- ✅ Mobile-responsive design
- ✅ Community-friendly editing

The site will be live at https://vixay.github.io/cotc/ after enabling GitHub Pages!