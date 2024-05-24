#!/bin/bash

cd www
npx vite build --mode optimism-disappear

# Define the base directory and the target directory
TARGET_DIR=/Users/albi/repos/social-dist0rtion-protocol/disappear.dist0rtion.com

# Define the CNAME file path
CNAME_FILE=/Users/albi/repos/social-dist0rtion-protocol/disappear.dist0rtion.com/CNAME
echo $CNAME_FILE

# Check if the CNAME file exists, if not, exit with an error
# Read the CNAME file content
CNAME_CONTENT=$(cat "$CNAME_FILE")
echo $CNAME_CONTENT

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
