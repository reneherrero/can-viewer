import type { CanFrame, DecodedSignal, DbcInfo, MessageInfo } from './types';
import { formatCanId, formatDataHex, formatFlags, formatTimestamp, formatSignalValue } from './formatters';

/** Render CAN frames table body */
export function renderFramesHtml(
  frames: CanFrame[],
  selectedIndex: number | null,
  getMessageName: (canId: number) => string
): string {
  return frames.map((frame, idx) => `
    <tr class="clickable ${idx === selectedIndex ? 'selected' : ''}" data-index="${idx}">
      <td class="cv-timestamp">${formatTimestamp(frame.timestamp)}</td>
      <td>${frame.channel}</td>
      <td class="cv-can-id">${formatCanId(frame.can_id, frame.is_extended)}</td>
      <td class="cv-message-name">${getMessageName(frame.can_id)}</td>
      <td>${frame.dlc}</td>
      <td class="cv-hex-data">${formatDataHex(frame.data)}</td>
      <td>${formatFlags(frame)}</td>
    </tr>
  `).join('');
}

/** Render decoded signals table body */
export function renderSignalsHtml(signals: DecodedSignal[]): string {
  return signals.map(sig => `
    <tr>
      <td class="cv-signal-name">${sig.signal_name}</td>
      <td class="cv-physical-value">${formatSignalValue(sig.value)}</td>
      <td class="cv-unit-highlight">${sig.unit || '-'}</td>
    </tr>
  `).join('');
}

/** Render empty signals panel */
export function renderEmptySignalsHtml(): string {
  return '<tr><td colspan="3" class="cv-signals-empty">Select a frame to view decoded signals</td></tr>';
}

/** Render DBC messages list */
export function renderDbcMessagesHtml(
  dbcInfo: DbcInfo | null,
  selectedMessageId: number | null
): string {
  if (!dbcInfo?.messages?.length) {
    return '<div class="cv-dbc-no-file">No DBC file loaded</div>';
  }

  return dbcInfo.messages.map(msg => `
    <div class="cv-dbc-message-item ${msg.id === selectedMessageId ? 'selected' : ''}" data-id="${msg.id}">
      <div class="cv-dbc-message-name">${msg.name}</div>
      <div class="cv-dbc-message-id">0x${msg.id.toString(16).toUpperCase()} (${msg.id})</div>
      <div class="cv-dbc-message-meta">DLC: ${msg.dlc} | ${msg.signals.length} signals${msg.sender ? ' | TX: ' + msg.sender : ''}</div>
    </div>
  `).join('');
}

/** Render DBC message signals detail */
export function renderDbcSignalsHtml(msg: MessageInfo): string {
  if (msg.signals.length === 0) {
    return '<div class="cv-dbc-empty">No signals defined for this message</div>';
  }

  return msg.signals.map(sig => `
    <div class="cv-dbc-signal-card">
      <div class="cv-dbc-signal-name">${sig.name}</div>
      <div class="cv-dbc-signal-props">
        <div class="cv-dbc-signal-prop"><span class="cv-dbc-signal-prop-label">Start Bit</span><span class="cv-dbc-signal-prop-value">${sig.start_bit}</span></div>
        <div class="cv-dbc-signal-prop"><span class="cv-dbc-signal-prop-label">Length</span><span class="cv-dbc-signal-prop-value">${sig.length} bits</span></div>
        <div class="cv-dbc-signal-prop"><span class="cv-dbc-signal-prop-label">Factor</span><span class="cv-dbc-signal-prop-value">${sig.factor}</span></div>
        <div class="cv-dbc-signal-prop"><span class="cv-dbc-signal-prop-label">Offset</span><span class="cv-dbc-signal-prop-value">${sig.offset}</span></div>
        <div class="cv-dbc-signal-prop"><span class="cv-dbc-signal-prop-label">Min</span><span class="cv-dbc-signal-prop-value">${sig.min}</span></div>
        <div class="cv-dbc-signal-prop"><span class="cv-dbc-signal-prop-label">Max</span><span class="cv-dbc-signal-prop-value">${sig.max}</span></div>
        <div class="cv-dbc-signal-prop"><span class="cv-dbc-signal-prop-label">Unit</span><span class="cv-dbc-signal-prop-value">${sig.unit || '-'}</span></div>
      </div>
    </div>
  `).join('');
}

/** Get DBC message subtitle text */
export function getDbcMessageSubtitle(msg: MessageInfo): string {
  return `ID: 0x${msg.id.toString(16).toUpperCase()} | DLC: ${msg.dlc}${msg.sender ? ' | TX: ' + msg.sender : ''}`;
}

/** Render interface select options */
export function renderInterfaceOptions(interfaces: string[]): string {
  return '<option value="">Select CAN interface...</option>' +
    interfaces.map(iface => `<option value="${iface}">${iface}</option>`).join('');
}
