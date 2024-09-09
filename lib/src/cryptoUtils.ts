const isNode =
  typeof process !== "undefined" &&
  process.versions != null &&
  process.versions.node != null;

export const crypto: Crypto = isNode
  ? require("crypto").webcrypto
  : window.crypto;
