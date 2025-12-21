import type {
  CanViewerApi,
  CanViewerConfig,
  CanFrame,
  DecodedSignal,
  DbcInfo,
} from './types';
import styles from '../styles/can-viewer.css?inline';

const defaultConfig: Required<CanViewerConfig> = {
  showDbcTab: true,
  showLiveTab: true,
  showMdf4Tab: true,
  initialTab: 'mdf4',
  autoScroll: true,
  maxFrames: 10000,
  maxSignals: 10000,
};

/** CAN Viewer Web Component */
export class CanViewerElement extends HTMLElement {
  private api: CanViewerApi | null = null;
  private config: Required<CanViewerConfig>;
  private shadow: ShadowRoot;

  // State
  private frames: CanFrame[] = [];
  private signals: DecodedSignal[] = [];
  private dbcInfo: DbcInfo | null = null;
  private dbcLoaded = false;
  private isCapturing = false;
  private activeTab = 'mdf4';
  private selectedMessageId: number | null = null;

  // DOM refs
  private elements: Record<string, HTMLElement> = {};

  // Event cleanup
  private unlisteners: (() => void)[] = [];

  constructor() {
    super();
    this.config = { ...defaultConfig };
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  /** Set the API implementation */
  setApi(api: CanViewerApi): void {
    this.api = api;
    this.setupEventListeners();
  }

  /** Update configuration */
  setConfig(config: Partial<CanViewerConfig>): void {
    this.config = { ...this.config, ...config };
    this.activeTab = this.config.initialTab;
    this.render();
  }

  connectedCallback(): void {
    this.render();
  }

  disconnectedCallback(): void {
    this.unlisteners.forEach(fn => fn());
    this.unlisteners = [];
  }

  private setupEventListeners(): void {
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

  private async loadInitialFiles(): Promise<void> {
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

  private render(): void {
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

  private cacheElements(): void {
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

  private bindEvents(): void {
    // Tab buttons
    this.shadow.querySelectorAll('.cv-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = (btn as HTMLElement).dataset.tab;
        if (tab) this.setActiveTab(tab);
      });
    });

    // DBC buttons
    this.elements.dbcStatusBtn?.addEventListener('click', () => this.setActiveTab('dbc'));
    this.elements.loadDbcBtnTab?.addEventListener('click', () => this.promptLoadDbc());
    this.elements.clearDbcBtn?.addEventListener('click', () => this.handleClearDbc());

    // MDF4 buttons
    this.elements.loadMdf4Btn?.addEventListener('click', () => this.promptLoadMdf4());
    this.elements.clearDataBtn?.addEventListener('click', () => this.clearAllData());
    this.elements.clearLiveDataBtn?.addEventListener('click', () => this.clearAllData());

    // Live capture
    this.elements.refreshInterfacesBtn?.addEventListener('click', () => this.loadInterfaces());
    this.elements.interfaceSelect?.addEventListener('change', () => this.updateCaptureButtons());
    this.elements.startCaptureBtn?.addEventListener('click', () => this.startCapture());
    this.elements.stopCaptureBtn?.addEventListener('click', () => this.stopCapture());

    // Scroll sync
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

  private setActiveTab(tab: string): void {
    this.activeTab = tab;

    // Update tab buttons
    this.shadow.querySelectorAll('.cv-tab-btn').forEach(btn => {
      btn.classList.toggle('active', (btn as HTMLElement).dataset.tab === tab);
    });

    // Update tab content
    this.shadow.querySelectorAll('.cv-tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `${tab}Tab`);
    });

    // Show/hide containers
    if (tab === 'dbc') {
      this.elements.tablesContainer?.classList.add('hidden');
      this.elements.dbcViewer?.classList.remove('hidden');
      this.loadDbcInfo();
    } else {
      this.elements.tablesContainer?.classList.remove('hidden');
      this.elements.dbcViewer?.classList.add('hidden');
    }

    // Load interfaces when switching to live tab
    if (tab === 'live') {
      this.loadInterfaces();
    }
  }

  private async promptLoadDbc(): Promise<void> {
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

  private async handleLoadDbc(path: string): Promise<void> {
    if (!this.api) return;

    try {
      const result = await this.api.loadDbc(path);
      const filename = path.split('/').pop()?.split('\\').pop() || path;
      this.updateDbcStatus(true, filename);
      this.showMessage(result);

      if (this.activeTab === 'dbc') {
        await this.loadDbcInfo();
      }

      // Re-decode existing frames
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

  private async handleClearDbc(): Promise<void> {
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

  private updateDbcStatus(loaded: boolean, filename = ''): void {
    this.dbcLoaded = loaded;
    const statusBtn = this.elements.dbcStatusBtn as HTMLButtonElement;
    const clearBtn = this.elements.clearDbcBtn as HTMLButtonElement;
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

  private async promptLoadMdf4(): Promise<void> {
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

  private async handleLoadMdf4(path: string): Promise<void> {
    if (!this.api) return;

    const btn = this.elements.loadMdf4Btn as HTMLButtonElement;
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

  private clearAllData(): void {
    this.frames = [];
    this.signals = [];
    this.renderFrames();
    this.renderSignals();
  }

  private async loadInterfaces(): Promise<void> {
    if (!this.api) return;

    try {
      const interfaces = await this.api.listCanInterfaces();
      const select = this.elements.interfaceSelect as HTMLSelectElement;
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

  private updateCaptureButtons(): void {
    const select = this.elements.interfaceSelect as HTMLSelectElement;
    const startBtn = this.elements.startCaptureBtn as HTMLButtonElement;

    if (startBtn && select) {
      startBtn.disabled = !select.value || this.isCapturing;
    }
  }

  private async startCapture(): Promise<void> {
    if (!this.api) return;

    const select = this.elements.interfaceSelect as HTMLSelectElement;
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

  private async stopCapture(): Promise<void> {
    if (!this.api) return;

    try {
      await this.api.stopCapture();
      this.updateCaptureStatus(false);
      this.showMessage('Capture stopped');
    } catch (err) {
      this.showMessage(String(err), 'error');
    }
  }

  private updateCaptureStatus(capturing: boolean): void {
    this.isCapturing = capturing;

    const dot = this.elements.statusDot;
    const text = this.elements.statusText;
    const startBtn = this.elements.startCaptureBtn as HTMLButtonElement;
    const stopBtn = this.elements.stopCaptureBtn as HTMLButtonElement;
    const select = this.elements.interfaceSelect as HTMLSelectElement;

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

  private async loadDbcInfo(): Promise<void> {
    if (!this.api) return;

    try {
      this.dbcInfo = await this.api.getDbcInfo();
      this.renderDbcMessages();
    } catch (err) {
      console.error('Failed to load DBC info:', err);
    }
  }

  private renderFrames(): void {
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

    if (count) {
      count.textContent = `${this.frames.length} frames`;
    }

    if (this.config.autoScroll && wrapper) {
      wrapper.scrollTop = wrapper.scrollHeight;
    }
  }

  private renderSignals(): void {
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

    if (count) {
      count.textContent = `${this.signals.length} signals`;
    }

    if (this.config.autoScroll && wrapper) {
      wrapper.scrollTop = wrapper.scrollHeight;
    }
  }

  private renderDbcMessages(): void {
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
          const id = parseInt((item as HTMLElement).dataset.id || '0');
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

  private renderDbcSignals(messageId: number): void {
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

  private formatCanId(id: number, isExtended: boolean): string {
    return isExtended
      ? id.toString(16).toUpperCase().padStart(8, '0')
      : id.toString(16).toUpperCase().padStart(3, '0');
  }

  private formatDataHex(data: number[]): string {
    return data.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');
  }

  private formatFlags(frame: CanFrame): string {
    const flags: string[] = [];
    if (frame.is_extended) flags.push('EXT');
    if (frame.is_remote) flags.push('RTR');
    return flags.join(', ') || '-';
  }

  private showMessage(text: string, type: 'success' | 'error' = 'success'): void {
    const msg = document.createElement('div');
    msg.className = `cv-message ${type}`;
    msg.textContent = text;
    this.shadow.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
  }
}

// Register the custom element
customElements.define('can-viewer', CanViewerElement);

export default CanViewerElement;
