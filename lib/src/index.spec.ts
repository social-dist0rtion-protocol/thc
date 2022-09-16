import { equal } from "assert";
import { foo } from "./";

describe("Typescript usage suite", () => {
  it("should be able to execute a test", () => {
    equal(true, true);
  });
  it("should return expected string", () => {
    equal(foo(), 1);
  });
});
