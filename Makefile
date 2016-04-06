
all: dist/bundle.js

dist/bundle.js: dist
	node_modules/webpack/bin/webpack.js \
		./app/scripts/main.js \
		dist/bundle.js

dist:
	mkdir -p dist

serve:
	node_modules/webpack-dev-server/bin/webpack-dev-server.js \
		--port 3000 \
		--content-base ./app \
		--entry ./app/scripts/main.js \
		--output-filename webpack-dev-bundle.js \
		--devtool eval \
		--debug

clean:
	rm -rf dist