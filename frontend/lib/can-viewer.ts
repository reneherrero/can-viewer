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

interface Filters {
  timeMin: number | null;
  timeMax: number | null;
  canIds: number[] | null;
  messages: string[] | null;
}

/** CAN Viewer Web Component */
export class CanViewerElement extends HTMLElement {
  private api: CanViewerApi | null = null;
  private config: Required<CanViewerConfig>;
  private shadow: ShadowRoot;

  // State
  private frames: CanFrame[] = [];
  private filteredFrames: CanFrame[] = [];
  private signals: DecodedSignal[] = [];
  private dbcInfo: DbcInfo | null = null;
  private dbcLoaded = false;
  private isCapturing = false;
  private activeTab = 'mdf4';
  private selectedMessageId: number | null = null;
  private selectedFrameIndex: number | null = null;

  // Filter state
  private filters: Filters = {
    timeMin: null,
    timeMax: null,
    canIds: null,
    messages: null
  };

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

  private cacheElements(): void {
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

    // Filter inputs
    const filterHandler = () => this.applyFilters();
    this.elements.filterTimeMin?.addEventListener('input', filterHandler);
    this.elements.filterTimeMax?.addEventListener('input', filterHandler);
    this.elements.filterCanId?.addEventListener('input', filterHandler);
    this.elements.filterMessage?.addEventListener('input', filterHandler);
    this.elements.clearFiltersBtn?.addEventListener('click', () => this.clearFilters());
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
      this.elements.filtersSection?.classList.add('hidden');
      this.elements.dbcViewer?.classList.remove('hidden');
      this.loadDbcInfo();
    } else {
      this.elements.tablesContainer?.classList.remove('hidden');
      this.elements.filtersSection?.classList.remove('hidden');
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

  private clearAllData(): void {
    this.frames = [];
    this.signals = [];
    this.selectedFrameIndex = null;
    this.renderFrames();
    this.clearSignalsPanel();
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
      // Clear existing data for a clean start
      this.clearAllData();

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

  private applyFilters(): void {
    // Read filter values
    const timeMinStr = (this.elements.filterTimeMin as HTMLInputElement)?.value.trim() || '';
    const timeMaxStr = (this.elements.filterTimeMax as HTMLInputElement)?.value.trim() || '';
    const canIdStr = (this.elements.filterCanId as HTMLInputElement)?.value.trim() || '';
    const messageStr = (this.elements.filterMessage as HTMLInputElement)?.value.trim().toLowerCase() || '';

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

  private clearFilters(): void {
    const filterTimeMin = this.elements.filterTimeMin as HTMLInputElement;
    const filterTimeMax = this.elements.filterTimeMax as HTMLInputElement;
    const filterCanId = this.elements.filterCanId as HTMLInputElement;
    const filterMessage = this.elements.filterMessage as HTMLInputElement;

    if (filterTimeMin) filterTimeMin.value = '';
    if (filterTimeMax) filterTimeMax.value = '';
    if (filterCanId) filterCanId.value = '';
    if (filterMessage) filterMessage.value = '';

    this.filters = { timeMin: null, timeMax: null, canIds: null, messages: null };
    this.selectedFrameIndex = null;
    this.renderFrames();
    this.clearSignalsPanel();
  }

  private getFilteredFrames(): CanFrame[] {
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

  private getMessageName(canId: number): string {
    if (!this.dbcInfo?.messages) return '-';
    const msg = this.dbcInfo.messages.find(m => m.id === canId);
    return msg ? msg.name : '-';
  }

  private renderFrames(): void {
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
          const idx = parseInt((row as HTMLElement).dataset.index || '0');
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

  private selectFrame(index: number): void {
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

  private async decodeSelectedFrame(): Promise<void> {
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

  private clearSignalsPanel(): void {
    const tbody = this.elements.signalsTableBody;
    const count = this.elements.signalsCount;

    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="3" class="cv-signals-empty">Select a frame to view decoded signals</td></tr>';
    }
    if (count) {
      count.textContent = 'Select a frame';
    }
  }

  private renderSignals(): void {
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
