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
      </header>

      ${generateFiltersSection()}
      ${generateTablesContainer()}
      ${generateDbcViewer()}
    </div>
  `;
}

function generateHeaderTop(): string {
  return `
    <div class="cv-header-top">
      <h1 class="cv-title">CAN Data Viewer</h1>
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
      <button class="cv-dbc-status-btn" id="dbcStatusBtn">No DBC loaded</button>
    </div>
  `;
}

function generateTabs(config: Required<CanViewerConfig>): string {
  return `
    <div class="cv-tabs">
      ${config.showMdf4Tab ? '<button class="cv-tab-btn" data-tab="mdf4">MDF4</button>' : ''}
      ${config.showLiveTab ? '<button class="cv-tab-btn" data-tab="live">Live Capture</button>' : ''}
      ${config.showDbcTab ? '<button class="cv-tab-btn" data-tab="dbc">DBC</button>' : ''}
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
] as const;

export type ElementId = typeof ELEMENT_IDS[number];
