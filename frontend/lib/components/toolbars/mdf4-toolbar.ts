/**
 * MDF4 Toolbar Component
 *
 * Toolbar for MDF4 Inspector tab with Open, Clear, and status indicator.
 * Subscribes to mdf4:status-change events and emits button click events.
 */

import { events, type Mdf4StatusChangeEvent } from '../../events';
import { createEvent } from '../../utils';

export class Mdf4ToolbarElement extends HTMLElement {
  private loaded = false;
  private filename: string | null = null;

  // Bound handler for cleanup
  private handleStatusChange = (e: Mdf4StatusChangeEvent) => this.onStatusChange(e);

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.render();
    this.bindEvents();
    events.on('mdf4:status-change', this.handleStatusChange);
  }

  disconnectedCallback(): void {
    events.off('mdf4:status-change', this.handleStatusChange);
  }

  private onStatusChange(e: Mdf4StatusChangeEvent): void {
    this.loaded = e.loaded;
    this.filename = e.filename;
    this.updateStatusUI();
  }

  private render(): void {
    this.className = 'cv-toolbar';
    this.innerHTML = `
      <div class="cv-toolbar-group">
        <button class="cv-btn primary" id="openBtn">Open</button>
      </div>
      <div class="cv-toolbar-group">
        <button class="cv-btn" id="clearBtn">Clear Data</button>
      </div>
      <div class="cv-toolbar-group">
        <div class="cv-status">
          <span class="cv-status-dot" id="statusDot"></span>
          <span id="statusText">No file loaded</span>
        </div>
      </div>
    `;
  }

  private bindEvents(): void {
    this.querySelector('#openBtn')?.addEventListener('click', () => {
      this.dispatchEvent(createEvent('open', {}));
    });

    this.querySelector('#clearBtn')?.addEventListener('click', () => {
      this.dispatchEvent(createEvent('clear', {}));
    });
  }

  private updateStatusUI(): void {
    const dot = this.querySelector('#statusDot');
    const text = this.querySelector('#statusText');

    dot?.classList.toggle('active', this.loaded);
    if (text) {
      text.textContent = this.loaded && this.filename ? this.filename : 'No file loaded';
    }
  }
}

customElements.define('cv-mdf4-toolbar', Mdf4ToolbarElement);
