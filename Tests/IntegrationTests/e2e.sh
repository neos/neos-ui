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
    composer reinstall neos/test-nodetypes
    composer reinstall neos/test-site
    ./flow flow:cache:flush --force
    ./flow flow:cache:warmup
    ./flow configuration:show --path Neos.ContentRepositoryRegistry.contentRepositories.default.contentDimensions

    if ./flow site:list | grep -q 'Node name'; then
    # TODO: Remove "|| true" - This is currently only needed to prevent CircleCI from exiting
        ./flow site:prune '*' || true
    fi

    ./flow cr:setup
    # TODO: Remove "|| true" - This is currently only needed to prevent CircleCI from exiting
    ./flow site:create neos-test-site Neos.TestSite Neos.TestNodeTypes:Document.Page || true
    # TODO: Replace with "--assume-yes" flag once "./flow cr:prune" has one
    printf "y\n" | ./flow cr:prune
    echo ./flow cr:import --path ./DistributionPackages/Neos.TestSite/Resources/Private/Content
    ./flow cr:import --path ./DistributionPackages/Neos.TestSite/Resources/Private/Content
    echo Done
    ./flow resource:publish

    cd Packages/Application/Neos.Neos.Ui
    yarn run testcafe "$1" "../../../${fixture}*.e2e.js" \
            --selector-timeout=10000 --assertion-timeout=30000
    cd ../../..
    rm -f DistributionPackages/Neos.TestSite

done

rm -rf DistributionPackages
mv DummyDistributionPackages DistributionPackages
