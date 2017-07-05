#!/bin/bash

echo 'Welcome! You want to do a release? Great!'
echo ''
echo 'You need to do some manual work currently still (to update the NPM registry). In the longer term, we can automate this for sure.'
echo '1) TEST the NPM publishing - ADJUST the "repo-version" to the version you want to use'
echo '     node_modules/.bin/lerna publish --skip-git --exact --repo-version=1.0.0-beta2 --yes --force-publish --skip-npm'
echo '2) publish to NPM by RE-RUNNING the last command and OMITTING the "--skip-npm" argument.'
echo '     (see above)'
echo '3) commit the resulting changes'
echo '     git commit -am "Preparing release 1.0.0-beta2"'
echo '     git push'
echo '4) trigger the Jenkins build'
exit;
