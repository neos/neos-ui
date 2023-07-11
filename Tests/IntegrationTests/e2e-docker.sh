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
    rm -rf /usr/src/app/*
BASH
docker cp $(pwd)/Tests/IntegrationTests/. $(dc ps -q php):/usr/src/app
sleep 2

echo ""
echo "#############################################################################"
echo "# Install dependencies...                                                   #"
echo "#############################################################################"
dc exec -T php bash <<-'BASH'
    cd /usr/src/app
    sudo chown -R docker:docker .
    # WHY: change owner for composer cache for docker execution
    sudo chown -R docker:docker /home/circleci/
    cd TestDistribution
    composer install
BASH

echo ""
echo "#############################################################################"
echo "# Initialize Neos...                                                        #"
echo "#############################################################################"
docker cp $(pwd)/. $(dc ps -q php):/usr/src/app/TestDistribution/Packages/Application/neos-ui
dc exec -T php bash <<-'BASH'
    cd TestDistribution
    rm -rf Packages/Application/Neos.Neos.Ui
    mv Packages/Application/neos-ui Packages/Application/Neos.Neos.Ui
    sed -i 's/host: 127.0.0.1/host: db/g' Configuration/Settings.yaml
    ./flow flow:cache:flush
    ./flow flow:cache:warmup
    ./flow doctrine:migrate
    ./flow user:create --username=admin --password=password --first-name=John --last-name=Doe --roles=Administrator || true

    ./flow cr:setup --content-repository onedimension
    ./flow site:create neos-test-onedimension Neos.Test.OneDimension Neos.TestNodeTypes:Document.Page
    ./flow domain:add neos-test-onedimension onedimension.localhost --port 8081
    # TODO: Replace with "--assume-yes" flag once "./flow cr:prune" has one
    printf "y\n" | ./flow cr:prune --content-repository onedimension
    ./flow cr:import --content-repository onedimension --path ./DistributionPackages/Neos.Test.OneDimension/Resources/Private/Content

    ./flow cr:setup --content-repository twodimensions
    ./flow site:create neos-test-twodimensions Neos.Test.TwoDimensions Neos.TestNodeTypes:Document.Page
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
    cd TestDistribution
    ./flow server:run --port 8081 --host 0.0.0.0 &
BASH

echo ""
echo "#############################################################################"
echo "# Run E2E tests...                                                          #"
echo "#############################################################################"
for fixture in $(pwd)/Tests/IntegrationTests/Fixtures/*/; do
    echo ""
    echo "########################################"
    echo "# Fixture '$(basename $fixture)'"
    echo "########################################"

    yarn run testcafe "$1" "${fixture}*.e2e.js" \
        --selector-timeout=10000 --assertion-timeout=30000 --debug-on-fail
done
