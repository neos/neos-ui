#!/usr/bin/env bash

set -ex

# Check if saucectl is installed
if ! command -v saucectl &> /dev/null; then
    echo "saucectl is not installed. Installing saucectl..."
    # Install saucectl via npm (assuming npm is installed)
    npm install -g saucectl
fi

# Check if SAUCE_USERNAME and SAUCE_ACCESS_KEY are set
if [[ -n "$SAUCE_USERNAME" && -n "$SAUCE_ACCESS_KEY" ]]; then
    echo "SAUCE_USERNAME and SAUCE_ACCESS_KEY are set. Configuring saucectl..."
    #saucectl configure
else
    echo "SAUCE_USERNAME or SAUCE_ACCESS_KEY is not set. Skipping saucectl configuration."
    exit 1
fi

cd ../../..

rm -rf DummyDistributionPackages || true
mv DistributionPackages DummyDistributionPackages
mkdir DistributionPackages

ln -s "../Packages/Application/Neos.Neos.Ui/Tests/IntegrationTests/SharedNodeTypesPackage" DistributionPackages/Neos.TestNodeTypes

for fixture in Packages/Application/Neos.Neos.Ui/Tests/IntegrationTests/Fixtures/*/; do
    echo "$fixture"
    dimension=$(basename "$fixture")
    echo "$dimension"

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

    cd Packages/Application/Neos.Neos.Ui
    saucectl run --config .sauce/config${dimension}.yml
    cd ../../..
    rm -f DistributionPackages/Neos.TestSite

done

rm -rf DistributionPackages
mv DummyDistributionPackages DistributionPackages
