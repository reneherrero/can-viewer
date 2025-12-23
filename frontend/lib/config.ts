import type { CanViewerConfig } from './types';

/** Default configuration for CAN Viewer */
export const defaultConfig: Required<CanViewerConfig> = {
  showDbcTab: true,
  showLiveTab: true,
  showMdf4Tab: true,
  showAboutTab: true,
  initialTab: 'mdf4',
  autoScroll: true,
  maxFrames: 10000,
  maxSignals: 10000,
};

/** Filter state for CAN frames */
export interface Filters {
  timeMin: number | null;
  timeMax: number | null;
  canIds: number[] | null;
  messages: string[] | null;
}

/** Create empty filter state */
export function createEmptyFilters(): Filters {
  return {
    timeMin: null,
    timeMax: null,
    canIds: null,
    messages: null,
  };
}

/** Parse CAN IDs from comma-separated hex string */
export function parseCanIds(input: string): number[] | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const ids = trimmed
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => parseInt(s, 16))
    .filter(n => !isNaN(n));

  return ids.length > 0 ? ids : null;
}

/** Parse message names from comma-separated string */
export function parseMessageNames(input: string): string[] | null {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;

  const names = trimmed
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(s => s.length > 0);

  return names.length > 0 ? names : null;
}
