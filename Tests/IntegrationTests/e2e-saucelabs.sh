#!/usr/bin/env bash

set -ex

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

# Check if saucectl is installed
function check_saucectl_installed {
    if ! command -v saucectl &> /dev/null; then
        echo "saucectl is not installed. Installing saucectl..."
        # Install saucectl via npm (assuming npm is installed)
        npm install -g saucectl
    fi
}

# get dimension from fixture
function get_dimension() {
  dimension=$(basename "$1")
  echo "$dimension"
}

# Function that gets a fixture as parameter. With the fixture we
# load the related site package and import the site.
function initialize_neos_site() {
  local fixture=$1

  ln -s "../${fixture}SitePackage" DistributionPackages/Neos.TestSite

  # TODO: optimize this
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
check_saucectl_installed
check_saucectl_variables

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
    saucectl run --config .sauce/config${dimension}.yml

    # cd back to the root directory and clean up
    cd ../../..
    rm -f DistributionPackages/Neos.TestSite
done

rm -rf DistributionPackages
mv DummyDistributionPackages DistributionPackages
