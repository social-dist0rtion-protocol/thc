# Review and change these variables for each game
INPUT_DIR ?= ../disappear/disappear/chapters 	# Comment about this variable
OUTPUT_DIR ?= try/build				# Comment about this variable 
ETH_DIR ?= eth					# Comment about this variable 
ETH_NETWORK ?= optimism				# Comment about this variable 
CHAPTERS_FILE ?= gen/chapters.json		# Comment about this variable 
KEYS_FILE ?= ../disappear/disappear/keys.csv	# Comment about this variable 

game: backend frontend
	echo "Game fully built and deployed."

treasure:
	echo "Deploying treasure contract."
	@cd $(ETH_DIR); npx hardhat compile
	@cd $(ETH_DIR); npx hardhat deploy:treasure --network $(ETH_NETWORK)
	echo "Treasure deployed."

backend: chapters
	echo "Deploying contracts."
	@cd $(ETH_DIR); npx hardhat compile
	@cd $(ETH_DIR); npx hardhat deploy:thc --network $(ETH_NETWORK) --chapters ../$(CHAPTERS_FILE) --keys-path ../${KEYS_FILE}
	@cd $(ETH_DIR); npx hardhat setup:disappear --network $(ETH_NETWORK)
	echo "TreasureHuntCreator deployed."

update-chapters:
	echo "Update chapters."
	@cd $(ETH_DIR); npx hardhat --network $(ETH_NETWORK) root-set-from-chapters --chapters ../$(CHAPTERS_FILE)

chapters:
	echo "Generating chapters."
	@cd gen; npx ts-node chapters.ts ../$(INPUT_DIR) ../$(OUTPUT_DIR) > ../$(CHAPTERS_FILE)

install-deps:
	cd app && pnpm install
	cd eth && pnpm install
	cd gen && pnpm install
	cd srv && pnpm install
