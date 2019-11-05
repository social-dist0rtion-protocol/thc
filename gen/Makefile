INPUT_DIR ?= ../try/chapters
OUTPUT_DIR ?= ../try/build
ETH_MIGRATIONS_DIR ?= ../eth/migrations
CHAPTERS_FILE ?= chapters.config

build: game client
	echo "Game fully built."

client: contracts
	echo "Deploying client to ipfs."
	cd ../app && ./node_modules/rollup/dist/bin/rollup -c

game: chapters contracts
	@cp $(CHAPTERS_FILE) $(ETH_MIGRATIONS_DIR)/chapters.json

contracts:
	@cd $(ETH_MIGRATIONS_DIR); truffle migrate --reset

chapters:
	node chapters.js $(INPUT_DIR) $(OUTPUT_DIR) > $(CHAPTERS_FILE)
