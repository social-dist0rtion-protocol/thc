INPUT_DIR ?= ../try/chapters
OUTPUT_DIR ?= ../try/build
ETH_DIR ?= eth
ETH_NETWORK ?= localhost
ETH_ENDPOINT ?= http://localhost:8545
CHAPTERS_FILE ?= gen/chapters.json
KEYS_FILE ?= try/chapters/keys
IPFS_HOST ?= localhost
IPFS_PORT ?= 5001
IPFS_PROTOCOL ?= http
IPFS_LOCATION ?= http://localhost:8080/ipfs/ #https://ipfs.io/ipfs/

game: backend frontend
	echo "Game fully built and deployed."

frontend:
	echo "Deploying client to ipfs."
	cd app && FUND_ENDPOINT=${FUND_ENDPOINT} ETH_NETWORK=$(ETH_NETWORK) ETH_ENDPOINT=$(ETH_ENDPOINT) npm run build

backend: chapters
	echo "Deploying contracts to testnet."
	@cd $(ETH_DIR); npx hardhat deploy --network $(ETH_NETWORK) --chapters ../$(CHAPTERS_FILE) --keys-path ../${KEYS_FILE}
	echo "Backend deployed to testnet."

update-chapters:
	echo "Update chapters."
	@cd $(ETH_DIR); npx hardhat --network $(ETH_NETWORK) root-set-from-chapters --chapters ../$(CHAPTERS_FILE)

chapters:
	echo "Generating chapters."
	@cd gen; npx ts-node chapters.ts $(INPUT_DIR) $(OUTPUT_DIR) > ../$(CHAPTERS_FILE)

install-deps:
	cd app && pnpm install
	cd eth && pnpm install
	cd gen && pnpm install
	cd srv && pnpm install
