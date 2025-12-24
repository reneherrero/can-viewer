/**
 * Simple Reactive Store
 *
 * Lightweight state management for high-frequency updates.
 * Use events for infrequent cross-component communication,
 * use stores for rapidly changing state that needs to be queried.
 */

type Listener<T> = (state: T) => void;

export function createStore<T extends object>(initialState: T) {
  let state = { ...initialState };
  const listeners = new Set<Listener<T>>();

  return {
    get: () => state,

    set(partial: Partial<T>) {
      state = { ...state, ...partial };
      listeners.forEach(fn => fn(state));
    },

    subscribe(fn: Listener<T>) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Live Capture Store - high frequency updates during capture
// ─────────────────────────────────────────────────────────────────────────────

export interface LiveState {
  isCapturing: boolean;
  currentInterface: string | null;
  frameCount: number;
  messageCount: number;
}

export const liveStore = createStore<LiveState>({
  isCapturing: false,
  currentInterface: null,
  frameCount: 0,
  messageCount: 0,
});
