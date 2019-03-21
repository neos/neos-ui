#!/usr/bin/env bash

set -e

#
# This file serves as the script for the TravisCI `IntegrationTests` TEST_SUITE environment.
# The script will be executed in the package working directory.
#

curl http://127.0.0.1:8081/neos/login
make test-e2e
