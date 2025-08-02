# Merge Workflow: Dev to Main

This document outlines the process for merging changes from `dev` to `main` while excluding development files.

## Quick Workflow

### Option A: Using the Merge Script (Recommended)
```bash
# From dev branch
./scripts/merge-to-main.sh "Your commit message"

# Review staged changes
git checkout main
git status
git diff --cached

# Commit when ready
git commit -m "Your commit message"
git push origin main
git checkout dev
```

### Option B: Manual Selective Merge
```bash
# 1. Ensure dev is clean and up to date
git checkout dev
git add . && git commit -m "Your dev changes"

# 2. Switch to main and merge selectively
git checkout main
git merge --no-commit --no-ff dev

# 3. Remove unwanted files from staging
git reset HEAD helpers/
git reset HEAD data/*.backup data/*_backup*
git reset HEAD Screenshot*.png
git reset HEAD column-visibility-design.md
git reset HEAD data/temp/

# 4. Remove unwanted files from working directory
git checkout HEAD -- helpers/ data/*.backup data/*_backup* Screenshot*.png column-visibility-design.md data/temp/ 2>/dev/null || true

# 5. Commit only the essential files
git commit -m "Merge essential changes from dev"

# 6. Push to main
git push origin main

# 7. Switch back to dev
git checkout dev
```

## Files Always Included in Main
- `index.html` - Main application
- `character-details.html` - Character details page  
- `css/` - All stylesheets
- `js/` - All JavaScript files
- `data/characters_enhanced_v2.json` - Production data
- `data/characters_jp.json` - JP-specific data for future use
- `data/Character Markdown/` - Character descriptions
- `images/` - Application images
- `docs/` - Documentation
- `README.md`, `CLAUDE.md` - Project docs
- `.gitignore` - Git configuration

## Files Excluded from Main
- `helpers/` - Development scripts
- `data/*.backup` - Backup files
- `data/*_backup*` - Backup variations
- `data/temp/` - Temporary data
- `data/Character List*.csv` - Source CSV files
- `Screenshot*.png` - Development screenshots
- `column-visibility-design.md` - Design docs
- `*.tmp`, `*.temp` - Temporary files

## Troubleshooting

### If merge script fails:
```bash
git checkout dev
git status  # Check for uncommitted changes
```

### If manual merge goes wrong:
```bash
git checkout dev
git branch -D main  # Delete broken main
git checkout -b main origin/main  # Recreate from remote
```

### To see what would be merged:
```bash
git checkout dev
git diff --name-only main..dev
```