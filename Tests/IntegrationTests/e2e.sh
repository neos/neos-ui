#!/usr/bin/env bash

set -e

cd ../../..
pwd

mv DistributionPackages/Neos.TestSite DummyTestPackage

for fixture in Packages/Application/Neos.Neos.Ui/Tests/IntegrationTests/Fixtures/*/; do
    echo "$fixture"

    cp -r "Packages/Application/Neos.Neos.Ui/Tests/IntegrationTests/Fixtures/${fixture}SitePackage" DistributionPackages/Neos.TestSite

    FLOW_CONTEXT=Production ./flow site:prune
    FLOW_CONTEXT=Production ./flow site:import --package-key=Neos.TestSite
    FLOW_CONTEXT=Production ./flow cache:flush
    FLOW_CONTEXT=Production ./flow resource:publish

    yarn run testcafe chrome:headless "Packages/Application/Neos.Neos.Ui/Tests/IntegrationTests/Fixtures/${fixture}*.e2e.js" \
            --selector-timeout=10000 --assertion-timeout=30000

    rm -rf DistributionPackages/Neos.TestSite

done

mv DummyTestPackage DistributionPackages/Neos.TestSite

cd Packages/Application/Neos.Neos.Ui
