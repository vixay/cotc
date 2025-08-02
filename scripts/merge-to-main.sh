#!/bin/bash

# Script to merge dev branch to main with only essential files
# Usage: ./scripts/merge-to-main.sh "commit message"

set -e

COMMIT_MSG="${1:-Merge essential changes from dev}"
CURRENT_BRANCH=$(git branch --show-current)

echo "🔄 Starting selective merge from dev to main..."

# Ensure we're on dev branch
if [ "$CURRENT_BRANCH" != "dev" ]; then
    echo "❌ Please run this script from the dev branch"
    exit 1
fi

# Ensure dev branch is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Please commit or stash changes in dev branch first"
    git status
    exit 1
fi

# Switch to main branch
echo "📍 Switching to main branch..."
git checkout main

# Get list of files that changed in dev
echo "🔍 Analyzing changes from dev branch..."
CHANGED_FILES=$(git diff --name-only main..dev)

# Files to exclude from merge
EXCLUDE_PATTERNS=(
    "helpers/"
    "data/*.backup"
    "data/*_backup*"
    "data/temp/"
    "data/Character List"
    "Screenshot"
    "column-visibility-design.md"
    "*.tmp"
    "*.temp"
)

# Create array of files to include
INCLUDE_FILES=()
while IFS= read -r file; do
    SHOULD_EXCLUDE=false
    
    for pattern in "${EXCLUDE_PATTERNS[@]}"; do
        if [[ "$file" == $pattern* ]] || [[ "$file" == *"$pattern"* ]]; then
            SHOULD_EXCLUDE=true
            echo "🚫 Excluding: $file"
            break
        fi
    done
    
    if [ "$SHOULD_EXCLUDE" = false ]; then
        INCLUDE_FILES+=("$file")
        echo "✅ Including: $file"
    fi
done <<< "$CHANGED_FILES"

if [ ${#INCLUDE_FILES[@]} -eq 0 ]; then
    echo "❌ No files to merge"
    git checkout dev
    exit 1
fi

# Merge only the essential files
echo "🔄 Merging essential files..."
for file in "${INCLUDE_FILES[@]}"; do
    if [ -f "$(git show dev:$file 2>/dev/null)" ] 2>/dev/null; then
        mkdir -p "$(dirname "$file")"
        git show dev:"$file" > "$file"
        git add "$file"
    fi
done

# Commit the changes
echo "💾 Committing changes..."
git commit -m "$COMMIT_MSG" || echo "⚠️  Nothing to commit"

echo "✅ Merge completed successfully!"
echo "📋 Summary:"
echo "   - Merged ${#INCLUDE_FILES[@]} essential files from dev to main"
echo "   - Excluded development files (helpers/, backups, screenshots)"
echo ""
echo "🚀 Ready to push to main branch:"
echo "   git push origin main"