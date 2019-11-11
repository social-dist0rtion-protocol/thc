INPUT_DIR ?= try/chapters
OUTPUT_DIR ?= try/build
ETH_MIGRATIONS_DIR ?= eth
CHAPTERS_SCRIPT ?= gen/chapters.js
CHAPTERS_FILE ?= gen/chapters.json

game: backend frontend
	echo "Game fully built and deployed."

frontend:
	echo "Deploying client to ipfs."
	cd app && ./node_modules/rollup/dist/bin/rollup -c
	cd gen && node push_client.js ../app/build
	echo "Frotend deployed to ipfs."
	
backend: chapters
	echo "Deploying contracts to testnet."
	@cd $(ETH_MIGRATIONS_DIR); truffle migrate --reset ../$(CHAPTERS_FILE)
	echo "Backend deployed to testnet."

chapters:
	echo "Generating chapters."
	node $(CHAPTERS_SCRIPT) $(INPUT_DIR) $(OUTPUT_DIR) > $(CHAPTERS_FILE)
