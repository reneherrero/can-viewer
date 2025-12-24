/**
 * TypeScript interfaces for DBC Editor components.
 */

/**
 * Receiver specification for a signal.
 */
export type ReceiversDto =
  | { type: 'none' }
  | { type: 'nodes'; nodes: string[] };

/**
 * A signal definition for editing.
 */
export interface SignalDto {
  name: string;
  start_bit: number;
  length: number;
  byte_order: 'little_endian' | 'big_endian';
  is_unsigned: boolean;
  factor: number;
  offset: number;
  min: number;
  max: number;
  unit: string | null;
  receivers: ReceiversDto;
  is_multiplexer: boolean;
  multiplexer_value: number | null;
}

/**
 * A message definition for editing.
 */
export interface MessageDto {
  id: number;
  is_extended: boolean;
  name: string;
  dlc: number;
  sender: string;
  signals: SignalDto[];
}

/**
 * A complete DBC file for editing.
 */
export interface DbcDto {
  version: string | null;
  nodes: string[];
  messages: MessageDto[];
}

/**
 * Create a default signal.
 */
export function createDefaultSignal(): SignalDto {
  return {
    name: '',
    start_bit: 0,
    length: 8,
    byte_order: 'little_endian',
    is_unsigned: true,
    factor: 1,
    offset: 0,
    min: 0,
    max: 255,
    unit: null,
    receivers: { type: 'none' },
    is_multiplexer: false,
    multiplexer_value: null,
  };
}

/**
 * Create a default message.
 * @param dlc - Optional DLC override (default: 8). Use detectDlcFromFrames() to auto-detect.
 */
export function createDefaultMessage(dlc = 8): MessageDto {
  return {
    id: 0,
    is_extended: false,
    name: '',
    dlc,
    sender: 'Vector__XXX',
    signals: [],
  };
}

/**
 * Create a default DBC.
 */
export function createDefaultDbc(): DbcDto {
  return {
    version: null,
    nodes: [],
    messages: [],
  };
}
