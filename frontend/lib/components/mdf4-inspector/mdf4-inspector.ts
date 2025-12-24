/**
 * MDF4 Inspector Component
 *
 * A self-contained component for viewing and analyzing CAN data from MDF4 files.
 * Provides static frame viewing, signal decoding, and filtering capabilities.
 */

import type { CanFrame, DecodedSignal, DbcInfo, FileFilter } from '../../types';
import type { Filters } from '../../config';
import { countActiveFilters } from '../../config';
import { extractFilename } from '../../utils';
import { events, emitMdf4Loaded, emitMdf4StatusChange, emitFrameSelected, type DbcChangedEvent } from '../../events';
import styles from '../../../styles/can-viewer.css?inline';

// Import sub-components
import '../shared/frames-table';
import '../shared/signals-panel';
import '../shared/filters-panel';

import type { FramesTableElement } from '../shared/frames-table';
import type { SignalsPanelElement } from '../shared/signals-panel';
import type { FiltersPanelElement } from '../shared/filters-panel';

/** API interface for MDF4 Inspector */
export interface Mdf4InspectorApi {
  loadMdf4(path: string): Promise<[CanFrame[], DecodedSignal[]]>;
  decodeFrames(frames: CanFrame[]): Promise<{ signals: DecodedSignal[]; errors: string[] }>;
  openFileDialog(filters: FileFilter[]): Promise<string | null>;
  getDbcInfo(): Promise<DbcInfo | null>;
}

/** State for MDF4 Inspector */
interface Mdf4State {
  frames: CanFrame[];
  filteredFrames: CanFrame[];
  signals: DecodedSignal[];
  filters: Filters;
  selectedFrameIndex: number | null;
  dbcInfo: DbcInfo | null;
  currentFile: string | null;
}

function createInitialState(): Mdf4State {
  return {
    frames: [],
    filteredFrames: [],
    signals: [],
    filters: {
      timeMin: null,
      timeMax: null,
      canIds: null,
      messages: null,
      signals: null,
      dataPattern: null,
      channel: null,
      matchStatus: 'all',
    },
    selectedFrameIndex: null,
    dbcInfo: null,
    currentFile: null,
  };
}

/** MDF4 Inspector Web Component */
export class Mdf4InspectorElement extends HTMLElement {
  private api: Mdf4InspectorApi | null = null;
  private state: Mdf4State;
  private shadow: ShadowRoot;

  // Sub-component references
  private framesTable: FramesTableElement | null = null;
  private signalsPanel: SignalsPanelElement | null = null;
  private filtersPanel: FiltersPanelElement | null = null;

  // Bound event handler for cleanup
  private handleDbcChanged = (event: DbcChangedEvent) => this.onDbcChanged(event);

  constructor() {
    super();
    this.state = createInitialState();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this.render();
    events.on('dbc:changed', this.handleDbcChanged);
  }

  disconnectedCallback(): void {
    events.off('dbc:changed', this.handleDbcChanged);
  }

  setApi(api: Mdf4InspectorApi): void {
    this.api = api;
    this.refreshDbcInfo();
  }

  /** Get current frames for external use (e.g., DBC editor) */
  getFrames(): CanFrame[] {
    return this.state.frames;
  }

  /** Handle DBC changed event from event bus */
  private async onDbcChanged(event: DbcChangedEvent): Promise<void> {
    this.state.dbcInfo = event.dbcInfo;
    this.renderFrames();
    // Re-decode selected frame if any
    if (this.state.selectedFrameIndex !== null) {
      const frame = this.state.frames[this.state.selectedFrameIndex];
      if (frame) await this.decodeFrame(frame);
    }
  }

  /** Refresh DBC info from API (used on initial setup) */
  async refreshDbcInfo(): Promise<void> {
    if (!this.api) return;
    try {
      this.state.dbcInfo = await this.api.getDbcInfo();
      this.renderFrames();
    } catch {
      // Ignore errors
    }
  }

  /** Load an MDF4 file */
  async loadFile(path: string): Promise<void> {
    if (!this.api) return;

    const btn = this.shadow.querySelector('#loadBtn') as HTMLButtonElement;
    try {
      if (btn) { btn.disabled = true; btn.textContent = 'Loading...'; }

      const [frames] = await this.api.loadMdf4(path);
      this.state.frames = frames;
      this.state.filteredFrames = [...frames];
      this.state.signals = [];
      this.state.selectedFrameIndex = null;
      this.state.currentFile = path;

      this.renderFrames();
      this.clearSignalsPanel();
      emitMdf4StatusChange({ loaded: true, filename: extractFilename(path) });
      this.showMessage(`Loaded ${frames.length} frames`);

      // Emit event for other components (e.g., DBC editor for frame preview)
      emitMdf4Loaded({ path, frames, frameCount: frames.length });
    } catch (err) {
      this.showMessage(String(err), 'error');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Open'; }
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
  }

  private generateTemplate(): string {
    return `
      <div class="cv-mdf4-inspector">
        <div class="cv-panel">
          <div class="cv-panel-header">
            <div class="cv-tabs">
              <button class="cv-tab active" data-tab="data">CAN Frames <span class="cv-tab-badge" id="framesCount">0</span></button>
              <button class="cv-tab" data-tab="filters">Filters <span class="cv-tab-badge dimmed" id="filterCount">0</span></button>
            </div>
          </div>
          <div class="cv-panel-body flush">
            ${this.generateDataSection()}
            ${this.generateFiltersSection()}
          </div>
        </div>
      </div>
    `;
  }

  private generateDataSection(): string {
    return `
      <div class="cv-tab-pane active" id="dataSection">
        <div class="cv-grid responsive">
          <cv-frames-table class="cv-card" id="framesTable">
            <div class="cv-card-header">
              <span class="cv-card-title">Raw CAN Frames</span>
              <span class="cv-filter-link" id="filterLink"></span>
            </div>
            <div class="cv-table-wrap">
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
          </cv-frames-table>
          <cv-signals-panel class="cv-card" id="signalsPanel">
            <div class="cv-card-header">
              <span class="cv-card-title">Decoded Signals <span class="cv-tab-badge" id="signalsCount">0</span></span>
              <span class="cv-decode-error hidden"></span>
            </div>
            <div class="cv-table-wrap">
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
          </cv-signals-panel>
        </div>
      </div>
    `;
  }

  private generateFiltersSection(): string {
    return `
      <cv-filters-panel class="cv-tab-pane" id="filtersSection">
        <div class="cv-filters-grid">
          <div class="cv-filter-section">
            <div class="cv-filter-section-title">Frame Filters</div>
            <div class="cv-filter-row">
              <label>Time Range:</label>
              <input type="text" class="cv-input mono" id="filterTimeMin" placeholder="0.000">
              <span class="cv-filter-sep">to</span>
              <input type="text" class="cv-input mono" id="filterTimeMax" placeholder="999.999">
            </div>
            <div class="cv-filter-row">
              <label>CAN ID:</label>
              <input type="text" class="cv-input mono" id="filterCanId" placeholder="7DF, 7E8, 100-1FF">
            </div>
            <div class="cv-filter-row">
              <label>Channel:</label>
              <input type="text" class="cv-input mono" id="filterChannel" placeholder="can0, vcan0">
            </div>
            <div class="cv-filter-row">
              <label>Data Pattern:</label>
              <input type="text" class="cv-input mono" id="filterDataPattern" placeholder="01 ?? FF (use ?? for wildcard)">
            </div>
          </div>
          <div class="cv-filter-section">
            <div class="cv-filter-section-title">DBC Filters</div>
            <div class="cv-filter-row">
              <label>Message:</label>
              <input type="text" class="cv-input mono" id="filterMessage" placeholder="EngineData, VehicleSpeed">
            </div>
            <div class="cv-filter-row">
              <label>Signal:</label>
              <input type="text" class="cv-input mono" id="filterSignal" placeholder="RPM, Temperature">
            </div>
            <div class="cv-filter-row">
              <label>Match Status:</label>
              <select class="cv-select" id="filterMatchStatus">
                <option value="all">All Frames</option>
                <option value="matched">Matched Only</option>
                <option value="unmatched">Unmatched Only</option>
              </select>
            </div>
          </div>
          <div class="cv-filter-section cv-filter-actions">
            <button class="cv-btn" id="clearFiltersBtn">Clear All Filters</button>
            <div class="cv-filter-summary">
              <span id="filterSummary">No filters active</span>
            </div>
          </div>
        </div>
      </cv-filters-panel>
    `;
  }

  private cacheElements(): void {
    this.framesTable = this.shadow.querySelector('cv-frames-table');
    this.signalsPanel = this.shadow.querySelector('cv-signals-panel');
    this.filtersPanel = this.shadow.querySelector('cv-filters-panel');

    // Configure frames table with message name lookup
    this.framesTable?.setMessageNameLookup(canId => this.getMessageName(canId));
  }

  private bindEvents(): void {
    // Load button
    this.shadow.querySelector('#loadBtn')?.addEventListener('click', () => this.promptLoadMdf4());

    // Clear button
    this.shadow.querySelector('#clearBtn')?.addEventListener('click', () => this.clearAllData());

    // Tab switching
    this.shadow.querySelectorAll('.cv-tabs .cv-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = (tab as HTMLElement).dataset.tab;
        if (!tabName) return;
        this.switchTab(tabName);
      });
    });

    // Frame selection
    this.framesTable?.addEventListener('frame-selected', (e: Event) => {
      const detail = (e as CustomEvent<{ frame: CanFrame; index: number }>).detail;
      this.state.selectedFrameIndex = detail.index;
      this.decodeFrame(detail.frame);
      // Emit on event bus for other components (e.g., signal charts)
      emitFrameSelected({ frame: detail.frame, index: detail.index, source: 'mdf4-inspector' });
    });

    // Filter changes
    this.filtersPanel?.addEventListener('filter-change', (e: Event) => {
      const filters = (e as CustomEvent<Filters>).detail;
      this.state.filters = filters;
      this.applyFilters();
      this.renderFrames();
      this.clearSignalsPanel();
      this.updateFilterLink();
    });

    // Filter link click
    this.shadow.querySelector('#filterLink')?.addEventListener('click', () => {
      this.switchTab('filters');
    });
  }

  private switchTab(tabName: string): void {
    this.shadow.querySelectorAll('.cv-tabs .cv-tab').forEach(t =>
      t.classList.toggle('active', (t as HTMLElement).dataset.tab === tabName)
    );
    this.shadow.querySelectorAll('.cv-panel-body > .cv-tab-pane').forEach(p =>
      p.classList.toggle('active', p.id === `${tabName}Section`)
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Frame Operations
  // ─────────────────────────────────────────────────────────────────────────────

  /** Open file dialog and load selected MDF4 file */
  async promptLoadMdf4(): Promise<void> {
    if (!this.api) return;
    try {
      const path = await this.api.openFileDialog([
        { name: 'MDF4 Files', extensions: ['mf4', 'mdf', 'mdf4', 'MF4', 'MDF', 'MDF4'] }
      ]);
      if (path) await this.loadFile(path);
    } catch (err) {
      this.showMessage(String(err), 'error');
    }
  }

  /** Clear all loaded data */
  clearAllData(): void {
    this.state.frames = [];
    this.state.filteredFrames = [];
    this.state.signals = [];
    this.state.selectedFrameIndex = null;
    this.state.currentFile = null;
    this.renderFrames();
    this.clearSignalsPanel();
    emitMdf4StatusChange({ loaded: false, filename: null });
  }

  private applyFilters(): void {
    const f = this.state.filters;
    let frames = this.state.frames;

    // Time range filter
    if (f.timeMin !== null) {
      frames = frames.filter(fr => fr.timestamp >= f.timeMin!);
    }
    if (f.timeMax !== null) {
      frames = frames.filter(fr => fr.timestamp <= f.timeMax!);
    }

    // CAN ID filter
    if (f.canIds?.length) {
      frames = frames.filter(fr => f.canIds!.includes(fr.can_id));
    }

    // Channel filter
    if (f.channel) {
      const ch = f.channel.toLowerCase();
      frames = frames.filter(fr => fr.channel.toLowerCase().includes(ch));
    }

    // Data pattern filter
    if (f.dataPattern) {
      const pattern = f.dataPattern.toUpperCase().split(/\s+/);
      frames = frames.filter(fr => {
        if (pattern.length > fr.data.length) return false;
        for (let i = 0; i < pattern.length; i++) {
          const p = pattern[i];
          if (p === '??' || p === 'XX') continue;
          const expected = parseInt(p, 16);
          if (isNaN(expected) || fr.data[i] !== expected) return false;
        }
        return true;
      });
    }

    // Message name filter
    if (f.messages?.length && this.state.dbcInfo) {
      const msgNames = f.messages.map(m => m.toLowerCase());
      const matchingIds = this.state.dbcInfo.messages
        .filter(m => msgNames.some(n => m.name.toLowerCase().includes(n)))
        .map(m => m.id);
      frames = frames.filter(fr => matchingIds.includes(fr.can_id));
    }

    // Match status filter
    if (f.matchStatus !== 'all' && this.state.dbcInfo) {
      const dbcIds = new Set(this.state.dbcInfo.messages.map(m => m.id));
      if (f.matchStatus === 'matched') {
        frames = frames.filter(fr => dbcIds.has(fr.can_id));
      } else {
        frames = frames.filter(fr => !dbcIds.has(fr.can_id));
      }
    }

    this.state.filteredFrames = frames;
  }

  private renderFrames(): void {
    this.applyFilters();
    this.framesTable?.setFrames(this.state.filteredFrames);
    this.updateFrameCount();
    this.updateFilterTabBadge();
  }

  private async decodeFrame(frame: CanFrame): Promise<void> {
    if (!this.api || !this.state.dbcInfo) {
      this.clearSignalsPanel();
      return;
    }

    // Check if message exists in DBC
    const hasMessage = this.state.dbcInfo.messages.some(m => m.id === frame.can_id);
    if (!hasMessage) {
      this.state.signals = [];
      this.signalsPanel?.setSignals([], []);
      this.updateSignalsCount();
      return;
    }

    try {
      const response = await this.api.decodeFrames([frame]);
      this.state.signals = response.signals;
      this.signalsPanel?.setSignals(response.signals, response.errors);
      this.updateSignalsCount();
    } catch (err) {
      console.error('Failed to decode frame:', err);
      this.clearSignalsPanel();
    }
  }

  private getMessageName(canId: number): string {
    if (!this.state.dbcInfo) return '-';
    const msg = this.state.dbcInfo.messages.find(m => m.id === canId);
    return msg?.name || '-';
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // UI Updates
  // ─────────────────────────────────────────────────────────────────────────────

  private clearSignalsPanel(): void {
    this.signalsPanel?.showEmpty();
    this.updateSignalsCount();
  }

  private updateFrameCount(): void {
    const countEl = this.shadow.querySelector('#framesCount');
    if (countEl) countEl.textContent = String(this.state.filteredFrames.length);
  }

  private updateSignalsCount(): void {
    const countEl = this.shadow.querySelector('#signalsCount');
    if (countEl) countEl.textContent = String(this.state.signals.length);
  }

  private updateFilterTabBadge(): void {
    const countEl = this.shadow.querySelector('#filterCount');
    if (countEl) {
      countEl.textContent = String(countActiveFilters(this.state.filters));
    }
  }

  private updateFilterLink(): void {
    const link = this.shadow.querySelector('#filterLink') as HTMLElement;
    if (!link) return;

    const f = this.state.filters;
    const parts: string[] = [];

    if (f.timeMin !== null || f.timeMax !== null) parts.push('time');
    if (f.canIds?.length) parts.push('ID');
    if (f.channel) parts.push('channel');
    if (f.dataPattern) parts.push('data');
    if (f.messages?.length) parts.push('message');
    if (f.signals?.length) parts.push('signal');
    if (f.matchStatus !== 'all') parts.push(f.matchStatus);

    if (parts.length === 0) {
      link.textContent = '';
      link.classList.remove('active');
    } else {
      link.textContent = `[${parts.join(', ')}]`;
      link.classList.add('active');
    }
  }

  private showMessage(text: string, type: 'success' | 'error' = 'success'): void {
    const msg = document.createElement('div');
    msg.className = `cv-message ${type}`;
    msg.textContent = text;
    this.shadow.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
  }
}

customElements.define('cv-mdf4-inspector', Mdf4InspectorElement);
