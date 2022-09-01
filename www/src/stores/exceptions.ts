export class RecoverableError extends Error {
  parentError: unknown;

  constructor(message: string, e: unknown) {
    super(message);
    Object.setPrototypeOf(this, RecoverableError.prototype);
    this.parentError = e;
  }
}

export class Panic extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, RecoverableError.prototype);
  }
}
