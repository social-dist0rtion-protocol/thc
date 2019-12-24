INPUT_DIR ?= try/chapters
OUTPUT_DIR ?= try/build
ETH_MIGRATIONS_DIR ?= eth
CHAPTERS_SCRIPT ?= gen/chapters.js
CHAPTERS_FILE ?= gen/chapters.json
IPFS_HOST ?= localhost
IPFS_PORT ?= 5001
IPFS_PROTOCOL ?= http
IPFS_LOCATION ?= http://localhost:8080/ipfs/ #https://ipfs.io/ipfs/

game: backend frontend
	echo "Game fully built and deployed."

frontend:
	echo "Deploying client to ipfs."
	cd app && npm run build
	cd gen && IPFS_LOCATION=${IPFS_LOCATION} IPFS_PROTOCOL=${IPFS_PROTOCOL} IPFS_HOST=${IPFS_HOST} IPFS_PORT=${IPFS_PORT} node push_client.js ../app/build
	echo "Frotend deployed to ipfs."

backend: chapters
	echo "Deploying contracts to testnet."
	@cd $(ETH_MIGRATIONS_DIR); truffle migrate --reset ../$(CHAPTERS_FILE)
	echo "Backend deployed to testnet."

chapters:
	echo "Generating chapters."
	IPFS_LOCATION=${IPFS_LOCATION} node $(CHAPTERS_SCRIPT) $(INPUT_DIR) $(OUTPUT_DIR) > $(CHAPTERS_FILE)

install-deps:
	cd app && npm install
	cd eth && npm install
	cd gen && npm install
	cd srv && npm install
