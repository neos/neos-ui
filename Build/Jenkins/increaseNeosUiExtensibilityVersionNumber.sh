#!/bin/bash

command -v jq >/dev/null 2>&1 || { echo >&2 "I require jq but it's not installed.  Aborting."; exit 1; }
if [ -z "$1" ]; then echo "\$VERSION not given. Aborting."; exit 1; fi

VERSION=$1

function updateVersionInPackageJson {
    # $1 = path-to-package
    pushd $1

    jq ".dependencies[\"@neos-project/neos-ui-extensibility\"] = \"$VERSION\"" package.json > package.json.new
    rm package.json
    mv package.json.new package.json

    popd
}


# go to root directory of Neos.Neos.Ui
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/../../

# update neos-ui-extensibility package version
cd packages/neos-ui-extensibility
jq ".version = \"$VERSION\"" package.json > package.json.new
rm package.json
mv package.json.new package.json
cd ../../

# update dependent package versions
updateVersionInPackageJson packages/neos-ui
updateVersionInPackageJson packages/neos-ui-backend-connector
updateVersionInPackageJson packages/neos-ui-ckeditor-bindings
updateVersionInPackageJson packages/neos-ui-containers
updateVersionInPackageJson packages/neos-ui-contentrepository
updateVersionInPackageJson packages/neos-ui-editors
updateVersionInPackageJson packages/neos-ui-i18n
updateVersionInPackageJson packages/neos-ui-redux-store
updateVersionInPackageJson packages/neos-ui-validators
updateVersionInPackageJson packages/neos-ui-views
