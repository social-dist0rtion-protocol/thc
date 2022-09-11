import db from "./db";

const KEY = "Jupiter's moons";
const VALUE = ["Io", "Europa", "Ganymede", "Callisto"];

describe("get", () => {
  test("should return null for missing key", () => {
    expect(db.get("nonexistent")).toEqual(null);
  });

  test("should return fallback for missing key", () => {
    expect(db.get("nonexistent", ["year", "2055"])).toEqual(["year", "2055"]);
  });

  test("should return value for existent key", () => {
    window.localStorage.setItem(KEY, JSON.stringify(VALUE));
    expect(db.get("Jupiter's moons")).toEqual(VALUE);
  });

  test("should return value for existent key, even if fallback is provided", () => {
    window.localStorage.setItem(KEY, JSON.stringify(VALUE));
    expect(db.get(KEY, "oopsy poopsy")).toEqual(VALUE);
  });
});

describe("set", () => {
  test("should set a value", () => {
    expect(db.set(KEY, VALUE)).toEqual(VALUE);
    expect(window.localStorage.getItem(KEY)).toEqual(JSON.stringify(VALUE));
  });

  test("should overwrite a value previously set", () => {
    window.localStorage.setItem(KEY, JSON.stringify([]));
    expect(db.set(KEY, VALUE)).toEqual(VALUE);
    expect(window.localStorage.getItem(KEY)).toEqual(JSON.stringify(VALUE));
  });

  test("should allow to change an existing value applying a function", () => {
    const VALUE_UPPERCASE = VALUE.map((s) => s.toUpperCase());
    window.localStorage.setItem(KEY, JSON.stringify(VALUE));
    const f = (v: string[] | null) => (v ? v.map((s) => s.toUpperCase()) : []);
    expect(db.set(KEY, f)).toEqual(VALUE_UPPERCASE);
    expect(window.localStorage.getItem(KEY)).toEqual(
      JSON.stringify(VALUE_UPPERCASE)
    );
  });

  test("should set a missing key applying a function to the fallback value", () => {
    const VALUE_UPPERCASE = VALUE.map((s) => s.toUpperCase());
    const f = (v: string[] | null) => (v ? v.map((s) => s.toUpperCase()) : []);
    expect(db.set(KEY, f, VALUE)).toEqual(VALUE_UPPERCASE);
    expect(window.localStorage.getItem(KEY)).toEqual(
      JSON.stringify(VALUE_UPPERCASE)
    );
  });
});

describe("getsert", () => {
  test("should get an existing value", () => {
    window.localStorage.setItem(KEY, JSON.stringify(VALUE));
    expect(db.getsert(KEY, "oopsy poopsy")).toEqual(VALUE);
    expect(window.localStorage.getItem(KEY)).toEqual(JSON.stringify(VALUE));
  });

  test("should set a value for missing key", () => {
    expect(db.getsert(KEY, VALUE)).toEqual(VALUE);
    expect(window.localStorage.getItem(KEY)).toEqual(JSON.stringify(VALUE));
  });
});
