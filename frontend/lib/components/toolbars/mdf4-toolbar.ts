/**
 * MDF4 Toolbar Component
 *
 * Toolbar for MDF4 Inspector tab with Open, Clear, and status indicator.
 * Subscribes to appStore for current MDF4 file.
 */

import { appStore } from '../../store';
import { createEvent, extractFilename } from '../../utils';

export class Mdf4ToolbarElement extends HTMLElement {
  private unsubscribeStore: (() => void) | null = null;

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.render();
    this.bindEvents();
    this.unsubscribeStore = appStore.subscribe(() => this.updateStatusUI());
  }

  disconnectedCallback(): void {
    this.unsubscribeStore?.();
  }

  private render(): void {
    this.className = 'cv-toolbar cv-tab-pane';
    this.id = 'mdf4Tab';
    this.innerHTML = `
      <button class="cv-btn primary" id="openBtn">Open</button>
      <button class="cv-btn" id="clearBtn">Clear</button>
      <span class="cv-status"><span class="cv-status-dot" id="statusDot"></span><span id="statusText">No file loaded</span></span>
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
    const mdf4File = appStore.get().mdf4File;

    dot?.classList.toggle('active', !!mdf4File);
    if (text) {
      text.textContent = mdf4File ? extractFilename(mdf4File) : 'No file loaded';
    }
  }
}

customElements.define('cv-mdf4-toolbar', Mdf4ToolbarElement);
