/**
 * Live Viewer Component
 *
 * A streaming-optimized component for real-time CAN capture.
 * Designed for high-frequency data with millions of messages.
 *
 * Key design decisions:
 * - Ring buffer for bounded memory usage
 * - Message monitor shows latest value per CAN ID
 * - Throttled rendering to avoid blocking main thread
 * - Source-side filtering to reduce data volume
 */

import type { CanFrame, DecodedSignal, DbcInfo, FileFilter } from '../../types';
import { extractFilename } from '../../utils';
import { events, emitCaptureStarted, emitCaptureStopped, emitLiveInterfacesLoaded, type DbcChangedEvent } from '../../events';
import { liveStore } from '../../store';
import styles from '../../../styles/can-viewer.css?inline';


/** API interface for Live Viewer */
export interface LiveViewerApi {
  listCanInterfaces(): Promise<string[]>;
  startCapture(iface: string): Promise<void>;
  stopCapture(): Promise<void>;
  exportLogs(path: string, frames: CanFrame[]): Promise<number>;
  decodeFrames(frames: CanFrame[]): Promise<{ signals: DecodedSignal[]; errors: string[] }>;
  saveFileDialog(filters: FileFilter[], defaultName?: string): Promise<string | null>;
  getDbcInfo(): Promise<DbcInfo | null>;
  onCanFrame(callback: (frame: CanFrame) => void): () => void;
  onDecodedSignal(callback: (signal: DecodedSignal) => void): () => void;
  onDecodeError(callback: (error: string) => void): () => void;
  onCaptureError(callback: (error: string) => void): () => void;
}

/** Ring buffer for bounded frame storage */
class RingBuffer<T> {
  private buffer: T[];
  private head = 0;
  private count = 0;

  constructor(private capacity: number) {
    this.buffer = new Array(capacity);
  }

  push(item: T): void {
    this.buffer[this.head] = item;
    this.head = (this.head + 1) % this.capacity;
    if (this.count < this.capacity) this.count++;
  }

  clear(): void {
    this.head = 0;
    this.count = 0;
  }

  get length(): number {
    return this.count;
  }

  /** Get all items in order (oldest to newest) */
  toArray(): T[] {
    if (this.count === 0) return [];
    if (this.count < this.capacity) {
      return this.buffer.slice(0, this.count);
    }
    // Buffer is full, need to reorder
    const start = this.head;
    return [...this.buffer.slice(start), ...this.buffer.slice(0, start)];
  }

  /** Get last N items (newest) */
  last(n: number): T[] {
    const arr = this.toArray();
    return arr.slice(-n);
  }
}

/** Message monitor entry - latest frame per CAN ID */
interface MessageMonitorEntry {
  canId: number;
  messageName: string;
  lastFrame: CanFrame;
  count: number;
  rate: number; // frames per second
  lastUpdate: number;
}

/** State for Live Viewer */
interface LiveState {
  isCapturing: boolean;
  currentInterface: string | null;
  dbcInfo: DbcInfo | null;
  selectedCanId: number | null;
}

const DEFAULT_BUFFER_SIZE = 10000;
const RENDER_THROTTLE_MS = 100;
const STATS_UPDATE_MS = 500;
const MAX_DISPLAYED_FRAMES = 500;

/** Live Viewer Web Component */
export class LiveViewerElement extends HTMLElement {
  private api: LiveViewerApi | null = null;
  private state: LiveState;
  private shadow: ShadowRoot;

  // Data structures
  private frameBuffer: RingBuffer<CanFrame>;
  private messageMonitor: Map<number, MessageMonitorEntry> = new Map();
  private pendingFrames: CanFrame[] = [];

  // Event unsubscribers
  private unlisteners: (() => void)[] = [];

  // Throttling
  private renderPending = false;
  private flushTimer: number | null = null;
  private statsTimer: number | null = null;

  // Bound event handler for cleanup
  private handleDbcChanged = (event: DbcChangedEvent) => this.onDbcChanged(event);

  constructor() {
    super();
    this.state = {
      isCapturing: false,
      currentInterface: null,
      dbcInfo: null,
      selectedCanId: null,
    };
    this.frameBuffer = new RingBuffer(DEFAULT_BUFFER_SIZE);
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this.render();
    events.on('dbc:changed', this.handleDbcChanged);
  }

  disconnectedCallback(): void {
    this.cleanup();
    events.off('dbc:changed', this.handleDbcChanged);
  }

  setApi(api: LiveViewerApi): void {
    this.api = api;
    this.setupEventListeners();
    this.loadInterfaces();
    this.refreshDbcInfo();
  }

  /** Handle DBC changed event from event bus */
  private onDbcChanged(event: DbcChangedEvent): void {
    this.state.dbcInfo = event.dbcInfo;
    this.updateMessageMonitorNames();
    this.renderMessageMonitor();
  }

  /** Refresh DBC info from API (used on initial setup) */
  async refreshDbcInfo(): Promise<void> {
    if (!this.api) return;
    try {
      this.state.dbcInfo = await this.api.getDbcInfo();
      this.updateMessageMonitorNames();
      this.renderMessageMonitor();
    } catch {
      // Ignore errors
    }
  }

  /** Set buffer size for frame storage */
  setBufferSize(size: number): void {
    const oldFrames = this.frameBuffer.toArray();
    this.frameBuffer = new RingBuffer(size);
    // Re-add frames (will drop oldest if new buffer is smaller)
    for (const frame of oldFrames.slice(-size)) {
      this.frameBuffer.push(frame);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Event Handling
  // ─────────────────────────────────────────────────────────────────────────────

  private setupEventListeners(): void {
    if (!this.api) return;

    this.unlisteners.push(
      this.api.onCanFrame(frame => this.handleFrame(frame)),
      this.api.onDecodeError(error => console.warn('[DECODE ERROR]', error)),
      this.api.onCaptureError(error => {
        this.showMessage(error, 'error');
        this.state.isCapturing = false;
        this.updateStoreStatus();
      })
    );
  }

  private cleanup(): void {
    this.unlisteners.forEach(fn => fn());
    this.unlisteners = [];
    if (this.flushTimer !== null) clearTimeout(this.flushTimer);
    if (this.statsTimer !== null) clearInterval(this.statsTimer);
  }

  private handleFrame(frame: CanFrame): void {
    // Buffer frames for batch processing
    this.pendingFrames.push(frame);
    this.scheduleFlush();
  }

  private scheduleFlush(): void {
    if (this.flushTimer !== null) return;
    this.flushTimer = window.setTimeout(() => {
      this.flushTimer = null;
      this.flushPendingFrames();
    }, RENDER_THROTTLE_MS);
  }

  private flushPendingFrames(): void {
    if (this.pendingFrames.length === 0) return;

    const now = performance.now();

    for (const frame of this.pendingFrames) {
      // Add to ring buffer
      this.frameBuffer.push(frame);

      // Update message monitor
      const entry = this.messageMonitor.get(frame.can_id);
      if (entry) {
        entry.lastFrame = frame;
        entry.count++;
        entry.lastUpdate = now;
      } else {
        this.messageMonitor.set(frame.can_id, {
          canId: frame.can_id,
          messageName: this.getMessageName(frame.can_id),
          lastFrame: frame,
          count: 1,
          rate: 0,
          lastUpdate: now,
        });
      }
    }

    this.pendingFrames = [];
    this.scheduleRender();
  }

  private scheduleRender(): void {
    if (this.renderPending) return;
    this.renderPending = true;

    requestAnimationFrame(() => {
      this.renderPending = false;
      this.renderMessageMonitor();
      this.renderFrameStream();
      this.updateStats();
      this.updateStoreStatus();
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Rendering
  // ─────────────────────────────────────────────────────────────────────────────

  private render(): void {
    this.shadow.innerHTML = `
      <style>${styles}</style>
      ${this.generateTemplate()}
    `;
    this.bindEvents();
  }

  private generateTemplate(): string {
    return `
      <div class="cv-live-viewer">
        <div class="cv-panel">
          <div class="cv-panel-header">
            <div class="cv-tabs">
              <button class="cv-tab active" data-tab="monitor">Message Monitor <span class="cv-tab-badge" id="messageCount">0</span></button>
              <button class="cv-tab" data-tab="stream">Frame Stream <span class="cv-tab-badge" id="frameCount">0</span></button>
            </div>
          </div>
          <div class="cv-panel-body flush">
            ${this.generateMonitorSection()}
            ${this.generateStreamSection()}
          </div>
        </div>

        <div class="cv-stats-bar">
          <div class="cv-stat">
            <span class="cv-stat-label">Messages</span>
            <span class="cv-stat-value" id="statMsgCount">0</span>
          </div>
          <div class="cv-stat">
            <span class="cv-stat-label">Frames</span>
            <span class="cv-stat-value" id="statFrameCount">0</span>
          </div>
          <div class="cv-stat">
            <span class="cv-stat-label">Rate</span>
            <span class="cv-stat-value" id="statFrameRate">0/s</span>
          </div>
          <div class="cv-stat">
            <span class="cv-stat-label">Buffer</span>
            <span class="cv-stat-value" id="statBufferUsage">0%</span>
          </div>
        </div>
      </div>
    `;
  }

  private generateMonitorSection(): string {
    return `
      <div class="cv-tab-pane active" id="monitorSection">
        <div class="cv-table-wrap">
          <table class="cv-table">
            <thead>
              <tr>
                <th>CAN ID</th>
                <th>Message</th>
                <th>Data</th>
                <th>Count</th>
                <th>Rate</th>
                <th>Last Update</th>
              </tr>
            </thead>
            <tbody id="monitorTableBody"></tbody>
          </table>
        </div>
      </div>
    `;
  }

  private generateStreamSection(): string {
    return `
      <div class="cv-tab-pane" id="streamSection">
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
            <tbody id="streamTableBody"></tbody>
          </table>
        </div>
      </div>
    `;
  }

  private bindEvents(): void {
    // Tab switching
    this.shadow.querySelectorAll('.cv-tabs .cv-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = (tab as HTMLElement).dataset.tab;
        if (!tabName) return;
        this.switchTab(tabName);
      });
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
  // Capture Control
  // ─────────────────────────────────────────────────────────────────────────────

  async loadInterfaces(): Promise<void> {
    if (!this.api) return;
    try {
      const interfaces = await this.api.listCanInterfaces();
      emitLiveInterfacesLoaded({ interfaces });
    } catch (err) {
      console.warn('Could not load interfaces:', err);
    }
  }

  async startCapture(iface: string): Promise<void> {
    if (!this.api) return;
    try {
      this.clearAllData();
      this.state.isCapturing = true;
      this.state.currentInterface = iface;
      this.updateStoreStatus();
      await this.api.startCapture(iface);
      this.showMessage(`Capturing on ${iface}`);
      this.startStatsTimer();
      emitCaptureStarted({ interface: iface });
    } catch (err) {
      this.state.isCapturing = false;
      this.updateStoreStatus();
      this.showMessage(String(err), 'error');
    }
  }

  async stopCapture(): Promise<void> {
    if (!this.api) return;
    try {
      await this.api.stopCapture();

      // Flush remaining frames
      if (this.flushTimer !== null) {
        clearTimeout(this.flushTimer);
        this.flushTimer = null;
      }
      this.flushPendingFrames();

      const frameCount = this.frameBuffer.length;
      const iface = this.state.currentInterface;

      this.state.isCapturing = false;
      this.updateStoreStatus();
      this.stopStatsTimer();
      this.showMessage('Capture stopped');
      emitCaptureStopped({ interface: iface, frameCount });
    } catch (err) {
      this.showMessage(String(err), 'error');
    }
  }

  async exportLogs(): Promise<void> {
    if (!this.api || this.frameBuffer.length === 0) return;

    try {
      const path = await this.api.saveFileDialog(
        [{ name: 'MDF4 Files', extensions: ['mf4'] }],
        'capture.mf4'
      );
      if (!path) return;

      const frames = this.frameBuffer.toArray();
      const count = await this.api.exportLogs(path, frames);
      this.showMessage(`Exported ${count} frames to ${extractFilename(path)}`);
    } catch (err) {
      this.showMessage(String(err), 'error');
    }
  }

  clearAllData(): void {
    this.frameBuffer.clear();
    this.messageMonitor.clear();
    this.pendingFrames = [];
    this.renderMessageMonitor();
    this.renderFrameStream();
    this.updateStats();
    this.updateStoreStatus();
  }

  /** Update store with current status */
  private updateStoreStatus(): void {
    liveStore.set({
      isCapturing: this.state.isCapturing,
      currentInterface: this.state.currentInterface,
      frameCount: this.frameBuffer.length,
      messageCount: this.messageMonitor.size,
    });
  }

  /** Get current capture state */
  getIsCapturing(): boolean {
    return this.state.isCapturing;
  }

  /** Get current frame count */
  getFrameCount(): number {
    return this.frameBuffer.length;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Stats and Rendering
  // ─────────────────────────────────────────────────────────────────────────────

  private startStatsTimer(): void {
    this.statsTimer = window.setInterval(() => {
      this.updateMessageRates();
      this.updateStats();
    }, STATS_UPDATE_MS);
  }

  private stopStatsTimer(): void {
    if (this.statsTimer !== null) {
      clearInterval(this.statsTimer);
      this.statsTimer = null;
    }
  }

  private updateMessageRates(): void {
    const now = performance.now();
    for (const entry of this.messageMonitor.values()) {
      // Simple rate calculation based on last update
      const elapsed = (now - entry.lastUpdate) / 1000;
      if (elapsed > 0 && elapsed < 2) {
        entry.rate = Math.round(1 / elapsed);
      } else {
        entry.rate = 0;
      }
    }
  }

  private updateMessageMonitorNames(): void {
    for (const entry of this.messageMonitor.values()) {
      entry.messageName = this.getMessageName(entry.canId);
    }
  }

  private renderMessageMonitor(): void {
    const tbody = this.shadow.querySelector('#monitorTableBody');
    if (!tbody) return;

    const entries = Array.from(this.messageMonitor.values())
      .sort((a, b) => a.canId - b.canId);

    tbody.innerHTML = entries.map(entry => {
      const idHex = entry.canId.toString(16).toUpperCase().padStart(3, '0');
      const dataHex = entry.lastFrame.data
        .map(b => b.toString(16).toUpperCase().padStart(2, '0'))
        .join(' ');
      const age = ((performance.now() - entry.lastUpdate) / 1000).toFixed(1);

      return `
        <tr class="clickable" data-can-id="${entry.canId}">
          <td class="cv-cell-id">0x${idHex}</td>
          <td class="cv-cell-name">${entry.messageName}</td>
          <td class="cv-cell-data">${dataHex}</td>
          <td>${entry.count}</td>
          <td>${entry.rate}/s</td>
          <td class="cv-cell-dim">${age}s ago</td>
        </tr>
      `;
    }).join('');

    // Update badge
    const countEl = this.shadow.querySelector('#messageCount');
    if (countEl) countEl.textContent = String(entries.length);
  }

  private renderFrameStream(): void {
    const tbody = this.shadow.querySelector('#streamTableBody');
    if (!tbody) return;

    // Only show last N frames for performance
    const frames = this.frameBuffer.last(MAX_DISPLAYED_FRAMES);

    tbody.innerHTML = frames.map(frame => {
      const idHex = frame.can_id.toString(16).toUpperCase().padStart(3, '0');
      const dataHex = frame.data
        .map(b => b.toString(16).toUpperCase().padStart(2, '0'))
        .join(' ');
      const msgName = this.getMessageName(frame.can_id);
      const flags = this.formatFlags(frame);

      return `
        <tr>
          <td class="cv-cell-dim">${frame.timestamp.toFixed(6)}</td>
          <td>${frame.channel}</td>
          <td class="cv-cell-id">0x${idHex}</td>
          <td class="cv-cell-name">${msgName}</td>
          <td>${frame.dlc}</td>
          <td class="cv-cell-data">${dataHex}</td>
          <td>${flags}</td>
        </tr>
      `;
    }).join('');

    // Update badge
    const countEl = this.shadow.querySelector('#frameCount');
    if (countEl) countEl.textContent = String(this.frameBuffer.length);
  }

  private updateStats(): void {
    const msgCount = this.shadow.querySelector('#statMsgCount');
    const frameCount = this.shadow.querySelector('#statFrameCount');
    const frameRate = this.shadow.querySelector('#statFrameRate');
    const bufferUsage = this.shadow.querySelector('#statBufferUsage');

    if (msgCount) msgCount.textContent = String(this.messageMonitor.size);
    if (frameCount) frameCount.textContent = String(this.frameBuffer.length);

    // Calculate aggregate frame rate
    let totalRate = 0;
    for (const entry of this.messageMonitor.values()) {
      totalRate += entry.rate;
    }
    if (frameRate) frameRate.textContent = `${totalRate}/s`;

    // Buffer usage
    const usage = (this.frameBuffer.length / DEFAULT_BUFFER_SIZE) * 100;
    if (bufferUsage) bufferUsage.textContent = `${usage.toFixed(0)}%`;
  }

  private getMessageName(canId: number): string {
    if (!this.state.dbcInfo) return '-';
    const msg = this.state.dbcInfo.messages.find(m => m.id === canId);
    return msg?.name || '-';
  }

  private formatFlags(frame: CanFrame): string {
    const flags: string[] = [];
    if (frame.is_extended) flags.push('EXT');
    if (frame.is_fd) flags.push('FD');
    if (frame.brs) flags.push('BRS');
    if (frame.esi) flags.push('ESI');
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

customElements.define('cv-live-viewer', LiveViewerElement);
