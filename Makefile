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
lerna = ./node_modules/.bin/lerna
editorconfigChecker = ./node_modules/.bin/editorconfig-checker
webpack = ./node_modules/.bin/webpack
crossenv = ./node_modules/.bin/crossenv

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
	$(lerna) run build --concurrency 1
	make build-react-ui-components-standalone

# we build the react UI components ready for standalone usage;
# so that they can be published on NPM properly.
build-react-ui-components-standalone: ## Build the react UI components ready for standalone usage.
	cd packages/react-ui-components && yarn run build-standalone-esm


build: ## Runs the development build.
	make build-subpackages
	NEOS_BUILD_ROOT=$(shell pwd) $(webpack) --progress --color

build-watch: ## Watches the source files for changes and runs a build in case.
	NEOS_BUILD_ROOT=$(shell pwd) $(webpack) --progress --color --watch

build-watch-poll: ## Watches (and polls) the source files on a file share.
	NEOS_BUILD_ROOT=$(shell pwd) $(webpack) \
		--progress --color --watch-poll --watch

# clean anything before building for production just to be sure
build-production: ## Runs the production build.
	make build-subpackages
	$(cross-env) NODE_ENV=production NEOS_BUILD_ROOT=$(shell pwd) \
		$(webpack) --color


################################################################################
# Code Quality
################################################################################


storybook: ## Starts the storybook server on port 9001.
	@mkdir -p ./packages/react-ui-components/node_modules/@neos-project/ && \
		ln -s ../../../build-essentials/src \
		./packages/react-ui-components/node_modules/@neos-project/build-essentials
	$(lerna) run --scope @neos-project/react-ui-components start

test: ## Executes the unit test on all source files.
	$(lerna) run test --concurrency 1

test-e2e-saucelabs: ## Executes integration tests on saucelabs.
	bash Tests/IntegrationTests/e2e.sh saucelabs:chrome

test-e2e: ## Executes integration tests locally.
	bash Tests/IntegrationTests/e2e.sh chrome

lint: lint-js lint-editorconfig ## Executes make lint-js and make lint-editorconfig.

lint-js: ## Runs lint test in all subpackages via lerna.
	$(lerna) run lint --concurrency 1


lint-editorconfig: ## Tests if all files respect the .editorconfig.
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
	$(lerna) publish \
		--skip-git --exact --repo-version=$(VERSION) \
		--yes --force-publish --skip-npm
	./Build/createVersionFile.sh

publish-npm: called-with-version
	$(lerna) publish --skip-git --exact --repo-version=$(VERSION) \
		--yes --force-publish

################################################################################
# Misc
################################################################################


clean: ## Cleans dependency folders
	rm -Rf node_modules; rm -rf packages/*/node_modules


################################################################################
# help command as default
################################################################################
help:
	@echo CLI command list of neos-ui:
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
