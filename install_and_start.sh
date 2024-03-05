#!/bin/bash

# Directories to loop through
directories=("orders" "payment" "product" "sessions" "users")

# Loop through each directory
for dir in "${directories[@]}"; do
    echo "Installing dependencies and starting in $dir..."
    cd "$dir" || { echo "Error: $dir directory not found"; exit 1; }
    
    # Install dependencies and start npm in background
    npm install && npm start &
    
    # Go back to the project root directory
    cd ..
done
