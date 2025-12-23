import type { CanViewerConfig } from './types';

/** Generate the main HTML template for CAN Viewer */
export function generateTemplate(config: Required<CanViewerConfig>): string {
  return `
    <div class="cv-container">
      <header class="cv-header">
        ${generateHeaderTop()}
        ${generateTabs(config)}
        ${generateMdf4Tab()}
        ${generateLiveTab()}
        ${generateDbcTab()}
        ${generateAboutTab()}
      </header>

      ${generateFiltersSection()}
      ${generateTablesContainer()}
      ${generateDbcViewer()}
      ${generateAboutViewer()}
    </div>
  `;
}

function generateHeaderTop(): string {
  return `
    <div class="cv-header-top">
      <h1 class="cv-title">CAN Viewer</h1>
      <div class="cv-frame-stats" id="frameStats">
        <div class="cv-stat-item">
          <span class="cv-stat-label">Msgs</span>
          <span class="cv-stat-value" id="statMsgCount">0</span>
        </div>
        <div class="cv-stat-item">
          <span class="cv-stat-label">Rate</span>
          <span class="cv-stat-value" id="statFrameRate">0/s</span>
        </div>
        <div class="cv-stat-item">
          <span class="cv-stat-label">Δt</span>
          <span class="cv-stat-value" id="statDeltaTime">-</span>
        </div>
        <div class="cv-stat-item">
          <span class="cv-stat-label">Load</span>
          <span class="cv-stat-value" id="statBusLoad">0%</span>
        </div>
      </div>
      <button class="cv-dbc-status-btn" id="dbcStatusBtn">
        <span class="cv-dbc-status-label">DBC</span>
        <span class="cv-dbc-status-value" id="dbcStatusValue">No file loaded</span>
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
    <div class="cv-tabs">
      ${config.showMdf4Tab ? `<button class="cv-tab-btn" data-tab="mdf4" title="${mdf4Tooltip}">MDF4</button>` : ''}
      ${config.showLiveTab ? `<button class="cv-tab-btn" data-tab="live" title="${liveTooltip}">Live Capture</button>` : ''}
      ${config.showDbcTab ? `<button class="cv-tab-btn" data-tab="dbc" title="${dbcTooltip}">DBC</button>` : ''}
      ${config.showAboutTab ? `<button class="cv-tab-btn" data-tab="about" title="${aboutTooltip}">About</button>` : ''}
    </div>
  `;
}

function generateMdf4Tab(): string {
  return `
    <div id="mdf4Tab" class="cv-tab-content">
      <div class="cv-controls">
        <div class="cv-control-group">
          <button class="cv-btn cv-btn-primary" id="loadMdf4Btn">Load MDF4 File</button>
        </div>
        <div class="cv-control-group">
          <button class="cv-btn" id="clearDataBtn">Clear Data</button>
        </div>
        <div class="cv-control-group">
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
    <div id="liveTab" class="cv-tab-content">
      <cv-capture-controls class="cv-controls">
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
          <div class="cv-status">
            <span class="cv-status-dot" id="statusDot"></span>
            <span id="statusText">Idle</span>
          </div>
        </div>
        <div class="cv-control-group cv-control-right">
          <button class="cv-btn cv-btn-export" id="exportLogsBtn" disabled>Export Logs</button>
        </div>
      </cv-capture-controls>
    </div>
  `;
}

function generateDbcTab(): string {
  return `
    <div id="dbcTab" class="cv-tab-content">
      <div class="cv-controls">
        <div class="cv-control-group">
          <button class="cv-btn cv-btn-primary" id="loadDbcBtnTab">Load DBC File</button>
          <button class="cv-btn" id="clearDbcBtn" disabled>Clear DBC</button>
        </div>
      </div>
    </div>
  `;
}

function generateAboutTab(): string {
  return `
    <div id="aboutTab" class="cv-tab-content">
    </div>
  `;
}

function generateFiltersSection(): string {
  return `
    <cv-filters-panel class="cv-filters" id="filtersSection">
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
    </cv-filters-panel>
  `;
}

function generateTablesContainer(): string {
  return `
    <div class="cv-tables-container" id="tablesContainer">
      ${generateFramesPanel()}
      ${generateSignalsPanel()}
    </div>
  `;
}

function generateFramesPanel(): string {
  return `
    <cv-frames-table class="cv-table-panel" id="framesPanel">
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
    </cv-frames-table>
  `;
}

function generateSignalsPanel(): string {
  return `
    <cv-signals-panel class="cv-table-panel hidden" id="signalsPanel">
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
    </cv-signals-panel>
  `;
}

function generateDbcViewer(): string {
  return `
    <cv-dbc-viewer class="cv-dbc-viewer hidden" id="dbcViewer">
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
    </cv-dbc-viewer>
  `;
}

function generateAboutViewer(): string {
  return `
    <div class="cv-about-viewer hidden" id="aboutViewer">
      <div class="cv-about-content">
        <h2>CAN Viewer</h2>
        <p class="cv-about-version">Version 0.1.0</p>
        <p class="cv-about-description">
          A desktop application for viewing and analyzing CAN bus data from MDF4 measurement files
          and live SocketCAN interfaces.
        </p>

        <h3>Acknowledgments</h3>
        <p class="cv-about-thanks">
          This project is made possible by the following open source libraries:
        </p>

        <div class="cv-about-deps">
          <div class="cv-about-deps-section">
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

          <div class="cv-about-deps-section">
            <h4>Frontend Dependencies</h4>
            <ul>
              <li><a href="https://www.npmjs.com/package/@tauri-apps/api" target="_blank">@tauri-apps/api</a> - Frontend bindings for Tauri</li>
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
  `;
}

/** Element IDs used in the template */
export const ELEMENT_IDS = [
  'dbcStatusBtn', 'clearDbcBtn', 'loadMdf4Btn', 'clearDataBtn',
  'interfaceSelect', 'refreshInterfacesBtn', 'startCaptureBtn', 'stopCaptureBtn',
  'clearLiveDataBtn', 'statusDot', 'statusText', 'exportLogsBtn', 'tablesContainer',
  'framesPanel', 'signalsPanel', 'framesTableBody', 'signalsTableBody', 'framesCount',
  'signalsCount', 'framesTableWrapper', 'signalsTableWrapper', 'dbcViewer',
  'dbcMessagesList', 'dbcDetailsTitle', 'dbcDetailsSubtitle', 'dbcDetailsContent',
  'loadDbcBtnTab', 'filtersSection', 'filterTimeMin', 'filterTimeMax', 'filterCanId',
  'filterMessage', 'filterCount', 'clearFiltersBtn',
  'frameStats', 'statMsgCount', 'statFrameRate', 'statDeltaTime', 'statBusLoad',
  'aboutViewer', 'dbcStatusValue', 'mdf4StatusDot', 'mdf4StatusText',
] as const;

export type ElementId = typeof ELEMENT_IDS[number];
