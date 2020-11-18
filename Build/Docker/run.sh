#!/usr/bin/env bash

#
# Safe way of propagating the exit code of all commands through the script.
# Without this line, commands could fail/exit 1 and the script itself would
# complete and exit with code 0.
#
set -e

yarn install
node_modules/.bin/lerna run build --concurrency 1

echo "Please remember to set frontendDevelopmentMode to true in your Settings.yaml."
echo ""
echo "Neos:"
echo "  Neos:"
echo "    Ui:"
echo "      frontendDevelopmentMode: true"

NEOS_BUILD_ROOT=$(pwd) node_modules/.bin/webpack --progress --color --watch-poll --watch
