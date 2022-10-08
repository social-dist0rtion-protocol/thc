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
import { BigNumber, utils } from "ethers";
import {
  cidToBytes,
  getSignature,
  getSolutionAddress,
  getSolutionSignature,
  merge,
} from "./utils";
import { keccak256, toUtf8Bytes } from "ethers/lib/utils";

chai.use(solidity);
chai.use(chaiAsPromised);
const { expect } = chai;

const PAGE_SIZE = 32;
const GAME_MASTER_ROLE = keccak256(toUtf8Bytes("GAME_MASTER_ROLE"));

describe("TreasureHuntCreator", () => {
  let thcFactory: TreasureHuntCreator__factory;
  let accounts: SignerWithAddress[];
  let totalPlayers: number;
  let solutions: string[];
  let questsRootCid: string;
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
    questsRootCid = "QmUYWv6RaHHWkk5BMHJH4xKPEKNqAYKomeiTVobAMyxsbz";
  });

  async function deploy(
    solutions: string[],
    questsRootCid: string
  ): Promise<TreasureHuntCreator> {
    const thc = await thcFactory.deploy(solutions, questsRootCid);
    await thc.deployed();

    return thc;
  }

  describe("constructor", async () => {
    it("should initialize chapters with solutions and quests", async () => {
      let instance = await deploy(solutions, questsRootCid);
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

      let instance = await deploy([solutionKey], questsRootCid);
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

      let instance = await deploy([solutionKey], questsRootCid);

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
      let instance = await deploy([solutionKey], questsRootCid);

      await expect(instance.connect(deployer).submit(v, r, s)).revertedWith("");

      let result = await instance._playerToCurrentChapter(deployer.address);
      expect(result).equal(0);
    });

    it("should not add player to list upon failure", async () => {
      let testSolution = "A wrong solution";
      let [signature, solutionKey] = await getSignature(deployer, testSolution);
      let { r, v, s } = ethers.utils.splitSignature(signature);

      let instance = await deploy([solutions[0]], questsRootCid);

      await expect(instance.connect(deployer).submit(v, r, s)).revertedWith("");
      await expect(instance._players(0)).revertedWith("");
    });

    it("should add player to list upon success", async () => {
      let testSolution = "A solution";
      let [signature, solutionKey] = await getSignature(deployer, testSolution);
      let { r, v, s } = ethers.utils.splitSignature(signature);

      let instance = await deploy([solutionKey], questsRootCid);

      await instance.connect(deployer).submit(v, r, s);

      let resultPlayer = await instance._players(0);

      expect(resultPlayer).equal(deployer.address);
    });

    it("should add the player to the solved chapter", async () => {
      let testSolution = "A solution";
      let [signature, solutionKey] = await getSignature(deployer, testSolution);
      let { r, v, s } = ethers.utils.splitSignature(signature);

      let instance = await deploy([solutionKey], questsRootCid);
      await instance.connect(deployer).submit(v, r, s);

      let result = await instance._chapterToPlayers(0, 0);
      expect(result).equal(deployer.address);
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
        questsRootCid
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
        questsRootCid
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

  describe("setQuestsRootCid", async () => {
    it("should set root cid", async () => {
      let instance = await deploy([], questsRootCid);
      const newRootCid =
        "bagaaierasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea";
      let testGameMaster = accounts[1];
      await instance.grantRole(GAME_MASTER_ROLE, testGameMaster.address);

      await instance.connect(testGameMaster).setQuestsRootCID(newRootCid);

      let result = await instance.getQuestsRootCID();

      expect(result).eql(newRootCid);
    });

    it("should forbid setting the root to non game masters", async () => {
      let user = accounts[1];
      let instance = await deploy([], questsRootCid);
      const newRootCid =
        "bagaaierasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea";

      await expect(
        instance.connect(user).setQuestsRootCID(newRootCid)
      ).revertedWith(
        `AccessControl: account ${user.address.toLocaleLowerCase()} is missing role ${GAME_MASTER_ROLE}`
      );
    });
  });

  describe("addSolution", async () => {
    it("should forbid adding a chapter to non game masters", async () => {
      let user = accounts[1];
      let instance = await deploy([], questsRootCid);

      await expect(
        instance.connect(user).addSolution(solutions[0])
      ).revertedWith(
        `AccessControl: account ${user.address.toLocaleLowerCase()} is missing role ${GAME_MASTER_ROLE}`
      );
    });

    it("should add a new chapter from a game master", async () => {
      let instance = await deploy([], questsRootCid);
      let testGameMaster = accounts[1];
      let testSolution = solutions[0];

      await instance.grantRole(GAME_MASTER_ROLE, testGameMaster.address);
      await instance.connect(testGameMaster).addSolution(testSolution);

      let resultSolution = await instance._solutions(0);

      expect(resultSolution, testSolution);
    });
  });
});
