#!/bin/bash

# Exit on error
set -e

echo "=========================="
echo "Running CLI application..."
echo "=========================="

# Run the CLI app and output to result.txt
node src/app.js > result.txt

echo "Results saved to result.txt"
