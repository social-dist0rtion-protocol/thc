INPUT_DIR ?= try/chapters
OUTPUT_DIR ?= try/build
ETH_DIR ?= eth
ETH_NETWORK ?= localhost
CHAPTERS_FILE ?= gen/chapters.json
KEYS_FILE ?= try/chapters/keys

game: backend frontend
	echo "Game fully built and deployed."

backend: chapters
	echo "Deploying contracts."
	@cd $(ETH_DIR); npx hardhat deploy --network $(ETH_NETWORK) --chapters ../$(CHAPTERS_FILE) --keys-path ../${KEYS_FILE}
	echo "Backend deployed."

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
