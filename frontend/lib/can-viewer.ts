import type { CanViewerApi, CanViewerConfig, CanFrame } from './types';
import type { Filters } from './config';
import { generateTemplate, ELEMENT_IDS, type ElementId } from './template';
import {
  createInitialState, addFrame, addSignal, clearData, setDbcLoaded,
  getMessageName, updateFilteredFrames, selectFrame, getSelectedFrame,
  setCaptureStatus, setActiveTab, calculateFrameStats, type ViewerState
} from './state';
import styles from '../styles/can-viewer.css?inline';

// Import sub-components to register them
import './components/frames-table';
import './components/signals-panel';
import './components/filters-panel';
import './components/dbc-viewer';
import './components/capture-controls';

import type { FramesTableElement } from './components/frames-table';
import type { SignalsPanelElement } from './components/signals-panel';
import type { FiltersPanelElement } from './components/filters-panel';
import type { DbcViewerElement } from './components/dbc-viewer';
import type { CaptureControlsElement } from './components/capture-controls';

/** CAN Viewer Web Component */
export class CanViewerElement extends HTMLElement {
  private api: CanViewerApi | null = null;
  private state: ViewerState;
  private shadow: ShadowRoot;
  private elements: Partial<Record<ElementId, HTMLElement>> = {};
  private unlisteners: (() => void)[] = [];

  // Sub-component references
  private framesTable: FramesTableElement | null = null;
  private signalsPanel: SignalsPanelElement | null = null;
  private filtersPanel: FiltersPanelElement | null = null;
  private dbcViewer: DbcViewerElement | null = null;
  private captureControls: CaptureControlsElement | null = null;

  // Render throttling for live capture
  private frameRenderPending = false;
  private signalRenderPending = false;
  private lastStatsUpdate = 0;

  // Frame batching for live capture
  private frameBuffer: CanFrame[] = [];
  private flushTimer: number | null = null;

  constructor() {
    super();
    this.state = createInitialState();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  setApi(api: CanViewerApi): void {
    this.api = api;
    this.setupEventListeners();
  }

  setConfig(config: Partial<CanViewerConfig>): void {
    this.state = createInitialState(config);
    this.render();
  }

  connectedCallback(): void {
    this.render();
  }

  disconnectedCallback(): void {
    this.unlisteners.forEach(fn => fn());
    this.unlisteners = [];
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Setup
  // ─────────────────────────────────────────────────────────────────────────────

  private setupEventListeners(): void {
    if (!this.api) return;

    this.unlisteners.push(
      this.api.onCanFrame(frame => {
        // Buffer frames during capture to avoid blocking main thread
        this.frameBuffer.push(frame);
        this.scheduleFrameFlush();
      }),
      this.api.onDecodedSignal(signal => {
        // During live capture, only show signals for selected frame (via decodeFrame)
        // Ignore streaming signals to avoid flooding the panel
        if (!this.state.isCapturing) {
          addSignal(this.state, signal);
          this.scheduleSignalRender();
        }
      }),
      this.api.onCaptureError(error => {
        this.showMessage(error, 'error');
        this.updateCaptureUI(false);
      })
    );

    this.loadInitialFiles();
  }

  private scheduleFrameFlush(): void {
    if (this.flushTimer !== null) return;

    // Flush buffer every 100ms during capture
    this.flushTimer = window.setTimeout(() => {
      this.flushTimer = null;
      this.flushFrameBuffer();
    }, 100);
  }

  private flushFrameBuffer(): void {
    if (this.frameBuffer.length === 0) return;

    // Batch add all buffered frames to state
    for (const frame of this.frameBuffer) {
      addFrame(this.state, frame);
    }
    this.frameBuffer = [];

    this.scheduleFrameRender();
  }

  private scheduleFrameRender(): void {
    if (this.frameRenderPending) return;
    this.frameRenderPending = true;

    // Use slower render rate during active capture for performance
    if (this.state.isCapturing) {
      requestAnimationFrame(() => {
        this.frameRenderPending = false;
        this.renderFramesThrottled();
      });
    } else {
      requestAnimationFrame(() => {
        this.frameRenderPending = false;
        this.renderFrames();
      });
    }
  }

  private scheduleSignalRender(): void {
    if (this.signalRenderPending) return;
    this.signalRenderPending = true;
    requestAnimationFrame(() => {
      this.signalRenderPending = false;
      this.renderSignals();
    });
  }

  private renderFramesThrottled(): void {
    updateFilteredFrames(this.state);
    this.framesTable?.setFrames(this.state.filteredFrames);
    this.updateFrameCount();
    this.captureControls?.setHasFrames(this.state.frames.length > 0);

    // Throttle stats updates to every 500ms during capture
    const now = performance.now();
    if (now - this.lastStatsUpdate >= 500) {
      this.lastStatsUpdate = now;
      this.updateFrameStats();
    }
  }

  private async loadInitialFiles(): Promise<void> {
    if (!this.api) return;
    try {
      const initial = await this.api.getInitialFiles();
      if (initial.dbc_path) await this.loadDbc(initial.dbc_path);
      if (initial.mdf4_path) await this.loadMdf4(initial.mdf4_path);
    } catch (err) {
      console.error('Failed to load initial files:', err);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Rendering
  // ─────────────────────────────────────────────────────────────────────────────

  private render(): void {
    this.shadow.innerHTML = `<style>${styles}</style>${generateTemplate(this.state.config)}`;
    this.cacheElements();
    this.bindEvents();
    this.switchTab(this.state.activeTab);
  }

  private cacheElements(): void {
    ELEMENT_IDS.forEach(id => {
      const el = this.shadow.getElementById(id);
      if (el) this.elements[id] = el;
    });

    // Cache sub-component references
    this.framesTable = this.shadow.querySelector('cv-frames-table');
    this.signalsPanel = this.shadow.querySelector('cv-signals-panel');
    this.filtersPanel = this.shadow.querySelector('cv-filters-panel');
    this.dbcViewer = this.shadow.querySelector('cv-dbc-viewer');
    this.captureControls = this.shadow.querySelector('cv-capture-controls');

    // Configure components
    this.framesTable?.setMessageNameLookup(canId => getMessageName(this.state, canId));
  }

  private renderFrames(): void {
    updateFilteredFrames(this.state);
    this.framesTable?.setFrames(this.state.filteredFrames);
    this.updateFrameCount();
    this.updateFrameStats();
    this.captureControls?.setHasFrames(this.state.frames.length > 0);
  }

  private renderSignals(): void {
    this.signalsPanel?.setSignals(this.state.signals);
  }

  private clearSignalsPanel(): void {
    this.signalsPanel?.showEmpty();
  }

  private renderDbcMessages(): void {
    this.dbcViewer?.setDbcInfo(this.state.dbcInfo);
  }

  private updateFrameCount(): void {
    this.filtersPanel?.setFilterCount(this.state.filteredFrames.length, this.state.frames.length);
  }

  private updateFrameStats(): void {
    const stats = calculateFrameStats(this.state);

    const msgCount = this.elements.statMsgCount;
    const frameRate = this.elements.statFrameRate;
    const deltaTime = this.elements.statDeltaTime;
    const busLoad = this.elements.statBusLoad;

    if (msgCount) msgCount.textContent = String(stats.uniqueMessages);
    if (frameRate) frameRate.textContent = `${Math.round(stats.frameRate)}/s`;
    if (deltaTime) {
      deltaTime.textContent = stats.avgDeltaMs > 0
        ? `${stats.avgDeltaMs.toFixed(1)}ms`
        : '-';
    }
    if (busLoad) busLoad.textContent = `${stats.busLoad.toFixed(1)}%`;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Event Binding
  // ─────────────────────────────────────────────────────────────────────────────

  private bindEvents(): void {
    // Tabs
    this.shadow.querySelectorAll('.cv-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = (btn as HTMLElement).dataset.tab;
        if (tab) this.switchTab(tab);
      });
    });

    // DBC
    this.elements.dbcStatusBtn?.addEventListener('click', () => this.switchTab('dbc'));
    this.elements.loadDbcBtnTab?.addEventListener('click', () => this.promptLoadDbc());
    this.elements.clearDbcBtn?.addEventListener('click', () => this.clearDbc());

    // MDF4
    this.elements.loadMdf4Btn?.addEventListener('click', () => this.promptLoadMdf4());
    this.elements.clearDataBtn?.addEventListener('click', () => this.clearAllData());
    this.elements.clearLiveDataBtn?.addEventListener('click', () => this.clearAllData());

    // Sub-component events
    this.framesTable?.addEventListener('frame-selected', (e: Event) => {
      const frame = (e as CustomEvent<{ frame: CanFrame; index: number }>).detail.frame;
      const index = (e as CustomEvent<{ frame: CanFrame; index: number }>).detail.index;
      selectFrame(this.state, index);
      this.decodeFrame(frame);
    });

    this.filtersPanel?.addEventListener('filter-change', (e: Event) => {
      const filters = (e as CustomEvent<Filters>).detail;
      this.state.filters = filters;
      updateFilteredFrames(this.state);
      this.renderFrames();
      this.clearSignalsPanel();
    });

    this.captureControls?.addEventListener('refresh-interfaces', () => this.loadInterfaces());
    this.captureControls?.addEventListener('start-capture', (e: Event) => {
      const iface = (e as CustomEvent<{ interface: string }>).detail.interface;
      this.startCaptureOnInterface(iface);
    });
    this.captureControls?.addEventListener('stop-capture', () => this.stopCapture());
    this.captureControls?.addEventListener('export-logs', () => this.exportLogs());
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Tab Management
  // ─────────────────────────────────────────────────────────────────────────────

  private switchTab(tab: string): void {
    setActiveTab(this.state, tab);

    this.shadow.querySelectorAll('.cv-tab-btn').forEach(btn => {
      btn.classList.toggle('active', (btn as HTMLElement).dataset.tab === tab);
    });
    this.shadow.querySelectorAll('.cv-tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `${tab}Tab`);
    });

    const isDbc = tab === 'dbc';
    const isAbout = tab === 'about';
    const hideMainContent = isDbc || isAbout;

    this.elements.tablesContainer?.classList.toggle('hidden', hideMainContent);
    this.elements.filtersSection?.classList.toggle('hidden', hideMainContent);
    this.elements.dbcViewer?.classList.toggle('hidden', !isDbc);
    this.elements.aboutViewer?.classList.toggle('hidden', !isAbout);

    if (isDbc) this.loadDbcInfo();
    if (tab === 'live') this.loadInterfaces();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // DBC Operations
  // ─────────────────────────────────────────────────────────────────────────────

  private async promptLoadDbc(): Promise<void> {
    if (!this.api) return;
    try {
      const path = await this.api.openFileDialog([{ name: 'DBC Files', extensions: ['dbc'] }]);
      if (path) await this.loadDbc(path);
    } catch (err) {
      this.showMessage(String(err), 'error');
    }
  }

  private async loadDbc(path: string): Promise<void> {
    if (!this.api) return;
    try {
      const result = await this.api.loadDbc(path);
      const filename = path.split('/').pop()?.split('\\').pop() || path;
      await this.loadDbcInfo();
      this.updateDbcStatusUI(true, filename);
      this.showMessage(result);
      this.renderFrames();
      const selectedFrame = getSelectedFrame(this.state);
      if (selectedFrame) await this.decodeFrame(selectedFrame);
    } catch (err) {
      this.showMessage(String(err), 'error');
    }
  }

  private async clearDbc(): Promise<void> {
    if (!this.api) return;
    try {
      await this.api.clearDbc();
      setDbcLoaded(this.state, false);
      this.updateDbcStatusUI(false);
      if (this.state.activeTab === 'dbc') this.renderDbcMessages();
      this.showMessage('DBC cleared');
    } catch (err) {
      this.showMessage(String(err), 'error');
    }
  }

  private async loadDbcInfo(): Promise<void> {
    if (!this.api) return;
    try {
      const info = await this.api.getDbcInfo();
      setDbcLoaded(this.state, !!info, info);
      this.renderDbcMessages();
    } catch (err) {
      console.error('Failed to load DBC info:', err);
    }
  }

  private updateDbcStatusUI(loaded: boolean, filename = ''): void {
    const statusBtn = this.elements.dbcStatusBtn as HTMLButtonElement;
    const statusValue = this.elements.dbcStatusValue;
    const clearBtn = this.elements.clearDbcBtn as HTMLButtonElement;

    if (statusBtn) {
      statusBtn.classList.toggle('loaded', loaded);
    }
    if (statusValue) {
      statusValue.textContent = loaded ? filename : 'No file loaded';
    }
    if (clearBtn) clearBtn.disabled = !loaded;
    this.elements.signalsPanel?.classList.toggle('hidden', !loaded);
    this.elements.tablesContainer?.classList.toggle('with-signals', loaded);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MDF4 Operations
  // ─────────────────────────────────────────────────────────────────────────────

  private async promptLoadMdf4(): Promise<void> {
    if (!this.api) return;
    try {
      const path = await this.api.openFileDialog([
        { name: 'MDF4 Files', extensions: ['mf4', 'mdf', 'mdf4', 'MF4', 'MDF', 'MDF4'] }
      ]);
      if (path) await this.loadMdf4(path);
    } catch (err) {
      this.showMessage(String(err), 'error');
    }
  }

  private async loadMdf4(path: string): Promise<void> {
    if (!this.api) return;
    const btn = this.elements.loadMdf4Btn as HTMLButtonElement;
    try {
      if (btn) { btn.disabled = true; btn.textContent = 'Loading...'; }
      const [frames] = await this.api.loadMdf4(path);
      this.state.frames = frames;
      this.state.signals = [];
      this.state.selectedFrameIndex = null;
      this.renderFrames();
      this.clearSignalsPanel();
      this.showMessage(`Loaded ${frames.length} frames`);
    } catch (err) {
      this.showMessage(String(err), 'error');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Load MDF4 File'; }
    }
  }

  private clearAllData(): void {
    clearData(this.state);
    this.renderFrames();
    this.clearSignalsPanel();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Live Capture
  // ─────────────────────────────────────────────────────────────────────────────

  private async loadInterfaces(): Promise<void> {
    if (!this.api) return;
    try {
      const interfaces = await this.api.listCanInterfaces();
      this.captureControls?.setInterfaces(interfaces);
    } catch (err) {
      console.log('Could not load interfaces:', err);
    }
  }

  private async startCaptureOnInterface(iface: string): Promise<void> {
    if (!this.api) return;
    try {
      this.clearAllData();
      this.updateCaptureUI(true);  // Set capturing flag BEFORE starting
      await this.api.startCapture(iface);
      this.showMessage(`Capturing on ${iface}`);
    } catch (err) {
      this.updateCaptureUI(false);  // Reset on error
      this.showMessage(String(err), 'error');
    }
  }

  private async stopCapture(): Promise<void> {
    if (!this.api) return;
    try {
      await this.api.stopCapture();

      // Cancel pending flush and flush remaining frames
      if (this.flushTimer !== null) {
        clearTimeout(this.flushTimer);
        this.flushTimer = null;
      }
      this.flushFrameBuffer();

      this.updateCaptureUI(false);
      this.showMessage('Capture stopped');
    } catch (err) {
      this.showMessage(String(err), 'error');
    }
  }

  private updateCaptureUI(capturing: boolean): void {
    setCaptureStatus(this.state, capturing);
    this.captureControls?.setCaptureStatus(capturing);
  }

  private async exportLogs(): Promise<void> {
    if (!this.api || this.state.frames.length === 0) return;

    try {
      const path = await this.api.saveFileDialog(
        [{ name: 'MDF4 Files', extensions: ['mf4'] }],
        'capture.mf4'
      );
      if (!path) return;

      const count = await this.api.exportLogs(path, this.state.frames);
      this.showMessage(`Exported ${count} frames to MDF4`);
    } catch (err) {
      this.showMessage(String(err), 'error');
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Frame Decoding
  // ─────────────────────────────────────────────────────────────────────────────

  private async decodeFrame(frame: CanFrame): Promise<void> {
    if (!this.api || !this.state.dbcLoaded) {
      this.clearSignalsPanel();
      return;
    }

    try {
      this.state.signals = await this.api.decodeFrames([frame]);
      this.renderSignals();
    } catch (err) {
      console.error('Failed to decode frame:', err);
      this.clearSignalsPanel();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Utilities
  // ─────────────────────────────────────────────────────────────────────────────

  private showMessage(text: string, type: 'success' | 'error' = 'success'): void {
    const msg = document.createElement('div');
    msg.className = `cv-message ${type}`;
    msg.textContent = text;
    this.shadow.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
  }
}

customElements.define('can-viewer', CanViewerElement);
export default CanViewerElement;
