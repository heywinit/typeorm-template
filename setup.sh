#!/bin/bash

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "Error: jq is required but not installed. Please install jq first."
    exit 1
fi

# Install dependencies
npm install typeorm reflect-metadata pg bcryptjs

# Prompt for tsconfig path
read -p "Enter the path to your tsconfig.json (default: ./tsconfig.json): " TSCONFIG_PATH
TSCONFIG_PATH=${TSCONFIG_PATH:-"./tsconfig.json"}

# Check if tsconfig exists
if [ ! -f "$TSCONFIG_PATH" ]; then
    echo "Error: tsconfig.json not found at $TSCONFIG_PATH"
    exit 1
fi

# Add/update emitDecoratorMetadata and experimentalDecorators in tsconfig.json
# Using temporary file to maintain formatting
TMP_FILE=$(mktemp)
jq '.compilerOptions += {"emitDecoratorMetadata": true, "experimentalDecorators": true}' "$TSCONFIG_PATH" > "$TMP_FILE"
mv "$TMP_FILE" "$TSCONFIG_PATH"

echo "Successfully updated tsconfig.json with decorator metadata settings"


# delete the setup.sh, readme.md
rm setup.sh
rm readme.md
