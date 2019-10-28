const web3 = require("web3");
const crypto = require("crypto");
const ethers = require("ethers");
const TreasureHuntCreator = artifacts.require("TreasureHuntCreator");
const truffleAssert = require("truffle-assertions");

contract("TreasureHuntCreator test", async accounts => {
  let currentAccount;
  let solutions;
  let quests;

  beforeEach(function() {
    currentAccount = accounts[0];
    solutions = accounts;
    quests = accounts.map(x => getQuestBytes(x));
  });

  // Generate a sha256 of some content, which is the right most 32 bytes of an IPFS hash
  function getQuestBytes(content) {
    let hash = crypto
      .createHash("sha256")
      .update(content)
      .digest()
      .toString("ascii");
    return web3.utils.asciiToHex(hash);
  }

  async function getSignature(solution) {
    let solutionBytes = ethers.utils.toUtf8Bytes(solution);
    let solutionDigest = ethers.utils.keccak256(solutionBytes);
    let wallet = new ethers.Wallet(solutionDigest);
    let signature = await wallet.signMessage(
      ethers.utils.arrayify(accounts[0])
    );

    return [signature, wallet.address];
  }

  describe("constructor", async () => {
    it("should initialize chapters with solutions and quests", async () => {
      let instance = await TreasureHuntCreator.new(solutions, quests);
      for (var i = 0; i < accounts.length; i++) {
        let solution = await instance._solutions(i);
        assert.equal(solution.valueOf(), accounts[i]);
      }
    });
  });

  describe("submit", async () => {
    it("should increment the user chapter with correct solution", async () => {
      let testSolution = "A solution.";
      let [signature, solutionKey] = await getSignature(testSolution);
      let { r, v, s } = ethers.utils.splitSignature(signature);

      let instance = await TreasureHuntCreator.new(
        [solutionKey],
        quests.slice(0)
      );
      instance.join({ from: currentAccount });
      instance.submit(v, r, s, { from: currentAccount });

      let result = await instance._playerToCurrentChapter(currentAccount);
      assert.equal(result, 2);
    });

    it("should fail with wrong solution", async () => {
      let testRightSolution = "Right solution";
      let testWrongSolution = "Wrong solution";

      let [signatureWrong] = await getSignature(testRightSolution);
      let [signatureRight, solutionKey] = await getSignature(testWrongSolution);
      let { r, v, s } = ethers.utils.splitSignature(signatureWrong);

      let instance = await TreasureHuntCreator.new(
        [solutionKey],
        quests.slice(0)
      );
      instance.join({ from: currentAccount });

      await truffleAssert.fails(
        instance.submit(v, r, s, { from: currentAccount }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it("should not increment any counter with wrong", async () => {
      let testRightSolution = "Right solution";
      let testWrongSolution = "Wrong solution";

      let [signatureWrong] = await getSignature(testRightSolution);
      let [signatureRight, solutionKey] = await getSignature(testWrongSolution);
      let { r, v, s } = ethers.utils.splitSignature(signatureWrong);

      let instance = await TreasureHuntCreator.new(
        [solutionKey],
        quests.slice(0)
      );
      instance.join({ from: currentAccount });

      await truffleAssert.fails(
        instance.submit(v, r, s, { from: currentAccount })
      );

      let result = await instance._playerToCurrentChapter(currentAccount);
      assert.equal(result, 1);
    });

    it("should add the player to the solved chapter", async () => {
      let testSolution = "A solution";
      let [signature, solutionKey] = await getSignature(testSolution);
      let { r, v, s } = ethers.utils.splitSignature(signature);

      let instance = await TreasureHuntCreator.new([solutionKey], [quests[0]]);
      instance.join({ from: currentAccount });
      instance.submit(v, r, s, { from: currentAccount });

      let result = await instance._chapterIndexToPlayers(0, 0);
      assert.equal(result, currentAccount);
    });

    it("should not accept users that did not join", async () => {
      let testSolution = "Any solution.";
      let [signature, solutionKey] = await getSignature(testSolution);
      let { r, v, s } = ethers.utils.splitSignature(signature);

      let instance = await TreasureHuntCreator.new([], []);
      await truffleAssert.fails(
        instance.submit(v, r, s, { from: currentAccount }),
        truffleAssert.ErrorType.REVERT,
        "Player did not join yet. Call 'join' first"
      );
    });
  });

  describe("currentQuest", async () => {
    it("should return the quest hash of the user current chapter", async () => {
      let instance = await TreasureHuntCreator.new(solutions, quests);
      instance.join({ from: currentAccount });

      let result = await instance.currentQuest();
      assert.equal(result, quests[0]);
    });
  });

  describe("join", async () => {
    it("should initialize the player who joins", async () => {
      let instance = await TreasureHuntCreator.new([], []);
      instance.join({ from: currentAccount });

      let resultPlayer = await instance._players(0);
      let resultChapter = await instance._playerToCurrentChapter(
        currentAccount
      );

      assert.equal(resultPlayer, currentAccount);
      assert.equal(resultChapter, 1);
    });

    it("should fail if player added twice", async () => {
      let instance = await TreasureHuntCreator.new([], []);

      instance.join({ from: currentAccount });

      await truffleAssert.fails(
        instance.join({ from: currentAccount }),
        truffleAssert.ErrorType.REVER,
        "Player already joined the game"
      );
    });
  });

  describe("addGameMaster", async () => {
    it("should add a game master", async () => {
      let testGameMaster = accounts[1];
      let instance = await TreasureHuntCreator.new([], []);

      instance.addGameMaster(testGameMaster);

      let result = await instance._gameMasters(0);

      assert.equal(result, testGameMaster);
    });

    it("should not add twice the same game master", async () => {
      let testGameMaster = accounts[1];
      let instance = await TreasureHuntCreator.new([], []);

      instance.addGameMaster(testGameMaster);

      await truffleAssert.fails(
        instance.addGameMaster(testGameMaster),
        truffleAssert.ErrorType.REVERT,
        "This game master has already been added"
      );
    });
  });

  describe("addChapter", async () => {
    it("should forbid adding a chapter to non game masters", async () => {
      let instance = await TreasureHuntCreator.new([], []);

      await truffleAssert.fails(
        instance.addChapter(solutions[0], quests[0]),
        truffleAssert.ErrorType.REVERT,
        "Only game masters can use this function."
      );
    });

    it("should add a new chapter from a game master", async () => {
      let instance = await TreasureHuntCreator.new([], []);
      let testGameMaster = accounts[1];
      let testSolution = solutions[0];
      let testQuest = quests[0];

      instance.addGameMaster(testGameMaster);
      instance.addChapter(testSolution, testQuest, { from: testGameMaster });

      let resultSolution = await instance._solutions(0);
      let resultQuest = await instance._quests(0);

      assert.equal(resultSolution, testSolution);
      assert.equal(resultQuest, testQuest);
    });
  });
});
