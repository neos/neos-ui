NEOS_COMPOSE = $(CURDIR)/system_under_test/docker-compose.yaml
E2E_DIR = $(CURDIR)

.SILENT:
.PHONY: setup setup-sut setup-test \
	test test-ui \
	start-sut log-sut enter-sut sut-down

# COLORS
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
RESET  := $(shell tput -Txterm sgr0)

# initial setup
setup: setup-sut setup-test

setup-sut:
	docker compose -f $(NEOS_COMPOSE) build --pull

setup-test:
	echo "${GREEN}Installing test setup.${RESET}"
	cd $(E2E_DIR) && \
	if [ -s "$$NVM_DIR" ]; then \
		. "$$NVM_DIR/nvm.sh" && echo "${GREEN}Found nvm on system -> using it to install nodejs!${RESET}" && nvm install; \
	fi && \
	npm install && npx playwright install --with-deps

## Start SUT containers in the background.
start-sut:
	docker compose -f $(NEOS_COMPOSE) up -d --build

## Run all E2E tests
test:
	cd $(E2E_DIR) && npm run test

## Open the Playwright interactive UI.
test-ui:
	cd $(E2E_DIR) && npm run test -- --ui

## Follow logs of the running SUT.
log-sut:
	docker compose -f $(NEOS_COMPOSE) logs -f

## Open a bash shell inside the running SUT container.
enter-sut:
	docker compose -f $(NEOS_COMPOSE) exec neos bash

## Stop the SUT containers and remove their volumes.
sut-down:
	echo "${YELLOW}Shutting down SUT and removing volumes.${RESET}"
	docker compose -f $(NEOS_COMPOSE) down
	docker volume rm neos_ui_e2e_db_neos_data || echo "${YELLOW}Volume already removed.${RESET}"
