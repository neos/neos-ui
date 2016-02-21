#!/usr/bin/env bash

#
# This file serves as the after_script for the TravisCI `UnitTests` TEST_SUITE environment.
# The script will be executed in the package working directory.
#

# Publish the code coverage to codeclimate.com once the tests have passed.
npm install -g codeclimate-test-reporter
mv Coverage/**/lcov.info .
codeclimate-test-reporter < lcov.info
