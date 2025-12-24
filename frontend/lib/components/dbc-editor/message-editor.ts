/**
 * Message editor component for editing a CAN message.
 */

import type { MessageDto, SignalDto } from './types';
import type { CanFrame } from '../../types';
import { createDefaultMessage, createDefaultSignal } from './types';
import { detectDlcFromFrames } from '../../utils';
import { deepClone, getSignalColor, getLinearBitPosition, getSliderConstraints } from './utils';
import {
  getBaseStyles,
  combineStyles,
  FORM_STYLES,
  INPUT_STYLES,
  BUTTON_STYLES,
  SECTION_STYLES,
  MESSAGE_HEADER_STYLES,
  BIT_LAYOUT_STYLES,
  SIGNALS_LAYOUT_STYLES,
} from './shared-styles';
import './signals-table';
import './signal-editor';
import type { SignalsTableElement } from './signals-table';
import type { SignalEditorElement } from './signal-editor';

export class MessageEditorElement extends HTMLElement {
  private message: MessageDto = createDefaultMessage();
  private originalMessage: MessageDto = createDefaultMessage();
  private availableNodes: string[] = [];
  private frames: CanFrame[] = [];
  private selectedSignal: string | null = null;
  private editingSignal: SignalDto | null = null;
  private isAddingSignal = false;
  private isEditingSignal = false;
  private isEditingMessage = false;
  private isNewMessage = false;
  private parentEditMode = false;

  static get observedAttributes() {
    return ['data-edit-mode'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.parentEditMode = this.dataset.editMode === 'true';
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'data-edit-mode' && oldValue !== newValue) {
      this.parentEditMode = newValue === 'true';
      this.render();
    }
  }

  setMessage(message: MessageDto | null, isNew: boolean) {
    this.message = message ? deepClone(message) : createDefaultMessage();
    this.originalMessage = deepClone(this.message);
    this.selectedSignal = null;
    this.editingSignal = null;
    this.isAddingSignal = false;
    this.isNewMessage = isNew;
    this.isEditingMessage = isNew; // Auto-edit for new messages
    this.render();
  }

  setAvailableNodes(nodes: string[]) {
    this.availableNodes = nodes;
    this.render();
  }

  /** Set loaded frames for DLC auto-detection */
  setFrames(frames: CanFrame[]) {
    this.frames = frames;
  }

  getMessage(): MessageDto {
    return this.message;
  }

  isInEditMode(): boolean {
    return this.isEditingMessage;
  }

  private renderMessageViewMode(idHex: string): string {
    const idDecimal = this.message.id;
    return `
      <div class="de-section">
        <div class="msg-header">
          <div class="msg-header-info">
            <span class="msg-title">${this.message.name || '(unnamed)'}</span>
            <span class="msg-id">${idHex} (${idDecimal})</span>
            <span class="msg-meta">DLC: ${this.message.dlc}</span>
            ${this.message.sender ? `<span class="msg-meta">TX: ${this.message.sender}</span>` : ''}
            ${this.message.is_extended ? `<span class="msg-meta">Extended</span>` : ''}
          </div>
          ${this.parentEditMode ? `
            <div class="msg-actions">
              <button class="de-btn de-btn-primary de-btn-small" id="edit-msg-btn">Edit</button>
              <button class="de-btn de-btn-danger de-btn-small" id="delete-msg-btn">Delete</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  private renderMessageEditMode(idHex: string): string {
    return `
      <div class="de-section">
        <div class="msg-header">
          <div class="de-form-group" style="flex: 1; margin-bottom: 0; margin-right: 16px;">
            <label class="de-label">Name</label>
            <input type="text" class="de-input" id="msg_name" value="${this.message.name}" placeholder="Message Name">
          </div>
          <div class="msg-actions" style="align-self: flex-end;">
            <button class="de-btn de-btn-success de-btn-small" id="done-msg-btn">Done</button>
            <button class="de-btn de-btn-small" id="cancel-msg-btn">Cancel</button>
          </div>
        </div>

        <div class="de-form-row">
          <div class="de-form-group">
            <label class="de-label">Message ID <span class="id-display">(${idHex})</span></label>
            <input type="number" class="de-input" id="msg_id" value="${this.message.id}" min="0" max="536870911">
          </div>
          <div class="de-form-group">
            <label class="de-label">DLC</label>
            <select class="de-select" id="msg_dlc">
              ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 12, 16, 20, 24, 32, 48, 64].map(
                dlc => `<option value="${dlc}" ${this.message.dlc === dlc ? 'selected' : ''}>${dlc}</option>`
              ).join('')}
            </select>
          </div>
        </div>

        <div class="de-form-row">
          <div class="de-form-group">
            <label class="de-label">Sender</label>
            <select class="de-select" id="msg_sender">
              <option value="Vector__XXX" ${this.message.sender === 'Vector__XXX' ? 'selected' : ''}>Vector__XXX</option>
              ${this.availableNodes.map(
                node => `<option value="${node}" ${this.message.sender === node ? 'selected' : ''}>${node}</option>`
              ).join('')}
            </select>
          </div>
          <div class="de-form-group">
            <div class="de-checkbox-group" style="margin-top: 20px;">
              <input type="checkbox" class="de-checkbox" id="msg_extended" ${this.message.is_extended ? 'checked' : ''}>
              <span>Extended ID (29-bit)</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private getActiveSignals(): SignalDto[] {
    const currentSignal = this.editingSignal;
    const currentMuxValue = currentSignal?.multiplexer_value;

    return this.message.signals.filter(sig => {
      // Always show the multiplexer signal itself
      if (sig.is_multiplexer) return true;
      // Always show non-multiplexed signals (no mux value)
      if (sig.multiplexer_value === null) return true;
      // Show signals matching the current signal's mux value
      if (currentMuxValue !== null && sig.multiplexer_value === currentMuxValue) return true;
      // If current signal is the multiplexer or non-muxed, only show non-muxed
      if (currentMuxValue === null) return false;
      return false;
    });
  }

  private renderBitLayout(): string {
    const totalBits = this.message.dlc * 8;
    if (totalBits === 0) return '';

    const currentSignal = this.editingSignal;
    const currentStart = currentSignal?.start_bit ?? 0;
    const currentLength = currentSignal?.length ?? 1;

    // Get only active signals for current mux context
    const activeSignals = this.getActiveSignals();

    // Get linear positions for all signals
    const getLinearPos = (sig: SignalDto) => getLinearBitPosition(sig.start_bit, sig.length, sig.byte_order);

    // Check for overlaps between signals (using linear positions)
    const hasOverlap = (sig: SignalDto): boolean => {
      const pos = getLinearPos(sig);
      for (const other of activeSignals) {
        if (other.name === sig.name) continue;
        const otherPos = getLinearPos(other);
        if (pos.start <= otherPos.end && otherPos.start <= pos.end) {
          return true;
        }
      }
      return false;
    };

    // Build segments for active signals only
    const segments = activeSignals.map((sig, idx) => {
      const isCurrent = currentSignal && sig.name === currentSignal.name;
      const isOverlapping = hasOverlap(sig);
      const pos = getLinearPos(sig);
      const left = (pos.start / totalBits) * 100;
      const width = (sig.length / totalBits) * 100;
      const color = isOverlapping ? '#ef4444' : (isCurrent ? '#3b82f6' : getSignalColor(idx));
      const opacity = isCurrent ? 1 : 0.5;
      const classes = ['bit-segment', isCurrent ? 'current' : '', isOverlapping ? 'overlap' : ''].filter(Boolean).join(' ');
      const byteOrderLabel = sig.byte_order === 'big_endian' ? 'BE' : 'LE';

      return `<div class="${classes}"
                   style="left: ${left}%; width: ${width}%; background: ${color}; opacity: ${opacity};"
                   title="${sig.name} (${byteOrderLabel}): bits ${pos.start}-${pos.end}${isOverlapping ? ' (OVERLAP!)' : ''}">
                ${width > 8 ? sig.name : ''}
              </div>`;
    }).join('');

    // Generate byte markers
    const markers: string[] = [];
    for (let i = 0; i <= Math.min(8, this.message.dlc); i++) {
      markers.push(`<span>${i * 8}</span>`);
    }
    if (this.message.dlc > 8) {
      markers.push(`<span>${totalBits}</span>`);
    }

    return `
      <div class="bit-layout">
        <div class="bit-layout-header">
          <span>Bit Layout (${totalBits} bits)</span>
          <span>${currentSignal?.name || ''}: ${currentStart} - ${currentStart + currentLength - 1}</span>
        </div>
        <div class="bit-bar">
          ${segments}
        </div>
        <div class="bit-markers">
          ${markers.join('')}
        </div>
        ${(this.isAddingSignal || this.isEditingSignal) ? (() => {
          const byteOrder = currentSignal?.byte_order ?? 'little_endian';
          const constraints = getSliderConstraints(totalBits, currentStart, currentLength, byteOrder);
          return `
          <div class="bit-sliders">
            <div class="bit-slider-group">
              <div class="bit-slider-label">
                <span>Start Bit</span>
                <span class="bit-slider-value" id="start-bit-value">${currentStart}</span>
              </div>
              <input type="range" class="bit-slider" id="start-bit-slider"
                     min="${constraints.startMin}" max="${constraints.startMax}" value="${currentStart}">
            </div>
            <div class="bit-slider-group">
              <div class="bit-slider-label">
                <span>Length</span>
                <span class="bit-slider-value" id="length-value">${currentLength}</span>
              </div>
              <input type="range" class="bit-slider" id="length-slider"
                     min="${constraints.lenMin}" max="${constraints.lenMax}" value="${currentLength}">
            </div>
          </div>
        `;
        })() : ''}
      </div>
    `;
  }

  private updateBitBar() {
    if (!this.shadowRoot || !this.editingSignal) return;

    const totalBits = this.message.dlc * 8;
    if (totalBits === 0) return;

    const currentStart = this.editingSignal.start_bit;
    const currentLength = this.editingSignal.length;

    // Update header display
    const headerRight = this.shadowRoot.querySelector('.bit-layout-header span:last-child');
    if (headerRight) {
      headerRight.textContent = `${this.editingSignal.name || ''}: ${currentStart} - ${currentStart + currentLength - 1}`;
    }

    // Re-render segments for active signals only
    const bitBar = this.shadowRoot.querySelector('.bit-bar');
    if (bitBar) {
      const activeSignals = this.getActiveSignals();
      const currentByteOrder = this.editingSignal.byte_order;

      // Helper to get linear position
      const getPos = (start: number, len: number, order: 'little_endian' | 'big_endian') =>
        getLinearBitPosition(start, len, order);

      // Check for overlaps - use current position for the editing signal
      const hasOverlap = (sigStart: number, sigLength: number, sigOrder: 'little_endian' | 'big_endian', excludeName: string): boolean => {
        const pos = getPos(sigStart, sigLength, sigOrder);
        for (const other of activeSignals) {
          if (other.name === excludeName) continue;
          // Use current position if this is the signal being edited
          const isOtherCurrent = other.name === this.editingSignal!.name;
          const otherStart = isOtherCurrent ? currentStart : other.start_bit;
          const otherLength = isOtherCurrent ? currentLength : other.length;
          const otherOrder = isOtherCurrent ? currentByteOrder : other.byte_order;
          const otherPos = getPos(otherStart, otherLength, otherOrder);
          if (pos.start <= otherPos.end && otherPos.start <= pos.end) {
            return true;
          }
        }
        return false;
      };

      const segments = activeSignals.map((sig, idx) => {
        const isCurrent = sig.name === this.editingSignal!.name;
        const sigStart = isCurrent ? currentStart : sig.start_bit;
        const sigLength = isCurrent ? currentLength : sig.length;
        const sigOrder = isCurrent ? currentByteOrder : sig.byte_order;
        const pos = getPos(sigStart, sigLength, sigOrder);
        const left = (pos.start / totalBits) * 100;
        const width = (sigLength / totalBits) * 100;
        // Always exclude the signal itself by name when checking overlaps
        const isOverlapping = hasOverlap(sigStart, sigLength, sigOrder, sig.name);
        const color = isOverlapping ? '#ef4444' : (isCurrent ? '#3b82f6' : getSignalColor(idx));
        const opacity = isCurrent ? 1 : 0.5;
        const byteOrderLabel = sigOrder === 'big_endian' ? 'BE' : 'LE';
        const classes = ['bit-segment', isCurrent ? 'current' : '', isOverlapping ? 'overlap' : ''].filter(Boolean).join(' ');

        return `<div class="${classes}"
                     style="left: ${left}%; width: ${width}%; background: ${color}; opacity: ${opacity};"
                     title="${sig.name} (${byteOrderLabel}): bits ${pos.start}-${pos.end}${isOverlapping ? ' (OVERLAP!)' : ''}">
                  ${width > 8 ? sig.name : ''}
                </div>`;
      }).join('');

      // If adding a new signal, add its segment too
      if (this.isAddingSignal && this.editingSignal) {
        const pos = getPos(currentStart, currentLength, currentByteOrder);
        const left = (pos.start / totalBits) * 100;
        const width = (currentLength / totalBits) * 100;
        const isOverlapping = hasOverlap(currentStart, currentLength, currentByteOrder, '');
        const color = isOverlapping ? '#ef4444' : '#3b82f6';
        const byteOrderLabel = currentByteOrder === 'big_endian' ? 'BE' : 'LE';
        const classes = ['bit-segment', 'current', isOverlapping ? 'overlap' : ''].filter(Boolean).join(' ');
        const segment = `<div class="${classes}"
                              style="left: ${left}%; width: ${width}%; background: ${color}; opacity: 1;"
                              title="New (${byteOrderLabel}): bits ${pos.start}-${pos.end}${isOverlapping ? ' (OVERLAP!)' : ''}">
                           ${width > 8 ? (this.editingSignal.name || 'New') : ''}
                         </div>`;
        bitBar.innerHTML = segments + segment;
      } else {
        bitBar.innerHTML = segments;
      }
    }
  }

  private setupSliderListeners() {
    if (!this.shadowRoot) return;

    const startBitSlider = this.shadowRoot.getElementById('start-bit-slider') as HTMLInputElement;
    const lengthSlider = this.shadowRoot.getElementById('length-slider') as HTMLInputElement;
    const totalBits = this.message.dlc * 8;

    const updateSliderConstraints = () => {
      if (!this.editingSignal || !startBitSlider || !lengthSlider) return;
      const constraints = getSliderConstraints(totalBits, this.editingSignal.start_bit, this.editingSignal.length, this.editingSignal.byte_order);
      startBitSlider.min = String(constraints.startMin);
      startBitSlider.max = String(constraints.startMax);
      lengthSlider.min = String(constraints.lenMin);
      lengthSlider.max = String(constraints.lenMax);
    };

    startBitSlider?.addEventListener('input', () => {
      const value = parseInt(startBitSlider.value, 10);
      if (this.editingSignal) {
        this.editingSignal.start_bit = value;
        this.shadowRoot!.getElementById('start-bit-value')!.textContent = String(value);
        updateSliderConstraints();
        // Clamp length if needed
        const constraints = getSliderConstraints(totalBits, value, this.editingSignal.length, this.editingSignal.byte_order);
        if (this.editingSignal.length > constraints.lenMax) {
          this.editingSignal.length = constraints.lenMax;
          lengthSlider.value = String(constraints.lenMax);
          this.shadowRoot!.getElementById('length-value')!.textContent = String(constraints.lenMax);
        }
        const signalEditor = this.shadowRoot!.querySelector('de-signal-editor') as SignalEditorElement;
        signalEditor?.updateSignalValues({ start_bit: this.editingSignal.start_bit, length: this.editingSignal.length });
        this.updateBitBar();
        this.validateSignalAndSetError(signalEditor);
      }
    });

    lengthSlider?.addEventListener('input', () => {
      const value = parseInt(lengthSlider.value, 10);
      if (this.editingSignal) {
        this.editingSignal.length = value;
        this.shadowRoot!.getElementById('length-value')!.textContent = String(value);
        updateSliderConstraints();
        // Clamp start_bit if needed
        const constraints = getSliderConstraints(totalBits, this.editingSignal.start_bit, value, this.editingSignal.byte_order);
        if (this.editingSignal.start_bit < constraints.startMin) {
          this.editingSignal.start_bit = constraints.startMin;
          startBitSlider.value = String(constraints.startMin);
          this.shadowRoot!.getElementById('start-bit-value')!.textContent = String(constraints.startMin);
        } else if (this.editingSignal.start_bit > constraints.startMax) {
          this.editingSignal.start_bit = constraints.startMax;
          startBitSlider.value = String(constraints.startMax);
          this.shadowRoot!.getElementById('start-bit-value')!.textContent = String(constraints.startMax);
        }
        const signalEditor = this.shadowRoot!.querySelector('de-signal-editor') as SignalEditorElement;
        signalEditor?.updateSignalValues({ start_bit: this.editingSignal.start_bit, length: this.editingSignal.length });
        this.updateBitBar();
        this.validateSignalAndSetError(signalEditor);
      }
    });
  }

  private render() {
    if (!this.shadowRoot) return;

    const idHex = `0x${this.message.id.toString(16).toUpperCase()}`;

    this.shadowRoot.innerHTML = `
      <style>
        ${getBaseStyles()}
        ${combineStyles(
          FORM_STYLES,
          INPUT_STYLES,
          BUTTON_STYLES,
          SECTION_STYLES,
          MESSAGE_HEADER_STYLES,
          BIT_LAYOUT_STYLES,
          SIGNALS_LAYOUT_STYLES
        )}
        :host {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow-y: auto;
          padding: 16px;
        }
        .de-actions {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }
        .id-display {
          font-family: var(--de-font-mono);
          color: var(--de-text-muted);
          font-size: 12px;
          margin-left: 8px;
        }
      </style>

      ${this.isEditingMessage ? this.renderMessageEditMode(idHex) : this.renderMessageViewMode(idHex)}

      <div class="de-section signals-section">
        <div class="de-section-header">
          <span class="de-section-title">Signals (${this.message.signals.length})</span>
          ${this.parentEditMode ? `
            <button class="de-btn de-btn-primary de-btn-small" id="add-signal-btn">+ Add Signal</button>
          ` : ''}
        </div>

        ${this.renderBitLayout()}

        <div class="signals-layout">
          <div class="signals-table-container">
            <de-signals-table></de-signals-table>
          </div>
          ${this.isAddingSignal || this.selectedSignal ? `
            <div class="signal-editor-panel">
              <de-signal-editor data-edit-mode="${this.parentEditMode}"></de-signal-editor>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    this.setupEventListeners();
    this.updateChildComponents();
  }

  private setupEventListeners() {
    if (!this.shadowRoot) return;

    // Message view mode buttons
    this.shadowRoot.getElementById('edit-msg-btn')?.addEventListener('click', () => {
      this.isEditingMessage = true;
      this.render();
    });

    this.shadowRoot.getElementById('delete-msg-btn')?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('message-delete-request', {
        bubbles: true,
        composed: true,
      }));
    });

    // Message edit mode buttons
    this.shadowRoot.getElementById('done-msg-btn')?.addEventListener('click', () => {
      if (!this.message.name) {
        alert('Message name is required');
        return;
      }
      this.isEditingMessage = false;
      this.originalMessage = deepClone(this.message);
      this.notifyChange();
      this.dispatchEvent(new CustomEvent('message-edit-done', {
        detail: this.message,
        bubbles: true,
        composed: true,
      }));
      this.render();
    });

    this.shadowRoot.getElementById('cancel-msg-btn')?.addEventListener('click', () => {
      if (this.isNewMessage) {
        this.dispatchEvent(new CustomEvent('message-edit-cancel', {
          bubbles: true,
          composed: true,
        }));
      } else {
        this.message = deepClone(this.originalMessage);
        this.isEditingMessage = false;
        this.render();
      }
    });

    // Message property inputs (edit mode only)
    const msgName = this.shadowRoot.getElementById('msg_name') as HTMLInputElement;
    const msgId = this.shadowRoot.getElementById('msg_id') as HTMLInputElement;
    const msgDlc = this.shadowRoot.getElementById('msg_dlc') as HTMLSelectElement;
    const msgSender = this.shadowRoot.getElementById('msg_sender') as HTMLSelectElement;
    const msgExtended = this.shadowRoot.getElementById('msg_extended') as HTMLInputElement;

    msgName?.addEventListener('input', () => {
      this.message.name = msgName.value;
    });

    msgId?.addEventListener('input', () => {
      this.message.id = parseInt(msgId.value, 10) || 0;
      const idHex = `0x${this.message.id.toString(16).toUpperCase()}`;
      const label = this.shadowRoot!.querySelector('.id-display');
      if (label) label.textContent = `(${idHex})`;

      // Auto-detect DLC from loaded frames
      if (this.isNewMessage && this.frames.length > 0) {
        const detectedDlc = detectDlcFromFrames(this.frames, this.message.id, this.message.is_extended);
        if (detectedDlc !== null && detectedDlc !== this.message.dlc) {
          this.message.dlc = detectedDlc;
          if (msgDlc) msgDlc.value = String(detectedDlc);
        }
      }
    });

    msgDlc?.addEventListener('change', () => {
      this.message.dlc = parseInt(msgDlc.value, 10);
    });

    msgSender?.addEventListener('change', () => {
      this.message.sender = msgSender.value;
    });

    msgExtended?.addEventListener('change', () => {
      this.message.is_extended = msgExtended.checked;

      // Re-detect DLC when extended flag changes
      if (this.isNewMessage && this.frames.length > 0) {
        const detectedDlc = detectDlcFromFrames(this.frames, this.message.id, this.message.is_extended);
        if (detectedDlc !== null && detectedDlc !== this.message.dlc) {
          this.message.dlc = detectedDlc;
          if (msgDlc) msgDlc.value = String(detectedDlc);
        }
      }
    });

    // Setup bit layout sliders
    this.setupSliderListeners();

    // Add signal button
    const addSignalBtn = this.shadowRoot.getElementById('add-signal-btn');
    addSignalBtn?.addEventListener('click', () => {
      this.isAddingSignal = true;
      this.selectedSignal = null;
      this.editingSignal = createDefaultSignal();
      this.render();
    });

    // Signal table events
    const signalsTable = this.shadowRoot.querySelector('de-signals-table') as SignalsTableElement;
    signalsTable?.addEventListener('signal-select', ((e: CustomEvent) => {
      const name = e.detail.name;
      if (this.selectedSignal === name) {
        // Toggle off - deselect
        this.selectedSignal = null;
        this.editingSignal = null;
        this.isEditingSignal = false;
      } else {
        this.selectedSignal = name;
        this.editingSignal = this.message.signals.find(s => s.name === name) || null;
        this.isEditingSignal = false;
      }
      this.isAddingSignal = false;
      this.render();
    }) as EventListener);

    // Signal editor events
    const signalEditor = this.shadowRoot.querySelector('de-signal-editor') as SignalEditorElement;

    signalEditor?.addEventListener('edit-start', (() => {
      this.isEditingSignal = true;
      // Don't call render() - it would reset the signal-editor to view mode
      // Just add the sliders to the bit layout
      const bitLayout = this.shadowRoot!.querySelector('.bit-layout');
      if (bitLayout && !bitLayout.querySelector('.bit-sliders')) {
        const totalBits = this.message.dlc * 8;
        const currentStart = this.editingSignal?.start_bit ?? 0;
        const currentLength = this.editingSignal?.length ?? 1;
        const byteOrder = this.editingSignal?.byte_order ?? 'little_endian';
        const constraints = getSliderConstraints(totalBits, currentStart, currentLength, byteOrder);
        const slidersHtml = `
          <div class="bit-sliders">
            <div class="bit-slider-group">
              <div class="bit-slider-label">
                <span>Start Bit</span>
                <span class="bit-slider-value" id="start-bit-value">${currentStart}</span>
              </div>
              <input type="range" class="bit-slider" id="start-bit-slider"
                     min="${constraints.startMin}" max="${constraints.startMax}" value="${currentStart}">
            </div>
            <div class="bit-slider-group">
              <div class="bit-slider-label">
                <span>Length</span>
                <span class="bit-slider-value" id="length-value">${currentLength}</span>
              </div>
              <input type="range" class="bit-slider" id="length-slider"
                     min="${constraints.lenMin}" max="${constraints.lenMax}" value="${currentLength}">
            </div>
          </div>
        `;
        bitLayout.insertAdjacentHTML('beforeend', slidersHtml);
        this.setupSliderListeners();
      }
    }) as EventListener);

    signalEditor?.addEventListener('signal-change', ((e: CustomEvent) => {
      const signal = e.detail as SignalDto;
      if (this.editingSignal) {
        // Update editingSignal with all changed properties including byte_order
        this.editingSignal = { ...this.editingSignal, ...signal };

        const startBitSlider = this.shadowRoot!.getElementById('start-bit-slider') as HTMLInputElement;
        const lengthSlider = this.shadowRoot!.getElementById('length-slider') as HTMLInputElement;
        const totalBits = this.message.dlc * 8;

        if (startBitSlider && lengthSlider) {
          const constraints = getSliderConstraints(totalBits, signal.start_bit, signal.length, signal.byte_order);

          startBitSlider.min = String(constraints.startMin);
          startBitSlider.max = String(constraints.startMax);
          lengthSlider.min = String(constraints.lenMin);
          lengthSlider.max = String(constraints.lenMax);

          // Update slider values
          startBitSlider.value = String(signal.start_bit);
          lengthSlider.value = String(signal.length);

          // Update displayed values
          const startValueEl = this.shadowRoot!.getElementById('start-bit-value');
          const lengthValueEl = this.shadowRoot!.getElementById('length-value');
          if (startValueEl) startValueEl.textContent = String(signal.start_bit);
          if (lengthValueEl) lengthValueEl.textContent = String(signal.length);
        }

        // Re-render bit bar to reflect byte_order and position changes
        this.updateBitBar();

        // Validate and set error state
        this.validateSignalAndSetError(signalEditor);
      }
    }) as EventListener);

    signalEditor?.addEventListener('edit-done', ((e: CustomEvent) => {
      const signal = e.detail as SignalDto;
      if (!signal.name) {
        alert('Signal name is required');
        return;
      }

      // Check for bit range validity
      const totalBits = this.message.dlc * 8;
      if (signal.start_bit + signal.length > totalBits) {
        alert(`Signal extends beyond message size (${totalBits} bits). Reduce start bit or length.`);
        return;
      }

      // Check for overlapping signals (exclude current signal being edited)
      const excludeName = this.isAddingSignal ? null : this.selectedSignal;
      const overlap = this.findOverlappingSignal(signal, excludeName);
      if (overlap) {
        alert(`Signal "${signal.name}" overlaps with "${overlap.name}" (bits ${overlap.start_bit}-${overlap.start_bit + overlap.length - 1})`);
        return;
      }

      if (this.isAddingSignal) {
        // Check for duplicate name
        if (this.message.signals.some(s => s.name === signal.name)) {
          alert(`Signal "${signal.name}" already exists`);
          return;
        }
        this.message.signals.push(signal);
        this.selectedSignal = signal.name;
      } else if (this.selectedSignal) {
        // Update existing signal
        const idx = this.message.signals.findIndex(s => s.name === this.selectedSignal);
        if (idx >= 0) {
          // Check for duplicate if name changed
          if (signal.name !== this.selectedSignal &&
              this.message.signals.some(s => s.name === signal.name)) {
            alert(`Signal "${signal.name}" already exists`);
            return;
          }
          this.message.signals[idx] = signal;
          this.selectedSignal = signal.name;
        }
      }

      this.isAddingSignal = false;
      this.isEditingSignal = false;
      this.editingSignal = signal;
      this.notifyChange();
      this.render();
    }) as EventListener);

    signalEditor?.addEventListener('edit-cancel', (() => {
      this.isEditingSignal = false;
      if (this.isAddingSignal) {
        this.isAddingSignal = false;
        this.selectedSignal = null;
        this.editingSignal = null;
      } else if (this.selectedSignal) {
        // Restore editingSignal from the original in message.signals
        const found = this.message.signals.find(s => s.name === this.selectedSignal);
        this.editingSignal = found ? deepClone(found) : null;
      }
      this.render();
    }) as EventListener);

    signalEditor?.addEventListener('signal-delete-request', ((e: CustomEvent) => {
      const name = e.detail.name;
      if (confirm(`Delete signal "${name}"?`)) {
        this.message.signals = this.message.signals.filter(s => s.name !== name);
        this.selectedSignal = null;
        this.editingSignal = null;
        this.notifyChange();
        this.render();
      }
    }) as EventListener);
  }

  private updateChildComponents() {
    if (!this.shadowRoot) return;

    const signalsTable = this.shadowRoot.querySelector('de-signals-table') as SignalsTableElement;
    if (signalsTable) {
      signalsTable.setSignals(this.message.signals);
      signalsTable.setSelected(this.selectedSignal);
    }

    const signalEditor = this.shadowRoot.querySelector('de-signal-editor') as SignalEditorElement;
    if (signalEditor && this.editingSignal) {
      signalEditor.setSignal(this.editingSignal, this.isAddingSignal);
      signalEditor.setAvailableNodes(this.availableNodes);
    }
  }

  /**
   * Check if a signal overlaps with any existing signal in the message.
   * Returns the overlapping signal if found, null otherwise.
   * Multiplexed signals only overlap with signals of the same mux value or non-muxed signals.
   * Properly handles both Intel (little endian) and Motorola (big endian) byte orders.
   */
  private findOverlappingSignal(signal: SignalDto, excludeName: string | null): SignalDto | null {
    const sigPos = getLinearBitPosition(signal.start_bit, signal.length, signal.byte_order);

    for (const existing of this.message.signals) {
      // Skip the signal being edited
      if (excludeName && existing.name === excludeName) continue;

      // For multiplexed signals, only check overlap within same mux context
      // Non-muxed signals (multiplexer_value === null) can overlap with each other
      // but muxed signals with different values can occupy same bits
      if (signal.multiplexer_value !== null && existing.multiplexer_value !== null) {
        if (signal.multiplexer_value !== existing.multiplexer_value) {
          continue; // Different mux values, can share bits
        }
      }

      const existPos = getLinearBitPosition(existing.start_bit, existing.length, existing.byte_order);

      // Check for overlap: ranges overlap if start1 <= end2 AND start2 <= end1
      if (sigPos.start <= existPos.end && existPos.start <= sigPos.end) {
        return existing;
      }
    }

    return null;
  }

  private validateSignalAndSetError(signalEditor: SignalEditorElement | null) {
    if (!signalEditor || !this.editingSignal) return;

    const totalBits = this.message.dlc * 8;
    const signal = this.editingSignal;
    const pos = getLinearBitPosition(signal.start_bit, signal.length, signal.byte_order);

    // Check bounds
    if (pos.start < 0 || pos.end >= totalBits) {
      signalEditor.setError(`Signal exceeds message bounds (0-${totalBits - 1} bits)`);
      return;
    }

    // Check for overlapping signals
    const excludeName = this.isAddingSignal ? null : this.selectedSignal;
    const overlap = this.findOverlappingSignal(signal, excludeName);
    if (overlap) {
      signalEditor.setError(`Overlaps with "${overlap.name}"`);
      return;
    }

    // No errors
    signalEditor.setError(null);
  }

  private notifyChange() {
    this.dispatchEvent(new CustomEvent('message-change', {
      detail: this.message,
      bubbles: true,
      composed: true,
    }));
  }
}

customElements.define('de-message-editor', MessageEditorElement);
