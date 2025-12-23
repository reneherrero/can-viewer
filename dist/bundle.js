(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();class w{invoke;listen;openDialog;saveDialog;constructor(){this.invoke=async()=>{throw new Error("Tauri not initialized")},this.listen=async()=>()=>{},this.openDialog=async()=>null,this.saveDialog=async()=>null}async init(){const e=window.__TAURI__;if(!e)throw new Error("Tauri API not available");this.invoke=e.core.invoke,this.listen=e.event.listen,this.openDialog=e.dialog.open,this.saveDialog=e.dialog.save}async loadDbc(e){return await this.invoke("load_dbc",{path:e})}async clearDbc(){await this.invoke("clear_dbc")}async getDbcInfo(){return await this.invoke("get_dbc_info")}async getDbcPath(){return await this.invoke("get_dbc_path")}async decodeFrames(e){return await this.invoke("decode_frames",{frames:e})}async loadMdf4(e){return await this.invoke("load_mdf4",{path:e})}async exportLogs(e,t){return await this.invoke("export_logs",{path:e,frames:t})}async listCanInterfaces(){return await this.invoke("list_can_interfaces")}async startCapture(e){await this.invoke("start_capture",{interface:e})}async stopCapture(){await this.invoke("stop_capture")}async getInitialFiles(){return await this.invoke("get_initial_files")}async openFileDialog(e){return await this.openDialog({multiple:!1,filters:e})}async saveFileDialog(e,t){return await this.saveDialog({filters:e,defaultPath:t})}onCanFrame(e){let t=null;return this.listen("can-frame",a=>{e(a.payload)}).then(a=>{t=a}),()=>{t&&t()}}onDecodedSignal(e){let t=null;return this.listen("decoded-signal",a=>{e(a.payload)}).then(a=>{t=a}),()=>{t&&t()}}onCaptureError(e){let t=null;return this.listen("capture-error",a=>{e(a.payload)}).then(a=>{t=a}),()=>{t&&t()}}}const S="modulepreload",C=function(s){return"/"+s},h={},M=function(e,t,a){let i=Promise.resolve();if(t&&t.length>0){let n=function(l){return Promise.all(l.map(d=>Promise.resolve(d).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),p=c?.nonce||c?.getAttribute("nonce");i=n(t.map(l=>{if(l=C(l),l in h)return;h[l]=!0;const d=l.endsWith(".css"),u=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${u}`))return;const o=document.createElement("link");if(o.rel=d?"stylesheet":S,d||(o.as="script"),o.crossOrigin="",o.href=l,p&&o.setAttribute("nonce",p),document.head.appendChild(o),d)return new Promise((x,y)=>{o.addEventListener("load",x),o.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(n){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=n,window.dispatchEvent(c),!c.defaultPrevented)throw n}return i.then(n=>{for(const c of n||[])c.status==="rejected"&&r(c.reason);return e().catch(r)})};function F(s){return`
    <div class="cv-container">
      <header class="cv-header">
        ${D()}
        ${T(s)}
        ${k()}
        ${L()}
        ${E()}
        ${I()}
      </header>

      ${B()}
      ${$()}
      ${q()}
      ${P()}
    </div>
  `}function D(){return`
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
  `}function T(s){return`
    <div class="cv-tabs">
      ${s.showMdf4Tab?'<button class="cv-tab-btn" data-tab="mdf4" title="Load and view CAN data from ASAM MDF4 measurement files. Supports raw frames and pre-decoded signals.">MDF4</button>':""}
      ${s.showLiveTab?'<button class="cv-tab-btn" data-tab="live" title="Capture live CAN frames from SocketCAN interfaces in real-time.">Live Capture</button>':""}
      ${s.showDbcTab?'<button class="cv-tab-btn" data-tab="dbc" title="View and manage DBC (CAN Database) files. DBC defines message and signal decoding rules.">DBC</button>':""}
      ${s.showAboutTab?'<button class="cv-tab-btn" data-tab="about" title="About CAN Viewer and acknowledgments.">About</button>':""}
    </div>
  `}function k(){return`
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
  `}function L(){return`
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
  `}function E(){return`
    <div id="dbcTab" class="cv-tab-content">
      <div class="cv-controls">
        <div class="cv-control-group">
          <button class="cv-btn cv-btn-primary" id="loadDbcBtnTab">Load DBC File</button>
          <button class="cv-btn" id="clearDbcBtn" disabled>Clear DBC</button>
        </div>
      </div>
    </div>
  `}function I(){return`
    <div id="aboutTab" class="cv-tab-content">
    </div>
  `}function B(){return`
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
  `}function $(){return`
    <div class="cv-tables-container" id="tablesContainer">
      ${_()}
      ${A()}
    </div>
  `}function _(){return`
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
  `}function A(){return`
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
  `}function q(){return`
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
  `}function P(){return`
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
              <li><a href="https://crates.io/crates/mdf4-rs" target="_blank">mdf4-rs</a> - ASAM MDF4 measurement data file parser</li>
              <li><a href="https://crates.io/crates/dbc-rs" target="_blank">dbc-rs</a> - CAN database (DBC) file parser</li>
              <li><a href="https://crates.io/crates/tauri" target="_blank">tauri</a> - Build desktop apps with web technologies</li>
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
  `}const N=["dbcStatusBtn","clearDbcBtn","loadMdf4Btn","clearDataBtn","interfaceSelect","refreshInterfacesBtn","startCaptureBtn","stopCaptureBtn","clearLiveDataBtn","statusDot","statusText","exportLogsBtn","tablesContainer","framesPanel","signalsPanel","framesTableBody","signalsTableBody","framesCount","signalsCount","framesTableWrapper","signalsTableWrapper","dbcViewer","dbcMessagesList","dbcDetailsTitle","dbcDetailsSubtitle","dbcDetailsContent","loadDbcBtnTab","filtersSection","filterTimeMin","filterTimeMax","filterCanId","filterMessage","filterCount","clearFiltersBtn","frameStats","statMsgCount","statFrameRate","statDeltaTime","statBusLoad","aboutViewer","dbcStatusValue","mdf4StatusDot","mdf4StatusText"],z={showDbcTab:!0,showLiveTab:!0,showMdf4Tab:!0,showAboutTab:!0,initialTab:"mdf4",autoScroll:!0,maxFrames:1e4,maxSignals:1e4};function V(){return{timeMin:null,timeMax:null,canIds:null,messages:null}}function H(s){const e=s.trim();if(!e)return null;const t=e.split(",").map(a=>a.trim()).filter(a=>a.length>0).map(a=>parseInt(a,16)).filter(a=>!isNaN(a));return t.length>0?t:null}function R(s){const e=s.trim().toLowerCase();if(!e)return null;const t=e.split(",").map(a=>a.trim().toLowerCase()).filter(a=>a.length>0);return t.length>0?t:null}function f(s){const e={...z,...s};return{frames:[],filteredFrames:[],signals:[],dbcInfo:null,dbcLoaded:!1,isCapturing:!1,activeTab:e.initialTab,selectedMessageId:null,selectedFrameIndex:null,filters:V(),config:e}}function U(s,e){s.frames.push(e),s.frames.length>s.config.maxFrames&&(s.frames=s.frames.slice(-Math.floor(s.config.maxFrames/2)))}function j(s,e){s.signals.push(e),s.signals.length>s.config.maxSignals&&(s.signals=s.signals.slice(-Math.floor(s.config.maxSignals/2)))}function O(s){s.frames=[],s.signals=[],s.filteredFrames=[],s.selectedFrameIndex=null}function b(s,e,t=null){s.dbcLoaded=e,s.dbcInfo=t,e||(s.selectedMessageId=null)}function g(s,e){if(!s.dbcInfo?.messages)return"-";const t=s.dbcInfo.messages.find(a=>a.id===e);return t?t.name:"-"}function W(s){return s.frames.filter(e=>{if(s.filters.timeMin!==null&&e.timestamp<s.filters.timeMin||s.filters.timeMax!==null&&e.timestamp>s.filters.timeMax||s.filters.canIds?.length&&!s.filters.canIds.includes(e.can_id))return!1;if(s.filters.messages?.length){const t=g(s,e.can_id).toLowerCase();if(!s.filters.messages.some(a=>t.includes(a)))return!1}return!0})}function v(s){s.filteredFrames=W(s)}function X(s,e){s.selectedFrameIndex=e}function J(s){return s.selectedFrameIndex===null?null:s.filteredFrames[s.selectedFrameIndex]||null}function K(s,e){s.isCapturing=e}function Y(s,e){s.activeTab=e}function G(s){const e=s.frames;if(e.length===0)return{uniqueMessages:0,frameRate:0,avgDeltaMs:0,busLoad:0};const a=new Set(e.map(d=>d.can_id)).size,i=Math.min(e.length,100),r=e.slice(-i);let n=0,c=0;if(r.length>=2){const d=r[0].timestamp,o=r[r.length-1].timestamp-d;o>0&&(n=(r.length-1)/o,c=o/(r.length-1)*1e3)}const l=Math.min(100,n/5e3*100);return{uniqueMessages:a,frameRate:n,avgDeltaMs:c,busLoad:l}}const Q=':host{--cv-bg: #0a0a0a;--cv-bg-secondary: #111;--cv-bg-header: #1a1a1a;--cv-text: #ccc;--cv-text-muted: #666;--cv-text-dim: #444;--cv-border: #222;--cv-success: #22c55e;--cv-danger: #ef4444;--cv-warning: #f59e0b;--cv-accent: #3b82f6;display:block;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;background:var(--cv-bg);color:var(--cv-text);color-scheme:dark}*{margin:0;padding:0;box-sizing:border-box}.cv-container{max-width:1800px;margin:0 auto;padding:20px}.cv-header{background:var(--cv-bg-secondary);padding:15px 20px;border-radius:4px;margin-bottom:20px;box-shadow:0 0 0 1px var(--cv-border)}.cv-header-top{display:flex;align-items:center;margin-bottom:15px;gap:16px}.cv-title{font-size:1.2rem;color:var(--cv-text-muted);font-weight:500}.cv-frame-stats{display:flex;gap:16px;margin-left:auto;margin-right:16px}.cv-stat-item{display:flex;flex-direction:column;align-items:center;padding:4px 10px;background:var(--cv-bg-secondary);border:1px solid var(--cv-border);border-radius:4px;min-width:60px}.cv-stat-label{font-size:.65rem;color:var(--cv-text-dim);text-transform:uppercase;letter-spacing:.5px}.cv-stat-value{font-size:.85rem;font-weight:600;color:var(--cv-text);font-family:ui-monospace,monospace}.cv-dbc-status-btn{display:flex;flex-direction:column;align-items:center;padding:4px 10px;background:var(--cv-bg-secondary);border:1px solid var(--cv-border);border-radius:4px;min-width:60px;cursor:pointer;transition:all .15s}.cv-dbc-status-btn:hover{background:var(--cv-bg-header);border-color:#333}.cv-dbc-status-btn.loaded{border-color:#22c55e4d}.cv-dbc-status-btn.loaded:hover{background:#22c55e1a}.cv-dbc-status-label{font-size:.65rem;color:var(--cv-text-dim);text-transform:uppercase;letter-spacing:.5px}.cv-dbc-status-value{font-size:.85rem;font-weight:600;color:var(--cv-text-dim)}.cv-dbc-status-btn.loaded .cv-dbc-status-value{color:var(--cv-success)}.cv-tabs{display:flex;gap:0;border-bottom:1px solid var(--cv-border);margin-bottom:15px}.cv-tab-btn{padding:10px 20px;border:none;border-bottom:2px solid transparent;background:transparent;color:var(--cv-text-muted);cursor:pointer;font-size:.9rem;font-weight:500;transition:all .15s}.cv-tab-btn:hover{color:var(--cv-text);background:var(--cv-bg-header)}.cv-tab-btn.active{color:var(--cv-accent);border-bottom-color:var(--cv-accent)}.cv-tab-content{display:none}.cv-tab-content.active{display:block}.cv-controls{display:flex;flex-wrap:wrap;gap:15px;align-items:center}.cv-control-group{display:flex;gap:10px;align-items:center}.cv-control-group.cv-control-right{margin-left:auto}.cv-control-group label{font-size:.9rem;color:var(--cv-text-muted)}.cv-btn{padding:6px 12px;border:1px solid var(--cv-border);border-radius:3px;cursor:pointer;font-size:.8rem;transition:all .15s;background:var(--cv-bg-secondary);color:var(--cv-text-muted)}.cv-btn:hover:not(:disabled){background:var(--cv-bg-header);color:var(--cv-text)}.cv-btn:disabled{opacity:.3;cursor:not-allowed}.cv-btn-primary{background:#333;color:var(--cv-text);border-color:#444}.cv-btn-primary:hover:not(:disabled){background:#444}.cv-btn-success{background:var(--cv-success);color:#000;border-color:var(--cv-success)}.cv-btn-success:hover:not(:disabled){filter:brightness(1.1)}.cv-btn-danger{background:var(--cv-danger);color:#fff;border-color:var(--cv-danger)}.cv-btn-danger:hover:not(:disabled){filter:brightness(1.1)}.cv-select,.cv-input{padding:6px 10px;border:1px solid var(--cv-border);border-radius:3px;background:var(--cv-bg);color:var(--cv-text-muted);font-size:.8rem}.cv-select:focus,.cv-input:focus{outline:1px solid #555;outline-offset:-1px}.cv-select option{font-weight:700;color:var(--cv-text)}.cv-select option[value=""]{font-weight:400;color:var(--cv-text-muted)}.cv-status{display:flex;align-items:center;gap:8px;font-size:.85rem;color:var(--cv-text-muted)}.cv-status-dot{width:8px;height:8px;border-radius:50%;background:#333}.cv-status-dot.connected{background:var(--cv-success);box-shadow:0 0 6px var(--cv-success)}.cv-btn-export{background:#000;color:#fff;border-color:#333}.cv-btn-export:hover:not(:disabled){background:#222}.cv-tables-container{display:grid;grid-template-columns:1fr;gap:20px}.cv-tables-container.with-signals{grid-template-columns:1fr 1fr}@media(max-width:1200px){.cv-tables-container.with-signals{grid-template-columns:1fr}}.cv-tables-container.hidden{display:none}.cv-table-panel{background:var(--cv-bg-secondary);box-shadow:0 0 0 1px var(--cv-border);border-radius:4px;overflow:hidden}.cv-table-panel.hidden{display:none}.cv-table-header{display:flex;justify-content:space-between;align-items:center;padding:10px 16px;background:var(--cv-bg-header);border-bottom:1px solid var(--cv-border);border-radius:4px 4px 0 0}.cv-table-title{font-size:.85rem;font-weight:500;color:var(--cv-text-muted);text-transform:uppercase;letter-spacing:.5px}.cv-table-info{font-size:.8rem;color:var(--cv-text-muted)}.cv-table-wrapper{height:500px;overflow-y:auto}.cv-table{width:100%;border-collapse:collapse;font-size:.85rem}.cv-table th{position:sticky;top:0;background:var(--cv-bg-secondary);padding:8px 12px;text-align:left;font-weight:500;font-size:.75rem;color:var(--cv-text-muted);text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--cv-border)}.cv-table td{padding:8px 12px;border-bottom:1px solid var(--cv-border);font-family:ui-monospace,Cascadia Code,Consolas,monospace;height:36px;line-height:20px}.cv-table tr{height:36px}.cv-table tr:hover{background:var(--cv-bg-header)}.cv-table tr.clickable{cursor:pointer}.cv-table tr.selected{background:#1e3a5f!important;border-left:3px solid var(--cv-accent)}.cv-table tr.selected td{color:#fff}.cv-timestamp{color:var(--cv-text-dim)}.cv-can-id{color:var(--cv-text);font-weight:600}.cv-message-name{color:var(--cv-accent);font-weight:500}.cv-hex-data{color:#888;letter-spacing:1px}.cv-signal-name{color:var(--cv-text)}.cv-physical-value{color:var(--cv-text);font-weight:600}.cv-unit{color:var(--cv-text-muted);font-style:italic}.cv-unit-highlight{color:var(--cv-text);font-weight:600}.cv-signals-empty{color:var(--cv-text-dim);text-align:center;padding:20px}.cv-filters{background:var(--cv-bg-secondary);box-shadow:0 0 0 1px var(--cv-border);border-radius:4px;margin-bottom:20px;overflow:hidden}.cv-filters.hidden{display:none}.cv-filters-header{display:flex;justify-content:space-between;align-items:center;padding:10px 16px;background:var(--cv-bg-header);border-bottom:1px solid var(--cv-border);border-radius:4px 4px 0 0}.cv-filters-title{font-size:.85rem;font-weight:500;color:var(--cv-text-muted);text-transform:uppercase;letter-spacing:.5px}.cv-filters-header-right{display:flex;align-items:center;gap:10px}.cv-filters-inputs{display:flex;flex-wrap:wrap;gap:16px;align-items:center;padding:12px 16px}.cv-filter-group{display:flex;align-items:center;gap:8px}.cv-filter-group label{font-size:.8rem;color:var(--cv-text-muted);white-space:nowrap}.cv-filter-input{padding:5px 8px;border:1px solid var(--cv-border);border-radius:3px;background:var(--cv-bg);color:var(--cv-text);font-size:.8rem;font-family:ui-monospace,monospace;width:100px}.cv-filter-input:focus{outline:1px solid var(--cv-accent);outline-offset:-1px}.cv-filter-input::placeholder{color:var(--cv-text-dim);opacity:1}.cv-filter-input:placeholder-shown{color:var(--cv-text-dim)}.cv-filter-input.wide{width:150px}.cv-filter-count{font-size:.75rem;color:var(--cv-text-muted);padding:3px 8px;background:var(--cv-bg);border-radius:3px}.cv-filters-header .cv-btn{padding:3px 10px;font-size:.75rem}.cv-dbc-viewer{display:grid;grid-template-columns:300px 1fr;gap:20px;height:calc(100vh - 200px)}.cv-dbc-viewer.hidden{display:none}.cv-dbc-messages-list{background:var(--cv-bg-secondary);border:1px solid var(--cv-border);border-radius:4px;overflow:hidden;display:flex;flex-direction:column}.cv-dbc-messages-header{padding:10px 16px;background:var(--cv-bg-header);border-bottom:1px solid var(--cv-border);font-size:.85rem;font-weight:500;color:var(--cv-text-muted);text-transform:uppercase;letter-spacing:.5px}.cv-dbc-messages-scroll{flex:1;overflow-y:auto}.cv-dbc-message-item{padding:10px 16px;border-bottom:1px solid var(--cv-border);cursor:pointer;transition:background .15s}.cv-dbc-message-item:hover{background:var(--cv-bg-header)}.cv-dbc-message-item.selected{background:var(--cv-bg-header);border-left:3px solid var(--cv-accent)}.cv-dbc-message-name{font-weight:500;color:var(--cv-text);font-size:.9rem}.cv-dbc-message-id{font-family:ui-monospace,monospace;color:var(--cv-text-muted);font-size:.8rem}.cv-dbc-message-meta{font-size:.75rem;color:var(--cv-text-dim);margin-top:2px}.cv-dbc-details{background:var(--cv-bg-secondary);border:1px solid var(--cv-border);border-radius:4px;overflow:hidden;display:flex;flex-direction:column}.cv-dbc-details-header{padding:10px 16px;background:var(--cv-bg-header);border-bottom:1px solid var(--cv-border)}.cv-dbc-details-title{font-size:1rem;font-weight:500;color:var(--cv-text)}.cv-dbc-details-subtitle{font-size:.8rem;color:var(--cv-text-muted);margin-top:4px}.cv-dbc-details-scroll{flex:1;overflow-y:auto;padding:16px}.cv-dbc-signal-card{background:var(--cv-bg);border:1px solid var(--cv-border);border-radius:4px;padding:12px;margin-bottom:10px}.cv-dbc-signal-name{font-weight:500;color:var(--cv-text);font-size:.9rem;margin-bottom:8px}.cv-dbc-signal-props{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;font-size:.8rem}.cv-dbc-signal-prop{display:flex;flex-direction:column}.cv-dbc-signal-prop-label{color:var(--cv-text-dim);font-size:.7rem;text-transform:uppercase}.cv-dbc-signal-prop-value{color:var(--cv-text-muted);font-family:ui-monospace,monospace}.cv-dbc-empty{display:flex;align-items:center;justify-content:center;height:100%;color:var(--cv-text-dim);font-size:.9rem}.cv-dbc-no-file{text-align:center;padding:40px;color:var(--cv-text-dim)}.cv-about-viewer{flex:1;overflow-y:auto;padding:40px;display:flex;justify-content:center}.cv-about-viewer.hidden{display:none}.cv-about-content{max-width:700px;width:100%}.cv-about-content h2{color:var(--cv-text);font-size:1.8rem;margin:0 0 8px}.cv-about-content h3{color:var(--cv-text);font-size:1.2rem;margin:32px 0 12px;border-bottom:1px solid var(--cv-border);padding-bottom:8px}.cv-about-content h4{color:var(--cv-text-muted);font-size:.95rem;margin:0 0 12px;text-transform:uppercase;letter-spacing:.5px}.cv-about-version{color:var(--cv-text-dim);font-size:.9rem;margin:0 0 20px}.cv-about-description{color:var(--cv-text-muted);line-height:1.6;margin:0 0 16px}.cv-about-thanks{color:var(--cv-text-muted);margin:0 0 20px}.cv-about-deps{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;margin:20px 0}.cv-about-deps-section{background:var(--cv-bg-alt);border:1px solid var(--cv-border);border-radius:6px;padding:16px 20px}.cv-about-deps-section ul{list-style:none;padding:0;margin:0}.cv-about-deps-section li{color:var(--cv-text-muted);font-size:.85rem;padding:6px 0;border-bottom:1px solid var(--cv-border)}.cv-about-deps-section li:last-child{border-bottom:none}.cv-about-deps-section li a{color:var(--cv-text);font-weight:600;text-decoration:none}.cv-about-deps-section li a:hover{color:var(--cv-success);text-decoration:underline}.cv-about-license{color:var(--cv-text-dim);font-size:.85rem;margin:32px 0 0;text-align:center}.cv-message{position:fixed;bottom:20px;right:20px;padding:12px 20px;border-radius:4px;font-size:.9rem;animation:cv-slideIn .3s ease;z-index:1000}.cv-message.success{background:var(--cv-success);color:#fff}.cv-message.error{background:var(--cv-danger);color:#fff}@keyframes cv-slideIn{0%{transform:translate(100%);opacity:0}to{transform:translate(0);opacity:1}}';function Z(s,e){return e?s.toString(16).toUpperCase().padStart(8,"0"):s.toString(16).toUpperCase().padStart(3,"0")}function ee(s){return s.map(e=>e.toString(16).toUpperCase().padStart(2,"0")).join(" ")}function te(s){const e=[];return s.is_extended&&e.push("EXT"),s.is_fd&&e.push("FD"),s.brs&&e.push("BRS"),s.esi&&e.push("ESI"),e.join(", ")||"-"}function se(s,e=6){return s.toFixed(e)}function ae(s,e=4){return s.toFixed(e)}const ie=500;class re extends HTMLElement{frames=[];selectedIndex=null;messageNameLookup=()=>"-";delegatedHandler=null;constructor(){super()}connectedCallback(){this.setupEventDelegation()}disconnectedCallback(){this.removeEventDelegation()}setupEventDelegation(){const e=this.querySelector("tbody");!e||this.delegatedHandler||(this.delegatedHandler=t=>{const i=t.target.closest("tr.clickable");i?.dataset.index&&this.selectFrame(parseInt(i.dataset.index,10))},e.addEventListener("click",this.delegatedHandler))}removeEventDelegation(){if(!this.delegatedHandler)return;const e=this.querySelector("tbody");e&&e.removeEventListener("click",this.delegatedHandler),this.delegatedHandler=null}setMessageNameLookup(e){this.messageNameLookup=e}setFrames(e){this.frames=e,this.render()}get frameCount(){return this.frames.length}clearSelection(){this.selectedIndex=null,this.updateSelection()}render(){const e=this.querySelector("tbody");if(!e)return;const t=Math.max(0,this.frames.length-ie),a=this.frames.slice(t);e.innerHTML=a.map((i,r)=>{const n=t+r;return`
      <tr class="clickable ${n===this.selectedIndex?"selected":""}" data-index="${n}">
        <td class="cv-timestamp">${se(i.timestamp)}</td>
        <td>${i.channel}</td>
        <td class="cv-can-id">${Z(i.can_id,i.is_extended)}</td>
        <td class="cv-message-name">${this.messageNameLookup(i.can_id)}</td>
        <td>${i.dlc}</td>
        <td class="cv-hex-data">${ee(i.data)}</td>
        <td>${te(i)}</td>
      </tr>
    `}).join(""),this.delegatedHandler||this.setupEventDelegation()}selectFrame(e){this.selectedIndex=e,this.updateSelection();const t=this.frames[e];t&&this.dispatchEvent(new CustomEvent("frame-selected",{detail:{frame:t,index:e},bubbles:!0}))}updateSelection(){const e=this.querySelector("tbody");e&&e.querySelectorAll("tr").forEach((t,a)=>{t.classList.toggle("selected",a===this.selectedIndex)})}scrollToBottom(){const e=this.querySelector(".cv-table-wrapper");e&&(e.scrollTop=e.scrollHeight)}}customElements.define("cv-frames-table",re);class ne extends HTMLElement{signals=[];constructor(){super()}setSignals(e){this.signals=e,this.render()}showEmpty(){this.signals=[];const e=this.querySelector("tbody"),t=this.querySelector(".cv-table-info");e&&(e.innerHTML='<tr><td colspan="3" class="cv-signals-empty">Select a frame to view decoded signals</td></tr>'),t&&(t.textContent="Select a frame")}render(){const e=this.querySelector("tbody"),t=this.querySelector(".cv-table-info");e&&(e.innerHTML=this.signals.map(a=>`
        <tr>
          <td class="cv-signal-name">${a.signal_name}</td>
          <td class="cv-physical-value">${ae(a.value)}</td>
          <td class="cv-unit-highlight">${a.unit||"-"}</td>
        </tr>
      `).join("")),t&&(t.textContent=`${this.signals.length} signals`)}scrollToBottom(){const e=this.querySelector(".cv-table-wrapper");e&&(e.scrollTop=e.scrollHeight)}}customElements.define("cv-signals-panel",ne);class ce extends HTMLElement{constructor(){super()}connectedCallback(){this.bindEvents()}bindEvents(){this.querySelectorAll(".cv-filter-input").forEach(a=>{a.addEventListener("input",()=>this.emitFilterChange())}),this.querySelector("#clearFiltersBtn")?.addEventListener("click",()=>this.clearFilters())}getFilters(){const e=this.getInputValue("filterTimeMin"),t=this.getInputValue("filterTimeMax"),a=this.getInputValue("filterCanId"),i=this.getInputValue("filterMessage");return{timeMin:e?parseFloat(e):null,timeMax:t?parseFloat(t):null,canIds:H(a),messages:R(i)}}clearFilters(){this.setInputValue("filterTimeMin",""),this.setInputValue("filterTimeMax",""),this.setInputValue("filterCanId",""),this.setInputValue("filterMessage",""),this.emitFilterChange()}setFilterCount(e,t){const a=this.querySelector("#filterCount");a&&(a.textContent=`${e} / ${t}`)}getInputValue(e){return this.querySelector(`#${e}`)?.value.trim()||""}setInputValue(e,t){const a=this.querySelector(`#${e}`);a&&(a.value=t)}emitFilterChange(){this.dispatchEvent(new CustomEvent("filter-change",{detail:this.getFilters(),bubbles:!0}))}}customElements.define("cv-filters-panel",ce);function le(s,e){return s?.messages?.length?s.messages.map(t=>`
    <div class="cv-dbc-message-item ${t.id===e?"selected":""}" data-id="${t.id}">
      <div class="cv-dbc-message-name">${t.name}</div>
      <div class="cv-dbc-message-id">0x${t.id.toString(16).toUpperCase()} (${t.id})</div>
      <div class="cv-dbc-message-meta">DLC: ${t.dlc} | ${t.signals.length} signals${t.sender?" | TX: "+t.sender:""}</div>
    </div>
  `).join(""):'<div class="cv-dbc-no-file">No DBC file loaded</div>'}function oe(s){return s.signals.length===0?'<div class="cv-dbc-empty">No signals defined for this message</div>':s.signals.map(e=>`
    <div class="cv-dbc-signal-card">
      <div class="cv-dbc-signal-name">${e.name}</div>
      <div class="cv-dbc-signal-props">
        <div class="cv-dbc-signal-prop"><span class="cv-dbc-signal-prop-label">Start Bit</span><span class="cv-dbc-signal-prop-value">${e.start_bit}</span></div>
        <div class="cv-dbc-signal-prop"><span class="cv-dbc-signal-prop-label">Length</span><span class="cv-dbc-signal-prop-value">${e.length} bits</span></div>
        <div class="cv-dbc-signal-prop"><span class="cv-dbc-signal-prop-label">Factor</span><span class="cv-dbc-signal-prop-value">${e.factor}</span></div>
        <div class="cv-dbc-signal-prop"><span class="cv-dbc-signal-prop-label">Offset</span><span class="cv-dbc-signal-prop-value">${e.offset}</span></div>
        <div class="cv-dbc-signal-prop"><span class="cv-dbc-signal-prop-label">Min</span><span class="cv-dbc-signal-prop-value">${e.min}</span></div>
        <div class="cv-dbc-signal-prop"><span class="cv-dbc-signal-prop-label">Max</span><span class="cv-dbc-signal-prop-value">${e.max}</span></div>
        <div class="cv-dbc-signal-prop"><span class="cv-dbc-signal-prop-label">Unit</span><span class="cv-dbc-signal-prop-value">${e.unit||"-"}</span></div>
      </div>
    </div>
  `).join("")}function de(s){return`ID: 0x${s.id.toString(16).toUpperCase()} | DLC: ${s.dlc}${s.sender?" | TX: "+s.sender:""}`}function ue(s){return'<option value="">Select CAN interface...</option>'+s.map(e=>`<option value="${e}">${e}</option>`).join("")}class pe extends HTMLElement{dbcInfo=null;selectedMessageId=null;constructor(){super()}setDbcInfo(e){this.dbcInfo=e,this.selectedMessageId=null,this.render()}render(){this.renderMessagesList(),this.renderDetails()}renderMessagesList(){const e=this.querySelector(".cv-dbc-messages-scroll");e&&(e.innerHTML=le(this.dbcInfo,this.selectedMessageId),this.bindMessageEvents(e))}bindMessageEvents(e){e.querySelectorAll(".cv-dbc-message-item").forEach(t=>{t.addEventListener("click",()=>{const a=parseInt(t.dataset.id||"0");this.selectMessage(a)})})}selectMessage(e){this.selectedMessageId=e,this.render();const t=this.getSelectedMessage();t&&this.dispatchEvent(new CustomEvent("message-selected",{detail:{message:t},bubbles:!0}))}getSelectedMessage(){return this.selectedMessageId===null||!this.dbcInfo?.messages?null:this.dbcInfo.messages.find(e=>e.id===this.selectedMessageId)||null}renderDetails(){const e=this.querySelector(".cv-dbc-details-title"),t=this.querySelector(".cv-dbc-details-subtitle"),a=this.querySelector(".cv-dbc-details-scroll"),i=this.getSelectedMessage();if(!i){e&&(e.textContent="Select a message"),t&&(t.textContent=""),a&&(a.innerHTML='<div class="cv-dbc-empty">Select a message to view its signals</div>');return}e&&(e.textContent=i.name),t&&(t.textContent=de(i)),a&&(a.innerHTML=oe(i))}}customElements.define("cv-dbc-viewer",pe);class ve extends HTMLElement{isCapturing=!1;hasFrames=!1;constructor(){super()}connectedCallback(){this.bindEvents()}bindEvents(){const e=this.querySelector("#startCaptureBtn"),t=this.querySelector("#stopCaptureBtn"),a=this.querySelector("#exportLogsBtn"),i=this.querySelector("#interfaceSelect");e?.addEventListener("click",()=>{const n=this.getSelectedInterface();n&&this.dispatchEvent(new CustomEvent("start-capture",{detail:{interface:n},bubbles:!0}))}),t?.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("stop-capture",{bubbles:!0}))}),a?.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("export-logs",{bubbles:!0}))}),i?.addEventListener("change",()=>this.updateButtons()),this.querySelector("#refreshInterfacesBtn")?.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("refresh-interfaces",{bubbles:!0}))})}setInterfaces(e){const t=this.querySelector("#interfaceSelect");t&&(t.innerHTML=ue(e)),this.updateButtons()}getSelectedInterface(){return this.querySelector("#interfaceSelect")?.value||""}setCaptureStatus(e){this.isCapturing=e;const t=this.querySelector("#statusDot"),a=this.querySelector("#statusText"),i=this.querySelector("#stopCaptureBtn");t?.classList.toggle("connected",e),a&&(a.textContent=e?"Capturing...":"Idle"),i&&(i.disabled=!e),this.updateButtons()}setHasFrames(e){this.hasFrames=e,this.updateButtons()}updateButtons(){const e=this.querySelector("#interfaceSelect"),t=this.querySelector("#startCaptureBtn"),a=this.querySelector("#exportLogsBtn");t&&e&&(t.disabled=!e.value||this.isCapturing),a&&(a.disabled=!this.hasFrames||this.isCapturing)}}customElements.define("cv-capture-controls",ve);class he extends HTMLElement{api=null;state;shadow;elements={};unlisteners=[];framesTable=null;signalsPanel=null;filtersPanel=null;dbcViewer=null;captureControls=null;frameRenderPending=!1;signalRenderPending=!1;lastStatsUpdate=0;frameBuffer=[];flushTimer=null;constructor(){super(),this.state=f(),this.shadow=this.attachShadow({mode:"open"})}setApi(e){this.api=e,this.setupEventListeners()}setConfig(e){this.state=f(e),this.render()}connectedCallback(){this.render()}disconnectedCallback(){this.unlisteners.forEach(e=>e()),this.unlisteners=[]}setupEventListeners(){this.api&&(this.unlisteners.push(this.api.onCanFrame(e=>{this.frameBuffer.push(e),this.scheduleFrameFlush()}),this.api.onDecodedSignal(e=>{this.state.isCapturing||(j(this.state,e),this.scheduleSignalRender())}),this.api.onCaptureError(e=>{this.showMessage(e,"error"),this.updateCaptureUI(!1)})),this.loadInitialFiles())}scheduleFrameFlush(){this.flushTimer===null&&(this.flushTimer=window.setTimeout(()=>{this.flushTimer=null,this.flushFrameBuffer()},100))}flushFrameBuffer(){if(this.frameBuffer.length!==0){for(const e of this.frameBuffer)U(this.state,e);this.frameBuffer=[],this.scheduleFrameRender()}}scheduleFrameRender(){this.frameRenderPending||(this.frameRenderPending=!0,this.state.isCapturing?requestAnimationFrame(()=>{this.frameRenderPending=!1,this.renderFramesThrottled()}):requestAnimationFrame(()=>{this.frameRenderPending=!1,this.renderFrames()}))}scheduleSignalRender(){this.signalRenderPending||(this.signalRenderPending=!0,requestAnimationFrame(()=>{this.signalRenderPending=!1,this.renderSignals()}))}renderFramesThrottled(){v(this.state),this.framesTable?.setFrames(this.state.filteredFrames),this.updateFrameCount(),this.captureControls?.setHasFrames(this.state.frames.length>0);const e=performance.now();e-this.lastStatsUpdate>=500&&(this.lastStatsUpdate=e,this.updateFrameStats())}async loadInitialFiles(){if(this.api)try{const e=await this.api.getInitialFiles();e.dbc_path&&await this.loadDbc(e.dbc_path),e.mdf4_path&&await this.loadMdf4(e.mdf4_path)}catch(e){console.error("Failed to load initial files:",e)}}render(){this.shadow.innerHTML=`<style>${Q}</style>${F(this.state.config)}`,this.cacheElements(),this.bindEvents(),this.switchTab(this.state.activeTab)}cacheElements(){N.forEach(e=>{const t=this.shadow.getElementById(e);t&&(this.elements[e]=t)}),this.framesTable=this.shadow.querySelector("cv-frames-table"),this.signalsPanel=this.shadow.querySelector("cv-signals-panel"),this.filtersPanel=this.shadow.querySelector("cv-filters-panel"),this.dbcViewer=this.shadow.querySelector("cv-dbc-viewer"),this.captureControls=this.shadow.querySelector("cv-capture-controls"),this.framesTable?.setMessageNameLookup(e=>g(this.state,e))}renderFrames(){v(this.state),this.framesTable?.setFrames(this.state.filteredFrames),this.updateFrameCount(),this.updateFrameStats(),this.captureControls?.setHasFrames(this.state.frames.length>0)}renderSignals(){this.signalsPanel?.setSignals(this.state.signals)}clearSignalsPanel(){this.signalsPanel?.showEmpty()}renderDbcMessages(){this.dbcViewer?.setDbcInfo(this.state.dbcInfo)}updateFrameCount(){this.filtersPanel?.setFilterCount(this.state.filteredFrames.length,this.state.frames.length)}updateFrameStats(){const e=G(this.state),t=this.elements.statMsgCount,a=this.elements.statFrameRate,i=this.elements.statDeltaTime,r=this.elements.statBusLoad;t&&(t.textContent=String(e.uniqueMessages)),a&&(a.textContent=`${Math.round(e.frameRate)}/s`),i&&(i.textContent=e.avgDeltaMs>0?`${e.avgDeltaMs.toFixed(1)}ms`:"-"),r&&(r.textContent=`${e.busLoad.toFixed(1)}%`)}bindEvents(){this.shadow.querySelectorAll(".cv-tab-btn").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.tab;t&&this.switchTab(t)})}),this.elements.dbcStatusBtn?.addEventListener("click",()=>this.switchTab("dbc")),this.elements.loadDbcBtnTab?.addEventListener("click",()=>this.promptLoadDbc()),this.elements.clearDbcBtn?.addEventListener("click",()=>this.clearDbc()),this.elements.loadMdf4Btn?.addEventListener("click",()=>this.promptLoadMdf4()),this.elements.clearDataBtn?.addEventListener("click",()=>this.clearAllData()),this.elements.clearLiveDataBtn?.addEventListener("click",()=>this.clearAllData()),this.framesTable?.addEventListener("frame-selected",e=>{const t=e.detail.frame,a=e.detail.index;X(this.state,a),this.decodeFrame(t)}),this.filtersPanel?.addEventListener("filter-change",e=>{const t=e.detail;this.state.filters=t,v(this.state),this.renderFrames(),this.clearSignalsPanel()}),this.captureControls?.addEventListener("refresh-interfaces",()=>this.loadInterfaces()),this.captureControls?.addEventListener("start-capture",e=>{const t=e.detail.interface;this.startCaptureOnInterface(t)}),this.captureControls?.addEventListener("stop-capture",()=>this.stopCapture()),this.captureControls?.addEventListener("export-logs",()=>this.exportLogs()),this.shadow.addEventListener("click",e=>{const a=e.target.closest("a[href]");a?.href&&a.target==="_blank"&&(e.preventDefault(),this.openExternalUrl(a.href))})}async openExternalUrl(e){try{const{open:t}=await M(async()=>{const{open:a}=await import("./bundle2.js");return{open:a}},[]);await t(e)}catch{window.open(e,"_blank")}}switchTab(e){Y(this.state,e),this.shadow.querySelectorAll(".cv-tab-btn").forEach(r=>{r.classList.toggle("active",r.dataset.tab===e)}),this.shadow.querySelectorAll(".cv-tab-content").forEach(r=>{r.classList.toggle("active",r.id===`${e}Tab`)});const t=e==="dbc",a=e==="about",i=t||a;this.elements.tablesContainer?.classList.toggle("hidden",i),this.elements.filtersSection?.classList.toggle("hidden",i),this.elements.dbcViewer?.classList.toggle("hidden",!t),this.elements.aboutViewer?.classList.toggle("hidden",!a),t&&this.loadDbcInfo(),e==="live"&&this.loadInterfaces()}async promptLoadDbc(){if(this.api)try{const e=await this.api.openFileDialog([{name:"DBC Files",extensions:["dbc"]}]);e&&await this.loadDbc(e)}catch(e){this.showMessage(String(e),"error")}}async loadDbc(e){if(this.api)try{const t=await this.api.loadDbc(e),a=e.split("/").pop()?.split("\\").pop()||e;await this.loadDbcInfo(),this.updateDbcStatusUI(!0,a),this.showMessage(t),this.renderFrames();const i=J(this.state);i&&await this.decodeFrame(i)}catch(t){this.showMessage(String(t),"error")}}async clearDbc(){if(this.api)try{await this.api.clearDbc(),b(this.state,!1),this.updateDbcStatusUI(!1),this.state.activeTab==="dbc"&&this.renderDbcMessages(),this.showMessage("DBC cleared")}catch(e){this.showMessage(String(e),"error")}}async loadDbcInfo(){if(this.api)try{const e=await this.api.getDbcInfo();b(this.state,!!e,e),this.renderDbcMessages()}catch(e){console.error("Failed to load DBC info:",e)}}updateDbcStatusUI(e,t=""){const a=this.elements.dbcStatusBtn,i=this.elements.dbcStatusValue,r=this.elements.clearDbcBtn;a&&a.classList.toggle("loaded",e),i&&(i.textContent=e?t:"No file loaded"),r&&(r.disabled=!e),this.elements.signalsPanel?.classList.toggle("hidden",!e),this.elements.tablesContainer?.classList.toggle("with-signals",e)}async promptLoadMdf4(){if(this.api)try{const e=await this.api.openFileDialog([{name:"MDF4 Files",extensions:["mf4","mdf","mdf4","MF4","MDF","MDF4"]}]);e&&await this.loadMdf4(e)}catch(e){this.showMessage(String(e),"error")}}async loadMdf4(e){if(!this.api)return;const t=this.elements.loadMdf4Btn;try{t&&(t.disabled=!0,t.textContent="Loading...");const[a]=await this.api.loadMdf4(e);this.state.frames=a,this.state.signals=[],this.state.selectedFrameIndex=null,this.renderFrames(),this.clearSignalsPanel();const i=e.split("/").pop()?.split("\\").pop()||e;this.updateMdf4StatusUI(!0,i),this.showMessage(`Loaded ${a.length} frames`)}catch(a){this.showMessage(String(a),"error")}finally{t&&(t.disabled=!1,t.textContent="Load MDF4 File")}}clearAllData(){O(this.state),this.renderFrames(),this.clearSignalsPanel(),this.updateMdf4StatusUI(!1)}updateMdf4StatusUI(e,t=""){const a=this.elements.mdf4StatusDot,i=this.elements.mdf4StatusText;a?.classList.toggle("connected",e),i&&(i.textContent=e?t:"No file loaded")}async loadInterfaces(){if(this.api)try{const e=await this.api.listCanInterfaces();this.captureControls?.setInterfaces(e)}catch(e){console.log("Could not load interfaces:",e)}}async startCaptureOnInterface(e){if(this.api)try{this.clearAllData(),this.updateCaptureUI(!0),await this.api.startCapture(e),this.showMessage(`Capturing on ${e}`)}catch(t){this.updateCaptureUI(!1),this.showMessage(String(t),"error")}}async stopCapture(){if(this.api)try{await this.api.stopCapture(),this.flushTimer!==null&&(clearTimeout(this.flushTimer),this.flushTimer=null),this.flushFrameBuffer(),this.updateCaptureUI(!1),this.showMessage("Capture stopped")}catch(e){this.showMessage(String(e),"error")}}updateCaptureUI(e){K(this.state,e),this.captureControls?.setCaptureStatus(e)}async exportLogs(){if(!(!this.api||this.state.frames.length===0))try{const e=await this.api.saveFileDialog([{name:"MDF4 Files",extensions:["mf4"]}],"capture.mf4");if(!e)return;const t=await this.api.exportLogs(e,this.state.frames);this.showMessage(`Exported ${t} frames to MDF4`)}catch(e){this.showMessage(String(e),"error")}}async decodeFrame(e){if(!this.api||!this.state.dbcLoaded){this.clearSignalsPanel();return}try{this.state.signals=await this.api.decodeFrames([e]),this.renderSignals()}catch(t){console.error("Failed to decode frame:",t),this.clearSignalsPanel()}}showMessage(e,t="success"){const a=document.createElement("div");a.className=`cv-message ${t}`,a.textContent=e,this.shadow.appendChild(a),setTimeout(()=>a.remove(),3e3)}}customElements.define("can-viewer",he);async function m(){const s=new w;await s.init();const e=document.querySelector("can-viewer");e&&e.setApi(s)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",m):m();
