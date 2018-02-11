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
# Variables
################################################################################


# Add node_modules and composer binaries to $PATH
export PATH := $(PATH):./node_modules/.bin:./bin

# Expected and used node version
EXPECTED_NODE_VERSION = v8.9.4
CURRENT_NODE_VERSION = $(shell node -v)


################################################################################
# Setup
################################################################################


check-requirements:
ifneq ($(CURRENT_NODE_VERSION),$(EXPECTED_NODE_VERSION))
	@echo Your node version differs from the one we expect.
	@echo We expect $(EXPECTED_NODE_VERSION) \
		and you are using $(CURRENT_NODE_VERSION)
	@echo Please install the correct node version.
	@echo consider using nvm: https://github.com/creationix/nvm
	@false
endif

	@which yarn &>/dev/null || \
		(echo yarn is not installed: https://github.com/yarnpkg/yarn && false)

	@echo Please remember to set frontendDevelopmentMode \
		to true in your Settings.yaml.
	@echo
	@echo 'Neos:'
	@echo '  Neos:'
	@echo '    Ui:'
	@echo '      frontendDevelopmentMode: true'

install:
	yarn install

setup: check-requirements install build


################################################################################
# Builds
################################################################################


# TODO: figure out how to pass a parameter to other targets to reduce redundancy
build:
	NEOS_BUILD_ROOT=$(shell pwd) webpack --progress --colors

build-watch:
	NEOS_BUILD_ROOT=$(shell pwd) webpack --progress --colors --watch

build-watch-poll:
	NEOS_BUILD_ROOT=$(shell pwd) webpack \
		--progress --colors --watch-poll --watch

# clean anything before building for production just to be sure
build-production: clean install
	cross-env NODE_ENV=production NEOS_BUILD_ROOT=$(shell pwd) \
		webpack --progress --colors


################################################################################
# Code Quality
################################################################################


storybook:
	lerna run --scope @neos-project/react-ui-components start

test:
	lerna run test --concurrency 1

test-e2e:
	yarn run testcafe chrome:headless Tests/IntegrationTests/* \
		--selector-timeout=30000 --assertion-timeout=30000

lint:
	lerna run lint --concurrency 1

lint-editorconfig:
	editorconfig-checker \
		--exclude-regexp 'LICENSE|\.vanilla\-css$$|banner\.js$$' \
		--exclude-pattern \
		'./{README.md,**/*.snap,**/*{fontAwesome,Resources}/**/*}'


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
	lerna publish \
		--skip-git --exact --repo-version=$(VERSION) \
		--yes --force-publish --skip-npm
	./Build/createVersionFile.sh

publish-npm: called-with-version
	lerna publish --skip-git --exact --repo-version=$(VERSION) \
		--yes --force-publish

tag: called-with-version
	git tag $(VERSION)

# make a clean build from scratch
# and make sure that every lint and test stage is running through
release: called-with-version check-requirements \
	build-production \
	lint lint-editorconfig \
	test test-e2e \
	bump-version publish-npm tag
	@echo
	@echo
	@echo
	@echo '####################################################################'
	@echo
	@echo You should look at the git diff carefully and commit your changes
	@echo
	@echo Then push your changes into the master and trigger the jenkins build.


################################################################################
# Misc
################################################################################


clean:
	rm -Rf node_modules; rm -rf packages/*/node_modules


.PHONY: $@
