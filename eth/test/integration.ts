// Hey, no need to include web3 since Truffle magically injects it
// const web3 = require("web3");
import { ethers } from "hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { solidity } from "ethereum-waffle";
import {
  TreasureHuntCreator,
  TreasureHuntCreator__factory,
} from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import {
  getQuestBytes,
  getSignature,
  getSolutionAddress,
  getSolutionSignature,
  merge,
} from "./utils";

chai.use(solidity);
chai.use(chaiAsPromised);
const { expect } = chai;

const PAGE_SIZE = 32;

describe("TreasureHuntCreator", () => {
  let thcFactory: TreasureHuntCreator__factory;
  let accounts: SignerWithAddress[];
  let totalPlayers: number;
  let solutions: string[];
  let quests: string[];
  let deployer: SignerWithAddress;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    deployer = accounts[0];

    thcFactory = (await ethers.getContractFactory(
      "TreasureHuntCreator",
      accounts[0]
    )) as TreasureHuntCreator__factory;

    totalPlayers = accounts.length;

    solutions = accounts.map((x) => x.address);
    quests = solutions.map((x) => getQuestBytes(x));
  });

  async function deploy(
    solutions: string[],
    quests: string[]
  ): Promise<TreasureHuntCreator> {
    const thc = await thcFactory.deploy(solutions, quests);
    await thc.deployed();

    return thc;
  }

  describe("constructor", async () => {
    it("should initialize chapters with solutions and quests", async () => {
      let instance = await deploy(solutions, quests);
      for (var i = 0; i < accounts.length; i++) {
        let solution = await instance._solutions(i);
        expect(solution).equal(accounts[i].address);
      }
    });
  });

  describe("submit", async () => {
    it("should increment the user chapter with correct solution", async () => {
      let testSolution = "A solution.";
      let [signature, solutionKey] = await getSignature(deployer, testSolution);
      let { r, v, s } = ethers.utils.splitSignature(signature);

      let instance = await deploy([solutionKey], quests.slice(0));
      await instance.connect(deployer).submit(v, r, s);

      let result = await instance._playerToCurrentChapter(deployer.address);
      expect(result).equal(1);
    });

    it("should fail with wrong solution", async () => {
      let testRightSolution = "Right solution";
      let testWrongSolution = "Wrong solution";

      let [signatureWrong] = await getSignature(deployer, testWrongSolution);
      let [signatureRight, solutionKey] = await getSignature(
        deployer,
        testRightSolution
      );
      let { r, v, s } = ethers.utils.splitSignature(signatureWrong);

      let instance = await deploy([solutionKey], quests.slice(0));

      await expect(instance.connect(deployer).submit(v, r, s)).revertedWith(
        "Wrong solution."
      );
    });

    it("should not increment any counter with wrong", async () => {
      let testRightSolution = "Right solution";
      let testWrongSolution = "Wrong solution";

      let [signatureWrong] = await getSignature(deployer, testWrongSolution);
      let [signatureRight, solutionKey] = await getSignature(
        deployer,
        testRightSolution
      );
      let { r, v, s } = ethers.utils.splitSignature(signatureWrong);
      let instance = await deploy([solutionKey], quests.slice(0));

      await expect(instance.connect(deployer).submit(v, r, s)).revertedWith("");

      let result = await instance._playerToCurrentChapter(deployer.address);
      expect(result).equal(0);
    });

    it("should not add player to list upon failure", async () => {
      let testSolution = "A wrong solution";
      let [signature, solutionKey] = await getSignature(deployer, testSolution);
      let { r, v, s } = ethers.utils.splitSignature(signature);

      let instance = await deploy([solutions[0]], [quests[0]]);

      await expect(instance.connect(deployer).submit(v, r, s)).revertedWith("");
      await expect(instance._players(0)).revertedWith("");
    });

    it("should add player to list upon success", async () => {
      let testSolution = "A solution";
      let [signature, solutionKey] = await getSignature(deployer, testSolution);
      let { r, v, s } = ethers.utils.splitSignature(signature);

      let instance = await deploy([solutionKey], [quests[0]]);

      await instance.connect(deployer).submit(v, r, s);

      let resultPlayer = await instance._players(0);

      expect(resultPlayer).equal(deployer.address);
    });

    it("should add the player to the solved chapter", async () => {
      let testSolution = "A solution";
      let [signature, solutionKey] = await getSignature(deployer, testSolution);
      let { r, v, s } = ethers.utils.splitSignature(signature);

      let instance = await deploy([solutionKey], [quests[0]]);
      await instance.connect(deployer).submit(v, r, s);

      let result = await instance._chapterToPlayers(0, 0);
      expect(result).equal(deployer.address);
    });
  });

  describe("currentQuest", async () => {
    it("should return the quest hash of the user current chapter", async () => {
      let instance = await deploy(solutions, quests);

      let result = await instance.currentQuest();
      expect(result).equal(quests[0]);
    });
  });

  describe("getLeaderboard", async () => {
    it("should return an empty list if no players", async () => {
      let testSolution1 = "A solution 1";
      let solutionKey1 = await getSolutionAddress(testSolution1);

      let testSolution2 = "A solution 2";
      let solutionKey2 = await getSolutionAddress(testSolution2);

      let testSolution3 = "A solution 3";
      let solutionKey3 = await getSolutionAddress(testSolution3);

      let instance = await deploy(
        [solutionKey1, solutionKey2, solutionKey3],
        [quests[0], quests[1], quests[2]]
      );

      let leaderboard = await instance.getLeaderboard(0);
      let expectedLeaderboard = Array(PAGE_SIZE).fill(BigNumber.from(0));
      expect(leaderboard.map((n) => n.toString())).eql(
        expectedLeaderboard.map((n) => n.toString())
      );
    });

    it("should return the list of players and chapters", async () => {
      let [player1, player2, player3] = accounts;

      let testSolution1 = "A solution 1";
      let solutionKey1 = await getSolutionAddress(testSolution1);

      let testSolution2 = "A solution 2";
      let solutionKey2 = await getSolutionAddress(testSolution2);

      let testSolution3 = "A solution 3";
      let solutionKey3 = await getSolutionAddress(testSolution3);

      let instance = await deploy(
        [solutionKey1, solutionKey2, solutionKey3],
        [quests[0], quests[1], quests[2]]
      );

      // Let the game begin!
      let leaderboard;
      let expectedLeaderboard;

      // player 1 solves chapter 1
      let signature = await getSolutionSignature(
        testSolution1,
        player1.address
      );
      await instance
        .connect(player1)
        .submit(signature.v, signature.r, signature.s);
      leaderboard = await instance.getLeaderboard(0);
      expectedLeaderboard = Array(PAGE_SIZE).fill(BigNumber.from(0));
      expectedLeaderboard[0] = merge(player1.address, 1);
      expect(leaderboard.map((n) => n.toString())).eql(
        expectedLeaderboard.map((n) => n.toString())
      );

      // player 2 solves chapter 1
      signature = await getSolutionSignature(testSolution1, player2.address);
      await instance
        .connect(player2)
        .submit(signature.v, signature.r, signature.s);

      leaderboard = await instance.getLeaderboard(0);
      expectedLeaderboard = Array(PAGE_SIZE).fill(BigNumber.from(0));
      expectedLeaderboard[0] = merge(player1.address, 1);
      expectedLeaderboard[1] = merge(player2.address, 1);
      expect(leaderboard.map((n) => n.toString())).eql(
        expectedLeaderboard.map((n) => n.toString())
      );

      // plot twist: player 3 solves chapter 1, 2, and 3
      signature = await getSolutionSignature(testSolution1, player3.address);
      await instance
        .connect(player3)
        .submit(signature.v, signature.r, signature.s);
      signature = await getSolutionSignature(testSolution2, player3.address);
      await instance
        .connect(player3)
        .submit(signature.v, signature.r, signature.s);
      signature = await getSolutionSignature(testSolution3, player3.address);
      await instance
        .connect(player3)
        .submit(signature.v, signature.r, signature.s);
      leaderboard = await instance.getLeaderboard(0);

      expectedLeaderboard = Array(PAGE_SIZE).fill(BigNumber.from(0));
      expectedLeaderboard[0] = merge(player1.address, 1);
      expectedLeaderboard[1] = merge(player2.address, 1);
      expectedLeaderboard[2] = merge(player3.address, 3);
      expect(leaderboard.map((n) => n.toString())).eql(
        expectedLeaderboard.map((n) => n.toString())
      );
    });
  });

  describe("addGameMaster", async () => {
    it("should add a game master", async () => {
      let testGameMaster = accounts[1].address;
      let instance = await deploy([], []);

      await instance.addGameMaster(testGameMaster);

      let result = await instance._gameMasters(0);

      expect(result).equal(testGameMaster);
    });

    it("should not add twice the same game master", async () => {
      let testGameMaster = accounts[1].address;
      let instance = await deploy([], []);

      await instance.addGameMaster(testGameMaster);

      await expect(instance.addGameMaster(testGameMaster)).revertedWith(
        "This game master has already been added"
      );
    });
  });

  describe("addChapter", async () => {
    it("should forbid adding a chapter to non game masters", async () => {
      let instance = await deploy([], []);

      await expect(instance.addChapter(solutions[0], quests[0])).revertedWith(
        "Only game masters can use this function."
      );
    });

    it("should add a new chapter from a game master", async () => {
      let instance = await deploy([], []);
      let testGameMaster = accounts[1];
      let testSolution = solutions[0];
      let testQuest = quests[0];

      await instance.addGameMaster(testGameMaster.address);
      await instance
        .connect(testGameMaster)
        .addChapter(testSolution, testQuest);

      let resultSolution = await instance._solutions(0);
      let resultQuest = await instance._quests(0);

      expect(resultSolution, testSolution);
      expect(resultQuest, testQuest);
    });
  });
});