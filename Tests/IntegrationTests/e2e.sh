#!/usr/bin/env bash

set -ex

if [ -z "$1" ]; then
    echo "No testcafe browser supplied, e.g. 'chrome:headless'"
fi

cd ../../..

rm -rf DummyDistributionPackages || true
mv DistributionPackages DummyDistributionPackages
mkdir DistributionPackages

ln -s "../Packages/Application/Neos.Neos.Ui/Tests/IntegrationTests/SharedNodeTypesPackage" DistributionPackages/Neos.TestNodeTypes

for fixture in Packages/Application/Neos.Neos.Ui/Tests/IntegrationTests/Fixtures/*/; do
    echo "$fixture"

    ln -s "../${fixture}SitePackage" DistributionPackages/Neos.TestSite

    # TODO: optimize this
    #composer update
    composer reinstall neos/test-site
    ./flow flow:cache:flush --force
    ./flow flow:cache:warmup
    ./flow configuration:show --path Neos.ContentRepository.contentDimensions

    if ./flow site:list | grep -q 'Node name'; then
        ./flow site:prune '*'
    fi
    ./flow site:import --package-key=Neos.TestSite
    ./flow resource:publish

    cd Packages/Application/Neos.Neos.Ui
    yarn run testcafe "$1" "../../../${fixture}*.e2e.js" \
            --selector-timeout=10000 --assertion-timeout=30000
    cd ../../..
    rm -f DistributionPackages/Neos.TestSite

done

rm -rf DistributionPackages
mv DummyDistributionPackages DistributionPackages
