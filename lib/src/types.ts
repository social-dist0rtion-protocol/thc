export type Key = {
  address: `0x${string}`;
  emoji: string;
};

export type Metadata = {
  keys: Key[];
  chapters: `0x${string}`[];
};
