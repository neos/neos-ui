#!/usr/bin/env bash

set -e

if [ -z "$1" ]
then
    echo "No testcafe browser supplied, e.g. 'chrome:headless'"
    exit 1
fi

function dc() {
    docker-compose -f ./Tests/IntegrationTests/docker-compose.yaml $@
}

echo "#############################################################################"
echo "# Start docker environment...                                               #"
echo "#############################################################################"
dc down
dc up -d
dc exec -T php bash <<-'BASH'
    # WHY: change owner for composer cache for docker execution
    sudo chown -R docker:docker /home/circleci/
BASH
#echo docker cp $(pwd)/Tests/IntegrationTests/TestDistribution/composer.json $(dc ps -q php):/usr/src/app/composer.json
#docker cp $(pwd)/Tests/IntegrationTests/TestDistribution/composer.json $(dc ps -q php):/usr/src/app/composer.json

sleep 2

echo ""
echo "#############################################################################"
echo "# Install dependencies...                                                   #"
echo "#############################################################################"
dc exec -T php bash <<-'BASH'
    cd /usr/src/app
    mkdir -p Configuration
    sudo chown -R docker:docker .

    ln -sf /usr/src/neos-ui/Tests/IntegrationTests/TestDistribution/composer.json /usr/src/app/composer.json
    ln -sf /usr/src/neos-ui/Tests/IntegrationTests/TestDistribution/Configuration/Settings.yaml /usr/src/app/Configuration/Settings.yaml
    ln -sfn /usr/src/neos-ui/Tests/IntegrationTests/TestDistribution/DistributionPackages /usr/src/app/DistributionPackages

    composer install
BASH

echo ""
echo "#############################################################################"
echo "# Initialize Neos...                                                        #"
echo "#############################################################################"
dc exec -T php bash <<-'BASH'
    rm -rf Packages/Application/Neos.Neos.Ui
    ln -s /usr/src/neos-ui /usr/src/app/Packages/Application/Neos.Neos.Ui

    ./flow flow:cache:flush
    ./flow flow:cache:warmup
    ./flow doctrine:migrate
    ./flow user:create --username=admin --password=admin --first-name=John --last-name=Doe --roles=Administrator || true

    ./flow cr:setup --content-repository onedimension
    ./flow site:create neos-test-onedimension Neos.Test.OneDimension Neos.TestNodeTypes:Document.HomePage
    ./flow domain:add neos-test-onedimension onedimension.localhost --port 8081
    # TODO: Replace with "--assume-yes" flag once "./flow cr:prune" has one
    printf "y\n" | ./flow cr:prune --content-repository onedimension
    ./flow cr:import --content-repository onedimension --path ./DistributionPackages/Neos.Test.OneDimension/Resources/Private/Content

    ./flow cr:setup --content-repository twodimensions
    ./flow site:create neos-test-twodimensions Neos.Test.TwoDimensions Neos.TestNodeTypes:Document.HomePage
    ./flow domain:add neos-test-twodimensions twodimensions.localhost --port 8081
    # TODO: Replace with "--assume-yes" flag once "./flow cr:prune" has one
    printf "y\n" | ./flow cr:prune --content-repository twodimensions
    ./flow cr:import --content-repository twodimensions --path ./DistributionPackages/Neos.Test.TwoDimensions/Resources/Private/Content

    ./flow resource:publish
BASH

echo ""
echo "#############################################################################"
echo "# Start Flow Server...                                                      #"
echo "#############################################################################"
dc exec -T php bash <<-'BASH'
    ./flow server:run --port 8081 --host 0.0.0.0 &
BASH

echo ""
echo "#############################################################################"
echo "# Run E2E tests...                                                          #"
echo "#############################################################################"
yarn run testcafe "$1" "$(pwd)/Tests/IntegrationTests/Fixtures/*/*.e2e.js" \
    --selector-timeout=10000 --assertion-timeout=30000 --debug-on-fail
