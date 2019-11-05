INPUT_DIR ?= ../try/chapters
OUTPUT_DIR ?= ../try/build
ETH_MIGRATIONS_DIR ?= ../eth/migrations
CHAPTERS_FILE ?= chapters.json

game: chapters
	@cd $(ETH_MIGRATIONS_DIR); truffle migrate --reset ../../gen/$(CHAPTERS_FILE)

chapters:
	node chapters.js $(INPUT_DIR) $(OUTPUT_DIR) > $(CHAPTERS_FILE)
