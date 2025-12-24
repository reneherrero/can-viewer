import type { CanViewerConfig } from './types';

/** Generate the main HTML template for CAN Viewer */
export function generateTemplate(config: Required<CanViewerConfig>): string {
  return `
    <div class="cv-app">
      <header class="cv-app-header">
        ${generateHeaderTop()}
        ${generateTabs(config)}
        ${generateMdf4Tab()}
        ${generateLiveTab()}
        ${generateDbcTab()}
        ${generateAboutTab()}
      </header>

      ${generateDataPanel()}
      ${generateDbcViewer()}
      ${generateAboutViewer()}
    </div>
  `;
}

function generateHeaderTop(): string {
  return `
    <div class="cv-app-header-top">
      <h1 class="cv-app-title">CAN Viewer</h1>
      <div class="cv-stats" id="frameStats">
        <div class="cv-stat">
          <span class="cv-stat-label">Msgs</span>
          <span class="cv-stat-value" id="statMsgCount">0</span>
        </div>
        <div class="cv-stat">
          <span class="cv-stat-label">Rate</span>
          <span class="cv-stat-value" id="statFrameRate">0/s</span>
        </div>
        <div class="cv-stat">
          <span class="cv-stat-label">Δt</span>
          <span class="cv-stat-value" id="statDeltaTime">-</span>
        </div>
        <div class="cv-stat">
          <span class="cv-stat-label">Load</span>
          <span class="cv-stat-value" id="statBusLoad">0%</span>
        </div>
      </div>
      <button class="cv-stat clickable" id="dbcStatusBtn">
        <span class="cv-stat-label">DBC</span>
        <span class="cv-stat-value muted" id="dbcStatusValue">No file loaded</span>
      </button>
    </div>
  `;
}

function generateTabs(config: Required<CanViewerConfig>): string {
  const mdf4Tooltip = 'Load and view CAN data from ASAM MDF4 measurement files. Supports raw frames and pre-decoded signals.';
  const liveTooltip = 'Capture live CAN frames from SocketCAN interfaces in real-time.';
  const dbcTooltip = 'View and manage DBC (CAN Database) files. DBC defines message and signal decoding rules.';
  const aboutTooltip = 'About CAN Viewer and acknowledgments.';

  return `
    <div class="cv-tabs bordered">
      ${config.showMdf4Tab ? `<button class="cv-tab" data-tab="mdf4" title="${mdf4Tooltip}">MDF4</button>` : ''}
      ${config.showLiveTab ? `<button class="cv-tab" data-tab="live" title="${liveTooltip}">Live Capture</button>` : ''}
      ${config.showDbcTab ? `<button class="cv-tab" data-tab="dbc" title="${dbcTooltip}">DBC</button>` : ''}
      ${config.showAboutTab ? `<button class="cv-tab" data-tab="about" title="${aboutTooltip}">About</button>` : ''}
    </div>
  `;
}

function generateMdf4Tab(): string {
  return `
    <div id="mdf4Tab" class="cv-tab-pane">
      <div class="cv-toolbar">
        <div class="cv-toolbar-group">
          <button class="cv-btn primary" id="loadMdf4Btn">Open</button>
        </div>
        <div class="cv-toolbar-group">
          <button class="cv-btn" id="clearDataBtn">Clear Data</button>
        </div>
        <div class="cv-toolbar-group">
          <div class="cv-status">
            <span class="cv-status-dot" id="mdf4StatusDot"></span>
            <span id="mdf4StatusText">No file loaded</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateLiveTab(): string {
  return `
    <div id="liveTab" class="cv-tab-pane">
      <cv-capture-controls class="cv-toolbar">
        <div class="cv-toolbar-group">
          <label>Interface:</label>
          <select class="cv-select" id="interfaceSelect">
            <option value="">Select CAN interface...</option>
          </select>
          <button class="cv-btn" id="refreshInterfacesBtn">↻</button>
        </div>
        <div class="cv-toolbar-group">
          <button class="cv-btn success" id="startCaptureBtn" disabled>Start Capture</button>
          <button class="cv-btn danger" id="stopCaptureBtn" disabled>Stop Capture</button>
        </div>
        <div class="cv-toolbar-group">
          <button class="cv-btn" id="clearLiveDataBtn">Clear Data</button>
          <div class="cv-status">
            <span class="cv-status-dot" id="statusDot"></span>
            <span id="statusText">Idle</span>
          </div>
        </div>
        <div class="cv-toolbar-group right">
          <button class="cv-btn" id="exportLogsBtn" disabled>Export Logs</button>
        </div>
      </cv-capture-controls>
    </div>
  `;
}

function generateDbcTab(): string {
  return `
    <div id="dbcTab" class="cv-tab-pane">
      <div class="cv-toolbar">
        <div class="cv-toolbar-group">
          <button class="cv-btn" id="dbcNewBtn">New</button>
          <button class="cv-btn" id="dbcOpenBtn">Open</button>
        </div>
        <div class="cv-toolbar-group">
          <button class="cv-btn primary" id="dbcEditBtn">Edit</button>
          <button class="cv-btn" id="dbcCancelBtn" style="display:none">Cancel</button>
        </div>
        <div class="cv-toolbar-group">
          <button class="cv-btn" id="dbcSaveBtn" disabled>Save</button>
          <button class="cv-btn" id="dbcSaveAsBtn" disabled>Save As</button>
        </div>
        <div class="cv-toolbar-group">
          <div class="cv-status">
            <span class="cv-status-dot" id="dbcStatusDot"></span>
            <span id="dbcStatusText">No file loaded</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateAboutTab(): string {
  return `
    <div id="aboutTab" class="cv-tab-pane">
      <div class="cv-toolbar cv-about-header">
        <div class="cv-about-title-group">
          <span class="cv-about-title">CAN Viewer</span>
          <span class="cv-about-version">v0.1.2</span>
        </div>
        <div class="cv-about-desc">
          A desktop application for viewing and analyzing CAN bus data from MDF4 measurement files
          and live SocketCAN interfaces. Includes a built-in DBC editor for creating and modifying
          CAN database files.
        </div>
      </div>
    </div>
  `;
}

function generateDataPanel(): string {
  return `
    <div class="cv-panel" id="dataPanel">
      <div class="cv-panel-header">
        <div class="cv-tabs">
          <button class="cv-tab active" data-tab="data">CAN Frames <span class="cv-tab-badge" id="framesCount">0</span></button>
          <button class="cv-tab" data-tab="filters">Filters <span class="cv-tab-badge dimmed" id="filterCount">0</span></button>
        </div>
      </div>
      <div class="cv-panel-body flush">
        ${generateDataSection()}
        ${generateFiltersSection()}
      </div>
    </div>
  `;
}

function generateFiltersSection(): string {
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

function generateDataSection(): string {
  return `
    <div class="cv-tab-pane active" id="dataSection">
      <div class="cv-grid responsive">
        <cv-frames-table class="cv-card" id="framesTable">
          <div class="cv-card-header">
            <span class="cv-card-title">Raw CAN Frames</span>
            <span class="cv-filter-link" id="filterLink"></span>
          </div>
          <div class="cv-table-wrap" id="framesTableWrapper">
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
          <div class="cv-table-wrap" id="signalsTableWrapper">
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

function generateDbcViewer(): string {
  return `
    <cv-dbc-editor class="cv-panel hidden" id="dbcEditor"></cv-dbc-editor>
  `;
}

function generateAboutViewer(): string {
  return `
    <div class="cv-panel hidden" id="aboutViewer">
      <div class="cv-panel-header">
        <div class="cv-tabs">
          <button class="cv-tab active" data-tab="features">Features</button>
          <button class="cv-tab" data-tab="acknowledgments">Acknowledgments</button>
        </div>
      </div>
      <div class="cv-panel-body">
        <div class="cv-tab-pane active" id="aboutFeatures">
          <div class="cv-feature-grid">
            <div class="cv-feature-card">
              <h4>MDF4 File Support</h4>
              <p>Load and analyze CAN data from ASAM MDF4 measurement files. View raw frames with timestamps, channels, and data bytes.</p>
            </div>
            <div class="cv-feature-card">
              <h4>Live SocketCAN Capture</h4>
              <p>Capture CAN frames in real-time from Linux SocketCAN interfaces. Monitor bus activity with live statistics.</p>
            </div>
            <div class="cv-feature-card">
              <h4>DBC Signal Decoding</h4>
              <p>Decode raw CAN frames into physical values using DBC database files. View signal names, values, and units.</p>
            </div>
            <div class="cv-feature-card">
              <h4>Built-in DBC Editor</h4>
              <p>Create and modify DBC files directly in the application. Edit messages, signals, and node definitions.</p>
            </div>
            <div class="cv-feature-card">
              <h4>Advanced Filtering</h4>
              <p>Filter frames by time range, CAN ID, or message name. Quickly find the data you need.</p>
            </div>
            <div class="cv-feature-card">
              <h4>Log Export</h4>
              <p>Export captured CAN frames to MDF4 format for later analysis or sharing.</p>
            </div>
          </div>
        </div>
        <div class="cv-tab-pane" id="aboutAcknowledgments">
          <p class="cv-about-intro">
            This project is made possible by the following open source libraries:
          </p>

          <div class="cv-deps-grid">
            <div class="cv-deps-section">
              <h4>Rust Dependencies</h4>
              <ul>
                <li><a href="https://crates.io/crates/tauri" target="_blank">tauri</a> - Build desktop apps with web technologies</li>
                <li><a href="https://crates.io/crates/mdf4-rs" target="_blank">mdf4-rs</a> - ASAM MDF4 measurement data file parser</li>
                <li><a href="https://crates.io/crates/dbc-rs" target="_blank">dbc-rs</a> - CAN database (DBC) file parser</li>
                <li><a href="https://crates.io/crates/socketcan" target="_blank">socketcan</a> - Linux SocketCAN interface bindings</li>
                <li><a href="https://crates.io/crates/embedded-can" target="_blank">embedded-can</a> - Standard CAN frame types</li>
                <li><a href="https://crates.io/crates/tokio" target="_blank">tokio</a> - Async runtime for Rust</li>
                <li><a href="https://crates.io/crates/serde" target="_blank">serde</a> - Serialization framework</li>
                <li><a href="https://crates.io/crates/clap" target="_blank">clap</a> - Command line argument parsing</li>
                <li><a href="https://crates.io/crates/thiserror" target="_blank">thiserror</a> - Ergonomic error handling</li>
                <li><a href="https://crates.io/crates/dirs" target="_blank">dirs</a> - Platform-specific directories</li>
              </ul>
            </div>

            <div class="cv-deps-section">
              <h4>Frontend Dependencies</h4>
              <ul>
                <li><a href="https://www.npmjs.com/package/@tauri-apps/api" target="_blank">@tauri-apps/api</a> - Frontend bindings for Tauri</li>
                <li><a href="https://www.npmjs.com/package/@tauri-apps/plugin-dialog" target="_blank">@tauri-apps/plugin-dialog</a> - File dialog plugin</li>
                <li><a href="https://vite.dev" target="_blank">Vite</a> - Next generation frontend tooling</li>
                <li><a href="https://www.typescriptlang.org" target="_blank">TypeScript</a> - Typed JavaScript</li>
                <li><a href="https://vitest.dev" target="_blank">Vitest</a> - Unit testing framework</li>
                <li><a href="https://eslint.org" target="_blank">ESLint</a> - Code linting</li>
              </ul>
            </div>
          </div>

          <p class="cv-about-license">
            Licensed under MIT or Apache-2.0
          </p>
        </div>
      </div>
    </div>
  `;
}

/** Element IDs used in the template */
export const ELEMENT_IDS = [
  'dbcStatusBtn', 'loadMdf4Btn', 'clearDataBtn',
  'interfaceSelect', 'refreshInterfacesBtn', 'startCaptureBtn', 'stopCaptureBtn',
  'clearLiveDataBtn', 'statusDot', 'statusText', 'exportLogsBtn', 'dataPanel',
  'dataSection', 'framesTable', 'signalsPanel', 'framesTableBody', 'signalsTableBody',
  'framesCount', 'signalsCount', 'framesTableWrapper', 'signalsTableWrapper', 'dbcEditor',
  'filtersSection', 'filterTimeMin', 'filterTimeMax', 'filterCanId',
  'filterMessage', 'filterCount', 'clearFiltersBtn', 'filterLink', 'filterSummary',
  'frameStats', 'statMsgCount', 'statFrameRate', 'statDeltaTime', 'statBusLoad',
  'dbcNewBtn', 'dbcOpenBtn', 'dbcEditBtn', 'dbcCancelBtn', 'dbcSaveBtn', 'dbcSaveAsBtn',
  'dbcStatusDot', 'dbcStatusText',
  'aboutViewer', 'dbcStatusValue', 'mdf4StatusDot', 'mdf4StatusText',
] as const;

export type ElementId = typeof ELEMENT_IDS[number];
