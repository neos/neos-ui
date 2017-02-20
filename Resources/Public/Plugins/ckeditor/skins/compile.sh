#!/bin/bash

rm -rf ./neos-build;
java -jar ckbuilder.jar --build-skin neos neos-build
