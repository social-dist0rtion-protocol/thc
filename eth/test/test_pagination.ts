import { ethers } from "hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import {
  Treasure,
  Treasure__factory,
  TreasureHuntCreator,
  TreasureHuntCreator__factory,
} from "../typechain";
import {
  cidToBytes,
  getSolutionAddress,
  getSolutionSignature,
  leaderboardEntry,
  parseLeaderboard,
} from "./utils";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { parseEther, Wallet } from "ethers";

chai.use(chaiAsPromised);
const { expect } = chai;

describe.skip("TreasureHuntCreator Pagination", () => {
  let thc: TreasureHuntCreator;
  let alice: SignerWithAddress;
  let thcFactory: TreasureHuntCreator__factory;
  let treasure: Treasure;
  let accounts: SignerWithAddress[];
  let totalPlayers: number;
  let questsRootCid: Uint8Array;
  let PAGE_SIZE: number;
  let TOTAL: number;

  let testSolution1 = "A solution 1";
  let testSolution2 = "A solution 2";
  let testSolution3 = "A solution 3";

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    alice = accounts[0];

    thcFactory = (await ethers.getContractFactory(
      "TreasureHuntCreator",
      accounts[0]
    )) as any as TreasureHuntCreator__factory;

    const treasureFactory = (await ethers.getContractFactory(
      "Treasure",
      accounts[0]
    )) as Treasure__factory;
    treasure = (await treasureFactory.deploy()) as Treasure;

    totalPlayers = accounts.length;
    questsRootCid = cidToBytes(
      "QmUYWv6RaHHWkk5BMHJH4xKPEKNqAYKomeiTVobAMyxsbz"
    );

    let solutionKey1 = await getSolutionAddress(testSolution1);
    let solutionKey2 = await getSolutionAddress(testSolution2);
    let solutionKey3 = await getSolutionAddress(testSolution3);

    thc = await thcFactory.deploy(
      [solutionKey1, solutionKey2, solutionKey3],
      [],
      await treasure.getAddress()
    );

    PAGE_SIZE = Number(await thc.PAGE_SIZE());
    TOTAL = PAGE_SIZE + 1;
  });

  it("should paginate", async () => {
    const expectedLeaderboardPage0 = Array(PAGE_SIZE).fill(
      leaderboardEntry("0x0000000000000000000000000000000000000000", [], 0)
    );
    const expectedLeaderboardPage1 = Array(PAGE_SIZE).fill(
      leaderboardEntry("0x0000000000000000000000000000000000000000", [], 0)
    );

    // Send solutions
    for (let i = 0; i < TOTAL; i++) {
      process.stdout.write(`\r[${i + 1}/${TOTAL}] Submit solution`);
      const player = Wallet.createRandom().connect(alice.provider);
      await alice.sendTransaction({
        value: parseEther("0.001"),
        to: player.address,
      });

      const signature = await getSolutionSignature(
        testSolution1,
        player.address
      );

      await thc.connect(player).submit(signature.v!, signature.r, signature.s);

      if (i < PAGE_SIZE) {
        expectedLeaderboardPage0[i] = leaderboardEntry(player.address, [], 1);
      } else {
        expectedLeaderboardPage1[i - PAGE_SIZE] = leaderboardEntry(
          player.address,
          [],
          1
        );
      }
    }

    const leaderboardPage0 = parseLeaderboard(await thc.getLeaderboard(0));
    expect(leaderboardPage0).to.deep.equal(expectedLeaderboardPage0);

    const leaderboardPage1 = parseLeaderboard(await thc.getLeaderboard(1));
    expect(leaderboardPage1).to.deep.equal(expectedLeaderboardPage1);
  });
});
