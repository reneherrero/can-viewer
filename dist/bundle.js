// CAN Viewer - Bundled JavaScript (generated from TypeScript sources)
// This file is auto-generated for use without a build system

const styles = `/* CAN Viewer Component Styles */

:host {
  --cv-bg: #0a0a0a;
  --cv-bg-secondary: #111;
  --cv-bg-header: #1a1a1a;
  --cv-text: #ccc;
  --cv-text-muted: #666;
  --cv-text-dim: #444;
  --cv-border: #222;
  --cv-success: #22c55e;
  --cv-danger: #ef4444;
  --cv-warning: #f59e0b;
  --cv-accent: #3b82f6;

  display: block;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--cv-bg);
  color: var(--cv-text);
  color-scheme: dark;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.cv-container {
  max-width: 1800px;
  margin: 0 auto;
  padding: 20px;
}

/* Header */
.cv-header {
  background: var(--cv-bg-secondary);
  padding: 15px 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid var(--cv-border);
}

.cv-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.cv-title {
  font-size: 1.2rem;
  color: var(--cv-text-muted);
  font-weight: 500;
}

/* DBC Status Button */
.cv-dbc-status-btn {
  padding: 6px 12px;
  border: 1px solid var(--cv-border);
  border-radius: 3px;
  background: transparent;
  color: var(--cv-text-dim);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;
}

.cv-dbc-status-btn:hover {
  background: var(--cv-bg-header);
  color: var(--cv-text-muted);
  border-color: #333;
}

.cv-dbc-status-btn.loaded {
  color: var(--cv-success);
  border-color: rgba(34, 197, 94, 0.3);
}

.cv-dbc-status-btn.loaded:hover {
  background: rgba(34, 197, 94, 0.1);
}

/* Tabs */
.cv-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--cv-border);
  margin-bottom: 15px;
}

.cv-tab-btn {
  padding: 10px 20px;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--cv-text-muted);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.15s;
}

.cv-tab-btn:hover {
  color: var(--cv-text);
  background: var(--cv-bg-header);
}

.cv-tab-btn.active {
  color: var(--cv-accent);
  border-bottom-color: var(--cv-accent);
}

.cv-tab-content {
  display: none;
}

.cv-tab-content.active {
  display: block;
}

/* Controls */
.cv-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

.cv-control-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.cv-control-group label {
  font-size: 0.9rem;
  color: var(--cv-text-muted);
}

/* Buttons */
.cv-btn {
  padding: 6px 12px;
  border: 1px solid var(--cv-border);
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.15s;
  background: var(--cv-bg-secondary);
  color: var(--cv-text-muted);
}

.cv-btn:hover:not(:disabled) {
  background: var(--cv-bg-header);
  color: var(--cv-text);
}

.cv-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.cv-btn-primary {
  background: #333;
  color: var(--cv-text);
  border-color: #444;
}

.cv-btn-primary:hover:not(:disabled) {
  background: #444;
}

.cv-btn-success {
  background: var(--cv-success);
  color: #000;
  border-color: var(--cv-success);
}

.cv-btn-success:hover:not(:disabled) {
  filter: brightness(1.1);
}

.cv-btn-danger {
  background: var(--cv-danger);
  color: #fff;
  border-color: var(--cv-danger);
}

.cv-btn-danger:hover:not(:disabled) {
  filter: brightness(1.1);
}

/* Form elements */
.cv-select,
.cv-input {
  padding: 6px 10px;
  border: 1px solid var(--cv-border);
  border-radius: 3px;
  background: var(--cv-bg);
  color: var(--cv-text-muted);
  font-size: 0.8rem;
}

.cv-select:focus,
.cv-input:focus {
  outline: 1px solid #555;
  outline-offset: -1px;
}

/* Status indicator */
.cv-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--cv-text-muted);
}

.cv-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #333;
}

.cv-status-dot.connected {
  background: var(--cv-success);
  box-shadow: 0 0 6px var(--cv-success);
}

/* Tables container */
.cv-tables-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.cv-tables-container.with-signals {
  grid-template-columns: 1fr 1fr;
}

@media (max-width: 1200px) {
  .cv-tables-container.with-signals {
    grid-template-columns: 1fr;
  }
}

.cv-tables-container.hidden {
  display: none;
}

/* Table panel */
.cv-table-panel {
  background: var(--cv-bg-secondary);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--cv-border);
}

.cv-table-panel.hidden {
  display: none;
}

.cv-table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: var(--cv-bg-header);
  border-bottom: 1px solid var(--cv-border);
}

.cv-table-title {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--cv-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cv-table-info {
  font-size: 0.8rem;
  color: var(--cv-text-muted);
}

.cv-table-wrapper {
  height: 500px;
  overflow-y: auto;
}

/* Tables */
.cv-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.cv-table th {
  position: sticky;
  top: 0;
  background: var(--cv-bg-secondary);
  padding: 8px 12px;
  text-align: left;
  font-weight: 500;
  font-size: 0.75rem;
  color: var(--cv-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--cv-border);
}

.cv-table td {
  padding: 8px 12px;
  border-bottom: 1px solid var(--cv-border);
  font-family: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
  height: 36px;
  line-height: 20px;
}

.cv-table tr {
  height: 36px;
}

.cv-table tr:hover {
  background: var(--cv-bg-header);
}

.cv-timestamp {
  color: var(--cv-text-dim);
}

.cv-can-id {
  color: var(--cv-text);
  font-weight: 600;
}

.cv-hex-data {
  color: #888;
  letter-spacing: 1px;
}

.cv-signal-name {
  color: var(--cv-text);
}

.cv-physical-value {
  color: var(--cv-text);
  font-weight: 600;
}

.cv-unit {
  color: var(--cv-text-muted);
  font-style: italic;
}

/* DBC Viewer */
.cv-dbc-viewer {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  height: calc(100vh - 200px);
}

.cv-dbc-viewer.hidden {
  display: none;
}

.cv-dbc-messages-list {
  background: var(--cv-bg-secondary);
  border: 1px solid var(--cv-border);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.cv-dbc-messages-header {
  padding: 10px 16px;
  background: var(--cv-bg-header);
  border-bottom: 1px solid var(--cv-border);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--cv-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cv-dbc-messages-scroll {
  flex: 1;
  overflow-y: auto;
}

.cv-dbc-message-item {
  padding: 10px 16px;
  border-bottom: 1px solid var(--cv-border);
  cursor: pointer;
  transition: background 0.15s;
}

.cv-dbc-message-item:hover {
  background: var(--cv-bg-header);
}

.cv-dbc-message-item.selected {
  background: var(--cv-bg-header);
  border-left: 3px solid var(--cv-accent);
}

.cv-dbc-message-name {
  font-weight: 500;
  color: var(--cv-text);
  font-size: 0.9rem;
}

.cv-dbc-message-id {
  font-family: ui-monospace, monospace;
  color: var(--cv-text-muted);
  font-size: 0.8rem;
}

.cv-dbc-message-meta {
  font-size: 0.75rem;
  color: var(--cv-text-dim);
  margin-top: 2px;
}

.cv-dbc-details {
  background: var(--cv-bg-secondary);
  border: 1px solid var(--cv-border);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.cv-dbc-details-header {
  padding: 10px 16px;
  background: var(--cv-bg-header);
  border-bottom: 1px solid var(--cv-border);
}

.cv-dbc-details-title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--cv-text);
}

.cv-dbc-details-subtitle {
  font-size: 0.8rem;
  color: var(--cv-text-muted);
  margin-top: 4px;
}

.cv-dbc-details-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.cv-dbc-signal-card {
  background: var(--cv-bg);
  border: 1px solid var(--cv-border);
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 10px;
}

.cv-dbc-signal-name {
  font-weight: 500;
  color: var(--cv-text);
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.cv-dbc-signal-props {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
  font-size: 0.8rem;
}

.cv-dbc-signal-prop {
  display: flex;
  flex-direction: column;
}

.cv-dbc-signal-prop-label {
  color: var(--cv-text-dim);
  font-size: 0.7rem;
  text-transform: uppercase;
}

.cv-dbc-signal-prop-value {
  color: var(--cv-text-muted);
  font-family: ui-monospace, monospace;
}

.cv-dbc-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--cv-text-dim);
  font-size: 0.9rem;
}

.cv-dbc-no-file {
  text-align: center;
  padding: 40px;
  color: var(--cv-text-dim);
}

/* Toast messages */
.cv-message {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 4px;
  font-size: 0.9rem;
  animation: cv-slideIn 0.3s ease;
  z-index: 1000;
}

.cv-message.success {
  background: var(--cv-success);
  color: white;
}

.cv-message.error {
  background: var(--cv-danger);
  color: white;
}

@keyframes cv-slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
`;

// TauriApi class
class TauriApi {
  constructor() {
    this.invoke = async () => { throw new Error('Tauri not initialized'); };
    this.listen = async () => () => {};
    this.openDialog = async () => null;
  }

  async init() {
    const tauri = window.__TAURI__;
    if (!tauri) {
      throw new Error('Tauri API not available');
    }
    this.invoke = tauri.core.invoke;
    this.listen = tauri.event.listen;
    this.openDialog = tauri.dialog.open;
  }

  async loadDbc(path) {
    return await this.invoke('load_dbc', { path });
  }

  async clearDbc() {
    await this.invoke('clear_dbc');
  }

  async getDbcInfo() {
    return await this.invoke('get_dbc_info');
  }

  async decodeFrames(frames) {
    return await this.invoke('decode_frames', { frames });
  }

  async loadMdf4(path) {
    return await this.invoke('load_mdf4', { path });
  }

  async listCanInterfaces() {
    return await this.invoke('list_can_interfaces');
  }

  async startCapture(iface) {
    await this.invoke('start_capture', { interface: iface });
  }

  async stopCapture() {
    await this.invoke('stop_capture');
  }

  async getInitialFiles() {
    return await this.invoke('get_initial_files');
  }

  async openFileDialog(filters) {
    return await this.openDialog({ multiple: false, filters });
  }

  onCanFrame(callback) {
    let unlisten = null;
    this.listen('can-frame', (event) => {
      callback(event.payload);
    }).then((fn) => { unlisten = fn; });
    return () => { if (unlisten) unlisten(); };
  }

  onDecodedSignal(callback) {
    let unlisten = null;
    this.listen('decoded-signal', (event) => {
      callback(event.payload);
    }).then((fn) => { unlisten = fn; });
    return () => { if (unlisten) unlisten(); };
  }

  onCaptureError(callback) {
    let unlisten = null;
    this.listen('capture-error', (event) => {
      callback(event.payload);
    }).then((fn) => { unlisten = fn; });
    return () => { if (unlisten) unlisten(); };
  }
}

// CanViewerElement Web Component
const defaultConfig = {
  showDbcTab: true,
  showLiveTab: true,
  showMdf4Tab: true,
  initialTab: 'mdf4',
  autoScroll: true,
  maxFrames: 10000,
  maxSignals: 10000,
};

class CanViewerElement extends HTMLElement {
  constructor() {
    super();
    this.api = null;
    this.config = { ...defaultConfig };
    this.shadow = this.attachShadow({ mode: 'open' });
    this.frames = [];
    this.signals = [];
    this.dbcInfo = null;
    this.dbcLoaded = false;
    this.isCapturing = false;
    this.activeTab = 'mdf4';
    this.selectedMessageId = null;
    this.elements = {};
    this.unlisteners = [];
  }

  setApi(api) {
    this.api = api;
    this.setupEventListeners();
  }

  setConfig(config) {
    this.config = { ...this.config, ...config };
    this.activeTab = this.config.initialTab;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this.unlisteners.forEach(fn => fn());
    this.unlisteners = [];
  }

  setupEventListeners() {
    if (!this.api) return;

    this.unlisteners.push(
      this.api.onCanFrame((frame) => {
        this.frames.push(frame);
        if (this.frames.length > this.config.maxFrames) {
          this.frames = this.frames.slice(-Math.floor(this.config.maxFrames / 2));
        }
        this.renderFrames();
      })
    );

    this.unlisteners.push(
      this.api.onDecodedSignal((signal) => {
        this.signals.push(signal);
        if (this.signals.length > this.config.maxSignals) {
          this.signals = this.signals.slice(-Math.floor(this.config.maxSignals / 2));
        }
        this.renderSignals();
      })
    );

    this.unlisteners.push(
      this.api.onCaptureError((error) => {
        this.showMessage(error, 'error');
        this.updateCaptureStatus(false);
      })
    );

    this.loadInitialFiles();
  }

  async loadInitialFiles() {
    if (!this.api) return;
    try {
      const initial = await this.api.getInitialFiles();
      if (initial.dbc_path) {
        await this.handleLoadDbc(initial.dbc_path);
      }
      if (initial.mdf4_path) {
        await this.handleLoadMdf4(initial.mdf4_path);
      }
    } catch (err) {
      console.error('Failed to load initial files:', err);
    }
  }

  render() {
    this.shadow.innerHTML = `
      <style>${styles}</style>
      <div class="cv-container">
        <header class="cv-header">
          <div class="cv-header-top">
            <h1 class="cv-title">CAN Data Viewer</h1>
<button class="cv-dbc-status-btn" id="dbcStatusBtn">No DBC loaded</button>
          </div>

          <div class="cv-tabs">
            ${this.config.showMdf4Tab ? '<button class="cv-tab-btn" data-tab="mdf4">MDF4</button>' : ''}
            ${this.config.showLiveTab ? '<button class="cv-tab-btn" data-tab="live">Live Capture</button>' : ''}
            ${this.config.showDbcTab ? '<button class="cv-tab-btn" data-tab="dbc">DBC</button>' : ''}
          </div>

          <div id="mdf4Tab" class="cv-tab-content">
            <div class="cv-controls">
              <div class="cv-control-group">
                <button class="cv-btn cv-btn-primary" id="loadMdf4Btn">Load MDF4 File</button>
              </div>
              <div class="cv-control-group">
                <button class="cv-btn" id="clearDataBtn">Clear Data</button>
              </div>
            </div>
          </div>

          <div id="liveTab" class="cv-tab-content">
            <div class="cv-controls">
              <div class="cv-control-group">
                <label>Interface:</label>
                <select class="cv-select" id="interfaceSelect">
                  <option value="">Select CAN interface...</option>
                </select>
                <button class="cv-btn" id="refreshInterfacesBtn">↻</button>
              </div>
              <div class="cv-control-group">
                <button class="cv-btn cv-btn-success" id="startCaptureBtn" disabled>Start Capture</button>
                <button class="cv-btn cv-btn-danger" id="stopCaptureBtn" disabled>Stop Capture</button>
              </div>
              <div class="cv-control-group">
                <button class="cv-btn" id="clearLiveDataBtn">Clear Data</button>
              </div>
              <div class="cv-status">
                <span class="cv-status-dot" id="statusDot"></span>
                <span id="statusText">Idle</span>
              </div>
            </div>
          </div>

          <div id="dbcTab" class="cv-tab-content">
            <div class="cv-controls">
              <div class="cv-control-group">
                <button class="cv-btn cv-btn-primary" id="loadDbcBtnTab">Load DBC File</button>
                <button class="cv-btn" id="clearDbcBtn" disabled>Clear DBC</button>
              </div>
            </div>
          </div>
        </header>

        <div class="cv-tables-container" id="tablesContainer">
          <div class="cv-table-panel" id="framesPanel">
            <div class="cv-table-header">
              <span class="cv-table-title">Raw CAN Frames</span>
              <span class="cv-table-info" id="framesCount">0 frames</span>
            </div>
            <div class="cv-table-wrapper" id="framesTableWrapper">
              <table class="cv-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Channel</th>
                    <th>CAN ID</th>
                    <th>DLC</th>
                    <th>Data</th>
                    <th>Flags</th>
                  </tr>
                </thead>
                <tbody id="framesTableBody"></tbody>
              </table>
            </div>
          </div>

          <div class="cv-table-panel hidden" id="signalsPanel">
            <div class="cv-table-header">
              <span class="cv-table-title">Decoded Signals</span>
              <span class="cv-table-info" id="signalsCount">0 signals</span>
            </div>
            <div class="cv-table-wrapper" id="signalsTableWrapper">
              <table class="cv-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Message</th>
                    <th>Signal</th>
                    <th>Value</th>
                    <th>Unit</th>
                    <th>Raw</th>
                  </tr>
                </thead>
                <tbody id="signalsTableBody"></tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="cv-dbc-viewer hidden" id="dbcViewer">
          <div class="cv-dbc-messages-list">
            <div class="cv-dbc-messages-header">Messages</div>
            <div class="cv-dbc-messages-scroll" id="dbcMessagesList">
              <div class="cv-dbc-no-file">No DBC file loaded</div>
            </div>
          </div>
          <div class="cv-dbc-details">
            <div class="cv-dbc-details-header">
              <div class="cv-dbc-details-title" id="dbcDetailsTitle">Select a message</div>
              <div class="cv-dbc-details-subtitle" id="dbcDetailsSubtitle"></div>
            </div>
            <div class="cv-dbc-details-scroll" id="dbcDetailsContent">
              <div class="cv-dbc-empty">Select a message to view its signals</div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.cacheElements();
    this.bindEvents();
    this.setActiveTab(this.activeTab);
  }

  cacheElements() {
    const ids = [
      'dbcStatusBtn', 'clearDbcBtn', 'loadMdf4Btn', 'clearDataBtn',
      'interfaceSelect', 'refreshInterfacesBtn', 'startCaptureBtn', 'stopCaptureBtn',
      'clearLiveDataBtn', 'statusDot', 'statusText', 'tablesContainer', 'framesPanel',
      'signalsPanel', 'framesTableBody', 'signalsTableBody', 'framesCount', 'signalsCount',
      'framesTableWrapper', 'signalsTableWrapper', 'dbcViewer', 'dbcMessagesList',
      'dbcDetailsTitle', 'dbcDetailsSubtitle', 'dbcDetailsContent', 'loadDbcBtnTab',
    ];
    ids.forEach(id => {
      const el = this.shadow.getElementById(id);
      if (el) this.elements[id] = el;
    });
  }

  bindEvents() {
    this.shadow.querySelectorAll('.cv-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (tab) this.setActiveTab(tab);
      });
    });

    this.elements.dbcStatusBtn?.addEventListener('click', () => this.setActiveTab('dbc'));
    this.elements.loadDbcBtnTab?.addEventListener('click', () => this.promptLoadDbc());
    this.elements.clearDbcBtn?.addEventListener('click', () => this.handleClearDbc());

    this.elements.loadMdf4Btn?.addEventListener('click', () => this.promptLoadMdf4());
    this.elements.clearDataBtn?.addEventListener('click', () => this.clearAllData());
    this.elements.clearLiveDataBtn?.addEventListener('click', () => this.clearAllData());

    this.elements.refreshInterfacesBtn?.addEventListener('click', () => this.loadInterfaces());
    this.elements.interfaceSelect?.addEventListener('change', () => this.updateCaptureButtons());
    this.elements.startCaptureBtn?.addEventListener('click', () => this.startCapture());
    this.elements.stopCaptureBtn?.addEventListener('click', () => this.stopCapture());

    this.elements.framesTableWrapper?.addEventListener('scroll', () => {
      if (this.elements.signalsTableWrapper) {
        this.elements.signalsTableWrapper.scrollTop = this.elements.framesTableWrapper.scrollTop;
      }
    });
    this.elements.signalsTableWrapper?.addEventListener('scroll', () => {
      if (this.elements.framesTableWrapper) {
        this.elements.framesTableWrapper.scrollTop = this.elements.signalsTableWrapper.scrollTop;
      }
    });
  }

  setActiveTab(tab) {
    this.activeTab = tab;
    this.shadow.querySelectorAll('.cv-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    this.shadow.querySelectorAll('.cv-tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `${tab}Tab`);
    });

    if (tab === 'dbc') {
      this.elements.tablesContainer?.classList.add('hidden');
      this.elements.dbcViewer?.classList.remove('hidden');
      this.loadDbcInfo();
    } else {
      this.elements.tablesContainer?.classList.remove('hidden');
      this.elements.dbcViewer?.classList.add('hidden');
    }

    if (tab === 'live') {
      this.loadInterfaces();
    }
  }

  async promptLoadDbc() {
    if (!this.api) return;
    try {
      const path = await this.api.openFileDialog([
        { name: 'DBC Files', extensions: ['dbc'] }
      ]);
      if (path) {
        await this.handleLoadDbc(path);
      }
    } catch (err) {
      this.showMessage(String(err), 'error');
    }
  }

  async handleLoadDbc(path) {
    if (!this.api) return;
    try {
      const result = await this.api.loadDbc(path);
      const filename = path.split('/').pop().split('\\').pop();
      this.updateDbcStatus(true, filename);
      this.showMessage(result);

      if (this.activeTab === 'dbc') {
        await this.loadDbcInfo();
      }

      if (this.frames.length > 0) {
        this.signals = await this.api.decodeFrames(this.frames);
        this.renderSignals();
        if (this.signals.length > 0) {
          this.showMessage(`Decoded ${this.signals.length} signals`);
        }
      }
    } catch (err) {
      this.showMessage(String(err), 'error');
    }
  }

  async handleClearDbc() {
    if (!this.api) return;
    try {
      await this.api.clearDbc();
      this.updateDbcStatus(false);
      this.dbcInfo = null;
      this.selectedMessageId = null;
      if (this.activeTab === 'dbc') {
        this.renderDbcMessages();
      }
      this.showMessage('DBC cleared');
    } catch (err) {
      this.showMessage(String(err), 'error');
    }
  }

  updateDbcStatus(loaded, filename = '') {
    this.dbcLoaded = loaded;
    const statusBtn = this.elements.dbcStatusBtn;
    const clearBtn = this.elements.clearDbcBtn;
    const signalsPanel = this.elements.signalsPanel;
    const tablesContainer = this.elements.tablesContainer;

    if (statusBtn) {
      statusBtn.textContent = loaded ? `DBC: ${filename}` : 'No DBC loaded';
      statusBtn.classList.toggle('loaded', loaded);
    }
    if (clearBtn) {
      clearBtn.disabled = !loaded;
    }
    if (signalsPanel) {
      signalsPanel.classList.toggle('hidden', !loaded);
    }
    if (tablesContainer) {
      tablesContainer.classList.toggle('with-signals', loaded);
    }
  }

  async promptLoadMdf4() {
    if (!this.api) return;
    try {
      const path = await this.api.openFileDialog([
        { name: 'MDF4 Files', extensions: ['mf4', 'mdf', 'mdf4', 'MF4', 'MDF', 'MDF4'] }
      ]);
      if (path) {
        await this.handleLoadMdf4(path);
      }
    } catch (err) {
      this.showMessage(String(err), 'error');
    }
  }

  async handleLoadMdf4(path) {
    if (!this.api) return;
    const btn = this.elements.loadMdf4Btn;
    try {
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Loading...';
      }
      const [frames, signals] = await this.api.loadMdf4(path);
      this.frames = frames;
      this.signals = signals;
      this.renderFrames();
      this.renderSignals();
      this.showMessage(`Loaded ${frames.length} frames`);
    } catch (err) {
      this.showMessage(String(err), 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Load MDF4 File';
      }
    }
  }

  clearAllData() {
    this.frames = [];
    this.signals = [];
    this.renderFrames();
    this.renderSignals();
  }

  async loadInterfaces() {
    if (!this.api) return;
    try {
      const interfaces = await this.api.listCanInterfaces();
      const select = this.elements.interfaceSelect;
      if (select) {
        select.innerHTML = '<option value="">Select CAN interface...</option>';
        interfaces.forEach(iface => {
          const option = document.createElement('option');
          option.value = iface;
          option.textContent = iface;
          select.appendChild(option);
        });
      }
    } catch (err) {
      console.log('Could not load interfaces:', err);
    }
  }

  updateCaptureButtons() {
    const select = this.elements.interfaceSelect;
    const startBtn = this.elements.startCaptureBtn;
    if (startBtn && select) {
      startBtn.disabled = !select.value || this.isCapturing;
    }
  }

  async startCapture() {
    if (!this.api) return;
    const select = this.elements.interfaceSelect;
    const iface = select?.value;
    if (!iface) return;
    try {
      await this.api.startCapture(iface);
      this.updateCaptureStatus(true);
      this.showMessage(`Capturing on ${iface}`);
    } catch (err) {
      this.showMessage(String(err), 'error');
    }
  }

  async stopCapture() {
    if (!this.api) return;
    try {
      await this.api.stopCapture();
      this.updateCaptureStatus(false);
      this.showMessage('Capture stopped');
    } catch (err) {
      this.showMessage(String(err), 'error');
    }
  }

  updateCaptureStatus(capturing) {
    this.isCapturing = capturing;
    const dot = this.elements.statusDot;
    const text = this.elements.statusText;
    const startBtn = this.elements.startCaptureBtn;
    const stopBtn = this.elements.stopCaptureBtn;
    const select = this.elements.interfaceSelect;

    if (dot) dot.classList.toggle('connected', capturing);
    if (text) text.textContent = capturing ? 'Capturing...' : 'Idle';
    if (startBtn && select) startBtn.disabled = capturing || !select.value;
    if (stopBtn) stopBtn.disabled = !capturing;
  }

  async loadDbcInfo() {
    if (!this.api) return;
    try {
      this.dbcInfo = await this.api.getDbcInfo();
      this.renderDbcMessages();
    } catch (err) {
      console.error('Failed to load DBC info:', err);
    }
  }

  renderFrames() {
    const tbody = this.elements.framesTableBody;
    const count = this.elements.framesCount;
    const wrapper = this.elements.framesTableWrapper;

    if (tbody) {
      tbody.innerHTML = this.frames.map(frame => `
        <tr>
          <td class="cv-timestamp">${frame.timestamp.toFixed(6)}</td>
          <td>${frame.channel}</td>
          <td class="cv-can-id">${this.formatCanId(frame.can_id, frame.is_extended)}</td>
          <td>${frame.dlc}</td>
          <td class="cv-hex-data">${this.formatDataHex(frame.data)}</td>
          <td>${this.formatFlags(frame)}</td>
        </tr>
      `).join('');
    }
    if (count) count.textContent = `${this.frames.length} frames`;
    if (this.config.autoScroll && wrapper) wrapper.scrollTop = wrapper.scrollHeight;
  }

  renderSignals() {
    const tbody = this.elements.signalsTableBody;
    const count = this.elements.signalsCount;
    const wrapper = this.elements.signalsTableWrapper;

    if (tbody) {
      tbody.innerHTML = this.signals.map(sig => `
        <tr>
          <td class="cv-timestamp">${sig.timestamp.toFixed(6)}</td>
          <td>${sig.message_name}</td>
          <td class="cv-signal-name">${sig.signal_name}</td>
          <td class="cv-physical-value">${sig.value.toFixed(4)}</td>
          <td class="cv-unit">${sig.unit || '-'}</td>
          <td>${sig.raw_value}</td>
        </tr>
      `).join('');
    }
    if (count) count.textContent = `${this.signals.length} signals`;
    if (this.config.autoScroll && wrapper) wrapper.scrollTop = wrapper.scrollHeight;
  }

  renderDbcMessages() {
    const list = this.elements.dbcMessagesList;
    const title = this.elements.dbcDetailsTitle;
    const subtitle = this.elements.dbcDetailsSubtitle;
    const content = this.elements.dbcDetailsContent;

    if (!this.dbcInfo?.messages?.length) {
      if (list) list.innerHTML = '<div class="cv-dbc-no-file">No DBC file loaded</div>';
      if (title) title.textContent = 'Select a message';
      if (subtitle) subtitle.textContent = '';
      if (content) content.innerHTML = '<div class="cv-dbc-empty">Select a message to view its signals</div>';
      return;
    }

    if (list) {
      list.innerHTML = this.dbcInfo.messages.map(msg => `
        <div class="cv-dbc-message-item ${msg.id === this.selectedMessageId ? 'selected' : ''}" data-id="${msg.id}">
          <div class="cv-dbc-message-name">${msg.name}</div>
          <div class="cv-dbc-message-id">0x${msg.id.toString(16).toUpperCase()} (${msg.id})</div>
          <div class="cv-dbc-message-meta">DLC: ${msg.dlc} | ${msg.signals.length} signals${msg.sender ? ' | TX: ' + msg.sender : ''}</div>
        </div>
      `).join('');

      list.querySelectorAll('.cv-dbc-message-item').forEach(item => {
        item.addEventListener('click', () => {
          const id = parseInt(item.dataset.id || '0');
          this.selectedMessageId = id;
          this.renderDbcMessages();
          this.renderDbcSignals(id);
        });
      });
    }

    if (this.selectedMessageId !== null) {
      this.renderDbcSignals(this.selectedMessageId);
    }
  }

  renderDbcSignals(messageId) {
    const msg = this.dbcInfo?.messages.find(m => m.id === messageId);
    if (!msg) return;

    const title = this.elements.dbcDetailsTitle;
    const subtitle = this.elements.dbcDetailsSubtitle;
    const content = this.elements.dbcDetailsContent;

    if (title) title.textContent = msg.name;
    if (subtitle) subtitle.textContent = `ID: 0x${msg.id.toString(16).toUpperCase()} | DLC: ${msg.dlc}${msg.sender ? ' | TX: ' + msg.sender : ''}`;

    if (content) {
      if (msg.signals.length === 0) {
        content.innerHTML = '<div class="cv-dbc-empty">No signals defined for this message</div>';
        return;
      }

      content.innerHTML = msg.signals.map(sig => `
        <div class="cv-dbc-signal-card">
          <div class="cv-dbc-signal-name">${sig.name}</div>
          <div class="cv-dbc-signal-props">
            <div class="cv-dbc-signal-prop">
              <span class="cv-dbc-signal-prop-label">Start Bit</span>
              <span class="cv-dbc-signal-prop-value">${sig.start_bit}</span>
            </div>
            <div class="cv-dbc-signal-prop">
              <span class="cv-dbc-signal-prop-label">Length</span>
              <span class="cv-dbc-signal-prop-value">${sig.length} bits</span>
            </div>
            <div class="cv-dbc-signal-prop">
              <span class="cv-dbc-signal-prop-label">Factor</span>
              <span class="cv-dbc-signal-prop-value">${sig.factor}</span>
            </div>
            <div class="cv-dbc-signal-prop">
              <span class="cv-dbc-signal-prop-label">Offset</span>
              <span class="cv-dbc-signal-prop-value">${sig.offset}</span>
            </div>
            <div class="cv-dbc-signal-prop">
              <span class="cv-dbc-signal-prop-label">Min</span>
              <span class="cv-dbc-signal-prop-value">${sig.min}</span>
            </div>
            <div class="cv-dbc-signal-prop">
              <span class="cv-dbc-signal-prop-label">Max</span>
              <span class="cv-dbc-signal-prop-value">${sig.max}</span>
            </div>
            <div class="cv-dbc-signal-prop">
              <span class="cv-dbc-signal-prop-label">Unit</span>
              <span class="cv-dbc-signal-prop-value">${sig.unit || '-'}</span>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  formatCanId(id, isExtended) {
    return isExtended
      ? id.toString(16).toUpperCase().padStart(8, '0')
      : id.toString(16).toUpperCase().padStart(3, '0');
  }

  formatDataHex(data) {
    return data.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');
  }

  formatFlags(frame) {
    const flags = [];
    if (frame.is_extended) flags.push('EXT');
    if (frame.is_remote) flags.push('RTR');
    return flags.join(', ') || '-';
  }

  showMessage(text, type = 'success') {
    const msg = document.createElement('div');
    msg.className = `cv-message ${type}`;
    msg.textContent = text;
    this.shadow.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
  }
}

customElements.define('can-viewer', CanViewerElement);

// Initialize
async function main() {
  const api = new TauriApi();
  await api.init();
  const viewer = document.querySelector('can-viewer');
  if (viewer) {
    viewer.setApi(api);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
