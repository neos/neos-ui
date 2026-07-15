# reference: https://frankenphp.dev/docs/docker/
# The tags follow this pattern: dunglas/frankenphp:<frankenphp-version>-php<php-version>-<os>
FROM dunglas/frankenphp:1-php8.2-trixie

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

# reference: https://github.com/mlocati/docker-php-extension-installer
# `gd` is required for the Imagine driver configured in Settings.yaml (driver: Gd).
RUN install-php-extensions \
    intl \
    pdo_mysql \
    gd \
    redis

RUN apt update \
    && apt install -y git unzip mariadb-client \
    && apt clean \
    && rm -rf /var/lib/apt/lists/*

# Add config files
COPY Tests/E2E/system_under_test/sut_file_system_overrides/ /

ARG USER=www-data
RUN \
    useradd ${USER}; \
    mkdir -p /app/Data  /app/Web/_Resources /composer_cache \
    && chown -R ${USER}:${USER} /app /composer_cache /config/caddy /data/caddy \
    && chmod +x /entrypoint.sh

WORKDIR /app
USER ${USER}

ENTRYPOINT ["/entrypoint.sh"]
