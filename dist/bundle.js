(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(a){if(a.ep)return;a.ep=!0;const n=t(a);fetch(a.href,n)}})();async function Y(i,e={},t){return window.__TAURI_INTERNALS__.invoke(i,e,t)}async function ee(i={}){return typeof i=="object"&&Object.freeze(i),await Y("plugin:dialog|open",{options:i})}async function te(i={}){return typeof i=="object"&&Object.freeze(i),await Y("plugin:dialog|save",{options:i})}class se{invoke;listen;constructor(){this.invoke=async()=>{throw new Error("Tauri not initialized")},this.listen=async()=>()=>{}}async init(){const e=window.__TAURI__;if(!e)throw new Error("Tauri API not available");this.invoke=e.core.invoke,this.listen=e.event.listen}async loadDbc(e){return await this.invoke("load_dbc",{path:e})}async clearDbc(){await this.invoke("clear_dbc")}async getDbcInfo(){return await this.invoke("get_dbc_info")}async getDbcPath(){return await this.invoke("get_dbc_path")}async decodeFrames(e){return await this.invoke("decode_frames",{frames:e})}async loadMdf4(e){return await this.invoke("load_mdf4",{path:e})}async exportLogs(e,t){return await this.invoke("export_logs",{path:e,frames:t})}async listCanInterfaces(){return await this.invoke("list_can_interfaces")}async startCapture(e,t){await this.invoke("start_capture",{interface:e,captureFile:t})}async stopCapture(){return await this.invoke("stop_capture")}async getInitialFiles(){return await this.invoke("get_initial_files")}async saveDbcContent(e,t){await this.invoke("save_dbc_content",{path:e,content:t})}async updateDbcContent(e){return await this.invoke("update_dbc_content",{content:e})}async openFileDialog(e){const t=await ee({multiple:!1,filters:e});return Array.isArray(t)?t[0]||null:t}async saveFileDialog(e,t){return await te({filters:e,defaultPath:t})}onCanFrame(e){let t=null;return this.listen("can-frame",s=>{e(s.payload)}).then(s=>{t=s}),()=>{t&&t()}}onDecodedSignal(e){let t=null;return this.listen("decoded-signal",s=>{e(s.payload)}).then(s=>{t=s}),()=>{t&&t()}}onDecodeError(e){let t=null;return this.listen("decode-error",s=>{e(s.payload)}).then(s=>{t=s}),()=>{t&&t()}}onCaptureError(e){let t=null;return this.listen("capture-error",s=>{e(s.payload)}).then(s=>{t=s}),()=>{t&&t()}}onLiveCaptureUpdate(e){let t=null;return this.listen("live-capture-update",s=>{e(s.payload)}).then(s=>{t=s}),()=>{t&&t()}}onCaptureFinalized(e){let t=null;return this.listen("capture-finalized",s=>{e(s.payload)}).then(s=>{t=s}),()=>{t&&t()}}}const ae="modulepreload",ie=function(i){return"/"+i},N={},ne=function(e,t,s){let a=Promise.resolve();if(t&&t.length>0){let r=function(c){return Promise.all(c.map(d=>Promise.resolve(d).then(o=>({status:"fulfilled",value:o}),o=>({status:"rejected",reason:o}))))};document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),h=l?.nonce||l?.getAttribute("nonce");a=r(t.map(c=>{if(c=ie(c),c in N)return;N[c]=!0;const d=c.endsWith(".css"),o=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${o}`))return;const u=document.createElement("link");if(u.rel=d?"stylesheet":ae,d||(u.as="script"),u.crossOrigin="",u.href=c,h&&u.setAttribute("nonce",h),document.head.appendChild(u),d)return new Promise((p,g)=>{u.addEventListener("load",p),u.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${c}`)))})}))}function n(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return a.then(r=>{for(const l of r||[])l.status==="rejected"&&n(l.reason);return e().catch(n)})};function G(i,e){return`0x${e?i.toString(16).toUpperCase().padStart(8,"0"):i.toString(16).toUpperCase().padStart(3,"0")}`}function re(i){return i.map(e=>e.toString(16).toUpperCase().padStart(2,"0")).join(" ")}function de(i){const e=[];return i.is_extended&&e.push("EXT"),i.is_fd&&e.push("FD"),i.brs&&e.push("BRS"),i.esi&&e.push("ESI"),e.join(", ")||"-"}function le(i,e=6){return i.toFixed(e)}function oe(i,e=4){return i.toFixed(e)}function M(i){return i.split("/").pop()?.split("\\").pop()||i}function R(i,e,t=!1){const s=i.filter(l=>l.can_id===e&&l.is_extended===t);if(s.length===0)return null;const a=new Map;for(const l of s){const h=a.get(l.dlc)||0;a.set(l.dlc,h+1)}let n=0,r=s[0].dlc;for(const[l,h]of a)h>n&&(n=h,r=l);return r}function x(i){return JSON.parse(JSON.stringify(i))}function v(i,e){return new CustomEvent(i,{detail:e,bubbles:!0,composed:!0})}function ce(i){return{all:i=i||new Map,on:function(e,t){var s=i.get(e);s?s.push(t):i.set(e,[t])},off:function(e,t){var s=i.get(e);s&&(t?s.splice(s.indexOf(t)>>>0,1):i.set(e,[]))},emit:function(e,t){var s=i.get(e);s&&s.slice().map(function(a){a(t)}),(s=i.get("*"))&&s.slice().map(function(a){a(e,t)})}}}const b=ce();function he(i){b.emit("dbc:changed",i)}function ue(i){b.emit("dbc:state-change",i)}function pe(i){b.emit("mdf4:loaded",i)}function z(i){b.emit("mdf4:status-change",i)}function ge(i){b.emit("frame:selected",i)}function ve(i){b.emit("capture:started",i)}function be(i){b.emit("capture:stopped",i)}function me(i){b.emit("live:interfaces-loaded",i)}class fe extends HTMLElement{loaded=!1;filename=null;handleStatusChange=e=>this.onStatusChange(e);constructor(){super()}connectedCallback(){this.render(),this.bindEvents(),b.on("mdf4:status-change",this.handleStatusChange)}disconnectedCallback(){b.off("mdf4:status-change",this.handleStatusChange)}onStatusChange(e){this.loaded=e.loaded,this.filename=e.filename,this.updateStatusUI()}render(){this.className="cv-toolbar",this.innerHTML=`
      <div class="cv-toolbar-group">
        <button class="cv-btn primary" id="openBtn">Open</button>
      </div>
      <div class="cv-toolbar-group">
        <button class="cv-btn" id="clearBtn">Clear Data</button>
      </div>
      <div class="cv-toolbar-group">
        <div class="cv-status">
          <span class="cv-status-dot" id="statusDot"></span>
          <span id="statusText">No file loaded</span>
        </div>
      </div>
    `}bindEvents(){this.querySelector("#openBtn")?.addEventListener("click",()=>{this.dispatchEvent(v("open",{}))}),this.querySelector("#clearBtn")?.addEventListener("click",()=>{this.dispatchEvent(v("clear",{}))})}updateStatusUI(){const e=this.querySelector("#statusDot"),t=this.querySelector("#statusText");e?.classList.toggle("active",this.loaded),t&&(t.textContent=this.loaded&&this.filename?this.filename:"No file loaded")}}customElements.define("cv-mdf4-toolbar",fe);function xe(i){let e={...i};const t=new Set;return{get:()=>e,set(s){e={...e,...s},t.forEach(a=>a(e))},subscribe(s){return t.add(s),()=>t.delete(s)}}}const I=xe({isCapturing:!1,currentInterface:null,frameCount:0,messageCount:0});class ye extends HTMLElement{unsubscribeStore=null;handleInterfacesLoaded=e=>this.onInterfacesLoaded(e);constructor(){super()}connectedCallback(){this.render(),this.bindEvents(),b.on("live:interfaces-loaded",this.handleInterfacesLoaded),this.unsubscribeStore=I.subscribe(e=>this.onStoreChange(e))}disconnectedCallback(){b.off("live:interfaces-loaded",this.handleInterfacesLoaded),this.unsubscribeStore?.()}onInterfacesLoaded(e){const t=this.querySelector("#interfaceSelect");t&&(t.innerHTML='<option value="">Select CAN interface...</option>'+e.interfaces.map(s=>`<option value="${s}">${s}</option>`).join("")),this.updateButtonStates(I.get())}onStoreChange(e){this.updateStatusUI(e),this.updateButtonStates(e)}render(){this.className="cv-toolbar",this.innerHTML=`
      <div class="cv-toolbar-group">
        <label>Interface:</label>
        <select class="cv-select" id="interfaceSelect">
          <option value="">Select CAN interface...</option>
        </select>
        <button class="cv-btn" id="refreshBtn">↻</button>
      </div>
      <div class="cv-toolbar-group">
        <button class="cv-btn success" id="startBtn" disabled>Start Capture</button>
        <button class="cv-btn danger" id="stopBtn" disabled>Stop Capture</button>
      </div>
      <div class="cv-toolbar-group">
        <button class="cv-btn" id="clearBtn">Clear Data</button>
      </div>
      <div class="cv-toolbar-group">
        <div class="cv-status">
          <span class="cv-status-dot" id="statusDot"></span>
          <span id="statusText">Idle</span>
        </div>
      </div>
      <div class="cv-toolbar-group right">
        <span class="cv-status-label" id="captureFileLabel" style="display: none;"></span>
      </div>
    `}bindEvents(){this.querySelector("#refreshBtn")?.addEventListener("click",()=>{this.dispatchEvent(v("refresh-interfaces",{}))}),this.querySelector("#startBtn")?.addEventListener("click",()=>{const e=this.querySelector("#interfaceSelect");e?.value&&this.dispatchEvent(v("start-capture",{interface:e.value}))}),this.querySelector("#stopBtn")?.addEventListener("click",()=>{this.dispatchEvent(v("stop-capture",{}))}),this.querySelector("#clearBtn")?.addEventListener("click",()=>{this.dispatchEvent(v("clear",{}))}),this.querySelector("#interfaceSelect")?.addEventListener("change",()=>{this.updateButtonStates(I.get())})}updateStatusUI(e){const t=this.querySelector("#statusDot"),s=this.querySelector("#statusText");t?.classList.toggle("active",e.isCapturing),s&&(s.textContent=e.isCapturing?"Capturing...":"Idle")}updateButtonStates(e){const t=this.querySelector("#interfaceSelect"),s=this.querySelector("#startBtn"),a=this.querySelector("#stopBtn");s&&t&&(s.disabled=!t.value||e.isCapturing),a&&(a.disabled=!e.isCapturing)}}customElements.define("cv-live-toolbar",ye);class Se extends HTMLElement{isDirty=!1;isEditing=!1;currentFile=null;messageCount=0;handleStateChange=e=>this.onStateChange(e);constructor(){super()}connectedCallback(){this.render(),this.bindEvents(),b.on("dbc:state-change",this.handleStateChange)}disconnectedCallback(){b.off("dbc:state-change",this.handleStateChange)}onStateChange(e){this.isDirty=e.isDirty,this.isEditing=e.isEditing,this.currentFile=e.currentFile,this.messageCount=e.messageCount,this.updateUI()}render(){this.className="cv-toolbar",this.innerHTML=`
      <div class="cv-toolbar-group">
        <button class="cv-btn" id="newBtn">New</button>
        <button class="cv-btn" id="openBtn">Open</button>
      </div>
      <div class="cv-toolbar-group">
        <button class="cv-btn primary" id="editBtn">Edit</button>
        <button class="cv-btn" id="cancelBtn" style="display:none">Cancel</button>
      </div>
      <div class="cv-toolbar-group">
        <button class="cv-btn" id="saveBtn" disabled>Save</button>
        <button class="cv-btn" id="saveAsBtn" disabled>Save As</button>
      </div>
      <div class="cv-toolbar-group">
        <div class="cv-status">
          <span class="cv-status-dot" id="statusDot"></span>
          <span id="statusText">No file loaded</span>
        </div>
      </div>
    `}bindEvents(){this.querySelector("#newBtn")?.addEventListener("click",()=>{this.dispatchEvent(v("new",{}))}),this.querySelector("#openBtn")?.addEventListener("click",()=>{this.dispatchEvent(v("open",{}))}),this.querySelector("#editBtn")?.addEventListener("click",()=>{this.dispatchEvent(v("edit",{}))}),this.querySelector("#cancelBtn")?.addEventListener("click",()=>{this.dispatchEvent(v("cancel",{}))}),this.querySelector("#saveBtn")?.addEventListener("click",()=>{this.dispatchEvent(v("save",{}))}),this.querySelector("#saveAsBtn")?.addEventListener("click",()=>{this.dispatchEvent(v("save-as",{}))})}updateUI(){const e=this.querySelector("#editBtn"),t=this.querySelector("#cancelBtn"),s=this.querySelector("#saveBtn"),a=this.querySelector("#saveAsBtn"),n=this.querySelector("#statusDot"),r=this.querySelector("#statusText");if(e&&(e.style.display=this.isEditing?"none":""),t&&(t.style.display=this.isEditing?"":"none"),s&&(s.disabled=!this.isDirty,s.classList.toggle("success",this.isDirty)),a&&(a.disabled=this.messageCount===0),n?.classList.toggle("active",!!this.currentFile),r){const l=this.currentFile?.split("/").pop()||"No file loaded";r.textContent=this.isDirty?`${l} *`:l}}}customElements.define("cv-dbc-toolbar",Se);const A=':host{--cv-bg: #0a0a0a;--cv-bg-alt: #111;--cv-bg-elevated: #1a1a1a;--cv-text: #ccc;--cv-text-muted: #666;--cv-text-dim: #444;--cv-border: #222;--cv-radius: 4px;--cv-accent: #3b82f6;--cv-accent-rgb: 59, 130, 246;--cv-success: #22c55e;--cv-danger: #ef4444;--cv-font-mono: ui-monospace, "Cascadia Code", Consolas, monospace;--cv-font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;display:block;height:100%;overflow:hidden;font-family:var(--cv-font-sans);background:var(--cv-bg);color:var(--cv-text);color-scheme:dark}*{margin:0;padding:0;box-sizing:border-box}.hidden{display:none!important}.cv-card,.cv-panel{display:flex;flex-direction:column;background:var(--cv-bg-alt);border:1px solid var(--cv-border);border-radius:var(--cv-radius);overflow:hidden}.cv-card{flex:1}.cv-panel{height:100%;font-size:14px}.cv-card-header,.cv-panel-header{display:flex;align-items:center;border-bottom:1px solid var(--cv-border)}.cv-card-header{justify-content:space-between;padding:8px 12px;background:var(--cv-bg-elevated)}.cv-panel-header{padding:0;background:var(--cv-bg-alt)}.cv-card-title{font-size:.85rem;font-weight:500;color:var(--cv-text-muted);text-transform:uppercase;letter-spacing:.5px}.cv-card-body,.cv-panel-body{flex:1;overflow-y:auto}.cv-card-body.padded{padding:16px}.cv-panel-body{padding:8px}.cv-panel-body.flush{padding:0}.cv-live-viewer{display:flex;flex-direction:column;height:100%}.cv-live-viewer>.cv-panel{flex:1;min-height:0}.cv-live-viewer>.cv-panel>.cv-panel-body{display:flex;flex-direction:column;overflow:hidden}.cv-live-viewer .cv-tab-pane{display:none}.cv-live-viewer .cv-tab-pane.active{display:flex;flex-direction:column;flex:1;min-height:0}.cv-live-viewer .cv-table-wrap{flex:1;min-height:0;overflow-y:auto}.cv-stats-bar{display:flex;gap:24px;padding:8px 16px;background:var(--cv-bg-elevated);border-top:1px solid var(--cv-border)}.cv-tabs{display:flex}.cv-tabs.bordered{border-bottom:1px solid var(--cv-border);margin-bottom:15px}.cv-tab{padding:10px 20px;border:none;border-bottom:2px solid transparent;background:transparent;color:var(--cv-text-muted);font-size:.9rem;font-weight:500;cursor:pointer;transition:all .15s}.cv-tab:hover{color:var(--cv-text);background:var(--cv-bg-elevated)}.cv-tab.active{color:var(--cv-accent);border-bottom-color:var(--cv-accent)}.cv-tab-badge{font-size:.75rem;color:var(--cv-text-dim);margin-left:6px;padding:2px 6px;background:var(--cv-bg);border-radius:3px}.cv-tab-badge.dimmed{opacity:.5}.cv-tab.active .cv-tab-badge{background:#3b82f633;color:var(--cv-accent)}.cv-tab.active .cv-tab-badge.dimmed{opacity:.6}.cv-tab-pane{display:none}.cv-tab-pane.active{display:block}.cv-grid{display:flex;height:100%;padding:8px;gap:8px}@media(max-width:1200px){.cv-grid.responsive{flex-direction:column}}.cv-app{display:flex;flex-direction:column;height:100%;max-width:1800px;margin:0 auto;padding:20px;overflow:hidden}.cv-app>.cv-panel,.cv-app>cv-mdf4-inspector,.cv-app>cv-live-viewer,.cv-app>cv-dbc-editor{display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden}.cv-app-header{flex-shrink:0;background:var(--cv-bg-alt);padding:15px 12px;border-radius:var(--cv-radius);margin-bottom:20px;box-shadow:0 0 0 1px var(--cv-border)}.cv-app-header-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:15px}.cv-app-title{font-size:1.2rem;color:var(--cv-text-muted);font-weight:500}.cv-stats{display:flex;gap:16px;margin-left:auto;margin-right:16px}.cv-stat{display:flex;flex-direction:column;align-items:center;padding:4px 10px;background:var(--cv-bg-alt);border:1px solid var(--cv-border);border-radius:var(--cv-radius);min-width:60px}.cv-stat.clickable{cursor:pointer;transition:all .15s}.cv-stat.clickable:hover{background:var(--cv-bg-elevated)}.cv-stat.success{border-color:#22c55e4d}.cv-stat.success:hover{background:#22c55e1a}.cv-stat-label{font-size:.65rem;color:var(--cv-text-dim);text-transform:uppercase;letter-spacing:.5px}.cv-stat-value{font-size:.85rem;font-weight:600;color:var(--cv-text);font-family:var(--cv-font-mono)}.cv-stat-value.muted{color:var(--cv-text-dim)}.cv-stat.success .cv-stat-value{color:var(--cv-success)}.cv-toolbar,.cv-filters{display:flex;flex-wrap:wrap;gap:15px;align-items:center}.cv-filters{padding:12px 16px}.cv-filters-grid{display:grid;grid-template-columns:1fr 1fr auto;gap:24px;padding:16px}.cv-filter-section{display:flex;flex-direction:column;gap:10px}.cv-filter-section-title{font-size:.75rem;font-weight:600;color:var(--cv-text-muted);text-transform:uppercase;letter-spacing:.5px;padding-bottom:6px;border-bottom:1px solid var(--cv-border)}.cv-filter-row{display:flex;align-items:center;gap:8px}.cv-filter-row label{font-size:.8rem;color:var(--cv-text-muted);min-width:90px}.cv-filter-row .cv-input,.cv-filter-row .cv-select{flex:1}.cv-filter-sep{color:var(--cv-text-dim);font-size:.8rem}.cv-filter-actions{display:flex;flex-direction:column;justify-content:space-between;min-width:160px}.cv-filter-summary{font-size:.8rem;color:var(--cv-text-muted);padding:8px;background:var(--cv-bg);border-radius:var(--cv-radius);text-align:center}.cv-filter-link{font-size:.75rem;color:var(--cv-text-dim);cursor:pointer;transition:color .15s}.cv-filter-link:hover,.cv-filter-link.active{color:var(--cv-accent)}@media(max-width:1000px){.cv-filters-grid{grid-template-columns:1fr}}.cv-toolbar-group,.cv-filter-group{display:flex;gap:10px;align-items:center}.cv-toolbar-group.right{margin-left:auto}.cv-toolbar-group label,.cv-filter-group label{font-size:.85rem;color:var(--cv-text-muted);white-space:nowrap}.cv-btn{height:28px;padding:0 12px;border:1px solid var(--cv-border);border-radius:3px;cursor:pointer;font-size:.8rem;transition:all .15s;background:var(--cv-bg-alt);color:var(--cv-text-muted)}.cv-btn:hover:not(:disabled){background:var(--cv-bg-elevated);color:var(--cv-text)}.cv-btn:disabled{opacity:.3;cursor:not-allowed}.cv-btn.small{height:22px;padding:0 10px;font-size:.75rem}.cv-btn.primary{background:var(--cv-border);color:var(--cv-text)}.cv-btn.primary:hover:not(:disabled){background:var(--cv-bg-elevated)}.cv-btn.success{background:var(--cv-success);color:#fff;border-color:var(--cv-success)}.cv-btn.danger{background:var(--cv-danger);color:#fff;border-color:var(--cv-danger)}.cv-btn.success:hover:not(:disabled),.cv-btn.danger:hover:not(:disabled){filter:brightness(1.1)}.cv-btn.ghost{background:var(--cv-bg);color:var(--cv-text)}.cv-btn.ghost:hover:not(:disabled){background:var(--cv-bg-alt)}.cv-input,.cv-select{height:28px;padding:0 10px;border:1px solid var(--cv-border);border-radius:3px;background:var(--cv-bg);color:var(--cv-text-muted);font-size:.8rem}.cv-input:focus,.cv-select:focus{outline:1px solid var(--cv-accent);outline-offset:-1px}.cv-input.mono{font-family:var(--cv-font-mono);color:var(--cv-text)}.cv-input::placeholder{color:var(--cv-text-dim)}.cv-input.wide{width:150px}#interfaceSelect{width:180px}.cv-select option{font-weight:700;color:var(--cv-text)}.cv-select option[value=""]{font-weight:400;color:var(--cv-text-muted)}.cv-status{display:flex;align-items:center;gap:8px;font-size:.85rem;color:var(--cv-text-muted)}.cv-status-dot{width:8px;height:8px;border-radius:50%;background:var(--cv-border)}.cv-status-dot.active{background:var(--cv-success);box-shadow:0 0 6px var(--cv-success)}.cv-table-wrap{height:100%;overflow-y:auto}.cv-table{width:100%;border-collapse:collapse;font-size:.85rem}.cv-table th{position:sticky;top:0;background:var(--cv-bg-alt);padding:8px 12px;text-align:left;font-weight:500;font-size:.75rem;color:var(--cv-text-muted);text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--cv-border)}.cv-table td{padding:8px 12px;border-bottom:1px solid var(--cv-border);font-family:var(--cv-font-mono);height:36px}.cv-table tr:hover{background:var(--cv-bg-elevated)}.cv-table tr.clickable{cursor:pointer}.cv-table tr.matched{border-left:3px solid var(--cv-accent)}.cv-table tr.selected{background:#3b82f626!important}.cv-cell-dim{color:var(--cv-text-dim)}.cv-cell-id{color:var(--cv-text);font-weight:600}.cv-cell-name{color:var(--cv-accent);font-weight:500}.cv-cell-nomatch{color:var(--cv-danger)}.cv-cell-data{color:var(--cv-text-muted);letter-spacing:1px}.cv-cell-value{color:var(--cv-text);font-weight:600;text-align:right;font-variant-numeric:tabular-nums}.cv-cell-unit{color:var(--cv-text-muted);font-style:italic}.cv-signal-table{table-layout:fixed}.cv-signal-table th:nth-child(1){width:auto}.cv-signal-table th:nth-child(2){width:120px;text-align:right}.cv-signal-table th:nth-child(3){width:80px}.cv-group-header td{background:var(--cv-bg-alt);color:var(--cv-text);font-weight:600;padding:6px 12px;border-top:1px solid var(--cv-border)}.cv-group-header:first-child td{border-top:none}.cv-cell-signal{color:var(--cv-accent);font-weight:500;padding-left:32px}.cv-empty{color:var(--cv-text-dim);text-align:center;padding:20px}.cv-decode-error{color:var(--cv-danger);font-size:.8rem;margin-left:auto;padding:0 8px}.cv-list-item{padding:8px 12px;border-bottom:1px solid var(--cv-border);cursor:pointer;transition:background .15s}.cv-list-item:hover{background:var(--cv-bg-elevated)}.cv-list-item.selected{background:var(--cv-bg-elevated);border-left:3px solid var(--cv-accent)}.cv-list-item-title{font-weight:500;color:var(--cv-text);font-size:.9rem}.cv-list-item-subtitle{font-family:var(--cv-font-mono);color:var(--cv-text-muted);font-size:.8rem}.cv-list-item-meta{font-size:.75rem;color:var(--cv-text-dim);margin-top:2px}.cv-signal-card{background:var(--cv-bg);border:1px solid var(--cv-border);border-radius:var(--cv-radius);padding:12px;margin-bottom:10px}.cv-signal-card-title{font-weight:500;color:var(--cv-text);font-size:.9rem;margin-bottom:8px}.cv-signal-props{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;font-size:.8rem}.cv-signal-prop{display:flex;flex-direction:column}.cv-signal-prop-label{color:var(--cv-text-dim);font-size:.7rem;text-transform:uppercase}.cv-signal-prop-value{color:var(--cv-text-muted);font-family:var(--cv-font-mono)}.cv-detail-title{font-size:1rem;font-weight:500;color:var(--cv-text)}.cv-detail-subtitle{font-size:.8rem;color:var(--cv-text-muted);margin-top:4px}.cv-about-header{border-bottom:none;align-items:flex-start}.cv-about-title-group{display:flex;flex-direction:column;gap:2px}.cv-about-title{font-size:1.2rem;font-weight:600;color:var(--cv-text)}.cv-about-version{color:var(--cv-text-dim);font-size:.8rem}.cv-about-desc{flex:1;color:var(--cv-text-muted);font-size:.85rem;line-height:1.5}.cv-feature-grid,.cv-deps-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}.cv-deps-grid{margin:20px 0}.cv-feature-card,.cv-deps-section{background:var(--cv-bg-alt);border:1px solid var(--cv-border);border-left:3px solid var(--cv-accent);border-radius:var(--cv-radius);padding:16px;transition:background .15s}.cv-feature-card:hover{background:var(--cv-bg-elevated)}.cv-deps-section{border-left-color:var(--cv-success);padding:16px 20px}.cv-feature-card h4{color:var(--cv-accent);font-size:.95rem;margin:0 0 8px}.cv-feature-card p{color:var(--cv-text);font-size:.85rem;line-height:1.5;margin:0}.cv-tab-pane h4{color:var(--cv-text-muted);font-size:.95rem;margin:0 0 12px;text-transform:uppercase;letter-spacing:.5px}.cv-about-intro{color:var(--cv-text-muted);margin:0 0 20px}.cv-deps-section ul{list-style:none}.cv-deps-section li{color:var(--cv-text-muted);font-size:.85rem;padding:6px 0;border-bottom:1px solid var(--cv-border)}.cv-deps-section li:last-child{border-bottom:none}.cv-deps-section li a{color:var(--cv-text);font-weight:600;text-decoration:none}.cv-deps-section li a:hover{color:var(--cv-success);text-decoration:underline}.cv-deps-section li.cv-sister-project{background:linear-gradient(90deg,rgba(var(--cv-accent-rgb),.08) 0%,transparent 100%);margin:0 -12px;padding:6px 12px;border-radius:4px;border-bottom-color:transparent}.cv-deps-section li.cv-sister-project a{color:var(--cv-accent)}.cv-about-license{color:var(--cv-text-dim);font-size:.85rem;margin:32px 0 0;text-align:center}.cv-toast{position:fixed;bottom:20px;right:20px;padding:12px 20px;border-radius:var(--cv-radius);font-size:.9rem;animation:cv-slideIn .3s ease;z-index:1000}.cv-toast.success{background:var(--cv-success);color:#fff}.cv-toast.error{background:var(--cv-danger);color:#fff}@keyframes cv-slideIn{0%{transform:translate(100%);opacity:0}to{transform:translate(0);opacity:1}}';function we(i){const e=i.trim().toUpperCase();return e||null}function Ee(i){const e=i.trim();if(!e)return null;const t=e.split(",").map(s=>s.trim()).filter(s=>s.length>0).map(s=>parseInt(s,16)).filter(s=>!isNaN(s));return t.length>0?t:null}function P(i){const e=i.trim().toLowerCase();if(!e)return null;const t=e.split(",").map(s=>s.trim().toLowerCase()).filter(s=>s.length>0);return t.length>0?t:null}function W(i){let e=0;return(i.timeMin!==null||i.timeMax!==null)&&e++,i.canIds?.length&&e++,i.messages?.length&&e++,i.signals?.length&&e++,i.dataPattern&&e++,i.channel&&e++,i.matchStatus!=="all"&&e++,e}const Ce=500;class Me extends HTMLElement{frames=[];selectedIndex=null;messageNameLookup=()=>"-";delegatedHandler=null;constructor(){super()}connectedCallback(){this.setupEventDelegation()}disconnectedCallback(){this.removeEventDelegation()}setupEventDelegation(){const e=this.querySelector("tbody");!e||this.delegatedHandler||(this.delegatedHandler=t=>{const a=t.target.closest("tr.clickable");a?.dataset.index&&this.selectFrame(parseInt(a.dataset.index,10))},e.addEventListener("click",this.delegatedHandler))}removeEventDelegation(){if(!this.delegatedHandler)return;const e=this.querySelector("tbody");e&&e.removeEventListener("click",this.delegatedHandler),this.delegatedHandler=null}setMessageNameLookup(e){this.messageNameLookup=e}setFrames(e){this.frames=e,this.render()}get frameCount(){return this.frames.length}clearSelection(){this.selectedIndex=null,this.updateSelection()}render(){const e=this.querySelector("tbody");if(!e)return;const t=Math.max(0,this.frames.length-Ce),s=this.frames.slice(t);e.innerHTML=s.map((a,n)=>{const r=t+n,l=this.messageNameLookup(a.can_id),h=l!=="-";return`
      <tr class="${["clickable",r===this.selectedIndex?"selected":"",h?"matched":""].filter(Boolean).join(" ")}" data-index="${r}">
        <td class="cv-cell-dim">${le(a.timestamp)}</td>
        <td>${a.channel}</td>
        <td class="cv-cell-id" title="${a.can_id}">${G(a.can_id,a.is_extended)}</td>
        <td class="${h?"cv-cell-name":"cv-cell-nomatch"}">${l}</td>
        <td>${a.dlc}</td>
        <td class="cv-cell-data">${re(a.data)}</td>
        <td>${de(a)}</td>
      </tr>
    `}).join(""),this.delegatedHandler||this.setupEventDelegation()}selectFrame(e){this.selectedIndex=e,this.updateSelection();const t=this.frames[e];t&&this.dispatchEvent(new CustomEvent("frame-selected",{detail:{frame:t,index:e},bubbles:!0}))}updateSelection(){const e=this.querySelector("tbody");e&&e.querySelectorAll("tr").forEach(t=>{const s=parseInt(t.dataset.index||"-1",10);t.classList.toggle("selected",s===this.selectedIndex)})}}customElements.define("cv-frames-table",Me);class ke extends HTMLElement{signals=[];errors=[];constructor(){super()}setSignals(e,t=[]){this.signals=e,this.errors=t,this.render()}showEmpty(){this.signals=[],this.errors=[];const e=this.querySelector("tbody"),t=this.querySelector(".cv-table-info"),s=this.querySelector(".cv-decode-error");e&&(e.innerHTML='<tr><td colspan="3" class="cv-signals-empty">Select a frame to view decoded signals</td></tr>'),t&&(t.textContent="Select a frame"),s&&(s.textContent="",s.classList.add("hidden"))}render(){const e=this.querySelector("tbody"),t=this.querySelector(".cv-table-info"),s=this.querySelector(".cv-decode-error");e&&(this.signals.length===0&&this.errors.length===0?e.innerHTML='<tr><td colspan="3" class="cv-signals-empty">No signals decoded</td></tr>':e.innerHTML=this.signals.map(a=>`
          <tr>
            <td class="cv-signal-name">${a.signal_name}</td>
            <td class="cv-physical-value">${oe(a.value)}</td>
            <td class="cv-unit-highlight">${a.unit||"-"}</td>
          </tr>
        `).join("")),t&&(t.textContent=`${this.signals.length} signals`),s&&(this.errors.length>0?(s.textContent=this.errors.join("; "),s.classList.remove("hidden")):(s.textContent="",s.classList.add("hidden")))}}customElements.define("cv-signals-panel",ke);class _e extends HTMLElement{constructor(){super()}connectedCallback(){this.bindEvents()}bindEvents(){this.querySelectorAll(".cv-input").forEach(a=>{a.addEventListener("input",()=>this.emitFilterChange())}),this.querySelectorAll(".cv-select").forEach(a=>{a.addEventListener("change",()=>this.emitFilterChange())}),this.querySelector("#clearFiltersBtn")?.addEventListener("click",()=>this.clearFilters())}getFilters(){const e=this.getInputValue("filterTimeMin"),t=this.getInputValue("filterTimeMax"),s=this.getInputValue("filterCanId"),a=this.getInputValue("filterMessage"),n=this.getInputValue("filterSignal"),r=this.getInputValue("filterDataPattern"),l=this.getInputValue("filterChannel"),h=this.getSelectValue("filterMatchStatus");return{timeMin:e?parseFloat(e):null,timeMax:t?parseFloat(t):null,canIds:Ee(s),messages:P(a),signals:P(n),dataPattern:we(r),channel:l||null,matchStatus:h||"all"}}clearFilters(){this.setInputValue("filterTimeMin",""),this.setInputValue("filterTimeMax",""),this.setInputValue("filterCanId",""),this.setInputValue("filterMessage",""),this.setInputValue("filterSignal",""),this.setInputValue("filterDataPattern",""),this.setInputValue("filterChannel",""),this.setSelectValue("filterMatchStatus","all"),this.emitFilterChange()}updateSummary(e,t){const s=this.querySelector("#filterSummary");if(s){const a=this.getFilters(),n=W(a);n===0?s.textContent="No filters active":s.textContent=`${n} filter${n>1?"s":""} · ${e}/${t} frames`}}getInputValue(e){return this.querySelector(`#${e}`)?.value.trim()||""}setInputValue(e,t){const s=this.querySelector(`#${e}`);s&&(s.value=t)}getSelectValue(e){return this.querySelector(`#${e}`)?.value||""}setSelectValue(e,t){const s=this.querySelector(`#${e}`);s&&(s.value=t)}emitFilterChange(){this.dispatchEvent(new CustomEvent("filter-change",{detail:this.getFilters(),bubbles:!0}))}}customElements.define("cv-filters-panel",_e);function Le(){return{frames:[],filteredFrames:[],signals:[],filters:{timeMin:null,timeMax:null,canIds:null,messages:null,signals:null,dataPattern:null,channel:null,matchStatus:"all"},selectedFrameIndex:null,dbcInfo:null,currentFile:null}}class $e extends HTMLElement{api=null;state;shadow;framesTable=null;signalsPanel=null;filtersPanel=null;handleDbcChanged=e=>this.onDbcChanged(e);constructor(){super(),this.state=Le(),this.shadow=this.attachShadow({mode:"open"})}connectedCallback(){this.render(),b.on("dbc:changed",this.handleDbcChanged)}disconnectedCallback(){b.off("dbc:changed",this.handleDbcChanged)}setApi(e){this.api=e,this.refreshDbcInfo()}getFrames(){return this.state.frames}async onDbcChanged(e){if(this.state.dbcInfo=e.dbcInfo,this.renderFrames(),this.state.selectedFrameIndex!==null){const t=this.state.frames[this.state.selectedFrameIndex];t&&await this.decodeFrame(t)}}async refreshDbcInfo(){if(this.api)try{this.state.dbcInfo=await this.api.getDbcInfo(),this.renderFrames()}catch{}}async loadFile(e){if(!this.api)return;const t=this.shadow.querySelector("#loadBtn");try{t&&(t.disabled=!0,t.textContent="Loading...");const[s]=await this.api.loadMdf4(e);this.state.frames=s,this.state.filteredFrames=[...s],this.state.signals=[],this.state.selectedFrameIndex=null,this.state.currentFile=e,this.renderFrames(),this.clearSignalsPanel(),z({loaded:!0,filename:M(e)}),this.showMessage(`Loaded ${s.length} frames`),pe({path:e,frames:s,frameCount:s.length})}catch(s){this.showMessage(String(s),"error")}finally{t&&(t.disabled=!1,t.textContent="Open")}}render(){this.shadow.innerHTML=`
      <style>${A}</style>
      ${this.generateTemplate()}
    `,this.cacheElements(),this.bindEvents()}generateTemplate(){return`
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
    `}generateDataSection(){return`
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
    `}generateFiltersSection(){return`
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
    `}cacheElements(){this.framesTable=this.shadow.querySelector("cv-frames-table"),this.signalsPanel=this.shadow.querySelector("cv-signals-panel"),this.filtersPanel=this.shadow.querySelector("cv-filters-panel"),this.framesTable?.setMessageNameLookup(e=>this.getMessageName(e))}bindEvents(){this.shadow.querySelector("#loadBtn")?.addEventListener("click",()=>this.promptLoadMdf4()),this.shadow.querySelector("#clearBtn")?.addEventListener("click",()=>this.clearAllData()),this.shadow.querySelectorAll(".cv-tabs .cv-tab").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.tab;t&&this.switchTab(t)})}),this.framesTable?.addEventListener("frame-selected",e=>{const t=e.detail;this.state.selectedFrameIndex=t.index,this.decodeFrame(t.frame),ge({frame:t.frame,index:t.index,source:"mdf4-inspector"})}),this.filtersPanel?.addEventListener("filter-change",e=>{const t=e.detail;this.state.filters=t,this.applyFilters(),this.renderFrames(),this.clearSignalsPanel(),this.updateFilterLink()}),this.shadow.querySelector("#filterLink")?.addEventListener("click",()=>{this.switchTab("filters")})}switchTab(e){this.shadow.querySelectorAll(".cv-tabs .cv-tab").forEach(t=>t.classList.toggle("active",t.dataset.tab===e)),this.shadow.querySelectorAll(".cv-panel-body > .cv-tab-pane").forEach(t=>t.classList.toggle("active",t.id===`${e}Section`))}async promptLoadMdf4(){if(this.api)try{const e=await this.api.openFileDialog([{name:"MDF4 Files",extensions:["mf4","mdf","mdf4","MF4","MDF","MDF4"]}]);e&&await this.loadFile(e)}catch(e){this.showMessage(String(e),"error")}}clearAllData(){this.state.frames=[],this.state.filteredFrames=[],this.state.signals=[],this.state.selectedFrameIndex=null,this.state.currentFile=null,this.renderFrames(),this.clearSignalsPanel(),z({loaded:!1,filename:null})}applyFilters(){const e=this.state.filters;let t=this.state.frames;if(e.timeMin!==null&&(t=t.filter(s=>s.timestamp>=e.timeMin)),e.timeMax!==null&&(t=t.filter(s=>s.timestamp<=e.timeMax)),e.canIds?.length&&(t=t.filter(s=>e.canIds.includes(s.can_id))),e.channel){const s=e.channel.toLowerCase();t=t.filter(a=>a.channel.toLowerCase().includes(s))}if(e.dataPattern){const s=e.dataPattern.toUpperCase().split(/\s+/);t=t.filter(a=>{if(s.length>a.data.length)return!1;for(let n=0;n<s.length;n++){const r=s[n];if(r==="??"||r==="XX")continue;const l=parseInt(r,16);if(isNaN(l)||a.data[n]!==l)return!1}return!0})}if(e.messages?.length&&this.state.dbcInfo){const s=e.messages.map(n=>n.toLowerCase()),a=this.state.dbcInfo.messages.filter(n=>s.some(r=>n.name.toLowerCase().includes(r))).map(n=>n.id);t=t.filter(n=>a.includes(n.can_id))}if(e.matchStatus!=="all"&&this.state.dbcInfo){const s=new Set(this.state.dbcInfo.messages.map(a=>a.id));e.matchStatus==="matched"?t=t.filter(a=>s.has(a.can_id)):t=t.filter(a=>!s.has(a.can_id))}this.state.filteredFrames=t}renderFrames(){this.applyFilters(),this.framesTable?.setFrames(this.state.filteredFrames),this.updateFrameCount(),this.updateFilterTabBadge()}async decodeFrame(e){if(!this.api||!this.state.dbcInfo){this.clearSignalsPanel();return}if(!this.state.dbcInfo.messages.some(s=>s.id===e.can_id)){this.state.signals=[],this.signalsPanel?.setSignals([],[]),this.updateSignalsCount();return}try{const s=await this.api.decodeFrames([e]);this.state.signals=s.signals,this.signalsPanel?.setSignals(s.signals,s.errors),this.updateSignalsCount()}catch(s){console.error("Failed to decode frame:",s),this.clearSignalsPanel()}}getMessageName(e){return this.state.dbcInfo&&this.state.dbcInfo.messages.find(s=>s.id===e)?.name||"-"}clearSignalsPanel(){this.signalsPanel?.showEmpty(),this.updateSignalsCount()}updateFrameCount(){const e=this.shadow.querySelector("#framesCount");e&&(e.textContent=String(this.state.filteredFrames.length))}updateSignalsCount(){const e=this.shadow.querySelector("#signalsCount");e&&(e.textContent=String(this.state.signals.length))}updateFilterTabBadge(){const e=this.shadow.querySelector("#filterCount");e&&(e.textContent=String(W(this.state.filters)))}updateFilterLink(){const e=this.shadow.querySelector("#filterLink");if(!e)return;const t=this.state.filters,s=[];(t.timeMin!==null||t.timeMax!==null)&&s.push("time"),t.canIds?.length&&s.push("ID"),t.channel&&s.push("channel"),t.dataPattern&&s.push("data"),t.messages?.length&&s.push("message"),t.signals?.length&&s.push("signal"),t.matchStatus!=="all"&&s.push(t.matchStatus),s.length===0?(e.textContent="",e.classList.remove("active")):(e.textContent=`[${s.join(", ")}]`,e.classList.add("active"))}showMessage(e,t="success"){const s=document.createElement("div");s.className=`cv-message ${t}`,s.textContent=e,this.shadow.appendChild(s),setTimeout(()=>s.remove(),3e3)}}customElements.define("cv-mdf4-inspector",$e);class Ie extends HTMLElement{api=null;state;shadow;latestUpdate=null;unlisteners=[];handleDbcChanged=e=>this.onDbcChanged(e);constructor(){super(),this.state={isCapturing:!1,currentInterface:null,captureFile:null},this.shadow=this.attachShadow({mode:"open"})}connectedCallback(){this.render(),b.on("dbc:changed",this.handleDbcChanged)}disconnectedCallback(){this.cleanup(),b.off("dbc:changed",this.handleDbcChanged)}setApi(e){this.api=e,this.setupEventListeners(),this.loadInterfaces()}onDbcChanged(e){this.latestUpdate&&this.renderFromUpdate(this.latestUpdate)}setupEventListeners(){this.api&&this.unlisteners.push(this.api.onLiveCaptureUpdate(e=>this.handleUpdate(e)),this.api.onCaptureFinalized(e=>this.handleFinalized(e)),this.api.onCaptureError(e=>{this.showMessage(e,"error"),this.state.isCapturing=!1,this.updateStoreStatus()}))}cleanup(){this.unlisteners.forEach(e=>e()),this.unlisteners=[]}handleUpdate(e){this.latestUpdate=e,this.renderFromUpdate(e),this.updateStoreStatus()}handleFinalized(e){this.state.captureFile=e,this.showMessage(`MDF4 saved to ${M(e)}`)}render(){this.shadow.innerHTML=`
      <style>${A}</style>
      ${this.generateTemplate()}
    `,this.bindEvents()}generateTemplate(){return`
      <div class="cv-live-viewer">
        <div class="cv-panel">
          <div class="cv-panel-header">
            <div class="cv-tabs">
              <button class="cv-tab active" data-tab="monitor">Message Monitor <span class="cv-tab-badge" id="messageCount">0</span></button>
              <button class="cv-tab" data-tab="signals">Signal Monitor <span class="cv-tab-badge" id="signalCount">0</span></button>
              <button class="cv-tab" data-tab="stream">Frame Stream <span class="cv-tab-badge" id="frameCount">0</span></button>
            </div>
          </div>
          <div class="cv-panel-body flush">
            ${this.generateMonitorSection()}
            ${this.generateSignalsSection()}
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
            <span class="cv-stat-value" id="statTotalFrames">0</span>
          </div>
          <div class="cv-stat">
            <span class="cv-stat-label">Rate</span>
            <span class="cv-stat-value" id="statFrameRate">0/s</span>
          </div>
          <div class="cv-stat">
            <span class="cv-stat-label">Elapsed</span>
            <span class="cv-stat-value" id="statElapsed">0:00</span>
          </div>
        </div>
      </div>
    `}generateMonitorSection(){return`
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
              </tr>
            </thead>
            <tbody id="monitorTableBody"></tbody>
          </table>
        </div>
      </div>
    `}generateSignalsSection(){return`
      <div class="cv-tab-pane" id="signalsSection">
        <div class="cv-table-wrap">
          <table class="cv-table cv-signal-table">
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
    `}generateStreamSection(){return`
      <div class="cv-tab-pane" id="streamSection">
        <div class="cv-table-wrap">
          <table class="cv-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>CAN ID</th>
                <th>DLC</th>
                <th>Data</th>
                <th>Flags</th>
              </tr>
            </thead>
            <tbody id="streamTableBody"></tbody>
          </table>
        </div>
      </div>
    `}bindEvents(){this.shadow.querySelectorAll(".cv-tabs .cv-tab").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.tab;t&&this.switchTab(t)})})}switchTab(e){this.shadow.querySelectorAll(".cv-tabs .cv-tab").forEach(t=>t.classList.toggle("active",t.dataset.tab===e)),this.shadow.querySelectorAll(".cv-panel-body > .cv-tab-pane").forEach(t=>t.classList.toggle("active",t.id===`${e}Section`))}async loadInterfaces(){if(this.api)try{const e=await this.api.listCanInterfaces();me({interfaces:e})}catch(e){console.warn("Could not load interfaces:",e)}}async startCapture(e){if(this.api)try{const s=`can-capture-${new Date().toISOString().replace(/[:.]/g,"-").slice(0,19)}.mf4`,a=await this.api.saveFileDialog([{name:"MDF4 Files",extensions:["mf4"]}],s);if(!a)return;this.latestUpdate=null,this.renderFromUpdate(null),this.state.isCapturing=!0,this.state.currentInterface=e,this.state.captureFile=a,this.updateStoreStatus(),await this.api.startCapture(e,a),this.showMessage(`Capturing on ${e} → ${M(a)}`),ve({interface:e})}catch(t){this.state.isCapturing=!1,this.updateStoreStatus(),this.showMessage(String(t),"error")}}async stopCapture(){if(this.api)try{const e=await this.api.stopCapture(),t=this.latestUpdate?.stats.frame_count??0,s=this.state.currentInterface;this.state.isCapturing=!1,this.state.captureFile=e,this.updateStoreStatus(),this.showMessage(`Capture saved to ${M(e)}`),be({interface:s,frameCount:t})}catch(e){this.state.isCapturing=!1,this.updateStoreStatus(),this.showMessage(String(e),"error")}}clearAllData(){this.latestUpdate=null,this.renderFromUpdate(null),this.updateStoreStatus()}updateStoreStatus(){I.set({isCapturing:this.state.isCapturing,currentInterface:this.state.currentInterface,frameCount:this.latestUpdate?.stats.frame_count??0,messageCount:this.latestUpdate?.stats.message_count??0})}getIsCapturing(){return this.state.isCapturing}getFrameCount(){return this.latestUpdate?.stats.frame_count??0}getCaptureFile(){return this.state.captureFile}renderFromUpdate(e){const t=this.shadow.querySelector("#monitorTableBody");t&&(t.innerHTML=e?.messages_html??"");const s=this.shadow.querySelector("#signalsTableBody");s&&(s.innerHTML=e?.signals_html??"");const a=this.shadow.querySelector("#streamTableBody");a&&(a.innerHTML=e?.frames_html??"");const n=this.shadow.querySelector("#messageCount");n&&(n.textContent=String(e?.message_count??0));const r=this.shadow.querySelector("#signalCount");r&&(r.textContent=String(e?.signal_count??0));const l=this.shadow.querySelector("#frameCount");l&&(l.textContent=String(e?.frame_count??0));const h=this.shadow.querySelector("#statMsgCount"),c=this.shadow.querySelector("#statTotalFrames"),d=this.shadow.querySelector("#statFrameRate"),o=this.shadow.querySelector("#statElapsed");e?.stats_html?(h&&(h.textContent=e.stats_html.message_count),c&&(c.textContent=e.stats_html.frame_count),d&&(d.textContent=e.stats_html.frame_rate),o&&(o.textContent=e.stats_html.elapsed)):(h&&(h.textContent="0"),c&&(c.textContent="0"),d&&(d.textContent="0/s"),o&&(o.textContent="0:00"))}showMessage(e,t="success"){const s=document.createElement("div");s.className=`cv-message ${t}`,s.textContent=e,this.shadow.appendChild(s),setTimeout(()=>s.remove(),3e3)}}customElements.define("cv-live-viewer",Ie);function D(){return{name:"",start_bit:0,length:8,byte_order:"little_endian",is_unsigned:!0,factor:1,offset:0,min:0,max:255,unit:null,receivers:{type:"none"},is_multiplexer:!1,multiplexer_value:null}}function T(i=8){return{id:0,is_extended:!1,name:"",dlc:i,sender:"Vector__XXX",signals:[]}}function V(){return{version:null,nodes:[],messages:[]}}function De(i){return/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(i)}const U=["#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#84cc16","#f97316","#6366f1"];function O(i){return U[i%U.length]}function L(i,e,t){if(t==="little_endian")return{start:i,end:i+e-1};{const s=i-e+1;return{start:Math.max(0,s),end:i}}}function C(i,e,t,s){return s==="little_endian"?{startMin:0,startMax:Math.max(0,i-t),lenMin:1,lenMax:Math.max(1,i-e)}:{startMin:Math.max(0,t-1),startMax:i-1,lenMin:1,lenMax:Math.min(64,e+1)}}function B(i){const e=[];e.push(`VERSION "${i.version||""}"`),e.push(""),e.push("NS_ :"),e.push(""),e.push("BS_:"),e.push(""),i.nodes.length>0?e.push(`BU_: ${i.nodes.join(" ")}`):e.push("BU_:"),e.push("");for(const t of i.messages){const s=t.is_extended?t.id|2147483648:t.id;e.push(`BO_ ${s} ${t.name}: ${t.dlc} ${t.sender}`);for(const a of t.signals){const n=a.byte_order==="little_endian"?1:0,r=a.is_unsigned?"+":"-";let l="";a.is_multiplexer?l=" M":a.multiplexer_value!==null&&(l=` m${a.multiplexer_value}`);let h="Vector__XXX";a.receivers.type==="nodes"&&a.receivers.nodes.length>0&&(h=a.receivers.nodes.join(","));const c=a.unit||"";e.push(` SG_ ${a.name}${l} : ${a.start_bit}|${a.length}@${n}${r} (${a.factor},${a.offset}) [${a.min}|${a.max}] "${c}" ${h}`)}e.push("")}return e.push(""),e.join(`
`)}const Te=`
  --de-bg: #0a0a0a;
  --de-bg-secondary: #111;
  --de-bg-tertiary: #1a1a1a;
  --de-text: #ccc;
  --de-text-muted: #888;
  --de-border: #222;
  --de-accent: #3b82f6;
  --de-accent-hover: #2563eb;
  --de-success: #22c55e;
  --de-danger: #ef4444;
  --de-font-mono: 'SF Mono', 'Fira Code', 'Consolas', monospace;
`,F=`
  .de-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border: 1px solid var(--de-border);
    border-radius: 4px;
    background: var(--de-bg-secondary);
    color: var(--de-text);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .de-btn:hover {
    background: var(--de-bg-tertiary);
    border-color: var(--de-text-muted);
  }
  .de-btn-primary {
    background: var(--de-accent);
    border-color: var(--de-accent);
    color: white;
  }
  .de-btn-primary:hover {
    background: var(--de-accent-hover);
    border-color: var(--de-accent-hover);
  }
  .de-btn-success {
    background: var(--de-success);
    border-color: var(--de-success);
    color: white;
  }
  .de-btn-success:hover {
    background: #16a34a;
    border-color: #16a34a;
  }
  .de-btn-danger {
    background: var(--de-danger);
    border-color: var(--de-danger);
    color: white;
  }
  .de-btn-danger:hover {
    background: #dc2626;
    border-color: #dc2626;
  }
  .de-btn-small {
    padding: 4px 8px;
    font-size: 12px;
  }
`,q=`
  .de-input, .de-select {
    width: 100%;
    padding: 6px 10px;
    border: 1px solid var(--de-border);
    border-radius: 3px;
    background: var(--de-bg);
    color: var(--de-text-muted);
    font-size: 13px;
    font-family: inherit;
    box-sizing: border-box;
  }
  .de-input:focus, .de-select:focus {
    outline: 1px solid #555;
    outline-offset: -1px;
  }
  .de-select {
    cursor: pointer;
  }
  .de-select option {
    background: var(--de-bg-secondary);
    color: var(--de-text);
  }
  .de-input[type="number"] {
    font-family: var(--de-font-mono);
    color: var(--de-text);
  }
`,J=`
  .de-form-group { margin-bottom: 16px; }
  .de-form-row { display: flex; gap: 16px; margin-bottom: 16px; }
  .de-form-row > .de-form-group { flex: 1; margin-bottom: 0; }
  .de-form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 8px; }
  .de-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: var(--de-text-muted);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .de-checkbox-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .de-checkbox {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: var(--de-accent);
  }
`,Fe=`
  .de-section {
    margin-bottom: 24px;
    padding: 16px;
    background: var(--de-bg-secondary);
    border: 1px solid var(--de-border);
    border-radius: 4px;
  }
  .de-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .de-section-title {
    font-weight: 600;
    font-size: 14px;
  }
`,Be=`
  .de-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .de-table thead {
    position: sticky;
    top: 0;
    z-index: 1;
  }
  .de-table th, .de-table td {
    padding: 8px 10px;
    text-align: left;
    border-bottom: 1px solid var(--de-border);
    white-space: nowrap;
  }
  .de-table th {
    background: var(--de-bg-tertiary);
    font-weight: 600;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--de-text-muted);
  }
  .de-table tr:hover { background: var(--de-bg-secondary); }
  .de-table tr.selected { background: rgba(59, 130, 246, 0.2); }
  .de-table tr { cursor: pointer; }
  .de-table td.mono {
    font-family: var(--de-font-mono);
  }
`,Ae=`
  .de-list { list-style: none; margin: 0; padding: 0; }
  .de-list-item {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    border-bottom: 1px solid var(--de-border);
    cursor: pointer;
    transition: background 0.1s ease;
  }
  .de-list-item:hover { background: var(--de-bg-tertiary); }
  .de-list-item.selected { background: var(--de-accent); color: white; }
  .de-list-item-content { flex: 1; min-width: 0; }
  .de-list-item-title {
    font-weight: 500;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .de-list-item-subtitle {
    font-size: 11px;
    color: var(--de-text-muted);
    margin-top: 1px;
  }
  .de-list-item.selected .de-list-item-subtitle {
    color: rgba(255, 255, 255, 0.7);
  }
  .de-list-item-id {
    font-family: var(--de-font-mono);
    font-size: 12px;
    color: var(--de-text-muted);
    margin-right: 8px;
  }
  .de-list-item.selected .de-list-item-id {
    color: rgba(255, 255, 255, 0.7);
  }
`,Z=`
  .empty-message {
    padding: 24px;
    text-align: center;
    color: var(--de-text-muted);
  }
  .de-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--de-text-muted);
    text-align: center;
    padding: 32px;
  }
  .de-empty-state-title {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--de-text);
  }
`,qe=`
  .field {
    display: flex;
    gap: 8px;
    font-size: 13px;
    padding: 4px 0;
  }
  .field-label {
    color: var(--de-text-muted);
    white-space: nowrap;
  }
  .field-label::after { content: ':'; }
  .field-value {
    color: var(--de-text);
    font-family: var(--de-font-mono);
  }
  .field-value.text { font-family: inherit; }
`,Ne=`
  .msg-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .msg-header-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .msg-title {
    font-weight: 600;
    font-size: 15px;
    color: #fff;
  }
  .msg-id {
    font-family: var(--de-font-mono);
    color: var(--de-text-muted);
    font-size: 13px;
  }
  .msg-meta {
    font-size: 12px;
    color: var(--de-text-muted);
    padding: 2px 8px;
    background: var(--de-bg-tertiary);
    border-radius: 3px;
  }
  .msg-actions {
    display: flex;
    gap: 6px;
  }
`,Re=`
  .bit-layout {
    background: var(--de-bg);
    border: 1px solid var(--de-border);
    border-radius: 4px;
    padding: 8px 12px;
    margin-bottom: 12px;
  }
  .bit-layout-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    font-size: 10px;
    color: var(--de-text-muted);
  }
  .bit-bar {
    position: relative;
    height: 10px;
    background: var(--de-bg-tertiary);
    border-radius: 2px;
    overflow: hidden;
  }
  .bit-segment {
    position: absolute;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    font-family: var(--de-font-mono);
    color: rgba(255,255,255,0.9);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-right: 1px solid rgba(0,0,0,0.3);
    box-sizing: border-box;
  }
  .bit-segment.current {
    z-index: 2;
    box-shadow: 0 0 0 1px #fff;
  }
  .bit-segment.overlap {
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 2px,
      rgba(255,0,0,0.3) 2px,
      rgba(255,0,0,0.3) 4px
    ) !important;
  }
  .bit-markers {
    display: flex;
    justify-content: space-between;
    margin-top: 2px;
    font-size: 9px;
    font-family: var(--de-font-mono);
    color: #444;
  }
  .bit-sliders {
    margin-top: 8px;
    display: flex;
    gap: 16px;
  }
  .bit-slider-group {
    flex: 1;
  }
  .bit-slider-label {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: var(--de-text-muted);
    margin-bottom: 2px;
  }
  .bit-slider-value {
    font-family: var(--de-font-mono);
    color: var(--de-text);
  }
  .bit-slider {
    width: 100%;
    height: 6px;
    -webkit-appearance: none;
    appearance: none;
    background: #333;
    border-radius: 3px;
    outline: none;
    cursor: pointer;
  }
  .bit-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    background: var(--de-accent);
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #fff;
  }
  .bit-slider::-moz-range-thumb {
    width: 14px;
    height: 14px;
    background: var(--de-accent);
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #fff;
  }
`,ze=`
  .signals-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    max-height: 500px;
  }
  .signals-layout {
    display: flex;
    gap: 16px;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
  .signals-table-container {
    flex: 1;
    overflow: auto;
    border: 1px solid var(--de-border);
    border-radius: 4px;
  }
  .signal-editor-panel {
    width: 320px;
    flex-shrink: 0;
    padding: 12px;
    background: var(--de-bg-secondary);
    border: 1px solid var(--de-border);
    border-radius: 4px;
    max-height: 380px;
    overflow-y: auto;
  }
`;function k(){return`:host { display: block; ${Te} }`}function _(...i){return i.join(`
`)}class Pe extends HTMLElement{signals=[];selectedName=null;constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render()}setSignals(e){this.signals=e,this.render()}setSelected(e){this.selectedName=e,this.render()}render(){if(!this.shadowRoot)return;const e=this.signals.map(t=>{const s=this.selectedName===t.name,a=t.byte_order==="little_endian"?"LE":"BE",n=t.is_unsigned?"U":"S",r=t.unit||"-",l=t.is_multiplexer?"M":t.multiplexer_value!==null?`m${t.multiplexer_value}`:"-";return`
        <tr class="${s?"selected":""}" data-name="${t.name}">
          <td>${t.name}</td>
          <td class="mono">${t.start_bit}</td>
          <td class="mono">${t.length}</td>
          <td>${a}</td>
          <td>${n}</td>
          <td class="mono">${t.factor}</td>
          <td class="mono">${t.offset}</td>
          <td class="mono">${t.min}</td>
          <td class="mono">${t.max}</td>
          <td>${r}</td>
          <td>${l}</td>
        </tr>
      `}).join("");this.shadowRoot.innerHTML=`
      <style>${_(k(),Be,Z)}</style>

      ${this.signals.length===0?`
        <div class="empty-message">No signals defined. Click "Add Signal" to create one.</div>
      `:`
        <table class="de-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Start</th>
              <th>Len</th>
              <th>Order</th>
              <th>Sign</th>
              <th>Factor</th>
              <th>Offset</th>
              <th>Min</th>
              <th>Max</th>
              <th>Unit</th>
              <th>Mux</th>
            </tr>
          </thead>
          <tbody>${e}</tbody>
        </table>
      `}
    `,this.shadowRoot.querySelectorAll("tbody tr").forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.name;s&&this.dispatchEvent(v("signal-select",{name:s}))})})}}customElements.define("de-signals-table",Pe);const H=`
  :host {
    display: block;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--de-border);
  }
  .signal-name { font-weight: 600; font-size: 15px; color: #fff; }
  .view-container { display: flex; flex-direction: column; gap: 4px; }
  .actions { display: flex; gap: 4px; }
  .de-form-row-4 { display: flex; gap: 8px; margin-bottom: 8px; }
  .de-form-row-4 > .de-form-group { flex: 1; margin-bottom: 0; }
  .de-form-group-sm { margin-bottom: 8px; }
  .de-form-group-sm .de-label { margin-bottom: 2px; }
  .de-form-group-sm .de-input, .de-form-group-sm .de-select { padding: 4px 6px; font-size: 12px; }
  .btn-row { display: flex; gap: 4px; margin-top: 8px; padding-bottom: 4px; }
  .de-btn-warning { background: #f59e0b; border-color: #f59e0b; color: white; }
  .de-btn-warning:hover { background: #d97706; border-color: #d97706; }
  .error-msg { color: #ef4444; font-size: 11px; margin-top: 4px; }
`;class Ve extends HTMLElement{signal=D();originalSignal=D();availableNodes=[];isEditing=!1;parentEditMode=!1;errorMessage=null;static get observedAttributes(){return["data-edit-mode"]}constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.parentEditMode=this.dataset.editMode==="true",this.render()}attributeChangedCallback(e,t,s){e==="data-edit-mode"&&t!==s&&(this.parentEditMode=s==="true",this.render())}setSignal(e,t){this.signal=e?x(e):D(),this.originalSignal=x(this.signal),this.isEditing=t,this.render()}setAvailableNodes(e){this.availableNodes=e,this.render()}getSignal(){return this.signal}isInEditMode(){return this.isEditing}updateSignalValues(e){if(this.signal={...this.signal,...e},this.shadowRoot&&this.isEditing){if(e.start_bit!==void 0){const t=this.shadowRoot.getElementById("start_bit");t&&(t.value=String(e.start_bit))}if(e.length!==void 0){const t=this.shadowRoot.getElementById("length");t&&(t.value=String(e.length))}}}setError(e){if(this.errorMessage=e,this.shadowRoot&&this.isEditing){const t=this.shadowRoot.querySelector(".error-msg"),s=this.shadowRoot.getElementById("done-btn");t&&(t.textContent=e||"",t.style.display=e?"block":"none"),s&&(s.disabled=!!e,s.style.opacity=e?"0.5":"1",s.style.cursor=e?"not-allowed":"pointer")}}restoreOriginal(){this.signal=x(this.originalSignal),this.errorMessage=null,this.render(),this.dispatchEvent(v("signal-change",this.signal))}render(){this.shadowRoot&&(this.isEditing?this.renderEditMode():this.renderViewMode())}renderViewMode(){if(!this.shadowRoot)return;const e=this.signal.byte_order==="little_endian"?"Little Endian":"Big Endian",t=this.signal.is_unsigned?"Unsigned":"Signed",s=this.signal.unit||"-",a=this.signal.is_multiplexer?"Multiplexer (M)":this.signal.multiplexer_value!==null?`Multiplexed (m${this.signal.multiplexer_value})`:"-",r=this.signal.receivers.type==="nodes"?this.signal.receivers.nodes.join(", "):"None";this.shadowRoot.innerHTML=`
      <style>${_(k(),F,qe,H)}</style>

      <div class="header">
        <span class="signal-name">${this.signal.name||"(unnamed)"}</span>
        ${this.parentEditMode?`
          <div class="actions">
            <button class="de-btn de-btn-primary" id="edit-btn">Edit</button>
            <button class="de-btn de-btn-danger" id="delete-btn">Delete</button>
          </div>
        `:""}
      </div>

      <div class="view-container">
        <div class="field"><span class="field-label">Start Bit</span><span class="field-value">${this.signal.start_bit}</span></div>
        <div class="field"><span class="field-label">Length</span><span class="field-value">${this.signal.length} bits</span></div>
        <div class="field"><span class="field-label">Byte Order</span><span class="field-value text">${e}</span></div>
        <div class="field"><span class="field-label">Value Type</span><span class="field-value text">${t}</span></div>
        <div class="field"><span class="field-label">Factor</span><span class="field-value">${this.signal.factor}</span></div>
        <div class="field"><span class="field-label">Offset</span><span class="field-value">${this.signal.offset}</span></div>
        <div class="field"><span class="field-label">Min</span><span class="field-value">${this.signal.min}</span></div>
        <div class="field"><span class="field-label">Max</span><span class="field-value">${this.signal.max}</span></div>
        <div class="field"><span class="field-label">Unit</span><span class="field-value text">${s}</span></div>
        <div class="field"><span class="field-label">Multiplexing</span><span class="field-value text">${a}</span></div>
        <div class="field"><span class="field-label">Receivers</span><span class="field-value text">${r}</span></div>
      </div>
    `,this.shadowRoot.getElementById("edit-btn")?.addEventListener("click",()=>{this.originalSignal=x(this.signal),this.isEditing=!0,this.render(),this.dispatchEvent(v("edit-start",{}))}),this.shadowRoot.getElementById("delete-btn")?.addEventListener("click",()=>{this.dispatchEvent(v("signal-delete-request",{name:this.signal.name}))})}renderEditMode(){if(!this.shadowRoot)return;const e=this.signal.receivers.type,t=e==="nodes"?this.signal.receivers.nodes:[];this.shadowRoot.innerHTML=`
      <style>${_(k(),F,q,J,H)}
        .de-btn-success { background: var(--de-success); border-color: var(--de-success); color: white; }
        .de-btn-success:hover { background: #16a34a; border-color: #16a34a; }
        .de-btn-success:disabled { opacity: 0.5; cursor: not-allowed; }
      </style>

      <div class="de-form-group-sm">
        <label class="de-label">Name</label>
        <input type="text" class="de-input" id="name" value="${this.signal.name}" placeholder="Signal Name">
      </div>

      <div class="de-form-row-4">
        <div class="de-form-group de-form-group-sm">
          <label class="de-label">Start</label>
          <input type="number" class="de-input" id="start_bit" value="${this.signal.start_bit}" min="0" max="511">
        </div>
        <div class="de-form-group de-form-group-sm">
          <label class="de-label">Len</label>
          <input type="number" class="de-input" id="length" value="${this.signal.length}" min="1" max="64">
        </div>
        <div class="de-form-group de-form-group-sm">
          <label class="de-label">Order</label>
          <select class="de-select" id="byte_order">
            <option value="little_endian" ${this.signal.byte_order==="little_endian"?"selected":""}>LE</option>
            <option value="big_endian" ${this.signal.byte_order==="big_endian"?"selected":""}>BE</option>
          </select>
        </div>
        <div class="de-form-group de-form-group-sm">
          <label class="de-label">Type</label>
          <select class="de-select" id="is_unsigned">
            <option value="true" ${this.signal.is_unsigned?"selected":""}>U</option>
            <option value="false" ${this.signal.is_unsigned?"":"selected"}>S</option>
          </select>
        </div>
      </div>

      <div class="de-form-row-4">
        <div class="de-form-group de-form-group-sm">
          <label class="de-label">Factor</label>
          <input type="number" class="de-input" id="factor" value="${this.signal.factor}" step="any">
        </div>
        <div class="de-form-group de-form-group-sm">
          <label class="de-label">Offset</label>
          <input type="number" class="de-input" id="offset" value="${this.signal.offset}" step="any">
        </div>
        <div class="de-form-group de-form-group-sm">
          <label class="de-label">Min</label>
          <input type="number" class="de-input" id="min" value="${this.signal.min}" step="any">
        </div>
        <div class="de-form-group de-form-group-sm">
          <label class="de-label">Max</label>
          <input type="number" class="de-input" id="max" value="${this.signal.max}" step="any">
        </div>
      </div>

      <div class="de-form-row">
        <div class="de-form-group de-form-group-sm">
          <label class="de-label">Unit</label>
          <input type="text" class="de-input" id="unit" value="${this.signal.unit||""}" placeholder="">
        </div>
        <div class="de-form-group de-form-group-sm">
          <label class="de-label">Receivers</label>
          <select class="de-select" id="receivers_type">
            <option value="none" ${e==="none"?"selected":""}>None</option>
            <option value="nodes" ${e==="nodes"?"selected":""}>Nodes</option>
          </select>
        </div>
      </div>

      <div class="de-form-group-sm receivers-nodes" style="display: ${e==="nodes"?"block":"none"}">
        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
          ${this.availableNodes.map(s=>`
            <label class="de-checkbox-group" style="font-size: 11px;">
              <input type="checkbox" class="de-checkbox receiver-node" value="${s}" ${t.includes(s)?"checked":""} style="width: 14px; height: 14px;">
              <span>${s}</span>
            </label>
          `).join("")}
        </div>
      </div>

      <div class="de-form-row">
        <div class="de-form-group de-form-group-sm">
          <label class="de-checkbox-group" style="font-size: 12px;">
            <input type="checkbox" class="de-checkbox" id="is_multiplexer" ${this.signal.is_multiplexer?"checked":""} style="width: 14px; height: 14px;">
            <span>Mux Switch</span>
          </label>
        </div>
        <div class="de-form-group de-form-group-sm">
          <label class="de-label">Mux Val</label>
          <input type="number" class="de-input" id="multiplexer_value" value="${this.signal.multiplexer_value??""}" placeholder="-" min="0">
        </div>
      </div>

      <div class="error-msg" style="display: ${this.errorMessage?"block":"none"}">${this.errorMessage||""}</div>

      <div class="btn-row">
        <button class="de-btn de-btn-success de-btn-small" id="done-btn" ${this.errorMessage?'disabled style="opacity:0.5;cursor:not-allowed"':""}>Done</button>
        <button class="de-btn de-btn-warning de-btn-small" id="restore-btn">Restore</button>
        <button class="de-btn de-btn-small" id="cancel-btn">Cancel</button>
      </div>
    `,this.setupEditListeners()}setupEditListeners(){if(!this.shadowRoot)return;["name","start_bit","length","factor","offset","min","max","unit","multiplexer_value"].forEach(a=>{this.shadowRoot.getElementById(a)?.addEventListener("input",()=>this.updateSignalFromInputs())}),["byte_order","is_unsigned","receivers_type"].forEach(a=>{const n=this.shadowRoot.getElementById(a);n?.addEventListener("change",()=>{if(this.updateSignalFromInputs(),a==="receivers_type"){const r=this.shadowRoot.querySelector(".receivers-nodes");r&&(r.style.display=n.value==="nodes"?"block":"none")}})}),this.shadowRoot.getElementById("is_multiplexer")?.addEventListener("change",()=>this.updateSignalFromInputs()),this.shadowRoot.querySelectorAll(".receiver-node").forEach(a=>{a.addEventListener("change",()=>this.updateSignalFromInputs())}),this.shadowRoot.getElementById("done-btn")?.addEventListener("click",()=>{this.errorMessage||(this.updateSignalFromInputs(),this.isEditing=!1,this.errorMessage=null,this.render(),this.dispatchEvent(v("edit-done",this.signal)))}),this.shadowRoot.getElementById("restore-btn")?.addEventListener("click",()=>{this.restoreOriginal()}),this.shadowRoot.getElementById("cancel-btn")?.addEventListener("click",()=>{this.signal=x(this.originalSignal),this.isEditing=!1,this.errorMessage=null,this.render(),this.dispatchEvent(v("edit-cancel",{}))})}updateSignalFromInputs(){if(!this.shadowRoot)return;const e=l=>this.shadowRoot.getElementById(l)?.value||"",t=l=>this.shadowRoot.getElementById(l)?.checked||!1,s=e("multiplexer_value"),a=s!==""?parseInt(s,10):null,n=e("receivers_type");let r;if(n==="nodes"){const l=[];this.shadowRoot.querySelectorAll(".receiver-node:checked").forEach(h=>{l.push(h.value)}),r={type:"nodes",nodes:l}}else r={type:"none"};this.signal={name:e("name"),start_bit:parseInt(e("start_bit"),10)||0,length:parseInt(e("length"),10)||1,byte_order:e("byte_order"),is_unsigned:e("is_unsigned")==="true",factor:parseFloat(e("factor"))||1,offset:parseFloat(e("offset"))||0,min:parseFloat(e("min"))||0,max:parseFloat(e("max"))||0,unit:e("unit")||null,receivers:r,is_multiplexer:t("is_multiplexer"),multiplexer_value:a},this.dispatchEvent(v("signal-change",this.signal))}}customElements.define("de-signal-editor",Ve);class Ue extends HTMLElement{messages=[];selectedId=null;selectedIsExtended=!1;constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render()}setMessages(e){this.messages=e,this.render()}setSelected(e,t){this.selectedId=e,this.selectedIsExtended=t,this.render()}render(){if(!this.shadowRoot)return;const e=this.messages.map(t=>{const s=this.selectedId===t.id&&this.selectedIsExtended===t.is_extended,a=G(t.id,t.is_extended),n=t.is_extended?" (Ext)":"";return`
        <li class="de-list-item ${s?"selected":""}"
            data-id="${t.id}"
            data-extended="${t.is_extended}">
          <span class="de-list-item-id">${a}${n}</span>
          <div class="de-list-item-content">
            <div class="de-list-item-title">${t.name||"(unnamed)"}</div>
            <div class="de-list-item-subtitle">
              DLC: ${t.dlc} | ${t.signals.length} signal${t.signals.length!==1?"s":""} | ${t.sender}
            </div>
          </div>
        </li>
      `}).join("");this.shadowRoot.innerHTML=`
      <style>
        ${_(k(),Ae)}
        :host { display: block; height: 100%; }
        .de-scroll-container {
          height: 100%;
          overflow-y: scroll;
        }
        .de-scroll-container::-webkit-scrollbar { width: 12px; }
        .de-scroll-container::-webkit-scrollbar-track { background: #333; }
        .de-scroll-container::-webkit-scrollbar-thumb { background: #888; border-radius: 6px; }
        .de-list { margin: 0; padding: 0; }
      </style>
      <div class="de-scroll-container">
        <ul class="de-list">${e}</ul>
      </div>
    `,this.shadowRoot.querySelectorAll(".de-list-item").forEach(t=>{t.addEventListener("click",()=>{const s=parseInt(t.dataset.id||"0",10),a=t.dataset.extended==="true";this.dispatchEvent(v("message-select",{id:s,isExtended:a}))})})}}customElements.define("de-messages-list",Ue);class Oe extends HTMLElement{message=T();originalMessage=T();availableNodes=[];frames=[];selectedSignal=null;editingSignal=null;isAddingSignal=!1;isEditingSignal=!1;isEditingMessage=!1;isNewMessage=!1;parentEditMode=!1;static get observedAttributes(){return["data-edit-mode"]}constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.parentEditMode=this.dataset.editMode==="true",this.render()}attributeChangedCallback(e,t,s){e==="data-edit-mode"&&t!==s&&(this.parentEditMode=s==="true",this.render())}setMessage(e,t){this.message=e?x(e):T(),this.originalMessage=x(this.message),this.selectedSignal=null,this.editingSignal=null,this.isAddingSignal=!1,this.isNewMessage=t,this.isEditingMessage=t,this.render()}setAvailableNodes(e){this.availableNodes=e,this.render()}setFrames(e){this.frames=e}getMessage(){return this.message}isInEditMode(){return this.isEditingMessage}renderMessageViewMode(e){const t=this.message.id;return`
      <div class="de-section">
        <div class="msg-header">
          <div class="msg-header-info">
            <span class="msg-title">${this.message.name||"(unnamed)"}</span>
            <span class="msg-id">${e} (${t})</span>
            <span class="msg-meta">DLC: ${this.message.dlc}</span>
            ${this.message.sender?`<span class="msg-meta">TX: ${this.message.sender}</span>`:""}
            ${this.message.is_extended?'<span class="msg-meta">Extended</span>':""}
          </div>
          ${this.parentEditMode?`
            <div class="msg-actions">
              <button class="de-btn de-btn-primary de-btn-small" id="edit-msg-btn">Edit</button>
              <button class="de-btn de-btn-danger de-btn-small" id="delete-msg-btn">Delete</button>
            </div>
          `:""}
        </div>
      </div>
    `}renderMessageEditMode(e){return`
      <div class="de-section">
        <div class="msg-header">
          <div class="de-form-group" style="flex: 1; margin-bottom: 0; margin-right: 16px;">
            <label class="de-label">Name</label>
            <input type="text" class="de-input" id="msg_name" value="${this.message.name}" placeholder="Message Name">
          </div>
          <div class="msg-actions" style="align-self: flex-end;">
            <button class="de-btn de-btn-success de-btn-small" id="done-msg-btn">Done</button>
            <button class="de-btn de-btn-small" id="cancel-msg-btn">Cancel</button>
          </div>
        </div>

        <div class="de-form-row">
          <div class="de-form-group">
            <label class="de-label">Message ID <span class="id-display">(${e})</span></label>
            <input type="number" class="de-input" id="msg_id" value="${this.message.id}" min="0" max="536870911">
          </div>
          <div class="de-form-group">
            <label class="de-label">DLC</label>
            <select class="de-select" id="msg_dlc">
              ${[0,1,2,3,4,5,6,7,8,12,16,20,24,32,48,64].map(t=>`<option value="${t}" ${this.message.dlc===t?"selected":""}>${t}</option>`).join("")}
            </select>
          </div>
        </div>

        <div class="de-form-row">
          <div class="de-form-group">
            <label class="de-label">Sender</label>
            <select class="de-select" id="msg_sender">
              <option value="Vector__XXX" ${this.message.sender==="Vector__XXX"?"selected":""}>Vector__XXX</option>
              ${this.availableNodes.map(t=>`<option value="${t}" ${this.message.sender===t?"selected":""}>${t}</option>`).join("")}
            </select>
          </div>
          <div class="de-form-group">
            <div class="de-checkbox-group" style="margin-top: 20px;">
              <input type="checkbox" class="de-checkbox" id="msg_extended" ${this.message.is_extended?"checked":""}>
              <span>Extended ID (29-bit)</span>
            </div>
          </div>
        </div>
      </div>
    `}getActiveSignals(){const t=this.editingSignal?.multiplexer_value;return this.message.signals.filter(s=>!!(s.is_multiplexer||s.multiplexer_value===null||t!==null&&s.multiplexer_value===t))}renderBitLayout(){const e=this.message.dlc*8;if(e===0)return"";const t=this.editingSignal,s=t?.start_bit??0,a=t?.length??1,n=this.getActiveSignals(),r=d=>L(d.start_bit,d.length,d.byte_order),l=d=>{const o=r(d);for(const u of n){if(u.name===d.name)continue;const p=r(u);if(o.start<=p.end&&p.start<=o.end)return!0}return!1},h=n.map((d,o)=>{const u=t&&d.name===t.name,p=l(d),g=r(d),m=g.start/e*100,f=d.length/e*100,y=p?"#ef4444":u?"#3b82f6":O(o),S=u?1:.5,E=["bit-segment",u?"current":"",p?"overlap":""].filter(Boolean).join(" "),w=d.byte_order==="big_endian"?"BE":"LE";return`<div class="${E}"
                   style="left: ${m}%; width: ${f}%; background: ${y}; opacity: ${S};"
                   title="${d.name} (${w}): bits ${g.start}-${g.end}${p?" (OVERLAP!)":""}">
                ${f>8?d.name:""}
              </div>`}).join(""),c=[];for(let d=0;d<=Math.min(8,this.message.dlc);d++)c.push(`<span>${d*8}</span>`);return this.message.dlc>8&&c.push(`<span>${e}</span>`),`
      <div class="bit-layout">
        <div class="bit-layout-header">
          <span>Bit Layout (${e} bits)</span>
          <span>${t?.name||""}: ${s} - ${s+a-1}</span>
        </div>
        <div class="bit-bar">
          ${h}
        </div>
        <div class="bit-markers">
          ${c.join("")}
        </div>
        ${this.isAddingSignal||this.isEditingSignal?(()=>{const d=t?.byte_order??"little_endian",o=C(e,s,a,d);return`
          <div class="bit-sliders">
            <div class="bit-slider-group">
              <div class="bit-slider-label">
                <span>Start Bit</span>
                <span class="bit-slider-value" id="start-bit-value">${s}</span>
              </div>
              <input type="range" class="bit-slider" id="start-bit-slider"
                     min="${o.startMin}" max="${o.startMax}" value="${s}">
            </div>
            <div class="bit-slider-group">
              <div class="bit-slider-label">
                <span>Length</span>
                <span class="bit-slider-value" id="length-value">${a}</span>
              </div>
              <input type="range" class="bit-slider" id="length-slider"
                     min="${o.lenMin}" max="${o.lenMax}" value="${a}">
            </div>
          </div>
        `})():""}
      </div>
    `}updateBitBar(){if(!this.shadowRoot||!this.editingSignal)return;const e=this.message.dlc*8;if(e===0)return;const t=this.editingSignal.start_bit,s=this.editingSignal.length,a=this.shadowRoot.querySelector(".bit-layout-header span:last-child");a&&(a.textContent=`${this.editingSignal.name||""}: ${t} - ${t+s-1}`);const n=this.shadowRoot.querySelector(".bit-bar");if(n){const r=this.getActiveSignals(),l=this.editingSignal.byte_order,h=(o,u,p)=>L(o,u,p),c=(o,u,p,g)=>{const m=h(o,u,p);for(const f of r){if(f.name===g)continue;const y=f.name===this.editingSignal.name,S=y?t:f.start_bit,E=y?s:f.length,w=y?l:f.byte_order,$=h(S,E,w);if(m.start<=$.end&&$.start<=m.end)return!0}return!1},d=r.map((o,u)=>{const p=o.name===this.editingSignal.name,g=p?t:o.start_bit,m=p?s:o.length,f=p?l:o.byte_order,y=h(g,m,f),S=y.start/e*100,E=m/e*100,w=c(g,m,f,o.name),$=w?"#ef4444":p?"#3b82f6":O(u),K=p?1:.5,Q=f==="big_endian"?"BE":"LE";return`<div class="${["bit-segment",p?"current":"",w?"overlap":""].filter(Boolean).join(" ")}"
                     style="left: ${S}%; width: ${E}%; background: ${$}; opacity: ${K};"
                     title="${o.name} (${Q}): bits ${y.start}-${y.end}${w?" (OVERLAP!)":""}">
                  ${E>8?o.name:""}
                </div>`}).join("");if(this.isAddingSignal&&this.editingSignal){const o=h(t,s,l),u=o.start/e*100,p=s/e*100,g=c(t,s,l,""),m=g?"#ef4444":"#3b82f6",f=l==="big_endian"?"BE":"LE",S=`<div class="${["bit-segment","current",g?"overlap":""].filter(Boolean).join(" ")}"
                              style="left: ${u}%; width: ${p}%; background: ${m}; opacity: 1;"
                              title="New (${f}): bits ${o.start}-${o.end}${g?" (OVERLAP!)":""}">
                           ${p>8?this.editingSignal.name||"New":""}
                         </div>`;n.innerHTML=d+S}else n.innerHTML=d}}setupSliderListeners(){if(!this.shadowRoot)return;const e=this.shadowRoot.getElementById("start-bit-slider"),t=this.shadowRoot.getElementById("length-slider"),s=this.message.dlc*8,a=()=>{if(!this.editingSignal||!e||!t)return;const n=C(s,this.editingSignal.start_bit,this.editingSignal.length,this.editingSignal.byte_order);e.min=String(n.startMin),e.max=String(n.startMax),t.min=String(n.lenMin),t.max=String(n.lenMax)};e?.addEventListener("input",()=>{const n=parseInt(e.value,10);if(this.editingSignal){this.editingSignal.start_bit=n,this.shadowRoot.getElementById("start-bit-value").textContent=String(n),a();const r=C(s,n,this.editingSignal.length,this.editingSignal.byte_order);this.editingSignal.length>r.lenMax&&(this.editingSignal.length=r.lenMax,t.value=String(r.lenMax),this.shadowRoot.getElementById("length-value").textContent=String(r.lenMax));const l=this.shadowRoot.querySelector("de-signal-editor");l?.updateSignalValues({start_bit:this.editingSignal.start_bit,length:this.editingSignal.length}),this.updateBitBar(),this.validateSignalAndSetError(l)}}),t?.addEventListener("input",()=>{const n=parseInt(t.value,10);if(this.editingSignal){this.editingSignal.length=n,this.shadowRoot.getElementById("length-value").textContent=String(n),a();const r=C(s,this.editingSignal.start_bit,n,this.editingSignal.byte_order);this.editingSignal.start_bit<r.startMin?(this.editingSignal.start_bit=r.startMin,e.value=String(r.startMin),this.shadowRoot.getElementById("start-bit-value").textContent=String(r.startMin)):this.editingSignal.start_bit>r.startMax&&(this.editingSignal.start_bit=r.startMax,e.value=String(r.startMax),this.shadowRoot.getElementById("start-bit-value").textContent=String(r.startMax));const l=this.shadowRoot.querySelector("de-signal-editor");l?.updateSignalValues({start_bit:this.editingSignal.start_bit,length:this.editingSignal.length}),this.updateBitBar(),this.validateSignalAndSetError(l)}})}render(){if(!this.shadowRoot)return;const e=`0x${this.message.id.toString(16).toUpperCase()}`;this.shadowRoot.innerHTML=`
      <style>
        ${k()}
        ${_(J,q,F,Fe,Ne,Re,ze)}
        :host {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow-y: auto;
          padding: 16px;
        }
        .de-actions {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }
        .id-display {
          font-family: var(--de-font-mono);
          color: var(--de-text-muted);
          font-size: 12px;
          margin-left: 8px;
        }
      </style>

      ${this.isEditingMessage?this.renderMessageEditMode(e):this.renderMessageViewMode(e)}

      <div class="de-section signals-section">
        <div class="de-section-header">
          <span class="de-section-title">Signals (${this.message.signals.length})</span>
          ${this.parentEditMode?`
            <button class="de-btn de-btn-primary de-btn-small" id="add-signal-btn">+ Add Signal</button>
          `:""}
        </div>

        ${this.renderBitLayout()}

        <div class="signals-layout">
          <div class="signals-table-container">
            <de-signals-table></de-signals-table>
          </div>
          ${this.isAddingSignal||this.selectedSignal?`
            <div class="signal-editor-panel">
              <de-signal-editor data-edit-mode="${this.parentEditMode}"></de-signal-editor>
            </div>
          `:""}
        </div>
      </div>
    `,this.setupEventListeners(),this.updateChildComponents()}setupEventListeners(){if(!this.shadowRoot)return;this.shadowRoot.getElementById("edit-msg-btn")?.addEventListener("click",()=>{this.isEditingMessage=!0,this.render()}),this.shadowRoot.getElementById("delete-msg-btn")?.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("message-delete-request",{bubbles:!0,composed:!0}))}),this.shadowRoot.getElementById("done-msg-btn")?.addEventListener("click",()=>{if(!this.message.name){alert("Message name is required");return}this.isEditingMessage=!1,this.originalMessage=x(this.message),this.notifyChange(),this.dispatchEvent(new CustomEvent("message-edit-done",{detail:this.message,bubbles:!0,composed:!0})),this.render()}),this.shadowRoot.getElementById("cancel-msg-btn")?.addEventListener("click",()=>{this.isNewMessage?this.dispatchEvent(new CustomEvent("message-edit-cancel",{bubbles:!0,composed:!0})):(this.message=x(this.originalMessage),this.isEditingMessage=!1,this.render())});const e=this.shadowRoot.getElementById("msg_name"),t=this.shadowRoot.getElementById("msg_id"),s=this.shadowRoot.getElementById("msg_dlc"),a=this.shadowRoot.getElementById("msg_sender"),n=this.shadowRoot.getElementById("msg_extended");e?.addEventListener("input",()=>{this.message.name=e.value}),t?.addEventListener("input",()=>{this.message.id=parseInt(t.value,10)||0;const c=`0x${this.message.id.toString(16).toUpperCase()}`,d=this.shadowRoot.querySelector(".id-display");if(d&&(d.textContent=`(${c})`),this.isNewMessage&&this.frames.length>0){const o=R(this.frames,this.message.id,this.message.is_extended);o!==null&&o!==this.message.dlc&&(this.message.dlc=o,s&&(s.value=String(o)))}}),s?.addEventListener("change",()=>{this.message.dlc=parseInt(s.value,10)}),a?.addEventListener("change",()=>{this.message.sender=a.value}),n?.addEventListener("change",()=>{if(this.message.is_extended=n.checked,this.isNewMessage&&this.frames.length>0){const c=R(this.frames,this.message.id,this.message.is_extended);c!==null&&c!==this.message.dlc&&(this.message.dlc=c,s&&(s.value=String(c)))}}),this.setupSliderListeners(),this.shadowRoot.getElementById("add-signal-btn")?.addEventListener("click",()=>{this.isAddingSignal=!0,this.selectedSignal=null,this.editingSignal=D(),this.render()}),this.shadowRoot.querySelector("de-signals-table")?.addEventListener("signal-select",(c=>{const d=c.detail.name;this.selectedSignal===d?(this.selectedSignal=null,this.editingSignal=null,this.isEditingSignal=!1):(this.selectedSignal=d,this.editingSignal=this.message.signals.find(o=>o.name===d)||null,this.isEditingSignal=!1),this.isAddingSignal=!1,this.render()}));const h=this.shadowRoot.querySelector("de-signal-editor");h?.addEventListener("edit-start",(()=>{this.isEditingSignal=!0;const c=this.shadowRoot.querySelector(".bit-layout");if(c&&!c.querySelector(".bit-sliders")){const d=this.message.dlc*8,o=this.editingSignal?.start_bit??0,u=this.editingSignal?.length??1,p=this.editingSignal?.byte_order??"little_endian",g=C(d,o,u,p),m=`
          <div class="bit-sliders">
            <div class="bit-slider-group">
              <div class="bit-slider-label">
                <span>Start Bit</span>
                <span class="bit-slider-value" id="start-bit-value">${o}</span>
              </div>
              <input type="range" class="bit-slider" id="start-bit-slider"
                     min="${g.startMin}" max="${g.startMax}" value="${o}">
            </div>
            <div class="bit-slider-group">
              <div class="bit-slider-label">
                <span>Length</span>
                <span class="bit-slider-value" id="length-value">${u}</span>
              </div>
              <input type="range" class="bit-slider" id="length-slider"
                     min="${g.lenMin}" max="${g.lenMax}" value="${u}">
            </div>
          </div>
        `;c.insertAdjacentHTML("beforeend",m),this.setupSliderListeners()}})),h?.addEventListener("signal-change",(c=>{const d=c.detail;if(this.editingSignal){this.editingSignal={...this.editingSignal,...d};const o=this.shadowRoot.getElementById("start-bit-slider"),u=this.shadowRoot.getElementById("length-slider"),p=this.message.dlc*8;if(o&&u){const g=C(p,d.start_bit,d.length,d.byte_order);o.min=String(g.startMin),o.max=String(g.startMax),u.min=String(g.lenMin),u.max=String(g.lenMax),o.value=String(d.start_bit),u.value=String(d.length);const m=this.shadowRoot.getElementById("start-bit-value"),f=this.shadowRoot.getElementById("length-value");m&&(m.textContent=String(d.start_bit)),f&&(f.textContent=String(d.length))}this.updateBitBar(),this.validateSignalAndSetError(h)}})),h?.addEventListener("edit-done",(c=>{const d=c.detail;if(!d.name){alert("Signal name is required");return}const o=this.message.dlc*8;if(d.start_bit+d.length>o){alert(`Signal extends beyond message size (${o} bits). Reduce start bit or length.`);return}const u=this.isAddingSignal?null:this.selectedSignal,p=this.findOverlappingSignal(d,u);if(p){alert(`Signal "${d.name}" overlaps with "${p.name}" (bits ${p.start_bit}-${p.start_bit+p.length-1})`);return}if(this.isAddingSignal){if(this.message.signals.some(g=>g.name===d.name)){alert(`Signal "${d.name}" already exists`);return}this.message.signals.push(d),this.selectedSignal=d.name}else if(this.selectedSignal){const g=this.message.signals.findIndex(m=>m.name===this.selectedSignal);if(g>=0){if(d.name!==this.selectedSignal&&this.message.signals.some(m=>m.name===d.name)){alert(`Signal "${d.name}" already exists`);return}this.message.signals[g]=d,this.selectedSignal=d.name}}this.isAddingSignal=!1,this.isEditingSignal=!1,this.editingSignal=d,this.notifyChange(),this.render()})),h?.addEventListener("edit-cancel",(()=>{if(this.isEditingSignal=!1,this.isAddingSignal)this.isAddingSignal=!1,this.selectedSignal=null,this.editingSignal=null;else if(this.selectedSignal){const c=this.message.signals.find(d=>d.name===this.selectedSignal);this.editingSignal=c?x(c):null}this.render()})),h?.addEventListener("signal-delete-request",(c=>{const d=c.detail.name;confirm(`Delete signal "${d}"?`)&&(this.message.signals=this.message.signals.filter(o=>o.name!==d),this.selectedSignal=null,this.editingSignal=null,this.notifyChange(),this.render())}))}updateChildComponents(){if(!this.shadowRoot)return;const e=this.shadowRoot.querySelector("de-signals-table");e&&(e.setSignals(this.message.signals),e.setSelected(this.selectedSignal));const t=this.shadowRoot.querySelector("de-signal-editor");t&&this.editingSignal&&(t.setSignal(this.editingSignal,this.isAddingSignal),t.setAvailableNodes(this.availableNodes))}findOverlappingSignal(e,t){const s=L(e.start_bit,e.length,e.byte_order);for(const a of this.message.signals){if(t&&a.name===t||e.multiplexer_value!==null&&a.multiplexer_value!==null&&e.multiplexer_value!==a.multiplexer_value)continue;const n=L(a.start_bit,a.length,a.byte_order);if(s.start<=n.end&&n.start<=s.end)return a}return null}validateSignalAndSetError(e){if(!e||!this.editingSignal)return;const t=this.message.dlc*8,s=this.editingSignal,a=L(s.start_bit,s.length,s.byte_order);if(a.start<0||a.end>=t){e.setError(`Signal exceeds message bounds (0-${t-1} bits)`);return}const n=this.isAddingSignal?null:this.selectedSignal,r=this.findOverlappingSignal(s,n);if(r){e.setError(`Overlaps with "${r.name}"`);return}e.setError(null)}notifyChange(){this.dispatchEvent(new CustomEvent("message-change",{detail:this.message,bubbles:!0,composed:!0}))}}customElements.define("de-message-editor",Oe);const He=`
  .de-nodes-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }
  .de-node-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    background: var(--de-bg-tertiary);
    border: 1px solid var(--de-border);
    border-radius: 4px;
    font-size: 13px;
  }
  .de-node-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--de-text-muted);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .de-node-remove:hover {
    background: var(--de-danger);
    color: white;
  }
  .de-add-node-form {
    display: flex;
    gap: 8px;
  }
  .de-add-node-form .de-input {
    flex: 1;
  }
`;class je extends HTMLElement{nodes=[];constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render()}setNodes(e){this.nodes=[...e],this.render()}getNodes(){return this.nodes}render(){if(!this.shadowRoot)return;const e=this.nodes.map(t=>`
      <span class="de-node-tag">
        ${t}
        <button class="de-node-remove" data-node="${t}">&times;</button>
      </span>
    `).join("");this.shadowRoot.innerHTML=`
      <style>${_(k(),F,q,Z,He)}</style>

      ${this.nodes.length===0?`
        <p class="empty-message" style="text-align: left; padding: 0; margin-bottom: 12px; font-style: italic;">No nodes defined. Add ECU/node names below.</p>
      `:`
        <div class="de-nodes-list">${e}</div>
      `}

      <div class="de-add-node-form">
        <input type="text" class="de-input" id="new-node-input" placeholder="Enter node name (e.g., ECM, TCM)">
        <button class="de-btn de-btn-primary" id="add-node-btn">Add Node</button>
      </div>
    `,this.setupEventListeners()}setupEventListeners(){if(!this.shadowRoot)return;this.shadowRoot.querySelectorAll(".de-node-remove").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.node;n&&(this.nodes=this.nodes.filter(r=>r!==n),this.notifyChange(),this.render())})});const e=this.shadowRoot.getElementById("new-node-input"),t=this.shadowRoot.getElementById("add-node-btn"),s=()=>{const a=e.value.trim();if(a&&!this.nodes.includes(a)){if(!De(a)){alert("Node name must start with a letter or underscore and contain only alphanumeric characters and underscores.");return}this.nodes.push(a),e.value="",this.notifyChange(),this.render()}else this.nodes.includes(a)&&alert(`Node "${a}" already exists.`)};t?.addEventListener("click",s),e?.addEventListener("keypress",a=>{a.key==="Enter"&&s()})}notifyChange(){this.dispatchEvent(v("nodes-change",{nodes:this.nodes}))}}customElements.define("de-nodes-editor",je);class Xe extends HTMLElement{api=null;dbc=V();currentFile=null;isDirty=!1;selectedMessageId=null;selectedMessageExtended=!1;isAddingMessage=!1;activeTab="messages";isEditMode=!1;dbcBeforeEdit=null;frames=[];handleMdf4Loaded=e=>this.onMdf4Loaded(e);constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render(),b.on("mdf4:loaded",this.handleMdf4Loaded)}disconnectedCallback(){b.off("mdf4:loaded",this.handleMdf4Loaded)}onMdf4Loaded(e){this.frames=e.frames}setApi(e){this.api=e,this.loadInitialState()}setFrames(e){this.frames=e}getDbc(){return this.dbc}hasUnsavedChanges(){return this.isDirty}emitStateChange(){ue({isDirty:this.isDirty,isEditing:this.isEditMode,currentFile:this.currentFile,messageCount:this.dbc.messages.length})}async loadFile(e){if(this.api)try{this.dbc=await this.api.loadDbc(e),this.currentFile=e,this.isDirty=!1,this.selectedMessageId=null,this.isAddingMessage=!1,this.render(),this.emitStateChange(),this.showToast("File loaded successfully","success")}catch(t){this.showToast(`Failed to load file: ${t}`,"error")}}async loadInitialState(){if(this.api)try{const e=await this.api.getDbc();e&&(this.dbc=e,this.currentFile=await this.api.getCurrentFile(),this.isDirty=await this.api.isDirty(),this.render())}catch{}}render(){this.shadowRoot&&(this.shadowRoot.innerHTML=`
      <style>${this.getStyles()}</style>

      <div class="de-container">
        <div class="de-header">
          <div class="de-tabs">
            <button class="de-tab ${this.activeTab==="messages"?"active":""}" data-tab="messages">
              Messages (${this.dbc.messages.length})
            </button>
            <button class="de-tab ${this.activeTab==="nodes"?"active":""}" data-tab="nodes">
              Nodes (${this.dbc.nodes.length})
            </button>
            <button class="de-tab ${this.activeTab==="preview"?"active":""}" data-tab="preview">
              Preview
            </button>
          </div>
        </div>

        <div class="de-main">
          ${this.activeTab==="messages"?this.renderMessagesTab():""}
          ${this.activeTab==="nodes"?this.renderNodesTab():""}
          ${this.activeTab==="preview"?this.renderPreviewTab():""}
        </div>
      </div>
    `,this.setupEventListeners(),this.updateChildComponents())}renderMessagesTab(){const e=this.isAddingMessage?null:this.dbc.messages.find(t=>t.id===this.selectedMessageId&&t.is_extended===this.selectedMessageExtended);return`
      <div class="de-sidebar">
        <div class="de-sidebar-header">
          <span class="de-sidebar-title">Messages</span>
          ${this.isEditMode?'<button class="de-btn de-btn-primary de-btn-small" id="add-message-btn">+ Add</button>':""}
        </div>
        <div class="de-sidebar-content">
          <de-messages-list></de-messages-list>
        </div>
      </div>

      <div class="de-detail">
        ${this.isAddingMessage||e?`
          <de-message-editor data-edit-mode="${this.isEditMode}"></de-message-editor>
        `:`
          <div class="de-empty-state">
            <div class="de-empty-state-title">No Message Selected</div>
            <p>Select a message from the list to ${this.isEditMode?'edit it, or click "Add" to create a new one':"view its details"}.</p>
          </div>
        `}
      </div>
    `}renderNodesTab(){return`
      <div class="de-detail de-detail-centered">
        <div class="de-detail-header">
          <span class="de-detail-title">ECU/Node Names</span>
        </div>
        <div class="de-detail-content">
          <p class="de-help-text">
            Define the ECU and node names used in this DBC file. These can be used as message senders and signal receivers.
          </p>
          <de-nodes-editor></de-nodes-editor>

          <div class="de-form-group">
            <label class="de-label">DBC Version</label>
            <input type="text" class="de-input de-input-short" id="dbc-version"
                   value="${this.dbc.version||""}"
                   placeholder="e.g., 1.0">
          </div>
        </div>
      </div>
    `}renderPreviewTab(){const e=B(this.dbc);return`
      <div class="de-detail de-preview-panel">
        <div class="de-detail-header">
          <span class="de-detail-title">DBC File Preview</span>
        </div>
        <div class="de-preview-content">
          <pre class="de-preview-text">${this.escapeHtml(e)}</pre>
        </div>
      </div>
    `}escapeHtml(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}setupEventListeners(){if(!this.shadowRoot)return;this.shadowRoot.querySelectorAll(".de-tab").forEach(n=>{n.addEventListener("click",()=>{this.activeTab=n.dataset.tab,this.render()})}),this.shadowRoot.getElementById("add-message-btn")?.addEventListener("click",()=>{this.isAddingMessage=!0,this.selectedMessageId=null,this.render()}),this.shadowRoot.querySelector("de-messages-list")?.addEventListener("message-select",(n=>{this.selectedMessageId=n.detail.id,this.selectedMessageExtended=n.detail.isExtended,this.isAddingMessage=!1,this.render()}));const t=this.shadowRoot.querySelector("de-message-editor");t?.addEventListener("message-edit-done",(()=>{this.handleSaveMessage()})),t?.addEventListener("message-delete-request",(()=>{this.handleDeleteMessage()})),t?.addEventListener("message-edit-cancel",(()=>{this.isAddingMessage=!1,this.selectedMessageId=null,this.render()})),t?.addEventListener("message-change",(n=>{const r=n,l=this.dbc.messages.findIndex(h=>h.id===this.selectedMessageId&&h.is_extended===this.selectedMessageExtended);l>=0&&(this.dbc.messages[l]=r.detail,this.isDirty=!0,this.syncToBackend(),this.emitStateChange())})),this.shadowRoot.querySelector("de-nodes-editor")?.addEventListener("nodes-change",(n=>{const r=n;this.dbc.nodes=r.detail.nodes,this.isDirty=!0,this.syncToBackend(),this.emitStateChange(),this.render()}));const a=this.shadowRoot.getElementById("dbc-version");a?.addEventListener("input",async()=>{this.dbc.version=a.value||null,this.isDirty=!0,await this.syncToBackend(),this.emitStateChange()})}updateChildComponents(){if(!this.shadowRoot)return;const e=this.shadowRoot.querySelector("de-messages-list");e&&(e.setMessages(this.dbc.messages),e.setSelected(this.selectedMessageId,this.selectedMessageExtended));const t=this.shadowRoot.querySelector("de-message-editor");if(t){const a=this.isAddingMessage?T():this.dbc.messages.find(n=>n.id===this.selectedMessageId&&n.is_extended===this.selectedMessageExtended)||null;t.setMessage(a,this.isAddingMessage),t.setAvailableNodes(this.dbc.nodes),t.setFrames(this.frames)}const s=this.shadowRoot.querySelector("de-nodes-editor");s&&s.setNodes(this.dbc.nodes)}setEditMode(e){e&&!this.isEditMode&&(this.dbcBeforeEdit=x(this.dbc)),this.isEditMode=e,e||(this.isAddingMessage=!1,this.dbcBeforeEdit=null),this.render(),this.emitStateChange()}cancelEdit(){this.dbcBeforeEdit&&(this.dbc=this.dbcBeforeEdit,this.dbcBeforeEdit=null,this.isDirty=!1,this.syncToBackend()),this.isEditMode=!1,this.isAddingMessage=!1,this.selectedMessageId=null,this.render(),this.emitStateChange()}getEditMode(){return this.isEditMode}getIsDirty(){return this.isDirty}getCurrentFile(){return this.currentFile}getMessageCount(){return this.dbc.messages.length}async handleNew(){if(!(this.isDirty&&!confirm("You have unsaved changes. Create a new file anyway?")))if(this.api)try{this.dbc=await this.api.newDbc(),this.currentFile=null,this.isDirty=!1,this.selectedMessageId=null,this.isAddingMessage=!1,this.render(),this.emitStateChange(),this.showToast("New DBC created","success")}catch(e){this.showToast(`Failed to create new DBC: ${e}`,"error")}else this.dbc=V(),this.currentFile=null,this.isDirty=!1,this.selectedMessageId=null,this.isAddingMessage=!1,this.render(),this.emitStateChange()}async handleOpen(){if(this.api&&!(this.isDirty&&!confirm("You have unsaved changes. Open a different file anyway?")))try{const e=await this.api.openFileDialog();e&&await this.loadFile(e)}catch(e){this.showToast(`Failed to open file: ${e}`,"error")}}async handleSave(){this.api&&(this.currentFile?await this.saveToPath(this.currentFile):await this.handleSaveAs())}async handleSaveAs(){if(this.api)try{const e=await this.api.saveFileDialog(this.currentFile||void 0);e&&await this.saveToPath(e)}catch(e){this.showToast(`Failed to save file: ${e}`,"error")}}async saveToPath(e){if(this.api)try{const t=B(this.dbc);await this.api.saveDbcContent(e,t),await this.api.loadDbc(e),this.currentFile=e,this.isDirty=!1,this.isEditMode=!1,this.isAddingMessage=!1,this.dbcBeforeEdit=null,this.render(),this.emitStateChange(),this.showToast("File saved successfully","success")}catch(t){this.showToast(`Failed to save file: ${t}`,"error")}}async handleSaveMessage(){const e=this.shadowRoot?.querySelector("de-message-editor");if(!e)return;const t=e.getMessage();if(!t.name){this.showToast("Message name is required","error");return}if(this.isAddingMessage){if(this.dbc.messages.some(s=>s.id===t.id&&s.is_extended===t.is_extended)){this.showToast(`Message with ID ${t.id} already exists`,"error");return}this.dbc.messages.push(t),this.selectedMessageId=t.id,this.selectedMessageExtended=t.is_extended}else{const s=this.dbc.messages.findIndex(a=>a.id===this.selectedMessageId&&a.is_extended===this.selectedMessageExtended);if(s>=0){if((t.id!==this.selectedMessageId||t.is_extended!==this.selectedMessageExtended)&&this.dbc.messages.some(a=>a.id===t.id&&a.is_extended===t.is_extended)){this.showToast(`Message with ID ${t.id} already exists`,"error");return}this.dbc.messages[s]=t,this.selectedMessageId=t.id,this.selectedMessageExtended=t.is_extended}}this.isDirty=!0,this.isAddingMessage=!1,await this.syncToBackend(),this.render(),this.emitStateChange(),this.showToast("Message saved","success")}async handleDeleteMessage(){this.selectedMessageId!==null&&confirm("Are you sure you want to delete this message?")&&(this.dbc.messages=this.dbc.messages.filter(e=>!(e.id===this.selectedMessageId&&e.is_extended===this.selectedMessageExtended)),this.selectedMessageId=null,this.isDirty=!0,await this.syncToBackend(),this.render(),this.emitStateChange(),this.showToast("Message deleted","success"))}async syncToBackend(){if(this.api)try{await this.api.updateDbc(this.dbc)}catch(e){console.error("Failed to sync to backend:",e)}}showToast(e,t){const s=document.createElement("div");s.className=`de-toast ${t}`,s.textContent=e,this.shadowRoot?.appendChild(s),setTimeout(()=>{s.remove()},3e3)}getStyles(){return`
      :host {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
        --de-bg: #0a0a0a;
        --de-bg-secondary: #111;
        --de-bg-header: #1a1a1a;
        --de-text: #ccc;
        --de-text-muted: #666;
        --de-text-dim: #444;
        --de-border: #222;
        --de-accent: #3b82f6;
        --de-success: #22c55e;
        --de-danger: #ef4444;
        --de-warning: #f59e0b;
        --de-font-mono: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
      }

      .de-container {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        background: var(--de-bg-secondary);
        color: var(--de-text);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
      }

      .de-header {
        border-bottom: 1px solid var(--de-border);
        background: var(--de-bg-secondary);
      }

      .de-btn {
        padding: 6px 12px;
        border: 1px solid var(--de-border);
        border-radius: 3px;
        background: var(--de-bg-secondary);
        color: var(--de-text-muted);
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.15s;
      }

      .de-btn:hover:not(:disabled) {
        background: var(--de-bg-header);
        color: var(--de-text);
      }

      .de-btn-primary {
        background: var(--de-accent);
        color: white;
        border-color: var(--de-accent);
      }

      .de-btn-primary:hover:not(:disabled) {
        background: #2563eb;
        border-color: #2563eb;
      }

      .de-btn:disabled {
        display: none;
      }

      .de-btn-small {
        padding: 4px 8px;
        font-size: 0.75rem;
      }

      .de-tabs {
        display: flex;
        gap: 0;
      }

      .de-tab {
        padding: 10px 20px;
        border: none;
        border-bottom: 2px solid transparent;
        background: transparent;
        color: var(--de-text-muted);
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s;
      }

      .de-tab:hover {
        color: var(--de-text);
        background: var(--de-bg-header);
      }

      .de-tab.active {
        color: var(--de-accent);
        border-bottom-color: var(--de-accent);
      }

      .de-main {
        display: flex;
        flex: 1;
        min-height: 0;
        overflow: hidden;
        background: var(--de-bg);
      }

      .de-sidebar {
        width: 300px;
        min-width: 280px;
        display: flex;
        flex-direction: column;
        min-height: 0;
        overflow: hidden;
        background: var(--de-bg-secondary);
        box-shadow: 0 0 0 1px var(--de-border);
        border-radius: 4px;
        margin: 16px 0 16px 16px;
      }

      .de-sidebar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        background: var(--de-bg-header);
        border-bottom: 1px solid var(--de-border);
      }

      .de-sidebar-title {
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--de-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .de-sidebar-content {
        flex: 1;
        min-height: 0;
        overflow: hidden;
      }

      .de-detail {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        margin: 16px;
        background: var(--de-bg-secondary);
        box-shadow: 0 0 0 1px var(--de-border);
        border-radius: 4px;
      }

      .de-detail-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        background: var(--de-bg-header);
        border-bottom: 1px solid var(--de-border);
        border-radius: 4px 4px 0 0;
      }

      .de-detail-title {
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--de-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .de-detail-content {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
      }

      .de-empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--de-text-dim);
        text-align: center;
        padding: 32px;
      }

      .de-empty-state-title {
        font-size: 1rem;
        font-weight: 500;
        margin-bottom: 8px;
        color: var(--de-text-muted);
      }

      .de-input {
        width: 100%;
        padding: 6px 10px;
        border: 1px solid var(--de-border);
        border-radius: 3px;
        background: var(--de-bg);
        color: var(--de-text-muted);
        font-size: 0.8rem;
        font-family: inherit;
        box-sizing: border-box;
      }

      .de-input:focus {
        outline: 1px solid #555;
        outline-offset: -1px;
      }

      .de-toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        font-size: 0.9rem;
        animation: slideIn 0.3s ease;
        z-index: 1000;
      }

      .de-toast.success {
        background: var(--de-success);
        color: white;
      }

      .de-toast.error {
        background: var(--de-danger);
        color: white;
      }

      .de-detail-centered {
        max-width: 600px;
        margin: 16px auto;
      }

      .de-help-text {
        color: var(--de-text-dim);
        font-size: 0.85rem;
        margin-bottom: 16px;
        line-height: 1.5;
      }

      .de-form-group {
        margin-top: 24px;
      }

      .de-label {
        display: block;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--de-text-dim);
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .de-input-short {
        max-width: 200px;
      }

      .de-preview-panel {
        flex: 1;
        margin: 16px;
      }

      .de-preview-content {
        flex: 1;
        overflow: auto;
        padding: 0;
        background: var(--de-bg);
      }

      .de-preview-text {
        margin: 0;
        padding: 16px;
        font-family: var(--de-font-mono);
        font-size: 12px;
        line-height: 1.5;
        color: var(--de-text);
        white-space: pre;
        overflow-x: auto;
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .de-sidebar-content::-webkit-scrollbar,
      .de-detail::-webkit-scrollbar {
        width: 8px;
      }

      .de-sidebar-content::-webkit-scrollbar-track,
      .de-detail::-webkit-scrollbar-track {
        background: var(--de-bg);
      }

      .de-sidebar-content::-webkit-scrollbar-thumb,
      .de-detail::-webkit-scrollbar-thumb {
        background: var(--de-border);
        border-radius: 4px;
      }

      .de-sidebar-content::-webkit-scrollbar-thumb:hover,
      .de-detail::-webkit-scrollbar-thumb:hover {
        background: var(--de-text-muted);
      }
    `}}customElements.define("cv-dbc-editor",Xe);const j={showDbcTab:!0,showLiveTab:!0,showMdf4Tab:!0,showAboutTab:!0,initialTab:"dbc",autoScroll:!0,maxFrames:1e4,maxSignals:1e4};class Ye extends HTMLElement{api=null;config;state;shadow;mdf4Inspector=null;liveViewer=null;dbcEditor=null;boundBeforeUnload=this.handleBeforeUnload.bind(this);constructor(){super(),this.config={...j},this.state={activeTab:this.config.initialTab,dbcLoaded:!1,dbcFilename:null},this.shadow=this.attachShadow({mode:"open"})}setApi(e){this.api=e,this.setupComponents(),this.loadInitialFiles()}setConfig(e){this.config={...j,...e},this.state.activeTab=this.config.initialTab,this.render()}connectedCallback(){this.render(),window.addEventListener("beforeunload",this.boundBeforeUnload)}disconnectedCallback(){window.removeEventListener("beforeunload",this.boundBeforeUnload)}handleBeforeUnload(e){this.dbcEditor?.getIsDirty()&&(e.preventDefault(),e.returnValue="You have unsaved DBC changes. Are you sure you want to leave?")}render(){this.shadow.innerHTML=`
      <style>${A}</style>
      ${this.generateTemplate()}
    `,this.cacheElements(),this.bindEvents(),this.switchTab(this.state.activeTab)}generateTemplate(){return`
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
    `}generateHeaderTop(){return`
      <div class="cv-app-header-top">
        <h1 class="cv-app-title">CAN Viewer</h1>
        <button class="cv-stat clickable" id="dbcStatusBtn">
          <span class="cv-stat-label">DBC</span>
          <span class="cv-stat-value muted" id="dbcStatusValue">No file loaded</span>
        </button>
      </div>
    `}generateTabs(){return`
      <div class="cv-tabs bordered">
        ${this.config.showDbcTab?'<button class="cv-tab" data-tab="dbc" title="View and manage DBC (CAN Database) files">DBC</button>':""}
        ${this.config.showMdf4Tab?'<button class="cv-tab" data-tab="mdf4" title="Load and view CAN data from ASAM MDF4 measurement files">MDF4</button>':""}
        ${this.config.showLiveTab?'<button class="cv-tab" data-tab="live" title="Capture live CAN frames from SocketCAN interfaces">Live Capture</button>':""}
        ${this.config.showAboutTab?'<button class="cv-tab" data-tab="about" title="About CAN Viewer">About</button>':""}
      </div>
    `}generateMdf4Tab(){return`
      <div id="mdf4Tab" class="cv-tab-pane">
        <cv-mdf4-toolbar></cv-mdf4-toolbar>
      </div>
    `}generateLiveTab(){return`
      <div id="liveTab" class="cv-tab-pane">
        <cv-live-toolbar></cv-live-toolbar>
      </div>
    `}generateDbcTab(){return`
      <div id="dbcTab" class="cv-tab-pane">
        <cv-dbc-toolbar></cv-dbc-toolbar>
      </div>
    `}generateAboutTab(){return`
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
    `}generateAboutPanel(){return`
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
    `}cacheElements(){this.mdf4Inspector=this.shadow.querySelector("cv-mdf4-inspector"),this.liveViewer=this.shadow.querySelector("cv-live-viewer"),this.dbcEditor=this.shadow.querySelector("cv-dbc-editor")}bindEvents(){this.shadow.querySelectorAll(".cv-tabs.bordered .cv-tab").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.tab;t&&this.switchTab(t)})}),this.shadow.querySelector("#dbcStatusBtn")?.addEventListener("click",()=>{this.switchTab("dbc")}),this.shadow.querySelector("cv-mdf4-toolbar")?.addEventListener("open",()=>this.mdf4Inspector?.promptLoadMdf4()),this.shadow.querySelector("cv-mdf4-toolbar")?.addEventListener("clear",()=>this.mdf4Inspector?.clearAllData()),this.shadow.querySelector("cv-live-toolbar")?.addEventListener("refresh-interfaces",()=>this.liveViewer?.loadInterfaces()),this.shadow.querySelector("cv-live-toolbar")?.addEventListener("start-capture",e=>{const t=e.detail.interface;this.liveViewer?.startCapture(t)}),this.shadow.querySelector("cv-live-toolbar")?.addEventListener("stop-capture",()=>this.liveViewer?.stopCapture()),this.shadow.querySelector("cv-live-toolbar")?.addEventListener("clear",()=>this.liveViewer?.clearAllData()),this.shadow.querySelector("cv-dbc-toolbar")?.addEventListener("new",()=>this.dbcEditor?.handleNew()),this.shadow.querySelector("cv-dbc-toolbar")?.addEventListener("open",()=>this.dbcEditor?.handleOpen()),this.shadow.querySelector("cv-dbc-toolbar")?.addEventListener("edit",()=>this.dbcEditor?.setEditMode(!0)),this.shadow.querySelector("cv-dbc-toolbar")?.addEventListener("cancel",()=>this.dbcEditor?.cancelEdit()),this.shadow.querySelector("cv-dbc-toolbar")?.addEventListener("save",()=>this.dbcEditor?.handleSave()),this.shadow.querySelector("cv-dbc-toolbar")?.addEventListener("save-as",()=>this.dbcEditor?.handleSaveAs()),this.shadow.querySelector("#aboutPanel")?.querySelectorAll(".cv-tab").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.tab;t&&(this.shadow.querySelector("#aboutPanel")?.querySelectorAll(".cv-tab").forEach(s=>s.classList.toggle("active",s.dataset.tab===t)),this.shadow.querySelector("#aboutPanel")?.querySelectorAll(".cv-tab-pane").forEach(s=>s.classList.toggle("active",s.id===`about${t.charAt(0).toUpperCase()+t.slice(1)}`)))})}),this.shadow.addEventListener("click",e=>{const s=e.target.closest("a[href]");s?.href&&s.target==="_blank"&&(e.preventDefault(),this.openExternalUrl(s.href))})}setupComponents(){this.api&&(this.mdf4Inspector&&this.mdf4Inspector.setApi(this.createMdf4Api()),this.liveViewer&&this.liveViewer.setApi(this.createLiveApi()),this.dbcEditor&&this.dbcEditor.setApi(this.createDbcEditorApi()))}createMdf4Api(){const e=this.api;return{loadMdf4:t=>e.loadMdf4(t),decodeFrames:t=>e.decodeFrames(t),openFileDialog:t=>e.openFileDialog(t),getDbcInfo:()=>e.getDbcInfo()}}createLiveApi(){const e=this.api;return{listCanInterfaces:()=>e.listCanInterfaces(),startCapture:(t,s)=>e.startCapture(t,s),stopCapture:()=>e.stopCapture(),saveFileDialog:(t,s)=>e.saveFileDialog(t,s),getDbcInfo:()=>e.getDbcInfo(),onLiveCaptureUpdate:t=>e.onLiveCaptureUpdate(t),onCaptureFinalized:t=>e.onCaptureFinalized(t),onCaptureError:t=>e.onCaptureError(t)}}createDbcEditorApi(){const e=this.api,t=s=>({id:s.id,is_extended:!1,name:s.name,dlc:s.dlc,sender:s.sender||"Vector__XXX",signals:s.signals.map(a=>({name:a.name,start_bit:a.start_bit,length:a.length,byte_order:a.byte_order==="big_endian"?"big_endian":"little_endian",is_unsigned:!a.is_signed,factor:a.factor,offset:a.offset,min:a.min,max:a.max,unit:a.unit||null,receivers:{type:"none"},is_multiplexer:!1,multiplexer_value:null}))});return{loadDbc:async s=>{await e.loadDbc(s);const a=await e.getDbcInfo();if(!a)throw new Error("Failed to load DBC");return this.state.dbcLoaded=!0,this.state.dbcFilename=M(s),this.updateDbcStatusUI(),this.emitDbcChange("loaded",a),{version:null,nodes:[],messages:a.messages.map(t)}},saveDbcContent:async(s,a)=>{await e.saveDbcContent(s,a),this.state.dbcFilename=M(s),this.updateDbcStatusUI();const n=await e.getDbcInfo();this.emitDbcChange("updated",n)},newDbc:async()=>(await e.clearDbc(),this.state.dbcLoaded=!1,this.state.dbcFilename=null,this.updateDbcStatusUI(),this.emitDbcChange("new",null),{version:null,nodes:[],messages:[]}),getDbc:async()=>{try{const s=await e.getDbcInfo();return s?{version:null,nodes:[],messages:s.messages.map(t)}:null}catch{return null}},updateDbc:async s=>{const a=B(s);await e.updateDbcContent(a),this.state.dbcLoaded=!0;const n=await e.getDbcInfo();this.emitDbcChange("updated",n)},getCurrentFile:async()=>e.getDbcPath(),isDirty:async()=>!1,openFileDialog:async()=>e.openFileDialog([{name:"DBC Files",extensions:["dbc"]}]),saveFileDialog:async()=>e.saveFileDialog([{name:"DBC Files",extensions:["dbc"]}],"untitled.dbc")}}emitDbcChange(e,t){he({action:e,dbcInfo:t,filename:this.state.dbcFilename})}switchTab(e){if(this.state.activeTab==="dbc"&&e!=="dbc"&&this.dbcEditor?.hasUnsavedChanges()&&!confirm("You have unsaved changes in the DBC editor. Leave anyway?"))return;this.state.activeTab=e,this.shadow.querySelectorAll(".cv-tabs.bordered .cv-tab").forEach(r=>{r.classList.toggle("active",r.dataset.tab===e)}),this.shadow.querySelectorAll(".cv-app-header > .cv-tab-pane").forEach(r=>{r.classList.toggle("active",r.id===`${e}Tab`)});const t=this.shadow.querySelector("#mdf4Panel"),s=this.shadow.querySelector("#livePanel"),a=this.shadow.querySelector("#dbcPanel"),n=this.shadow.querySelector("#aboutPanel");t?.classList.toggle("hidden",e!=="mdf4"),s?.classList.toggle("hidden",e!=="live"),a?.classList.toggle("hidden",e!=="dbc"),n?.classList.toggle("hidden",e!=="about")}updateDbcStatusUI(){const e=this.shadow.querySelector("#dbcStatusBtn"),t=this.shadow.querySelector("#dbcStatusValue");e?.classList.toggle("success",this.state.dbcLoaded),t&&(t.textContent=this.state.dbcFilename||"No file loaded")}async loadInitialFiles(){if(this.api)try{const e=await this.api.getInitialFiles();e.dbc_path&&this.dbcEditor&&(await this.dbcEditor.loadFile(e.dbc_path),this.switchTab("mdf4")),e.mdf4_path&&this.mdf4Inspector&&(await this.mdf4Inspector.loadFile(e.mdf4_path),this.switchTab("mdf4"))}catch(e){console.error("Failed to load initial files:",e)}}async openExternalUrl(e){try{const{open:t}=await ne(async()=>{const{open:s}=await import("./bundle2.js");return{open:s}},[]);await t(e)}catch{window.open(e,"_blank")}}}customElements.define("can-viewer",Ye);async function X(){const i=new se;await i.init();const e=document.querySelector("can-viewer");e&&e.setApi(i)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",X):X();export{Y as i};
