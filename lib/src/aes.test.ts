import {
  generateKey,
  encryptRaw,
  decryptRaw,
  encrypt,
  decrypt,
  importKey,
} from "./aes";

describe("generateKey", () => {
  test("returns a symmetric encryption key", async () => {
    const key = await generateKey();
    expect(key.type).toEqual("secret");
  });
});

describe("importKey", () => {
  test("returns a symmetric encryption key", async () => {
    const key = await importKey("ciaone");
    expect(key.type).toEqual("secret");
  });

  test("returns a symmetric encryption key with unicode chars", async () => {
    const key = await importKey("👁️👄👁");
    expect(key.type).toEqual("secret");
  });
});

describe("encrypt", () => {
  let key: CryptoKey;

  beforeEach(async () => {
    key = await generateKey();
  });

  test("should use a different IV every time", async () => {
    const data = new TextEncoder().encode("Thorough Heuristic Checks");
    const iv0 = (await encryptRaw(data, key)).slice(0, 12);
    const iv1 = (await encryptRaw(data, key)).slice(0, 12);
    expect(iv0).not.toEqual(iv1);
  });
});

describe("encryptRaw & decryptRaw", () => {
  let key: CryptoKey;

  beforeEach(async () => {
    key = await generateKey();
  });

  test("they should work nicely together", async () => {
    const data = new TextEncoder().encode("Testing Hermetic Code");
    expect(await decryptRaw(await encryptRaw(data, key), key)).toEqual(data);
  });
});

describe("encrypt & decrypt", () => {
  const key = "ciaone";

  test("they should work nicely together ", async () => {
    const text = "Testing Happy Cases";
    expect(await decrypt(await encrypt(text, key), key)).toEqual(text);
  });

  test("they should work nicely together even with unicode", async () => {
    const text = "T̶͙̦͖̰͎̥̲͎̈́͌̒̈́̾̀̓̍e̵̱̻̮̫͇͖̰͔̯͔̰̪̊̎͌̌̾͝ş̸̠̣̠̖͙̣̯͙̏̏̉͛̂̀̑́͋̒̓̿̚t̸̢̫͓͕̹̹̭͕̰͙͍̏i̷̘͎̹̖͍͕͎̰̱̹̓̌̍̚͠ñ̶̢̜̙͓̮̤͎̅̊̈́̓̓͋͌͗̿ģ̶̹͎̦̰̤̯͕͉̥͛̂̉͐ͅͅ ̷̞͖̩͍̪̻̘̆̐̕Ḥ̷̛̛̛̫͖̠̄͒̍̇̃͠͝a̷̫̓͆̂̈ř̵̼͚̹̰͑͑̾̊́̋̀̈́͋͗̒͝d̸̮̥̄͆̀̏͐̈́̆̈̀̐̊̕͝e̴̢͔̱̻̬͓͕̺̤̻̓̌n̵̼̱̓́͊́̈́̆̔͑̔͐͆͗̕͜͠͝ȩ̵̨̹̬̩͕̹͖̰͍̺͍͖͖̽̂̈́̒d̷͍͌̅̀́̂̄̑ ̸̨̝͍͖͙̤̝̺̿̄C̸̮̼̪̙̈̏̾̅͝͠o̴̱̲͕͊͋͋̏̊͝ḑ̸̧̨̞̹͇͗͒̌̄̀̍̐͋́͘͘͜ȇ̵̙̹̹͇͒̽̃̚͜";
    expect(await decrypt(await encrypt(text, key), key)).toEqual(text);
  });

  test("they should work nicely even with emojis 🫂", async () => {
    const text = "Thorough Heuristic Checks 🔍🤖";
    expect(await decrypt(await encrypt(text, key), key)).toEqual(text);
  });
});
