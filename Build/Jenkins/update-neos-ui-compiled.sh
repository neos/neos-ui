#!/usr/bin/env bash

if [ -z "$GIT_BRANCH" ]; then echo "\$GIT_BRANCH not set"; exit 1; fi

# go to root directory of Neos.Neos.Ui
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/../../

# load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

nvm install
nvm use
npm install -g yarn
# break on failures can only be applied AFTER nvm was loaded.
set -xe
GIT_SHA1=`git rev-parse HEAD`
GIT_TAG=`git describe --exact-match HEAD 2>/dev/null || true`

yarn install
yarn build

rm -Rf tmp_compiled_pkg
git clone git@github.com:neos/neos-ui-compiled.git tmp_compiled_pkg
mkdir -p tmp_compiled_pkg/Resources/Public/JavaScript
mkdir -p tmp_compiled_pkg/Resources/Public/Styles

cp -Rf Resources/Public/JavaScript/* tmp_compiled_pkg/Resources/Public/JavaScript
cp -Rf Resources/Public/Styles/* tmp_compiled_pkg/Resources/Public/Styles

cd tmp_compiled_pkg
git add Resources/Public/
git commit -m "Compile Neos UI - $GIT_SHA1" || true

if [ "$GIT_BRANCH" == "origin/master" ]; then
  echo "Git branch $GIT_BRANCH found, pushing to this branch."
  git push origin HEAD:${GIT_BRANCH#*/}
fi

if [ "$GIT_TAG" != "" ]; then
  echo "Git tag $GIT_TAG found; also tagging the UI-compiled package."
  git tag -a -m "$GIT_TAG" $GIT_TAG
  git push origin $GIT_TAG
fi
