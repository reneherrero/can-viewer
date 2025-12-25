/**
 * DBC Editor specific utilities.
 */

// Re-export shared utilities for convenience
export { deepClone, createEvent, formatCanId } from '../../utils';

/**
 * Validate a DBC identifier name (node, signal, message names).
 * Must start with letter/underscore, contain only alphanumeric and underscores.
 */
export function isValidDbcName(name: string): boolean {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
}

/**
 * Signal colors for bit layout visualization.
 */
export const SIGNAL_COLORS = [
  '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1',
] as const;

/**
 * Get color for a signal by index.
 */
export function getSignalColor(index: number): string {
  return SIGNAL_COLORS[index % SIGNAL_COLORS.length];
}

/**
 * Convert signal start_bit to linear bit position for visualization.
 * Handles both Intel (little endian) and Motorola (big endian) byte orders.
 *
 * DBC bit numbering:
 * - Byte 0: bits 7,6,5,4,3,2,1,0
 * - Byte 1: bits 15,14,13,12,11,10,9,8
 * - etc.
 *
 * Intel (little endian): start_bit is LSB, signal grows upward
 * Motorola (big endian): start_bit is MSB, signal grows downward
 */
export function getLinearBitPosition(
  startBit: number,
  length: number,
  byteOrder: 'little_endian' | 'big_endian'
): { start: number; end: number } {
  if (byteOrder === 'little_endian') {
    return { start: startBit, end: startBit + length - 1 };
  } else {
    const linearStart = startBit - length + 1;
    return { start: Math.max(0, linearStart), end: startBit };
  }
}

/**
 * Calculate slider constraints based on byte order.
 * Returns min/max values for start bit and length sliders.
 */
export function getSliderConstraints(
  totalBits: number,
  currentStart: number,
  currentLength: number,
  byteOrder: 'little_endian' | 'big_endian'
): { startMin: number; startMax: number; lenMin: number; lenMax: number } {
  if (byteOrder === 'little_endian') {
    return {
      startMin: 0,
      startMax: Math.max(0, totalBits - currentLength),
      lenMin: 1,
      lenMax: Math.max(1, totalBits - currentStart),
    };
  } else {
    return {
      startMin: Math.max(0, currentLength - 1),
      startMax: totalBits - 1,
      lenMin: 1,
      lenMax: Math.min(64, currentStart + 1),
    };
  }
}

/**
 * Export a DbcDto to DBC file format string.
 */
export function exportDbcToString(dbc: import('./types').DbcDto): string {
  const lines: string[] = [];

  // VERSION
  lines.push(`VERSION "${dbc.version || ''}"`);
  lines.push('');

  // NS_ (new symbols) - empty
  lines.push('NS_ :');
  lines.push('');

  // BS_ (bit timing) - empty
  lines.push('BS_:');
  lines.push('');

  // BU_ (nodes)
  if (dbc.nodes.length > 0) {
    lines.push(`BU_: ${dbc.nodes.map(n => n.name).join(' ')}`);
  } else {
    lines.push('BU_:');
  }
  lines.push('');

  // BO_ (messages) and SG_ (signals)
  for (const msg of dbc.messages) {
    const msgId = msg.is_extended ? (msg.id | 0x80000000) : msg.id;
    lines.push(`BO_ ${msgId} ${msg.name}: ${msg.dlc} ${msg.sender}`);

    for (const sig of msg.signals) {
      // Byte order: 1 = little endian (Intel), 0 = big endian (Motorola)
      const byteOrder = sig.byte_order === 'little_endian' ? 1 : 0;
      // Value type: + = unsigned, - = signed
      const valueType = sig.is_unsigned ? '+' : '-';

      // Multiplexer indicator
      let muxIndicator = '';
      if (sig.is_multiplexer) {
        muxIndicator = ' M';
      } else if (sig.multiplexer_value !== null) {
        muxIndicator = ` m${sig.multiplexer_value}`;
      }

      // Receivers
      let receivers = 'Vector__XXX';
      if (sig.receivers.type === 'nodes' && sig.receivers.nodes.length > 0) {
        receivers = sig.receivers.nodes.join(',');
      }

      const unit = sig.unit || '';
      lines.push(
        ` SG_ ${sig.name}${muxIndicator} : ${sig.start_bit}|${sig.length}@${byteOrder}${valueType} ` +
        `(${sig.factor},${sig.offset}) [${sig.min}|${sig.max}] "${unit}" ${receivers}`
      );
    }

    lines.push('');
  }

  // CM_ (comments)
  // Database comment
  if (dbc.comment) {
    lines.push(`CM_ "${escapeDbcString(dbc.comment)}";`);
  }

  // Node comments
  for (const node of dbc.nodes) {
    if (node.comment) {
      lines.push(`CM_ BU_ ${node.name} "${escapeDbcString(node.comment)}";`);
    }
  }

  // Message and signal comments
  for (const msg of dbc.messages) {
    const msgId = msg.is_extended ? (msg.id | 0x80000000) : msg.id;
    if (msg.comment) {
      lines.push(`CM_ BO_ ${msgId} "${escapeDbcString(msg.comment)}";`);
    }
    for (const sig of msg.signals) {
      if (sig.comment) {
        lines.push(`CM_ SG_ ${msgId} ${sig.name} "${escapeDbcString(sig.comment)}";`);
      }
    }
  }

  // End with empty line
  lines.push('');

  return lines.join('\n');
}

/**
 * Escape a string for DBC file format.
 * DBC strings cannot contain backslashes, newlines, or unescaped quotes.
 */
function escapeDbcString(str: string): string {
  return str
    .replace(/\\/g, '')      // Remove backslashes (not supported in DBC)
    .replace(/\n/g, ' ')     // Replace newlines with spaces
    .replace(/\r/g, '')      // Remove carriage returns
    .replace(/"/g, "'");     // Replace double quotes with single quotes
}
