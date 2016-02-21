#!/usr/bin/env bash

#
# This file serves as the script for the TravisCI `IntegrationTests` TEST_SUITE environment.
# The script will be executed in the package working directory.
#

# Build the assets and execute the integration tests.
npm run build
npm run selenium:run
