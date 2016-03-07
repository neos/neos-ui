#!/usr/bin/env bash
if [ "$CI" = true ]
then
  npm run build
else
  npm run watch:build
fi
