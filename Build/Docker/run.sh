#!/usr/bin/env bash

#
# Safe way of propagating the exit code of all commands through the script.
# Without this line, commands could fail/exit 1 and the script itself would
# complete and exit with code 0.
#
set -e

cd Packages/Application/Neos.Neos.Ui

yarn
yarn workspaces foreach run build

echo "Please remember to set frontendDevelopmentMode to true in your Settings.yaml."
echo ""
echo "Neos:"
echo "  Neos:"
echo "    Ui:"
echo "      frontendDevelopmentMode: true"

NEOS_BUILD_ROOT=$(pwd) node_modules/.bin/webpack --progress --color --watch
