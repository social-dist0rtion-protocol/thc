#!/bin/bash

cd www
npx vite build --mode optimism-disappear

# Define the base directory and the target directory
TARGET_DIR=../disappear.dist0rtion.com

# Define the CNAME file path
CNAME_FILE=$TARGET_DIR/CNAME

# Check if the CNAME file exists, if not, exit with an error
if [ ! -f "$CNAME_FILE" ]; then
    echo "CNAME file does not exist. Exiting."
    exit 1
fi

# Read the CNAME file content
CNAME_CONTENT=$(cat "$CNAME_FILE")

# Remove all files in the target directory
rm -rf "$TARGET_DIR/*"

# Copy new files to the target directory
cp -r dist/* "$TARGET_DIR/"

# Navigate to the target directory
cd "$TARGET_DIR"

# Output the CNAME content back to the CNAME file
echo "$CNAME_CONTENT" >"$CNAME_FILE"

git add .
git commit -m 'bump'
git push
