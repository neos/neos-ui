#!/usr/bin/env bash

# abort script if any command returns non-zero
set -e

# Bump version of packages
if [[ $VERSION ]]; then
    yarn version $VERSION
    for name in packages/*; do
      if [ -d "$name" ] && [ ! -L "$name" ]; then
        printf 'Change version of %s to %s \n' "$name" "$VERSION"
        cd $name && yarn version $VERSION
        cd ../..
      fi
    done
fi

exit 0
