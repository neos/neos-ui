#!/usr/bin/env bash

set -ex

cd ../../..

rm -rf DummyTestPackage
mv DistributionPackages/Neos.TestSite DummyTestPackage

for fixture in Packages/Application/Neos.Neos.Ui/Tests/IntegrationTests/Fixtures/*/; do
    echo "$fixture"

    cp -r "${fixture}SitePackage" DistributionPackages/Neos.TestSite

    FLOW_CONTEXT=Production ./flow flow:cache:flush
    FLOW_CONTEXT=Production ./flow site:prune
    FLOW_CONTEXT=Production ./flow site:import --package-key=Neos.TestSite

    cd Packages/Application/Neos.Neos.Ui
    yarn run testcafe chrome "../../../${fixture}*.e2e.js" \
            --selector-timeout=10000 --assertion-timeout=30000
    cd ../../..
    rm -rf DistributionPackages/Neos.TestSite

done

mv DummyTestPackage DistributionPackages/Neos.TestSite
