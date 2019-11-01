#!/usr/bin/env bash

set -e

# This script setups the Neos Test Distribution in order to be able to run E2E tests
# Please make sure to adjust the database settings in Configuration/Settings.yaml

composer install
cd Packages/Application/Neos.Neos.Ui
make setup
cd ../../..
./flow doctrine:migrate
./flow flow:cache:flush
./flow user:create --username=admin --password=password --first-name=John --last-name=Doe --roles=Administrator || true

echo ""
echo "The setup is complete!"
echo "To run E2E test suite execute:"
echo "    cd Packages/Application/Neos.Neos.Ui && make test-e2e"
echo ""

./flow server:run --port 8081
