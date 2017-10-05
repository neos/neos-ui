#!/usr/bin/env bash

#
# This file serves as the finishing install script for the TravisCI `IntegrationTests` TEST_SUITE environment.
# The script will be executed in the neos instance root directory.
#

set -e

# Temporarily move the neos-ui package out so it doesn't get overwritten by composer
mv Packages/Application/Neos.Neos.Ui temp
# Install all dependencies for the neos instance.
composer install -q -n

rm -rf Packages/Application/Neos.Neos.Ui
mv temp Packages/Application/Neos.Neos.Ui

# Move the configuration files into place.
cp Packages/Application/Neos.Neos.Ui/Build/TravisCi/Settings.yaml Configuration/Settings.yaml

# Patch template to include script to fail on console.error.
# TODO: Can be removed when this is implemented: https://github.com/DevExpress/testcafe/issues/1738
sed -i 's/<title>/<script><![CDATA[ const originalError = console.error; console.error = (msg, trace) => { if (msg === "uncaught") { throw new Error(trace);} else { throw new Error(msg);}};]]><\/script>\r\n<title>/g' Packages/Application/Neos.Neos.Ui/Resources/Private/Templates/Backend/Index.html

# Setup the database and import the demo site package.
mysql -e 'create database neos collate utf8_unicode_ci;'
./flow cache:warmup
./flow doctrine:migrate
./flow site:import --package-key=Neos.Demo
./flow resource:publish

# Create the demo backend user.
./flow user:create --username=admin --password=password --first-name=John --last-name=Doe --roles=Administrator &

# Start the development server on which the integration tests will act on.
./flow server:run --port 8081 > /dev/null 2> /dev/null &
