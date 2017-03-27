#!/usr/bin/env bash

#
# Make sure the node & npm version matches our required constraints.
#
nvm install
nvm use

# check if yarn is installed, else install it
which yarn &>/dev/null

if [ $? -ne 0 ];
then
    sudo npm install -g yarn
fi

#
# First of, install all application dependencies.
# install is the default of yarn
#
yarn

#
# Copy githooks
#

# get the directory of this script no matter where it is called from
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cp -f $DIR/GitHooks/* $DIR/../.git/hooks/
