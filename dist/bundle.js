(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(a){if(a.ep)return;a.ep=!0;const n=t(a);fetch(a.href,n)}})();async function j(i,e={},t){return window.__TAURI_INTERNALS__.invoke(i,e,t)}async function W(i={}){return typeof i=="object"&&Object.freeze(i),await j("plugin:dialog|open",{options:i})}async function Z(i={}){return typeof i=="object"&&Object.freeze(i),await j("plugin:dialog|save",{options:i})}class Q{invoke;listen;constructor(){this.invoke=async()=>{throw new Error("Tauri not initialized")},this.listen=async()=>()=>{}}async init(){const e=window.__TAURI__;if(!e)throw new Error("Tauri API not available");this.invoke=e.core.invoke,this.listen=e.event.listen}async loadDbc(e){return await this.invoke("load_dbc",{path:e})}async clearDbc(){await this.invoke("clear_dbc")}async getDbcInfo(){return await this.invoke("get_dbc_info")}async getDbcPath(){return await this.invoke("get_dbc_path")}async decodeFrames(e){return await this.invoke("decode_frames",{frames:e})}async loadMdf4(e){return await this.invoke("load_mdf4",{path:e})}async exportLogs(e,t){return await this.invoke("export_logs",{path:e,frames:t})}async listCanInterfaces(){return await this.invoke("list_can_interfaces")}async startCapture(e,t,s=!1){await this.invoke("start_capture",{interface:e,captureFile:t,append:s})}async stopCapture(){return await this.invoke("stop_capture")}async getInitialFiles(){return await this.invoke("get_initial_files")}async saveDbcContent(e,t){await this.invoke("save_dbc_content",{path:e,content:t})}async updateDbcContent(e){return await this.invoke("update_dbc_content",{content:e})}async openFileDialog(e){const t=await W({multiple:!1,filters:e});return Array.isArray(t)?t[0]||null:t}async saveFileDialog(e,t){return await Z({filters:e,defaultPath:t})}onCanFrame(e){let t=null;return this.listen("can-frame",s=>{e(s.payload)}).then(s=>{t=s}),()=>{t&&t()}}onDecodedSignal(e){let t=null;return this.listen("decoded-signal",s=>{e(s.payload)}).then(s=>{t=s}),()=>{t&&t()}}onDecodeError(e){let t=null;return this.listen("decode-error",s=>{e(s.payload)}).then(s=>{t=s}),()=>{t&&t()}}onCaptureError(e){let t=null;return this.listen("capture-error",s=>{e(s.payload)}).then(s=>{t=s}),()=>{t&&t()}}onLiveCaptureUpdate(e){let t=null;return this.listen("live-capture-update",s=>{e(s.payload)}).then(s=>{t=s}),()=>{t&&t()}}onCaptureFinalized(e){let t=null;return this.listen("capture-finalized",s=>{e(s.payload)}).then(s=>{t=s}),()=>{t&&t()}}}const ee="modulepreload",te=function(i){return"/"+i},B={},se=function(e,t,s){let a=Promise.resolve();if(t&&t.length>0){let r=function(d){return Promise.all(d.map(l=>Promise.resolve(l).then(o=>({status:"fulfilled",value:o}),o=>({status:"rejected",reason:o}))))};document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),v=c?.nonce||c?.getAttribute("nonce");a=r(t.map(d=>{if(d=te(d),d in B)return;B[d]=!0;const l=d.endsWith(".css"),o=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${o}`))return;const h=document.createElement("link");if(h.rel=l?"stylesheet":ee,l||(h.as="script"),h.crossOrigin="",h.href=d,v&&h.setAttribute("nonce",v),document.head.appendChild(h),l)return new Promise((u,p)=>{h.addEventListener("load",u),h.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${d}`)))})}))}function n(r){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=r,window.dispatchEvent(c),!c.defaultPrevented)throw r}return a.then(r=>{for(const c of r||[])c.status==="rejected"&&n(c.reason);return e().catch(n)})};function X(i,e){return`0x${e?i.toString(16).toUpperCase().padStart(8,"0"):i.toString(16).toUpperCase().padStart(3,"0")}`}function ae(i){return i.map(e=>e.toString(16).toUpperCase().padStart(2,"0")).join(" ")}function ie(i){const e=[];return i.is_extended&&e.push("EXT"),i.is_fd&&e.push("FD"),i.brs&&e.push("BRS"),i.esi&&e.push("ESI"),e.join(", ")||"-"}function ne(i,e=6){return i.toFixed(e)}function re(i,e=4){return i.toFixed(e)}function S(i){return i.split("/").pop()?.split("\\").pop()||i}function q(i,e,t=!1){const s=i.filter(c=>c.can_id===e&&c.is_extended===t);if(s.length===0)return null;const a=new Map;for(const c of s){const v=a.get(c.dlc)||0;a.set(c.dlc,v+1)}let n=0,r=s[0].dlc;for(const[c,v]of a)v>n&&(n=v,r=c);return r}function y(i){return JSON.parse(JSON.stringify(i))}function g(i,e){return new CustomEvent(i,{detail:e,bubbles:!0,composed:!0})}function le(i){return{all:i=i||new Map,on:function(e,t){var s=i.get(e);s?s.push(t):i.set(e,[t])},off:function(e,t){var s=i.get(e);s&&(t?s.splice(s.indexOf(t)>>>0,1):i.set(e,[]))},emit:function(e,t){var s=i.get(e);s&&s.slice().map(function(a){a(t)}),(s=i.get("*"))&&s.slice().map(function(a){a(e,t)})}}}const m=le();function $(i){m.emit("dbc:changed",i)}function ce(i){m.emit("dbc:state-change",i)}function oe(i){m.emit("mdf4:loaded",i)}function N(i){m.emit("mdf4:status-change",i)}function de(i){m.emit("frame:selected",i)}function ve(i){m.emit("capture:started",i)}function he(i){m.emit("capture:stopped",i)}function ue(i){m.emit("live:interfaces-loaded",i)}function Y(i){let e={...i};const t=new Set;return{get:()=>e,set(s){e={...e,...s},t.forEach(a=>a(e))},subscribe(s){return t.add(s),()=>t.delete(s)}}}const x=Y({dbcFile:null,mdf4File:null}),F=Y({isCapturing:!1,currentInterface:null,frameCount:0,messageCount:0});class pe extends HTMLElement{unsubscribeStore=null;constructor(){super()}connectedCallback(){this.render(),this.bindEvents(),this.unsubscribeStore=x.subscribe(()=>this.updateStatusUI())}disconnectedCallback(){this.unsubscribeStore?.()}render(){this.className="cv-toolbar cv-tab-pane",this.id="mdf4Tab",this.innerHTML=`
      <button class="cv-btn primary" id="openBtn">Open</button>
      <button class="cv-btn" id="clearBtn">Clear</button>
      <span class="cv-status"><span class="cv-status-dot" id="statusDot"></span><span id="statusText">No file loaded</span></span>
    `}bindEvents(){this.querySelector("#openBtn")?.addEventListener("click",()=>{this.dispatchEvent(g("open",{}))}),this.querySelector("#clearBtn")?.addEventListener("click",()=>{this.dispatchEvent(g("clear",{}))})}updateStatusUI(){const e=this.querySelector("#statusDot"),t=this.querySelector("#statusText"),s=x.get().mdf4File;e?.classList.toggle("active",!!s),t&&(t.textContent=s?S(s):"No file loaded")}}customElements.define("cv-mdf4-toolbar",pe);class ge extends HTMLElement{unsubscribeStore=null;handleInterfacesLoaded=e=>this.onInterfacesLoaded(e);constructor(){super()}connectedCallback(){this.render(),this.bindEvents(),m.on("live:interfaces-loaded",this.handleInterfacesLoaded),this.unsubscribeStore=F.subscribe(e=>this.onStoreChange(e))}disconnectedCallback(){m.off("live:interfaces-loaded",this.handleInterfacesLoaded),this.unsubscribeStore?.()}onInterfacesLoaded(e){const t=this.querySelector("#interfaceSelect");t&&(t.innerHTML='<option value="">Select CAN interface...</option>'+e.interfaces.map(s=>`<option value="${s}">${s}</option>`).join("")),this.updateButtonStates(F.get())}onStoreChange(e){this.updateStatusUI(e),this.updateButtonStates(e)}render(){this.className="cv-toolbar cv-tab-pane",this.id="liveTab",this.innerHTML=`
      <label>Interface:</label>
      <select class="cv-select" id="interfaceSelect">
        <option value="">Select CAN interface...</option>
      </select>
      <button class="cv-btn" id="refreshBtn">↻</button>
      <button class="cv-btn success" id="startBtn" disabled>Start</button>
      <button class="cv-btn danger" id="stopBtn" disabled>Stop</button>
      <button class="cv-btn" id="clearBtn">Clear</button>
      <span class="cv-status"><span class="cv-status-dot" id="statusDot"></span><span id="statusText">Idle</span></span>
    `}bindEvents(){this.querySelector("#refreshBtn")?.addEventListener("click",()=>{this.dispatchEvent(g("refresh-interfaces",{}))}),this.querySelector("#startBtn")?.addEventListener("click",()=>{const e=this.querySelector("#interfaceSelect");e?.value&&this.dispatchEvent(g("start-capture",{interface:e.value}))}),this.querySelector("#stopBtn")?.addEventListener("click",()=>{this.dispatchEvent(g("stop-capture",{}))}),this.querySelector("#clearBtn")?.addEventListener("click",()=>{this.dispatchEvent(g("clear",{}))}),this.querySelector("#interfaceSelect")?.addEventListener("change",()=>{this.updateButtonStates(F.get())})}updateStatusUI(e){const t=this.querySelector("#statusDot"),s=this.querySelector("#statusText"),a=x.get().mdf4File;t?.classList.toggle("active",e.isCapturing),s&&(a?s.textContent=S(a):s.textContent=e.isCapturing?"Capturing...":"Idle")}updateButtonStates(e){const t=this.querySelector("#interfaceSelect"),s=this.querySelector("#startBtn"),a=this.querySelector("#stopBtn");s&&t&&(s.disabled=!t.value||e.isCapturing),a&&(a.disabled=!e.isCapturing)}}customElements.define("cv-live-toolbar",ge);class me extends HTMLElement{isDirty=!1;isEditing=!1;messageCount=0;unsubscribeStore=null;handleStateChange=e=>this.onStateChange(e);constructor(){super()}connectedCallback(){this.render(),this.bindEvents(),m.on("dbc:state-change",this.handleStateChange),this.unsubscribeStore=x.subscribe(()=>this.updateStatusUI())}disconnectedCallback(){m.off("dbc:state-change",this.handleStateChange),this.unsubscribeStore?.()}onStateChange(e){this.isDirty=e.isDirty,this.isEditing=e.isEditing,this.messageCount=e.messageCount,this.updateUI()}render(){this.className="cv-toolbar cv-tab-pane",this.id="dbcTab",this.innerHTML=`
      <button class="cv-btn" id="newBtn">New</button>
      <button class="cv-btn" id="openBtn">Open</button>
      <button class="cv-btn primary" id="editBtn">Edit</button>
      <button class="cv-btn" id="cancelBtn" style="display:none">Cancel</button>
      <button class="cv-btn" id="saveBtn" disabled>Save</button>
      <button class="cv-btn" id="saveAsBtn" disabled>Save As</button>
      <span class="cv-status"><span class="cv-status-dot" id="statusDot"></span><span id="statusText">No file loaded</span></span>
    `}bindEvents(){this.querySelector("#newBtn")?.addEventListener("click",()=>{this.dispatchEvent(g("new",{}))}),this.querySelector("#openBtn")?.addEventListener("click",()=>{this.dispatchEvent(g("open",{}))}),this.querySelector("#editBtn")?.addEventListener("click",()=>{this.dispatchEvent(g("edit",{}))}),this.querySelector("#cancelBtn")?.addEventListener("click",()=>{this.dispatchEvent(g("cancel",{}))}),this.querySelector("#saveBtn")?.addEventListener("click",()=>{this.dispatchEvent(g("save",{}))}),this.querySelector("#saveAsBtn")?.addEventListener("click",()=>{this.dispatchEvent(g("save-as",{}))})}updateUI(){const e=this.querySelector("#editBtn"),t=this.querySelector("#cancelBtn"),s=this.querySelector("#saveBtn"),a=this.querySelector("#saveAsBtn");e&&(e.style.display=this.isEditing?"none":""),t&&(t.style.display=this.isEditing?"":"none"),s&&(s.disabled=!this.isDirty,s.classList.toggle("success",this.isDirty)),a&&(a.disabled=this.messageCount===0),this.updateStatusUI()}updateStatusUI(){const e=this.querySelector("#statusDot"),t=this.querySelector("#statusText"),s=x.get().dbcFile;if(e?.classList.toggle("active",!!s&&!this.isDirty),e?.classList.toggle("warning",this.isDirty),t){const a=s?S(s):"No file loaded";t.textContent=this.isDirty?`${a} *`:a}}}customElements.define("cv-dbc-toolbar",me);const E=':host{--cv-bg: #0a0a0a;--cv-bg-alt: #111;--cv-bg-elevated: #1a1a1a;--cv-text: #ccc;--cv-text-muted: #666;--cv-text-dim: #444;--cv-border: #222;--cv-radius: 4px;--cv-accent: #3b82f6;--cv-accent-rgb: 59, 130, 246;--cv-success: #22c55e;--cv-danger: #ef4444;--cv-warning: #eab308;--cv-font-mono: ui-monospace, "Cascadia Code", Consolas, monospace;--cv-font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden;font-family:var(--cv-font-sans);background:var(--cv-bg);color:var(--cv-text);color-scheme:dark}*{margin:0;padding:0;box-sizing:border-box}.hidden{display:none!important}.cv-card,.cv-panel{display:flex;flex-direction:column;background:var(--cv-bg-alt);border:1px solid var(--cv-border);border-radius:var(--cv-radius);overflow:hidden}.cv-card{flex:1}.cv-panel{height:100%;font-size:14px}.cv-card-header,.cv-panel-header{display:flex;align-items:center;border-bottom:1px solid var(--cv-border)}.cv-card-header{justify-content:space-between;padding:8px 12px;background:var(--cv-bg-elevated)}.cv-panel-header{padding:0;background:var(--cv-bg-alt)}.cv-card-title{font-size:.85rem;font-weight:500;color:var(--cv-text-muted);text-transform:uppercase;letter-spacing:.5px}.cv-card-body,.cv-panel-body{flex:1}.cv-card-body{padding:12px 16px;color:var(--cv-text-muted);font-size:.85rem;line-height:1.5;margin:0}.cv-panel-body{padding:8px}.cv-panel-body.flush{padding:0}.cv-live-viewer,.cv-mdf4-inspector{display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden}.cv-live-viewer>.cv-panel,.cv-mdf4-inspector>.cv-panel{display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden}.cv-live-viewer>.cv-panel>.cv-panel-body,.cv-mdf4-inspector>.cv-panel>.cv-panel-body{display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden}.cv-live-viewer .cv-tab-pane,.cv-mdf4-inspector .cv-tab-pane{display:none}.cv-live-viewer .cv-tab-pane.active,.cv-mdf4-inspector .cv-tab-pane.active{display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden}.cv-mdf4-inspector .cv-grid,.cv-editor-main .cv-grid{flex:1;min-height:0;overflow:hidden}.cv-mdf4-inspector .cv-card,.cv-editor-main .cv-card{display:flex;flex-direction:column;min-height:0;overflow:hidden}.cv-live-viewer .cv-table-wrap,.cv-mdf4-inspector .cv-table-wrap,.cv-editor-main .cv-table-wrap{flex:1;min-height:0;overflow-y:auto}.cv-live-viewer .cv-table-wrap::-webkit-scrollbar,.cv-mdf4-inspector .cv-table-wrap::-webkit-scrollbar,.cv-editor-main .cv-table-wrap::-webkit-scrollbar{width:8px}.cv-live-viewer .cv-table-wrap::-webkit-scrollbar-track,.cv-mdf4-inspector .cv-table-wrap::-webkit-scrollbar-track,.cv-editor-main .cv-table-wrap::-webkit-scrollbar-track{background:#1a1a1a}.cv-live-viewer .cv-table-wrap::-webkit-scrollbar-thumb,.cv-mdf4-inspector .cv-table-wrap::-webkit-scrollbar-thumb,.cv-editor-main .cv-table-wrap::-webkit-scrollbar-thumb{background:#444;border-radius:4px}.cv-live-viewer .cv-table-wrap::-webkit-scrollbar-thumb:hover,.cv-mdf4-inspector .cv-table-wrap::-webkit-scrollbar-thumb:hover,.cv-editor-main .cv-table-wrap::-webkit-scrollbar-thumb:hover{background:#666}.cv-stats-bar{display:flex;gap:24px;padding:8px 16px;background:var(--cv-bg-elevated);border-top:1px solid var(--cv-border)}.cv-tabs{display:flex}.cv-tabs.bordered{border-bottom:1px solid var(--cv-border);margin-bottom:15px}.cv-tab{padding:10px 20px;border:none;border-bottom:2px solid transparent;background:transparent;color:var(--cv-text-muted);font-size:.9rem;font-weight:500;cursor:pointer;transition:all .15s}.cv-tab:hover{color:var(--cv-text);background:var(--cv-bg-elevated)}.cv-tab.active{color:var(--cv-accent);border-bottom-color:var(--cv-accent)}.cv-tab-badge{font-size:.75rem;color:var(--cv-text-dim);margin-left:6px;padding:2px 6px;background:var(--cv-bg);border-radius:3px}.cv-tab-badge.dimmed{opacity:.5}.cv-tab-badge-error:not(:empty):not([data-count="0"]){background:#ef444433;color:var(--cv-danger)}.cv-tab.active .cv-tab-badge{background:#3b82f633;color:var(--cv-accent)}.cv-tab.active .cv-tab-badge-error:not(:empty):not([data-count="0"]){background:#ef44444d;color:var(--cv-danger)}.cv-tab.active .cv-tab-badge.dimmed{opacity:.6}.cv-tab-pane{display:none!important}.cv-tab-pane.active{display:block!important}.cv-toolbar.cv-tab-pane.active{display:flex!important}.cv-grid{display:flex;height:100%;padding:8px;gap:8px}@media(max-width:1200px){.cv-grid.responsive{flex-direction:column}}.cv-app{display:flex;flex-direction:column;height:100%;max-width:1800px;margin:0 auto;padding:20px;overflow:hidden}.cv-app>.cv-panel,.cv-app>cv-mdf4-inspector,.cv-app>cv-live-viewer,.cv-app>cv-dbc-editor{display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden}.cv-app-header{flex-shrink:0;background:var(--cv-bg-alt);padding:15px 12px;border-radius:var(--cv-radius);margin-bottom:20px;box-shadow:0 0 0 1px var(--cv-border)}.cv-app-header-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:15px}.cv-header-row{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}.cv-app-title{font-size:1.2rem;color:var(--cv-text-muted);font-weight:500;margin:0}.cv-stats{display:flex;gap:16px;margin-left:auto;margin-right:16px}.cv-stat{display:flex;flex-direction:column;align-items:center;padding:4px 10px;background:var(--cv-bg-alt);border:1px solid var(--cv-border);border-radius:var(--cv-radius);min-width:60px}.cv-stat.clickable{cursor:pointer;transition:all .15s}.cv-stat.clickable:hover{background:var(--cv-bg-elevated)}.cv-stat.success{border-color:#22c55e4d}.cv-stat.success:hover{background:#22c55e1a}.cv-stat-label{font-size:.65rem;color:var(--cv-text-dim);text-transform:uppercase;letter-spacing:.5px}.cv-stat-value{font-size:.85rem;font-weight:600;color:var(--cv-text);font-family:var(--cv-font-mono)}.cv-stat-value.muted{color:var(--cv-text-dim)}.cv-stat.success .cv-stat-value{color:var(--cv-success)}.cv-toolbar,.cv-filters{display:flex;flex-wrap:wrap;gap:15px;align-items:center}.cv-filters{padding:12px 16px}.cv-filters-grid{display:grid;grid-template-columns:1fr 1fr auto;gap:24px;padding:16px}.cv-filter-section{display:flex;flex-direction:column;gap:10px}.cv-filter-section-title{font-size:.75rem;font-weight:600;color:var(--cv-text-muted);text-transform:uppercase;letter-spacing:.5px;padding-bottom:6px;border-bottom:1px solid var(--cv-border)}.cv-filter-row{display:flex;align-items:center;gap:8px}.cv-filter-row label{font-size:.8rem;color:var(--cv-text-muted);min-width:90px}.cv-filter-row .cv-input,.cv-filter-row .cv-select{flex:1}.cv-filter-sep{color:var(--cv-text-dim);font-size:.8rem}.cv-filter-actions{display:flex;flex-direction:column;justify-content:space-between;min-width:160px}.cv-filter-summary{font-size:.8rem;color:var(--cv-text-muted);padding:8px;background:var(--cv-bg);border-radius:var(--cv-radius);text-align:center}.cv-filter-link{font-size:.75rem;color:var(--cv-text-dim);cursor:pointer;transition:color .15s}.cv-filter-link:hover,.cv-filter-link.active{color:var(--cv-accent)}@media(max-width:1000px){.cv-filters-grid{grid-template-columns:1fr}}.cv-toolbar>label,.cv-filter-group label{font-size:.85rem;color:var(--cv-text-muted);white-space:nowrap}.cv-btn{height:28px;padding:0 12px;border:1px solid var(--cv-border);border-radius:3px;cursor:pointer;font-size:.8rem;transition:all .15s;background:var(--cv-bg-alt);color:var(--cv-text-muted)}.cv-btn:hover:not(:disabled){background:var(--cv-bg-elevated);color:var(--cv-text)}.cv-btn:disabled{opacity:.3;cursor:not-allowed}.cv-btn.small{height:22px;padding:0 10px;font-size:.75rem}.cv-btn.primary{background:var(--cv-border);color:var(--cv-text)}.cv-btn.primary:hover:not(:disabled){background:var(--cv-bg-elevated)}.cv-btn.success{background:var(--cv-success);color:#fff;border-color:var(--cv-success)}.cv-btn.danger{background:var(--cv-danger);color:#fff;border-color:var(--cv-danger)}.cv-btn.success:hover:not(:disabled),.cv-btn.danger:hover:not(:disabled){filter:brightness(1.1)}.cv-btn.ghost{background:var(--cv-bg);color:var(--cv-text)}.cv-btn.ghost:hover:not(:disabled){background:var(--cv-bg-alt)}.cv-input,.cv-select{height:28px;padding:0 10px;border:1px solid var(--cv-border);border-radius:3px;background:var(--cv-bg);color:var(--cv-text-muted);font-size:.8rem}.cv-input:focus,.cv-select:focus{outline:1px solid var(--cv-accent);outline-offset:-1px}.cv-input.mono{font-family:var(--cv-font-mono);color:var(--cv-text)}.cv-input::placeholder{color:var(--cv-text-dim)}.cv-input.wide{width:150px}#interfaceSelect{width:180px}.cv-select option{font-weight:700;color:var(--cv-text)}.cv-select option[value=""]{font-weight:400;color:var(--cv-text-muted)}.cv-status{display:flex;align-items:center;gap:8px;font-size:.85rem;color:var(--cv-text-muted)}.cv-status-dot{width:8px;height:8px;border-radius:50%;background:var(--cv-border)}.cv-status-dot.active{background:var(--cv-success);box-shadow:0 0 6px var(--cv-success)}.cv-status-dot.warning{background:var(--cv-warning);box-shadow:0 0 6px var(--cv-warning)}.cv-table-wrap{height:100%;overflow-y:auto}.cv-table{width:100%;border-collapse:collapse;font-size:.85rem}.cv-table th{position:sticky;top:0;background:var(--cv-bg-alt);padding:8px 12px;text-align:left;font-weight:500;font-size:.75rem;color:var(--cv-text-muted);text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--cv-border)}.cv-table td{padding:8px 12px;border-bottom:1px solid var(--cv-border);font-family:var(--cv-font-mono);height:36px}.cv-table tr:hover{background:var(--cv-bg-elevated)}.cv-table tr.clickable{cursor:pointer}.cv-table tr.matched{border-left:3px solid var(--cv-accent)}.cv-table tr.selected{background:#3b82f626!important}.cv-cell-dim{color:var(--cv-text-dim)}.cv-cell-id{color:var(--cv-text);font-weight:600}.cv-cell-name{color:var(--cv-accent);font-weight:500}.cv-cell-nomatch{color:var(--cv-danger)}.cv-cell-data{color:var(--cv-text-muted);letter-spacing:1px}.cv-cell-value{color:var(--cv-text);font-weight:600;text-align:right;font-variant-numeric:tabular-nums}.cv-cell-unit{color:var(--cv-text-muted);font-style:italic}.cv-signal-monitor{display:flex;flex-direction:column;gap:2px;padding:8px;overflow-y:auto}.cv-signal-group-header{background:var(--cv-bg-alt);color:var(--cv-text);font-weight:600;font-size:.85rem;padding:8px 12px;margin-top:8px;border-radius:var(--cv-radius)}.cv-signal-group-header:first-child{margin-top:0}.cv-signal-row{display:grid;grid-template-columns:160px 1fr;gap:16px;align-items:center;padding:8px 12px;background:var(--cv-bg);border-radius:var(--cv-radius)}.cv-signal-row:hover{background:var(--cv-bg-elevated)}.cv-signal-info{display:flex;flex-direction:column;gap:2px;min-width:0;flex-shrink:0}.cv-signal-name{font-size:.85rem;color:var(--cv-text);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cv-signal-value{font-size:1rem;font-weight:600;color:var(--cv-accent);font-family:var(--cv-font-mono);font-variant-numeric:tabular-nums;white-space:nowrap}.cv-signal-unit{font-size:.8rem;font-weight:400;color:var(--cv-text-muted)}.cv-signal-chart{display:flex;align-items:center;gap:8px;flex:1;min-width:0}.cv-signal-min,.cv-signal-max{font-size:.7rem;color:var(--cv-text-dim);font-family:var(--cv-font-mono);font-variant-numeric:tabular-nums;min-width:45px;flex-shrink:0}.cv-signal-min{text-align:right}.cv-signal-max{text-align:left}.cv-sparkline{flex:1;height:32px;min-width:80px;background:var(--cv-bg-alt);border-radius:4px;overflow:hidden}.cv-sparkline svg{width:100%;height:100%}.cv-group-header td{background:var(--cv-bg-alt);color:var(--cv-text);font-weight:600;padding:6px 12px;border-top:1px solid var(--cv-border)}.cv-group-header:first-child td{border-top:none}.cv-cell-signal{color:var(--cv-accent);font-weight:500;padding-left:32px}.cv-empty{color:var(--cv-text-dim);text-align:center;padding:20px}.cv-cell-error-type{color:var(--cv-danger);font-weight:500}.cv-error-summary-row{background:#ef44440d}.cv-error-summary-row:hover{background:#ef44441a}.cv-decode-error{color:var(--cv-danger);font-size:.8rem;margin-left:auto;padding:0 8px}.cv-list-item{padding:8px 12px;border-bottom:1px solid var(--cv-border);cursor:pointer;transition:background .15s}.cv-list-item:hover{background:var(--cv-bg-elevated)}.cv-list-item.selected{background:var(--cv-bg-elevated);border-left:3px solid var(--cv-accent)}.cv-list-item-title{font-weight:500;color:var(--cv-text);font-size:.9rem}.cv-list-item-subtitle{font-family:var(--cv-font-mono);color:var(--cv-text-muted);font-size:.8rem}.cv-list-item-meta{font-size:.75rem;color:var(--cv-text-dim);margin-top:2px}.cv-signal-card{background:var(--cv-bg);border:1px solid var(--cv-border);border-radius:var(--cv-radius);padding:12px;margin-bottom:10px}.cv-signal-card-title{font-weight:500;color:var(--cv-text);font-size:.9rem;margin-bottom:8px}.cv-signal-props{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;font-size:.8rem}.cv-signal-prop{display:flex;flex-direction:column}.cv-signal-prop-label{color:var(--cv-text-dim);font-size:.7rem;text-transform:uppercase}.cv-signal-prop-value{color:var(--cv-text-muted);font-family:var(--cv-font-mono)}.cv-detail-title{font-size:1rem;font-weight:500;color:var(--cv-text)}.cv-detail-subtitle{font-size:.8rem;color:var(--cv-text-muted);margin-top:4px}.cv-about-header{border-bottom:none;align-items:center;gap:32px}#aboutFeatures .cv-card{border-left:3px solid var(--cv-accent)}#aboutAcknowledgments .cv-card{border-left:3px solid var(--cv-success)}.cv-about-title-group{display:flex;flex-direction:column;gap:2px}.cv-about-title{font-size:1.2rem;font-weight:600;color:var(--cv-text)}.cv-about-version{color:var(--cv-text-dim);font-size:.8rem}.cv-about-desc{flex:1;color:var(--cv-text-muted);font-size:.85rem;line-height:1.5}.cv-deps-list{list-style:none;margin:0}.cv-deps-list li{padding:8px 0;border-bottom:1px solid var(--cv-border)}.cv-deps-list li:last-child{border-bottom:none}.cv-deps-list li a{color:var(--cv-text);text-decoration:none}.cv-deps-list li a:hover{color:var(--cv-accent)}.cv-deps-list li.cv-sister-project{background:linear-gradient(90deg,rgba(var(--cv-accent-rgb),.08) 0%,transparent 100%);margin:0 -16px;padding:8px 16px;border-radius:4px;border-bottom-color:transparent}.cv-deps-list li.cv-sister-project a{color:var(--cv-accent);font-weight:600}.cv-about-license{color:var(--cv-text-dim);font-size:.85rem;padding:16px;text-align:center}.cv-toast{position:fixed;bottom:20px;right:20px;padding:12px 20px;border-radius:var(--cv-radius);font-size:.9rem;animation:cv-slideIn .3s ease;z-index:1000}.cv-toast.success{background:var(--cv-success);color:#fff}.cv-toast.error{background:var(--cv-danger);color:#fff}@keyframes cv-slideIn{0%{transform:translate(100%);opacity:0}to{transform:translate(0);opacity:1}}.cv-editor-container{position:absolute;inset:0;display:flex;flex-direction:column;background:var(--cv-bg-alt);color:var(--cv-text);font-size:14px}.cv-editor-header{border-bottom:1px solid var(--cv-border);background:var(--cv-bg-alt)}.cv-editor-main{display:flex;flex:1;min-height:0;overflow:hidden;background:var(--cv-bg)}.cv-detail-title{font-size:.85rem;font-weight:500;color:var(--cv-text-muted);text-transform:uppercase;letter-spacing:.5px}.cv-detail-subtitle{font-size:.75rem;color:var(--cv-text-dim)}.cv-form-group{margin-bottom:16px}.cv-form-row{display:flex;gap:16px;margin-bottom:16px}.cv-form-row>.cv-form-group{flex:1;margin-bottom:0}.cv-form-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px}.cv-form-row-4{display:flex;gap:8px;margin-bottom:8px}.cv-form-row-4>.cv-form-group{flex:1;margin-bottom:0}.cv-label{display:block;font-size:.75rem;font-weight:500;color:var(--cv-text-dim);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px}.cv-checkbox-group{display:flex;align-items:center;gap:8px}.cv-checkbox{width:18px;height:18px;cursor:pointer;accent-color:var(--cv-accent)}.cv-form-group-sm{margin-bottom:8px}.cv-form-group-sm .cv-label{margin-bottom:2px}.cv-form-group-sm .cv-input,.cv-form-group-sm .cv-select{padding:4px 6px;font-size:12px}.cv-section{margin-bottom:24px;padding:16px;background:var(--cv-bg-alt);border:1px solid var(--cv-border);border-radius:var(--cv-radius)}.cv-section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.cv-section-title{font-weight:600;font-size:14px}.cv-empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:var(--cv-text-dim);text-align:center;padding:32px}.cv-empty-state-title{font-size:1rem;font-weight:500;margin-bottom:8px;color:var(--cv-text-muted)}.cv-empty-message{padding:24px;text-align:center;color:var(--cv-text-muted)}.cv-field{display:flex;gap:8px;font-size:13px;padding:4px 0}.cv-field-label{color:var(--cv-text-muted);white-space:nowrap}.cv-field-label:after{content:":"}.cv-field-value{color:var(--cv-text);font-family:var(--cv-font-mono)}.cv-field-value.text{font-family:inherit}.cv-msg-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.cv-msg-header-info{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.cv-msg-title{font-weight:600;font-size:15px;color:#fff}.cv-msg-id{font-family:var(--cv-font-mono);color:var(--cv-text-muted);font-size:13px}.cv-msg-meta{font-size:12px;color:var(--cv-text-muted);padding:2px 8px;background:var(--cv-bg-elevated);border-radius:3px}.cv-msg-actions{display:flex;gap:6px}.cv-bit-layout{background:var(--cv-bg);border:1px solid var(--cv-border);border-radius:var(--cv-radius);padding:8px 12px;margin-bottom:12px}.cv-bit-layout-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;font-size:10px;color:var(--cv-text-muted)}.cv-bit-bar{position:relative;height:10px;background:var(--cv-bg-elevated);border-radius:2px;overflow:hidden}.cv-bit-segment{position:absolute;top:0;height:100%;display:flex;align-items:center;justify-content:center;font-size:8px;font-family:var(--cv-font-mono);color:#ffffffe6;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border-right:1px solid rgba(0,0,0,.3);box-sizing:border-box}.cv-bit-segment.current{z-index:2;box-shadow:0 0 0 1px #fff}.cv-bit-segment.overlap{background:repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(255,0,0,.3) 2px,rgba(255,0,0,.3) 4px)!important}.cv-bit-markers{display:flex;justify-content:space-between;margin-top:2px;font-size:9px;font-family:var(--cv-font-mono);color:#444}.cv-bit-sliders{margin-top:8px;display:flex;gap:16px}.cv-bit-slider-group{flex:1}.cv-bit-slider-label{display:flex;justify-content:space-between;font-size:10px;color:var(--cv-text-muted);margin-bottom:2px}.cv-bit-slider-value{font-family:var(--cv-font-mono);color:var(--cv-text)}.cv-bit-slider{width:100%;height:6px;-webkit-appearance:none;appearance:none;background:#333;border-radius:3px;outline:none;cursor:pointer}.cv-bit-slider::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;background:var(--cv-accent);border-radius:50%;cursor:pointer;border:2px solid #fff}.cv-bit-slider::-moz-range-thumb{width:14px;height:14px;background:var(--cv-accent);border-radius:50%;cursor:pointer;border:2px solid #fff}.cv-signals-section{flex:1;display:flex;flex-direction:column;min-height:0;max-height:500px}.cv-signals-layout{display:flex;gap:16px;flex:1;min-height:0;overflow:hidden}.cv-signals-table-container{flex:1;overflow:auto;border:1px solid var(--cv-border);border-radius:var(--cv-radius)}.cv-signal-editor-panel{width:320px;flex-shrink:0;padding:12px;background:var(--cv-bg-alt);border:1px solid var(--cv-border);border-radius:var(--cv-radius);max-height:380px;overflow-y:auto}.cv-nodes-list{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}.cv-node-tag{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;background:var(--cv-bg-elevated);border:1px solid var(--cv-border);border-radius:var(--cv-radius);font-size:13px}.cv-node-remove{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border:none;border-radius:50%;background:transparent;color:var(--cv-text-muted);font-size:14px;cursor:pointer;transition:all .15s ease}.cv-node-remove:hover{background:var(--cv-danger);color:#fff}.cv-add-node-form{display:flex;gap:8px}.cv-add-node-form .cv-input{flex:1}.cv-preview-panel{flex:1;margin:16px}.cv-preview-content{flex:1;overflow:auto;padding:0;background:var(--cv-bg)}.cv-preview-text{margin:0;padding:16px;font-family:var(--cv-font-mono);font-size:12px;line-height:1.5;color:var(--cv-text);white-space:pre;overflow-x:auto}.cv-help-text{color:var(--cv-text-dim);font-size:.85rem;margin-bottom:16px;line-height:1.5}.cv-actions{display:flex;gap:8px;margin-top:16px}.cv-btn.warning{background:#f59e0b;color:#fff;border-color:#f59e0b}.cv-btn.warning:hover:not(:disabled){background:#d97706;border-color:#d97706}.cv-error-msg{color:var(--cv-danger);font-size:11px;margin-top:4px}.cv-id-display{font-family:var(--cv-font-mono);color:var(--cv-text-muted);font-size:12px;margin-left:8px}.cv-list-item-compact{padding:6px 12px}.cv-sidebar-content::-webkit-scrollbar,.cv-detail::-webkit-scrollbar,.cv-signal-editor-panel::-webkit-scrollbar{width:8px}.cv-sidebar-content::-webkit-scrollbar-track,.cv-detail::-webkit-scrollbar-track,.cv-signal-editor-panel::-webkit-scrollbar-track{background:var(--cv-bg)}.cv-sidebar-content::-webkit-scrollbar-thumb,.cv-detail::-webkit-scrollbar-thumb,.cv-signal-editor-panel::-webkit-scrollbar-thumb{background:var(--cv-border);border-radius:4px}.cv-sidebar-content::-webkit-scrollbar-thumb:hover,.cv-detail::-webkit-scrollbar-thumb:hover,.cv-signal-editor-panel::-webkit-scrollbar-thumb:hover{background:var(--cv-text-muted)}.cv-modal-overlay{position:fixed;inset:0;background:#0009;display:flex;align-items:center;justify-content:center;z-index:1000}.cv-modal{background:var(--cv-bg-elevated);border:1px solid var(--cv-border);border-radius:var(--cv-radius);min-width:360px;max-width:480px;box-shadow:0 8px 32px #0006}.cv-modal-header{padding:12px 16px;font-weight:600;font-size:.95rem;color:var(--cv-text);border-bottom:1px solid var(--cv-border)}.cv-modal-body{padding:16px;color:var(--cv-text-muted);font-size:.9rem}.cv-modal-body p{margin:0 0 8px}.cv-modal-body p:last-child{margin-bottom:0}.cv-modal-filename{font-family:var(--cv-font-mono);font-size:.85rem;color:var(--cv-accent);background:var(--cv-bg);padding:8px 12px;border-radius:var(--cv-radius);word-break:break-all}.cv-modal-actions{display:flex;gap:8px;padding:12px 16px;border-top:1px solid var(--cv-border);justify-content:flex-end}';function be(i){const e=i.trim().toUpperCase();return e||null}function fe(i){const e=i.trim();if(!e)return null;const t=e.split(",").map(s=>s.trim()).filter(s=>s.length>0).map(s=>parseInt(s,16)).filter(s=>!isNaN(s));return t.length>0?t:null}function R(i){const e=i.trim().toLowerCase();if(!e)return null;const t=e.split(",").map(s=>s.trim().toLowerCase()).filter(s=>s.length>0);return t.length>0?t:null}function G(i){let e=0;return(i.timeMin!==null||i.timeMax!==null)&&e++,i.canIds?.length&&e++,i.messages?.length&&e++,i.signals?.length&&e++,i.dataPattern&&e++,i.channel&&e++,i.matchStatus!=="all"&&e++,e}const xe=500;class ye extends HTMLElement{frames=[];selectedIndex=null;messageNameLookup=()=>"-";delegatedHandler=null;constructor(){super()}connectedCallback(){this.setupEventDelegation()}disconnectedCallback(){this.removeEventDelegation()}setupEventDelegation(){const e=this.querySelector("tbody");!e||this.delegatedHandler||(this.delegatedHandler=t=>{const a=t.target.closest("tr.clickable");a?.dataset.index&&this.selectFrame(parseInt(a.dataset.index,10))},e.addEventListener("click",this.delegatedHandler))}removeEventDelegation(){if(!this.delegatedHandler)return;const e=this.querySelector("tbody");e&&e.removeEventListener("click",this.delegatedHandler),this.delegatedHandler=null}setMessageNameLookup(e){this.messageNameLookup=e}setFrames(e){this.frames=e,this.render()}get frameCount(){return this.frames.length}clearSelection(){this.selectedIndex=null,this.updateSelection()}render(){const e=this.querySelector("tbody");if(!e)return;const t=Math.max(0,this.frames.length-xe),s=this.frames.slice(t);e.innerHTML=s.map((a,n)=>{const r=t+n,c=this.messageNameLookup(a.can_id),v=c!=="-";return`
      <tr class="${["clickable",r===this.selectedIndex?"selected":"",v?"matched":""].filter(Boolean).join(" ")}" data-index="${r}">
        <td class="cv-cell-dim">${ne(a.timestamp)}</td>
        <td>${a.channel}</td>
        <td class="cv-cell-id" title="${a.can_id}">${X(a.can_id,a.is_extended)}</td>
        <td class="${v?"cv-cell-name":"cv-cell-nomatch"}">${c}</td>
        <td>${a.dlc}</td>
        <td class="cv-cell-data">${ae(a.data)}</td>
        <td>${ie(a)}</td>
      </tr>
    `}).join(""),this.delegatedHandler||this.setupEventDelegation()}selectFrame(e){this.selectedIndex=e,this.updateSelection();const t=this.frames[e];t&&this.dispatchEvent(new CustomEvent("frame-selected",{detail:{frame:t,index:e},bubbles:!0}))}updateSelection(){const e=this.querySelector("tbody");e&&e.querySelectorAll("tr").forEach(t=>{const s=parseInt(t.dataset.index||"-1",10);t.classList.toggle("selected",s===this.selectedIndex)})}}customElements.define("cv-frames-table",ye);class we extends HTMLElement{signals=[];errors=[];constructor(){super()}setSignals(e,t=[]){this.signals=e,this.errors=t,this.render()}showEmpty(){this.signals=[],this.errors=[];const e=this.querySelector("tbody"),t=this.querySelector(".cv-table-info"),s=this.querySelector(".cv-decode-error");e&&(e.innerHTML='<tr><td colspan="3" class="cv-signals-empty">Select a frame to view decoded signals</td></tr>'),t&&(t.textContent="Select a frame"),s&&(s.textContent="",s.classList.add("hidden"))}render(){const e=this.querySelector("tbody"),t=this.querySelector(".cv-table-info"),s=this.querySelector(".cv-decode-error");e&&(this.signals.length===0&&this.errors.length===0?e.innerHTML='<tr><td colspan="3" class="cv-signals-empty">No signals decoded</td></tr>':e.innerHTML=this.signals.map(a=>`
          <tr>
            <td class="cv-signal-name">${a.signal_name}</td>
            <td class="cv-physical-value">${re(a.value)}</td>
            <td class="cv-unit-highlight">${a.unit||"-"}</td>
          </tr>
        `).join("")),t&&(t.textContent=`${this.signals.length} signals`),s&&(this.errors.length>0?(s.textContent=this.errors.join("; "),s.classList.remove("hidden")):(s.textContent="",s.classList.add("hidden")))}}customElements.define("cv-signals-panel",we);class Se extends HTMLElement{constructor(){super()}connectedCallback(){this.bindEvents()}bindEvents(){this.querySelectorAll(".cv-input").forEach(a=>{a.addEventListener("input",()=>this.emitFilterChange())}),this.querySelectorAll(".cv-select").forEach(a=>{a.addEventListener("change",()=>this.emitFilterChange())}),this.querySelector("#clearFiltersBtn")?.addEventListener("click",()=>this.clearFilters())}getFilters(){const e=this.getInputValue("filterTimeMin"),t=this.getInputValue("filterTimeMax"),s=this.getInputValue("filterCanId"),a=this.getInputValue("filterMessage"),n=this.getInputValue("filterSignal"),r=this.getInputValue("filterDataPattern"),c=this.getInputValue("filterChannel"),v=this.getSelectValue("filterMatchStatus");return{timeMin:e?parseFloat(e):null,timeMax:t?parseFloat(t):null,canIds:fe(s),messages:R(a),signals:R(n),dataPattern:be(r),channel:c||null,matchStatus:v||"all"}}clearFilters(){this.setInputValue("filterTimeMin",""),this.setInputValue("filterTimeMax",""),this.setInputValue("filterCanId",""),this.setInputValue("filterMessage",""),this.setInputValue("filterSignal",""),this.setInputValue("filterDataPattern",""),this.setInputValue("filterChannel",""),this.setSelectValue("filterMatchStatus","all"),this.emitFilterChange()}updateSummary(e,t){const s=this.querySelector("#filterSummary");if(s){const a=this.getFilters(),n=G(a);n===0?s.textContent="No filters active":s.textContent=`${n} filter${n>1?"s":""} · ${e}/${t} frames`}}getInputValue(e){return this.querySelector(`#${e}`)?.value.trim()||""}setInputValue(e,t){const s=this.querySelector(`#${e}`);s&&(s.value=t)}getSelectValue(e){return this.querySelector(`#${e}`)?.value||""}setSelectValue(e,t){const s=this.querySelector(`#${e}`);s&&(s.value=t)}emitFilterChange(){this.dispatchEvent(new CustomEvent("filter-change",{detail:this.getFilters(),bubbles:!0}))}}customElements.define("cv-filters-panel",Se);function Ee(){return{frames:[],filteredFrames:[],signals:[],filters:{timeMin:null,timeMax:null,canIds:null,messages:null,signals:null,dataPattern:null,channel:null,matchStatus:"all"},selectedFrameIndex:null,dbcInfo:null,currentFile:null}}class Ce extends HTMLElement{api=null;state;shadow;framesTable=null;signalsPanel=null;filtersPanel=null;handleDbcChanged=e=>this.onDbcChanged(e);handleCaptureStopped=e=>this.onCaptureStopped(e);unsubscribeAppStore=null;constructor(){super(),this.state=Ee(),this.shadow=this.attachShadow({mode:"open"})}connectedCallback(){this.render(),m.on("dbc:changed",this.handleDbcChanged),m.on("capture:stopped",this.handleCaptureStopped),this.unsubscribeAppStore=x.subscribe(e=>this.onAppStoreChange(e.mdf4File))}disconnectedCallback(){m.off("dbc:changed",this.handleDbcChanged),m.off("capture:stopped",this.handleCaptureStopped),this.unsubscribeAppStore?.()}onAppStoreChange(e){e&&e!==this.state.currentFile?this.loadFile(e):!e&&this.state.currentFile&&this.clearAllData()}onCaptureStopped(e){const t=e.captureFile;t&&this.loadFile(t)}setApi(e){this.api=e,this.refreshDbcInfo()}getFrames(){return this.state.frames}async onDbcChanged(e){if(this.state.dbcInfo=e.dbcInfo,this.renderFrames(),this.state.selectedFrameIndex!==null){const t=this.state.frames[this.state.selectedFrameIndex];t&&await this.decodeFrame(t)}}async refreshDbcInfo(){if(this.api)try{this.state.dbcInfo=await this.api.getDbcInfo(),this.renderFrames()}catch{}}async loadFile(e){if(!this.api)return;const t=this.shadow.querySelector("#loadBtn");try{t&&(t.disabled=!0,t.textContent="Loading...");const[s]=await this.api.loadMdf4(e);this.state.frames=s,this.state.filteredFrames=[...s],this.state.signals=[],this.state.selectedFrameIndex=null,this.state.currentFile=e,x.get().mdf4File!==e&&x.set({mdf4File:e}),this.renderFrames(),this.clearSignalsPanel(),N({loaded:!0,filename:S(e)}),this.showMessage(`Loaded ${s.length} frames`),oe({path:e,frames:s,frameCount:s.length})}catch(s){this.showMessage(String(s),"error")}finally{t&&(t.disabled=!1,t.textContent="Open")}}render(){this.shadow.innerHTML=`
      <style>${E}</style>
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
    `}cacheElements(){this.framesTable=this.shadow.querySelector("cv-frames-table"),this.signalsPanel=this.shadow.querySelector("cv-signals-panel"),this.filtersPanel=this.shadow.querySelector("cv-filters-panel"),this.framesTable?.setMessageNameLookup(e=>this.getMessageName(e))}bindEvents(){this.shadow.querySelector("#loadBtn")?.addEventListener("click",()=>this.promptLoadMdf4()),this.shadow.querySelector("#clearBtn")?.addEventListener("click",()=>this.clearAllData()),this.shadow.querySelectorAll(".cv-tabs .cv-tab").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.tab;t&&this.switchTab(t)})}),this.framesTable?.addEventListener("frame-selected",e=>{const t=e.detail;this.state.selectedFrameIndex=t.index,this.decodeFrame(t.frame),de({frame:t.frame,index:t.index,source:"mdf4-inspector"})}),this.filtersPanel?.addEventListener("filter-change",e=>{const t=e.detail;this.state.filters=t,this.applyFilters(),this.renderFrames(),this.clearSignalsPanel(),this.updateFilterLink()}),this.shadow.querySelector("#filterLink")?.addEventListener("click",()=>{this.switchTab("filters")})}switchTab(e){this.shadow.querySelectorAll(".cv-tabs .cv-tab").forEach(t=>t.classList.toggle("active",t.dataset.tab===e)),this.shadow.querySelectorAll(".cv-panel-body > .cv-tab-pane").forEach(t=>t.classList.toggle("active",t.id===`${e}Section`))}async promptLoadMdf4(){if(this.api)try{const e=await this.api.openFileDialog([{name:"MDF4 Files",extensions:["mf4","mdf","mdf4","MF4","MDF","MDF4"]}]);e&&await this.loadFile(e)}catch(e){this.showMessage(String(e),"error")}}clearAllData(){this.state.frames=[],this.state.filteredFrames=[],this.state.signals=[],this.state.selectedFrameIndex=null,this.state.currentFile=null,x.get().mdf4File!==null&&x.set({mdf4File:null}),this.renderFrames(),this.clearSignalsPanel(),N({loaded:!1,filename:null})}applyFilters(){const e=this.state.filters;let t=this.state.frames;if(e.timeMin!==null&&(t=t.filter(s=>s.timestamp>=e.timeMin)),e.timeMax!==null&&(t=t.filter(s=>s.timestamp<=e.timeMax)),e.canIds?.length&&(t=t.filter(s=>e.canIds.includes(s.can_id))),e.channel){const s=e.channel.toLowerCase();t=t.filter(a=>a.channel.toLowerCase().includes(s))}if(e.dataPattern){const s=e.dataPattern.toUpperCase().split(/\s+/);t=t.filter(a=>{if(s.length>a.data.length)return!1;for(let n=0;n<s.length;n++){const r=s[n];if(r==="??"||r==="XX")continue;const c=parseInt(r,16);if(isNaN(c)||a.data[n]!==c)return!1}return!0})}if(e.messages?.length&&this.state.dbcInfo){const s=e.messages.map(n=>n.toLowerCase()),a=this.state.dbcInfo.messages.filter(n=>s.some(r=>n.name.toLowerCase().includes(r))).map(n=>n.id);t=t.filter(n=>a.includes(n.can_id))}if(e.matchStatus!=="all"&&this.state.dbcInfo){const s=new Set(this.state.dbcInfo.messages.map(a=>a.id));e.matchStatus==="matched"?t=t.filter(a=>s.has(a.can_id)):t=t.filter(a=>!s.has(a.can_id))}this.state.filteredFrames=t}renderFrames(){this.applyFilters(),this.framesTable?.setFrames(this.state.filteredFrames),this.updateFrameCount(),this.updateFilterTabBadge()}async decodeFrame(e){if(!this.api||!this.state.dbcInfo){this.clearSignalsPanel();return}if(!this.state.dbcInfo.messages.some(s=>s.id===e.can_id)){this.state.signals=[],this.signalsPanel?.setSignals([],[]),this.updateSignalsCount();return}try{const s=await this.api.decodeFrames([e]);this.state.signals=s.signals,this.signalsPanel?.setSignals(s.signals,s.errors),this.updateSignalsCount()}catch(s){console.error("Failed to decode frame:",s),this.clearSignalsPanel()}}getMessageName(e){return this.state.dbcInfo&&this.state.dbcInfo.messages.find(s=>s.id===e)?.name||"-"}clearSignalsPanel(){this.signalsPanel?.showEmpty(),this.updateSignalsCount()}updateFrameCount(){const e=this.shadow.querySelector("#framesCount");e&&(e.textContent=String(this.state.filteredFrames.length))}updateSignalsCount(){const e=this.shadow.querySelector("#signalsCount");e&&(e.textContent=String(this.state.signals.length))}updateFilterTabBadge(){const e=this.shadow.querySelector("#filterCount");e&&(e.textContent=String(G(this.state.filters)))}updateFilterLink(){const e=this.shadow.querySelector("#filterLink");if(!e)return;const t=this.state.filters,s=[];(t.timeMin!==null||t.timeMax!==null)&&s.push("time"),t.canIds?.length&&s.push("ID"),t.channel&&s.push("channel"),t.dataPattern&&s.push("data"),t.messages?.length&&s.push("message"),t.signals?.length&&s.push("signal"),t.matchStatus!=="all"&&s.push(t.matchStatus),s.length===0?(e.textContent="",e.classList.remove("active")):(e.textContent=`[${s.join(", ")}]`,e.classList.add("active"))}showMessage(e,t="success"){const s=document.createElement("div");s.className=`cv-message ${t}`,s.textContent=e,this.shadow.appendChild(s),setTimeout(()=>s.remove(),3e3)}}customElements.define("cv-mdf4-inspector",Ce);class Me extends HTMLElement{api=null;state;shadow;latestUpdate=null;unlisteners=[];unsubscribeAppStore=null;handleDbcChanged=e=>this.onDbcChanged(e);constructor(){super(),this.state={isCapturing:!1,currentInterface:null,captureFile:null},this.shadow=this.attachShadow({mode:"open"})}connectedCallback(){this.render(),m.on("dbc:changed",this.handleDbcChanged),this.unsubscribeAppStore=x.subscribe(e=>this.onAppStoreChange(e.mdf4File))}disconnectedCallback(){this.cleanup(),m.off("dbc:changed",this.handleDbcChanged),this.unsubscribeAppStore?.()}setApi(e){this.api=e,this.setupEventListeners(),this.loadInterfaces()}onDbcChanged(e){this.latestUpdate&&this.renderFromUpdate(this.latestUpdate)}onAppStoreChange(e){e!==this.state.captureFile&&(this.state.captureFile=e)}setupEventListeners(){this.api&&this.unlisteners.push(this.api.onLiveCaptureUpdate(e=>this.handleUpdate(e)),this.api.onCaptureFinalized(e=>this.handleFinalized(e)),this.api.onCaptureError(e=>{this.showMessage(e,"error"),this.state.isCapturing=!1,this.updateStoreStatus()}))}cleanup(){this.unlisteners.forEach(e=>e()),this.unlisteners=[]}handleUpdate(e){this.latestUpdate=e,this.renderFromUpdate(e),this.updateStoreStatus()}handleFinalized(e){this.state.captureFile=e,this.showMessage(`MDF4 saved to ${S(e)}`)}render(){this.shadow.innerHTML=`
      <style>${E}</style>
      ${this.generateTemplate()}
    `,this.bindEvents()}generateTemplate(){return`
      <div class="cv-live-viewer">
        <div class="cv-panel">
          <div class="cv-panel-header">
            <div class="cv-tabs">
              <button class="cv-tab active" data-tab="monitor">Message Monitor <span class="cv-tab-badge" id="messageCount">0</span></button>
              <button class="cv-tab" data-tab="signals">Signal Monitor <span class="cv-tab-badge" id="signalCount">0</span></button>
              <button class="cv-tab" data-tab="stream">Frame Stream <span class="cv-tab-badge" id="frameCount">0</span></button>
              <button class="cv-tab" data-tab="errors">Error Monitor <span class="cv-tab-badge cv-tab-badge-error" id="errorCount">0</span></button>
            </div>
          </div>
          <div class="cv-panel-body flush">
            ${this.generateMonitorSection()}
            ${this.generateSignalsSection()}
            ${this.generateStreamSection()}
            ${this.generateErrorsSection()}
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
        <div class="cv-signal-monitor" id="signalsContainer"></div>
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
    `}generateErrorsSection(){return`
      <div class="cv-tab-pane" id="errorsSection">
        <div class="cv-table-wrap">
          <table class="cv-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Channel</th>
                <th>Error Type</th>
                <th>Details</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody id="errorsTableBody"></tbody>
          </table>
        </div>
      </div>
    `}bindEvents(){this.shadow.querySelectorAll(".cv-tabs .cv-tab").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.tab;t&&this.switchTab(t)})})}switchTab(e){this.shadow.querySelectorAll(".cv-tabs .cv-tab").forEach(t=>t.classList.toggle("active",t.dataset.tab===e)),this.shadow.querySelectorAll(".cv-panel-body > .cv-tab-pane").forEach(t=>t.classList.toggle("active",t.id===`${e}Section`))}async loadInterfaces(){if(this.api)try{const e=await this.api.listCanInterfaces();ue({interfaces:e})}catch(e){console.warn("Could not load interfaces:",e)}}async startCapture(e){if(this.api)try{const t=x.get().mdf4File;let s=null,a=!1;if(t){const r=await this.showCaptureChoiceDialog(t);if(r==="cancel")return;r==="append"?(s=t,a=!0):r==="overwrite"&&(s=t,a=!1)}if(!s){const c=`can-capture-${new Date().toISOString().replace(/[:.]/g,"-").slice(0,19)}.mf4`;if(s=await this.api.saveFileDialog([{name:"MDF4 Files",extensions:["mf4"]}],c),!s)return}a||(this.latestUpdate=null,this.renderFromUpdate(null)),this.state.isCapturing=!0,this.state.currentInterface=e,this.state.captureFile=s,this.updateStoreStatus(),await this.api.startCapture(e,s,a);const n=a?"Appending to":"Capturing to";this.showMessage(`${n} ${S(s)}`),ve({interface:e,captureFile:s})}catch(t){this.state.isCapturing=!1,this.updateStoreStatus(),this.showMessage(String(t),"error")}}showCaptureChoiceDialog(e){return new Promise(t=>{const s=S(e),a=document.createElement("div");a.className="cv-modal-overlay",a.innerHTML=`
        <div class="cv-modal">
          <div class="cv-modal-header">MDF4 File Already Selected</div>
          <div class="cv-modal-body">
            <p>An MDF4 file is currently selected:</p>
            <p class="cv-modal-filename">${s}</p>
            <p>What would you like to do?</p>
          </div>
          <div class="cv-modal-actions">
            <button class="cv-btn success" data-action="append">Append</button>
            <button class="cv-btn warning" data-action="overwrite">Overwrite</button>
            <button class="cv-btn primary" data-action="new">New File</button>
            <button class="cv-btn" data-action="cancel">Cancel</button>
          </div>
        </div>
      `;const n=r=>{const v=r.target.dataset.action;v&&(a.remove(),t(v))};a.addEventListener("click",n),this.shadow.appendChild(a)})}async stopCapture(){if(this.api)try{const e=await this.api.stopCapture(),t=this.latestUpdate?.stats.frame_count??0,s=this.state.currentInterface;this.state.isCapturing=!1,this.state.captureFile=e,this.updateStoreStatus(),this.showMessage(`Capture saved to ${S(e)}`),he({interface:s,captureFile:e,frameCount:t})}catch(e){this.state.isCapturing=!1,this.updateStoreStatus(),this.showMessage(String(e),"error")}}clearAllData(){this.latestUpdate=null,this.renderFromUpdate(null),this.updateStoreStatus()}updateStoreStatus(){F.set({isCapturing:this.state.isCapturing,currentInterface:this.state.currentInterface,frameCount:this.latestUpdate?.stats.frame_count??0,messageCount:this.latestUpdate?.stats.message_count??0}),x.set({mdf4File:this.state.captureFile})}getIsCapturing(){return this.state.isCapturing}getFrameCount(){return this.latestUpdate?.stats.frame_count??0}getCaptureFile(){return this.state.captureFile}renderFromUpdate(e){const t=this.shadow.querySelector("#monitorTableBody");t&&(t.innerHTML=e?.messages_html??"");const s=this.shadow.querySelector("#signalsContainer");s&&(s.innerHTML=e?.signals_html??"");const a=this.shadow.querySelector("#streamTableBody");a&&(a.innerHTML=e?.frames_html??"");const n=this.shadow.querySelector("#errorsTableBody");n&&(n.innerHTML=e?.errors_html??"");const r=this.shadow.querySelector("#messageCount");r&&(r.textContent=String(e?.message_count??0));const c=this.shadow.querySelector("#signalCount");c&&(c.textContent=String(e?.signal_count??0));const v=this.shadow.querySelector("#frameCount");v&&(v.textContent=String(e?.frame_count??0));const d=this.shadow.querySelector("#errorCount");d&&(d.textContent=String(e?.error_count??0));const l=this.shadow.querySelector("#statMsgCount"),o=this.shadow.querySelector("#statTotalFrames"),h=this.shadow.querySelector("#statFrameRate"),u=this.shadow.querySelector("#statElapsed");e?.stats_html?(l&&(l.textContent=e.stats_html.message_count),o&&(o.textContent=e.stats_html.frame_count),h&&(h.textContent=e.stats_html.frame_rate),u&&(u.textContent=e.stats_html.elapsed)):(l&&(l.textContent="0"),o&&(o.textContent="0"),h&&(h.textContent="0/s"),u&&(u.textContent="0:00"))}showMessage(e,t="success"){const s=document.createElement("div");s.className=`cv-message ${t}`,s.textContent=e,this.shadow.appendChild(s),setTimeout(()=>s.remove(),3e3)}}customElements.define("cv-live-viewer",Me);function D(){return{name:"",start_bit:0,length:8,byte_order:"little_endian",is_unsigned:!0,factor:1,offset:0,min:0,max:255,unit:null,receivers:{type:"none"},is_multiplexer:!1,multiplexer_value:null}}function T(i=8){return{id:0,is_extended:!1,name:"",dlc:i,sender:"Vector__XXX",signals:[]}}function z(){return{version:null,nodes:[],messages:[]}}function ke(i){return/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(i)}const P=["#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#84cc16","#f97316","#6366f1"];function U(i){return P[i%P.length]}function L(i,e,t){if(t==="little_endian")return{start:i,end:i+e-1};{const s=i-e+1;return{start:Math.max(0,s),end:i}}}function _(i,e,t,s){return s==="little_endian"?{startMin:0,startMax:Math.max(0,i-t),lenMin:1,lenMax:Math.max(1,i-e)}:{startMin:Math.max(0,t-1),startMax:i-1,lenMin:1,lenMax:Math.min(64,e+1)}}function A(i){const e=[];e.push(`VERSION "${i.version||""}"`),e.push(""),e.push("NS_ :"),e.push(""),e.push("BS_:"),e.push(""),i.nodes.length>0?e.push(`BU_: ${i.nodes.join(" ")}`):e.push("BU_:"),e.push("");for(const t of i.messages){const s=t.is_extended?t.id|2147483648:t.id;e.push(`BO_ ${s} ${t.name}: ${t.dlc} ${t.sender}`);for(const a of t.signals){const n=a.byte_order==="little_endian"?1:0,r=a.is_unsigned?"+":"-";let c="";a.is_multiplexer?c=" M":a.multiplexer_value!==null&&(c=` m${a.multiplexer_value}`);let v="Vector__XXX";a.receivers.type==="nodes"&&a.receivers.nodes.length>0&&(v=a.receivers.nodes.join(","));const d=a.unit||"";e.push(` SG_ ${a.name}${c} : ${a.start_bit}|${a.length}@${n}${r} (${a.factor},${a.offset}) [${a.min}|${a.max}] "${d}" ${v}`)}e.push("")}return e.push(""),e.join(`
`)}class _e extends HTMLElement{signals=[];selectedName=null;constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render()}setSignals(e){this.signals=e,this.render()}setSelected(e){this.selectedName=e,this.render()}render(){if(!this.shadowRoot)return;const e=this.signals.map(t=>{const s=this.selectedName===t.name,a=t.byte_order==="little_endian"?"LE":"BE",n=t.is_unsigned?"U":"S",r=t.unit||"-",c=t.is_multiplexer?"M":t.multiplexer_value!==null?`m${t.multiplexer_value}`:"-";return`
        <tr class="${s?"selected":""}" data-name="${t.name}">
          <td>${t.name}</td>
          <td style="font-family: var(--cv-font-mono)">${t.start_bit}</td>
          <td style="font-family: var(--cv-font-mono)">${t.length}</td>
          <td>${a}</td>
          <td>${n}</td>
          <td style="font-family: var(--cv-font-mono)">${t.factor}</td>
          <td style="font-family: var(--cv-font-mono)">${t.offset}</td>
          <td style="font-family: var(--cv-font-mono)">${t.min}</td>
          <td style="font-family: var(--cv-font-mono)">${t.max}</td>
          <td>${r}</td>
          <td>${c}</td>
        </tr>
      `}).join("");this.shadowRoot.innerHTML=`
      <style>${E}
        :host { display: block; }
      </style>

      ${this.signals.length===0?`
        <div class="cv-empty-message">No signals defined. Click "Add Signal" to create one.</div>
      `:`
        <table class="cv-table">
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
    `,this.shadowRoot.querySelectorAll("tbody tr").forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.name;s&&this.dispatchEvent(g("signal-select",{name:s}))})})}}customElements.define("cv-signals-table",_e);class Le extends HTMLElement{signal=D();originalSignal=D();availableNodes=[];isEditing=!1;parentEditMode=!1;errorMessage=null;static get observedAttributes(){return["data-edit-mode"]}constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.parentEditMode=this.dataset.editMode==="true",this.render()}attributeChangedCallback(e,t,s){e==="data-edit-mode"&&t!==s&&(this.parentEditMode=s==="true",this.render())}setSignal(e,t){this.signal=e?y(e):D(),this.originalSignal=y(this.signal),this.isEditing=t,this.render()}setAvailableNodes(e){this.availableNodes=e,this.render()}getSignal(){return this.signal}isInEditMode(){return this.isEditing}updateSignalValues(e){if(this.signal={...this.signal,...e},this.shadowRoot&&this.isEditing){if(e.start_bit!==void 0){const t=this.shadowRoot.getElementById("start_bit");t&&(t.value=String(e.start_bit))}if(e.length!==void 0){const t=this.shadowRoot.getElementById("length");t&&(t.value=String(e.length))}}}setError(e){if(this.errorMessage=e,this.shadowRoot&&this.isEditing){const t=this.shadowRoot.querySelector(".cv-error-msg"),s=this.shadowRoot.getElementById("done-btn");t&&(t.textContent=e||"",t.style.display=e?"block":"none"),s&&(s.disabled=!!e,s.style.opacity=e?"0.5":"1",s.style.cursor=e?"not-allowed":"pointer")}}restoreOriginal(){this.signal=y(this.originalSignal),this.errorMessage=null,this.render(),this.dispatchEvent(g("signal-change",this.signal))}render(){this.shadowRoot&&(this.isEditing?this.renderEditMode():this.renderViewMode())}renderViewMode(){if(!this.shadowRoot)return;const e=this.signal.byte_order==="little_endian"?"Little Endian":"Big Endian",t=this.signal.is_unsigned?"Unsigned":"Signed",s=this.signal.unit||"-",a=this.signal.is_multiplexer?"Multiplexer (M)":this.signal.multiplexer_value!==null?`Multiplexed (m${this.signal.multiplexer_value})`:"-",r=this.signal.receivers.type==="nodes"?this.signal.receivers.nodes.join(", "):"None";this.shadowRoot.innerHTML=`
      <style>${E}
        :host { display: block; }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
          padding-bottom: 6px;
          border-bottom: 1px solid var(--cv-border);
        }
        .signal-name { font-weight: 600; font-size: 15px; color: #fff; }
        .view-container { display: flex; flex-direction: column; gap: 4px; }
        .actions { display: flex; gap: 4px; }
      </style>

      <div class="header">
        <span class="signal-name">${this.signal.name||"(unnamed)"}</span>
        ${this.parentEditMode?`
          <div class="actions">
            <button class="cv-btn primary small" id="edit-btn">Edit</button>
            <button class="cv-btn danger small" id="delete-btn">Delete</button>
          </div>
        `:""}
      </div>

      <div class="view-container">
        <div class="cv-field"><span class="cv-field-label">Start Bit</span><span class="cv-field-value">${this.signal.start_bit}</span></div>
        <div class="cv-field"><span class="cv-field-label">Length</span><span class="cv-field-value">${this.signal.length} bits</span></div>
        <div class="cv-field"><span class="cv-field-label">Byte Order</span><span class="cv-field-value text">${e}</span></div>
        <div class="cv-field"><span class="cv-field-label">Value Type</span><span class="cv-field-value text">${t}</span></div>
        <div class="cv-field"><span class="cv-field-label">Factor</span><span class="cv-field-value">${this.signal.factor}</span></div>
        <div class="cv-field"><span class="cv-field-label">Offset</span><span class="cv-field-value">${this.signal.offset}</span></div>
        <div class="cv-field"><span class="cv-field-label">Min</span><span class="cv-field-value">${this.signal.min}</span></div>
        <div class="cv-field"><span class="cv-field-label">Max</span><span class="cv-field-value">${this.signal.max}</span></div>
        <div class="cv-field"><span class="cv-field-label">Unit</span><span class="cv-field-value text">${s}</span></div>
        <div class="cv-field"><span class="cv-field-label">Multiplexing</span><span class="cv-field-value text">${a}</span></div>
        <div class="cv-field"><span class="cv-field-label">Receivers</span><span class="cv-field-value text">${r}</span></div>
      </div>
    `,this.shadowRoot.getElementById("edit-btn")?.addEventListener("click",()=>{this.originalSignal=y(this.signal),this.isEditing=!0,this.render(),this.dispatchEvent(g("edit-start",{}))}),this.shadowRoot.getElementById("delete-btn")?.addEventListener("click",()=>{this.dispatchEvent(g("signal-delete-request",{name:this.signal.name}))})}renderEditMode(){if(!this.shadowRoot)return;const e=this.signal.receivers.type,t=e==="nodes"?this.signal.receivers.nodes:[];this.shadowRoot.innerHTML=`
      <style>${E}
        :host { display: block; }
        .btn-row { display: flex; gap: 4px; margin-top: 8px; padding-bottom: 4px; }
      </style>

      <div class="cv-form-group-sm">
        <label class="cv-label">Name</label>
        <input type="text" class="cv-input" id="name" value="${this.signal.name}" placeholder="Signal Name">
      </div>

      <div class="cv-form-row-4">
        <div class="cv-form-group cv-form-group-sm">
          <label class="cv-label">Start</label>
          <input type="number" class="cv-input" id="start_bit" value="${this.signal.start_bit}" min="0" max="511">
        </div>
        <div class="cv-form-group cv-form-group-sm">
          <label class="cv-label">Len</label>
          <input type="number" class="cv-input" id="length" value="${this.signal.length}" min="1" max="64">
        </div>
        <div class="cv-form-group cv-form-group-sm">
          <label class="cv-label">Order</label>
          <select class="cv-select" id="byte_order">
            <option value="little_endian" ${this.signal.byte_order==="little_endian"?"selected":""}>LE</option>
            <option value="big_endian" ${this.signal.byte_order==="big_endian"?"selected":""}>BE</option>
          </select>
        </div>
        <div class="cv-form-group cv-form-group-sm">
          <label class="cv-label">Type</label>
          <select class="cv-select" id="is_unsigned">
            <option value="true" ${this.signal.is_unsigned?"selected":""}>U</option>
            <option value="false" ${this.signal.is_unsigned?"":"selected"}>S</option>
          </select>
        </div>
      </div>

      <div class="cv-form-row-4">
        <div class="cv-form-group cv-form-group-sm">
          <label class="cv-label">Factor</label>
          <input type="number" class="cv-input" id="factor" value="${this.signal.factor}" step="any">
        </div>
        <div class="cv-form-group cv-form-group-sm">
          <label class="cv-label">Offset</label>
          <input type="number" class="cv-input" id="offset" value="${this.signal.offset}" step="any">
        </div>
        <div class="cv-form-group cv-form-group-sm">
          <label class="cv-label">Min</label>
          <input type="number" class="cv-input" id="min" value="${this.signal.min}" step="any">
        </div>
        <div class="cv-form-group cv-form-group-sm">
          <label class="cv-label">Max</label>
          <input type="number" class="cv-input" id="max" value="${this.signal.max}" step="any">
        </div>
      </div>

      <div class="cv-form-row">
        <div class="cv-form-group cv-form-group-sm">
          <label class="cv-label">Unit</label>
          <input type="text" class="cv-input" id="unit" value="${this.signal.unit||""}" placeholder="">
        </div>
        <div class="cv-form-group cv-form-group-sm">
          <label class="cv-label">Receivers</label>
          <select class="cv-select" id="receivers_type">
            <option value="none" ${e==="none"?"selected":""}>None</option>
            <option value="nodes" ${e==="nodes"?"selected":""}>Nodes</option>
          </select>
        </div>
      </div>

      <div class="cv-form-group-sm receivers-nodes" style="display: ${e==="nodes"?"block":"none"}">
        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
          ${this.availableNodes.map(s=>`
            <label class="cv-checkbox-group" style="font-size: 11px;">
              <input type="checkbox" class="cv-checkbox receiver-node" value="${s}" ${t.includes(s)?"checked":""} style="width: 14px; height: 14px;">
              <span>${s}</span>
            </label>
          `).join("")}
        </div>
      </div>

      <div class="cv-form-row">
        <div class="cv-form-group cv-form-group-sm">
          <label class="cv-checkbox-group" style="font-size: 12px;">
            <input type="checkbox" class="cv-checkbox" id="is_multiplexer" ${this.signal.is_multiplexer?"checked":""} style="width: 14px; height: 14px;">
            <span>Mux Switch</span>
          </label>
        </div>
        <div class="cv-form-group cv-form-group-sm">
          <label class="cv-label">Mux Val</label>
          <input type="number" class="cv-input" id="multiplexer_value" value="${this.signal.multiplexer_value??""}" placeholder="-" min="0">
        </div>
      </div>

      <div class="cv-error-msg" style="display: ${this.errorMessage?"block":"none"}">${this.errorMessage||""}</div>

      <div class="btn-row">
        <button class="cv-btn success small" id="done-btn" ${this.errorMessage?'disabled style="opacity:0.5;cursor:not-allowed"':""}>Done</button>
        <button class="cv-btn warning small" id="restore-btn">Restore</button>
        <button class="cv-btn small" id="cancel-btn">Cancel</button>
      </div>
    `,this.setupEditListeners()}setupEditListeners(){if(!this.shadowRoot)return;["name","start_bit","length","factor","offset","min","max","unit","multiplexer_value"].forEach(a=>{this.shadowRoot.getElementById(a)?.addEventListener("input",()=>this.updateSignalFromInputs())}),["byte_order","is_unsigned","receivers_type"].forEach(a=>{const n=this.shadowRoot.getElementById(a);n?.addEventListener("change",()=>{if(this.updateSignalFromInputs(),a==="receivers_type"){const r=this.shadowRoot.querySelector(".receivers-nodes");r&&(r.style.display=n.value==="nodes"?"block":"none")}})}),this.shadowRoot.getElementById("is_multiplexer")?.addEventListener("change",()=>this.updateSignalFromInputs()),this.shadowRoot.querySelectorAll(".receiver-node").forEach(a=>{a.addEventListener("change",()=>this.updateSignalFromInputs())}),this.shadowRoot.getElementById("done-btn")?.addEventListener("click",()=>{this.errorMessage||(this.updateSignalFromInputs(),this.isEditing=!1,this.errorMessage=null,this.render(),this.dispatchEvent(g("edit-done",this.signal)))}),this.shadowRoot.getElementById("restore-btn")?.addEventListener("click",()=>{this.restoreOriginal()}),this.shadowRoot.getElementById("cancel-btn")?.addEventListener("click",()=>{this.signal=y(this.originalSignal),this.isEditing=!1,this.errorMessage=null,this.render(),this.dispatchEvent(g("edit-cancel",{}))})}updateSignalFromInputs(){if(!this.shadowRoot)return;const e=c=>this.shadowRoot.getElementById(c)?.value||"",t=c=>this.shadowRoot.getElementById(c)?.checked||!1,s=e("multiplexer_value"),a=s!==""?parseInt(s,10):null,n=e("receivers_type");let r;if(n==="nodes"){const c=[];this.shadowRoot.querySelectorAll(".receiver-node:checked").forEach(v=>{c.push(v.value)}),r={type:"nodes",nodes:c}}else r={type:"none"};this.signal={name:e("name"),start_bit:parseInt(e("start_bit"),10)||0,length:parseInt(e("length"),10)||1,byte_order:e("byte_order"),is_unsigned:e("is_unsigned")==="true",factor:parseFloat(e("factor"))||1,offset:parseFloat(e("offset"))||0,min:parseFloat(e("min"))||0,max:parseFloat(e("max"))||0,unit:e("unit")||null,receivers:r,is_multiplexer:t("is_multiplexer"),multiplexer_value:a},this.dispatchEvent(g("signal-change",this.signal))}}customElements.define("cv-signal-editor",Le);class $e extends HTMLElement{messages=[];selectedId=null;selectedIsExtended=!1;delegatedHandler=null;constructor(){super()}connectedCallback(){this.setupEventDelegation()}disconnectedCallback(){this.removeEventDelegation()}setupEventDelegation(){const e=this.querySelector(".cv-table-wrap");!e||this.delegatedHandler||(this.delegatedHandler=t=>{const a=t.target.closest("tr.clickable");if(a?.dataset.id){const n=parseInt(a.dataset.id,10),r=a.dataset.extended==="true";this.dispatchEvent(new CustomEvent("message-select",{detail:{id:n,isExtended:r},bubbles:!0}))}},e.addEventListener("click",this.delegatedHandler))}removeEventDelegation(){if(!this.delegatedHandler)return;const e=this.querySelector(".cv-table-wrap");e&&e.removeEventListener("click",this.delegatedHandler),this.delegatedHandler=null}setMessages(e){this.messages=e,this.render()}setSelected(e,t){this.selectedId=e,this.selectedIsExtended=t,this.updateSelection()}render(){let e=this.querySelector(".cv-table-wrap");e||(e=document.createElement("div"),e.className="cv-table-wrap",this.appendChild(e));const t=this.messages.map(s=>{const a=this.selectedId===s.id&&this.selectedIsExtended===s.is_extended,n=X(s.id,s.is_extended);return`
        <tr class="clickable ${a?"selected":""}"
            data-id="${s.id}"
            data-extended="${s.is_extended}">
          <td class="cv-cell-id">${n}</td>
          <td class="cv-cell-name">${s.name||"(unnamed)"}</td>
          <td class="cv-cell-dim">${s.dlc}</td>
          <td class="cv-cell-dim">${s.signals.length}</td>
          <td class="cv-cell-dim">${s.sender}</td>
        </tr>
      `}).join("");e.innerHTML=`
      <table class="cv-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>DLC</th>
            <th>Signals</th>
            <th>Sender</th>
          </tr>
        </thead>
        <tbody>${t}</tbody>
      </table>
    `,this.removeEventDelegation(),this.setupEventDelegation()}updateSelection(){const e=this.querySelector("tbody");e&&e.querySelectorAll("tr").forEach(t=>{const s=parseInt(t.dataset.id||"-1",10),a=t.dataset.extended==="true",n=s===this.selectedId&&a===this.selectedIsExtended;t.classList.toggle("selected",n)})}}customElements.define("cv-messages-list",$e);class Ie extends HTMLElement{message=T();originalMessage=T();availableNodes=[];frames=[];selectedSignal=null;editingSignal=null;isAddingSignal=!1;isEditingSignal=!1;isEditingMessage=!1;isNewMessage=!1;parentEditMode=!1;static get observedAttributes(){return["data-edit-mode"]}constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.parentEditMode=this.dataset.editMode==="true",this.render()}attributeChangedCallback(e,t,s){e==="data-edit-mode"&&t!==s&&(this.parentEditMode=s==="true",this.render())}setMessage(e,t){this.message=e?y(e):T(),this.originalMessage=y(this.message),this.selectedSignal=null,this.editingSignal=null,this.isAddingSignal=!1,this.isNewMessage=t,this.isEditingMessage=t,this.render()}setAvailableNodes(e){this.availableNodes=e,this.render()}setFrames(e){this.frames=e}getMessage(){return this.message}isInEditMode(){return this.isEditingMessage}renderMessageViewMode(e){const t=this.message.id;return`
      <div class="cv-section">
        <div class="cv-msg-header">
          <div class="cv-msg-header-info">
            <span class="cv-msg-title">${this.message.name||"(unnamed)"}</span>
            <span class="cv-msg-id">${e} (${t})</span>
            <span class="cv-msg-meta">DLC: ${this.message.dlc}</span>
            ${this.message.sender?`<span class="cv-msg-meta">TX: ${this.message.sender}</span>`:""}
            ${this.message.is_extended?'<span class="cv-msg-meta">Extended</span>':""}
          </div>
          ${this.parentEditMode?`
            <div class="cv-msg-actions">
              <button class="cv-btn primary small" id="edit-msg-btn">Edit</button>
              <button class="cv-btn danger small" id="delete-msg-btn">Delete</button>
            </div>
          `:""}
        </div>
      </div>
    `}renderMessageEditMode(e){return`
      <div class="cv-section">
        <div class="cv-msg-header">
          <div class="cv-form-group" style="flex: 1; margin-bottom: 0; margin-right: 16px;">
            <label class="cv-label">Name</label>
            <input type="text" class="cv-input" id="msg_name" value="${this.message.name}" placeholder="Message Name">
          </div>
          <div class="cv-msg-actions" style="align-self: flex-end;">
            <button class="cv-btn success small" id="done-msg-btn">Done</button>
            <button class="cv-btn small" id="cancel-msg-btn">Cancel</button>
          </div>
        </div>

        <div class="cv-form-row">
          <div class="cv-form-group">
            <label class="cv-label">Message ID <span class="cv-id-display">(${e})</span></label>
            <input type="number" class="cv-input" id="msg_id" value="${this.message.id}" min="0" max="536870911">
          </div>
          <div class="cv-form-group">
            <label class="cv-label">DLC</label>
            <select class="cv-select" id="msg_dlc">
              ${[0,1,2,3,4,5,6,7,8,12,16,20,24,32,48,64].map(t=>`<option value="${t}" ${this.message.dlc===t?"selected":""}>${t}</option>`).join("")}
            </select>
          </div>
        </div>

        <div class="cv-form-row">
          <div class="cv-form-group">
            <label class="cv-label">Sender</label>
            <select class="cv-select" id="msg_sender">
              <option value="Vector__XXX" ${this.message.sender==="Vector__XXX"?"selected":""}>Vector__XXX</option>
              ${this.availableNodes.map(t=>`<option value="${t}" ${this.message.sender===t?"selected":""}>${t}</option>`).join("")}
            </select>
          </div>
          <div class="cv-form-group">
            <div class="cv-checkbox-group" style="margin-top: 20px;">
              <input type="checkbox" class="cv-checkbox" id="msg_extended" ${this.message.is_extended?"checked":""}>
              <span>Extended ID (29-bit)</span>
            </div>
          </div>
        </div>
      </div>
    `}getActiveSignals(){const t=this.editingSignal?.multiplexer_value;return this.message.signals.filter(s=>!!(s.is_multiplexer||s.multiplexer_value===null||t!==null&&s.multiplexer_value===t))}renderBitLayout(){const e=this.message.dlc*8;if(e===0)return"";const t=this.editingSignal,s=t?.start_bit??0,a=t?.length??1,n=this.getActiveSignals(),r=l=>L(l.start_bit,l.length,l.byte_order),c=l=>{const o=r(l);for(const h of n){if(h.name===l.name)continue;const u=r(h);if(o.start<=u.end&&u.start<=o.end)return!0}return!1},v=n.map((l,o)=>{const h=t&&l.name===t.name,u=c(l),p=r(l),b=p.start/e*100,f=l.length/e*100,w=u?"#ef4444":h?"#3b82f6":U(o),C=h?1:.5,k=["cv-bit-segment",h?"current":"",u?"overlap":""].filter(Boolean).join(" "),M=l.byte_order==="big_endian"?"BE":"LE";return`<div class="${k}"
                   style="left: ${b}%; width: ${f}%; background: ${w}; opacity: ${C};"
                   title="${l.name} (${M}): bits ${p.start}-${p.end}${u?" (OVERLAP!)":""}">
                ${f>8?l.name:""}
              </div>`}).join(""),d=[];for(let l=0;l<=Math.min(8,this.message.dlc);l++)d.push(`<span>${l*8}</span>`);return this.message.dlc>8&&d.push(`<span>${e}</span>`),`
      <div class="cv-bit-layout">
        <div class="cv-bit-layout-header">
          <span>Bit Layout (${e} bits)</span>
          <span>${t?.name||""}: ${s} - ${s+a-1}</span>
        </div>
        <div class="cv-bit-bar">
          ${v}
        </div>
        <div class="cv-bit-markers">
          ${d.join("")}
        </div>
        ${this.isAddingSignal||this.isEditingSignal?(()=>{const l=t?.byte_order??"little_endian",o=_(e,s,a,l);return`
          <div class="cv-bit-sliders">
            <div class="cv-bit-slider-group">
              <div class="cv-bit-slider-label">
                <span>Start Bit</span>
                <span class="cv-bit-slider-value" id="start-bit-value">${s}</span>
              </div>
              <input type="range" class="cv-bit-slider" id="start-bit-slider"
                     min="${o.startMin}" max="${o.startMax}" value="${s}">
            </div>
            <div class="cv-bit-slider-group">
              <div class="cv-bit-slider-label">
                <span>Length</span>
                <span class="cv-bit-slider-value" id="length-value">${a}</span>
              </div>
              <input type="range" class="cv-bit-slider" id="length-slider"
                     min="${o.lenMin}" max="${o.lenMax}" value="${a}">
            </div>
          </div>
        `})():""}
      </div>
    `}updateBitBar(){if(!this.shadowRoot||!this.editingSignal)return;const e=this.message.dlc*8;if(e===0)return;const t=this.editingSignal.start_bit,s=this.editingSignal.length,a=this.shadowRoot.querySelector(".cv-bit-layout-header span:last-child");a&&(a.textContent=`${this.editingSignal.name||""}: ${t} - ${t+s-1}`);const n=this.shadowRoot.querySelector(".cv-bit-bar");if(n){const r=this.getActiveSignals(),c=this.editingSignal.byte_order,v=(o,h,u)=>L(o,h,u),d=(o,h,u,p)=>{const b=v(o,h,u);for(const f of r){if(f.name===p)continue;const w=f.name===this.editingSignal.name,C=w?t:f.start_bit,k=w?s:f.length,M=w?c:f.byte_order,I=v(C,k,M);if(b.start<=I.end&&I.start<=b.end)return!0}return!1},l=r.map((o,h)=>{const u=o.name===this.editingSignal.name,p=u?t:o.start_bit,b=u?s:o.length,f=u?c:o.byte_order,w=v(p,b,f),C=w.start/e*100,k=b/e*100,M=d(p,b,f,o.name),I=M?"#ef4444":u?"#3b82f6":U(h),J=u?1:.5,K=f==="big_endian"?"BE":"LE";return`<div class="${["cv-bit-segment",u?"current":"",M?"overlap":""].filter(Boolean).join(" ")}"
                     style="left: ${C}%; width: ${k}%; background: ${I}; opacity: ${J};"
                     title="${o.name} (${K}): bits ${w.start}-${w.end}${M?" (OVERLAP!)":""}">
                  ${k>8?o.name:""}
                </div>`}).join("");if(this.isAddingSignal&&this.editingSignal){const o=v(t,s,c),h=o.start/e*100,u=s/e*100,p=d(t,s,c,""),b=p?"#ef4444":"#3b82f6",f=c==="big_endian"?"BE":"LE",C=`<div class="${["cv-bit-segment","current",p?"overlap":""].filter(Boolean).join(" ")}"
                              style="left: ${h}%; width: ${u}%; background: ${b}; opacity: 1;"
                              title="New (${f}): bits ${o.start}-${o.end}${p?" (OVERLAP!)":""}">
                           ${u>8?this.editingSignal.name||"New":""}
                         </div>`;n.innerHTML=l+C}else n.innerHTML=l}}setupSliderListeners(){if(!this.shadowRoot)return;const e=this.shadowRoot.getElementById("start-bit-slider"),t=this.shadowRoot.getElementById("length-slider"),s=this.message.dlc*8,a=()=>{if(!this.editingSignal||!e||!t)return;const n=_(s,this.editingSignal.start_bit,this.editingSignal.length,this.editingSignal.byte_order);e.min=String(n.startMin),e.max=String(n.startMax),t.min=String(n.lenMin),t.max=String(n.lenMax)};e?.addEventListener("input",()=>{const n=parseInt(e.value,10);if(this.editingSignal){this.editingSignal.start_bit=n,this.shadowRoot.getElementById("start-bit-value").textContent=String(n),a();const r=_(s,n,this.editingSignal.length,this.editingSignal.byte_order);this.editingSignal.length>r.lenMax&&(this.editingSignal.length=r.lenMax,t.value=String(r.lenMax),this.shadowRoot.getElementById("length-value").textContent=String(r.lenMax));const c=this.shadowRoot.querySelector("cv-signal-editor");c?.updateSignalValues({start_bit:this.editingSignal.start_bit,length:this.editingSignal.length}),this.updateBitBar(),this.validateSignalAndSetError(c)}}),t?.addEventListener("input",()=>{const n=parseInt(t.value,10);if(this.editingSignal){this.editingSignal.length=n,this.shadowRoot.getElementById("length-value").textContent=String(n),a();const r=_(s,this.editingSignal.start_bit,n,this.editingSignal.byte_order);this.editingSignal.start_bit<r.startMin?(this.editingSignal.start_bit=r.startMin,e.value=String(r.startMin),this.shadowRoot.getElementById("start-bit-value").textContent=String(r.startMin)):this.editingSignal.start_bit>r.startMax&&(this.editingSignal.start_bit=r.startMax,e.value=String(r.startMax),this.shadowRoot.getElementById("start-bit-value").textContent=String(r.startMax));const c=this.shadowRoot.querySelector("cv-signal-editor");c?.updateSignalValues({start_bit:this.editingSignal.start_bit,length:this.editingSignal.length}),this.updateBitBar(),this.validateSignalAndSetError(c)}})}render(){if(!this.shadowRoot)return;const e=`0x${this.message.id.toString(16).toUpperCase()}`;this.shadowRoot.innerHTML=`
      <style>${E}
        :host {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow-y: auto;
          padding: 16px;
        }
      </style>

      ${this.isEditingMessage?this.renderMessageEditMode(e):this.renderMessageViewMode(e)}

      <div class="cv-section cv-signals-section">
        <div class="cv-section-header">
          <span class="cv-section-title">Signals (${this.message.signals.length})</span>
          ${this.parentEditMode?`
            <button class="cv-btn primary small" id="add-signal-btn">+ Add Signal</button>
          `:""}
        </div>

        ${this.renderBitLayout()}

        <div class="cv-signals-layout">
          <div class="cv-signals-table-container">
            <cv-signals-table></cv-signals-table>
          </div>
          ${this.isAddingSignal||this.selectedSignal?`
            <div class="cv-signal-editor-panel">
              <cv-signal-editor data-edit-mode="${this.parentEditMode}"></cv-signal-editor>
            </div>
          `:""}
        </div>
      </div>
    `,this.setupEventListeners(),this.updateChildComponents()}setupEventListeners(){if(!this.shadowRoot)return;this.shadowRoot.getElementById("edit-msg-btn")?.addEventListener("click",()=>{this.isEditingMessage=!0,this.render()}),this.shadowRoot.getElementById("delete-msg-btn")?.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("message-delete-request",{bubbles:!0,composed:!0}))}),this.shadowRoot.getElementById("done-msg-btn")?.addEventListener("click",()=>{if(!this.message.name){alert("Message name is required");return}this.isEditingMessage=!1,this.originalMessage=y(this.message),this.notifyChange(),this.dispatchEvent(new CustomEvent("message-edit-done",{detail:this.message,bubbles:!0,composed:!0})),this.render()}),this.shadowRoot.getElementById("cancel-msg-btn")?.addEventListener("click",()=>{this.isNewMessage?this.dispatchEvent(new CustomEvent("message-edit-cancel",{bubbles:!0,composed:!0})):(this.message=y(this.originalMessage),this.isEditingMessage=!1,this.render())});const e=this.shadowRoot.getElementById("msg_name"),t=this.shadowRoot.getElementById("msg_id"),s=this.shadowRoot.getElementById("msg_dlc"),a=this.shadowRoot.getElementById("msg_sender"),n=this.shadowRoot.getElementById("msg_extended");e?.addEventListener("input",()=>{this.message.name=e.value}),t?.addEventListener("input",()=>{this.message.id=parseInt(t.value,10)||0;const d=`0x${this.message.id.toString(16).toUpperCase()}`,l=this.shadowRoot.querySelector(".cv-id-display");if(l&&(l.textContent=`(${d})`),this.isNewMessage&&this.frames.length>0){const o=q(this.frames,this.message.id,this.message.is_extended);o!==null&&o!==this.message.dlc&&(this.message.dlc=o,s&&(s.value=String(o)))}}),s?.addEventListener("change",()=>{this.message.dlc=parseInt(s.value,10)}),a?.addEventListener("change",()=>{this.message.sender=a.value}),n?.addEventListener("change",()=>{if(this.message.is_extended=n.checked,this.isNewMessage&&this.frames.length>0){const d=q(this.frames,this.message.id,this.message.is_extended);d!==null&&d!==this.message.dlc&&(this.message.dlc=d,s&&(s.value=String(d)))}}),this.setupSliderListeners(),this.shadowRoot.getElementById("add-signal-btn")?.addEventListener("click",()=>{this.isAddingSignal=!0,this.selectedSignal=null,this.editingSignal=D(),this.render()}),this.shadowRoot.querySelector("cv-signals-table")?.addEventListener("signal-select",(d=>{const l=d.detail.name;this.selectedSignal===l?(this.selectedSignal=null,this.editingSignal=null,this.isEditingSignal=!1):(this.selectedSignal=l,this.editingSignal=this.message.signals.find(o=>o.name===l)||null,this.isEditingSignal=!1),this.isAddingSignal=!1,this.render()}));const v=this.shadowRoot.querySelector("cv-signal-editor");v?.addEventListener("edit-start",(()=>{this.isEditingSignal=!0;const d=this.shadowRoot.querySelector(".cv-bit-layout");if(d&&!d.querySelector(".cv-bit-sliders")){const l=this.message.dlc*8,o=this.editingSignal?.start_bit??0,h=this.editingSignal?.length??1,u=this.editingSignal?.byte_order??"little_endian",p=_(l,o,h,u),b=`
          <div class="cv-bit-sliders">
            <div class="cv-bit-slider-group">
              <div class="cv-bit-slider-label">
                <span>Start Bit</span>
                <span class="cv-bit-slider-value" id="start-bit-value">${o}</span>
              </div>
              <input type="range" class="cv-bit-slider" id="start-bit-slider"
                     min="${p.startMin}" max="${p.startMax}" value="${o}">
            </div>
            <div class="cv-bit-slider-group">
              <div class="cv-bit-slider-label">
                <span>Length</span>
                <span class="cv-bit-slider-value" id="length-value">${h}</span>
              </div>
              <input type="range" class="cv-bit-slider" id="length-slider"
                     min="${p.lenMin}" max="${p.lenMax}" value="${h}">
            </div>
          </div>
        `;d.insertAdjacentHTML("beforeend",b),this.setupSliderListeners()}})),v?.addEventListener("signal-change",(d=>{const l=d.detail;if(this.editingSignal){this.editingSignal={...this.editingSignal,...l};const o=this.shadowRoot.getElementById("start-bit-slider"),h=this.shadowRoot.getElementById("length-slider"),u=this.message.dlc*8;if(o&&h){const p=_(u,l.start_bit,l.length,l.byte_order);o.min=String(p.startMin),o.max=String(p.startMax),h.min=String(p.lenMin),h.max=String(p.lenMax),o.value=String(l.start_bit),h.value=String(l.length);const b=this.shadowRoot.getElementById("start-bit-value"),f=this.shadowRoot.getElementById("length-value");b&&(b.textContent=String(l.start_bit)),f&&(f.textContent=String(l.length))}this.updateBitBar(),this.validateSignalAndSetError(v)}})),v?.addEventListener("edit-done",(d=>{const l=d.detail;if(!l.name){alert("Signal name is required");return}const o=this.message.dlc*8;if(l.start_bit+l.length>o){alert(`Signal extends beyond message size (${o} bits). Reduce start bit or length.`);return}const h=this.isAddingSignal?null:this.selectedSignal,u=this.findOverlappingSignal(l,h);if(u){alert(`Signal "${l.name}" overlaps with "${u.name}" (bits ${u.start_bit}-${u.start_bit+u.length-1})`);return}if(this.isAddingSignal){if(this.message.signals.some(p=>p.name===l.name)){alert(`Signal "${l.name}" already exists`);return}this.message.signals.push(l),this.selectedSignal=l.name}else if(this.selectedSignal){const p=this.message.signals.findIndex(b=>b.name===this.selectedSignal);if(p>=0){if(l.name!==this.selectedSignal&&this.message.signals.some(b=>b.name===l.name)){alert(`Signal "${l.name}" already exists`);return}this.message.signals[p]=l,this.selectedSignal=l.name}}this.isAddingSignal=!1,this.isEditingSignal=!1,this.editingSignal=l,this.notifyChange(),this.render()})),v?.addEventListener("edit-cancel",(()=>{if(this.isEditingSignal=!1,this.isAddingSignal)this.isAddingSignal=!1,this.selectedSignal=null,this.editingSignal=null;else if(this.selectedSignal){const d=this.message.signals.find(l=>l.name===this.selectedSignal);this.editingSignal=d?y(d):null}this.render()})),v?.addEventListener("signal-delete-request",(d=>{const l=d.detail.name;this.message.signals=this.message.signals.filter(o=>o.name!==l),this.selectedSignal=null,this.editingSignal=null,this.notifyChange(),this.render()}))}updateChildComponents(){if(!this.shadowRoot)return;const e=this.shadowRoot.querySelector("cv-signals-table");e&&(e.setSignals(this.message.signals),e.setSelected(this.selectedSignal));const t=this.shadowRoot.querySelector("cv-signal-editor");t&&this.editingSignal&&(t.setSignal(this.editingSignal,this.isAddingSignal),t.setAvailableNodes(this.availableNodes))}findOverlappingSignal(e,t){const s=L(e.start_bit,e.length,e.byte_order);for(const a of this.message.signals){if(t&&a.name===t||e.multiplexer_value!==null&&a.multiplexer_value!==null&&e.multiplexer_value!==a.multiplexer_value)continue;const n=L(a.start_bit,a.length,a.byte_order);if(s.start<=n.end&&n.start<=s.end)return a}return null}validateSignalAndSetError(e){if(!e||!this.editingSignal)return;const t=this.message.dlc*8,s=this.editingSignal,a=L(s.start_bit,s.length,s.byte_order);if(a.start<0||a.end>=t){e.setError(`Signal exceeds message bounds (0-${t-1} bits)`);return}const n=this.isAddingSignal?null:this.selectedSignal,r=this.findOverlappingSignal(s,n);if(r){e.setError(`Overlaps with "${r.name}"`);return}e.setError(null)}notifyChange(){this.dispatchEvent(new CustomEvent("message-change",{detail:this.message,bubbles:!0,composed:!0}))}}customElements.define("cv-message-editor",Ie);class Fe extends HTMLElement{nodes=[];constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render()}setNodes(e){this.nodes=[...e],this.render()}getNodes(){return this.nodes}render(){if(!this.shadowRoot)return;const e=this.nodes.map(t=>`
      <span class="cv-node-tag">
        ${t}
        <button class="cv-node-remove" data-node="${t}">&times;</button>
      </span>
    `).join("");this.shadowRoot.innerHTML=`
      <style>${E}
        :host { display: block; }
      </style>

      ${this.nodes.length===0?`
        <p class="cv-empty-message" style="text-align: left; padding: 0; margin-bottom: 12px; font-style: italic;">No nodes defined. Add ECU/node names below.</p>
      `:`
        <div class="cv-nodes-list">${e}</div>
      `}

      <div class="cv-add-node-form">
        <input type="text" class="cv-input" id="new-node-input" placeholder="Enter node name (e.g., ECM, TCM)">
        <button class="cv-btn primary" id="add-node-btn">Add Node</button>
      </div>
    `,this.setupEventListeners()}setupEventListeners(){if(!this.shadowRoot)return;this.shadowRoot.querySelectorAll(".cv-node-remove").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.node;n&&(this.nodes=this.nodes.filter(r=>r!==n),this.notifyChange(),this.render())})});const e=this.shadowRoot.getElementById("new-node-input"),t=this.shadowRoot.getElementById("add-node-btn"),s=()=>{const a=e.value.trim();if(a&&!this.nodes.includes(a)){if(!ke(a)){alert("Node name must start with a letter or underscore and contain only alphanumeric characters and underscores.");return}this.nodes.push(a),e.value="",this.notifyChange(),this.render()}else this.nodes.includes(a)&&alert(`Node "${a}" already exists.`)};t?.addEventListener("click",s),e?.addEventListener("keypress",a=>{a.key==="Enter"&&s()})}notifyChange(){this.dispatchEvent(g("nodes-change",{nodes:this.nodes}))}}customElements.define("cv-nodes-editor",Fe);class De extends HTMLElement{api=null;dbc=z();currentFile=null;isDirty=!1;selectedMessageId=null;selectedMessageExtended=!1;isAddingMessage=!1;activeTab="messages";isEditMode=!1;dbcBeforeEdit=null;frames=[];handleMdf4Loaded=e=>this.onMdf4Loaded(e);constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render(),m.on("mdf4:loaded",this.handleMdf4Loaded),this.emitStateChange()}disconnectedCallback(){m.off("mdf4:loaded",this.handleMdf4Loaded)}onMdf4Loaded(e){this.frames=e.frames}setApi(e){this.api=e,this.loadInitialState()}setFrames(e){this.frames=e}getDbc(){return this.dbc}hasUnsavedChanges(){return this.isDirty}emitStateChange(){ce({isDirty:this.isDirty,isEditing:this.isEditMode,currentFile:this.currentFile,messageCount:this.dbc.messages.length}),x.set({dbcFile:this.currentFile})}async loadFile(e){if(this.api)try{this.dbc=await this.api.loadDbc(e),this.currentFile=e,this.isDirty=!1,this.selectedMessageId=null,this.isAddingMessage=!1,this.render(),this.emitStateChange(),$({action:"loaded",dbcInfo:null,filename:e.split("/").pop()||null}),this.showToast("File loaded successfully","success")}catch(t){this.showToast(`Failed to load file: ${t}`,"error")}}async loadInitialState(){if(this.api)try{const e=await this.api.getDbc();e&&(this.dbc=e,this.currentFile=await this.api.getCurrentFile(),this.isDirty=await this.api.isDirty(),this.render(),this.emitStateChange())}catch{}}render(){this.shadowRoot&&(this.shadowRoot.innerHTML=`
      <style>${E}
        :host {
          display: block;
          position: relative;
          width: 100%;
          height: 100%;
        }
      </style>

      <div class="cv-editor-container">
        <div class="cv-editor-header">
          <div class="cv-tabs">
            <button class="cv-tab ${this.activeTab==="messages"?"active":""}" data-tab="messages">
              Messages (${this.dbc.messages.length})
            </button>
            <button class="cv-tab ${this.activeTab==="nodes"?"active":""}" data-tab="nodes">
              Nodes (${this.dbc.nodes.length})
            </button>
            <button class="cv-tab ${this.activeTab==="preview"?"active":""}" data-tab="preview">
              Preview
            </button>
          </div>
        </div>

        <div class="cv-editor-main">
          ${this.activeTab==="messages"?this.renderMessagesTab():""}
          ${this.activeTab==="nodes"?this.renderNodesTab():""}
          ${this.activeTab==="preview"?this.renderPreviewTab():""}
        </div>
      </div>
    `,this.setupEventListeners(),this.updateChildComponents())}renderMessagesTab(){const e=this.isAddingMessage?null:this.dbc.messages.find(t=>t.id===this.selectedMessageId&&t.is_extended===this.selectedMessageExtended);return`
      <div class="cv-grid responsive">
        <cv-messages-list class="cv-card" id="messagesList">
          <div class="cv-card-header">
            <span class="cv-card-title">Messages <span class="cv-tab-badge">${this.dbc.messages.length}</span></span>
            ${this.isEditMode?'<button class="cv-btn primary small" id="add-message-btn">+ Add</button>':""}
          </div>
        </cv-messages-list>

        <div class="cv-card" id="messageDetail">
          <div class="cv-card-header">
            <span class="cv-card-title">Message Details</span>
          </div>
          ${this.isAddingMessage||e?`
            <cv-message-editor data-edit-mode="${this.isEditMode}"></cv-message-editor>
          `:`
            <div class="cv-empty-state">
              <div class="cv-empty-state-title">No Message Selected</div>
              <p>Select a message from the list to ${this.isEditMode?'edit it, or click "Add" to create a new one':"view its details"}.</p>
            </div>
          `}
        </div>
      </div>
    `}renderNodesTab(){return`
      <div class="cv-grid" style="justify-content: center;">
        <div class="cv-card" style="max-width: 600px;">
          <div class="cv-card-header">
            <span class="cv-card-title">ECU/Node Names</span>
          </div>
          <div class="cv-card-body padded">
            <p class="cv-help-text">
              Define the ECU and node names used in this DBC file. These can be used as message senders and signal receivers.
            </p>
            <cv-nodes-editor></cv-nodes-editor>

            <div class="cv-form-group">
              <label class="cv-label">DBC Version</label>
              <input type="text" class="cv-input" style="max-width: 200px" id="dbc-version"
                     value="${this.dbc.version||""}"
                     placeholder="e.g., 1.0">
            </div>
          </div>
        </div>
      </div>
    `}renderPreviewTab(){const e=A(this.dbc);return`
      <div class="cv-grid">
        <div class="cv-card">
          <div class="cv-card-header">
            <span class="cv-card-title">DBC File Preview</span>
          </div>
          <div class="cv-preview-content">
            <pre class="cv-preview-text">${this.escapeHtml(e)}</pre>
          </div>
        </div>
      </div>
    `}escapeHtml(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}setupEventListeners(){if(!this.shadowRoot)return;this.shadowRoot.querySelectorAll(".cv-tab").forEach(n=>{n.addEventListener("click",()=>{this.activeTab=n.dataset.tab,this.render()})}),this.shadowRoot.getElementById("add-message-btn")?.addEventListener("click",()=>{this.isAddingMessage=!0,this.selectedMessageId=null,this.render()}),this.shadowRoot.querySelector("cv-messages-list")?.addEventListener("message-select",(n=>{this.selectedMessageId=n.detail.id,this.selectedMessageExtended=n.detail.isExtended,this.isAddingMessage=!1,this.render()}));const t=this.shadowRoot.querySelector("cv-message-editor");t?.addEventListener("message-edit-done",(()=>{this.handleSaveMessage()})),t?.addEventListener("message-delete-request",(()=>{this.handleDeleteMessage()})),t?.addEventListener("message-edit-cancel",(()=>{this.isAddingMessage=!1,this.selectedMessageId=null,this.render()})),t?.addEventListener("message-change",(n=>{const r=n,c=this.dbc.messages.findIndex(v=>v.id===this.selectedMessageId&&v.is_extended===this.selectedMessageExtended);c>=0&&(this.dbc.messages[c]=r.detail,this.isDirty=!0,this.syncToBackend(),this.emitStateChange())})),this.shadowRoot.querySelector("cv-nodes-editor")?.addEventListener("nodes-change",(n=>{const r=n;this.dbc.nodes=r.detail.nodes,this.isDirty=!0,this.syncToBackend(),this.emitStateChange(),this.render()}));const a=this.shadowRoot.getElementById("dbc-version");a?.addEventListener("input",async()=>{this.dbc.version=a.value||null,this.isDirty=!0,await this.syncToBackend(),this.emitStateChange()})}updateChildComponents(){if(!this.shadowRoot)return;const e=this.shadowRoot.querySelector("cv-messages-list");e&&(e.setMessages(this.dbc.messages),e.setSelected(this.selectedMessageId,this.selectedMessageExtended));const t=this.shadowRoot.querySelector("cv-message-editor");if(t){const a=this.isAddingMessage?T():this.dbc.messages.find(n=>n.id===this.selectedMessageId&&n.is_extended===this.selectedMessageExtended)||null;t.setMessage(a,this.isAddingMessage),t.setAvailableNodes(this.dbc.nodes),t.setFrames(this.frames)}const s=this.shadowRoot.querySelector("cv-nodes-editor");s&&s.setNodes(this.dbc.nodes)}setEditMode(e){e&&!this.isEditMode&&(this.dbcBeforeEdit=y(this.dbc)),this.isEditMode=e,e||(this.isAddingMessage=!1,this.dbcBeforeEdit=null),this.render(),this.emitStateChange()}cancelEdit(){this.dbcBeforeEdit&&(this.dbc=this.dbcBeforeEdit,this.dbcBeforeEdit=null,this.isDirty=!1,this.syncToBackend()),this.isEditMode=!1,this.isAddingMessage=!1,this.selectedMessageId=null,this.render(),this.emitStateChange()}getEditMode(){return this.isEditMode}getIsDirty(){return this.isDirty}getCurrentFile(){return this.currentFile}getMessageCount(){return this.dbc.messages.length}async handleNew(){if(!(this.isDirty&&!confirm("You have unsaved changes. Create a new file anyway?")))if(this.api)try{this.dbc=await this.api.newDbc(),this.currentFile=null,this.isDirty=!1,this.selectedMessageId=null,this.isAddingMessage=!1,this.render(),this.emitStateChange(),$({action:"new",dbcInfo:null,filename:null}),this.showToast("New DBC created","success")}catch(e){this.showToast(`Failed to create new DBC: ${e}`,"error")}else this.dbc=z(),this.currentFile=null,this.isDirty=!1,this.selectedMessageId=null,this.isAddingMessage=!1,this.render(),this.emitStateChange(),$({action:"new",dbcInfo:null,filename:null})}async handleOpen(){if(this.api&&!(this.isDirty&&!confirm("You have unsaved changes. Open a different file anyway?")))try{const e=await this.api.openFileDialog();e&&await this.loadFile(e)}catch(e){this.showToast(`Failed to open file: ${e}`,"error")}}async handleSave(){this.api&&(this.currentFile?await this.saveToPath(this.currentFile):await this.handleSaveAs())}async handleSaveAs(){if(this.api)try{const e=await this.api.saveFileDialog(this.currentFile||void 0);e&&await this.saveToPath(e)}catch(e){this.showToast(`Failed to save file: ${e}`,"error")}}async saveToPath(e){if(this.api)try{const t=A(this.dbc);await this.api.saveDbcContent(e,t),await this.api.loadDbc(e),this.currentFile=e,this.isDirty=!1,this.isEditMode=!1,this.isAddingMessage=!1,this.dbcBeforeEdit=null,this.render(),this.emitStateChange(),$({action:"updated",dbcInfo:null,filename:e.split("/").pop()||null}),this.showToast("File saved successfully","success")}catch(t){this.showToast(`Failed to save file: ${t}`,"error")}}async handleSaveMessage(){const e=this.shadowRoot?.querySelector("de-message-editor");if(!e)return;const t=e.getMessage();if(!t.name){this.showToast("Message name is required","error");return}if(this.isAddingMessage){if(this.dbc.messages.some(s=>s.id===t.id&&s.is_extended===t.is_extended)){this.showToast(`Message with ID ${t.id} already exists`,"error");return}this.dbc.messages.push(t),this.selectedMessageId=t.id,this.selectedMessageExtended=t.is_extended}else{const s=this.dbc.messages.findIndex(a=>a.id===this.selectedMessageId&&a.is_extended===this.selectedMessageExtended);if(s>=0){if((t.id!==this.selectedMessageId||t.is_extended!==this.selectedMessageExtended)&&this.dbc.messages.some(a=>a.id===t.id&&a.is_extended===t.is_extended)){this.showToast(`Message with ID ${t.id} already exists`,"error");return}this.dbc.messages[s]=t,this.selectedMessageId=t.id,this.selectedMessageExtended=t.is_extended}}this.isDirty=!0,this.isAddingMessage=!1,await this.syncToBackend(),this.render(),this.emitStateChange(),this.showToast("Message saved","success")}async handleDeleteMessage(){this.selectedMessageId!==null&&(this.dbc.messages=this.dbc.messages.filter(e=>!(e.id===this.selectedMessageId&&e.is_extended===this.selectedMessageExtended)),this.selectedMessageId=null,this.isDirty=!0,await this.syncToBackend(),this.render(),this.emitStateChange(),this.showToast("Message deleted","success"))}async syncToBackend(){if(this.api)try{await this.api.updateDbc(this.dbc)}catch(e){console.error("Failed to sync to backend:",e)}}showToast(e,t){const s=document.createElement("div");s.className=`cv-toast ${t}`,s.textContent=e,this.shadowRoot?.appendChild(s),setTimeout(()=>{s.remove()},3e3)}}customElements.define("cv-dbc-editor",De);const V={showDbcTab:!0,showLiveTab:!0,showMdf4Tab:!0,showAboutTab:!0,initialTab:"dbc",autoScroll:!0,maxFrames:1e4,maxSignals:1e4},H="can-viewer:active-tab";class Te extends HTMLElement{api=null;config;state;shadow;mdf4Inspector=null;liveViewer=null;dbcEditor=null;boundBeforeUnload=this.handleBeforeUnload.bind(this);constructor(){super(),this.config={...V};const e=localStorage.getItem(H);this.state={activeTab:e||this.config.initialTab,dbcLoaded:!1,dbcFilename:null},this.shadow=this.attachShadow({mode:"open"})}setApi(e){this.api=e,this.setupComponents(),this.loadInitialFiles()}setConfig(e){this.config={...V,...e},this.state.activeTab=this.config.initialTab,this.render()}connectedCallback(){this.render(),window.addEventListener("beforeunload",this.boundBeforeUnload)}disconnectedCallback(){window.removeEventListener("beforeunload",this.boundBeforeUnload)}handleBeforeUnload(e){this.dbcEditor?.getIsDirty()&&(e.preventDefault(),e.returnValue="You have unsaved DBC changes. Are you sure you want to leave?")}render(){this.shadow.innerHTML=`
      <style>${E}</style>
      ${this.generateTemplate()}
    `,this.cacheElements(),this.bindEvents(),this.switchTab(this.state.activeTab)}generateTemplate(){return`
      <div class="cv-app">
        <header class="cv-app-header">
          <div class="cv-header-row">
            <h1 class="cv-app-title">CAN Viewer</h1>
            <button class="cv-stat clickable" id="dbcStatusBtn">
              <span class="cv-stat-label">DBC</span>
              <span class="cv-stat-value muted" id="dbcStatusValue">No file loaded</span>
            </button>
          </div>
          <nav class="cv-tabs bordered">
            ${this.config.showDbcTab?'<button class="cv-tab" data-tab="dbc" title="View and manage DBC files">DBC</button>':""}
            ${this.config.showMdf4Tab?'<button class="cv-tab" data-tab="mdf4" title="Load MDF4 measurement files">MDF4</button>':""}
            ${this.config.showLiveTab?'<button class="cv-tab" data-tab="live" title="Capture from SocketCAN">Live</button>':""}
            ${this.config.showAboutTab?'<button class="cv-tab" data-tab="about" title="About CAN Viewer">About</button>':""}
          </nav>
          <cv-mdf4-toolbar></cv-mdf4-toolbar>
          <cv-live-toolbar></cv-live-toolbar>
          <cv-dbc-toolbar></cv-dbc-toolbar>
          <div id="aboutTab" class="cv-toolbar cv-tab-pane cv-about-header">
            <span class="cv-about-title">CAN Viewer</span>
            <span class="cv-about-version">v0.1.2</span>
            <span class="cv-about-desc">A desktop application for viewing and analyzing CAN bus data from MDF4 files and live SocketCAN interfaces.</span>
          </div>
        </header>
        <cv-mdf4-inspector class="cv-panel hidden" id="mdf4Panel"></cv-mdf4-inspector>
        <cv-live-viewer class="cv-panel hidden" id="livePanel"></cv-live-viewer>
        <cv-dbc-editor class="cv-panel hidden" id="dbcPanel"></cv-dbc-editor>
        ${this.generateAboutPanel()}
      </div>
    `}generateAboutPanel(){return`
      <section class="cv-panel hidden" id="aboutPanel">
        <nav class="cv-panel-header cv-tabs">
          <button class="cv-tab active" data-tab="features">Features</button>
          <button class="cv-tab" data-tab="acknowledgments">Acknowledgments</button>
        </nav>
        <div class="cv-tab-pane active" id="aboutFeatures">
          <div class="cv-grid responsive">
            <div class="cv-card"><div class="cv-card-header"><span class="cv-card-title">MDF4 File Support</span></div><p class="cv-card-body">Load and analyze CAN data from ASAM MDF4 measurement files with timestamps and decoded signals.</p></div>
            <div class="cv-card"><div class="cv-card-header"><span class="cv-card-title">Live SocketCAN Capture</span></div><p class="cv-card-body">Lossless capture from Linux SocketCAN with real-time MDF4 recording and live monitors.</p></div>
            <div class="cv-card"><div class="cv-card-header"><span class="cv-card-title">DBC Signal Decoding</span></div><p class="cv-card-body">Decode raw CAN frames into physical values. Supports CAN 2.0 and CAN FD with extended IDs.</p></div>
            <div class="cv-card"><div class="cv-card-header"><span class="cv-card-title">Built-in DBC Editor</span></div><p class="cv-card-body">Create and modify DBC files directly. Edit messages, signals, and their properties.</p></div>
            <div class="cv-card"><div class="cv-card-header"><span class="cv-card-title">Real-time Monitors</span></div><p class="cv-card-body">Message monitor shows latest data per CAN ID. Signal monitor groups decoded values by message.</p></div>
            <div class="cv-card"><div class="cv-card-header"><span class="cv-card-title">High Performance</span></div><p class="cv-card-body">Rust backend handles all processing. Pre-rendered updates minimize frontend overhead.</p></div>
          </div>
        </div>
        <div class="cv-tab-pane" id="aboutAcknowledgments">
          <div class="cv-grid responsive">
            <div class="cv-card"><div class="cv-card-header"><span class="cv-card-title">Standards</span></div><ul class="cv-card-body cv-deps-list"><li><a href="https://www.asam.net/standards/detail/mdf/" target="_blank">ASAM MDF4</a> – Measurement data format</li><li><a href="https://docs.kernel.org/networking/can.html" target="_blank">SocketCAN</a> – Linux CAN subsystem</li><li><a href="https://www.iso.org/standard/63648.html" target="_blank">ISO 11898</a> – CAN protocol spec</li></ul></div>
            <div class="cv-card"><div class="cv-card-header"><span class="cv-card-title">Rust Core</span></div><ul class="cv-card-body cv-deps-list"><li><a href="https://tauri.app" target="_blank">Tauri</a> – Desktop app framework</li><li class="cv-sister-project"><a href="https://crates.io/crates/mdf4-rs" target="_blank">mdf4-rs</a> – MDF4 parser/writer</li><li class="cv-sister-project"><a href="https://crates.io/crates/dbc-rs" target="_blank">dbc-rs</a> – DBC parser/decoder</li><li><a href="https://crates.io/crates/socketcan" target="_blank">socketcan</a> – CAN FD bindings</li></ul></div>
            <div class="cv-card"><div class="cv-card-header"><span class="cv-card-title">Rust Ecosystem</span></div><ul class="cv-card-body cv-deps-list"><li><a href="https://tokio.rs" target="_blank">Tokio</a> – Async runtime</li><li><a href="https://serde.rs" target="_blank">Serde</a> – Serialization</li><li><a href="https://clap.rs" target="_blank">Clap</a> – CLI parser</li></ul></div>
            <div class="cv-card"><div class="cv-card-header"><span class="cv-card-title">Frontend</span></div><ul class="cv-card-body cv-deps-list"><li><a href="https://vite.dev" target="_blank">Vite</a> – Build tool</li><li><a href="https://www.typescriptlang.org" target="_blank">TypeScript</a> – Typed JavaScript</li><li><a href="https://vitest.dev" target="_blank">Vitest</a> – Test framework</li></ul></div>
          </div>
          <p class="cv-about-license">MIT or Apache-2.0 • Rust + TypeScript</p>
        </div>
      </section>
    `}cacheElements(){this.mdf4Inspector=this.shadow.querySelector("cv-mdf4-inspector"),this.liveViewer=this.shadow.querySelector("cv-live-viewer"),this.dbcEditor=this.shadow.querySelector("cv-dbc-editor")}bindEvents(){this.shadow.querySelectorAll(".cv-tabs.bordered .cv-tab").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.tab;t&&this.switchTab(t)})}),this.shadow.querySelector("#dbcStatusBtn")?.addEventListener("click",()=>{this.switchTab("dbc")}),this.shadow.querySelector("cv-mdf4-toolbar")?.addEventListener("open",()=>this.mdf4Inspector?.promptLoadMdf4()),this.shadow.querySelector("cv-mdf4-toolbar")?.addEventListener("clear",()=>this.mdf4Inspector?.clearAllData()),this.shadow.querySelector("cv-live-toolbar")?.addEventListener("refresh-interfaces",()=>this.liveViewer?.loadInterfaces()),this.shadow.querySelector("cv-live-toolbar")?.addEventListener("start-capture",e=>{const t=e.detail.interface;this.liveViewer?.startCapture(t)}),this.shadow.querySelector("cv-live-toolbar")?.addEventListener("stop-capture",()=>this.liveViewer?.stopCapture()),this.shadow.querySelector("cv-live-toolbar")?.addEventListener("clear",()=>this.liveViewer?.clearAllData()),this.shadow.querySelector("cv-dbc-toolbar")?.addEventListener("new",()=>this.dbcEditor?.handleNew()),this.shadow.querySelector("cv-dbc-toolbar")?.addEventListener("open",()=>this.dbcEditor?.handleOpen()),this.shadow.querySelector("cv-dbc-toolbar")?.addEventListener("edit",()=>this.dbcEditor?.setEditMode(!0)),this.shadow.querySelector("cv-dbc-toolbar")?.addEventListener("cancel",()=>this.dbcEditor?.cancelEdit()),this.shadow.querySelector("cv-dbc-toolbar")?.addEventListener("save",()=>this.dbcEditor?.handleSave()),this.shadow.querySelector("cv-dbc-toolbar")?.addEventListener("save-as",()=>this.dbcEditor?.handleSaveAs()),this.shadow.querySelector("#aboutPanel")?.querySelectorAll(".cv-tab").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.tab;t&&(this.shadow.querySelector("#aboutPanel")?.querySelectorAll(".cv-tab").forEach(s=>s.classList.toggle("active",s.dataset.tab===t)),this.shadow.querySelector("#aboutPanel")?.querySelectorAll(".cv-tab-pane").forEach(s=>s.classList.toggle("active",s.id===`about${t.charAt(0).toUpperCase()+t.slice(1)}`)))})}),this.shadow.addEventListener("click",e=>{const s=e.target.closest("a[href]");s?.href&&s.target==="_blank"&&(e.preventDefault(),this.openExternalUrl(s.href))})}setupComponents(){this.api&&(this.mdf4Inspector&&this.mdf4Inspector.setApi(this.createMdf4Api()),this.liveViewer&&this.liveViewer.setApi(this.createLiveApi()),this.dbcEditor&&this.dbcEditor.setApi(this.createDbcEditorApi()))}createMdf4Api(){const e=this.api;return{loadMdf4:t=>e.loadMdf4(t),decodeFrames:t=>e.decodeFrames(t),openFileDialog:t=>e.openFileDialog(t),getDbcInfo:()=>e.getDbcInfo()}}createLiveApi(){const e=this.api;return{listCanInterfaces:()=>e.listCanInterfaces(),startCapture:(t,s,a)=>e.startCapture(t,s,a),stopCapture:()=>e.stopCapture(),saveFileDialog:(t,s)=>e.saveFileDialog(t,s),getDbcInfo:()=>e.getDbcInfo(),onLiveCaptureUpdate:t=>e.onLiveCaptureUpdate(t),onCaptureFinalized:t=>e.onCaptureFinalized(t),onCaptureError:t=>e.onCaptureError(t)}}createDbcEditorApi(){const e=this.api,t=s=>({id:s.id,is_extended:!1,name:s.name,dlc:s.dlc,sender:s.sender||"Vector__XXX",signals:s.signals.map(a=>({name:a.name,start_bit:a.start_bit,length:a.length,byte_order:a.byte_order==="big_endian"?"big_endian":"little_endian",is_unsigned:!a.is_signed,factor:a.factor,offset:a.offset,min:a.min,max:a.max,unit:a.unit||null,receivers:{type:"none"},is_multiplexer:!1,multiplexer_value:null}))});return{loadDbc:async s=>{await e.loadDbc(s);const a=await e.getDbcInfo();if(!a)throw new Error("Failed to load DBC");return this.state.dbcLoaded=!0,this.state.dbcFilename=S(s),this.updateDbcStatusUI(),this.emitDbcChange("loaded",a),{version:null,nodes:[],messages:a.messages.map(t)}},saveDbcContent:async(s,a)=>{await e.saveDbcContent(s,a),this.state.dbcFilename=S(s),this.updateDbcStatusUI();const n=await e.getDbcInfo();this.emitDbcChange("updated",n)},newDbc:async()=>(await e.clearDbc(),this.state.dbcLoaded=!1,this.state.dbcFilename=null,this.updateDbcStatusUI(),this.emitDbcChange("new",null),{version:null,nodes:[],messages:[]}),getDbc:async()=>{try{const s=await e.getDbcInfo();return s?{version:null,nodes:[],messages:s.messages.map(t)}:null}catch{return null}},updateDbc:async s=>{const a=A(s);await e.updateDbcContent(a),this.state.dbcLoaded=!0;const n=await e.getDbcInfo();this.emitDbcChange("updated",n)},getCurrentFile:async()=>e.getDbcPath(),isDirty:async()=>!1,openFileDialog:async()=>e.openFileDialog([{name:"DBC Files",extensions:["dbc"]}]),saveFileDialog:async()=>e.saveFileDialog([{name:"DBC Files",extensions:["dbc"]}],"untitled.dbc")}}emitDbcChange(e,t){$({action:e,dbcInfo:t,filename:this.state.dbcFilename})}switchTab(e){if(this.state.activeTab==="dbc"&&e!=="dbc"&&this.dbcEditor?.hasUnsavedChanges()&&!confirm("You have unsaved changes in the DBC editor. Leave anyway?"))return;this.state.activeTab=e,localStorage.setItem(H,e),this.shadow.querySelectorAll(".cv-tabs.bordered .cv-tab").forEach(r=>{r.classList.toggle("active",r.dataset.tab===e)}),this.shadow.querySelectorAll(".cv-app-header > .cv-tab-pane").forEach(r=>{r.classList.toggle("active",r.id===`${e}Tab`)});const t=this.shadow.querySelector("#mdf4Panel"),s=this.shadow.querySelector("#livePanel"),a=this.shadow.querySelector("#dbcPanel"),n=this.shadow.querySelector("#aboutPanel");t?.classList.toggle("hidden",e!=="mdf4"),s?.classList.toggle("hidden",e!=="live"),a?.classList.toggle("hidden",e!=="dbc"),n?.classList.toggle("hidden",e!=="about")}updateDbcStatusUI(){const e=this.shadow.querySelector("#dbcStatusBtn"),t=this.shadow.querySelector("#dbcStatusValue");e?.classList.toggle("success",this.state.dbcLoaded),t&&(t.textContent=this.state.dbcFilename||"No file loaded")}async loadInitialFiles(){if(this.api)try{const e=await this.api.getInitialFiles();e.dbc_path&&this.dbcEditor&&(await this.dbcEditor.loadFile(e.dbc_path),this.switchTab("mdf4")),e.mdf4_path&&this.mdf4Inspector&&(await this.mdf4Inspector.loadFile(e.mdf4_path),this.switchTab("mdf4"))}catch(e){console.error("Failed to load initial files:",e)}}async openExternalUrl(e){try{const{open:t}=await se(async()=>{const{open:s}=await import("./chunk-Dhbb3tL-.js");return{open:s}},[]);await t(e)}catch{window.open(e,"_blank")}}}customElements.define("can-viewer",Te);async function O(){const i=new Q;await i.init();const e=document.querySelector("can-viewer");e&&e.setApi(i)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",O):O();export{j as i};
