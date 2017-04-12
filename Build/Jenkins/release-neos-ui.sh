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
#git reset --hard origin/$BRANCH

# download JQ if we don't have it yet, for manipulating composer.json
if [ ! -f "jq-linux64" ]; then
   wget https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64
   chmod +x jq-linux64
fi


# update neos-ui-compiled version
jq ".require[\"neos/neos-ui-compiled\"] = \"$VERSION\"" composer.json > composer.json.new
rm composer.json
mv composer.json.new composer.json

git add composer.json
git commit -m "Updating composer dependency for release of $VERSION"
git tag -a -m "$VERSION" $VERSION
git push origin $VERSION
