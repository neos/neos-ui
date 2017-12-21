#!/usr/bin/env bash

# abort script if any command returns non-zero
set -e

# file to read the version information from
SOURCE_FILE='./packages/neos-ui/package.json'
# file to write the version information to
TARGET_FILE='./packages/utils-helpers/src/getVersion.js'

# -e = if file exists
if [[ -e $SOURCE_FILE && -e $TARGET_FILE ]]; then
    currentVersion=$(cat $SOURCE_FILE \
        | grep version \
        | head -1 \
        | awk -F: '{ print $2 }' \
        | sed 's/[",]//g' \
        | sed 's/\s//g')

    echo replace version in $TARGET_FILE with v$currentVersion

    # -i.tmp creates a tmp file, needed for
    # freebsd grep version (mac)
    sed -i.tmp "s/'.*';/'v$currentVersion';/" $TARGET_FILE

    # remove tmp file
    rm $TARGET_FILE.tmp
fi
