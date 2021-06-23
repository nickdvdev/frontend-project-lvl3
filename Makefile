install:
	npm install

publish:
	npm login
	npm publish --dry-run

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

make deploy:
	npm run deploy

.PHONY: test