#!/bin/bash
set -eou pipefail

composer config repositories.package '{ "type": "path", "url": "/neos-ui", "options": { "symlink": false } }'
composer install

./flow flow:cache:flush
./flow flow:cache:warmup

echo "Waiting for database..."
until mariadb -h"${DB_NEOS_HOST}" -P"${DB_NEOS_PORT}" -u"${DB_NEOS_USER}" -p"${DB_NEOS_PASSWORD}" -D"${DB_NEOS_DATABASE}" --disable-ssl --silent -e "SELECT 1;" 1>/dev/null 2>/dev/null; do
  sleep 2
done
echo "Database is ready."

./flow doctrine:migrate

yes y | ./flow resource:clean || true

./flow cr:setup
./flow cr:status

./flow cr:setup --content-repository onedimension
./flow site:importall --content-repository onedimension --path ./DistributionPackages/Neos.Test.OneDimension/Resources/Private/Content

./flow cr:setup --content-repository twodimensions
./flow site:importall --content-repository twodimensions --path ./DistributionPackages/Neos.Test.TwoDimensions/Resources/Private/Content

./flow resource:publish

frankenphp run --config /etc/frankenphp/Caddyfile
