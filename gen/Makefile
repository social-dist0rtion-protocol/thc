SOLUTIONS ?= solutions.txt
ETH_MIGRATIONS_DIR ?= ../eth/migrations
CONFIG_FILE ?= config.json

game:
	@cp $(CONFIG_FILE) $(ETH_MIGRATIONS_DIR)/chapters.json 
	@cd $(ETH_MIGRATIONS_DIR); truffle migrate --reset

ipfs_file:
	@node upload.js $(FILE_PATH)

addresses:
	@echo "Generate solution addresses from $(SOLUTIONS) into addresses.txt"
	@node adresser.js $(SOLUTIONS) > addresses.txt
