/**
 * Messages list component for displaying CAN messages.
 */

import type { MessageDto } from './types';
import { createEvent, formatCanId } from './utils';
import { getBaseStyles, LIST_STYLES, combineStyles } from './shared-styles';

export class MessagesListElement extends HTMLElement {
  private messages: MessageDto[] = [];
  private selectedId: number | null = null;
  private selectedIsExtended = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  setMessages(messages: MessageDto[]) {
    this.messages = messages;
    this.render();
  }

  setSelected(id: number | null, isExtended: boolean) {
    this.selectedId = id;
    this.selectedIsExtended = isExtended;
    this.render();
  }

  private render() {
    if (!this.shadowRoot) return;

    const items = this.messages.map((msg) => {
      const isSelected = this.selectedId === msg.id && this.selectedIsExtended === msg.is_extended;
      const idHex = formatCanId(msg.id, msg.is_extended);
      const extBadge = msg.is_extended ? ' (Ext)' : '';

      return `
        <li class="de-list-item ${isSelected ? 'selected' : ''}"
            data-id="${msg.id}"
            data-extended="${msg.is_extended}">
          <span class="de-list-item-id">${idHex}${extBadge}</span>
          <div class="de-list-item-content">
            <div class="de-list-item-title">${msg.name || '(unnamed)'}</div>
            <div class="de-list-item-subtitle">
              DLC: ${msg.dlc} | ${msg.signals.length} signal${msg.signals.length !== 1 ? 's' : ''} | ${msg.sender}
            </div>
          </div>
        </li>
      `;
    }).join('');

    this.shadowRoot.innerHTML = `
      <style>${combineStyles(getBaseStyles(), LIST_STYLES)}</style>
      <ul class="de-list">${items}</ul>
    `;

    // Add click handlers
    this.shadowRoot.querySelectorAll('.de-list-item').forEach((item) => {
      item.addEventListener('click', () => {
        const id = parseInt((item as HTMLElement).dataset.id || '0', 10);
        const isExtended = (item as HTMLElement).dataset.extended === 'true';
        this.dispatchEvent(createEvent('message-select', { id, isExtended }));
      });
    });
  }
}

customElements.define('de-messages-list', MessagesListElement);
