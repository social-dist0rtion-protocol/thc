const web3 = require("web3");
const crypto = require("crypto");
const ethers = require("ethers");
const TreasureHuntCreator = artifacts.require("TreasureHuntCreator");
const truffleAssert = require("truffle-assertions");
const BN = web3.utils.BN;

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
      await instance.submit(v, r, s, { from: currentAccount });

      let result = await instance._playerToCurrentChapter(currentAccount);
      assert.equal(result, 1);
    });

    it("should fail with wrong solution", async () => {
      let testRightSolution = "Right solution";
      let testWrongSolution = "Wrong solution";

      let [signatureWrong] = await getSignature(testWrongSolution);
      let [signatureRight, solutionKey] = await getSignature(testRightSolution);
      let { r, v, s } = ethers.utils.splitSignature(signatureWrong);

      let instance = await TreasureHuntCreator.new(
        [solutionKey],
        quests.slice(0)
      );

      await truffleAssert.fails(
        instance.submit(v, r, s, { from: currentAccount }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it("should not increment any counter with wrong", async () => {
      let testRightSolution = "Right solution";
      let testWrongSolution = "Wrong solution";

      let [signatureWrong] = await getSignature(testWrongSolution);
      let [signatureRight, solutionKey] = await getSignature(testRightSolution);
      let { r, v, s } = ethers.utils.splitSignature(signatureWrong);

      let instance = await TreasureHuntCreator.new(
        [solutionKey],
        quests.slice(0)
      );

      await truffleAssert.fails(
        instance.submit(v, r, s, { from: currentAccount })
      );

      let result = await instance._playerToCurrentChapter(currentAccount);
      assert.equal(result, 0);
    });

    it("should not add player to list upon failure", async () => {
      let testSolution = "A wrong solution";
      let [signature, solutionKey] = await getSignature(testSolution);
      let { r, v, s } = ethers.utils.splitSignature(signature);

      let instance = await TreasureHuntCreator.new([solutions[0]], [quests[0]]);

      await truffleAssert.fails(
        instance.submit(v, r, s, { from: currentAccount })
      );

      await truffleAssert.fails(instance._players(0));
    });

    it("should add player to list upon success", async () => {
      let testSolution = "A solution";
      let [signature, solutionKey] = await getSignature(testSolution);
      let { r, v, s } = ethers.utils.splitSignature(signature);

      let instance = await TreasureHuntCreator.new([solutionKey], [quests[0]]);

      await instance.submit(v, r, s, { from: currentAccount });

      let resultPlayer = await instance._players(0);

      assert.equal(resultPlayer, currentAccount);
    });

    it("should add the player to the solved chapter", async () => {
      let testSolution = "A solution";
      let [signature, solutionKey] = await getSignature(testSolution);
      let { r, v, s } = ethers.utils.splitSignature(signature);

      let instance = await TreasureHuntCreator.new([solutionKey], [quests[0]]);
      await instance.submit(v, r, s, { from: currentAccount });

      let result = await instance._chapterToPlayers(0, 0);
      assert.equal(result, currentAccount);
    });
  });

  describe("currentQuest", async () => {
    it("should return the quest hash of the user current chapter", async () => {
      let instance = await TreasureHuntCreator.new(solutions, quests);

      let result = await instance.currentQuest();
      assert.equal(result, quests[0]);
    });
  });

  describe("getLeaderboard", async () => {
    it("should return the list of players and chapters", async () => {
      const [player1, player2, player3] = accounts;

      let testSolution1 = "A solution 1";
      let [signature1, solutionKey1] = await getSignature(testSolution1);
      let { r: r1, v: v1, s: s1 } = ethers.utils.splitSignature(signature1);

      let testSolution2 = "A solution 2";
      let [signature2, solutionKey2] = await getSignature(testSolution2);
      let { r: r2, v: v2, s: s2 } = ethers.utils.splitSignature(signature2);

      let testSolution3 = "A solution 3";
      let [signature3, solutionKey3] = await getSignature(testSolution3);
      let { r: r3, v: v3, s: s3 } = ethers.utils.splitSignature(signature3);

      let instance = await TreasureHuntCreator.new(
        [solutionKey1, solutionKey2, solutionKey3],
        [quests[0], quests[1], quests[2]]
      );

      await instance.submit(v1, r1, s1, { from: player1 });
      let leaderboard = await instance.getLeaderboard(0);
      let expectedLeaderboard = Array(64).fill(new BN(0));
      expectedLeaderboard[0] = new BN(player1.replace("0x", ""), 16)
        .shln(96)
        .or(new BN("1"));
      assert.deepEqual(
        leaderboard.map(n => n.toString()),
        expectedLeaderboard.map(n => n.toString())
      );
    });
  });

  describe("addGameMaster", async () => {
    it("should add a game master", async () => {
      let testGameMaster = accounts[1];
      let instance = await TreasureHuntCreator.new([], []);

      await instance.addGameMaster(testGameMaster);

      let result = await instance._gameMasters(0);

      assert.equal(result, testGameMaster);
    });

    it("should not add twice the same game master", async () => {
      let testGameMaster = accounts[1];
      let instance = await TreasureHuntCreator.new([], []);

      await instance.addGameMaster(testGameMaster);

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

      await instance.addGameMaster(testGameMaster);
      await instance.addChapter(testSolution, testQuest, {
        from: testGameMaster
      });

      let resultSolution = await instance._solutions(0);
      let resultQuest = await instance._quests(0);

      assert.equal(resultSolution, testSolution);
      assert.equal(resultQuest, testQuest);
    });
  });
});
