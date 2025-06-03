#!/bin/bash

echo "Cleaning dist, out-tsc, and nested node_modules (excluding root node_modules)..."

# Store the absolute path to the root node_modules
ROOT_NODE_MODULES="$(pwd)/node_modules"

# Find and delete folders
find . -type d \( -name "dist" -o -name "out-tsc" -o -name "node_modules" \) ! -path "$ROOT_NODE_MODULES" -prune -exec rm -rf {} +

rm -rf nx tmp

echo "Cleanup completed."
