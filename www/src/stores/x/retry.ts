import { Panic, RecoverableError } from "./exceptions";

export function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function retryWrap<T = void>(f: () => Promise<T>, catchAll = false) {
  return async () => {
    for (let i = 0; i < 3; i++) {
      try {
        return await f();
      } catch (e: any) {
        if (catchAll || e instanceof RecoverableError) {
          console.error("Retry", i + 1, e);
          await sleep(1000);
        } else {
          console.log("Unknown error");
          throw e;
        }
      }
    }
    console.error("Panic", f);
    throw new Panic("Panic");
  };
}

export function retry<T = void>(f: () => Promise<T>, catchAll = false) {
  return retryWrap(f, catchAll)();
}
