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
	build build-watch build-watch-poll build-production \
	storybook test test-e2e lint lint-js lint-editorconfig \
	called-with-version bump-version publish-npm \
	clean

################################################################################
# Variables
################################################################################


# Add lerna alias as there are currently some MacOS problems
# and putting it into the $PATH is simply not enough
editorconfigChecker = ./node_modules/.bin/editorconfig-checker
webpack = ./node_modules/.bin/webpack
crossenv = ./node_modules/.bin/crossenv

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


# TODO: figure out how to pass a parameter to other targets to reduce redundancy
build-subpackages:
	yarn workspaces foreach run build
	make build-react-ui-components-standalone

# we build the react UI components ready for standalone usage;
# so that they can be published on NPM properly.

## Build the react UI components ready for standalone usage.
build-react-ui-components-standalone:
	yarn workspace @neos-project/react-ui-components build-standalone-esm

## Runs the development build.
build:
	make build-subpackages
	NEOS_BUILD_ROOT=$(shell pwd) $(webpack) --progress --color

## Watches the source files for changes and runs a build in case.
build-watch:
	NEOS_BUILD_ROOT=$(shell pwd) $(webpack) --progress --color --watch

## Watches (and polls) the source files on a file share.
build-watch-poll:
	NEOS_BUILD_ROOT=$(shell pwd) $(webpack) \
		--progress --color --watch-poll --watch

# clean anything before building for production just to be sure
## Runs the production build.
build-production:
	make build-subpackages
	$(cross-env) NODE_ENV=production NEOS_BUILD_ROOT=$(shell pwd) \
		$(webpack) --color


################################################################################
# Code Quality
################################################################################

## Starts the storybook server on port 9001.
storybook:
	@mkdir -p ./packages/react-ui-components/node_modules/@neos-project/ && \
		ln -s ../../../build-essentials/src \
		./packages/react-ui-components/node_modules/@neos-project/build-essentials
	yarn workspace @neos-project/react-ui-components start

## Executes the unit test on all source files.
test:
	yarn workspaces foreach run test

## Executes integration tests on saucelabs.
test-e2e-saucelabs:
	bash Tests/IntegrationTests/e2e.sh saucelabs:chrome

## Executes integration tests locally.
test-e2e:
	bash Tests/IntegrationTests/e2e.sh chrome

## Executes integration tests locally in a docker-compose setup.
test-e2e-docker:
	@bash Tests/IntegrationTests/e2e-docker.sh $(or $(browser),chromium)

## Executes make lint-js and make lint-editorconfig.
lint: lint-js lint-editorconfig

## Runs lint test in all subpackages via lerna.
lint-js:
	yarn workspaces foreach run lint

## Tests if all files respect the .editorconfig.
lint-editorconfig:
	$(editorconfigChecker) -config .ecrc.json

################################################################################
# Releasing
################################################################################


called-with-version:
ifeq ($(VERSION),)
	@echo No version information given.
	@echo Please run this command like this:
	@echo VERSION=1.0.0 make release
	@false
endif

bump-version: called-with-version
	yarn workspaces foreach run publish \
		--skip-git --exact --repo-version=$(VERSION) \
		--yes --force-publish --skip-npm
	./Build/createVersionFile.sh

publish-npm: called-with-version
	yarn workspaces foreach run publish --skip-git --exact --repo-version=$(VERSION) \
		--yes --force-publish

################################################################################
# Misc
################################################################################

## Cleans dependency folders
clean:
	rm -Rf node_modules; rm -rf packages/*/node_modules


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
	@awk '/^[a-zA-Z\-\_0-9]+:/ { \
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
