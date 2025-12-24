import { parseCanIds, parseMessageNames, parseDataPattern, countActiveFilters, type Filters } from '../../config';

/** Filters panel component */
export class FiltersPanelElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback(): void {
    this.bindEvents();
  }

  private bindEvents(): void {
    // Bind all inputs
    const inputs = this.querySelectorAll('.cv-input');
    inputs.forEach(input => {
      input.addEventListener('input', () => this.emitFilterChange());
    });

    // Bind select elements
    const selects = this.querySelectorAll('.cv-select');
    selects.forEach(select => {
      select.addEventListener('change', () => this.emitFilterChange());
    });

    const clearBtn = this.querySelector('#clearFiltersBtn');
    clearBtn?.addEventListener('click', () => this.clearFilters());
  }

  /** Get current filter values */
  getFilters(): Filters {
    const timeMin = this.getInputValue('filterTimeMin');
    const timeMax = this.getInputValue('filterTimeMax');
    const canIdStr = this.getInputValue('filterCanId');
    const messageStr = this.getInputValue('filterMessage');
    const signalStr = this.getInputValue('filterSignal');
    const dataPatternStr = this.getInputValue('filterDataPattern');
    const channelStr = this.getInputValue('filterChannel');
    const matchStatus = this.getSelectValue('filterMatchStatus') as 'all' | 'matched' | 'unmatched';

    return {
      timeMin: timeMin ? parseFloat(timeMin) : null,
      timeMax: timeMax ? parseFloat(timeMax) : null,
      canIds: parseCanIds(canIdStr),
      messages: parseMessageNames(messageStr),
      signals: parseMessageNames(signalStr),
      dataPattern: parseDataPattern(dataPatternStr),
      channel: channelStr || null,
      matchStatus: matchStatus || 'all',
    };
  }

  /** Clear all filter inputs */
  clearFilters(): void {
    this.setInputValue('filterTimeMin', '');
    this.setInputValue('filterTimeMax', '');
    this.setInputValue('filterCanId', '');
    this.setInputValue('filterMessage', '');
    this.setInputValue('filterSignal', '');
    this.setInputValue('filterDataPattern', '');
    this.setInputValue('filterChannel', '');
    this.setSelectValue('filterMatchStatus', 'all');
    this.emitFilterChange();
  }

  /** Update filter summary display */
  updateSummary(filtered: number, total: number): void {
    const summary = this.querySelector('#filterSummary');
    if (summary) {
      const filters = this.getFilters();
      const activeCount = countActiveFilters(filters);
      if (activeCount === 0) {
        summary.textContent = 'No filters active';
      } else {
        summary.textContent = `${activeCount} filter${activeCount > 1 ? 's' : ''} · ${filtered}/${total} frames`;
      }
    }
  }

  private getInputValue(id: string): string {
    const input = this.querySelector(`#${id}`) as HTMLInputElement;
    return input?.value.trim() || '';
  }

  private setInputValue(id: string, value: string): void {
    const input = this.querySelector(`#${id}`) as HTMLInputElement;
    if (input) input.value = value;
  }

  private getSelectValue(id: string): string {
    const select = this.querySelector(`#${id}`) as HTMLSelectElement;
    return select?.value || '';
  }

  private setSelectValue(id: string, value: string): void {
    const select = this.querySelector(`#${id}`) as HTMLSelectElement;
    if (select) select.value = value;
  }

  private emitFilterChange(): void {
    this.dispatchEvent(new CustomEvent('filter-change', {
      detail: this.getFilters(),
      bubbles: true,
    }));
  }
}

customElements.define('cv-filters-panel', FiltersPanelElement);
