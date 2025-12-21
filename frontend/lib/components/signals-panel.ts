import type { DecodedSignal } from '../types';
import { formatSignalValue } from '../formatters';

/** Signals panel component */
export class SignalsPanelElement extends HTMLElement {
  private signals: DecodedSignal[] = [];

  constructor() {
    super();
  }

  /** Update signals and re-render */
  setSignals(signals: DecodedSignal[]): void {
    this.signals = signals;
    this.render();
  }

  /** Show empty state */
  showEmpty(): void {
    this.signals = [];
    const tbody = this.querySelector('tbody');
    const count = this.querySelector('.cv-table-info');

    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="3" class="cv-signals-empty">Select a frame to view decoded signals</td></tr>';
    }
    if (count) {
      count.textContent = 'Select a frame';
    }
  }

  private render(): void {
    const tbody = this.querySelector('tbody');
    const count = this.querySelector('.cv-table-info');

    if (tbody) {
      tbody.innerHTML = this.signals.map(sig => `
        <tr>
          <td class="cv-signal-name">${sig.signal_name}</td>
          <td class="cv-physical-value">${formatSignalValue(sig.value)}</td>
          <td class="cv-unit-highlight">${sig.unit || '-'}</td>
        </tr>
      `).join('');
    }

    if (count) {
      count.textContent = `${this.signals.length} signals`;
    }
  }

  /** Scroll to bottom */
  scrollToBottom(): void {
    const wrapper = this.querySelector('.cv-table-wrapper');
    if (wrapper) wrapper.scrollTop = wrapper.scrollHeight;
  }
}

customElements.define('cv-signals-panel', SignalsPanelElement);
