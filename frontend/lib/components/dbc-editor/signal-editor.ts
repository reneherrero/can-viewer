/**
 * Signal editor component for viewing/editing a single signal.
 */

import type { SignalDto } from './types';
import { createDefaultSignal } from './types';
import { deepClone, createEvent } from './utils';
import {
  getBaseStyles, BUTTON_STYLES, INPUT_STYLES, FORM_STYLES, FIELD_VIEW_STYLES, combineStyles
} from './shared-styles';

const SIGNAL_EDITOR_STYLES = `
  :host {
    display: block;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--de-border);
  }
  .signal-name { font-weight: 600; font-size: 15px; color: #fff; }
  .view-container { display: flex; flex-direction: column; gap: 4px; }
  .actions { display: flex; gap: 4px; }
  .de-form-row-4 { display: flex; gap: 8px; margin-bottom: 8px; }
  .de-form-row-4 > .de-form-group { flex: 1; margin-bottom: 0; }
  .de-form-group-sm { margin-bottom: 8px; }
  .de-form-group-sm .de-label { margin-bottom: 2px; }
  .de-form-group-sm .de-input, .de-form-group-sm .de-select { padding: 4px 6px; font-size: 12px; }
  .btn-row { display: flex; gap: 4px; margin-top: 8px; padding-bottom: 4px; }
  .de-btn-warning { background: #f59e0b; border-color: #f59e0b; color: white; }
  .de-btn-warning:hover { background: #d97706; border-color: #d97706; }
  .error-msg { color: #ef4444; font-size: 11px; margin-top: 4px; }
`;

export class SignalEditorElement extends HTMLElement {
  private signal: SignalDto = createDefaultSignal();
  private originalSignal: SignalDto = createDefaultSignal();
  private availableNodes: string[] = [];
  private isEditing = false;
  private parentEditMode = false;
  private errorMessage: string | null = null;

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

  setSignal(signal: SignalDto | null, isNew: boolean) {
    this.signal = signal ? deepClone(signal) : createDefaultSignal();
    this.originalSignal = deepClone(this.signal);
    this.isEditing = isNew;
    this.render();
  }

  setAvailableNodes(nodes: string[]) {
    this.availableNodes = nodes;
    this.render();
  }

  getSignal(): SignalDto {
    return this.signal;
  }

  isInEditMode(): boolean {
    return this.isEditing;
  }

  updateSignalValues(updates: Partial<SignalDto>) {
    this.signal = { ...this.signal, ...updates };
    if (this.shadowRoot && this.isEditing) {
      if (updates.start_bit !== undefined) {
        const input = this.shadowRoot.getElementById('start_bit') as HTMLInputElement;
        if (input) input.value = String(updates.start_bit);
      }
      if (updates.length !== undefined) {
        const input = this.shadowRoot.getElementById('length') as HTMLInputElement;
        if (input) input.value = String(updates.length);
      }
    }
  }

  setError(message: string | null) {
    this.errorMessage = message;
    if (this.shadowRoot && this.isEditing) {
      const errorEl = this.shadowRoot.querySelector('.error-msg') as HTMLElement;
      const doneBtn = this.shadowRoot.getElementById('done-btn') as HTMLButtonElement;
      if (errorEl) {
        errorEl.textContent = message || '';
        errorEl.style.display = message ? 'block' : 'none';
      }
      if (doneBtn) {
        doneBtn.disabled = !!message;
        doneBtn.style.opacity = message ? '0.5' : '1';
        doneBtn.style.cursor = message ? 'not-allowed' : 'pointer';
      }
    }
  }

  private restoreOriginal() {
    this.signal = deepClone(this.originalSignal);
    this.errorMessage = null;
    this.render();
    this.dispatchEvent(createEvent('signal-change', this.signal));
  }

  private render() {
    if (!this.shadowRoot) return;
    if (this.isEditing) {
      this.renderEditMode();
    } else {
      this.renderViewMode();
    }
  }

  private renderViewMode() {
    if (!this.shadowRoot) return;

    const byteOrder = this.signal.byte_order === 'little_endian' ? 'Little Endian' : 'Big Endian';
    const valueType = this.signal.is_unsigned ? 'Unsigned' : 'Signed';
    const unit = this.signal.unit || '-';
    const mux = this.signal.is_multiplexer ? 'Multiplexer (M)' :
                this.signal.multiplexer_value !== null ? `Multiplexed (m${this.signal.multiplexer_value})` : '-';

    const receiversType = this.signal.receivers.type;
    const receivers = receiversType === 'nodes'
      ? (this.signal.receivers as { type: 'nodes'; nodes: string[] }).nodes.join(', ')
      : 'None';

    this.shadowRoot.innerHTML = `
      <style>${combineStyles(getBaseStyles(), BUTTON_STYLES, FIELD_VIEW_STYLES, SIGNAL_EDITOR_STYLES)}</style>

      <div class="header">
        <span class="signal-name">${this.signal.name || '(unnamed)'}</span>
        ${this.parentEditMode ? `
          <div class="actions">
            <button class="de-btn de-btn-primary" id="edit-btn">Edit</button>
            <button class="de-btn de-btn-danger" id="delete-btn">Delete</button>
          </div>
        ` : ''}
      </div>

      <div class="view-container">
        <div class="field"><span class="field-label">Start Bit</span><span class="field-value">${this.signal.start_bit}</span></div>
        <div class="field"><span class="field-label">Length</span><span class="field-value">${this.signal.length} bits</span></div>
        <div class="field"><span class="field-label">Byte Order</span><span class="field-value text">${byteOrder}</span></div>
        <div class="field"><span class="field-label">Value Type</span><span class="field-value text">${valueType}</span></div>
        <div class="field"><span class="field-label">Factor</span><span class="field-value">${this.signal.factor}</span></div>
        <div class="field"><span class="field-label">Offset</span><span class="field-value">${this.signal.offset}</span></div>
        <div class="field"><span class="field-label">Min</span><span class="field-value">${this.signal.min}</span></div>
        <div class="field"><span class="field-label">Max</span><span class="field-value">${this.signal.max}</span></div>
        <div class="field"><span class="field-label">Unit</span><span class="field-value text">${unit}</span></div>
        <div class="field"><span class="field-label">Multiplexing</span><span class="field-value text">${mux}</span></div>
        <div class="field"><span class="field-label">Receivers</span><span class="field-value text">${receivers}</span></div>
      </div>
    `;

    this.shadowRoot.getElementById('edit-btn')?.addEventListener('click', () => {
      this.originalSignal = deepClone(this.signal);
      this.isEditing = true;
      this.render();
      this.dispatchEvent(createEvent('edit-start', {}));
    });

    this.shadowRoot.getElementById('delete-btn')?.addEventListener('click', () => {
      this.dispatchEvent(createEvent('signal-delete-request', { name: this.signal.name }));
    });
  }

  private renderEditMode() {
    if (!this.shadowRoot) return;

    const receiversType = this.signal.receivers.type;
    const receiversNodes = receiversType === 'nodes'
      ? (this.signal.receivers as { type: 'nodes'; nodes: string[] }).nodes
      : [];

    this.shadowRoot.innerHTML = `
      <style>${combineStyles(getBaseStyles(), BUTTON_STYLES, INPUT_STYLES, FORM_STYLES, SIGNAL_EDITOR_STYLES)}
        .de-btn-success { background: var(--de-success); border-color: var(--de-success); color: white; }
        .de-btn-success:hover { background: #16a34a; border-color: #16a34a; }
        .de-btn-success:disabled { opacity: 0.5; cursor: not-allowed; }
      </style>

      <div class="de-form-group-sm">
        <label class="de-label">Name</label>
        <input type="text" class="de-input" id="name" value="${this.signal.name}" placeholder="Signal Name">
      </div>

      <div class="de-form-row-4">
        <div class="de-form-group de-form-group-sm">
          <label class="de-label">Start</label>
          <input type="number" class="de-input" id="start_bit" value="${this.signal.start_bit}" min="0" max="511">
        </div>
        <div class="de-form-group de-form-group-sm">
          <label class="de-label">Len</label>
          <input type="number" class="de-input" id="length" value="${this.signal.length}" min="1" max="64">
        </div>
        <div class="de-form-group de-form-group-sm">
          <label class="de-label">Order</label>
          <select class="de-select" id="byte_order">
            <option value="little_endian" ${this.signal.byte_order === 'little_endian' ? 'selected' : ''}>LE</option>
            <option value="big_endian" ${this.signal.byte_order === 'big_endian' ? 'selected' : ''}>BE</option>
          </select>
        </div>
        <div class="de-form-group de-form-group-sm">
          <label class="de-label">Type</label>
          <select class="de-select" id="is_unsigned">
            <option value="true" ${this.signal.is_unsigned ? 'selected' : ''}>U</option>
            <option value="false" ${!this.signal.is_unsigned ? 'selected' : ''}>S</option>
          </select>
        </div>
      </div>

      <div class="de-form-row-4">
        <div class="de-form-group de-form-group-sm">
          <label class="de-label">Factor</label>
          <input type="number" class="de-input" id="factor" value="${this.signal.factor}" step="any">
        </div>
        <div class="de-form-group de-form-group-sm">
          <label class="de-label">Offset</label>
          <input type="number" class="de-input" id="offset" value="${this.signal.offset}" step="any">
        </div>
        <div class="de-form-group de-form-group-sm">
          <label class="de-label">Min</label>
          <input type="number" class="de-input" id="min" value="${this.signal.min}" step="any">
        </div>
        <div class="de-form-group de-form-group-sm">
          <label class="de-label">Max</label>
          <input type="number" class="de-input" id="max" value="${this.signal.max}" step="any">
        </div>
      </div>

      <div class="de-form-row">
        <div class="de-form-group de-form-group-sm">
          <label class="de-label">Unit</label>
          <input type="text" class="de-input" id="unit" value="${this.signal.unit || ''}" placeholder="">
        </div>
        <div class="de-form-group de-form-group-sm">
          <label class="de-label">Receivers</label>
          <select class="de-select" id="receivers_type">
            <option value="none" ${receiversType === 'none' ? 'selected' : ''}>None</option>
            <option value="nodes" ${receiversType === 'nodes' ? 'selected' : ''}>Nodes</option>
          </select>
        </div>
      </div>

      <div class="de-form-group-sm receivers-nodes" style="display: ${receiversType === 'nodes' ? 'block' : 'none'}">
        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
          ${this.availableNodes.map(node => `
            <label class="de-checkbox-group" style="font-size: 11px;">
              <input type="checkbox" class="de-checkbox receiver-node" value="${node}" ${receiversNodes.includes(node) ? 'checked' : ''} style="width: 14px; height: 14px;">
              <span>${node}</span>
            </label>
          `).join('')}
        </div>
      </div>

      <div class="de-form-row">
        <div class="de-form-group de-form-group-sm">
          <label class="de-checkbox-group" style="font-size: 12px;">
            <input type="checkbox" class="de-checkbox" id="is_multiplexer" ${this.signal.is_multiplexer ? 'checked' : ''} style="width: 14px; height: 14px;">
            <span>Mux Switch</span>
          </label>
        </div>
        <div class="de-form-group de-form-group-sm">
          <label class="de-label">Mux Val</label>
          <input type="number" class="de-input" id="multiplexer_value" value="${this.signal.multiplexer_value ?? ''}" placeholder="-" min="0">
        </div>
      </div>

      <div class="error-msg" style="display: ${this.errorMessage ? 'block' : 'none'}">${this.errorMessage || ''}</div>

      <div class="btn-row">
        <button class="de-btn de-btn-success de-btn-small" id="done-btn" ${this.errorMessage ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>Done</button>
        <button class="de-btn de-btn-warning de-btn-small" id="restore-btn">Restore</button>
        <button class="de-btn de-btn-small" id="cancel-btn">Cancel</button>
      </div>
    `;

    this.setupEditListeners();
  }

  private setupEditListeners() {
    if (!this.shadowRoot) return;

    const inputs = ['name', 'start_bit', 'length', 'factor', 'offset', 'min', 'max', 'unit', 'multiplexer_value'];
    inputs.forEach(id => {
      const input = this.shadowRoot!.getElementById(id) as HTMLInputElement;
      input?.addEventListener('input', () => this.updateSignalFromInputs());
    });

    const selects = ['byte_order', 'is_unsigned', 'receivers_type'];
    selects.forEach(id => {
      const select = this.shadowRoot!.getElementById(id) as HTMLSelectElement;
      select?.addEventListener('change', () => {
        this.updateSignalFromInputs();
        if (id === 'receivers_type') {
          const nodesDiv = this.shadowRoot!.querySelector('.receivers-nodes') as HTMLElement;
          if (nodesDiv) {
            nodesDiv.style.display = select.value === 'nodes' ? 'block' : 'none';
          }
        }
      });
    });

    const multiplexerCheckbox = this.shadowRoot.getElementById('is_multiplexer') as HTMLInputElement;
    multiplexerCheckbox?.addEventListener('change', () => this.updateSignalFromInputs());

    this.shadowRoot.querySelectorAll('.receiver-node').forEach(checkbox => {
      checkbox.addEventListener('change', () => this.updateSignalFromInputs());
    });

    this.shadowRoot.getElementById('done-btn')?.addEventListener('click', () => {
      if (this.errorMessage) return; // Don't allow done if there's an error
      this.updateSignalFromInputs();
      this.isEditing = false;
      this.errorMessage = null;
      this.render();
      this.dispatchEvent(createEvent('edit-done', this.signal));
    });

    this.shadowRoot.getElementById('restore-btn')?.addEventListener('click', () => {
      this.restoreOriginal();
    });

    this.shadowRoot.getElementById('cancel-btn')?.addEventListener('click', () => {
      this.signal = deepClone(this.originalSignal);
      this.isEditing = false;
      this.errorMessage = null;
      this.render();
      this.dispatchEvent(createEvent('edit-cancel', {}));
    });
  }

  private updateSignalFromInputs() {
    if (!this.shadowRoot) return;

    const getValue = (id: string): string => {
      const el = this.shadowRoot!.getElementById(id) as HTMLInputElement | HTMLSelectElement;
      return el?.value || '';
    };

    const getChecked = (id: string): boolean => {
      const el = this.shadowRoot!.getElementById(id) as HTMLInputElement;
      return el?.checked || false;
    };

    const multiplexerValueStr = getValue('multiplexer_value');
    const multiplexerValue = multiplexerValueStr !== '' ? parseInt(multiplexerValueStr, 10) : null;

    const receiversType = getValue('receivers_type');
    let receivers: SignalDto['receivers'];
    if (receiversType === 'nodes') {
      const checkedNodes: string[] = [];
      this.shadowRoot.querySelectorAll('.receiver-node:checked').forEach(cb => {
        checkedNodes.push((cb as HTMLInputElement).value);
      });
      receivers = { type: 'nodes', nodes: checkedNodes };
    } else {
      receivers = { type: 'none' };
    }

    this.signal = {
      name: getValue('name'),
      start_bit: parseInt(getValue('start_bit'), 10) || 0,
      length: parseInt(getValue('length'), 10) || 1,
      byte_order: getValue('byte_order') as 'little_endian' | 'big_endian',
      is_unsigned: getValue('is_unsigned') === 'true',
      factor: parseFloat(getValue('factor')) || 1,
      offset: parseFloat(getValue('offset')) || 0,
      min: parseFloat(getValue('min')) || 0,
      max: parseFloat(getValue('max')) || 0,
      unit: getValue('unit') || null,
      receivers,
      is_multiplexer: getChecked('is_multiplexer'),
      multiplexer_value: multiplexerValue,
    };

    this.dispatchEvent(createEvent('signal-change', this.signal));
  }
}

customElements.define('de-signal-editor', SignalEditorElement);
