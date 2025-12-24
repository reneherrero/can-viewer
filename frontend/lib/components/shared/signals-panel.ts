import type { DecodedSignal } from '../../types';
import { formatSignalValue } from '../../utils';

/** Signals panel component */
export class SignalsPanelElement extends HTMLElement {
  private signals: DecodedSignal[] = [];
  private errors: string[] = [];

  constructor() {
    super();
  }

  /** Update signals and re-render */
  setSignals(signals: DecodedSignal[], errors: string[] = []): void {
    this.signals = signals;
    this.errors = errors;
    this.render();
  }

  /** Show empty state */
  showEmpty(): void {
    this.signals = [];
    this.errors = [];
    const tbody = this.querySelector('tbody');
    const count = this.querySelector('.cv-table-info');
    const errorContainer = this.querySelector('.cv-decode-error');

    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="3" class="cv-signals-empty">Select a frame to view decoded signals</td></tr>';
    }
    if (count) {
      count.textContent = 'Select a frame';
    }
    if (errorContainer) {
      errorContainer.textContent = '';
      errorContainer.classList.add('hidden');
    }
  }

  private render(): void {
    const tbody = this.querySelector('tbody');
    const count = this.querySelector('.cv-table-info');
    const errorContainer = this.querySelector('.cv-decode-error');

    if (tbody) {
      if (this.signals.length === 0 && this.errors.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="cv-signals-empty">No signals decoded</td></tr>';
      } else {
        tbody.innerHTML = this.signals.map(sig => `
          <tr>
            <td class="cv-signal-name">${sig.signal_name}</td>
            <td class="cv-physical-value">${formatSignalValue(sig.value)}</td>
            <td class="cv-unit-highlight">${sig.unit || '-'}</td>
          </tr>
        `).join('');
      }
    }

    if (count) {
      count.textContent = `${this.signals.length} signals`;
    }

    // Show decode errors if any
    if (errorContainer) {
      if (this.errors.length > 0) {
        errorContainer.textContent = this.errors.join('; ');
        errorContainer.classList.remove('hidden');
      } else {
        errorContainer.textContent = '';
        errorContainer.classList.add('hidden');
      }
    }
  }
}

customElements.define('cv-signals-panel', SignalsPanelElement);
