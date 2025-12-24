/**
 * Event Bus
 *
 * Centralized event system for cross-component communication using mitt.
 * Components can emit and listen to events without direct coupling.
 */

import mitt from 'mitt';
import type { CanFrame, DbcInfo } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// DBC Events
// ─────────────────────────────────────────────────────────────────────────────

/** Emitted when DBC content changes (load, clear, edit, new) */
export interface DbcChangedEvent {
  action: 'loaded' | 'cleared' | 'updated' | 'new';
  dbcInfo: DbcInfo | null;
  filename: string | null;
}

/** Emitted when DBC editor state changes (dirty, editing, etc.) */
export interface DbcStateChangeEvent {
  isDirty: boolean;
  isEditing: boolean;
  currentFile: string | null;
  messageCount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// MDF4 Events
// ─────────────────────────────────────────────────────────────────────────────

/** Emitted when an MDF4 file is loaded */
export interface Mdf4LoadedEvent {
  path: string;
  frames: CanFrame[];
  frameCount: number;
}

/** Emitted when MDF4 status changes (file loaded/cleared) */
export interface Mdf4StatusChangeEvent {
  loaded: boolean;
  filename: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Frame Events
// ─────────────────────────────────────────────────────────────────────────────

/** Emitted when a frame is selected in a table */
export interface FrameSelectedEvent {
  frame: CanFrame;
  index: number;
  source: 'mdf4-inspector' | 'live-viewer';
}

// ─────────────────────────────────────────────────────────────────────────────
// Capture Events
// ─────────────────────────────────────────────────────────────────────────────

/** Emitted when live capture starts */
export interface CaptureStartedEvent {
  interface: string;
}

/** Emitted when live capture stops */
export interface CaptureStoppedEvent {
  interface: string | null;
  frameCount: number;
}

/** Emitted when live viewer interfaces are loaded */
export interface LiveInterfacesLoadedEvent {
  interfaces: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Event Bus
// ─────────────────────────────────────────────────────────────────────────────

/** All application events */
export type AppEvents = {
  'dbc:changed': DbcChangedEvent;
  'dbc:state-change': DbcStateChangeEvent;
  'mdf4:loaded': Mdf4LoadedEvent;
  'mdf4:status-change': Mdf4StatusChangeEvent;
  'frame:selected': FrameSelectedEvent;
  'capture:started': CaptureStartedEvent;
  'capture:stopped': CaptureStoppedEvent;
  'live:interfaces-loaded': LiveInterfacesLoadedEvent;
};

/** Global event bus instance */
export const events = mitt<AppEvents>();

// ─────────────────────────────────────────────────────────────────────────────
// Convenience Emitters
// ─────────────────────────────────────────────────────────────────────────────

export function emitDbcChanged(payload: DbcChangedEvent): void {
  events.emit('dbc:changed', payload);
}

export function emitDbcStateChange(payload: DbcStateChangeEvent): void {
  events.emit('dbc:state-change', payload);
}

export function emitMdf4Loaded(payload: Mdf4LoadedEvent): void {
  events.emit('mdf4:loaded', payload);
}

export function emitMdf4StatusChange(payload: Mdf4StatusChangeEvent): void {
  events.emit('mdf4:status-change', payload);
}

export function emitFrameSelected(payload: FrameSelectedEvent): void {
  events.emit('frame:selected', payload);
}

export function emitCaptureStarted(payload: CaptureStartedEvent): void {
  events.emit('capture:started', payload);
}

export function emitCaptureStopped(payload: CaptureStoppedEvent): void {
  events.emit('capture:stopped', payload);
}

export function emitLiveInterfacesLoaded(payload: LiveInterfacesLoadedEvent): void {
  events.emit('live:interfaces-loaded', payload);
}
