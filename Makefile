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

install:
	yarn install

setup: check-requirements install build
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
build-react-ui-components-standalone:
	cd packages/react-ui-components && yarn run build-standalone-esm


build:
	make build-subpackages
	NEOS_BUILD_ROOT=$(shell pwd) $(webpack) --progress --colors

build-watch:
	NEOS_BUILD_ROOT=$(shell pwd) $(webpack) --progress --colors --watch

build-watch-poll:
	NEOS_BUILD_ROOT=$(shell pwd) $(webpack) \
		--progress --colors --watch-poll --watch

# clean anything before building for production just to be sure
build-production:
	make build-subpackages
	$(cross-env) NODE_ENV=production NEOS_BUILD_ROOT=$(shell pwd) \
		$(webpack) --colors


################################################################################
# Code Quality
################################################################################


storybook:
	@mkdir -p ./packages/react-ui-components/node_modules/@neos-project/ && \
		ln -s ../../../build-essentials/src \
		./packages/react-ui-components/node_modules/@neos-project/build-essentials
	$(lerna) run --scope @neos-project/react-ui-components start

test:
	$(lerna) run test --concurrency 1

test-e2e-saucelabs:
	bash Tests/IntegrationTests/e2e.sh saucelabs:chrome

test-e2e:
	bash Tests/IntegrationTests/e2e.sh chrome

lint: lint-js lint-editorconfig

lint-js:
	$(lerna) run lint --concurrency 1


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


clean:
	rm -Rf node_modules; rm -rf packages/*/node_modules
