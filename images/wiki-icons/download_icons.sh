#!/bin/bash
# Download all COTC Wiki status effect icons
# Source: https://octopathtraveler.fandom.com/wiki/Status_Effects_(Champions_of_the_Continent)

echo "Downloading COTC Wiki icons..."
total=$(wc -l < icon_urls.txt)
count=0

while IFS= read -r url; do
    count=$((count + 1))
    # Extract filename from URL
    filename=$(basename "$url")
    echo "[$count/$total] Downloading $filename..."
    curl -s -o "$filename" "$url"
    sleep 0.1  # Be respectful to the server
done < icon_urls.txt

echo "Download complete! Downloaded $count icons."
ls -1 *.png | wc -l