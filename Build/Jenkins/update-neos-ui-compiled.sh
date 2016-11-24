#!/usr/bin/env bash

# break on failures
set -e

# go to root directory of Neos.Neos.Ui
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/../../

# load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use

CURRENT_BRANCH_TAG_NAME=`git symbolic-ref -q --short HEAD || git describe --tags --exact-match`
GIT_SHA1=`git rev-parse HEAD`


if [ "$CURRENT_BRANCH_TAG_NAME" != "master" ]; then
    echo "Current branch name is $CURRENT_BRANCH_TAG_NAME; the script only runs on master so far."
    exit 1
fi

npm install
npm run build

rm -Rf tmp_compiled_pkg
git clone git@github.com:neos/neos-ui-compiled.git tmp_compiled_pkg
mkdir -p tmp_compiled_pkg/Resources/Public/JavaScript
mkdir -p tmp_compiled_pkg/Resources/Public/Styles

cp -Rf Resources/Public/JavaScript/* tmp_compiled_pkg/Resources/Public/JavaScript
cp -Rf Resources/Public/Styles/* tmp_compiled_pkg/Resources/Public/Styles

cd tmp_compiled_pkg
git add Resources/Public/
git commit -m "Compile Neos UI - $CURRENT_BRANCH_TAG_NAME / $GIT_SHA1"
git push
