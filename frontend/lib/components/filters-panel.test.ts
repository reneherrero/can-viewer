import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FiltersPanelElement } from './filters-panel';

// Mock CSS import
vi.mock('../../styles/can-viewer.css?inline', () => ({
  default: '/* mocked styles */',
}));

describe('FiltersPanelElement', () => {
  let element: FiltersPanelElement;

  beforeEach(() => {
    // Register the custom element if not already registered
    if (!customElements.get('cv-filters-panel')) {
      customElements.define('cv-filters-panel', FiltersPanelElement);
    }

    element = document.createElement('cv-filters-panel') as FiltersPanelElement;
    element.innerHTML = `
      <div class="cv-filters-header">
        <span class="cv-filter-count" id="filterCount">0 / 0</span>
        <button class="cv-btn" id="clearFiltersBtn">Clear</button>
      </div>
      <div class="cv-filters-inputs">
        <input class="cv-filter-input" id="filterTimeMin" placeholder="min">
        <input class="cv-filter-input" id="filterTimeMax" placeholder="max">
        <input class="cv-filter-input" id="filterCanId" placeholder="7DF, 7E8">
        <input class="cv-filter-input" id="filterMessage" placeholder="Engine, Speed">
      </div>
    `;
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  describe('getFilters', () => {
    it('should return empty filters when inputs are empty', () => {
      const filters = element.getFilters();

      expect(filters.timeMin).toBeNull();
      expect(filters.timeMax).toBeNull();
      expect(filters.canIds).toBeNull();
      expect(filters.messages).toBeNull();
    });

    it('should parse time range filters', () => {
      (element.querySelector('#filterTimeMin') as HTMLInputElement).value = '0.001';
      (element.querySelector('#filterTimeMax') as HTMLInputElement).value = '0.005';

      const filters = element.getFilters();

      expect(filters.timeMin).toBe(0.001);
      expect(filters.timeMax).toBe(0.005);
    });

    it('should parse CAN ID filters', () => {
      (element.querySelector('#filterCanId') as HTMLInputElement).value = '7DF, 7E8';

      const filters = element.getFilters();

      expect(filters.canIds).toEqual([0x7DF, 0x7E8]);
    });

    it('should parse message name filters', () => {
      (element.querySelector('#filterMessage') as HTMLInputElement).value = 'Engine, Speed';

      const filters = element.getFilters();

      expect(filters.messages).toEqual(['engine', 'speed']);
    });
  });

  describe('clearFilters', () => {
    it('should clear all filter inputs', () => {
      (element.querySelector('#filterTimeMin') as HTMLInputElement).value = '0.001';
      (element.querySelector('#filterTimeMax') as HTMLInputElement).value = '0.005';
      (element.querySelector('#filterCanId') as HTMLInputElement).value = '7DF';
      (element.querySelector('#filterMessage') as HTMLInputElement).value = 'Engine';

      element.clearFilters();

      expect((element.querySelector('#filterTimeMin') as HTMLInputElement).value).toBe('');
      expect((element.querySelector('#filterTimeMax') as HTMLInputElement).value).toBe('');
      expect((element.querySelector('#filterCanId') as HTMLInputElement).value).toBe('');
      expect((element.querySelector('#filterMessage') as HTMLInputElement).value).toBe('');
    });

    it('should emit filter-change event after clearing', () => {
      const eventPromise = new Promise<CustomEvent>((resolve) => {
        element.addEventListener('filter-change', (e) => resolve(e as CustomEvent), { once: true });
      });

      element.clearFilters();

      return eventPromise.then((event) => {
        expect(event.detail.timeMin).toBeNull();
        expect(event.detail.timeMax).toBeNull();
        expect(event.detail.canIds).toBeNull();
        expect(event.detail.messages).toBeNull();
      });
    });
  });

  describe('setFilterCount', () => {
    it('should update filter count display', () => {
      element.setFilterCount(50, 100);

      const count = element.querySelector('#filterCount');
      expect(count?.textContent).toBe('50 / 100');
    });
  });

  describe('filter-change event', () => {
    it('should emit event on input change', async () => {
      const eventPromise = new Promise<CustomEvent>((resolve) => {
        element.addEventListener('filter-change', (e) => resolve(e as CustomEvent), { once: true });
      });

      const input = element.querySelector('#filterCanId') as HTMLInputElement;
      input.value = '7DF';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      const event = await eventPromise;
      expect(event.detail.canIds).toEqual([0x7DF]);
    });

    it('should emit event when clear button is clicked', async () => {
      const eventPromise = new Promise<CustomEvent>((resolve) => {
        element.addEventListener('filter-change', (e) => resolve(e as CustomEvent), { once: true });
      });

      const clearBtn = element.querySelector('#clearFiltersBtn') as HTMLButtonElement;
      clearBtn.click();

      const event = await eventPromise;
      expect(event).toBeDefined();
    });
  });
});
