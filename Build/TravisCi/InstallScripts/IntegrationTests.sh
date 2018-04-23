#!/usr/bin/env bash

#
# This file serves as the finishing install script for the TravisCI `IntegrationTests` TEST_SUITE environment.
# The script will be executed in the neos instance root directory.
#

set -e

# Add the oAuth token to git to avoid errors with composer because of https://github.com/composer/composer/issues/1314
if [ -n "$GITHUB_OAUTH_TOKEN" ]; then composer config github-oauth.github.com ${GITHUB_OAUTH_TOKEN}; fi;

# Disable xDebug
phpenv config-rm xdebug.ini

# Update composer.
composer self-update -q 1.6.3

# Handle hidden files with the `mv` command.
shopt -s dotglob

# Create a separate working directory in which the neos instance can be installed in.
cd ..
if [ ! -d "Neos" ]; then mkdir Neos; fi;
cp neos-ui/Build/TravisCi/composer* Neos/
cd Neos

# Install all dependencies for the neos instance.
composer install -n

# Move our repository and the configuration files into place.
rm -rf Packages/Application/Neos.Neos.Ui
mv ../neos-ui Packages/Application/Neos.Neos.Ui

# Move the configuration files into place.
cp Packages/Application/Neos.Neos.Ui/Build/TravisCi/Settings.yaml Configuration/Settings.yaml

# Setup the database and import the demo site package.
mysql -e 'create database neos collate utf8mb4_unicode_ci;'
./flow cache:warmup
./flow doctrine:migrate
./flow site:import --package-key=Neos.Demo
./flow resource:publish

# Create the demo backend user.
./flow user:create --username=admin --password=password --first-name=John --last-name=Doe --roles=Administrator &

# Start the development server on which the integration tests will act on.
./flow server:run --port 8081 > /dev/null 2> /dev/null &

# Change into the repository directory where the environment based shell script will be executed.
cd Packages/Application/Neos.Neos.Ui

# Since all environments depend on the node dependencies, install and
# afterwards prune them to remove extranous packages from previous/cached runs.
make build-production

# Deactivate the previous enabled handling of hidden files with the `mv` command.
shopt -u dotglob
