#!/usr/bin/env bash

set -ex

if [ -z "$1" ]
    then
        echo "No testcafe browser supplied, e.g. 'chrome:headless'"
fi

cd ../../..

rm -rf DummyDistributionPackages || true
mv DistributionPackages DummyDistributionPackages
mkdir DistributionPackages

# Currently just run the 1 dimension tests as we have issues with the 2 dimension tests on circleci
#for fixture in Packages/Application/Neos.Neos.Ui/Tests/IntegrationTests/Fixtures/1Dimension/; do
#    echo "$fixture"

    ln -s "../Packages/Application/Neos.Neos.Ui/Tests/IntegrationTests/SharedNodeTypesPackage" DistributionPackages/Neos.TestNodeTypes
    ln -s "../Packages/Application/Neos.Neos.Ui/Tests/IntegrationTests/Fixtures/1Dimension/SitePackage" DistributionPackages/Neos.TestSite

    # TODO: optimize this
    ./flow flow:package:rescan
    ./flow flow:cache:flush
    #./flow flow:cache:flushone Neos_Neos_Fusion
    #./flow flow:cache:flushone Neos_Fusion_Content
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

#done

rm -rf DistributionPackages
mv DummyDistributionPackages DistributionPackages
