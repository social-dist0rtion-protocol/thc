# Treasure Hunt Creator (THC)

This is the monorepo of THC, a framework to create decentralized treasure hunts.

## Components

The directory structure is the following:
- `app`: (short for *application*) frontend application.
- `eth`: (short for *ethereum*) smart contracts and migrations to deploy on some network.
- `gen`: (short for *generator*) compile and encrypts the chapters of the story.
- `srv`: (short for *server*) centralized component to distribute ether to players.
- `try`: (short for *try*) a test story that can be used to test the framework.



## Development

Each directory has its own dependencies. To install all of them run:

```bash
make install-deps
```

THC requires two services to be up and running:

- An Ethereum node, [ethnode](https://github.com/vrde/ethnode/) is always a great choice.
- An [IPFS node](https://docs.ipfs.io/guides/guides/install/).

Now you have everything you need to develop THC.

### Work on the app (frontend)

Compile and deploy the chapters and the smart contract with:

```bash
make backend
```

Then go to the `app` directory and  run:

```bash
npm start
```

### Work on the contracts (backend)

Go to the `eth` directory and do something there like adding code and tests.

### Deploy a new game locally

Run:

```bash
make game
```
