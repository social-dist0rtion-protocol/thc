// Hey, no need to include web3 since Truffle magically injects it
// const web3 = require("web3");
import { ethers, upgrades } from "hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import {
  DisappearRenderer,
  DisappearRenderer__factory,
  MyToken,
  MyToken__factory,
  Treasure,
  Treasure__factory,
  TreasureHuntCreator,
  TreasureHuntCreator__factory,
} from "../typechain";
import {
  Signature,
  Wallet,
  getDefaultProvider,
  keccak256,
  toUtf8Bytes,
} from "ethers";
import {
  cidToBytes,
  encodeTokenId,
  getSignature,
  getSolutionAddress,
  getSolutionSignature,
  leaderboardEntry,
} from "./utils";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { mkdirSync, writeFileSync } from "fs";

chai.use(chaiAsPromised);
const { expect } = chai;

const PAGE_SIZE = 32;
const GAME_MASTER_ROLE = keccak256(toUtf8Bytes("GAME_MASTER_ROLE"));
const DEFAULT_ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const KEYS = [
  "order quick stereo library opera rack volume note useless dignity purchase avocado",
  "sort humor transfer labor bridge crisp spell nerve harvest poet sight mimic",
  "electric relief banner entry blood concert sight daring twist hood disorder swamp",
  "sonido ochenta aviso madera relieve oveja colina panal asombro maniquí móvil enchufe",
];

describe("TreasureHuntCreator", () => {
  let thcFactory: TreasureHuntCreator__factory;
  let myTokenFactory: MyToken__factory;
  let treasure: Treasure;
  let renderer: DisappearRenderer;
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
      deployer
    )) as Treasure__factory;
    treasure = (await upgrades.deployProxy(
      TreasureFactory
    )) as unknown as Treasure;
    await treasure.waitForDeployment();

    const RendererFactory = (await ethers.getContractFactory(
      "DisappearRenderer",
      deployer
    )) as DisappearRenderer__factory;
    renderer = (await RendererFactory.deploy()) as DisappearRenderer;

    thcFactory = (await ethers.getContractFactory(
      "TreasureHuntCreator",
      deployer
    )) as any as TreasureHuntCreator__factory;

    myTokenFactory = (await ethers.getContractFactory(
      "MyToken",
      deployer
    )) as unknown as MyToken__factory;

    accounts = await ethers.getSigners();
    totalPlayers = accounts.length;

    solutions = accounts.map((x) => x.address);
    keys = await Promise.all(KEYS.map((x) => getSolutionAddress(x)));

    questsRootCid = cidToBytes(
      "QmUYWv6RaHHWkk5BMHJH4xKPEKNqAYKomeiTVobAMyxsbz"
    );
  });

  async function deploy(
    solutions: string[],
    keys: string[]
  ): Promise<TreasureHuntCreator> {
    const thc = await thcFactory.deploy(solutions, keys, treasure.getAddress());
    await treasure.grantRole(
      await treasure.TREASURE_HUNT_ROLE(),
      thc.getAddress()
    );
    await thc.setup(questsRootCid);

    await treasure.updateRenderer(thc.getAddress(), renderer.getAddress());

    return thc;
  }

  async function deployMyToken(): Promise<MyToken> {
    return await myTokenFactory.deploy();
  }

  async function solve(
    thc: TreasureHuntCreator,
    solution: string,
    player: SignerWithAddress
  ) {
    let [signature, solutionKey] = await getSignature(player, solution);
    let { r, v, s } = Signature.from(signature);
    await thc.connect(player).submit(v, r, s);
  }

  async function submitKey(
    thc: TreasureHuntCreator,
    solution: string,
    player: SignerWithAddress
  ) {
    let [signature, solutionKey] = await getSignature(player, solution);
    let { r, v, s } = Signature.from(signature);
    await thc.connect(player).submitKey(v, r, s);
  }

  async function unpackAndStore(
    instance: TreasureHuntCreator,
    badgeName: string,
    badgeId: number
  ) {
    const meta = "data:application/json;base64,";
    const metaImage = "data:image/svg+xml,";
    const badge = await treasure.uri(
      encodeTokenId(await instance.getAddress(), badgeId)
    );

    const json = JSON.parse(atob(badge.substring(meta.length)));
    const image = json["image"].substring(metaImage.length);

    mkdirSync("artifacts/tests/", { recursive: true });
    writeFileSync(`artifacts/tests/${badgeName}.json`, JSON.stringify(json));
    writeFileSync(`artifacts/tests/${badgeName}.svg`, image);
  }

  describe("constructor", async () => {
    it("should initialize chapters with solutions and quests", async () => {
      let instance = await deploy(solutions, keys);
      for (var i = 0; i < accounts.length; i++) {
        let solution = await instance.solutions(i);
        expect(solution).equal(accounts[i].address);
      }
    });
  });

  describe("submit", async () => {
    it("should increment the user chapter with correct solution", async () => {
      let testSolution = "A solution.";
      let [signature, solutionKey] = await getSignature(deployer, testSolution);
      let { r, v, s } = Signature.from(signature);

      let instance = await deploy([solutionKey], keys);
      await instance.connect(deployer).submit(v, r, s);

      let result = await instance.playerToCurrentChapter(deployer.address);
      expect(result).equal(1n);
    });

    it("should fail with wrong solution", async () => {
      let testRightSolution = "Right solution";
      let testWrongSolution = "Wrong solution";

      let [signatureWrong] = await getSignature(deployer, testWrongSolution);
      let [signatureRight, solutionKey] = await getSignature(
        deployer,
        testRightSolution
      );
      let { r, v, s } = Signature.from(signatureWrong);

      let instance = await deploy([solutionKey], keys);

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
      let { r, v, s } = Signature.from(signatureWrong);
      let instance = await deploy([solutionKey], keys);

      await expect(instance.connect(deployer).submit(v, r, s)).revertedWith(
        "Wrong solution."
      );

      let result = await instance.playerToCurrentChapter(deployer.address);
      expect(result).equal(0n);
    });

    it("should not add player to list upon failure", async () => {
      let testSolution = "A wrong solution";
      let [signature, solutionKey] = await getSignature(deployer, testSolution);
      let { r, v, s } = Signature.from(signature);

      let instance = await deploy([solutions[0]], keys);

      await expect(instance.connect(deployer).submit(v, r, s)).revertedWith(
        "Wrong solution."
      );
      await expect(instance.players(0)).reverted;
    });

    it("should add player to list upon success", async () => {
      let testSolution = "A solution";
      let [signature, solutionKey] = await getSignature(deployer, testSolution);
      let { r, v, s } = Signature.from(signature);

      let instance = await deploy([solutionKey], keys);

      await instance.connect(deployer).submit(v, r, s);

      let resultPlayer = await instance.players(0);

      expect(resultPlayer).equal(deployer.address);
    });

    it("should add the player to the solved chapter", async () => {
      let testSolution = "A solution";
      let [signature, solutionKey] = await getSignature(deployer, testSolution);
      let { r, v, s } = Signature.from(signature);

      let instance = await deploy([solutionKey], keys);
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
        keys
      );

      await solve(instance, testSolution1, deployer);
      await solve(instance, testSolution1, alice);

      await solve(instance, testSolution2, deployer);
      await solve(instance, testSolution2, alice);

      await solve(instance, testSolution3, deployer);
      await solve(instance, testSolution3, alice);

      const result1 = await treasure.balanceOf(
        deployer.address,
        encodeTokenId(await instance.getAddress(), 1)
      );

      const result2 = await treasure.balanceOf(
        alice.address,
        encodeTokenId(await instance.getAddress(), 1)
      );

      expect(result1).equal(1n);
      expect(result2).equal(0n);
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
        keys
      );

      await solve(instance, testSolution1, deployer);
      await solve(instance, testSolution1, alice);

      await solve(instance, testSolution2, deployer);
      await solve(instance, testSolution2, alice);

      await solve(instance, testSolution3, deployer);
      await solve(instance, testSolution3, alice);

      const result1 = await treasure.balanceOf(
        deployer.address,
        encodeTokenId(await instance.getAddress(), 2)
      );

      const result2 = await treasure.balanceOf(
        alice.address,
        encodeTokenId(await instance.getAddress(), 2)
      );

      expect(result1).equal(0n);
      expect(result2).equal(1n);
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
        keys
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
        encodeTokenId(await instance.getAddress(), 3)
      );

      const result2 = await treasure.balanceOf(
        alice.address,
        encodeTokenId(await instance.getAddress(), 3)
      );

      const result3 = await treasure.balanceOf(
        bob.address,
        encodeTokenId(await instance.getAddress(), 3)
      );

      expect(result1).equal(0n);
      expect(result2).equal(0n);
      expect(result3).equal(1n);
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
        keys
      );

      for (const player of [deployer, alice, bob, carl, dean]) {
        await solve(instance, testSolution1, player);
        await solve(instance, testSolution2, player);
        await solve(instance, testSolution3, player);
      }

      const balances = await Promise.all(
        [deployer, alice, bob, carl, dean].map(async (x) =>
          treasure.balanceOf(
            x.address,
            encodeTokenId(await instance.getAddress(), 4)
          )
        )
      );

      expect(balances[0]).equal(0n);
      expect(balances[1]).equal(0n);
      expect(balances[2]).equal(0n);
      expect(balances[3]).equal(1n);
      expect(balances[4]).equal(1n);
    });

    it("should render badges", async () => {
      let testSolution1 = "A solution 1";
      let solutionKey1 = await getSolutionAddress(testSolution1);

      let testSolution2 = "A solution 2";
      let solutionKey2 = await getSolutionAddress(testSolution2);

      let testSolution3 = "A solution 3";
      let solutionKey3 = await getSolutionAddress(testSolution3);

      let instance = await deploy(
        [solutionKey1, solutionKey2, solutionKey3],
        keys
      );

      const players: SignerWithAddress[] = [deployer, alice, bob, carl, dean];
      const solutions: string[] = [testSolution1, testSolution2, testSolution3];
      for (let j = 0; j < solutions.length; j++) {
        for (let i = 0; i < players.length; i++) {
          await solve(instance, solutions[j], players[i]);
        }
      }

      await unpackAndStore(instance, "gold", 1);
      await unpackAndStore(instance, "silver", 2);
      await unpackAndStore(instance, "bronze", 3);
      await unpackAndStore(instance, "participation", 4);
    });
  });

  describe("submitKey", async () => {
    it("should return an empty bitmap if player has no keys", async () => {
      const instance = await deploy(solutions, keys);
      expect(await instance.playerToKeys(deployer.address)).equal(0n);
    });

    it("should add a key to the player bitmap", async () => {
      const instance = await deploy(solutions, keys);
      const { r, v, s } = await getSolutionSignature(KEYS[0], deployer.address);
      // @ts-ignore FIXME
      await instance.connect(deployer).submitKey(v, r, s);
      expect(await instance.playerToKeys(deployer.address)).equal(1n);
    });

    it("should mint key badge to who finds all keys", async () => {
      const instance = await deploy(solutions, keys);

      for (let i = 0; i < KEYS.length; i++) {
        await submitKey(instance, KEYS[i], alice);
      }

      const result = await treasure.balanceOf(
        alice.address,
        encodeTokenId(await instance.getAddress(), 5)
      );

      expect(result).equal(1);
    });

    it("should render key badge for who finds all keys", async () => {
      const instance = await deploy(solutions, keys);

      for (let i = 0; i < KEYS.length; i++) {
        await submitKey(instance, KEYS[i], alice);
      }

      await unpackAndStore(instance, "key", 5);
    });

    it("should reject a wrong key", async () => {
      const w = Wallet.createRandom();
      const signature = await w.signMessage(toUtf8Bytes(deployer.address));
      const { r, v, s } = Signature.from(signature);
      const instance = await deploy(solutions, keys);

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
        keys
      );

      let leaderboard = await instance.getLeaderboard(0);
      let expectedLeaderboard = Array(PAGE_SIZE).fill(0n);
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
        keys
      );

      // Let the game begin!
      let leaderboard;
      let expectedLeaderboard;

      // player 1 solves chapter 1
      let sig = await getSolutionSignature(testSolution1, player1.address);
      // @ts-ignore FIXME
      await instance.connect(player1).submit(sig.v, sig.r, sig.s);
      leaderboard = await instance.getLeaderboard(0);
      expectedLeaderboard = Array(PAGE_SIZE).fill(0n);
      expectedLeaderboard[0] = leaderboardEntry(player1.address, [], 1);
      expect(leaderboard.map((n) => n.toString())).eql(
        expectedLeaderboard.map((n) => n.toString())
      );

      // player 1 finds key 0
      await submitKey(instance, KEYS[0], player1);

      // player 2 solves chapter 1
      await solve(instance, testSolution1, player2);

      leaderboard = await instance.getLeaderboard(0);
      expectedLeaderboard = Array(PAGE_SIZE).fill(0n);
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

      expectedLeaderboard = Array(PAGE_SIZE).fill(0n);
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
      let instance = await deploy([], keys);
      const newRootCid = "0x61626364";
      let testGameMaster = alice;
      await instance.grantRole(GAME_MASTER_ROLE, testGameMaster.address);
      await treasure.grantRole(
        await treasure.TREASURE_HUNT_ROLE(),
        await instance.getAddress()
      );
      await instance.connect(testGameMaster).setup(newRootCid);

      let result = await instance.getQuestsRootCID();
      expect(result).eql(newRootCid);
    });

    it("should forbid setting the root to non game masters", async () => {
      let instance = await deploy([], keys);
      const newRootCid = "0x61626364";
      await treasure.grantRole(
        await treasure.TREASURE_HUNT_ROLE(),
        await instance.getAddress()
      );
      await expect(instance.connect(alice).setup(newRootCid)).revertedWith(
        `AccessControl: account ${alice.address.toLocaleLowerCase()} is missing role ${GAME_MASTER_ROLE}`
      );
    });

    it("should fail when treasure hunt not granted special role on treasure", async () => {
      const instance = await thcFactory.deploy(
        solutions,
        keys,
        treasure.getAddress()
      );
      const newRootCid = "0x61626364";

      await expect(instance.setup(newRootCid)).revertedWith(
        `Game not verified yet`
      );
    });

    it("should forbid setting the root to non game masters", async () => {
      let instance = await deploy([], keys);
      const newRootCid = "0x61626364";
      await treasure.grantRole(
        await treasure.TREASURE_HUNT_ROLE(),
        await instance.getAddress()
      );
      await expect(instance.connect(alice).setup(newRootCid)).revertedWith(
        `AccessControl: account ${alice.address.toLocaleLowerCase()} is missing role ${GAME_MASTER_ROLE}`
      );
    });
  });

  describe("addSolution", async () => {
    it("should forbid adding a chapter to non game masters", async () => {
      let instance = await deploy([], keys);

      await expect(
        instance.connect(alice).addSolution(solutions[0])
      ).revertedWith(
        `AccessControl: account ${alice.address.toLocaleLowerCase()} is missing role ${GAME_MASTER_ROLE}`
      );
    });

    it("should add a new chapter from a game master", async () => {
      let instance = await deploy([], keys);
      let testGameMaster = alice;
      let testSolution = solutions[0];

      await instance.grantRole(GAME_MASTER_ROLE, testGameMaster.address);
      await instance.connect(testGameMaster).addSolution(testSolution);

      let resultSolution = await instance.solutions(0);

      expect(resultSolution, testSolution);
    });
  });

  describe("withdrawERC20", () => {
    let thc: TreasureHuntCreator;
    let token: MyToken;

    beforeEach(async () => {
      thc = await deploy([], keys);
      token = await deployMyToken();
      await token.mint(thc.getAddress(), 666);
    });

    it("should allow the admin to withdraw the tokens", async () => {
      await thc
        .connect(deployer)
        .withdrawERC20(token.getAddress(), alice.address);
      expect(await token.balanceOf(alice.address)).equal(666);
    });

    it("should not allow anyone else to withdraw the tokens", async () => {
      await expect(
        thc.connect(alice).withdrawERC20(token.getAddress(), alice.address)
      ).revertedWith(
        `AccessControl: account ${alice.address.toLocaleLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`
      );
    });
  });

  describe("withdraw", () => {
    let thc: TreasureHuntCreator;
    const receiver = Wallet.createRandom().address;

    beforeEach(async () => {
      thc = await deploy([], keys);
      await alice.sendTransaction({
        value: 666,
        to: receiver,
      });
    });

    it("should allow the admin to withdraw the tokens", async () => {
      await thc.connect(deployer).withdraw(receiver);
      expect(await ethers.provider.getBalance(receiver)).equal(666);
    });

    it("should not allow anyone else to withdraw the tokens", async () => {
      await expect(thc.connect(alice).withdraw(alice.address)).revertedWith(
        `AccessControl: account ${alice.address.toLocaleLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`
      );
    });
  });

  describe.only("timestamp", () => {
    let thc: TreasureHuntCreator;
    let testSolution1 = "A solution 1";
    let solutionKey1: `0x${string}`;

    beforeEach(async () => {
      solutionKey1 = await getSolutionAddress(testSolution1);
      thc = await deploy([solutionKey1], keys);
    });

    it("should set the timestamp on a successful submission", async () => {
      await solve(thc, testSolution1, alice);
      const startTimestamp = await thc.startTimestamp();

      const submissionTimestamp = await time.latest();
      const playerTimestamp = await thc.playerToRelativeTimestamp(
        alice.address
      );

      expect(startTimestamp).equal(submissionTimestamp);
      expect(playerTimestamp).equal(0);
    });

    it("should not set the timestamp if already set", async () => {
      await solve(thc, testSolution1, alice);
      const startTimestamp = Number(await thc.startTimestamp());

      time.increase(666);

      await solve(thc, testSolution1, bob);

      // startTimestamp shuold not change
      expect(await thc.startTimestamp()).to.equal(startTimestamp);
      expect(await thc.playerToRelativeTimestamp(bob.address)).equal(666);
    });
  });
});
