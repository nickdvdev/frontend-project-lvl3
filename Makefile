install:
	npm ci

build:
	npm run build

build-dev:
	npm run build-dev

develop:
	npm run develop

lint:
	npx eslint .

test:
	npm test

test-coverage:
	npm test -- --coverage

test-watch:
	npm test -- --watch

.PHONY: test