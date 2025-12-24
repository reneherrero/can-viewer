/**
 * Main DBC Editor Web Component for can-viewer.
 * Provides full editing capabilities for DBC files.
 */

import type { DbcDto } from './types';
import type { CanFrame } from '../../types';
import { createDefaultDbc, createDefaultMessage } from './types';
import { exportDbcToString, deepClone } from './utils';
import { events, emitDbcStateChange, type Mdf4LoadedEvent } from '../../events';
import './signals-table';
import './signal-editor';
import './messages-list';
import './message-editor';
import './nodes-editor';
import type { MessagesListElement } from './messages-list';
import type { MessageEditorElement } from './message-editor';
import type { NodesEditorElement } from './nodes-editor';

export interface DbcEditorApi {
  loadDbc(path: string): Promise<DbcDto>;
  saveDbcContent(path: string, content: string): Promise<void>;
  newDbc(): Promise<DbcDto>;
  getDbc(): Promise<DbcDto | null>;
  updateDbc(dbc: DbcDto): Promise<void>;
  getCurrentFile(): Promise<string | null>;
  isDirty(): Promise<boolean>;
  openFileDialog(): Promise<string | null>;
  saveFileDialog(defaultPath?: string): Promise<string | null>;
}

export class DbcEditorComponent extends HTMLElement {
  private api: DbcEditorApi | null = null;
  private dbc: DbcDto = createDefaultDbc();
  private currentFile: string | null = null;
  private isDirty = false;
  private selectedMessageId: number | null = null;
  private selectedMessageExtended = false;
  private isAddingMessage = false;
  private activeTab: 'nodes' | 'messages' | 'preview' = 'messages';
  private isEditMode = false;
  private dbcBeforeEdit: DbcDto | null = null;
  private frames: CanFrame[] = [];

  // Bound event handler for cleanup
  private handleMdf4Loaded = (event: Mdf4LoadedEvent) => this.onMdf4Loaded(event);

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    events.on('mdf4:loaded', this.handleMdf4Loaded);
  }

  disconnectedCallback() {
    events.off('mdf4:loaded', this.handleMdf4Loaded);
  }

  /** Handle MDF4 loaded event - store frames for DLC detection */
  private onMdf4Loaded(event: Mdf4LoadedEvent): void {
    this.frames = event.frames;
  }

  setApi(api: DbcEditorApi) {
    this.api = api;
    this.loadInitialState();
  }

  /** Set loaded frames for DLC auto-detection when creating new messages */
  setFrames(frames: CanFrame[]) {
    this.frames = frames;
  }

  getDbc(): DbcDto {
    return this.dbc;
  }

  hasUnsavedChanges(): boolean {
    return this.isDirty;
  }

  private emitStateChange(): void {
    emitDbcStateChange({
      isDirty: this.isDirty,
      isEditing: this.isEditMode,
      currentFile: this.currentFile,
      messageCount: this.dbc.messages.length,
    });
  }

  async loadFile(path: string): Promise<void> {
    if (!this.api) return;
    try {
      this.dbc = await this.api.loadDbc(path);
      this.currentFile = path;
      this.isDirty = false;
      this.selectedMessageId = null;
      this.isAddingMessage = false;
      this.render();
      this.emitStateChange();
      this.showToast('File loaded successfully', 'success');
    } catch (e) {
      this.showToast(`Failed to load file: ${e}`, 'error');
    }
  }

  private async loadInitialState() {
    if (!this.api) return;
    try {
      const dbc = await this.api.getDbc();
      if (dbc) {
        this.dbc = dbc;
        this.currentFile = await this.api.getCurrentFile();
        this.isDirty = await this.api.isDirty();
        this.render();
      }
    } catch {
      // No initial state, that's fine
    }
  }

  private render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>

      <div class="de-container">
        <div class="de-header">
          <div class="de-tabs">
            <button class="de-tab ${this.activeTab === 'messages' ? 'active' : ''}" data-tab="messages">
              Messages (${this.dbc.messages.length})
            </button>
            <button class="de-tab ${this.activeTab === 'nodes' ? 'active' : ''}" data-tab="nodes">
              Nodes (${this.dbc.nodes.length})
            </button>
            <button class="de-tab ${this.activeTab === 'preview' ? 'active' : ''}" data-tab="preview">
              Preview
            </button>
          </div>
        </div>

        <div class="de-main">
          ${this.activeTab === 'messages' ? this.renderMessagesTab() : ''}
          ${this.activeTab === 'nodes' ? this.renderNodesTab() : ''}
          ${this.activeTab === 'preview' ? this.renderPreviewTab() : ''}
        </div>
      </div>
    `;

    this.setupEventListeners();
    this.updateChildComponents();
  }

  private renderMessagesTab(): string {
    const selectedMessage = this.isAddingMessage
      ? null
      : this.dbc.messages.find(
          m => m.id === this.selectedMessageId && m.is_extended === this.selectedMessageExtended
        );

    return `
      <div class="de-sidebar">
        <div class="de-sidebar-header">
          <span class="de-sidebar-title">Messages</span>
          ${this.isEditMode ? `<button class="de-btn de-btn-primary de-btn-small" id="add-message-btn">+ Add</button>` : ''}
        </div>
        <div class="de-sidebar-content">
          <de-messages-list></de-messages-list>
        </div>
      </div>

      <div class="de-detail">
        ${this.isAddingMessage || selectedMessage ? `
          <de-message-editor data-edit-mode="${this.isEditMode}"></de-message-editor>
        ` : `
          <div class="de-empty-state">
            <div class="de-empty-state-title">No Message Selected</div>
            <p>Select a message from the list to ${this.isEditMode ? 'edit it, or click "Add" to create a new one' : 'view its details'}.</p>
          </div>
        `}
      </div>
    `;
  }

  private renderNodesTab(): string {
    return `
      <div class="de-detail de-detail-centered">
        <div class="de-detail-header">
          <span class="de-detail-title">ECU/Node Names</span>
        </div>
        <div class="de-detail-content">
          <p class="de-help-text">
            Define the ECU and node names used in this DBC file. These can be used as message senders and signal receivers.
          </p>
          <de-nodes-editor></de-nodes-editor>

          <div class="de-form-group">
            <label class="de-label">DBC Version</label>
            <input type="text" class="de-input de-input-short" id="dbc-version"
                   value="${this.dbc.version || ''}"
                   placeholder="e.g., 1.0">
          </div>
        </div>
      </div>
    `;
  }

  private renderPreviewTab(): string {
    const dbcContent = exportDbcToString(this.dbc);
    return `
      <div class="de-detail de-preview-panel">
        <div class="de-detail-header">
          <span class="de-detail-title">DBC File Preview</span>
        </div>
        <div class="de-preview-content">
          <pre class="de-preview-text">${this.escapeHtml(dbcContent)}</pre>
        </div>
      </div>
    `;
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private setupEventListeners() {
    if (!this.shadowRoot) return;

    // Tabs
    this.shadowRoot.querySelectorAll('.de-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.activeTab = (tab as HTMLElement).dataset.tab as typeof this.activeTab;
        this.render();
      });
    });

    // Messages tab
    this.shadowRoot.getElementById('add-message-btn')?.addEventListener('click', () => {
      this.isAddingMessage = true;
      this.selectedMessageId = null;
      this.render();
    });

    // Message list selection
    const messagesList = this.shadowRoot.querySelector('de-messages-list');
    messagesList?.addEventListener('message-select', ((e: CustomEvent) => {
      this.selectedMessageId = e.detail.id;
      this.selectedMessageExtended = e.detail.isExtended;
      this.isAddingMessage = false;
      this.render();
    }) as EventListener);

    // Message editor events
    const messageEditor = this.shadowRoot.querySelector('de-message-editor');
    messageEditor?.addEventListener('message-edit-done', (() => {
      this.handleSaveMessage();
    }) as EventListener);

    messageEditor?.addEventListener('message-delete-request', (() => {
      this.handleDeleteMessage();
    }) as EventListener);

    messageEditor?.addEventListener('message-edit-cancel', (() => {
      this.isAddingMessage = false;
      this.selectedMessageId = null;
      this.render();
    }) as EventListener);

    // Listen for signal changes (triggers isDirty without requiring message Done click)
    messageEditor?.addEventListener('message-change', ((e: Event) => {
      const customEvent = e as CustomEvent;
      const idx = this.dbc.messages.findIndex(
        m => m.id === this.selectedMessageId && m.is_extended === this.selectedMessageExtended
      );
      if (idx >= 0) {
        this.dbc.messages[idx] = customEvent.detail;
        this.isDirty = true;
        this.syncToBackend();
        this.emitStateChange();
      }
    }) as EventListener);

    // Nodes tab
    const nodesEditor = this.shadowRoot.querySelector('de-nodes-editor');
    nodesEditor?.addEventListener('nodes-change', ((e: Event) => {
      const customEvent = e as CustomEvent;
      this.dbc.nodes = customEvent.detail.nodes;
      this.isDirty = true;
      this.syncToBackend();
      this.emitStateChange();
      this.render();
    }) as EventListener);

    // Version input
    const versionInput = this.shadowRoot.getElementById('dbc-version') as HTMLInputElement;
    versionInput?.addEventListener('input', async () => {
      this.dbc.version = versionInput.value || null;
      this.isDirty = true;
      await this.syncToBackend();
      this.emitStateChange();
    });
  }

  private updateChildComponents() {
    if (!this.shadowRoot) return;

    // Messages list
    const messagesList = this.shadowRoot.querySelector('de-messages-list') as MessagesListElement;
    if (messagesList) {
      messagesList.setMessages(this.dbc.messages);
      messagesList.setSelected(this.selectedMessageId, this.selectedMessageExtended);
    }

    // Message editor
    const messageEditor = this.shadowRoot.querySelector('de-message-editor') as MessageEditorElement;
    if (messageEditor) {
      const selectedMessage = this.isAddingMessage
        ? createDefaultMessage()
        : this.dbc.messages.find(
            m => m.id === this.selectedMessageId && m.is_extended === this.selectedMessageExtended
          ) || null;
      messageEditor.setMessage(selectedMessage, this.isAddingMessage);
      messageEditor.setAvailableNodes(this.dbc.nodes);
      messageEditor.setFrames(this.frames);
    }

    // Nodes editor
    const nodesEditor = this.shadowRoot.querySelector('de-nodes-editor') as NodesEditorElement;
    if (nodesEditor) {
      nodesEditor.setNodes(this.dbc.nodes);
    }
  }

  // Public methods for external control
  setEditMode(editing: boolean): void {
    if (editing && !this.isEditMode) {
      // Entering edit mode - store current state for potential cancel
      this.dbcBeforeEdit = deepClone(this.dbc);
    }
    this.isEditMode = editing;
    if (!editing) {
      this.isAddingMessage = false;
      this.dbcBeforeEdit = null;
    }
    this.render();
    this.emitStateChange();
  }

  cancelEdit(): void {
    if (this.dbcBeforeEdit) {
      this.dbc = this.dbcBeforeEdit;
      this.dbcBeforeEdit = null;
      this.isDirty = false;
      this.syncToBackend();
    }
    this.isEditMode = false;
    this.isAddingMessage = false;
    this.selectedMessageId = null;
    this.render();
    this.emitStateChange();
  }

  getEditMode(): boolean {
    return this.isEditMode;
  }

  getIsDirty(): boolean {
    return this.isDirty;
  }

  getCurrentFile(): string | null {
    return this.currentFile;
  }

  getMessageCount(): number {
    return this.dbc.messages.length;
  }

  async handleNew() {
    if (this.isDirty) {
      if (!confirm('You have unsaved changes. Create a new file anyway?')) {
        return;
      }
    }

    if (this.api) {
      try {
        this.dbc = await this.api.newDbc();
        this.currentFile = null;
        this.isDirty = false;
        this.selectedMessageId = null;
        this.isAddingMessage = false;
        this.render();
        this.emitStateChange();
        this.showToast('New DBC created', 'success');
      } catch (e) {
        this.showToast(`Failed to create new DBC: ${e}`, 'error');
      }
    } else {
      this.dbc = createDefaultDbc();
      this.currentFile = null;
      this.isDirty = false;
      this.selectedMessageId = null;
      this.isAddingMessage = false;
      this.render();
      this.emitStateChange();
    }
  }

  async handleOpen() {
    if (!this.api) return;

    if (this.isDirty) {
      if (!confirm('You have unsaved changes. Open a different file anyway?')) {
        return;
      }
    }

    try {
      const path = await this.api.openFileDialog();
      if (path) {
        await this.loadFile(path);
      }
    } catch (e) {
      this.showToast(`Failed to open file: ${e}`, 'error');
    }
  }

  async handleSave() {
    if (!this.api) return;

    if (this.currentFile) {
      await this.saveToPath(this.currentFile);
    } else {
      await this.handleSaveAs();
    }
  }

  async handleSaveAs() {
    if (!this.api) return;

    try {
      const path = await this.api.saveFileDialog(this.currentFile || undefined);
      if (path) {
        await this.saveToPath(path);
      }
    } catch (e) {
      this.showToast(`Failed to save file: ${e}`, 'error');
    }
  }

  private async saveToPath(path: string) {
    if (!this.api) return;

    try {
      const content = exportDbcToString(this.dbc);
      await this.api.saveDbcContent(path, content);
      // Reload the DBC in the backend so MDF4/Live Capture use the new version for decoding
      await this.api.loadDbc(path);
      this.currentFile = path;
      this.isDirty = false;
      // Clear edit state since we've saved and synced
      this.isEditMode = false;
      this.isAddingMessage = false;
      this.dbcBeforeEdit = null;
      this.render();
      this.emitStateChange();
      this.showToast('File saved successfully', 'success');
    } catch (e) {
      this.showToast(`Failed to save file: ${e}`, 'error');
    }
  }

  private async handleSaveMessage() {
    const messageEditor = this.shadowRoot?.querySelector('de-message-editor') as MessageEditorElement;
    if (!messageEditor) return;

    const message = messageEditor.getMessage();

    if (!message.name) {
      this.showToast('Message name is required', 'error');
      return;
    }

    if (this.isAddingMessage) {
      // Check for duplicate
      if (this.dbc.messages.some(m => m.id === message.id && m.is_extended === message.is_extended)) {
        this.showToast(`Message with ID ${message.id} already exists`, 'error');
        return;
      }
      this.dbc.messages.push(message);
      this.selectedMessageId = message.id;
      this.selectedMessageExtended = message.is_extended;
    } else {
      // Update existing
      const idx = this.dbc.messages.findIndex(
        m => m.id === this.selectedMessageId && m.is_extended === this.selectedMessageExtended
      );
      if (idx >= 0) {
        // Check if changing ID would create duplicate
        if ((message.id !== this.selectedMessageId || message.is_extended !== this.selectedMessageExtended) &&
            this.dbc.messages.some(m => m.id === message.id && m.is_extended === message.is_extended)) {
          this.showToast(`Message with ID ${message.id} already exists`, 'error');
          return;
        }
        this.dbc.messages[idx] = message;
        this.selectedMessageId = message.id;
        this.selectedMessageExtended = message.is_extended;
      }
    }

    this.isDirty = true;
    this.isAddingMessage = false;
    await this.syncToBackend();
    this.render();
    this.emitStateChange();
    this.showToast('Message saved', 'success');
  }

  private async handleDeleteMessage() {
    if (this.selectedMessageId === null) return;

    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    this.dbc.messages = this.dbc.messages.filter(
      m => !(m.id === this.selectedMessageId && m.is_extended === this.selectedMessageExtended)
    );

    this.selectedMessageId = null;
    this.isDirty = true;
    await this.syncToBackend();
    this.render();
    this.emitStateChange();
    this.showToast('Message deleted', 'success');
  }

  private async syncToBackend() {
    if (!this.api) return;

    try {
      await this.api.updateDbc(this.dbc);
    } catch (e) {
      console.error('Failed to sync to backend:', e);
    }
  }

  private showToast(message: string, type: 'success' | 'error') {
    const toast = document.createElement('div');
    toast.className = `de-toast ${type}`;
    toast.textContent = message;
    this.shadowRoot?.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  private getStyles(): string {
    return `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        --de-bg: #0a0a0a;
        --de-bg-secondary: #111;
        --de-bg-header: #1a1a1a;
        --de-text: #ccc;
        --de-text-muted: #666;
        --de-text-dim: #444;
        --de-border: #222;
        --de-accent: #3b82f6;
        --de-success: #22c55e;
        --de-danger: #ef4444;
        --de-warning: #f59e0b;
        --de-font-mono: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
      }

      .de-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--de-bg-secondary);
        color: var(--de-text);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
      }

      .de-header {
        border-bottom: 1px solid var(--de-border);
        background: var(--de-bg-secondary);
      }

      .de-btn {
        padding: 6px 12px;
        border: 1px solid var(--de-border);
        border-radius: 3px;
        background: var(--de-bg-secondary);
        color: var(--de-text-muted);
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.15s;
      }

      .de-btn:hover:not(:disabled) {
        background: var(--de-bg-header);
        color: var(--de-text);
      }

      .de-btn-primary {
        background: var(--de-accent);
        color: white;
        border-color: var(--de-accent);
      }

      .de-btn-primary:hover:not(:disabled) {
        background: #2563eb;
        border-color: #2563eb;
      }

      .de-btn:disabled {
        display: none;
      }

      .de-btn-small {
        padding: 4px 8px;
        font-size: 0.75rem;
      }

      .de-tabs {
        display: flex;
        gap: 0;
      }

      .de-tab {
        padding: 10px 20px;
        border: none;
        border-bottom: 2px solid transparent;
        background: transparent;
        color: var(--de-text-muted);
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s;
      }

      .de-tab:hover {
        color: var(--de-text);
        background: var(--de-bg-header);
      }

      .de-tab.active {
        color: var(--de-accent);
        border-bottom-color: var(--de-accent);
      }

      .de-main {
        display: flex;
        flex: 1;
        overflow: hidden;
        background: var(--de-bg);
      }

      .de-sidebar {
        width: 300px;
        min-width: 280px;
        display: flex;
        flex-direction: column;
        background: var(--de-bg-secondary);
        box-shadow: 0 0 0 1px var(--de-border);
        border-radius: 4px;
        margin: 16px 0 16px 16px;
        overflow: hidden;
      }

      .de-sidebar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        background: var(--de-bg-header);
        border-bottom: 1px solid var(--de-border);
      }

      .de-sidebar-title {
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--de-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .de-sidebar-content {
        flex: 1;
        overflow-y: auto;
      }

      .de-detail {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        margin: 16px;
        background: var(--de-bg-secondary);
        box-shadow: 0 0 0 1px var(--de-border);
        border-radius: 4px;
      }

      .de-detail-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        background: var(--de-bg-header);
        border-bottom: 1px solid var(--de-border);
        border-radius: 4px 4px 0 0;
      }

      .de-detail-title {
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--de-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .de-detail-content {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
      }

      .de-empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--de-text-dim);
        text-align: center;
        padding: 32px;
      }

      .de-empty-state-title {
        font-size: 1rem;
        font-weight: 500;
        margin-bottom: 8px;
        color: var(--de-text-muted);
      }

      .de-input {
        width: 100%;
        padding: 6px 10px;
        border: 1px solid var(--de-border);
        border-radius: 3px;
        background: var(--de-bg);
        color: var(--de-text-muted);
        font-size: 0.8rem;
        font-family: inherit;
        box-sizing: border-box;
      }

      .de-input:focus {
        outline: 1px solid #555;
        outline-offset: -1px;
      }

      .de-toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        font-size: 0.9rem;
        animation: slideIn 0.3s ease;
        z-index: 1000;
      }

      .de-toast.success {
        background: var(--de-success);
        color: white;
      }

      .de-toast.error {
        background: var(--de-danger);
        color: white;
      }

      .de-detail-centered {
        max-width: 600px;
        margin: 16px auto;
      }

      .de-help-text {
        color: var(--de-text-dim);
        font-size: 0.85rem;
        margin-bottom: 16px;
        line-height: 1.5;
      }

      .de-form-group {
        margin-top: 24px;
      }

      .de-label {
        display: block;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--de-text-dim);
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .de-input-short {
        max-width: 200px;
      }

      .de-preview-panel {
        flex: 1;
        margin: 16px;
      }

      .de-preview-content {
        flex: 1;
        overflow: auto;
        padding: 0;
        background: var(--de-bg);
      }

      .de-preview-text {
        margin: 0;
        padding: 16px;
        font-family: var(--de-font-mono);
        font-size: 12px;
        line-height: 1.5;
        color: var(--de-text);
        white-space: pre;
        overflow-x: auto;
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .de-sidebar-content::-webkit-scrollbar,
      .de-detail::-webkit-scrollbar {
        width: 8px;
      }

      .de-sidebar-content::-webkit-scrollbar-track,
      .de-detail::-webkit-scrollbar-track {
        background: var(--de-bg);
      }

      .de-sidebar-content::-webkit-scrollbar-thumb,
      .de-detail::-webkit-scrollbar-thumb {
        background: var(--de-border);
        border-radius: 4px;
      }

      .de-sidebar-content::-webkit-scrollbar-thumb:hover,
      .de-detail::-webkit-scrollbar-thumb:hover {
        background: var(--de-text-muted);
      }
    `;
  }
}

customElements.define('cv-dbc-editor', DbcEditorComponent);
