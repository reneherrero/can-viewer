/**
 * Nodes editor component for managing ECU/node names.
 */

import { createEvent, isValidDbcName } from './utils';
import styles from '../../../styles/can-viewer.css?inline';

export class NodesEditorElement extends HTMLElement {
  private nodes: string[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  setNodes(nodes: string[]) {
    this.nodes = [...nodes];
    this.render();
  }

  getNodes(): string[] {
    return this.nodes;
  }

  private render() {
    if (!this.shadowRoot) return;

    const nodeTags = this.nodes.map(node => `
      <span class="cv-node-tag">
        ${node}
        <button class="cv-node-remove" data-node="${node}">&times;</button>
      </span>
    `).join('');

    this.shadowRoot.innerHTML = `
      <style>${styles}
        :host { display: block; }
      </style>

      ${this.nodes.length === 0 ? `
        <p class="cv-empty-message" style="text-align: left; padding: 0; margin-bottom: 12px; font-style: italic;">No nodes defined. Add ECU/node names below.</p>
      ` : `
        <div class="cv-nodes-list">${nodeTags}</div>
      `}

      <div class="cv-add-node-form">
        <input type="text" class="cv-input" id="new-node-input" placeholder="Enter node name (e.g., ECM, TCM)">
        <button class="cv-btn primary" id="add-node-btn">Add Node</button>
      </div>
    `;

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.shadowRoot) return;

    // Remove node buttons
    this.shadowRoot.querySelectorAll('.cv-node-remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        const node = (btn as HTMLElement).dataset.node;
        if (node) {
          this.nodes = this.nodes.filter(n => n !== node);
          this.notifyChange();
          this.render();
        }
      });
    });

    // Add node form
    const input = this.shadowRoot.getElementById('new-node-input') as HTMLInputElement;
    const addBtn = this.shadowRoot.getElementById('add-node-btn');

    const addNode = () => {
      const name = input.value.trim();
      if (name && !this.nodes.includes(name)) {
        if (!isValidDbcName(name)) {
          alert('Node name must start with a letter or underscore and contain only alphanumeric characters and underscores.');
          return;
        }
        this.nodes.push(name);
        input.value = '';
        this.notifyChange();
        this.render();
      } else if (this.nodes.includes(name)) {
        alert(`Node "${name}" already exists.`);
      }
    };

    addBtn?.addEventListener('click', addNode);
    input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addNode();
      }
    });
  }

  private notifyChange() {
    this.dispatchEvent(createEvent('nodes-change', { nodes: this.nodes }));
  }
}

customElements.define('cv-nodes-editor', NodesEditorElement);
