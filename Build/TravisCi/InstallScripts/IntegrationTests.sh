#!/usr/bin/env bash

#
# This file serves as the finishing install script for the TravisCI `IntegrationTests` TEST_SUITE environment.
# The script will be executed in the neos instance root directory.
#

#
# Safe way of propagating the exit code of all commands through the script.
# Without this line, commands could fail/exit 1 and the script itself would
# complete and exit with code 0.
#
set -e

# Install all dependencies for the neos instance.
composer install -q -n

# Remove the default login package since our `neos!` routes currenctly conflicts with the package.
composer remove flowpack/neos-frontendlogin -n
rm -rf Packages/Plugins/Flowpack.Neos.FrontendLogin
rm -rf Data/Temporary/*

# Move the configuration files into place.
rm Configuration/Routes.yaml
cp Packages/Application/Neos.Neos.Ui/Build/TravisCi/Settings.yaml Configuration/Development/Settings.yaml
cp Packages/Application/Neos.Neos.Ui/Build/TravisCi/Routes.yaml Configuration/Routes.yaml

# Setup the database and import the demo site package.
mysql -e 'create database neos collate utf8_unicode_ci;'
./flow cache:warmup
./flow doctrine:migrate
./flow site:import --package-key=TYPO3.NeosDemoTypo3Org

# Create the demo backend user.
./flow user:create --username=admin --password=password --first-name=John --last-name=Doe --roles=TYPO3.Neos:Administrator &

# Start the development server on which the integration tests will act on.
./flow server:run --port 8081 &
