#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "=========================="
echo "Running unit tests..."
echo "=========================="

# Ensure dependencies are installed
npm install

# Run Jest tests
npm test
