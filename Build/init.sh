#!/usr/bin/env bash

#
# Safe way of propagating the exit code of all commands through the script.
# Without this line, commands could fail/exit 1 and the script itself would
# complete and exit with code 0.
#
set -e

#
# Make sure the node & npm version matches our required constraints.
#
nvm install
nvm use

#
# First of, install all application dependencies.
#
npm install

#
# Prune the node directory in case npm did something unexpected.
#
npm prune
