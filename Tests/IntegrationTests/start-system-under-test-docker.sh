#!/usr/bin/env bash

set -e

function dc() {
    docker-compose -f ./Tests/IntegrationTests/docker-compose.system-under-test.yaml $@
}

echo "#############################################################################"
echo "# Start docker environment...                                               #"
echo "#############################################################################"
dc down
dc up -d
dc exec -T php bash <<-'BASH'
    rm -rf /usr/src/app/*
BASH
docker cp "$(pwd)"/Tests/IntegrationTests/. "$(dc ps -q php)":/usr/src/app
sleep 2

echo ""
echo "#############################################################################"
echo "# Install dependencies...                                                   #"
echo "#############################################################################"
dc exec -T php bash <<-'BASH'
    cd /usr/src/app
    sudo chown -R docker:docker .
    sudo chown -R docker:docker /home/circleci/
    cd TestDistribution
    composer install
BASH

echo ""
echo "#############################################################################"
echo "# Initialize Neos...                                                        #"
echo "#############################################################################"
dc exec -T php bash <<-'BASH'
    cd TestDistribution
    # replace installed Neos Ui with local dev via sym link to mounted volume
    # WHY: We want changes of dev to appear in system under test without rebuilding the whole system
    rm -rf Packages/Application/Neos.Neos.Ui
    ln -s /usr/src/neos-ui/ /usr/src/app/TestDistribution/Packages/Application/Neos.Neos.Ui
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

dc exec -T php bash <<-BASH
    mkdir -p ./TestDistribution/DistributionPackages

    rm -rf ./TestDistribution/DistributionPackages/Neos.TestNodeTypes
    ln -s "../../SharedNodeTypesPackage" ./TestDistribution/DistributionPackages/Neos.TestNodeTypes

    rm -rf ./TestDistribution/DistributionPackages/Neos.TestSite
    ln -s "../../Fixtures/1Dimension/SitePackage" ./TestDistribution/DistributionPackages/Neos.TestSite

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
