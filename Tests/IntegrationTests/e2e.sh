#!/usr/bin/env bash

set -e

if [ -z "$1" ]
then
    echo "No testcafe browser supplied, e.g. 'chrome:headless'"
    exit 1
fi

cd ../../..

./flow cr:setup --content-repository onedimension
./flow site:importall --content-repository onedimension --path ./DistributionPackages/Neos.Test.OneDimension/Resources/Private/Content

./flow cr:setup --content-repository twodimensions
./flow site:importall --content-repository twodimensions --path ./DistributionPackages/Neos.Test.TwoDimensions/Resources/Private/Content

./flow resource:publish

cd Packages/Application/Neos.Neos.Ui

yarn run testcafe "$BROWSER" "Tests/IntegrationTests/Fixtures/*/*.e2e.{js,ts}" \
    --selector-timeout=10000 --assertion-timeout=30000
