#!/usr/bin/env bash

set -ex

# Global variables
BROWSER=""
USE_SAUCELABS=false

# Function to parse arguments and save values to global variables
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -h|--help)
                print_usage_information
                exit 0
                ;;
            -s|--saucelabs)
                USE_SAUCELABS=true
                ;;
            -b|--browser)
                BROWSER="$2"
                shift
                ;;
            *)
                echo "Unknown option: $1"
                print_usage_information
                exit 1
                ;;
        esac
        shift
    done
}

print_usage_information() {
    cat <<EOF
Usage: $0 [options]

Options:
    -h, --help       Show this help message
    -s, --saucelabs  Run in remote browser from SauceLabs configured in .sauce
    -b, --browser    Run in specified local browser
EOF
}

function check_testcafe_browser {
    if [ -z "$BROWSER" ] && [ "$USE_SAUCELABS" = false ]; then
        echo "No testcafe browser supplied, e.g. 'chrome:headless'"
        exit 1
    fi
}

function check_saucelabs_setup {
    if [ "$USE_SAUCELABS" = true ]; then
      check_saucectl_variables
      check_saucectl_installed
    fi
}

# Check if SAUCE_USERNAME and SAUCE_ACCESS_KEY are set
function check_saucectl_variables {
    if [[ -n "$SAUCE_USERNAME" && -n "$SAUCE_ACCESS_KEY" ]]; then
        echo "SAUCE_USERNAME and SAUCE_ACCESS_KEY are set. Configuring saucectl..."
        #saucectl configure
    else
        echo "SAUCE_USERNAME or SAUCE_ACCESS_KEY is not set. Skipping saucectl configuration."
        exit 1
    fi
}

function check_saucectl_installed {
    if ! command -v saucectl &> /dev/null; then
        echo "saucectl is not installed. Installing saucectl..."
        # Install saucectl via npm (assuming npm is installed)
        npm install -g saucectl
    fi
}

function run_tests() {
    cd ../../..

    ./flow cr:setup --content-repository onedimension
    ./flow cr:import --content-repository onedimension --path ./DistributionPackages/Neos.Test.OneDimension/Resources/Private/Content
    # Connect to a Neos site, todo the nodeTypeName parameter is obsolete but necessary
    ./flow site:create neos-test-onedimension Neos.Test.OneDimension Neos.TestNodeTypes:Document.HomePage
    ./flow domain:add neos-test-onedimension onedimension.localhost --port 8081

    ./flow cr:setup --content-repository twodimensions
    ./flow cr:import --content-repository twodimensions --path ./DistributionPackages/Neos.Test.TwoDimensions/Resources/Private/Content
    # Connect to a Neos site, todo the nodeTypeName parameter is obsolete but necessary
    ./flow site:create neos-test-twodimensions Neos.Test.TwoDimensions Neos.TestNodeTypes:Document.HomePage
    ./flow domain:add neos-test-twodimensions twodimensions.localhost --port 8081

    ./flow resource:publish

    cd Packages/Application/Neos.Neos.Ui

    if [[ $BROWSER ]]; then
        yarn run testcafe "$BROWSER" "Tests/IntegrationTests/Fixtures/*/*.e2e.js" \
            --selector-timeout=10000 --assertion-timeout=30000
    fi

    if [[ $USE_SAUCELABS ]]; then
      saucectl run --config .sauce/config.yml
    fi
}

parse_arguments "$@"

# check if incoming parameters are correct
check_testcafe_browser
check_saucelabs_setup

run_tests
