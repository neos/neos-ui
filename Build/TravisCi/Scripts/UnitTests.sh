#!/usr/bin/env bash

#
# This file serves as the script for the TravisCI `UnitTests` TEST_SUITE environment.
# The script will be executed in the package working directory.
#

# Execute the unit tests.
npm run karma

# Publish the code coverage to codeclimate.com once the tests have passed.
# This was originally placed in the after_script section, but since we
# split our test suite into parallel VMs, we need to execute it in the main shell script.
npm install -g codeclimate-test-reporter
mv Coverage/**/lcov.info .
codeclimate-test-reporter < lcov.info
