"use client";

export type SavedItem = {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  vote_average: number;
  date: string;
  addedAt: number;
};

const LIST_KEY = "reel:list";
const HISTORY_KEY = "reel:history";
const MAX_HISTORY = 50;

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("reel:storage"));
  } catch (e) {
    console.error("storage write failed", e);
  }
}

// ---- My List ----

export function getList(): SavedItem[] {
  return read<SavedItem>(LIST_KEY);
}

export function isInList(id: number, media_type: "movie" | "tv"): boolean {
  return getList().some(
    (x) => Number(x.id) === Number(id) && x.media_type === media_type
  );
}

export function addToList(item: SavedItem) {
  const list = getList();
  const already = list.some(
    (x) => Number(x.id) === Number(item.id) && x.media_type === item.media_type
  );
  if (already) return;
  write(LIST_KEY, [item, ...list]);
}

export function removeFromList(id: number, media_type: "movie" | "tv") {
  const list = getList();
  write(
    LIST_KEY,
    list.filter(
      (x) => !(Number(x.id) === Number(id) && x.media_type === media_type)
    )
  );
}

export function toggleList(item: SavedItem) {
  if (isInList(item.id, item.media_type)) {
    removeFromList(item.id, item.media_type);
    return false;
  } else {
    addToList(item);
    return true;
  }
}

// ---- Watch history ----

export function getHistory(): SavedItem[] {
  return read<SavedItem>(HISTORY_KEY);
}

export function addToHistory(item: SavedItem) {
  const history = getHistory();
  const filtered = history.filter(
    (x) => !(Number(x.id) === Number(item.id) && x.media_type === item.media_type)
  );
  write(HISTORY_KEY, [item, ...filtered].slice(0, MAX_HISTORY));
}

export function clearHistory() {
  write(HISTORY_KEY, []);
}