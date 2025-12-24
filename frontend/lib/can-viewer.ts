/**
 * CAN Viewer Shell
 *
 * Thin orchestration layer that:
 * - Routes between MDF4 Inspector, Live Viewer, DBC Editor, and About tabs
 * - Manages shared DBC state across components
 * - Handles initial file loading from CLI args
 */

import type { CanViewerApi, CanViewerConfig, MessageInfo, DbcInfo } from './types';
import { extractFilename } from './utils';
import { emitDbcChanged } from './events';

// Import toolbar components
import './components/toolbars';
import styles from '../styles/can-viewer.css?inline';

// Import components
import './components/mdf4-inspector';
import './components/live-viewer';
import './components/dbc-editor';

import type { Mdf4InspectorElement, Mdf4InspectorApi } from './components/mdf4-inspector';
import type { LiveViewerElement, LiveViewerApi } from './components/live-viewer';
import type { DbcEditorComponent, DbcEditorApi } from './components/dbc-editor';
import { exportDbcToString } from './components/dbc-editor';

/** Default configuration */
const defaultConfig: Required<CanViewerConfig> = {
  showDbcTab: true,
  showLiveTab: true,
  showMdf4Tab: true,
  showAboutTab: true,
  initialTab: 'dbc',
  autoScroll: true,
  maxFrames: 10000,
  maxSignals: 10000,
};

/** Shell state */
interface ShellState {
  activeTab: string;
  dbcLoaded: boolean;
  dbcFilename: string | null;
}

/** CAN Viewer Shell Component */
export class CanViewerElement extends HTMLElement {
  private api: CanViewerApi | null = null;
  private config: Required<CanViewerConfig>;
  private state: ShellState;
  private shadow: ShadowRoot;

  // Component references
  private mdf4Inspector: Mdf4InspectorElement | null = null;
  private liveViewer: LiveViewerElement | null = null;
  private dbcEditor: DbcEditorComponent | null = null;

  // Bound handlers for cleanup
  private boundBeforeUnload = this.handleBeforeUnload.bind(this);

  constructor() {
    super();
    this.config = { ...defaultConfig };
    this.state = {
      activeTab: this.config.initialTab,
      dbcLoaded: false,
      dbcFilename: null,
    };
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  setApi(api: CanViewerApi): void {
    this.api = api;
    this.setupComponents();
    this.loadInitialFiles();
  }

  setConfig(config: Partial<CanViewerConfig>): void {
    this.config = { ...defaultConfig, ...config };
    this.state.activeTab = this.config.initialTab;
    this.render();
  }

  connectedCallback(): void {
    this.render();
    window.addEventListener('beforeunload', this.boundBeforeUnload);
  }

  disconnectedCallback(): void {
    window.removeEventListener('beforeunload', this.boundBeforeUnload);
  }

  private handleBeforeUnload(e: BeforeUnloadEvent): void {
    if (this.dbcEditor?.getIsDirty()) {
      e.preventDefault();
      e.returnValue = 'You have unsaved DBC changes. Are you sure you want to leave?';
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Rendering
  // ─────────────────────────────────────────────────────────────────────────────

  private render(): void {
    this.shadow.innerHTML = `
      <style>${styles}</style>
      ${this.generateTemplate()}
    `;
    this.cacheElements();
    this.bindEvents();
    this.switchTab(this.state.activeTab);
  }

  private generateTemplate(): string {
    return `
      <div class="cv-app">
        <header class="cv-app-header">
          ${this.generateHeaderTop()}
          ${this.generateTabs()}
          ${this.generateMdf4Tab()}
          ${this.generateLiveTab()}
          ${this.generateDbcTab()}
          ${this.generateAboutTab()}
        </header>

        <cv-mdf4-inspector class="cv-panel hidden" id="mdf4Panel"></cv-mdf4-inspector>
        <cv-live-viewer class="cv-panel hidden" id="livePanel"></cv-live-viewer>
        <cv-dbc-editor class="cv-panel hidden" id="dbcPanel"></cv-dbc-editor>
        ${this.generateAboutPanel()}
      </div>
    `;
  }

  private generateHeaderTop(): string {
    return `
      <div class="cv-app-header-top">
        <h1 class="cv-app-title">CAN Viewer</h1>
        <button class="cv-stat clickable" id="dbcStatusBtn">
          <span class="cv-stat-label">DBC</span>
          <span class="cv-stat-value muted" id="dbcStatusValue">No file loaded</span>
        </button>
      </div>
    `;
  }

  private generateTabs(): string {
    return `
      <div class="cv-tabs bordered">
        ${this.config.showDbcTab ? '<button class="cv-tab" data-tab="dbc" title="View and manage DBC (CAN Database) files">DBC</button>' : ''}
        ${this.config.showMdf4Tab ? '<button class="cv-tab" data-tab="mdf4" title="Load and view CAN data from ASAM MDF4 measurement files">MDF4</button>' : ''}
        ${this.config.showLiveTab ? '<button class="cv-tab" data-tab="live" title="Capture live CAN frames from SocketCAN interfaces">Live Capture</button>' : ''}
        ${this.config.showAboutTab ? '<button class="cv-tab" data-tab="about" title="About CAN Viewer">About</button>' : ''}
      </div>
    `;
  }

  private generateMdf4Tab(): string {
    return `
      <div id="mdf4Tab" class="cv-tab-pane">
        <cv-mdf4-toolbar></cv-mdf4-toolbar>
      </div>
    `;
  }

  private generateLiveTab(): string {
    return `
      <div id="liveTab" class="cv-tab-pane">
        <cv-live-toolbar></cv-live-toolbar>
      </div>
    `;
  }

  private generateDbcTab(): string {
    return `
      <div id="dbcTab" class="cv-tab-pane">
        <cv-dbc-toolbar></cv-dbc-toolbar>
      </div>
    `;
  }

  private generateAboutTab(): string {
    return `
      <div id="aboutTab" class="cv-tab-pane">
        <div class="cv-toolbar cv-about-header">
          <div class="cv-about-title-group">
            <span class="cv-about-title">CAN Viewer</span>
            <span class="cv-about-version">v0.1.2</span>
          </div>
          <div class="cv-about-desc">
            A desktop application for viewing and analyzing CAN bus data from MDF4 measurement files
            and live SocketCAN interfaces. Includes a built-in DBC editor.
          </div>
        </div>
      </div>
    `;
  }

  private generateAboutPanel(): string {
    return `
      <div class="cv-panel hidden" id="aboutPanel">
        <div class="cv-panel-header">
          <div class="cv-tabs">
            <button class="cv-tab active" data-tab="features">Features</button>
            <button class="cv-tab" data-tab="acknowledgments">Acknowledgments</button>
          </div>
        </div>
        <div class="cv-panel-body padded">
          <div class="cv-tab-pane active" id="aboutFeatures">
            <div class="cv-feature-grid">
              <div class="cv-feature-card">
                <h4>MDF4 File Support</h4>
                <p>Load and analyze CAN data from ASAM MDF4 measurement files. View raw frames with timestamps, channels, and decoded signals.</p>
              </div>
              <div class="cv-feature-card">
                <h4>Live SocketCAN Capture</h4>
                <p>Lossless capture from Linux SocketCAN interfaces with real-time MDF4 recording. Message and signal monitors with live updates.</p>
              </div>
              <div class="cv-feature-card">
                <h4>DBC Signal Decoding</h4>
                <p>Decode raw CAN frames into physical values using DBC database files. Supports CAN 2.0 and CAN FD with extended IDs.</p>
              </div>
              <div class="cv-feature-card">
                <h4>Built-in DBC Editor</h4>
                <p>Create and modify DBC files directly in the application. Edit messages, signals, and their properties.</p>
              </div>
              <div class="cv-feature-card">
                <h4>Real-time Monitors</h4>
                <p>Message monitor shows latest data per CAN ID with rates. Signal monitor groups decoded values by message.</p>
              </div>
              <div class="cv-feature-card">
                <h4>High Performance</h4>
                <p>Rust backend handles all processing. Pre-rendered updates minimize frontend overhead during live capture.</p>
              </div>
            </div>
          </div>
          <div class="cv-tab-pane" id="aboutAcknowledgments">
            <p class="cv-about-intro">CAN Viewer is built on open standards and powered by excellent open source software.</p>
            <div class="cv-deps-grid">
              <div class="cv-deps-section">
                <h4>Standards &amp; Specifications</h4>
                <ul>
                  <li><a href="https://www.asam.net/standards/detail/mdf/" target="_blank">ASAM MDF4</a> - Measurement Data Format for automotive test data</li>
                  <li><a href="https://www.csselectronics.com/pages/can-dbc-file-database-intro" target="_blank">DBC Format</a> - CAN Database format by Vector Informatik</li>
                  <li><a href="https://docs.kernel.org/networking/can.html" target="_blank">SocketCAN</a> - Linux CAN networking subsystem</li>
                  <li><a href="https://www.iso.org/standard/63648.html" target="_blank">ISO 11898</a> - CAN protocol specification</li>
                </ul>
              </div>
              <div class="cv-deps-section">
                <h4>Rust Core Libraries</h4>
                <ul>
                  <li><a href="https://tauri.app" target="_blank">Tauri</a> - Build secure desktop apps with web technologies</li>
                  <li class="cv-sister-project"><a href="https://crates.io/crates/mdf4-rs" target="_blank">mdf4-rs</a> - Pure Rust ASAM MDF4 parser and writer</li>
                  <li class="cv-sister-project"><a href="https://crates.io/crates/dbc-rs" target="_blank">dbc-rs</a> - DBC file parser with signal decoding</li>
                  <li><a href="https://crates.io/crates/socketcan" target="_blank">socketcan</a> - SocketCAN bindings for CAN FD support</li>
                  <li><a href="https://crates.io/crates/embedded-can" target="_blank">embedded-can</a> - Hardware-agnostic CAN frame types</li>
                </ul>
              </div>
              <div class="cv-deps-section">
                <h4>Rust Ecosystem</h4>
                <ul>
                  <li><a href="https://tokio.rs" target="_blank">Tokio</a> - Async runtime for reliable networking</li>
                  <li><a href="https://serde.rs" target="_blank">Serde</a> - Serialization framework</li>
                  <li><a href="https://clap.rs" target="_blank">Clap</a> - Command line argument parser</li>
                  <li><a href="https://crates.io/crates/thiserror" target="_blank">thiserror</a> - Derive macro for error types</li>
                  <li><a href="https://crates.io/crates/dirs" target="_blank">dirs</a> - Platform directories</li>
                </ul>
              </div>
              <div class="cv-deps-section">
                <h4>Frontend Stack</h4>
                <ul>
                  <li><a href="https://vite.dev" target="_blank">Vite</a> - Lightning fast frontend build tool</li>
                  <li><a href="https://www.typescriptlang.org" target="_blank">TypeScript</a> - JavaScript with static types</li>
                  <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components" target="_blank">Web Components</a> - Native custom elements</li>
                  <li><a href="https://vitest.dev" target="_blank">Vitest</a> - Vite-native testing framework</li>
                  <li><a href="https://eslint.org" target="_blank">ESLint</a> - JavaScript/TypeScript linting</li>
                </ul>
              </div>
            </div>
            <p class="cv-about-license">Licensed under MIT or Apache-2.0. Made with Rust and TypeScript.</p>
          </div>
        </div>
      </div>
    `;
  }

  private cacheElements(): void {
    this.mdf4Inspector = this.shadow.querySelector('cv-mdf4-inspector');
    this.liveViewer = this.shadow.querySelector('cv-live-viewer');
    this.dbcEditor = this.shadow.querySelector('cv-dbc-editor');
  }

  private bindEvents(): void {
    // Main tab switching
    this.shadow.querySelectorAll('.cv-tabs.bordered .cv-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = (btn as HTMLElement).dataset.tab;
        if (tab) this.switchTab(tab);
      });
    });

    // DBC status button - switch to DBC tab
    this.shadow.querySelector('#dbcStatusBtn')?.addEventListener('click', () => {
      this.switchTab('dbc');
    });

    // MDF4 toolbar events
    this.shadow.querySelector('cv-mdf4-toolbar')?.addEventListener('open', () => this.mdf4Inspector?.promptLoadMdf4());
    this.shadow.querySelector('cv-mdf4-toolbar')?.addEventListener('clear', () => this.mdf4Inspector?.clearAllData());

    // Live toolbar events
    this.shadow.querySelector('cv-live-toolbar')?.addEventListener('refresh-interfaces', () => this.liveViewer?.loadInterfaces());
    this.shadow.querySelector('cv-live-toolbar')?.addEventListener('start-capture', (e: Event) => {
      const iface = (e as CustomEvent<{ interface: string }>).detail.interface;
      this.liveViewer?.startCapture(iface);
    });
    this.shadow.querySelector('cv-live-toolbar')?.addEventListener('stop-capture', () => this.liveViewer?.stopCapture());
    this.shadow.querySelector('cv-live-toolbar')?.addEventListener('clear', () => this.liveViewer?.clearAllData());

    // DBC toolbar events
    this.shadow.querySelector('cv-dbc-toolbar')?.addEventListener('new', () => this.dbcEditor?.handleNew());
    this.shadow.querySelector('cv-dbc-toolbar')?.addEventListener('open', () => this.dbcEditor?.handleOpen());
    this.shadow.querySelector('cv-dbc-toolbar')?.addEventListener('edit', () => this.dbcEditor?.setEditMode(true));
    this.shadow.querySelector('cv-dbc-toolbar')?.addEventListener('cancel', () => this.dbcEditor?.cancelEdit());
    this.shadow.querySelector('cv-dbc-toolbar')?.addEventListener('save', () => this.dbcEditor?.handleSave());
    this.shadow.querySelector('cv-dbc-toolbar')?.addEventListener('save-as', () => this.dbcEditor?.handleSaveAs());

    // About panel tabs
    this.shadow.querySelector('#aboutPanel')?.querySelectorAll('.cv-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = (tab as HTMLElement).dataset.tab;
        if (!tabName) return;
        this.shadow.querySelector('#aboutPanel')?.querySelectorAll('.cv-tab').forEach(t =>
          t.classList.toggle('active', (t as HTMLElement).dataset.tab === tabName)
        );
        this.shadow.querySelector('#aboutPanel')?.querySelectorAll('.cv-tab-pane').forEach(p =>
          p.classList.toggle('active', p.id === `about${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`)
        );
      });
    });

    // External links
    this.shadow.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href]') as HTMLAnchorElement;
      if (anchor?.href && anchor.target === '_blank') {
        e.preventDefault();
        this.openExternalUrl(anchor.href);
      }
    });

  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Component Setup
  // ─────────────────────────────────────────────────────────────────────────────

  private setupComponents(): void {
    if (!this.api) return;

    // Setup MDF4 Inspector
    if (this.mdf4Inspector) {
      this.mdf4Inspector.setApi(this.createMdf4Api());
    }

    // Setup Live Viewer
    if (this.liveViewer) {
      this.liveViewer.setApi(this.createLiveApi());
    }

    // Setup DBC Editor
    if (this.dbcEditor) {
      this.dbcEditor.setApi(this.createDbcEditorApi());
    }
  }

  private createMdf4Api(): Mdf4InspectorApi {
    const api = this.api!;
    return {
      loadMdf4: (path) => api.loadMdf4(path),
      decodeFrames: (frames) => api.decodeFrames(frames),
      openFileDialog: (filters) => api.openFileDialog(filters),
      getDbcInfo: () => api.getDbcInfo(),
    };
  }

  private createLiveApi(): LiveViewerApi {
    const api = this.api!;
    return {
      listCanInterfaces: () => api.listCanInterfaces(),
      startCapture: (iface, captureFile) => api.startCapture(iface, captureFile),
      stopCapture: () => api.stopCapture(),
      saveFileDialog: (filters, defaultName) => api.saveFileDialog(filters, defaultName),
      getDbcInfo: () => api.getDbcInfo(),
      onLiveCaptureUpdate: (cb) => api.onLiveCaptureUpdate(cb),
      onCaptureFinalized: (cb) => api.onCaptureFinalized(cb),
      onCaptureError: (cb) => api.onCaptureError(cb),
    };
  }

  private createDbcEditorApi(): DbcEditorApi {
    const api = this.api!;

    const mapMessageInfo = (m: MessageInfo) => ({
      id: m.id,
      is_extended: false,
      name: m.name,
      dlc: m.dlc,
      sender: m.sender || 'Vector__XXX',
      signals: m.signals.map(s => ({
        name: s.name,
        start_bit: s.start_bit,
        length: s.length,
        byte_order: (s.byte_order === 'big_endian' ? 'big_endian' : 'little_endian') as 'big_endian' | 'little_endian',
        is_unsigned: !s.is_signed,
        factor: s.factor,
        offset: s.offset,
        min: s.min,
        max: s.max,
        unit: s.unit || null,
        receivers: { type: 'none' as const },
        is_multiplexer: false,
        multiplexer_value: null,
      })),
    });

    return {
      loadDbc: async (path: string) => {
        await api.loadDbc(path);
        const info = await api.getDbcInfo();
        if (!info) throw new Error('Failed to load DBC');
        this.state.dbcLoaded = true;
        this.state.dbcFilename = extractFilename(path);
        this.updateDbcStatusUI();
        this.emitDbcChange('loaded', info);
        return { version: null, nodes: [], messages: info.messages.map(mapMessageInfo) };
      },
      saveDbcContent: async (path: string, content: string) => {
        await api.saveDbcContent(path, content);
        this.state.dbcFilename = extractFilename(path);
        this.updateDbcStatusUI();
        const info = await api.getDbcInfo();
        this.emitDbcChange('updated', info);
      },
      newDbc: async () => {
        await api.clearDbc();
        this.state.dbcLoaded = false;
        this.state.dbcFilename = null;
        this.updateDbcStatusUI();
        this.emitDbcChange('new', null);
        return { version: null, nodes: [], messages: [] };
      },
      getDbc: async () => {
        try {
          const info = await api.getDbcInfo();
          if (!info) return null;
          return { version: null, nodes: [], messages: info.messages.map(mapMessageInfo) };
        } catch {
          return null;
        }
      },
      updateDbc: async (dbc) => {
        const content = exportDbcToString(dbc);
        await api.updateDbcContent(content);
        this.state.dbcLoaded = true;
        const info = await api.getDbcInfo();
        this.emitDbcChange('updated', info);
      },
      getCurrentFile: async () => api.getDbcPath(),
      isDirty: async () => false,
      openFileDialog: async () => api.openFileDialog([{ name: 'DBC Files', extensions: ['dbc'] }]),
      saveFileDialog: async () => api.saveFileDialog([{ name: 'DBC Files', extensions: ['dbc'] }], 'untitled.dbc'),
    };
  }

  /** Emit DBC changed event for all listeners */
  private emitDbcChange(action: 'loaded' | 'cleared' | 'updated' | 'new', dbcInfo: DbcInfo | null): void {
    emitDbcChanged({
      action,
      dbcInfo,
      filename: this.state.dbcFilename,
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Tab Management
  // ─────────────────────────────────────────────────────────────────────────────

  private switchTab(tab: string): void {
    // Warn about unsaved DBC changes when leaving the DBC tab
    if (this.state.activeTab === 'dbc' && tab !== 'dbc') {
      if (this.dbcEditor?.hasUnsavedChanges()) {
        if (!confirm('You have unsaved changes in the DBC editor. Leave anyway?')) {
          return;
        }
      }
    }

    this.state.activeTab = tab;

    // Update tab buttons
    this.shadow.querySelectorAll('.cv-tabs.bordered .cv-tab').forEach(btn => {
      btn.classList.toggle('active', (btn as HTMLElement).dataset.tab === tab);
    });

    // Update tab header panes
    this.shadow.querySelectorAll('.cv-app-header > .cv-tab-pane').forEach(content => {
      content.classList.toggle('active', content.id === `${tab}Tab`);
    });

    // Show/hide component panels
    const mdf4Panel = this.shadow.querySelector('#mdf4Panel');
    const livePanel = this.shadow.querySelector('#livePanel');
    const dbcPanel = this.shadow.querySelector('#dbcPanel');
    const aboutPanel = this.shadow.querySelector('#aboutPanel');

    mdf4Panel?.classList.toggle('hidden', tab !== 'mdf4');
    livePanel?.classList.toggle('hidden', tab !== 'live');
    dbcPanel?.classList.toggle('hidden', tab !== 'dbc');
    aboutPanel?.classList.toggle('hidden', tab !== 'about');

  }

  // ─────────────────────────────────────────────────────────────────────────────
  // DBC UI Management
  // ─────────────────────────────────────────────────────────────────────────────

  private updateDbcStatusUI(): void {
    const btn = this.shadow.querySelector('#dbcStatusBtn');
    const value = this.shadow.querySelector('#dbcStatusValue');

    btn?.classList.toggle('success', this.state.dbcLoaded);
    if (value) {
      value.textContent = this.state.dbcFilename || 'No file loaded';
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Initial Loading
  // ─────────────────────────────────────────────────────────────────────────────

  private async loadInitialFiles(): Promise<void> {
    if (!this.api) return;
    try {
      const initial = await this.api.getInitialFiles();
      if (initial.dbc_path && this.dbcEditor) {
        await this.dbcEditor.loadFile(initial.dbc_path);
        // DBC loaded at startup - switch to MDF4 tab (ready to load/capture data)
        this.switchTab('mdf4');
      }
      if (initial.mdf4_path && this.mdf4Inspector) {
        await this.mdf4Inspector.loadFile(initial.mdf4_path);
        this.switchTab('mdf4');
      }
    } catch (err) {
      console.error('Failed to load initial files:', err);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Utilities
  // ─────────────────────────────────────────────────────────────────────────────

  private async openExternalUrl(url: string): Promise<void> {
    try {
      const { open } = await import('@tauri-apps/plugin-shell');
      await open(url);
    } catch {
      window.open(url, '_blank');
    }
  }
}

customElements.define('can-viewer', CanViewerElement);
export default CanViewerElement;
