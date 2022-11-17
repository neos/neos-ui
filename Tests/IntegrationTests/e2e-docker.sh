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
    rm -rf /home/circleci/project/*
BASH
docker cp $(pwd)/Tests/IntegrationTests/. $(dc ps -q php):/home/circleci/project
sleep 2

echo ""
echo "#############################################################################"
echo "# Install dependencies...                                                   #"
echo "#############################################################################"
dc exec -T php bash <<-'BASH'
    sudo chown -R circleci:circleci /home/circleci
    cd TestDistribution
    composer install
BASH

echo ""
echo "#############################################################################"
echo "# Initialize Neos...                                                        #"
echo "#############################################################################"
docker cp $(pwd)/. $(dc ps -q php):/home/circleci/project/TestDistribution/Packages/Application/neos-ui
dc exec -T php bash <<-'BASH'
    cd TestDistribution
    rm -rf Packages/Application/Neos.Neos.Ui
    mv Packages/Application/neos-ui Packages/Application/Neos.Neos.Ui
    sed -i 's/host: 127.0.0.1/host: db/g' Configuration/Settings.yaml
    ./flow flow:cache:flush
    ./flow flow:cache:warmup
    ./flow doctrine:migrate
    ./flow user:create --username=admin --password=password --first-name=John --last-name=Doe --roles=Administrator || true
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
    dc exec -T php bash <<-BASH
        mkdir -p ./TestDistribution/DistributionPackages

        rm -rf ./TestDistribution/DistributionPackages/Neos.TestNodeTypes
        ln -s "../../SharedNodeTypesPackage" ./TestDistribution/DistributionPackages/Neos.TestNodeTypes

        rm -rf ./TestDistribution/DistributionPackages/Neos.TestSite
        ln -s "../../Fixtures/$(basename $fixture)/SitePackage" ./TestDistribution/DistributionPackages/Neos.TestSite

        # TODO: optimize this
        cd TestDistribution
        composer reinstall neos/test-nodetypes
        composer reinstall neos/test-site
        ./flow flow:cache:flush --force
        ./flow flow:cache:warmup
        ./flow configuration:show --path Neos.ContentRepository.contentDimensions

        if ./flow site:list | grep -q 'Node name'; then
            ./flow site:prune '*'
        fi
        ./flow site:import --package-key=Neos.TestSite
        ./flow resource:publish
BASH

    yarn run testcafe "$1" "${fixture}*.e2e.js" \
        --selector-timeout=10000 --assertion-timeout=30000 --debug-on-fail
done
