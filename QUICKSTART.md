# Quickstart

```
# Install the CLI
npm install -g @dist0rtion/thc

# Build the assets of the game
thc build <game-path>

# Deploy the contract
cd eth

# Deploy Treasure.sol if needed
npx hardhat deploy:treasure --network <network> --verify

# Deploy THC
npx hardhat deploy:thc --network <network> --artifacts <artifactsPath> --verify

# Copy address to game config in ./try/config.json
# Now we are ready to provide the dapp

thc provide-dapp <game-path> <dapp-path>
```