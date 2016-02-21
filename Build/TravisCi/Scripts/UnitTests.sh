#!/usr/bin/env bash

#
# This file serves as the script for the TravisCI `UnitTests` TEST_SUITE environment.
# The script will be executed in the package working directory.
#

# Execute the unit tests.
npm run karma
