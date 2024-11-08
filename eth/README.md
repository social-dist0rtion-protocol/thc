# thc

Deploy `Treasure` contract:

```
npx hardhat --network sepolia deploy:treasure --verify
```

Deploy `THC` contract:

```
npx hardhat --network sepolia deploy:thc --verify --cbd ../../cbd
```

Setup `THC` Renderer:

```
npx hardhat --network sepolia setup:thc --renderer SybilDefenseRenderer
```
