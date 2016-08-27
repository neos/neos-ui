#!/usr/bin/env bash

#
# Safe way of propagating the exit code of all commands through the script.
# Without this line, commands could fail/exit 1 and the script itself would
# complete and exit with code 0.
#
set -e

#
# This file serves as the script for the TravisCI `UnitTests` TEST_SUITE environment.
# The script will be executed in the package working directory.
#

#
# Until the test stack works again, do a build of the application instead to
# have at least some kind of testing in regards to webpack and the dependency tree.
#
npm run build

# Execute the unit tests.
# npm run karma
