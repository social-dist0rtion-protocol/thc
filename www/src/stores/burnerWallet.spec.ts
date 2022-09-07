import { get } from "svelte/store";
import { mnemonic, provider, signer } from "./burnerWallet";

beforeEach(() => localStorage.clear());

describe("provider", () => {
  test("is set", () => {
    const p = get(provider);
    p.connection.url === "http://localhost:8545";
  });
});

describe("mnemonic", () => {
  test("is set", () => {
    const m = get(mnemonic)!;
    expect(m).toBeTruthy();
  });
});

describe("signer", () => {
  test("is set", () => {
    const s = get(signer)!;
    expect(s).toBeTruthy();
  });
});
