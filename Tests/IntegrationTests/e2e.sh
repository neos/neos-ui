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

# parse dimension from fixture file name
function get_dimension() {
  dimension=$(basename "$1")
  echo "$dimension"
}

# Function that gets a fixture as parameter. With the fixture we
# load the related site package and import the site.
function initialize_neos_site() {
  local fixture=$1

  ln -s "../${fixture}SitePackage" DistributionPackages/Neos.TestSite

  composer reinstall neos/test-nodetypes
  composer reinstall neos/test-site
  # make sure neos is installed even if patching led to the removal (bug)
  composer update neos/neos-development-collection
  ./flow flow:cache:flush --force
  ./flow flow:cache:warmup
  ./flow configuration:show --path Neos.ContentRepository.contentDimensions

  if ./flow site:list | grep -q 'Node name'; then
      ./flow site:prune '*'
  fi
  ./flow site:import --package-key=Neos.TestSite
  ./flow resource:publish
}

function run_tests() {
    cd ../../..

    rm -rf DummyDistributionPackages || true
    mv DistributionPackages DummyDistributionPackages
    mkdir DistributionPackages

    ln -s "../Packages/Application/Neos.Neos.Ui/Tests/IntegrationTests/SharedNodeTypesPackage" DistributionPackages/Neos.TestNodeTypes

    for fixture in Packages/Application/Neos.Neos.Ui/Tests/IntegrationTests/Fixtures/*/; do
        dimension=$(get_dimension "$fixture")
        initialize_neos_site "$fixture"

        # go tp the Neos.Neos.Ui package and run the tests
        cd Packages/Application/Neos.Neos.Ui

        if [[ $BROWSER ]]; then
            yarn run testcafe "$BROWSER" "../../../${fixture}*.e2e.js" --selector-timeout=10000 --assertion-timeout=30000 || hasFailure=1
        fi

        if [[ $USE_SAUCELABS ]]; then
          saucectl run --config .sauce/config${dimension}.yml || hasFailure=1
        fi

        # cd back to the root directory and clean up
        cd ../../..
        rm -f DistributionPackages/Neos.TestSite
    done

    rm -rf DistributionPackages
    mv DummyDistributionPackages DistributionPackages

    if [[ $hasFailure -eq 1 ]] ; then
        exit 1
    fi
}

parse_arguments "$@"

# check if incoming parameters are correct
check_testcafe_browser
check_saucelabs_setup

run_tests
