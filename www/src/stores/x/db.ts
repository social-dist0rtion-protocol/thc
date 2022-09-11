export type ValueOrFunction<T> = T | ((v: T | null) => T);

class DB {
  storage: Storage;

  constructor(storage = window.localStorage) {
    this.storage = storage;
  }

  get<T>(key: string, fallback?: T) {
    const value = this.storage.getItem(key);
    if (value === null) {
      return fallback === undefined ? null : fallback;
    }
    return JSON.parse(value) as T;
  }

  set<T>(key: string, valueOrFunction: ValueOrFunction<T>, fallback?: T) {
    let value: T;
    if (valueOrFunction instanceof Function) {
      const prev = this.get<T>(key, fallback);
      value = valueOrFunction(prev);
    } else {
      value = valueOrFunction;
    }
    this.storage.setItem(key, JSON.stringify(value));
    return value;
  }

  has(key: string) {
    return this.get(key) !== null;
  }

  getsert<T>(key: string, valueOrFunction: ValueOrFunction<T>) {
    if (!this.has(key)) {
      this.set(key, valueOrFunction);
    }
    return this.get<T>(key);
  }

  clear() {
    this.storage.clear();
  }
}

export default new DB();
