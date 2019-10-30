SOLUTIONS ?= solutions.txt
ETH_MIGRATIONS_DIR ?= ../eth/migrations
CHAPTERS_FILE ?= chapters.config

game: chapters
	@cp $(CHAPTERS_FILE) $(ETH_MIGRATIONS_DIR)/chapters.json 
	@cd $(ETH_MIGRATIONS_DIR); truffle migrate --reset

ipfs_file:
	@node upload.js $(FILE_PATH)

chapters:
	node chapters.js $(INPUT_DIR) $(OUTPUT_DIR) > $(CHAPTERS_FILE)

addresses:
	@echo "Generate solution addresses from $(SOLUTIONS) into addresses.txt"
	@node adresser.js $(SOLUTIONS) > addresses.txt
