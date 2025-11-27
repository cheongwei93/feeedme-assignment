#!/bin/bash

# Exit on error
set -e

echo "=========================="
echo "Building CLI application..."
echo "=========================="

# For Node.js CLI without compilation
npm install

# If you use TypeScript, uncomment the next line
# npx tsc
