#!/usr/bin/env bash

set -e

#
# This file serves as the script for the TravisCI `IntegrationTests` TEST_SUITE environment.
# The script will be executed in the package working directory.
#

yarn testcafe chrome:headless Tests/IntegrationTests/*
