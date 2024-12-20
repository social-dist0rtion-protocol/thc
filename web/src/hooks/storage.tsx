export const MNEMONIC_KEY = "mnemonic";
export const ROOT_HASH_KEY = "rootHash";
export const CURRENT_CHAPTER_INDEX_KEY = "currentChapterIndex";
export const CURRENT_CHAPTER_PASSWORD_KEY = "currentChapterPassword";
export const CURRENT_SIDE_QUEST_PASSWORD_KEY = "currentSideQuestPassword";
export const CURRENT_KEY_PASSWORD_KEY = "currentKeyPassword";

export function dump() {
  let theDump: Record<string, string> = {};
  for (let key in localStorage) {
    theDump[key] = localStorage[key];
  }

  return JSON.stringify(theDump);
}

export function restore(theDump: string) {
  const dumpObj = JSON.parse(theDump);
  for (let key in dumpObj) {
    localStorage.setItem(key, dumpObj[key]);
  }
}
