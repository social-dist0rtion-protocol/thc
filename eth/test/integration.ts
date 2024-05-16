// Hey, no need to include web3 since Truffle magically injects it
// const web3 = require("web3");
import { ethers } from "hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { solidity } from "ethereum-waffle";
import {
  Treasure,
  Treasure__factory,
  TreasureHuntCreator,
  TreasureHuntCreator__factory,
} from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, utils, Wallet } from "ethers";
import {
  cidToBytes,
  getKeySignature,
  getSignature,
  getSolutionAddress,
  getSolutionSignature,
  leaderboardEntry,
  merge,
} from "./utils";
import { keccak256, toUtf8Bytes } from "ethers/lib/utils";

chai.use(solidity);
chai.use(chaiAsPromised);
const { expect } = chai;

const PAGE_SIZE = 32;
const GAME_MASTER_ROLE = keccak256(toUtf8Bytes("GAME_MASTER_ROLE"));
const KEYS = [
  "order quick stereo library opera rack volume note useless dignity purchase avocado",
  "sort humor transfer labor bridge crisp spell nerve harvest poet sight mimic",
  "electric relief banner entry blood concert sight daring twist hood disorder swamp",
  "sonido ochenta aviso madera relieve oveja colina panal asombro maniquí móvil enchufe",
];

describe("TreasureHuntCreator", () => {
  let thcFactory: TreasureHuntCreator__factory;
  let treasure: Treasure;
  let accounts: SignerWithAddress[];
  let totalPlayers: number;
  let solutions: string[];
  let keys: string[];
  let questsRootCid: Uint8Array;
  let deployer: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let carl: SignerWithAddress;
  let dean: SignerWithAddress;

  beforeEach(async () => {
    [deployer, alice, bob, carl, dean] = await ethers.getSigners();

    const TreasureFactory = (await ethers.getContractFactory(
      "Treasure",
      alice
    )) as Treasure__factory;
    treasure = (await TreasureFactory.deploy()) as Treasure;

    thcFactory = (await ethers.getContractFactory(
      "TreasureHuntCreator",
      deployer
    )) as TreasureHuntCreator__factory;

    const accounts = await ethers.getSigners();
    totalPlayers = accounts.length;

    solutions = accounts.map((x) => x.address);
    keys = await Promise.all(
      KEYS.map(async (x) => await getSolutionAddress(x))
    );
    questsRootCid = cidToBytes(
      "QmUYWv6RaHHWkk5BMHJH4xKPEKNqAYKomeiTVobAMyxsbz"
    );
  });

  async function deploy(
    solutions: string[],
    keys: string[],
    questsRootCid: Uint8Array
  ): Promise<TreasureHuntCreator> {
    const thc = await thcFactory.deploy(solutions, keys, treasure.address);
    await treasure.grantRole(await treasure.TREASURE_HUNT_ROLE(), thc.address);
    await thc.setup(questsRootCid);
    await thc.deployed();

    return thc;
  }

  function encodeTokenId(thcAddress: string, badgeId: number) {
    return BigNumber.from(thcAddress).shl(96).or(BigNumber.from(badgeId));
  }

  async function solve(
    thc: TreasureHuntCreator,
    solution: string,
    player: SignerWithAddress
  ) {
    let [signature, solutionKey] = await getSignature(player, solution);
    let { r, v, s } = ethers.utils.splitSignature(signature);
    await thc.connect(player).submit(v, r, s);
  }

  async function submitKey(
    thc: TreasureHuntCreator,
    solution: string,
    player: SignerWithAddress
  ) {
    let [signature, solutionKey] = await getSignature(player, solution);
    let { r, v, s } = ethers.utils.splitSignature(signature);
    await thc.connect(player).submitKey(v, r, s);
  }

  describe("constructor", async () => {
    it("should initialize chapters with solutions and quests", async () => {
      let instance = await deploy(solutions, keys, questsRootCid);
      for (var i = 0; i < solutions.length; i++) {
        let solution = await instance.solutions(i);
        expect(solution).equal(solutions[i]);
      }
    });
  });

  describe("submit", async () => {
    it("should increment the user chapter with correct solution", async () => {
      let testSolution = "A solution.";
      let [signature, solutionKey] = await getSignature(deployer, testSolution);
      let { r, v, s } = ethers.utils.splitSignature(signature);

      let instance = await deploy([solutionKey], keys, questsRootCid);
      await instance.connect(deployer).submit(v, r, s);

      let result = await instance.playerToCurrentChapter(deployer.address);
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

      let instance = await deploy([solutionKey], keys, questsRootCid);

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
      let instance = await deploy([solutionKey], keys, questsRootCid);

      await expect(instance.connect(deployer).submit(v, r, s)).revertedWith("");

      let result = await instance.playerToCurrentChapter(deployer.address);
      expect(result).equal(0);
    });

    it("should not add player to list upon failure", async () => {
      let testSolution = "A wrong solution";
      let [signature, solutionKey] = await getSignature(deployer, testSolution);
      let { r, v, s } = ethers.utils.splitSignature(signature);

      let instance = await deploy([solutions[0]], keys, questsRootCid);

      await expect(instance.connect(deployer).submit(v, r, s)).revertedWith("");
      await expect(instance.players(0)).revertedWith("");
    });

    it("should add player to list upon success", async () => {
      let testSolution = "A solution";
      let [signature, solutionKey] = await getSignature(deployer, testSolution);
      let { r, v, s } = ethers.utils.splitSignature(signature);

      let instance = await deploy([solutionKey], keys, questsRootCid);

      await instance.connect(deployer).submit(v, r, s);

      let resultPlayer = await instance.players(0);

      expect(resultPlayer).equal(deployer.address);
    });

    it("should add the player to the solved chapter", async () => {
      let testSolution = "A solution";
      let [signature, solutionKey] = await getSignature(deployer, testSolution);
      let { r, v, s } = ethers.utils.splitSignature(signature);

      let instance = await deploy([solutionKey], keys, questsRootCid);
      await instance.connect(deployer).submit(v, r, s);

      let result = await instance.chapterToPlayers(0, 0);
      expect(result).equal(deployer.address);
    });

    it("should mint gold badge to first that finishes", async () => {
      let testSolution1 = "A solution 1";
      let solutionKey1 = await getSolutionAddress(testSolution1);

      let testSolution2 = "A solution 2";
      let solutionKey2 = await getSolutionAddress(testSolution2);

      let testSolution3 = "A solution 3";
      let solutionKey3 = await getSolutionAddress(testSolution3);

      let instance = await deploy(
        [solutionKey1, solutionKey2, solutionKey3],
        keys,
        questsRootCid
      );

      await solve(instance, testSolution1, deployer);
      await solve(instance, testSolution1, alice);

      await solve(instance, testSolution2, deployer);
      await solve(instance, testSolution2, alice);

      await solve(instance, testSolution3, deployer);
      await solve(instance, testSolution3, alice);

      const result1 = await treasure.balanceOf(
        deployer.address,
        encodeTokenId(instance.address, 1)
      );

      const result2 = await treasure.balanceOf(
        alice.address,
        encodeTokenId(instance.address, 1)
      );

      expect(result1.toNumber()).equal(1);
      expect(result2.toNumber()).equal(0);
    });

    it("should mint silver badge to first that finishes", async () => {
      let testSolution1 = "A solution 1";
      let solutionKey1 = await getSolutionAddress(testSolution1);

      let testSolution2 = "A solution 2";
      let solutionKey2 = await getSolutionAddress(testSolution2);

      let testSolution3 = "A solution 3";
      let solutionKey3 = await getSolutionAddress(testSolution3);

      let instance = await deploy(
        [solutionKey1, solutionKey2, solutionKey3],
        keys,
        questsRootCid
      );

      await solve(instance, testSolution1, deployer);
      await solve(instance, testSolution1, alice);

      await solve(instance, testSolution2, deployer);
      await solve(instance, testSolution2, alice);

      await solve(instance, testSolution3, deployer);
      await solve(instance, testSolution3, alice);

      const result1 = await treasure.balanceOf(
        deployer.address,
        encodeTokenId(instance.address, 2)
      );

      const result2 = await treasure.balanceOf(
        alice.address,
        encodeTokenId(instance.address, 2)
      );

      expect(result1.toNumber()).equal(0);
      expect(result2.toNumber()).equal(1);
    });

    it("should mint bronze badge to first that finishes", async () => {
      let testSolution1 = "A solution 1";
      let solutionKey1 = await getSolutionAddress(testSolution1);

      let testSolution2 = "A solution 2";
      let solutionKey2 = await getSolutionAddress(testSolution2);

      let testSolution3 = "A solution 3";
      let solutionKey3 = await getSolutionAddress(testSolution3);

      let instance = await deploy(
        [solutionKey1, solutionKey2, solutionKey3],
        keys,
        questsRootCid
      );

      await solve(instance, testSolution1, deployer);
      await solve(instance, testSolution1, alice);
      await solve(instance, testSolution1, bob);

      await solve(instance, testSolution2, deployer);
      await solve(instance, testSolution2, alice);
      await solve(instance, testSolution2, bob);

      await solve(instance, testSolution3, deployer);
      await solve(instance, testSolution3, alice);
      await solve(instance, testSolution3, bob);

      const result1 = await treasure.balanceOf(
        deployer.address,
        encodeTokenId(instance.address, 3)
      );

      const result2 = await treasure.balanceOf(
        alice.address,
        encodeTokenId(instance.address, 3)
      );

      const result3 = await treasure.balanceOf(
        bob.address,
        encodeTokenId(instance.address, 3)
      );

      expect(result1.toNumber()).equal(0);
      expect(result2.toNumber()).equal(0);
      expect(result3.toNumber()).equal(1);
    });

    it("should mint participation badge to all but first 3", async () => {
      let testSolution1 = "A solution 1";
      let solutionKey1 = await getSolutionAddress(testSolution1);

      let testSolution2 = "A solution 2";
      let solutionKey2 = await getSolutionAddress(testSolution2);

      let testSolution3 = "A solution 3";
      let solutionKey3 = await getSolutionAddress(testSolution3);

      let instance = await deploy(
        [solutionKey1, solutionKey2, solutionKey3],
        keys,
        questsRootCid
      );

      await Promise.all(
        [deployer, alice, bob, carl, dean].map(
          async (x) => await solve(instance, testSolution1, x)
        )
      );
      await Promise.all(
        [deployer, alice, bob, carl, dean].map(
          async (x) => await solve(instance, testSolution2, x)
        )
      );
      await Promise.all(
        [deployer, alice, bob, carl, dean].map(
          async (x) => await solve(instance, testSolution3, x)
        )
      );

      const balances = await Promise.all(
        [deployer, alice, bob, carl, dean].map(async (x) =>
          treasure.balanceOf(x.address, encodeTokenId(instance.address, 4))
        )
      );

      expect(balances[0].toNumber()).equal(0);
      expect(balances[1].toNumber()).equal(0);
      expect(balances[2].toNumber()).equal(0);
      expect(balances[3].toNumber()).equal(1);
      expect(balances[4].toNumber()).equal(1);
    });
  });

  describe("submitKey", async () => {
    it("should return an empty bitmap if player has no keys", async () => {
      const instance = await deploy(solutions, keys, questsRootCid);
      expect(await instance.playerToKeys(deployer.address)).equal(
        BigNumber.from(0)
      );
    });

    it("should add a key to the player bitmap", async () => {
      const instance = await deploy(solutions, keys, questsRootCid);
      await submitKey(instance, KEYS[0], deployer);
      expect(await instance.playerToKeys(deployer.address)).equal(
        BigNumber.from(1)
      );
    });

    it("should mint key badge to who finds all keys", async () => {
      const instance = await deploy(solutions, keys, questsRootCid);

      for (let i = 0; i < KEYS.length; i++) {
        await submitKey(instance, KEYS[i], alice);
      }

      const result = await treasure.balanceOf(
        alice.address,
        encodeTokenId(instance.address, 5)
      );

      expect(result).equal(1);
    });

    it("should reject a wrong key", async () => {
      const w = Wallet.createRandom();
      const signature = await w.signMessage(utils.arrayify(deployer.address));
      const { r, v, s } = ethers.utils.splitSignature(signature);
      const instance = await deploy(solutions, keys, questsRootCid);

      await expect(instance.connect(deployer).submitKey(v, r, s)).revertedWith(
        "Wrong key"
      );
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
        keys,
        questsRootCid
      );

      let leaderboard = await instance.getLeaderboard(0);
      let expectedLeaderboard = Array(PAGE_SIZE).fill(BigNumber.from(0));
      expect(leaderboard.map((n) => n.toString())).eql(
        expectedLeaderboard.map((n) => n.toString())
      );
    });

    it("should return the list of players and chapters", async () => {
      let [player1, player2, player3] = [bob, alice, carl];

      let testSolution1 = "A solution 1";
      let solutionKey1 = await getSolutionAddress(testSolution1);

      let testSolution2 = "A solution 2";
      let solutionKey2 = await getSolutionAddress(testSolution2);

      let testSolution3 = "A solution 3";
      let solutionKey3 = await getSolutionAddress(testSolution3);

      let instance = await deploy(
        [solutionKey1, solutionKey2, solutionKey3],
        keys,
        questsRootCid
      );

      // Let the game begin!
      let leaderboard;
      let expectedLeaderboard;

      // player 1 solves chapter 1
      let sig = await getSolutionSignature(testSolution1, player1.address);
      await instance.connect(player1).submit(sig.v, sig.r, sig.s);
      leaderboard = await instance.getLeaderboard(0);
      expectedLeaderboard = Array(PAGE_SIZE).fill(BigNumber.from(0));
      expectedLeaderboard[0] = leaderboardEntry(player1.address, [], 1);
      expect(leaderboard.map((n) => n.toString())).eql(
        expectedLeaderboard.map((n) => n.toString())
      );

      // player 1 finds key 0
      await submitKey(instance, KEYS[0], player1);

      // player 2 solves chapter 1
      await solve(instance, testSolution1, player2);

      leaderboard = await instance.getLeaderboard(0);
      expectedLeaderboard = Array(PAGE_SIZE).fill(BigNumber.from(0));
      expectedLeaderboard[0] = leaderboardEntry(player1.address, [0], 1);
      expectedLeaderboard[1] = leaderboardEntry(player2.address, [], 1);
      expect(leaderboard.map((n) => n.toString())).eql(
        expectedLeaderboard.map((n) => n.toString())
      );

      // plot twist: player 3 solves chapter 1, 2, and 3
      await solve(instance, testSolution1, player3);
      await solve(instance, testSolution2, player3);
      await solve(instance, testSolution3, player3);

      // Player 3 finds keys 0 and 2
      await submitKey(instance, KEYS[0], player3);
      await submitKey(instance, KEYS[2], player3);

      leaderboard = await instance.getLeaderboard(0);

      expectedLeaderboard = Array(PAGE_SIZE).fill(BigNumber.from(0));
      expectedLeaderboard[0] = leaderboardEntry(player1.address, [0], 1);
      expectedLeaderboard[1] = leaderboardEntry(player2.address, [], 1);
      expectedLeaderboard[2] = leaderboardEntry(player3.address, [0, 2], 3);
      expect(leaderboard.map((n) => n.toString())).eql(
        expectedLeaderboard.map((n) => n.toString())
      );
    });
  });

  describe("setup", async () => {
    it("should set root cid", async () => {
      let instance = await deploy([], keys, questsRootCid);
      const newRootCid = cidToBytes(
        "bagaaierasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea"
      );
      let testGameMaster = alice;
      await instance.grantRole(GAME_MASTER_ROLE, testGameMaster.address);
      await treasure.grantRole(
        await treasure.TREASURE_HUNT_ROLE(),
        instance.address
      );
      await instance.connect(testGameMaster).setup(newRootCid);

      let result = await instance.getQuestsRootCID();

      expect(utils.arrayify(result)).eql(newRootCid);
    });

    it("should forbid setting the root to non game masters", async () => {
      let user = alice;
      let instance = await deploy([], keys, questsRootCid);
      const newRootCid = cidToBytes(
        "bagaaierasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea"
      );
      await treasure.grantRole(
        await treasure.TREASURE_HUNT_ROLE(),
        instance.address
      );
      await expect(instance.connect(user).setup(newRootCid)).revertedWith(
        `AccessControl: account ${user.address.toLocaleLowerCase()} is missing role ${GAME_MASTER_ROLE}`
      );
    });
  });

  describe("addSolution", async () => {
    it("should forbid adding a chapter to non game masters", async () => {
      let user = alice;
      let instance = await deploy([], keys, questsRootCid);

      await expect(
        instance.connect(user).addSolution(solutions[0])
      ).revertedWith(
        `AccessControl: account ${user.address.toLocaleLowerCase()} is missing role ${GAME_MASTER_ROLE}`
      );
    });

    it("should add a new chapter from a game master", async () => {
      let instance = await deploy([], keys, questsRootCid);
      let testGameMaster = alice;
      let testSolution = solutions[0];

      await instance.grantRole(GAME_MASTER_ROLE, testGameMaster.address);
      await instance.connect(testGameMaster).addSolution(testSolution);

      let resultSolution = await instance.solutions(0);

      expect(resultSolution, testSolution);
    });
  });
});
