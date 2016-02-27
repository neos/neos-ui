#!/usr/bin/env bash

#
# This file serves as the script for the TravisCI `CodeStyle` TEST_SUITE environment.
# The script will be executed in the package working directory.
#
npm run lint:scripts
npm run lint:css
