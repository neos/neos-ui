################################################################################
#
#			888b      88 88888888888 ,ad8888ba,    ad88888ba
#			8888b     88 88         d8"'    `"8b  d8"     "8b
#			88 `8b    88 88        d8'        `8b y8,
#			88  `8b   88 88aaaaa   88          88 `y8aaaaa,
#			88   `8b  88 88"""""   88          88   `"""""8b,
#			88    `8b 88 88        y8,        ,8p         `8b
#			88     `8888 88         y8a.    .a8p  y8a     a8p
#			88      `888 88888888888 `"Y8888Y"'    "Y88888P"
#
#							   <Makefile>
#
#							88        88 88
#							88        88 88
#							88        88 88
#							88        88 88
#							88        88 88
#							88        88 88
#							Y8a.    .a8P 88
#							 `"Y8888Y"'  88
#
#
################################################################################


################################################################################
# Make ALL targets phony targets (Rebuild every time)
################################################################################

.PHONY: check-requirements install setup \
	build build-watch build-production \
	test test-e2e lint lint-js lint-editorconfig \
	called-with-version bump-version publish-npm \
	clean

################################################################################
# Variables
################################################################################


# Add alias as there are currently some MacOS problems
# and putting it into the $PATH is simply not enough
editorconfigChecker = ./node_modules/.bin/editorconfig-checker
# Define colors
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
RESET  := $(shell tput -Txterm sgr0)

################################################################################
# Setup
################################################################################


check-requirements:
	@which yarn &>/dev/null || \
		(echo yarn is not installed: https://github.com/yarnpkg/yarn && false)

install: ## Install dependencies
	yarn install

setup: check-requirements install build ## Run a clean setup
	@echo Please remember to set frontendDevelopmentMode \
		to true in your Settings.yaml.
	@echo
	@echo 'Neos:'
	@echo '  Neos:'
	@echo '    Ui:'
	@echo '      frontendDevelopmentMode: true'


################################################################################
# Builds
################################################################################

# Builds the subpackages for standalone use.
build-subpackages:
	yarn workspaces foreach --parallel run build

## Runs the development build.
build:
	node esbuild.js

## Watches the source files for changes and runs a build in case.
build-watch:
	node esbuild.js --watch

# clean anything before building for production just to be sure
## Runs the production build. And also builds the subpackages for standalone use.
build-production:
	node esbuild.js --production
	make build-subpackages

build-e2e-testing:
	node esbuild.js --production --e2e-testing

################################################################################
# Code Quality
################################################################################

## Executes the unit test on all source files.
test:
	yarn test

## Executes integration tests on saucelabs.
test-e2e-saucelabs:
	bash Tests/IntegrationTests/e2e.sh "saucelabs:chrome:Windows 10"

## Executes integration tests locally.
test-e2e:
	bash Tests/IntegrationTests/e2e.sh chrome

## Executes integration tests locally in a docker-compose setup.
#
# Note: On mac os you might need those two additional `/etc/hosts` entries:
# 	127.0.0.1 onedimension.localhost
# 	127.0.0.1 twodimensions.localhost
test-e2e-docker: build-e2e-testing
	@bash Tests/IntegrationTests/e2e-docker.sh $(or $(browser),chrome)

start-neos-dev-instance:
	bash Tests/IntegrationTests/start-neos-dev-instance.sh

## Executes make lint-js and make lint-editorconfig.
lint: lint-js lint-editorconfig

## Runs lint test in all subpackages
lint-js:
	yarn run lint

## Tests if all files respect the .editorconfig.
lint-editorconfig:
	# TODO: editorconfig-checker seems broken in node >14
	# see https://github.com/editorconfig-checker/editorconfig-checker/issues/178
	# $(editorconfigChecker) -config .ecrc.json

################################################################################
# Releasing
################################################################################


called-with-version:
ifeq ($(VERSION),)
	@echo No version information given.
	@echo Please run this command like this:
	@echo VERSION=1.0.0 make bump-version
	@false
endif

bump-version: called-with-version
	yarn workspaces foreach version $(VERSION) --deferred
	yarn version apply --all

publish-npm: called-with-version
	yarn workspaces foreach --no-private npm publish --access public

################################################################################
# Misc
################################################################################

clean:
	@echo you might want to use the following git command to clear some ignored files interactively
	@echo ''
	@echo git clean -idX

################################################################################
# help command as default
################################################################################

# define indention for descriptions
TARGET_MAX_CHAR_NUM=40

## Show help
help:
	@echo ''
	@echo '${GREEN}CLI command list of neos-ui:${RESET}'
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk '/^[a-zA-Z0-9_-]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")-1); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "  ${YELLOW}%-$(TARGET_MAX_CHAR_NUM)s${RESET} ${GREEN}%s${RESET}\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)
	@echo ''

.DEFAULT_GOAL := help
