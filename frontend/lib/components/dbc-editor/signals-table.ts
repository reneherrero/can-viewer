/**
 * Signals table component for displaying signals in a message.
 */

import type { SignalDto } from './types';
import { createEvent } from './utils';
import { getBaseStyles, TABLE_STYLES, EMPTY_STATE_STYLES, combineStyles } from './shared-styles';

export class SignalsTableElement extends HTMLElement {
  private signals: SignalDto[] = [];
  private selectedName: string | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  setSignals(signals: SignalDto[]) {
    this.signals = signals;
    this.render();
  }

  setSelected(name: string | null) {
    this.selectedName = name;
    this.render();
  }

  private render() {
    if (!this.shadowRoot) return;

    const rows = this.signals.map((sig) => {
      const isSelected = this.selectedName === sig.name;
      const byteOrder = sig.byte_order === 'little_endian' ? 'LE' : 'BE';
      const signed = sig.is_unsigned ? 'U' : 'S';
      const unit = sig.unit || '-';
      const mux = sig.is_multiplexer ? 'M' :
                  sig.multiplexer_value !== null ? `m${sig.multiplexer_value}` : '-';

      return `
        <tr class="${isSelected ? 'selected' : ''}" data-name="${sig.name}">
          <td>${sig.name}</td>
          <td class="mono">${sig.start_bit}</td>
          <td class="mono">${sig.length}</td>
          <td>${byteOrder}</td>
          <td>${signed}</td>
          <td class="mono">${sig.factor}</td>
          <td class="mono">${sig.offset}</td>
          <td class="mono">${sig.min}</td>
          <td class="mono">${sig.max}</td>
          <td>${unit}</td>
          <td>${mux}</td>
        </tr>
      `;
    }).join('');

    this.shadowRoot.innerHTML = `
      <style>${combineStyles(getBaseStyles(), TABLE_STYLES, EMPTY_STATE_STYLES)}</style>

      ${this.signals.length === 0 ? `
        <div class="empty-message">No signals defined. Click "Add Signal" to create one.</div>
      ` : `
        <table class="de-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Start</th>
              <th>Len</th>
              <th>Order</th>
              <th>Sign</th>
              <th>Factor</th>
              <th>Offset</th>
              <th>Min</th>
              <th>Max</th>
              <th>Unit</th>
              <th>Mux</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `}
    `;

    // Row click handlers (for selection)
    this.shadowRoot.querySelectorAll('tbody tr').forEach((row) => {
      row.addEventListener('click', () => {
        const name = (row as HTMLElement).dataset.name;
        if (name) {
          this.dispatchEvent(createEvent('signal-select', { name }));
        }
      });
    });
  }
}

customElements.define('de-signals-table', SignalsTableElement);
