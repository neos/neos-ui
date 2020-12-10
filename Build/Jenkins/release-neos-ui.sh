#!/usr/bin/env bash

#
# Releases a new version of Neos UI
#
# Expects the following environment variables:
#
# VERSION          the version that is "to be released"
# BRANCH           the branch that is worked on

# break on all failures
set -xe

if [ -z "$VERSION" ]; then echo "\$VERSION not set"; exit 1; fi
if [ -z "$BRANCH" ]; then echo "\$BRANCH not set"; exit 1; fi


# go to root directory of Neos.Neos.Ui
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/../../

# go to $BRANCH
git reset --hard origin/$BRANCH

# install yarn if not already
path_to_yarn=$(which yarn)
if [ -z "$path_to_yarn" ] ; then
    echo "installing yarn:"
    npm install -g yarn
fi

# Load bashrc to have nvm available
source ~/.bashrc

# switch node version
nvm install
nvm use

# install dependencies and login to npm
make install
NPM_EMAIL=hello@neos.io ./node_modules/.bin/npm-cli-login

# acutal release process

# build
make build-production

# code quality
make lint
make test

# publishing
VERSION=$VERSION make bump-version
VERSION=$VERSION make publish-npm

# add changes to git and push
git add .
git commit -m "Updating composer dependency and npm versions for release of $VERSION"

git push origin HEAD:$BRANCH
git tag -a -m "$VERSION" $VERSION
git push origin $VERSION
