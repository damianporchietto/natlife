#!/bin/bash

# Version bump script for natlife project
# Usage: ./version-bump.sh [patch|minor|major]

set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 [patch|minor|major]"
    echo "Current versions:"
    echo "  Server: $(jq -r '.version' server/package.json)"
    echo "  Client: $(jq -r '.version' client/package.json)"
    exit 1
fi

BUMP_TYPE=$1

# Function to bump version
bump_version() {
    local current_version=$1
    local bump_type=$2
    
    IFS='.' read -r major minor patch <<< "$current_version"
    
    case $bump_type in
        patch)
            patch=$((patch + 1))
            ;;
        minor)
            minor=$((minor + 1))
            patch=0
            ;;
        major)
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        *)
            echo "Invalid bump type: $bump_type"
            echo "Use: patch, minor, or major"
            exit 1
            ;;
    esac
    
    echo "$major.$minor.$patch"
}

# Get current version from server
CURRENT_VERSION=$(jq -r '.version' server/package.json)
echo "Current version: $CURRENT_VERSION"

# Calculate new version
NEW_VERSION=$(bump_version "$CURRENT_VERSION" "$BUMP_TYPE")
echo "New version: $NEW_VERSION"

# Update server package.json
echo "Updating server/package.json..."
jq --arg version "$NEW_VERSION" '.version = $version' server/package.json > server/package.json.tmp
mv server/package.json.tmp server/package.json

# Update client package.json
echo "Updating client/package.json..."
jq --arg version "$NEW_VERSION" '.version = $version' client/package.json > client/package.json.tmp
mv client/package.json.tmp client/package.json

echo "✅ Version bumped to $NEW_VERSION"
echo ""
echo "Next steps:"
echo "1. Review changes: git diff"
echo "2. Commit changes: git add . && git commit -m 'Bump version to $NEW_VERSION'"
echo "3. Push to trigger release: git push origin main"
echo "4. Or create tag manually: git tag -a v$NEW_VERSION -m 'Release v$NEW_VERSION'" 