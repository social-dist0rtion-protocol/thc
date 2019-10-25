const web3 = require("web3");
const ethers = require("ethers");
const TreasureHuntCreator = artifacts.require("TreasureHuntCreator");
const truffleAssert = require('truffle-assertions');

contract("TreasureHuntCreator test", async accounts => {

  let currentAccount;
  
  beforeEach(function() {
    currentAccount = accounts[0];
  });

  async function getSignature(solution) {
    let solutionBytes = ethers.utils.toUtf8Bytes(solution);
    let solutionDigest = ethers.utils.keccak256(solutionBytes);
    let wallet = new ethers.Wallet(solutionDigest);
    let signature = await wallet.signMessage(ethers.utils.arrayify(accounts[0]));

    return [signature, wallet.address]
  }

  it("should initialize chapters with solutions", async() => {
    let instance = await TreasureHuntCreator.new(accounts);
    for(var i = 0; i < accounts.length; i++) {
      let solution = await instance._chapterIndexToSolution(i);
      assert.equal(solution.valueOf(), accounts[i]);
    }
  });

  it("should increment the user chapter upon successful submission", async() => {
    let testSolution = "A solution.";
    let [signature, solutionKey] = await getSignature(testSolution);
    let {r, v, s} = ethers.utils.splitSignature(signature);

    let instance = await TreasureHuntCreator.new([solutionKey]);
    instance.join({"from": currentAccount});
    instance.submit(v, r, s, {"from": currentAccount});

    let result = await instance._playerToCurrentChapter(currentAccount);
    assert.equal(result, 2);
  });

  it("should fail upon unsuccessful submission", async() => {
    let testRightSolution = "Right solution";
    let testWrongSolution = "Wrong solution";

    let [signatureWrong] = await getSignature(testRightSolution);
    let [signatureRight, solutionKey] = await getSignature(testWrongSolution);
    let {r, v, s} = ethers.utils.splitSignature(signatureWrong);

    let instance = await TreasureHuntCreator.new([solutionKey]);
    instance.join({"from": currentAccount});

    await truffleAssert.fails(
        instance.submit(v, r, s, {"from": currentAccount}),
        truffleAssert.ErrorType.REVERT
    );
  });

  it("should not increment any counter upon unsuccessful submission", async() => {
    let testRightSolution = "Right solution";
    let testWrongSolution = "Wrong solution";

    let [signatureWrong] = await getSignature(testRightSolution);
    let [signatureRight, solutionKey] = await getSignature(testWrongSolution);
    let {r, v, s} = ethers.utils.splitSignature(signatureWrong);

    let instance = await TreasureHuntCreator.new([solutionKey]);
    instance.join({"from": currentAccount});

    await truffleAssert.fails(instance.submit(v, r, s, {"from": currentAccount}));

    let result = await instance._playerToCurrentChapter(currentAccount);
    assert.equal(result, 1);
  });

  it("should add the player to the solved chapter", async() => {
    let testSolution = "A solution.";
    let [signature, solutionKey] = await getSignature(testSolution);
    let {r, v, s} = ethers.utils.splitSignature(signature);

    let instance = await TreasureHuntCreator.new([solutionKey]);
    instance.join({"from": currentAccount});
    instance.submit(v, r, s, {"from": currentAccount});

    let result = await instance._chapterIndexToPlayers(0, 0);
    assert.equal(result, currentAccount);
  });

  it("should not accept users that did not join", async() => {
    let testSolution = "Any solution.";
    let [signature, solutionKey] = await getSignature(testSolution);
    let {r, v, s} = ethers.utils.splitSignature(signature);

    let instance = await TreasureHuntCreator.new([]);
    await truffleAssert.fails(
      instance.submit(v, r, s,{"from": currentAccount}),
      truffleAssert.ErrorType.REVERT,
      "Player did not join yet. Call 'join' first"
    );
  });
});

