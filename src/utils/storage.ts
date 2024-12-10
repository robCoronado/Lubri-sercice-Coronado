import { type StateStorage } from 'zustand/middleware';

export const createVersionedStorage = (version: number): StateStorage => ({
  getItem: (name: string): string | null => {
    const value = localStorage.getItem(name);
    if (!value) return null;

    try {
      const parsed = JSON.parse(value);
      if (!parsed.version || parsed.version < version) {
        localStorage.removeItem(name);
        return null;
      }
      return value;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      const parsed = JSON.parse(value);
      localStorage.setItem(name, JSON.stringify({ ...parsed, version }));
    } catch {
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name: string) => localStorage.removeItem(name),
});