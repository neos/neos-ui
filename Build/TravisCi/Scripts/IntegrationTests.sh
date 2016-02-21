#!/usr/bin/env bash

#
# This file serves as the script for the TravisCI `IntegrationTests` TEST_SUITE environment.
# The script will be executed in the package working directory.
#

# Change back into the root directory of the Neos instance.
cd ../../../

# Install all dependencies for the neos instance.
composer install -q

# Remove the default login package since our `che!` routes currenctly conflicts with the package.
composer remove flowpack/neos-frontendlogin
rm -rf Packages/Plugins/Flowpack.Neos.FrontendLogin
rm -rf Data/Temporary/*

# Move the configuration files into place.
rm Configuration/Routes.yaml
cp Packages/Application/PackageFactory.Guevara/Build/TravisCi/Settings.yaml Configuration/Development/Settings.yaml
cp Packages/Application/PackageFactory.Guevara/Build/TravisCi/Routes.yaml Configuration/Routes.yaml

# Setup the database and import the demo site package.
mysql -e 'create database neos collate utf8_unicode_ci;'
./flow cache:warmup
./flow doctrine:migrate
./flow site:import --package-key=TYPO3.NeosDemoTypo3Org

# Create the demo backend user.
./flow user:create --username=johndoe --password=demo --first-name=John --last-name=Doe --roles=TYPO3.Neos:Administrator &

# Start the development server on which the integration tests will act on.
./flow server:run --port 8081 &

# Finally, build the assets and execute the integration tests.
npm run build
npm run selenium:run
