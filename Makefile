INPUT_DIR ?= try/chapters
OUTPUT_DIR ?= try/build
ETH_DIR ?= eth
ETH_NETWORK ?= goerli
ETH_ENDPOINT ?= http://localhost:8545
FUND_ENPOINT ?= http://localhost:3000
CHAPTERS_SCRIPT ?= gen/chapters.ts
CHAPTERS_FILE ?= gen/chapters.json
IPFS_HOST ?= localhost
IPFS_PORT ?= 5001
IPFS_PROTOCOL ?= http
IPFS_LOCATION ?= http://localhost:8080/ipfs/ #https://ipfs.io/ipfs/

game: backend frontend
	echo "Game fully built and deployed."

frontend:
	echo "Deploying client to ipfs."
	cd app && IPFS_LOCATION=${IPFS_LOCATION} IPFS_PROTOCOL=${IPFS_PROTOCOL} IPFS_HOST=${IPFS_HOST} IPFS_PORT=${IPFS_PORT} FUND_ENDPOINT=${FUND_ENDPOINT} ETH_NETWORK=$(ETH_NETWORK) ETH_ENDPOINT=$(ETH_ENDPOINT) npm run build
	#cd gen && IPFS_LOCATION=${IPFS_LOCATION} IPFS_PROTOCOL=${IPFS_PROTOCOL} IPFS_HOST=${IPFS_HOST} IPFS_PORT=${IPFS_PORT} node push_client.js ../app/build
	#echo "Frotend deployed to ipfs."

backend: chapters
	echo "Deploying contracts to testnet."
	@cd $(ETH_DIR); npx hardhat deploy --network $(ETH_NETWORK) --chapters ../$(CHAPTERS_FILE)
	echo "Backend deployed to testnet."

chapters:
	echo "Generating chapters."
	IPFS_LOCATION=${IPFS_LOCATION} IPFS_PROTOCOL=${IPFS_PROTOCOL} IPFS_HOST=${IPFS_HOST} IPFS_PORT=${IPFS_PORT} pnpx ts-node $(CHAPTERS_SCRIPT) $(INPUT_DIR) $(OUTPUT_DIR) > $(CHAPTERS_FILE)

install-deps:
	cd app && pnpm install
	cd eth && pnpm install
	cd gen && pnpm install
	cd srv && pnpm install
