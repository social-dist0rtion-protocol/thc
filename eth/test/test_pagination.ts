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
  merge,
} from "./utils";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

chai.use(chaiAsPromised);
const { expect } = chai;

const PAGE_SIZE = 32;

describe("TreasureHuntCreator Pagination", () => {
  let thcFactory: TreasureHuntCreator__factory;
  let treasure: Treasure;
  let accounts: SignerWithAddress[];
  let totalPlayers: number;
  let questsRootCid: Uint8Array;

  beforeEach(async () => {
    accounts = await ethers.getSigners();

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
  });

  async function deploy(
    solutions: string[],
    questsRootCid: Uint8Array
  ): Promise<TreasureHuntCreator> {
    const thc = await thcFactory.deploy(
      solutions,
      [],
      await treasure.getAddress()
    );
    return thc;
  }

  it("should paginate", async () => {
    let testSolution1 = "A solution 1";
    let solutionKey1 = await getSolutionAddress(testSolution1);

    let testSolution2 = "A solution 2";
    let solutionKey2 = await getSolutionAddress(testSolution2);

    let testSolution3 = "A solution 3";
    let solutionKey3 = await getSolutionAddress(testSolution3);

    let thc = await deploy(
      [solutionKey1, solutionKey2, solutionKey3],
      questsRootCid
    );

    let expectedLeaderboard = Array(PAGE_SIZE * 2).fill(0);

    let leaderboard = await thc.getLeaderboard(0);

    // Send solutions
    for (let i = 0; i < totalPlayers; i++) {
      process.stdout.write(`\r[${i + 1}/${totalPlayers}] Submit solution`);
      const signature = await getSolutionSignature(
        testSolution1,
        accounts[i].address
      );
      await thc
        .connect(accounts[i])
        .submit(signature.v, signature.r, signature.s);
      expectedLeaderboard[i] = merge(accounts[i].address, 1);
    }

    leaderboard = await thc.getLeaderboard(0);

    expect(leaderboard.map((n) => n.toString())).eql(
      expectedLeaderboard.slice(0, PAGE_SIZE).map((n) => n.toString())
    );

    leaderboard = await thc.getLeaderboard(1);
    expect(leaderboard.map((n) => n.toString())).eql(
      expectedLeaderboard
        .slice(PAGE_SIZE, PAGE_SIZE * 2)
        .map((n) => n.toString())
    );
  });
});
