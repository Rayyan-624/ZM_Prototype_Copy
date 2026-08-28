#!/bin/bash
set -e

BASE_URL="https://media.githubusercontent.com/media/Rayyan-624/ZM_App_Prototype/main"

count=0
success=0

find src/icons -type f \( -name "*.png" -o -name "*.jpg" \) | while read -r file; do
  if grep -q "git-lfs" "$file" 2>/dev/null; then
    count=$((count + 1))
    url="${BASE_URL}/${file}"
    echo "[$count] Downloading $file..."
    /usr/bin/curl -sL "$url" -o "$file"
    size=$(ls -lh "$file" | awk '{print $5}')
    echo "  -> OK ($size)"
  else
    echo "Skipping $file (already binary)"
  fi
done

echo "All icons successfully updated!"
