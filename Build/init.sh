#!/usr/bin/env bash

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
