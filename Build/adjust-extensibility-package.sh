#!/bin/bash

# Set the path to the package.json file
package_json="packages/neos-ui-extensibility/package.json"

# Set the new value for the "module" field
new_module_value="./dist/index.js"

# Check if jq is installed
if ! command -v jq > /dev/null; then
  # Install jq using apt-get if running on Ubuntu
  if [ -f /etc/lsb-release ]; then
    sudo apt-get install jq
  # Install jq using brew if running on macOS
  elif [ -f /usr/local/bin/brew ]; then
    brew install jq
  else
    echo "Error: OS not recognized. Please install jq manually."
    exit 1
  fi
fi

# Replace module parameter for package.json from src to dist
if [ -f "$package_json" ]; then
  jq --arg new_module_value "$new_module_value" '.module = $new_module_value' "$package_json" > "$package_json.tmp" && mv "$package_json.tmp" "$package_json"
  echo "Updated 'module' field in $package_json"
else
  echo "Error: $package_json does not exist"
fi
