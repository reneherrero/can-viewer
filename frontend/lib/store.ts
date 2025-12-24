/**
 * Simple Reactive Store
 *
 * Lightweight state management for high-frequency updates.
 * Use events for infrequent cross-component communication,
 * use stores for rapidly changing state that needs to be queried.
 */

import type { CanFrame } from './types';

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
// App Store - global application state (single DBC, single MDF4)
// ─────────────────────────────────────────────────────────────────────────────

export interface AppState {
  /** Current DBC file path (null if not loaded) */
  dbcFile: string | null;
  /** Current MDF4 file path (null if not loaded/created) */
  mdf4File: string | null;
}

export const appStore = createStore<AppState>({
  dbcFile: null,
  mdf4File: null,
});

// ─────────────────────────────────────────────────────────────────────────────
// MDF4 Store - current MDF4 frames
// ─────────────────────────────────────────────────────────────────────────────

export interface Mdf4State {
  frames: CanFrame[];
}

export const mdf4Store = createStore<Mdf4State>({
  frames: [],
});

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
