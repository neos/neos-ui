#!/usr/bin/env bash

#
# Safe way of propagating the exit code of all commands through the script.
# Without this line, commands could fail/exit 1 and the script itself would
# complete and exit with code 0.
#
set -e

#
# This file serves as the script for the TravisCI `Docker` TEST_SUITE environment.
# The script will be executed in the package working directory.
#

docker-compose up
