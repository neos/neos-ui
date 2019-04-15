#!/usr/bin/env bash

set -ex

if [ -z "$1" ]
    then
        echo "No testcafe browser supplied, e.g. 'chrome:headless'"
fi

cd ../../..

rm -rf DummySitePackage || true
mv DistributionPackages/Neos.TestSite DummySitePackage

for fixture in Packages/Application/Neos.Neos.Ui/Tests/IntegrationTests/Fixtures/*/; do
    echo "$fixture"

    ln -s "../${fixture}SitePackage" DistributionPackages/Neos.TestSite

    # TODO: optimize this
    ./flow flow:cache:flush
    #./flow flow:cache:flushone Neos_Neos_Fusion
    #./flow flow:cache:flushone Neos_Fusion_Content
    ./flow site:prune 'neos-test-site'
    ./flow site:import --package-key=Neos.TestSite
    ./flow resource:publish

    cd Packages/Application/Neos.Neos.Ui
    yarn run testcafe "$1" "../../../${fixture}*.e2e.js" \
            --selector-timeout=10000 --assertion-timeout=30000
    cd ../../..
    rm -f DistributionPackages/Neos.TestSite

done

mv DummySitePackage DistributionPackages/Neos.TestSite
