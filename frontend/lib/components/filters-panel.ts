import { parseCanIds, parseMessageNames, type Filters } from '../config';

/** Filters panel component */
export class FiltersPanelElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback(): void {
    this.bindEvents();
  }

  private bindEvents(): void {
    const inputs = this.querySelectorAll('.cv-filter-input');
    inputs.forEach(input => {
      input.addEventListener('input', () => this.emitFilterChange());
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

    return {
      timeMin: timeMin ? parseFloat(timeMin) : null,
      timeMax: timeMax ? parseFloat(timeMax) : null,
      canIds: parseCanIds(canIdStr),
      messages: parseMessageNames(messageStr),
    };
  }

  /** Clear all filter inputs */
  clearFilters(): void {
    this.setInputValue('filterTimeMin', '');
    this.setInputValue('filterTimeMax', '');
    this.setInputValue('filterCanId', '');
    this.setInputValue('filterMessage', '');
    this.emitFilterChange();
  }

  /** Update filter count display */
  setFilterCount(filtered: number, total: number): void {
    const count = this.querySelector('#filterCount');
    if (count) count.textContent = `${filtered} / ${total}`;
  }

  private getInputValue(id: string): string {
    const input = this.querySelector(`#${id}`) as HTMLInputElement;
    return input?.value.trim() || '';
  }

  private setInputValue(id: string, value: string): void {
    const input = this.querySelector(`#${id}`) as HTMLInputElement;
    if (input) input.value = value;
  }

  private emitFilterChange(): void {
    this.dispatchEvent(new CustomEvent('filter-change', {
      detail: this.getFilters(),
      bubbles: true,
    }));
  }
}

customElements.define('cv-filters-panel', FiltersPanelElement);
