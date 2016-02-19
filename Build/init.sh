#!/usr/bin/env bash

#
# Make sure the node & npm version matches our required constraints.
#
nvm use

#
# First of, install all application depedencies.
#
npm install

#
# Prune the node directory in case npm did something unexpected.
#
npm prune
