import { addressFromSolution } from "./thc";

describe("addressFromSolution", () => {
  test("returns the address of a solution", async () => {
    const t = [
      ["2903", "0x6647156e934C829A554F97761550C4d567602dEF"],
      ["~~~bl4ck w4t3r g04t~~~", "0x6A37bf9E252D8175b3c962b4a8Cfb6E97668Ad58"],
      ["key:foo", "0xFa29292B496C971dB55E218BF702fF635b051786"],
      [" 2903", "0x6647156e934C829A554F97761550C4d567602dEF"],
      ["~~~BL4Ck W4t3r g04t~~~", "0x6A37bf9E252D8175b3c962b4a8Cfb6E97668Ad58"],
      ["key:foo\n\n", "0xFa29292B496C971dB55E218BF702fF635b051786"],
    ];

    for (const [solution, expectedAddress] of t) {
      const address = addressFromSolution(solution);
      expect(address).toEqual(expectedAddress);
    }
  });
});
