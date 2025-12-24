/**
 * Nodes editor component for managing ECU/node names.
 */

import { createEvent, isValidDbcName } from './utils';
import { getBaseStyles, BUTTON_STYLES, INPUT_STYLES, EMPTY_STATE_STYLES, combineStyles } from './shared-styles';

const NODE_STYLES = `
  .de-nodes-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }
  .de-node-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    background: var(--de-bg-tertiary);
    border: 1px solid var(--de-border);
    border-radius: 4px;
    font-size: 13px;
  }
  .de-node-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--de-text-muted);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .de-node-remove:hover {
    background: var(--de-danger);
    color: white;
  }
  .de-add-node-form {
    display: flex;
    gap: 8px;
  }
  .de-add-node-form .de-input {
    flex: 1;
  }
`;

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
      <span class="de-node-tag">
        ${node}
        <button class="de-node-remove" data-node="${node}">&times;</button>
      </span>
    `).join('');

    this.shadowRoot.innerHTML = `
      <style>${combineStyles(getBaseStyles(), BUTTON_STYLES, INPUT_STYLES, EMPTY_STATE_STYLES, NODE_STYLES)}</style>

      ${this.nodes.length === 0 ? `
        <p class="empty-message" style="text-align: left; padding: 0; margin-bottom: 12px; font-style: italic;">No nodes defined. Add ECU/node names below.</p>
      ` : `
        <div class="de-nodes-list">${nodeTags}</div>
      `}

      <div class="de-add-node-form">
        <input type="text" class="de-input" id="new-node-input" placeholder="Enter node name (e.g., ECM, TCM)">
        <button class="de-btn de-btn-primary" id="add-node-btn">Add Node</button>
      </div>
    `;

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.shadowRoot) return;

    // Remove node buttons
    this.shadowRoot.querySelectorAll('.de-node-remove').forEach((btn) => {
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

customElements.define('de-nodes-editor', NodesEditorElement);
