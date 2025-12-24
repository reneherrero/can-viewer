/**
 * Shared CSS styles for DBC Editor components.
 */

export const CSS_VARS = `
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
`;

export const BUTTON_STYLES = `
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
`;

export const INPUT_STYLES = `
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
`;

export const FORM_STYLES = `
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
`;

export const SECTION_STYLES = `
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
`;

export const TABLE_STYLES = `
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
`;

export const LIST_STYLES = `
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
`;

export const EMPTY_STATE_STYLES = `
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
`;

export const FIELD_VIEW_STYLES = `
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
`;

export const TOAST_STYLES = `
  .de-toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    background: var(--de-bg-tertiary);
    border: 1px solid var(--de-border);
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    animation: slideIn 0.2s ease;
  }
  .de-toast.success { border-color: var(--de-success); }
  .de-toast.error { border-color: var(--de-danger); }
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;

export const MESSAGE_HEADER_STYLES = `
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
`;

export const BIT_LAYOUT_STYLES = `
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
`;

export const SIGNALS_LAYOUT_STYLES = `
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
`;

/**
 * Get base styles with CSS variables.
 */
export function getBaseStyles(): string {
  return `:host { display: block; ${CSS_VARS} }`;
}

/**
 * Combine multiple style blocks.
 */
export function combineStyles(...styles: string[]): string {
  return styles.join('\n');
}
