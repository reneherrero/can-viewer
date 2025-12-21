// CAN Viewer Bundle - Self-contained build
// Generated from TypeScript sources

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

.cv-table tr.clickable {
  cursor: pointer;
}

.cv-table tr.selected {
  background: #1e3a5f !important;
  border-left: 3px solid var(--cv-accent);
}

.cv-table tr.selected td {
  color: #fff;
}

.cv-timestamp {
  color: var(--cv-text-dim);
}

.cv-can-id {
  color: var(--cv-text);
  font-weight: 600;
}

.cv-message-name {
  color: var(--cv-accent);
  font-weight: 500;
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

.cv-unit-highlight {
  color: var(--cv-text);
  font-weight: 600;
}

.cv-signals-empty {
  color: var(--cv-text-dim);
  text-align: center;
  padding: 20px;
}

/* Filters */
.cv-filters {
  background: var(--cv-bg-secondary);
  border: 1px solid var(--cv-border);
  border-radius: 4px;
  margin-bottom: 20px;
  overflow: hidden;
}

.cv-filters.hidden {
  display: none;
}

.cv-filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: var(--cv-bg-header);
  border-bottom: 1px solid var(--cv-border);
}

.cv-filters-title {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--cv-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cv-filters-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cv-filters-inputs {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  padding: 12px 16px;
}

.cv-filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cv-filter-group label {
  font-size: 0.8rem;
  color: var(--cv-text-muted);
  white-space: nowrap;
}

.cv-filter-input {
  padding: 5px 8px;
  border: 1px solid var(--cv-border);
  border-radius: 3px;
  background: var(--cv-bg);
  color: var(--cv-text);
  font-size: 0.8rem;
  font-family: ui-monospace, monospace;
  width: 100px;
}

.cv-filter-input:focus {
  outline: 1px solid var(--cv-accent);
  outline-offset: -1px;
}

.cv-filter-input::placeholder {
  color: var(--cv-text-dim);
  opacity: 1;
}

.cv-filter-input:placeholder-shown {
  color: var(--cv-text-dim);
}

.cv-filter-input.wide {
  width: 150px;
}

.cv-filter-count {
  font-size: 0.75rem;
  color: var(--cv-text-muted);
  padding: 3px 8px;
  background: var(--cv-bg);
  border-radius: 3px;
}

.cv-filters-header .cv-btn {
  padding: 3px 10px;
  font-size: 0.75rem;
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

const defaultConfig = {
  showDbcTab: true,
  showLiveTab: true,
  showMdf4Tab: true,
  initialTab: 'mdf4',
  autoScroll: true,
  maxFrames: 10000,
  maxSignals: 10000,
};

/** CAN Viewer Web Component */
class CanViewerElement extends HTMLElement {
  constructor() {
    super();
    this.api = null;
    this.config = { ...defaultConfig };
    this.shadow = this.attachShadow({ mode: 'open' });

    // State
    this.frames = [];
    this.signals = [];
    this.dbcInfo = null;
    this.dbcLoaded = false;
    this.isCapturing = false;
    this.activeTab = 'mdf4';
    this.selectedMessageId = null;
    this.selectedFrameIndex = null;

    // Filter state
    this.filters = {
      timeMin: null,
      timeMax: null,
      canIds: null,
      messages: null
    };
    this.filteredFrames = [];

    // DOM refs
    this.elements = {};

    // Event cleanup
    this.unlisteners = [];
  }

  /** Set the API implementation */
  setApi(api) {
    this.api = api;
    this.setupEventListeners();
  }

  /** Update configuration */
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

    // Load initial files
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

        <div class="cv-filters" id="filtersSection">
          <div class="cv-filters-header">
            <span class="cv-filters-title">Filters</span>
            <div class="cv-filters-header-right">
              <span class="cv-filter-count" id="filterCount">0 / 0</span>
              <button class="cv-btn" id="clearFiltersBtn">Clear</button>
            </div>
          </div>
          <div class="cv-filters-inputs">
            <div class="cv-filter-group">
              <label>Time:</label>
              <input type="text" class="cv-filter-input" id="filterTimeMin" placeholder="min">
              <span style="color: var(--cv-text-dim)">-</span>
              <input type="text" class="cv-filter-input" id="filterTimeMax" placeholder="max">
            </div>
            <div class="cv-filter-group">
              <label>CAN ID:</label>
              <input type="text" class="cv-filter-input wide" id="filterCanId" placeholder="7DF, 7E8">
            </div>
            <div class="cv-filter-group">
              <label>Message:</label>
              <input type="text" class="cv-filter-input wide" id="filterMessage" placeholder="Engine, Speed">
            </div>
          </div>
        </div>

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
                    <th>Message</th>
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
                    <th>Signal</th>
                    <th>Value</th>
                    <th>Unit</th>
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
      'filtersSection', 'filterTimeMin', 'filterTimeMax', 'filterCanId', 'filterMessage',
      'filterCount', 'clearFiltersBtn',
    ];

    ids.forEach(id => {
      const el = this.shadow.getElementById(id);
      if (el) this.elements[id] = el;
    });
  }

  bindEvents() {
    // Tab buttons
    this.shadow.querySelectorAll('.cv-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (tab) this.setActiveTab(tab);
      });
    });

    // DBC buttons
    if (this.elements.dbcStatusBtn) {
      this.elements.dbcStatusBtn.addEventListener('click', () => this.setActiveTab('dbc'));
    }
    if (this.elements.loadDbcBtnTab) {
      this.elements.loadDbcBtnTab.addEventListener('click', () => this.promptLoadDbc());
    }
    if (this.elements.clearDbcBtn) {
      this.elements.clearDbcBtn.addEventListener('click', () => this.handleClearDbc());
    }

    // MDF4 buttons
    if (this.elements.loadMdf4Btn) {
      this.elements.loadMdf4Btn.addEventListener('click', () => this.promptLoadMdf4());
    }
    if (this.elements.clearDataBtn) {
      this.elements.clearDataBtn.addEventListener('click', () => this.clearAllData());
    }
    if (this.elements.clearLiveDataBtn) {
      this.elements.clearLiveDataBtn.addEventListener('click', () => this.clearAllData());
    }

    // Live capture
    if (this.elements.refreshInterfacesBtn) {
      this.elements.refreshInterfacesBtn.addEventListener('click', () => this.loadInterfaces());
    }
    if (this.elements.interfaceSelect) {
      this.elements.interfaceSelect.addEventListener('change', () => this.updateCaptureButtons());
    }
    if (this.elements.startCaptureBtn) {
      this.elements.startCaptureBtn.addEventListener('click', () => this.startCapture());
    }
    if (this.elements.stopCaptureBtn) {
      this.elements.stopCaptureBtn.addEventListener('click', () => this.stopCapture());
    }

    // Scroll sync
    if (this.elements.framesTableWrapper) {
      this.elements.framesTableWrapper.addEventListener('scroll', () => {
        if (this.elements.signalsTableWrapper) {
          this.elements.signalsTableWrapper.scrollTop = this.elements.framesTableWrapper.scrollTop;
        }
      });
    }
    if (this.elements.signalsTableWrapper) {
      this.elements.signalsTableWrapper.addEventListener('scroll', () => {
        if (this.elements.framesTableWrapper) {
          this.elements.framesTableWrapper.scrollTop = this.elements.signalsTableWrapper.scrollTop;
        }
      });
    }

    // Filter inputs
    const filterHandler = () => this.applyFilters();
    if (this.elements.filterTimeMin) {
      this.elements.filterTimeMin.addEventListener('input', filterHandler);
    }
    if (this.elements.filterTimeMax) {
      this.elements.filterTimeMax.addEventListener('input', filterHandler);
    }
    if (this.elements.filterCanId) {
      this.elements.filterCanId.addEventListener('input', filterHandler);
    }
    if (this.elements.filterMessage) {
      this.elements.filterMessage.addEventListener('input', filterHandler);
    }
    if (this.elements.clearFiltersBtn) {
      this.elements.clearFiltersBtn.addEventListener('click', () => this.clearFilters());
    }
  }

  setActiveTab(tab) {
    this.activeTab = tab;

    // Update tab buttons
    this.shadow.querySelectorAll('.cv-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Update tab content
    this.shadow.querySelectorAll('.cv-tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `${tab}Tab`);
    });

    // Show/hide containers
    if (tab === 'dbc') {
      if (this.elements.tablesContainer) this.elements.tablesContainer.classList.add('hidden');
      if (this.elements.filtersSection) this.elements.filtersSection.classList.add('hidden');
      if (this.elements.dbcViewer) this.elements.dbcViewer.classList.remove('hidden');
      this.loadDbcInfo();
    } else {
      if (this.elements.tablesContainer) this.elements.tablesContainer.classList.remove('hidden');
      if (this.elements.filtersSection) this.elements.filtersSection.classList.remove('hidden');
      if (this.elements.dbcViewer) this.elements.dbcViewer.classList.add('hidden');
    }

    // Load interfaces when switching to live tab
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
      const filename = path.split('/').pop()?.split('\\').pop() || path;
      this.updateDbcStatus(true, filename);
      this.showMessage(result);

      // Always load DBC info so we can show message names in frames table
      await this.loadDbcInfo();

      // Re-render frames to show message names
      this.renderFrames();

      // Re-decode selected frame if there is one
      if (this.selectedFrameIndex !== null) {
        await this.decodeSelectedFrame();
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

      const [frames, _signals] = await this.api.loadMdf4(path);
      this.frames = frames;
      this.signals = [];
      this.selectedFrameIndex = null;
      this.renderFrames();
      this.clearSignalsPanel();
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
    this.selectedFrameIndex = null;
    this.renderFrames();
    this.clearSignalsPanel();
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
      // Clear existing data for a clean start
      this.clearAllData();

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

    if (dot) {
      dot.classList.toggle('connected', capturing);
    }
    if (text) {
      text.textContent = capturing ? 'Capturing...' : 'Idle';
    }
    if (startBtn && select) {
      startBtn.disabled = capturing || !select.value;
    }
    if (stopBtn) {
      stopBtn.disabled = !capturing;
    }
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

  applyFilters() {
    // Read filter values
    const timeMinStr = this.elements.filterTimeMin?.value.trim() || '';
    const timeMaxStr = this.elements.filterTimeMax?.value.trim() || '';
    const canIdStr = this.elements.filterCanId?.value.trim() || '';
    const messageStr = this.elements.filterMessage?.value.trim().toLowerCase() || '';

    this.filters.timeMin = timeMinStr ? parseFloat(timeMinStr) : null;
    this.filters.timeMax = timeMaxStr ? parseFloat(timeMaxStr) : null;

    // Parse multiple CAN IDs (comma-separated)
    if (canIdStr) {
      this.filters.canIds = canIdStr.split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => parseInt(s, 16))
        .filter(n => !isNaN(n));
    } else {
      this.filters.canIds = null;
    }

    // Parse multiple message names (comma-separated)
    if (messageStr) {
      this.filters.messages = messageStr.split(',')
        .map(s => s.trim().toLowerCase())
        .filter(s => s.length > 0);
    } else {
      this.filters.messages = null;
    }

    this.selectedFrameIndex = null;
    this.renderFrames();
    this.clearSignalsPanel();
  }

  clearFilters() {
    if (this.elements.filterTimeMin) this.elements.filterTimeMin.value = '';
    if (this.elements.filterTimeMax) this.elements.filterTimeMax.value = '';
    if (this.elements.filterCanId) this.elements.filterCanId.value = '';
    if (this.elements.filterMessage) this.elements.filterMessage.value = '';

    this.filters = { timeMin: null, timeMax: null, canIds: null, messages: null };
    this.selectedFrameIndex = null;
    this.renderFrames();
    this.clearSignalsPanel();
  }

  getFilteredFrames() {
    return this.frames.filter(frame => {
      // Time filter
      if (this.filters.timeMin !== null && frame.timestamp < this.filters.timeMin) {
        return false;
      }
      if (this.filters.timeMax !== null && frame.timestamp > this.filters.timeMax) {
        return false;
      }

      // CAN ID filter (match any)
      if (this.filters.canIds && this.filters.canIds.length > 0) {
        if (!this.filters.canIds.includes(frame.can_id)) {
          return false;
        }
      }

      // Message name filter (match any)
      if (this.filters.messages && this.filters.messages.length > 0) {
        const msgName = this.getMessageName(frame.can_id).toLowerCase();
        const matches = this.filters.messages.some(m => msgName.includes(m));
        if (!matches) {
          return false;
        }
      }

      return true;
    });
  }

  getMessageName(canId) {
    if (!this.dbcInfo?.messages) return '-';
    const msg = this.dbcInfo.messages.find(m => m.id === canId);
    return msg ? msg.name : '-';
  }

  renderFrames() {
    const tbody = this.elements.framesTableBody;
    const count = this.elements.framesCount;
    const filterCount = this.elements.filterCount;
    const wrapper = this.elements.framesTableWrapper;

    // Get filtered frames
    this.filteredFrames = this.getFilteredFrames();

    if (tbody) {
      tbody.innerHTML = this.filteredFrames.map((frame, idx) => `
        <tr class="clickable ${idx === this.selectedFrameIndex ? 'selected' : ''}" data-index="${idx}">
          <td class="cv-timestamp">${frame.timestamp.toFixed(6)}</td>
          <td>${frame.channel}</td>
          <td class="cv-can-id">${this.formatCanId(frame.can_id, frame.is_extended)}</td>
          <td class="cv-message-name">${this.getMessageName(frame.can_id)}</td>
          <td>${frame.dlc}</td>
          <td class="cv-hex-data">${this.formatDataHex(frame.data)}</td>
          <td>${this.formatFlags(frame)}</td>
        </tr>
      `).join('');

      // Add click handlers for frame selection
      tbody.querySelectorAll('tr.clickable').forEach(row => {
        row.addEventListener('click', () => {
          const idx = parseInt(row.dataset.index || '0');
          this.selectFrame(idx);
        });
      });
    }

    if (count) {
      count.textContent = `${this.filteredFrames.length} frames`;
    }

    if (filterCount) {
      filterCount.textContent = `${this.filteredFrames.length} / ${this.frames.length}`;
    }

    if (this.config.autoScroll && wrapper) {
      wrapper.scrollTop = wrapper.scrollHeight;
    }
  }

  selectFrame(index) {
    this.selectedFrameIndex = index;

    // Update row highlighting
    const tbody = this.elements.framesTableBody;
    if (tbody) {
      tbody.querySelectorAll('tr').forEach((row, idx) => {
        row.classList.toggle('selected', idx === index);
      });
    }

    // Decode and display signals for selected frame
    this.decodeSelectedFrame();
  }

  async decodeSelectedFrame() {
    if (!this.api || !this.dbcLoaded || this.selectedFrameIndex === null) {
      this.clearSignalsPanel();
      return;
    }

    const frame = this.filteredFrames[this.selectedFrameIndex];
    if (!frame) {
      this.clearSignalsPanel();
      return;
    }

    try {
      const signals = await this.api.decodeFrames([frame]);
      this.signals = signals;
      this.renderSignals();
    } catch (err) {
      console.error('Failed to decode frame:', err);
      this.clearSignalsPanel();
    }
  }

  clearSignalsPanel() {
    const tbody = this.elements.signalsTableBody;
    const count = this.elements.signalsCount;

    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="3" class="cv-signals-empty">Select a frame to view decoded signals</td></tr>';
    }
    if (count) {
      count.textContent = 'Select a frame';
    }
  }

  renderSignals() {
    const tbody = this.elements.signalsTableBody;
    const count = this.elements.signalsCount;
    const wrapper = this.elements.signalsTableWrapper;

    if (tbody) {
      tbody.innerHTML = this.signals.map(sig => `
        <tr>
          <td class="cv-signal-name">${sig.signal_name}</td>
          <td class="cv-physical-value">${sig.value.toFixed(4)}</td>
          <td class="cv-unit-highlight">${sig.unit || '-'}</td>
        </tr>
      `).join('');
    }

    if (count) {
      count.textContent = `${this.signals.length} signals`;
    }

    if (this.config.autoScroll && wrapper) {
      wrapper.scrollTop = wrapper.scrollHeight;
    }
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

// Register the custom element
customElements.define('can-viewer', CanViewerElement);

/** Tauri API implementation for CAN Viewer */
class TauriApi {
  constructor() {
    // These will be initialized when Tauri is ready
    this.invoke = async () => { throw new Error('Tauri not initialized'); };
    this.listen = async () => () => {};
    this.openDialog = async () => null;
  }

  /** Initialize Tauri APIs - call this before using the API */
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
    return await this.openDialog({
      multiple: false,
      filters,
    });
  }

  onCanFrame(callback) {
    let unlisten = null;

    this.listen('can-frame', (event) => {
      callback(event.payload);
    }).then((fn) => {
      unlisten = fn;
    });

    return () => {
      if (unlisten) unlisten();
    };
  }

  onDecodedSignal(callback) {
    let unlisten = null;

    this.listen('decoded-signal', (event) => {
      callback(event.payload);
    }).then((fn) => {
      unlisten = fn;
    });

    return () => {
      if (unlisten) unlisten();
    };
  }

  onCaptureError(callback) {
    let unlisten = null;

    this.listen('capture-error', (event) => {
      callback(event.payload);
    }).then((fn) => {
      unlisten = fn;
    });

    return () => {
      if (unlisten) unlisten();
    };
  }
}

// Initialize and set up the CAN Viewer
async function main() {
  // Create the API
  const api = new TauriApi();
  await api.init();

  // Get the viewer element and set the API
  const viewer = document.querySelector('can-viewer');
  if (viewer) {
    viewer.setApi(api);
  }
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
