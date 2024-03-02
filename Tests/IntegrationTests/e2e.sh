#!/usr/bin/env bash

set -ex

if [ -z "$1" ]; then
    echo "No testcafe browser supplied, e.g. 'chrome:headless'"
fi

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

yarn run testcafe "$1" "Tests/IntegrationTests/Fixtures/*/*.e2e.js" \
    --selector-timeout=10000 --assertion-timeout=30000

cd ../../..
