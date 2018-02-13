#!/usr/bin/env bash

set -e

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
# ToDo: We should use the npm module `husky` to do this for us instead of relying on native unix commands.
#
cd .git/hooks && ln -sf ../../Build/GitHooks/* . && cd -
