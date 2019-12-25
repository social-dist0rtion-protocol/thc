const ethers = require("ethers");
const Web3 = require("web3");
const utils = require("./utils");
const metadata = require("../build/contracts/TreasureHuntCreator.json");
const web3 = new Web3("http://localhost:8545");
const BN = web3.utils.BN;
const assert = require("assert");

const PAGE_SIZE = 32;
const TOTAL_PLAYERS = PAGE_SIZE + 1;

async function deploy(from, ...params) {
  const contract = new web3.eth.Contract(metadata.abi);
  const receipt = await contract
    .deploy({
      data: metadata.bytecode,
      arguments: params
    })
    .send({ from });
  return receipt;
}

async function runTheFuckingPaginationTest() {
  const accounts = await web3.eth.getAccounts();
  let testSolution1 = "A solution 1";
  let solutionKey1 = await utils.getSolutionAddress(testSolution1);

  let testSolution2 = "A solution 2";
  let solutionKey2 = await utils.getSolutionAddress(testSolution2);

  let testSolution3 = "A solution 3";
  let solutionKey3 = await utils.getSolutionAddress(testSolution3);

  let instance = await deploy(
    accounts[0],
    [solutionKey1, solutionKey2, solutionKey3],
    ["0x00", "0x01", "0x02"]
  );

  let richOne = accounts[accounts.length - 1];
  let players = [];
  let promises = [];
  let expectedLeaderboard = Array(PAGE_SIZE * 2).fill(new BN(0));

  let leaderboard = await instance.methods.getLeaderboard(0).call();

  // Fund players
  for (let i = 0; i < TOTAL_PLAYERS; i++) {
    process.stdout.write(`\r[${i + 1}/${TOTAL_PLAYERS}] Fund player`);
    players[i] = web3.eth.accounts.create();
    let txTransfer = await web3.eth.sendTransaction({
      from: richOne,
      to: players[i].address,
      value: web3.utils.toWei("1", "milliether")
    });
  }
  console.log();

  // Send solutions
  for (let i = 0; i < TOTAL_PLAYERS; i++) {
    process.stdout.write(`\r[${i + 1}/${TOTAL_PLAYERS}] Submit solution`);
    let solution = await utils.getSolutionSignature(
      testSolution1,
      players[i].address
    );
    let data = instance.methods.submit(...solution).encodeABI();
    let txSend = await players[i].signTransaction({
      to: instance.options.address,
      data,
      gas: "1000000"
    });
    await web3.eth.sendSignedTransaction(txSend.rawTransaction);
    expectedLeaderboard[i] = utils.merge(players[i].address, 1);
  }

  console.log();

  leaderboard = await instance.methods.getLeaderboard(0).call();
  assert.deepStrictEqual(
    leaderboard.map(n => n.toString()),
    expectedLeaderboard.slice(0, PAGE_SIZE).map(n => n.toString())
  );

  leaderboard = await instance.methods.getLeaderboard(1).call();
  assert.deepStrictEqual(
    leaderboard.map(n => n.toString()),
    expectedLeaderboard.slice(PAGE_SIZE, PAGE_SIZE * 2).map(n => n.toString())
  );

  console.log("OK everything seems to work properly.");
}

runTheFuckingPaginationTest();
